import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
    createAddress,
    deleteAddress,
    listAddresses,
    markDefaultAddress,
    updateAddress,
} from '../controllers/addressController.js'

const router = Router()

router.use(authenticate)

router.get('/', listAddresses)
router.post('/', createAddress)
router.put('/:id', updateAddress)
router.delete('/:id', deleteAddress)
router.post('/:id/default', markDefaultAddress)

export default router
