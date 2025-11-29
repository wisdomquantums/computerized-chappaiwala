import { Op } from 'sequelize'
import Order, { ORDER_CHANNEL_OPTIONS, ORDER_PRIORITY_OPTIONS, ORDER_STATUS_OPTIONS } from '../models/Order.js'
import { User } from '../models/index.js'
import { isRoleOrHigher } from '../utils/rbac.js'

const baseOrderInclude = [
    {
        model: User,
        attributes: ['id', 'name', 'email', 'mobileNumber', 'company', 'role'],
    },
]

const sanitizeText = (value) => {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed || null
}

const sanitizeEmail = (value) => {
    const text = sanitizeText(value)
    if (!text) return null
    const lower = text.toLowerCase()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)
    return isEmail ? lower : null
}

const normalizeNumber = (value) => {
    if (value === null || value === undefined || value === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
}

const normalizeInteger = (value, fallback = 1) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) {
        return fallback
    }
    const normalized = Math.round(parsed)
    return normalized > 0 ? normalized : fallback
}

const normalizeEnum = (value, allowed, fallback) => {
    if (!Array.isArray(allowed) || !allowed.length) {
        return fallback
    }
    if (typeof value === 'string') {
        const match = allowed.find((option) => option.toLowerCase() === value.toLowerCase())
        if (match) {
            return match
        }
    }
    return fallback
}

const normalizeDateOnly = (value) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return null
    }
    return date.toISOString().slice(0, 10)
}

const normalizeChannel = (value) => {
    const text = sanitizeText(value)
    if (!text) return null
    const match = ORDER_CHANNEL_OPTIONS.find((option) => option.toLowerCase() === text.toLowerCase())
    return match || text
}

const normalizeTags = (value) => {
    if (Array.isArray(value)) {
        return Array.from(new Set(value
            .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
            .filter(Boolean))).slice(0, 8)
    }
    if (typeof value === 'string') {
        return Array.from(new Set(value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean))).slice(0, 8)
    }
    return []
}

const formatOrderResponse = (orderInstance) => {
    if (!orderInstance) return null
    const plain = orderInstance.toJSON()
    plain.tags = Array.isArray(plain.tags) ? plain.tags : []
    plain.channel = plain.channel || ORDER_CHANNEL_OPTIONS[0]
    if (plain.User) {
        plain.customer = {
            id: plain.User.id,
            name: plain.User.name,
            email: plain.User.email,
            mobileNumber: plain.User.mobileNumber,
            company: plain.User.company,
            role: plain.User.role,
        }
        delete plain.User
    }
    return plain
}

const buildOrderPayload = (body = {}, options = {}) => {
    const payload = {
        projectName: sanitizeText(body.projectName),
        clientName: sanitizeText(body.clientName),
        clientEmail: sanitizeEmail(body.clientEmail),
        clientPhone: sanitizeText(body.clientPhone),
        company: sanitizeText(body.company),
        serviceLine: sanitizeText(body.serviceLine),
        channel: normalizeChannel(body.channel),
        assignedTo: sanitizeText(body.assignedTo),
        status: normalizeEnum(body.status, ORDER_STATUS_OPTIONS, ORDER_STATUS_OPTIONS[0]),
        priority: normalizeEnum(body.priority, ORDER_PRIORITY_OPTIONS, ORDER_PRIORITY_OPTIONS[1]),
        dueDate: normalizeDateOnly(body.dueDate),
        budget: normalizeNumber(body.budget),
        description: sanitizeText(body.description),
        internalNotes: sanitizeText(body.internalNotes),
        quantity: normalizeInteger(body.quantity, 1),
        tags: normalizeTags(body.tags),
    }

    payload.channel = payload.channel || options.defaultChannel || ORDER_CHANNEL_OPTIONS[0]

    payload.clientName = payload.clientName || options.fallbackClient?.name || null
    payload.clientEmail = payload.clientEmail || options.fallbackClient?.email || null
    payload.clientPhone = payload.clientPhone || options.fallbackClient?.phone || null
    payload.company = payload.company || options.fallbackClient?.company || null

    if (!options.allowManagedFields) {
        payload.status = ORDER_STATUS_OPTIONS[0]
        payload.priority = ORDER_PRIORITY_OPTIONS[1]
        payload.assignedTo = null
        payload.internalNotes = null
        payload.tags = []
        payload.dueDate = null
    }

    if (!payload.projectName) {
        throw new Error('Project name is required to log an order.')
    }

    if (!payload.clientName) {
        throw new Error('Client name is required to log an order.')
    }

    return payload
}

