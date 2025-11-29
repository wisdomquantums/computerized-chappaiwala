import { Op } from 'sequelize'
import CustomerAddress from '../models/CustomerAddress.js'

const ADDRESS_LIMIT = 10
const sanitizeText = (value) => (typeof value === 'string' ? value.trim() : '')
const allowedTypes = ['Home', 'Office', 'Other']

const shapeAddressResponse = (address) => ({
    id: address.id,
    userId: address.userId,
    label: address.label,
    recipientName: address.recipientName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    landmark: address.landmark,
    type: address.type,
    instructions: address.instructions,
    isDefault: Boolean(address.isDefault),
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
})

const validatePayload = (input = {}) => {
    const errors = []
    const payload = {}

    payload.label = sanitizeText(input.label) || 'Home'
    payload.recipientName = sanitizeText(input.recipientName)
    payload.phone = sanitizeText(input.phone)
    payload.line1 = sanitizeText(input.line1)
    payload.line2 = sanitizeText(input.line2) || null
    payload.city = sanitizeText(input.city)
    payload.state = sanitizeText(input.state)
    payload.pincode = sanitizeText(input.pincode)
    payload.landmark = sanitizeText(input.landmark) || null
    payload.instructions = sanitizeText(input.instructions) || null
    payload.type = allowedTypes.includes(input.type) ? input.type : 'Home'
    payload.isDefault = Boolean(input.isDefault)

    if (!payload.recipientName) errors.push('Recipient name is required.')
    if (!payload.phone) errors.push('Phone number is required.')
    if (!payload.line1) errors.push('Address line 1 is required.')
    if (!payload.city) errors.push('City is required.')
    if (!payload.state) errors.push('State is required.')
    if (!payload.pincode) errors.push('Pincode is required.')

    if (errors.length) {
        const error = new Error(errors.join(' '))
        error.statusCode = 400
        throw error
    }

    return payload
}

const ensureSingleDefault = async (userId, keepAddressId) => {
    if (!keepAddressId) return
    await CustomerAddress.update(
        { isDefault: false },
        {
            where: {
                userId,
                id: {
                    [Op.ne]: keepAddressId,
                },
            },
        },
    )
}

const assignFallbackDefault = async (userId) => {
    const existingDefault = await CustomerAddress.findOne({ where: { userId, isDefault: true } })
    if (existingDefault) {
        return existingDefault
    }
    const candidate = await CustomerAddress.findOne({
        where: { userId },
        order: [['updatedAt', 'DESC']],
    })
    if (candidate && !candidate.isDefault) {
        await candidate.update({ isDefault: true })
    }
    return candidate
}

export const listAddresses = async (req, res, next) => {
    try {
        const addresses = await CustomerAddress.findAll({
            where: { userId: req.user.id },
            order: [
                ['isDefault', 'DESC'],
                ['updatedAt', 'DESC'],
            ],
        })
        res.json({ addresses: addresses.map(shapeAddressResponse) })
    } catch (error) {
        next(error)
    }
}

export const createAddress = async (req, res, next) => {
    try {
        const count = await CustomerAddress.count({ where: { userId: req.user.id } })
        if (count >= ADDRESS_LIMIT) {
            return res.status(400).json({ message: `Maximum of ${ADDRESS_LIMIT} saved addresses reached.` })
        }

        const payload = validatePayload(req.body)
        payload.userId = req.user.id

        if (!count) {
            payload.isDefault = true
        }

        const address = await CustomerAddress.create(payload)

        if (address.isDefault) {
            await ensureSingleDefault(req.user.id, address.id)
        }

        const refreshed = await CustomerAddress.findByPk(address.id)
        res.status(201).json({ address: shapeAddressResponse(refreshed) })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return next(error)
    }
}

export const updateAddress = async (req, res, next) => {
    try {
        const { id } = req.params
        const existing = await CustomerAddress.findOne({ where: { id, userId: req.user.id } })
        if (!existing) {
            return res.status(404).json({ message: 'Address not found' })
        }

        const payload = validatePayload(req.body)
        await existing.update(payload)

        if (payload.isDefault) {
            await ensureSingleDefault(req.user.id, existing.id)
        } else {
            await assignFallbackDefault(req.user.id)
        }

        const refreshed = await CustomerAddress.findByPk(existing.id)
        res.json({ address: shapeAddressResponse(refreshed) })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message })
        }
        return next(error)
    }
}

export const deleteAddress = async (req, res, next) => {
    try {
        const { id } = req.params
        const existing = await CustomerAddress.findOne({ where: { id, userId: req.user.id } })
        if (!existing) {
            return res.status(404).json({ message: 'Address not found' })
        }

        const wasDefault = existing.isDefault
        await existing.destroy()

        if (wasDefault) {
            await assignFallbackDefault(req.user.id)
        }

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const markDefaultAddress = async (req, res, next) => {
    try {
        const { id } = req.params
        const target = await CustomerAddress.findOne({ where: { id, userId: req.user.id } })
        if (!target) {
            return res.status(404).json({ message: 'Address not found' })
        }

        await target.update({ isDefault: true })
        await ensureSingleDefault(req.user.id, target.id)

        res.json({ address: shapeAddressResponse(target) })
    } catch (error) {
        next(error)
    }
}
