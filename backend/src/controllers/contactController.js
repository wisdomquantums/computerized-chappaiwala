import { ContactCard, ContactPageContent } from '../models/index.js'

const ALLOWED_ICON_KEYS = new Set(['location', 'phone', 'whatsapp', 'email'])
const ALLOWED_ACTION_TYPES = new Set(['link', 'tel', 'mailto', 'whatsapp'])

const defaultPageContent = {
    heroEyebrow: 'Contact Us',
    heroTitle: 'We’re here to help you with your printing needs',
    heroDescription:
        'Reach out for wedding cards, commercial stationery, bulk flex printing, or any custom requirement.',
    messageTitle: 'Send us a message',
    messageDescription: 'Share project details, delivery timelines, or upload requirements.',
    mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57082.52256518845!2d85.47341119530944!3d26.595358656832904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ecf1ccd55e26b5%3A0xf26bcff995fd35cf!2sComputerized%20Chhapaiwala!5e0!3m2!1sen!2sin!4v1764356743220!5m2!1sen!2sin',
    openingEyebrow: 'Opening Hours',
    openingTitle: 'Mon–Sun: 9:00 AM – 9:00 PM',
    openingDescription: 'No holiday. Drop in anytime with your brief or call ahead.',
    ctaEyebrow: 'Need fast and reliable printing?',
    ctaTitle: 'Need fast and reliable printing? Contact us today!',
    ctaDescription:
        'Wedding suites, corporate stationery, flex banners, and more—crafted with premium stock and fast turnarounds.',
    primaryCtaLabel: 'Call Now',
    primaryCtaLink: 'tel:+919801305451',
    secondaryCtaLabel: 'WhatsApp',
    secondaryCtaLink: 'https://wa.me/919801305451',
    formWhatsappLabel: 'WhatsApp Direct Chat',
    formWhatsappLink: 'https://wa.me/919801305451',
}

const defaultCards = [
    {
        title: 'Visit our studio',
        iconKey: 'location',
        eyebrow: 'Contact',
        lines: ['Computerized Chhappaiwala', 'Hospital Road, Sitamarhi', 'Bihar – 843302'],
        sortOrder: 0,
    },
    {
        title: 'Call us directly',
        iconKey: 'phone',
        eyebrow: 'Contact',
        lines: ['9801305451', '7488986015', '6203504230'],
        actionType: 'tel',
        actionLabel: 'Call',
        actionHref: 'tel:+919801305451',
        sortOrder: 1,
    },
    {
        title: 'WhatsApp support',
        iconKey: 'whatsapp',
        eyebrow: 'Contact',
        lines: ['Instant proofs', 'Order tracking', 'Artwork approvals'],
        actionType: 'whatsapp',
        actionLabel: 'Chat now',
        actionHref: 'https://wa.me/917488986015',
        sortOrder: 2,
    },
    {
        title: 'Email',
        iconKey: 'email',
        eyebrow: 'Contact',
        lines: ['info@chhappaiwala.com', 'support@chhappaiwala.com'],
        actionType: 'mailto',
        actionLabel: 'Mail',
        actionHref: 'mailto:info@chhappaiwala.com',
        sortOrder: 3,
    },
]

const ensurePageContent = async () => {
    const [content] = await ContactPageContent.findOrCreate({
        where: {},
        defaults: defaultPageContent,
    })
    return content
}

const ensureDefaultCards = async () => {
    const count = await ContactCard.count()
    if (count > 0) return
    await ContactCard.bulkCreate(defaultCards)
}

const normalizeLinesInput = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => (typeof item === 'string' ? item.trim() : ''))
            .filter(Boolean)
            .slice(0, 6)
    }
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value)
            if (Array.isArray(parsed)) {
                return parsed
                    .map((item) => (typeof item === 'string' ? item.trim() : ''))
                    .filter(Boolean)
                    .slice(0, 6)
            }
        } catch (error) {
            // ignore – treat raw string as single line
        }
        return [value.trim()]
    }
    return []
}

const coerceBoolean = (value) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase()
        if (normalized === 'true') return true
        if (normalized === 'false') return false
    }
    return undefined
}

const sanitizeIconKey = (iconKey) => {
    if (typeof iconKey !== 'string') return 'location'
    const normalized = iconKey.trim().toLowerCase()
    return ALLOWED_ICON_KEYS.has(normalized) ? normalized : 'location'
}

const sanitizeActionType = (actionType) => {
    if (typeof actionType !== 'string') return null
    const normalized = actionType.trim().toLowerCase()
    return ALLOWED_ACTION_TYPES.has(normalized) ? normalized : null
}

