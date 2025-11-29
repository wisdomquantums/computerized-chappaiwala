import { Router } from 'express'
import { createRole, deleteRole, getRole, listRoles, updateRole, updateRolePermissions } from '../controllers/roleController.js'
import { authenticate, authorizeAdmin, requirePermission } from '../middleware/auth.js'

const router = Router()

router.use(authenticate, authorizeAdmin, requirePermission('manage_roles'))

router.get('/', listRoles)
router.post('/', createRole)
router.get('/:roleName', getRole)
router.patch('/:roleName', updateRole)
router.put('/:roleName/permissions', updateRolePermissions)
router.delete('/:roleName', deleteRole)

export default router
