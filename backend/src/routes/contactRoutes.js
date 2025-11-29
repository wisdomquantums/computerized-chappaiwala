import { Router } from 'express'
import {
    createContactCard,
    deleteContactCard,
    getContactPageContent,
    listContactCards,
    updateContactCard,
    updateContactPageContent,
} from '../controllers/contactController.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/cards', listContactCards)
router.post('/cards', authenticate, authorizeAdmin, createContactCard)
router.put('/cards/:id', authenticate, authorizeAdmin, updateContactCard)
router.delete('/cards/:id', authenticate, authorizeAdmin, deleteContactCard)

router.get('/page/content', getContactPageContent)
router.put('/page/content', authenticate, authorizeAdmin, updateContactPageContent)

export default router
