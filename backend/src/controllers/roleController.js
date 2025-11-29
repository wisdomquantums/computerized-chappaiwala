import { Permission, Role, RolePermission, User } from '../models/index.js'

const normalizeRoleName = (value = '') => value.trim().toLowerCase().replace(/\s+/g, '_')
const normalizePermissionKeys = (keys = []) => [...new Set(keys.map((key) => key.trim().toLowerCase()))]

const permissionInclude = [
    {
        model: RolePermission,
        as: 'permissionLinks',
        attributes: ['id', 'permissionKey'],
        include: [
            {
                model: Permission,
                attributes: ['key', 'label', 'description'],
            },
        ],
    },
]

const serializeRole = (role) => ({
    id: role.id,
    name: role.name,
    label: role.label,
    description: role.description,
    status: role.status,
    permissions:
        role.permissionLinks?.map((link) => ({
            key: link.Permission?.key || link.permissionKey,
            label: link.Permission?.label,
            description: link.Permission?.description,
        })) || [],
})

const validatePermissions = async (permissionKeys = []) => {
    if (!permissionKeys.length) {
        return { valid: true, keys: [] }
    }

    const normalized = normalizePermissionKeys(permissionKeys)
    const records = await Permission.findAll({ where: { key: normalized } })
    const found = new Set(records.map((record) => record.key))
    const missing = normalized.filter((key) => !found.has(key))

    if (missing.length) {
        return { valid: false, missing }
    }

    return { valid: true, keys: normalized }
}

const assignPermissions = async (roleName, permissionKeys = []) => {
    await RolePermission.destroy({ where: { roleName } })

    if (!permissionKeys.length) {
        return
    }

    const rows = permissionKeys.map((permissionKey) => ({ roleName, permissionKey }))
    await RolePermission.bulkCreate(rows, { ignoreDuplicates: true })
}

const loadRole = async (roleName) => Role.findOne({ where: { name: roleName }, include: permissionInclude })

export const listRoles = async (req, res, next) => {
    try {
        const roles = await Role.findAll({
            include: permissionInclude,
            order: [['createdAt', 'ASC']],
        })
        res.json({ roles: roles.map(serializeRole) })
    } catch (error) {
        next(error)
    }
}

export const getRole = async (req, res, next) => {
    try {
        const normalizedName = normalizeRoleName(req.params.roleName || '')
        const role = await loadRole(normalizedName)
        if (!role) {
            return res.status(404).json({ message: 'Role not found' })
        }
        res.json({ role: serializeRole(role) })
    } catch (error) {
        next(error)
    }
}

export const createRole = async (req, res, next) => {
    try {
        const { name, label, description, permissions = [] } = req.body
        const normalizedName = normalizeRoleName(name)

        if (!normalizedName || !label) {
            return res.status(400).json({ message: 'Name and label are required' })
        }

        const existing = await Role.findOne({ where: { name: normalizedName } })
        if (existing) {
            return res.status(409).json({ message: 'Role already exists' })
        }

        const permissionResult = await validatePermissions(permissions)
        if (!permissionResult.valid) {
            return res.status(400).json({ message: `Unknown permissions: ${permissionResult.missing.join(', ')}` })
        }

        const role = await Role.create({ name: normalizedName, label, description })
        await assignPermissions(role.name, permissionResult.keys)
        const hydrated = await loadRole(role.name)
        res.status(201).json({ role: serializeRole(hydrated) })
    } catch (error) {
        next(error)
    }
}

export const updateRole = async (req, res, next) => {
    try {
        const normalizedName = normalizeRoleName(req.params.roleName || '')
        const role = await Role.findOne({ where: { name: normalizedName } })
        if (!role) {
            return res.status(404).json({ message: 'Role not found' })
        }

        const { label, description, status } = req.body
        if (label) role.label = label
        if (description !== undefined) role.description = description
        if (status) {
            if (!['active', 'inactive'].includes(status)) {
                return res.status(400).json({ message: 'Status must be active or inactive' })
            }
            role.status = status
        }

        await role.save()
        const hydrated = await loadRole(role.name)
        res.json({ role: serializeRole(hydrated) })
    } catch (error) {
        next(error)
    }
}

export const updateRolePermissions = async (req, res, next) => {
    try {
        const normalizedName = normalizeRoleName(req.params.roleName || '')
        const role = await Role.findOne({ where: { name: normalizedName } })
        if (!role) {
            return res.status(404).json({ message: 'Role not found' })
        }

        const permissions = Array.isArray(req.body.permissions) ? req.body.permissions : []
        const permissionResult = await validatePermissions(permissions)
        if (!permissionResult.valid) {
            return res.status(400).json({ message: `Unknown permissions: ${permissionResult.missing.join(', ')}` })
        }

        await assignPermissions(role.name, permissionResult.keys)
        const hydrated = await loadRole(role.name)
        res.json({ role: serializeRole(hydrated) })
    } catch (error) {
        next(error)
    }
}

export const deleteRole = async (req, res, next) => {
    try {
        const normalizedName = normalizeRoleName(req.params.roleName || '')
        const role = await Role.findOne({ where: { name: normalizedName } })
        if (!role) {
            return res.status(404).json({ message: 'Role not found' })
        }

        const assignedUsers = await User.count({ where: { role: role.name } })
        if (assignedUsers > 0) {
            return res.status(409).json({ message: 'Role has assigned users. Reassign them before deleting this role.' })
        }

        await RolePermission.destroy({ where: { roleName: role.name } })
        await role.destroy()
        res.json({ message: 'Role deleted' })
    } catch (error) {
        next(error)
    }
}
