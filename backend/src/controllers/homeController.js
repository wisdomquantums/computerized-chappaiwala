import { HomeSectionItem } from '../models/index.js'

export const HOME_SECTIONS = {
    HERO: 'hero',
    STATS: 'stats',
    CAPABILITY: 'capability',
    SERVICE: 'service',
    PORTFOLIO: 'portfolio',
    CONTACT: 'contact',
    CTA: 'cta',
}

const allowedSections = Object.values(HOME_SECTIONS)

const sanitizeString = (value) => {
    if (value === null || value === undefined) return null
    if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed.length ? trimmed : null
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
    }
    return null
}

const parseSortOrder = (value) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return 0
    return parsed
}

const pickSectionPayload = (body = {}) => ({
    title: sanitizeString(body.title),
    subtitle: sanitizeString(body.subtitle),
    description: sanitizeString(body.description),
    badge: sanitizeString(body.badge),
    value: sanitizeString(body.value),
    detail: sanitizeString(body.detail),
    price: sanitizeString(body.price),
    image: sanitizeString(body.image),
    linkLabel: sanitizeString(body.linkLabel),
    linkUrl: sanitizeString(body.linkUrl),
    secondaryLabel: sanitizeString(body.secondaryLabel),
    secondaryUrl: sanitizeString(body.secondaryUrl),
    sortOrder: parseSortOrder(body.sortOrder),
    status: sanitizeString(body.status) || 'active',
    metadata: typeof body.metadata === 'object' && body.metadata !== null ? body.metadata : null,
})

const serializeItem = (item) =>
    item
        ? {
            id: item.id,
            section: item.section,
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            badge: item.badge,
            value: item.value,
            detail: item.detail,
            price: item.price,
            image: item.image,
            linkLabel: item.linkLabel,
            linkUrl: item.linkUrl,
            secondaryLabel: item.secondaryLabel,
            secondaryUrl: item.secondaryUrl,
            sortOrder: item.sortOrder,
            status: item.status,
            metadata: item.metadata,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }
        : null

const groupBySection = (items = []) => {
    const grouped = allowedSections.reduce((acc, section) => {
        acc[section] = []
        return acc
    }, {})

    items.forEach((item) => {
        if (!grouped[item.section]) {
            grouped[item.section] = []
        }
        grouped[item.section].push(serializeItem(item))
    })

    Object.keys(grouped).forEach((section) => {
        grouped[section] = grouped[section].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    })

    return grouped
}

export const listHomeContent = async (req, res) => {
    try {
        const where = {}
        const sectionFilter = sanitizeString(req.query.section)
        if (sectionFilter && allowedSections.includes(sectionFilter)) {
            where.section = sectionFilter
        }
        const items = await HomeSectionItem.findAll({
            where,
            order: [
                ['section', 'ASC'],
                ['sortOrder', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        })
        res.json({ items: items.map(serializeItem) })
    } catch (error) {
        console.error('[home] Failed to list sections', error)
        res.status(500).json({ message: 'Unable to load home sections.' })
    }
}

export const getHomeContent = async (req, res) => {
    try {
        const items = await HomeSectionItem.findAll({
            order: [
                ['section', 'ASC'],
                ['sortOrder', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        })
        res.json({ sections: groupBySection(items) })
    } catch (error) {
        console.error('[home] Failed to fetch content', error)
        res.status(500).json({ message: 'Unable to load home page content.' })
    }
}

export const createHomeSectionItem = async (req, res) => {
    try {
        const section = sanitizeString(req.body.section)
        if (!section || !allowedSections.includes(section)) {
            return res.status(400).json({ message: 'Invalid section provided.' })
        }
        const payload = pickSectionPayload(req.body)
        payload.section = section

        const item = await HomeSectionItem.create(payload)
        res.status(201).json({ item: serializeItem(item) })
    } catch (error) {
        console.error('[home] Failed to create section', error)
        res.status(500).json({ message: 'Unable to create home section entry.' })
    }
}

export const updateHomeSectionItem = async (req, res) => {
    try {
        const { id } = req.params
        const item = await HomeSectionItem.findByPk(id)
        if (!item) {
            return res.status(404).json({ message: 'Home section entry not found.' })
        }
        const payload = pickSectionPayload(req.body)
        const maybeSection = sanitizeString(req.body.section)
        if (maybeSection && allowedSections.includes(maybeSection)) {
            payload.section = maybeSection
        }
        await item.update(payload)
        res.json({ item: serializeItem(item) })
    } catch (error) {
        console.error('[home] Failed to update section', error)
        res.status(500).json({ message: 'Unable to update home section entry.' })
    }
}

export const deleteHomeSectionItem = async (req, res) => {
    try {
        const { id } = req.params
        const item = await HomeSectionItem.findByPk(id)
        if (!item) {
            return res.status(404).json({ message: 'Home section entry not found.' })
        }
        await item.destroy()
        res.json({ success: true })
    } catch (error) {
        console.error('[home] Failed to delete section', error)
        res.status(500).json({ message: 'Unable to delete home section entry.' })
    }
}
