import jwt from 'jsonwebtoken'
import { Permission, RolePermission, User } from '../models/index.js'
import { isRoleOrHigher } from '../utils/rbac.js'

const fetchRolePermissions = async (roleName) => {
    if (!roleName) {
        return []
    }

    try {
        const assignments = await RolePermission.findAll({
            where: { roleName },
            include: [
                {
                    model: Permission,
                    attributes: ['key'],
                },
            ],
        })

        return assignments
            .map((assignment) => assignment.Permission?.key || assignment.permissionKey)
            .filter(Boolean)
    } catch (error) {
        console.error('[auth] Failed to resolve permissions for role', roleName, error) // eslint-disable-line no-console
        return []
    }
}

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.id)

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' })
        }

        req.user = user
        const permissions = await fetchRolePermissions(user.role)
        req.userPermissions = new Set(permissions)
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

const STAFF_MIN_ROLE = 'employee'

export const authorizeAdmin = (req, res, next) => {
    if (!req.user?.role || !isRoleOrHigher(req.user.role, STAFF_MIN_ROLE)) {
        return res.status(403).json({ message: 'Employee access required' })
    }
    return next()
}

export const requirePermission = (...permissions) => (req, res, next) => {
    if (!permissions.length) {
        return next()
    }

    // Admins get implicit access to guarded routes.
    if (req.user?.role === 'admin') {
        return next()
    }

    const assigned = req.userPermissions || new Set()
    const hasAll = permissions.every((permission) => assigned.has(permission))

    if (!hasAll) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' })
    }

    return next()
}
