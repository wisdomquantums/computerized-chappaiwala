import { Router } from 'express'
import {
    createTicket,
    deleteTicket,
    getTicketById,
    listCustomerTickets,
    listTickets,
    patchTicketStatus,
    updateTicket,
} from '../controllers/ticketController.js'
import { authenticate, authorizeAdmin, requirePermission } from '../middleware/auth.js'

const router = Router()

router.get('/my', authenticate, listCustomerTickets)
router.get('/:id', authenticate, getTicketById)
router.post('/', authenticate, createTicket)

router.get('/', authenticate, authorizeAdmin, requirePermission('manage_tickets'), listTickets)
router.put('/:id', authenticate, authorizeAdmin, requirePermission('manage_tickets'), updateTicket)
router.patch('/:id/status', authenticate, authorizeAdmin, requirePermission('manage_tickets'), patchTicketStatus)
router.delete('/:id', authenticate, authorizeAdmin, requirePermission('manage_tickets'), deleteTicket)

export default router
