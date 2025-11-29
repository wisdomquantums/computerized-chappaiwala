import AboutSection from '../models/AboutSection.js'
import AboutSectionItem from '../models/AboutSectionItem.js'

const SectionKeys = {
    HERO: 'about-hero',
    WHO: 'about-who',
    FOUNDER: 'about-founder',
    TEAM: 'about-team',
}

const itemKeyBySection = {
    [SectionKeys.HERO]: 'about-hero-stats',
    [SectionKeys.WHO]: 'about-who-highlights',
    [SectionKeys.FOUNDER]: 'about-founder-highlights',
    [SectionKeys.TEAM]: 'about-team-members',
}

const defaultSections = {
    [SectionKeys.HERO]: {
        sectionKey: SectionKeys.HERO,
        tagline: 'About Computerized Chhappaiwala',
        title: 'Trusted printing and design services in Sitamarhi',
        description:
            'Comprehensive print production, from concept sketches to doorstep delivery for ambitious brands, households, and government projects.',
    },
    [SectionKeys.WHO]: {
        sectionKey: SectionKeys.WHO,
        tagline: 'Who We Are',
        title: 'Precision printing studio crafting memories & business essentials',
        description:
            'Computerized Chhappaiwala is a professional printing and computer work service based in Sitamarhi, Bihar. We specialize in wedding cards, letter pads, cash memos, calendars, and customized printing solutions focused on fast service and customer satisfaction.',
        primaryImage:
            'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=60',
    },
    [SectionKeys.FOUNDER]: {
        sectionKey: SectionKeys.FOUNDER,
        tagline: 'Founder & Owner',
        title: 'Mr. Kamlesh Tiwari',
        description:
            'With years of experience in printing and design, Mr. Kamlesh Tiwari built a strong reputation across Sitamarhi for delivering reliable, high-quality, and timely services.',
        primaryImage:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60',
    },
    [SectionKeys.TEAM]: {
        sectionKey: SectionKeys.TEAM,
        tagline: 'Team',
        title: 'Meet the people behind the presses',
        description: 'Each team member ensures that every order is precise, on-time, and delightful.',
    },
}

const defaultItems = {
    [itemKeyBySection[SectionKeys.HERO]]: [
        { title: 'Custom cards yearly', value: '500+', detail: 'Hero stat' },
        { title: 'Orders fulfilled', value: '1200+', detail: 'Hero stat' },
        { title: 'Average proof time', value: '24h', detail: 'Hero stat' },
    ],
    [itemKeyBySection[SectionKeys.WHO]]: [
        {
            title: 'End-to-end printing',
            description: 'Wedding cards, letter pads, cash memos, calendars, flex & more',
        },
        {
            title: 'Reliable turnaround',
            description: 'Express delivery with QC checkpoints at every stage',
        },
        {
            title: 'Transparent pricing',
            description: 'No hidden fees. Best-in-class pricing for Sitamarhi businesses',
        },
    ],
    [itemKeyBySection[SectionKeys.FOUNDER]]: [
        { description: '15+ years in print production' },
        { description: 'Trusted partner for SMBs & government bids' },
        { description: 'Championing affordable premium printing' },
    ],
    [itemKeyBySection[SectionKeys.TEAM]]: [
        {
            title: 'Mr. Sonu Tiwari',
            subtitle: 'Printing Operator',
            description: 'Expert in managing printing machines and ensuring high-quality output.',
            value: '+91 9801305451',
            detail: 'Core Specialist',
            mediaUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60',
            meta: { quote: 'Quality work and customer satisfaction is my first priority.' },
        },
        {
            title: 'Mr. Vikash Tiwari',
            subtitle: 'Design Specialist',
            description: 'Responsible for creative design and layout work for cards and business materials.',
            value: '+91 7488986015',
            detail: 'Design Lead',
            mediaUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60',
            meta: { quote: 'Good design creates a lasting impression.' },
        },
        {
            title: 'Mr. Mukul Tiwari',
            subtitle: 'Customer Support Executive',
            description: 'Handles customer queries, order management, and timely delivery.',
            value: '+91 6203504230',
            detail: 'Support Lead',
            mediaUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60',
            meta: { quote: 'Happy customers are our real success.' },
        },
    ],
}

