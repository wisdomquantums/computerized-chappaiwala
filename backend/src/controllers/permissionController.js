import { Permission } from '../models/index.js'

const normalizePermissionKey = (value = '') => value.trim().toLowerCase().replace(/\s+/g, '_')

export const listPermissions = async (req, res, next) => {
    try {
        const permissions = await Permission.findAll({ order: [['createdAt', 'ASC']] })
        res.json({ permissions })
    } catch (error) {
        next(error)
    }
}

export const createPermission = async (req, res, next) => {
    try {
        const { key, label, description } = req.body
        const normalizedKey = normalizePermissionKey(key)

        if (!normalizedKey || !label) {
            return res.status(400).json({ message: 'Key and label are required' })
        }

        const existing = await Permission.findOne({ where: { key: normalizedKey } })
        if (existing) {
            return res.status(409).json({ message: 'Permission already exists' })
        }

        const permission = await Permission.create({ key: normalizedKey, label, description })
        res.status(201).json({ permission })
    } catch (error) {
        next(error)
    }
}
