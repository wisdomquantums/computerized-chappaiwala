import { Service } from '../models/index.js'

const MAX_GALLERY_ITEMS = 7
const MIN_GALLERY_ITEMS = 1

const coerceGalleryArray = (value) => {
    if (Array.isArray(value)) {
        return value
    }
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
        } catch (error) {
            return []
        }
    }
    return []
}

const sanitizeText = (value) => {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed || null
}

const normalizeNumber = (value) => {
    if (value === null || value === undefined || value === '') return null
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
}

const normalizeInteger = (value) => {
    const parsed = normalizeNumber(value)
    if (parsed === null) return null
    return Math.max(0, Math.round(parsed))
}

const normalizeGallery = (value, fallbackImage) => {
    const baseArray = Array.isArray(value) ? value : coerceGalleryArray(value)
    if (baseArray.length) {
        const normalized = baseArray
            .map((url) => sanitizeText(url))
            .filter(Boolean)
        if (normalized.length >= MIN_GALLERY_ITEMS) {
            return normalized.slice(0, MAX_GALLERY_ITEMS)
        }
        return fallbackImage ? [fallbackImage] : []
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value)
            if (Array.isArray(parsed)) {
                return normalizeGallery(parsed, fallbackImage)
            }
        } catch (error) {
            // ignore parsing errors and fall back to empty array
        }
    }

    return fallbackImage ? [fallbackImage] : []
}

const buildServicePayload = (body = {}) => {
    const title = sanitizeText(body.title || body.name)
    const description = sanitizeText(body.description)
    const category = sanitizeText(body.category) || 'General'
    const iconKey = sanitizeText(body.iconKey) || 'default'
    const image = sanitizeText(body.image)
    const gallery = normalizeGallery(body.gallery, image)
    const paperCharge = sanitizeText(body.paperCharge)
    const printCharge = sanitizeText(body.printCharge)
    const unitLabel = sanitizeText(body.unitLabel)
    const supportWindow = sanitizeText(body.supportWindow) || '24-72 hrs'
    const priceLabelInput = sanitizeText(body.priceLabel)
    const paperChargeValue = normalizeNumber(body.paperChargeValue)
    const printChargeValue = normalizeNumber(body.printChargeValue)
    const basePrice = normalizeNumber(body.basePrice ?? body.price)
    const ratingValue = normalizeNumber(body.rating)
    const reviewCountValue = normalizeInteger(body.reviewCount)

    let rating = ratingValue
    if (rating !== null) {
        rating = Math.max(0, Math.min(5, Number(rating.toFixed(2))))
    }

    const payload = {
        title,
        description,
        category,
        iconKey,
        image,
        gallery,
        paperCharge,
        printCharge,
        unitLabel,
        supportWindow,
        priceLabel: priceLabelInput,
        paperChargeValue,
        printChargeValue,
        basePrice,
        rating,
        reviewCount: reviewCountValue,
    }

    if ((payload.basePrice === null || payload.basePrice === undefined) &&
        (payload.paperChargeValue || payload.printChargeValue)) {
        const fallbackBase = (payload.paperChargeValue || 0) + (payload.printChargeValue || 0)
        payload.basePrice = fallbackBase > 0 ? fallbackBase : null
    }

    if (!payload.priceLabel && payload.basePrice !== null) {
        const formattedBase = payload.basePrice.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        })
        payload.priceLabel = payload.unitLabel
            ? `${formattedBase} ${payload.unitLabel}`
            : formattedBase
    }

    if (!payload.gallery.length && payload.image) {
        payload.gallery = [payload.image]
    }

    return payload
}

const formatServiceResponse = (service) => {
    if (!service) return null
    const plain = service.toJSON()
    plain.gallery = coerceGalleryArray(plain.gallery).slice(0, MAX_GALLERY_ITEMS)
    if (!plain.gallery.length && plain.image) {
        plain.gallery = [plain.image]
    }
    if (!plain.priceLabel && plain.basePrice !== null && plain.basePrice !== undefined) {
        const formattedBase = plain.basePrice.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        })
        plain.priceLabel = plain.unitLabel
            ? `${formattedBase} ${plain.unitLabel}`
            : formattedBase
    }
    plain.rating = typeof plain.rating === 'number' ? Number(plain.rating) : null
    plain.reviewCount = typeof plain.reviewCount === 'number' ? plain.reviewCount : 0
    plain.supportWindow = plain.supportWindow || '24-72 hrs'
    return plain
}

export const listServices = async (req, res, next) => {
    try {
        const services = await Service.findAll({ order: [['createdAt', 'DESC']] })
        res.json({ services: services.map((service) => formatServiceResponse(service)) })
    } catch (error) {
        next(error)
    }
}

export const createService = async (req, res, next) => {
    try {
        const payload = buildServicePayload(req.body)
        if (!payload.title || !payload.description) {
            return res.status(400).json({ message: 'Title and description are required.' })
        }
        const service = await Service.create(payload)
        res.status(201).json({ service: formatServiceResponse(service) })
    } catch (error) {
        next(error)
    }
}

export const updateService = async (req, res, next) => {
    try {
        const { id } = req.params
        const service = await Service.findByPk(id)
        if (!service) {
            return res.status(404).json({ message: 'Service not found' })
        }
        const payload = buildServicePayload(req.body)
        if (!payload.title || !payload.description) {
            return res.status(400).json({ message: 'Title and description are required.' })
        }
        await service.update(payload)
        res.json({ service: formatServiceResponse(service) })
    } catch (error) {
        next(error)
    }
}

export const deleteService = async (req, res, next) => {
    try {
        const { id } = req.params
        const service = await Service.findByPk(id)
        if (!service) {
            return res.status(404).json({ message: 'Service not found' })
        }
        await service.destroy()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
