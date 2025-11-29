import { PortfolioItem, PortfolioListItem, PortfolioPageContent } from '../models/index.js'

const LIST_TYPES = {
    TRUST: 'trust',
    IDEAS: 'ideas',
}

const defaultPageContent = {
    heroTagline: 'Our Work / Portfolio',
    heroTitle: 'See our latest printing and design work',
    heroDescription:
        'Handpicked print samples across wedding cards, visiting cards, stationery, and flex installations crafted in Sitamarhi.',
    trustTitle: 'Why you should view our work',
    trustDescription: 'Every sample is printed, finished, and QC-checked inside Computerized Chhappaiwala.',
    ideasTitle: 'Content ideas to keep your portfolio fresh',
    ideasDescription: 'Rotate these buckets each month to highlight recent printing success stories.',
    ctaEyebrow: 'Need similar designs?',
    ctaTitle: 'Want similar design for your business or event?',
    ctaDescription:
        'Share your requirement for wedding cards, corporate kits, or large-format flex. We craft and deliver with the same precision.',
    primaryCtaLabel: 'Contact Us',
    primaryCtaLink: '/contact',
    secondaryCtaLabel: 'WhatsApp Now',
    secondaryCtaLink: 'https://wa.me/919999999999',
}

const defaultListItems = {
    [LIST_TYPES.TRUST]: [
        { title: 'High-Quality Print Samples' },
        { title: 'Modern Design Work' },
        { title: 'Trusted by Local Customers' },
        { title: 'Many Years of Experience' },
    ],
    [LIST_TYPES.IDEAS]: [
        { title: 'Wedding card samples' },
        { title: 'Cash memo & invoice pads' },
        { title: 'Visiting and business cards' },
        { title: 'Calendar & planner layouts' },
        { title: 'Flex / banner installations' },
        { title: 'Shop floor & production shots' },
    ],
}

const ensurePageContent = async () => {
    const [content] = await PortfolioPageContent.findOrCreate({
        where: {},
        defaults: defaultPageContent,
    })
    return content
}

const ensureListSeeded = async (listType) => {
    const existing = await PortfolioListItem.count({ where: { listType } })
    if (existing > 0) return
    const seeds = defaultListItems[listType] || []
    if (!seeds.length) return
    await PortfolioListItem.bulkCreate(
        seeds.map((item, index) => ({ ...item, listType, sortOrder: index }))
    )
}

const parseGalleryField = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean)
    }
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value)
            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean)
            }
        } catch (error) {
            // ignore parse error, treat as single URL string
        }
        return [value.trim()]
    }
    return []
}

const serializePortfolioItem = (item) => ({
    ...item.toJSON(),
    gallery: parseGalleryField(item.gallery),
})

export const listPortfolio = async (req, res, next) => {
    try {
        const items = await PortfolioItem.findAll({ order: [['createdAt', 'DESC']] })
        res.json({ items: items.map(serializePortfolioItem) })
    } catch (error) {
        next(error)
    }
}

export const createPortfolioItem = async (req, res, next) => {
    try {
        const { title, category, image, description, gallery = [] } = req.body
        const normalizedGallery = parseGalleryField(gallery)
        const item = await PortfolioItem.create({
            title,
            category,
            image: image || normalizedGallery?.[0] || null,
            description,
            gallery: normalizedGallery,
        })
        res.status(201).json({ item: serializePortfolioItem(item) })
    } catch (error) {
        next(error)
    }
}

export const updatePortfolioItem = async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await PortfolioItem.findByPk(id)
        if (!item) {
            return res.status(404).json({ message: 'Portfolio item not found' })
        }
        const { title, category, image, description, gallery = [] } = req.body
        const normalizedGallery = parseGalleryField(gallery)
        item.title = title ?? item.title
        item.category = category ?? item.category
        item.description = description ?? item.description
        item.gallery = normalizedGallery.length ? normalizedGallery : item.gallery
        item.image = image || normalizedGallery?.[0] || item.image
        await item.save()
        res.json({ item: serializePortfolioItem(item) })
    } catch (error) {
        next(error)
    }
}

export const deletePortfolioItem = async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await PortfolioItem.findByPk(id)
        if (!item) {
            return res.status(404).json({ message: 'Portfolio item not found' })
        }
        await item.destroy()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const getPortfolioPageContent = async (req, res, next) => {
    try {
        const content = await ensurePageContent()
        await Promise.all([
            ensureListSeeded(LIST_TYPES.TRUST),
            ensureListSeeded(LIST_TYPES.IDEAS),
        ])
        const trustHighlights = await PortfolioListItem.findAll({
            where: { listType: LIST_TYPES.TRUST },
            order: [
                ['sortOrder', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        })
        const contentIdeas = await PortfolioListItem.findAll({
            where: { listType: LIST_TYPES.IDEAS },
            order: [
                ['sortOrder', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        })

        res.json({
            content,
            trustHighlights,
            contentIdeas,
        })
    } catch (error) {
        next(error)
    }
}

export const updatePortfolioPageContent = async (req, res, next) => {
    try {
        const content = await ensurePageContent()
        const fields = [
            'heroTagline',
            'heroTitle',
            'heroDescription',
            'trustTitle',
            'trustDescription',
            'ideasTitle',
            'ideasDescription',
            'ctaEyebrow',
            'ctaTitle',
            'ctaDescription',
            'primaryCtaLabel',
            'primaryCtaLink',
            'secondaryCtaLabel',
            'secondaryCtaLink',
        ]
        fields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                content[field] = req.body[field]
            }
        })
        await content.save()
        res.json({ content })
    } catch (error) {
        next(error)
    }
}

const normalizeListType = (value) => {
    const normalized = (value || '').toLowerCase()
    if (normalized === LIST_TYPES.TRUST || normalized === LIST_TYPES.IDEAS) {
        return normalized
    }
    const error = new Error('Invalid list type')
    error.status = 400
    throw error
}

export const listPortfolioListItems = async (req, res, next) => {
    try {
        const listType = normalizeListType(req.params.listType)
        await ensureListSeeded(listType)
        const items = await PortfolioListItem.findAll({
            where: { listType },
            order: [
                ['sortOrder', 'ASC'],
                ['createdAt', 'ASC'],
            ],
        })
        res.json({ items })
    } catch (error) {
        next(error)
    }
}

const sanitizeListPayload = (payload = {}) => ({
    title: payload.title?.trim() || null,
    description: payload.description?.trim() || null,
    sortOrder: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0,
})

export const createPortfolioListItem = async (req, res, next) => {
    try {
        const listType = normalizeListType(req.params.listType)
        const payload = sanitizeListPayload(req.body)
        const item = await PortfolioListItem.create({ ...payload, listType })
        res.status(201).json({ item })
    } catch (error) {
        next(error)
    }
}

export const updatePortfolioListItem = async (req, res, next) => {
    try {
        const listType = normalizeListType(req.params.listType)
        const { id } = req.params
        const item = await PortfolioListItem.findByPk(id)
        if (!item || item.listType !== listType) {
            return res.status(404).json({ message: 'Item not found' })
        }
        const payload = sanitizeListPayload(req.body)
        await item.update(payload)
        res.json({ item })
    } catch (error) {
        next(error)
    }
}

export const deletePortfolioListItem = async (req, res, next) => {
    try {
        const listType = normalizeListType(req.params.listType)
        const { id } = req.params
        const item = await PortfolioListItem.findByPk(id)
        if (!item || item.listType !== listType) {
            return res.status(404).json({ message: 'Item not found' })
        }
        await item.destroy()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const LIST_TYPE_KEYS = LIST_TYPES
