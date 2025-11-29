import { Router } from 'express'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'
import {
    listHomeContent,
    getHomeContent,
    createHomeSectionItem,
    updateHomeSectionItem,
    deleteHomeSectionItem,
} from '../controllers/homeController.js'

const router = Router()

router.get('/content', getHomeContent)

router.get('/sections', authenticate, authorizeAdmin, listHomeContent)
router.post('/sections', authenticate, authorizeAdmin, createHomeSectionItem)
router.put('/sections/:id', authenticate, authorizeAdmin, updateHomeSectionItem)
router.delete('/sections/:id', authenticate, authorizeAdmin, deleteHomeSectionItem)

export default router