export const listOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: baseOrderInclude,
            order: [['createdAt', 'DESC']],
        })
        res.json({ orders: orders.map((order) => formatOrderResponse(order)) })
    } catch (error) {
        next(error)
    }
}

export const listCustomerOrders = async (req, res, next) => {
    try {
        const userId = req.user?.id || null
        const customerEmail = req.user?.email || null
        const customerPhone = req.user?.mobileNumber || null

        const whereClause = {
            [Op.or]: [
                userId ? { userId } : null,
                customerEmail ? { clientEmail: customerEmail } : null,
                customerPhone ? { clientPhone: customerPhone } : null,
            ].filter(Boolean),
        }

        if (!whereClause[Op.or]?.length) {
            return res.json({ orders: [] })
        }

        const orders = await Order.findAll({
            where: whereClause,
            include: baseOrderInclude,
            order: [['createdAt', 'DESC']],
        })

        res.json({ orders: orders.map((order) => formatOrderResponse(order)) })
    } catch (error) {
        next(error)
    }
}

export const createOrder = async (req, res, next) => {
    const fallbackClient = {
        name: req.user?.name,
        email: req.user?.email,
        phone: req.user?.mobileNumber,
        company: req.user?.company,
    }
    const canManageOrders = req.user?.role === 'admin' || req.userPermissions?.has('manage_orders')
    const isStaffUser = isRoleOrHigher(req.user?.role, 'employee')

    try {
        const payload = buildOrderPayload(req.body, {
            allowManagedFields: Boolean(canManageOrders),
            fallbackClient,
            defaultChannel: isStaffUser ? 'Backoffice' : ORDER_CHANNEL_OPTIONS[0],
        })

        payload.userId = req.user?.id || null

        const order = await Order.create(payload)
        const hydrated = await Order.findByPk(order.id, { include: baseOrderInclude })
        res.status(201).json({ order: formatOrderResponse(hydrated) })
    } catch (error) {
        if (error.message?.includes('required')) {
            return res.status(400).json({ message: error.message })
        }
        return next(error)
    }
}

export const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const existing = await Order.findByPk(id)
        if (!existing) {
            return res.status(404).json({ message: 'Order not found' })
        }

        const payload = buildOrderPayload(req.body, {
            allowManagedFields: true,
            fallbackClient: {
                name: existing.clientName,
                email: existing.clientEmail,
                phone: existing.clientPhone,
                company: existing.company,
            },
            defaultChannel: existing.channel || ORDER_CHANNEL_OPTIONS[0],
        })

        await existing.update(payload)
        const refreshed = await Order.findByPk(existing.id, { include: baseOrderInclude })
        return res.json({ order: formatOrderResponse(refreshed) })
    } catch (error) {
        if (error.message?.includes('required')) {
            return res.status(400).json({ message: error.message })
        }
        return next(error)
    }
}

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const normalizedStatus = normalizeEnum(status, ORDER_STATUS_OPTIONS, null)
        if (!normalizedStatus) {
            return res.status(400).json({ message: 'Invalid order status.' })
        }
        const order = await Order.findByPk(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        await order.update({ status: normalizedStatus })
        const refreshed = await Order.findByPk(order.id, { include: baseOrderInclude })
        return res.json({ order: formatOrderResponse(refreshed) })
    } catch (error) {
        return next(error)
    }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const order = await Order.findByPk(id)
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        await order.destroy()
        return res.status(204).send()
    } catch (error) {
        return next(error)
    }
}
