import { Router } from 'express'
import { createService, deleteService, listServices, updateService } from '../controllers/serviceController.js'
import {
    createServiceStat,
    deleteServicePageContent,
    deleteServiceStat,
    getServicePage,
    updateServicePage,
    updateServiceStat,
} from '../controllers/servicePageController.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', listServices)
router.post('/', authenticate, authorizeAdmin, createService)
router.put('/:id', authenticate, authorizeAdmin, updateService)
router.delete('/:id', authenticate, authorizeAdmin, deleteService)

router.get('/page/content', getServicePage)
router.put('/page/content', authenticate, authorizeAdmin, updateServicePage)
router.delete('/page/content', authenticate, authorizeAdmin, deleteServicePageContent)
router.post('/page/stats', authenticate, authorizeAdmin, createServiceStat)
router.put('/page/stats/:id', authenticate, authorizeAdmin, updateServiceStat)
router.delete('/page/stats/:id', authenticate, authorizeAdmin, deleteServiceStat)

export default router
