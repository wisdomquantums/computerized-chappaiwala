import { Router } from 'express'
import {
    createPortfolioItem,
    deletePortfolioItem,
    listPortfolio,
    updatePortfolioItem,
    getPortfolioPageContent,
    updatePortfolioPageContent,
    listPortfolioListItems,
    createPortfolioListItem,
    updatePortfolioListItem,
    deletePortfolioListItem,
} from '../controllers/portfolioController.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/page/content', getPortfolioPageContent)
router.put('/page/content', authenticate, authorizeAdmin, updatePortfolioPageContent)

router.get('/page/lists/:listType', listPortfolioListItems)
router.post('/page/lists/:listType', authenticate, authorizeAdmin, createPortfolioListItem)
router.put('/page/lists/:listType/:id', authenticate, authorizeAdmin, updatePortfolioListItem)
router.delete('/page/lists/:listType/:id', authenticate, authorizeAdmin, deletePortfolioListItem)

router.get('/projects', listPortfolio)
router.post('/projects', authenticate, authorizeAdmin, createPortfolioItem)
router.put('/projects/:id', authenticate, authorizeAdmin, updatePortfolioItem)
router.delete('/projects/:id', authenticate, authorizeAdmin, deletePortfolioItem)

// Legacy aliases for backward compatibility
router.get('/', listPortfolio)
router.post('/', authenticate, authorizeAdmin, createPortfolioItem)

export default router
