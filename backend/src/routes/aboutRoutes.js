import { Router } from 'express'
import {
    getSection,
    updateSection,
    listSectionItems,
    createSectionItem,
    updateSectionItem,
    deleteSectionItem,
} from '../controllers/aboutController.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/:sectionKey', getSection)
router.put('/:sectionKey', authenticate, authorizeAdmin, updateSection)

router.get('/:sectionKey/items', listSectionItems)
router.post('/:sectionKey/items', authenticate, authorizeAdmin, createSectionItem)
router.put('/:sectionKey/items/:id', authenticate, authorizeAdmin, updateSectionItem)
router.delete('/:sectionKey/items/:id', authenticate, authorizeAdmin, deleteSectionItem)

export default router