const ensureSectionByKey = async (sectionKey) => {
    const normalized = sectionKey?.toLowerCase()
    const key = Object.values(SectionKeys).find((value) => value === normalized)
    if (!key) {
        const error = new Error('Invalid section key')
        error.status = 400
        throw error
    }
    const defaults = defaultSections[key] || { sectionKey: key }
    const [section] = await AboutSection.findOrCreate({ where: { sectionKey: key }, defaults })
    return section
}

const ensureItemsSeeded = async (sectionKey) => {
    const itemKey = itemKeyBySection[sectionKey]
    if (!itemKey) return
    const count = await AboutSectionItem.count({ where: { sectionKey: itemKey } })
    if (count > 0) return
    const seeds = defaultItems[itemKey]
    if (!seeds || !seeds.length) return
    await AboutSectionItem.bulkCreate(
        seeds.map((item, index) => ({
            ...item,
            sectionKey: itemKey,
            sortOrder: index,
        })),
    )
}

export const getSection = async (req, res, next) => {
    try {
        const { sectionKey } = req.params
        const section = await ensureSectionByKey(sectionKey)
        await ensureItemsSeeded(section.sectionKey)
        const items = await listItemsInternal(section.sectionKey)
        res.json({ section, items })
    } catch (error) {
        next(error)
    }
}

const listItemsInternal = async (sectionKey) => {
    const itemKey = itemKeyBySection[sectionKey]
    if (!itemKey) return []
    const items = await AboutSectionItem.findAll({
        where: { sectionKey: itemKey },
        order: [
            ['sortOrder', 'ASC'],
            ['createdAt', 'ASC'],
        ],
    })
    return items
}

export const updateSection = async (req, res, next) => {
    try {
        const { sectionKey } = req.params
        const section = await ensureSectionByKey(sectionKey)
        const payload = req.body || {}
        const fields = ['tagline', 'title', 'subtitle', 'description', 'primaryImage', 'secondaryImage', 'meta']
        fields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                section[field] = payload[field]
            }
        })
        await section.save()
        res.json({ section })
    } catch (error) {
        next(error)
    }
}

export const listSectionItems = async (req, res, next) => {
    try {
        const { sectionKey } = req.params
        const section = await ensureSectionByKey(sectionKey)
        await ensureItemsSeeded(section.sectionKey)
        const items = await listItemsInternal(section.sectionKey)
        res.json({ items })
    } catch (error) {
        next(error)
    }
}

const normalizeItemPayload = (payload = {}) => ({
    title: payload.title?.trim() || null,
    subtitle: payload.subtitle?.trim() || null,
    description: payload.description?.trim() || null,
    value: payload.value?.trim() || null,
    detail: payload.detail?.trim() || null,
    mediaUrl: payload.mediaUrl?.trim() || null,
    meta: payload.meta || null,
    sortOrder: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0,
})

export const createSectionItem = async (req, res, next) => {
    try {
        const { sectionKey } = req.params
        const section = await ensureSectionByKey(sectionKey)
        const itemSectionKey = itemKeyBySection[section.sectionKey]
        if (!itemSectionKey) {
            return res.status(400).json({ message: 'Section does not support items' })
        }
        const payload = normalizeItemPayload(req.body)
        const item = await AboutSectionItem.create({ ...payload, sectionKey: itemSectionKey })
        res.status(201).json({ item })
    } catch (error) {
        next(error)
    }
}

export const updateSectionItem = async (req, res, next) => {
    try {
        const { sectionKey, id } = req.params
        const section = await ensureSectionByKey(sectionKey)
        const validItemKey = itemKeyBySection[section.sectionKey]
        const item = await AboutSectionItem.findByPk(id)
        if (!item || item.sectionKey !== validItemKey) {
            return res.status(404).json({ message: 'Item not found' })
        }
        const payload = normalizeItemPayload(req.body)
        await item.update(payload)
        res.json({ item })
    } catch (error) {
        next(error)
    }
}

export const deleteSectionItem = async (req, res, next) => {
    try {
        const { sectionKey, id } = req.params
        const section = await ensureSectionByKey(sectionKey)
        const validItemKey = itemKeyBySection[section.sectionKey]
        const item = await AboutSectionItem.findByPk(id)
        if (!item || item.sectionKey !== validItemKey) {
            return res.status(404).json({ message: 'Item not found' })
        }
        await item.destroy()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
