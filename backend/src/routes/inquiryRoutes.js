import { Router } from 'express'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'
import { createInquiry, listInquiries, exportInquiriesExcel, exportInquiriesPdf } from '../controllers/inquiryController.js'

const router = Router()

router.post('/', createInquiry)
router.get('/', authenticate, authorizeAdmin, listInquiries)
router.get('/export/excel', authenticate, authorizeAdmin, exportInquiriesExcel)
router.get('/export/pdf', authenticate, authorizeAdmin, exportInquiriesPdf)

export default router
