import { Router } from 'express'
import { createPaymentOrder } from '../controllers/paymentController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/order', authenticate, createPaymentOrder)

export default router
