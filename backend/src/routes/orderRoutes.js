import { Router } from 'express'
import { createOrder, deleteOrder, listCustomerOrders, listOrders, updateOrder, updateOrderStatus } from '../controllers/orderController.js'
import { authenticate, authorizeAdmin, requirePermission } from '../middleware/auth.js'

const router = Router()

router.get('/my', authenticate, listCustomerOrders)
router.get('/', authenticate, authorizeAdmin, requirePermission('manage_orders'), listOrders)
router.post('/', authenticate, createOrder)
router.put('/:id', authenticate, authorizeAdmin, requirePermission('manage_orders'), updateOrder)
router.patch('/:id/status', authenticate, authorizeAdmin, requirePermission('manage_orders'), updateOrderStatus)
router.delete('/:id', authenticate, authorizeAdmin, requirePermission('manage_orders'), deleteOrder)

export default router
