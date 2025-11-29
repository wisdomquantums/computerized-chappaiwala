import { Router } from 'express'
import authRoutes from './authRoutes.js'
import serviceRoutes from './serviceRoutes.js'
import orderRoutes from './orderRoutes.js'
import portfolioRoutes from './portfolioRoutes.js'
import roleRoutes from './roleRoutes.js'
import permissionRoutes from './permissionRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import uploadRoutes from './uploadRoutes.js'
import aboutRoutes from './aboutRoutes.js'
import contactRoutes from './contactRoutes.js'
import inquiryRoutes from './inquiryRoutes.js'
import homeRoutes from './homeRoutes.js'
import addressRoutes from './addressRoutes.js'
import ticketRoutes from './ticketRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/services', serviceRoutes)
router.use('/orders', orderRoutes)
router.use('/portfolio', portfolioRoutes)
router.use('/roles', roleRoutes)
router.use('/permissions', permissionRoutes)
router.use('/payments', paymentRoutes)
router.use('/upload', uploadRoutes)
router.use('/about', aboutRoutes)
router.use('/contact', contactRoutes)
router.use('/inquiries', inquiryRoutes)
router.use('/home', homeRoutes)
router.use('/addresses', addressRoutes)
router.use('/tickets', ticketRoutes)

export default router
