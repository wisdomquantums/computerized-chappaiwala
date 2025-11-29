import { Op } from 'sequelize'
import Ticket, {
    TICKET_CATEGORY_OPTIONS,
    TICKET_PRIORITY_OPTIONS,
    TICKET_STATUS_OPTIONS,
} from '../models/Ticket.js'
import { Order, User } from '../models/index.js'
import { isRoleOrHigher } from '../utils/rbac.js'

const baseTicketInclude = [
    {
        model: User,
        as: 'requester',
        attributes: ['id', 'name', 'email', 'mobileNumber', 'company', 'role'],
    },
    {
        model: Order,
        as: 'order',
        attributes: ['id', 'projectName', 'status', 'priority'],
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

const sanitizeUuid = (value) => {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    if (!trimmed) return null
    const uuidRegex = /^[0-9a-fA-F-]{32,36}$/
    return uuidRegex.test(trimmed) ? trimmed : null
}

const isStaffUser = (user) => isRoleOrHigher(user?.role, 'employee')

const buildTicketPayload = (body = {}, options = {}) => {
    const payload = {
        subject: sanitizeText(body.subject),
        description: sanitizeText(body.description),
        category: normalizeEnum(body.category, TICKET_CATEGORY_OPTIONS, TICKET_CATEGORY_OPTIONS[0]),
        priority: normalizeEnum(body.priority, TICKET_PRIORITY_OPTIONS, TICKET_PRIORITY_OPTIONS[1]),
        status: TICKET_STATUS_OPTIONS[0],
        channel: options.allowManagedFields ? sanitizeText(body.channel) || 'portal' : 'portal',
        orderId: sanitizeUuid(body.orderId),
        attachments: Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : [],
        metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : null,
        contactName: sanitizeText(body.contactName) || options.fallbackContact?.name || null,
        contactEmail: sanitizeEmail(body.contactEmail) || options.fallbackContact?.email || null,
        contactPhone: sanitizeText(body.contactPhone) || options.fallbackContact?.phone || null,
        resolutionNotes: null,
    }

    if (options.allowManagedFields) {
        payload.status = normalizeEnum(body.status, TICKET_STATUS_OPTIONS, payload.status)
        payload.resolutionNotes = sanitizeText(body.resolutionNotes)
    }

    if (!payload.subject) {
        throw Object.assign(new Error('Ticket subject is required.'), { statusCode: 400 })
    }

    if (!payload.description) {
        throw Object.assign(new Error('Please describe the issue in a few words.'), { statusCode: 400 })
    }

    return payload
}

const formatTicketResponse = (ticketInstance) => {
    if (!ticketInstance) return null
    const plain = ticketInstance.toJSON()
    if (plain.attachments && !Array.isArray(plain.attachments)) {
        plain.attachments = []
    }
    if (plain.requester) {
        plain.customer = plain.requester
        delete plain.requester
    }
    return plain
}

const assertOrderAccess = async (orderId, user, allowBypass = false) => {
    if (!orderId) return null
    const order = await Order.findByPk(orderId)
    if (!order) {
        throw Object.assign(new Error('Order referenced in ticket was not found.'), { statusCode: 404 })
    }

    if (allowBypass) {
        return order
    }

    const matchesUser =
        order.userId === user?.id ||
        (!!user?.email && order.clientEmail?.toLowerCase() === user.email.toLowerCase()) ||
        (!!user?.mobileNumber && order.clientPhone === user.mobileNumber)

    if (!matchesUser) {
        throw Object.assign(new Error('You cannot raise a ticket for this order.'), { statusCode: 403 })
    }

    return order
}

export const createTicket = async (req, res, next) => {
    const fallbackContact = {
        name: req.user?.name,
        email: req.user?.email,
        phone: req.user?.mobileNumber,
    }
    const staffUser = isStaffUser(req.user)
    try {
        const payload = buildTicketPayload(req.body, {
            allowManagedFields: staffUser,
            fallbackContact,
        })

        const requestedUserId = staffUser ? sanitizeUuid(req.body.userId) : null
        payload.userId = requestedUserId || req.user?.id || null

        if (payload.orderId) {
            await assertOrderAccess(payload.orderId, req.user, staffUser)
        }

        const ticket = await Ticket.create(payload)
        const hydrated = await Ticket.findByPk(ticket.id, { include: baseTicketInclude })
        return res.status(201).json({ ticket: formatTicketResponse(hydrated) })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return next(error)
    }
}

export const listCustomerTickets = async (req, res, next) => {
    try {
        const whereClause = {
            [Op.or]: [
                { userId: req.user?.id },
                req.user?.email ? { contactEmail: req.user.email } : null,
                req.user?.mobileNumber ? { contactPhone: req.user.mobileNumber } : null,
            ].filter(Boolean),
        }

        if (!whereClause[Op.or]?.length) {
            return res.json({ tickets: [] })
        }

        const tickets = await Ticket.findAll({
            where: whereClause,
            include: baseTicketInclude,
            order: [['createdAt', 'DESC']],
        })
        return res.json({ tickets: tickets.map((ticket) => formatTicketResponse(ticket)) })
    } catch (error) {
        return next(error)
    }
}

export const listTickets = async (req, res, next) => {
    try {
        const { status, priority, orderId } = req.query || {}
        const whereClause = {}
        if (status) {
            const normalized = normalizeEnum(status, TICKET_STATUS_OPTIONS, null)
            if (normalized) {
                whereClause.status = normalized
            }
        }
        if (priority) {
            const normalizedPriority = normalizeEnum(priority, TICKET_PRIORITY_OPTIONS, null)
            if (normalizedPriority) {
                whereClause.priority = normalizedPriority
            }
        }
        if (orderId) {
            const sanitizedOrder = sanitizeUuid(orderId)
            if (sanitizedOrder) {
                whereClause.orderId = sanitizedOrder
            }
        }

        const tickets = await Ticket.findAll({
            where: whereClause,
            include: baseTicketInclude,
            order: [['createdAt', 'DESC']],
        })
        return res.json({ tickets: tickets.map((ticket) => formatTicketResponse(ticket)) })
    } catch (error) {
        return next(error)
    }
}

export const getTicketById = async (req, res, next) => {
    try {
        const { id } = req.params
        const ticket = await Ticket.findByPk(id, { include: baseTicketInclude })
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' })
        }

        const staffUser = isStaffUser(req.user)
        if (!staffUser) {
            const belongsToUser =
                ticket.userId === req.user?.id ||
                (!!ticket.contactEmail && ticket.contactEmail === req.user?.email) ||
                (!!ticket.contactPhone && ticket.contactPhone === req.user?.mobileNumber)
            if (!belongsToUser) {
                return res.status(403).json({ message: 'You cannot view this ticket.' })
            }
        }

        return res.json({ ticket: formatTicketResponse(ticket) })
    } catch (error) {
        return next(error)
    }
}

export const updateTicket = async (req, res, next) => {
    try {
        const { id } = req.params
        const ticket = await Ticket.findByPk(id)
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' })
        }

        const payload = buildTicketPayload(
            {
                ...ticket.toJSON(),
                ...req.body,
            },
            {
                allowManagedFields: true,
                fallbackContact: {
                    name: ticket.contactName,
                    email: ticket.contactEmail,
                    phone: ticket.contactPhone,
                },
            },
        )

        payload.userId = sanitizeUuid(req.body.userId) || ticket.userId
        payload.orderId = sanitizeUuid(req.body.orderId) || ticket.orderId

        if (payload.orderId) {
            await assertOrderAccess(payload.orderId, req.user, true)
        }

        await ticket.update(payload)
        const refreshed = await Ticket.findByPk(ticket.id, { include: baseTicketInclude })
        return res.json({ ticket: formatTicketResponse(refreshed) })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return next(error)
    }
}

export const patchTicketStatus = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const normalizedStatus = normalizeEnum(status, TICKET_STATUS_OPTIONS, null)
        if (!normalizedStatus) {
            return res.status(400).json({ message: 'Invalid ticket status.' })
        }
        const ticket = await Ticket.findByPk(id)
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' })
        }
        await ticket.update({ status: normalizedStatus })
        const refreshed = await Ticket.findByPk(ticket.id, { include: baseTicketInclude })
        return res.json({ ticket: formatTicketResponse(refreshed) })
    } catch (error) {
        return next(error)
    }
}

export const deleteTicket = async (req, res, next) => {
    try {
        const { id } = req.params
        const ticket = await Ticket.findByPk(id)
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' })
        }
        await ticket.destroy()
        return res.status(204).send()
    } catch (error) {
        return next(error)
    }
}
