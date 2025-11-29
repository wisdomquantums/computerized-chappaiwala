import Razorpay from 'razorpay'

let razorpayInstance = null

const getRazorpayClient = () => {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
        throw new Error('Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
    }

    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        })
    }

    return razorpayInstance
}

const sanitizeAmount = (value) => {
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return null
    }
    return Math.round(numeric * 100)
}

export const createPaymentOrder = async (req, res, next) => {
    try {
        const amountInPaise = sanitizeAmount(req.body?.amount)
        const currency = (req.body?.currency || 'INR').toUpperCase()
        const cartItems = Array.isArray(req.body?.cartItems) ? req.body.cartItems : []
        const customer = req.body?.customer || {}

        if (!amountInPaise) {
            return res.status(400).json({ message: 'A valid amount greater than zero is required.' })
        }

        if (!cartItems.length) {
            return res.status(400).json({ message: 'Cart items are required to create an order.' })
        }

        const razorpay = getRazorpayClient()

        const notes = {
            customerName: customer.name?.slice(0, 50) || '',
            customerPhone: customer.phone?.toString().slice(0, 20) || '',
            userId: req.user?.id?.toString() || 'guest',
            itemCount: cartItems.length.toString(),
        }

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency,
            receipt: req.body?.receipt || `ccw-${Date.now()}`,
            notes,
        })

        return res.status(201).json({
            order,
            keyId: process.env.RAZORPAY_KEY_ID,
        })
    } catch (error) {
        if (error?.message?.includes('Razorpay credentials')) {
            return res.status(500).json({ message: error.message })
        }

        if (error?.statusCode && error?.error) {
            return res.status(error.statusCode).json({ message: error.error.description || 'Failed to create Razorpay order.' })
        }

        return next(error)
    }
}
