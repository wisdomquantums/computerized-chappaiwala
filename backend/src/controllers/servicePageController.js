import { ServicePageContent, ServiceStat } from '../models/index.js'

const defaultContent = {
    heroTagline: 'Premium print studio',
    heroTitle: "Sitamarhi's modern printing desk",
    heroDescription:
        'Tailor-made wedding cards, invoices, calendars, hand bills, and custom collateral – designed for a cohesive brand story.',
    primaryCtaText: 'Explore catalog',
    primaryCtaLink: '/services',
    secondaryCtaText: 'Download rate card',
    secondaryCtaLink: '#services-grid',
}

const defaultStats = [
    {
        label: 'Curated services',
        value: '1+',
        detail: 'Hand-vetted combos',
        sortOrder: 0,
    },
    {
        label: 'Categories',
        value: '1',
        detail: 'Ready-to-print sets',
        sortOrder: 1,
    },
    {
        label: 'Avg. delivery',
        value: '24-72h',
        detail: 'Pan Sitamarhi',
        sortOrder: 2,
    },
]

const ensureContentRecord = async () => {
    const existing = await ServicePageContent.findOne()
    if (existing) {
        return existing
    }
    return ServicePageContent.create(defaultContent)
}

const ensureDefaultStats = async (contentId) => {
    const existingCount = await ServiceStat.count({ where: { contentId } })
    if (existingCount > 0) {
        return
    }
    await ServiceStat.bulkCreate(
        defaultStats.map((stat, index) => ({
            ...stat,
            sortOrder: typeof stat.sortOrder === 'number' ? stat.sortOrder : index,
            contentId,
        })),
    )
}

export const getServicePage = async (req, res, next) => {
    try {
        const content = await ensureContentRecord()
        await ensureDefaultStats(content.id)
        const stats = await ServiceStat.findAll({ where: { contentId: content.id }, order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] })
        res.json({ content, stats })
    } catch (error) {
        next(error)
    }
}

export const updateServicePage = async (req, res, next) => {
    try {
        const content = await ensureContentRecord()
        const payload = req.body || {}
        const fields = [
            'heroTagline',
            'heroTitle',
            'heroDescription',
            'primaryCtaText',
            'primaryCtaLink',
            'secondaryCtaText',
            'secondaryCtaLink',
        ]
        fields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                content[field] = payload[field]
            }
        })
        await content.save()
        res.json({ content })
    } catch (error) {
        next(error)
    }
}

const normalizeStatPayload = (payload = {}) => ({
    label: payload.label?.trim(),
    value: payload.value?.trim(),
    detail: payload.detail?.trim() || null,
    sortOrder: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0,
})

export const createServiceStat = async (req, res, next) => {
    try {
        const content = await ensureContentRecord()
        const payload = normalizeStatPayload(req.body)
        if (!payload.label || !payload.value) {
            return res.status(400).json({ message: 'Label and value are required.' })
        }
        const stat = await ServiceStat.create({ ...payload, contentId: content.id })
        res.status(201).json({ stat })
    } catch (error) {
        next(error)
    }
}

export const updateServiceStat = async (req, res, next) => {
    try {
        const { id } = req.params
        const stat = await ServiceStat.findByPk(id)
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' })
        }
        const payload = normalizeStatPayload(req.body)
        if (!payload.label || !payload.value) {
            return res.status(400).json({ message: 'Label and value are required.' })
        }
        await stat.update(payload)
        res.json({ stat })
    } catch (error) {
        next(error)
    }
}

export const deleteServiceStat = async (req, res, next) => {
    try {
        const { id } = req.params
        const stat = await ServiceStat.findByPk(id)
        if (!stat) {
            return res.status(404).json({ message: 'Stat not found' })
        }
        await stat.destroy()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const deleteServicePageContent = async (req, res, next) => {
    try {
        const content = await ServicePageContent.findOne()
        if (!content) {
            return res.status(204).send()
        }
        await ServiceStat.destroy({ where: { contentId: content.id } })
        await content.destroy()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
