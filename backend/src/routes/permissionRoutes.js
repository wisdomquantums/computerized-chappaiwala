import { Router } from 'express'
import { createPermission, listPermissions } from '../controllers/permissionController.js'
import { authenticate, authorizeAdmin, requirePermission } from '../middleware/auth.js'

const router = Router()

router.use(authenticate, authorizeAdmin, requirePermission('manage_roles'))

router.get('/', listPermissions)
router.post('/', createPermission)

export default router