const parseSortOrder = (value, fallback) => {
    if (value === null || typeof value === 'undefined') {
        return fallback
    }
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : fallback
}

export const listContactCards = async (req, res, next) => {
    try {
        await ensureDefaultCards()
        const cards = await ContactCard.findAll({
            order: [
                ['sortOrder', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        })
        res.json({ cards })
    } catch (error) {
        next(error)
    }
}

export const createContactCard = async (req, res, next) => {
    try {
        const count = await ContactCard.count()
        const lines = normalizeLinesInput(req.body.lines)
        const payload = {
            title: typeof req.body.title === 'string' ? req.body.title.trim() : '',
            iconKey: sanitizeIconKey(req.body.iconKey),
            eyebrow: typeof req.body.eyebrow === 'string' ? req.body.eyebrow.trim() : null,
            lines,
            actionType: sanitizeActionType(req.body.actionType),
            actionLabel: typeof req.body.actionLabel === 'string' ? req.body.actionLabel.trim() : null,
            actionHref: typeof req.body.actionHref === 'string' ? req.body.actionHref.trim() : null,
            sortOrder: parseSortOrder(req.body.sortOrder, count),
            isFeatured: coerceBoolean(req.body.isFeatured) ?? false,
        }

        if (!payload.title) {
            return res.status(400).json({ message: 'Title is required.' })
        }
        if (!payload.lines.length) {
            return res.status(400).json({ message: 'Add at least one information line.' })
        }

        const card = await ContactCard.create(payload)
        res.status(201).json({ card })
    } catch (error) {
        next(error)
    }
}

export const updateContactCard = async (req, res, next) => {
    try {
        const { id } = req.params
        const card = await ContactCard.findByPk(id)
        if (!card) {
            return res.status(404).json({ message: 'Contact card not found' })
        }

        const updates = {}
        if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
            updates.title = typeof req.body.title === 'string' ? req.body.title.trim() : card.title
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'iconKey')) {
            updates.iconKey = sanitizeIconKey(req.body.iconKey)
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'eyebrow')) {
            updates.eyebrow = typeof req.body.eyebrow === 'string' ? req.body.eyebrow.trim() : null
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'lines')) {
            const lines = normalizeLinesInput(req.body.lines)
            if (lines.length === 0) {
                return res.status(400).json({ message: 'Lines cannot be empty.' })
            }
            updates.lines = lines
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'actionType')) {
            updates.actionType = sanitizeActionType(req.body.actionType)
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'actionLabel')) {
            updates.actionLabel = typeof req.body.actionLabel === 'string' ? req.body.actionLabel.trim() : null
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'actionHref')) {
            updates.actionHref = typeof req.body.actionHref === 'string' ? req.body.actionHref.trim() : null
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'sortOrder')) {
            updates.sortOrder = parseSortOrder(req.body.sortOrder, card.sortOrder)
        }
        if (Object.prototype.hasOwnProperty.call(req.body, 'isFeatured')) {
            const boolValue = coerceBoolean(req.body.isFeatured)
            updates.isFeatured = typeof boolValue === 'undefined' ? card.isFeatured : boolValue
        }

        await card.update(updates)
        res.json({ card })
    } catch (error) {
        next(error)
    }
}

export const deleteContactCard = async (req, res, next) => {
    try {
        const { id } = req.params
        const card = await ContactCard.findByPk(id)
        if (!card) {
            return res.status(404).json({ message: 'Contact card not found' })
        }
        await card.destroy()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const getContactPageContent = async (req, res, next) => {
    try {
        const content = await ensurePageContent()
        await ensureDefaultCards()
        const cards = await ContactCard.findAll({
            order: [
                ['sortOrder', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        })
        res.json({ content, cards })
    } catch (error) {
        next(error)
    }
}

export const updateContactPageContent = async (req, res, next) => {
    try {
        const content = await ensurePageContent()
        const updatableFields = [
            'heroEyebrow',
            'heroTitle',
            'heroDescription',
            'messageTitle',
            'messageDescription',
            'mapEmbedUrl',
            'openingEyebrow',
            'openingTitle',
            'openingDescription',
            'ctaEyebrow',
            'ctaTitle',
            'ctaDescription',
            'primaryCtaLabel',
            'primaryCtaLink',
            'secondaryCtaLabel',
            'secondaryCtaLink',
            'formWhatsappLabel',
            'formWhatsappLink',
        ]

        const coerceString = (value) => (typeof value === 'string' ? value.trim() : value)

        updatableFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                content[field] = coerceString(req.body[field])
            }
        })

        await content.save()
        res.json({ content })
    } catch (error) {
        next(error)
    }
}
