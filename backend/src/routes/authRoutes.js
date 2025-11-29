import { Router } from 'express'
import {
    createUser,
    deleteUser,
    getUser,
    listUsers,
    loginCustomer,
    loginStaff,
    profile,
    register,
    requestEmailOtp,
    requestPasswordResetOtp,
    resetPasswordWithOtp,
    updateProfile,
    updateUserRole,
    verifyEmailOtp,
} from '../controllers/authController.js'
import { authenticate, authorizeAdmin, requirePermission } from '../middleware/auth.js'
import { avatarUpload } from '../middleware/upload.js'

const router = Router()

router.post('/register', register)
router.post('/login', loginCustomer)
router.post('/admin-login', loginStaff)
router.post('/request-otp', requestEmailOtp)
router.post('/verify-otp', verifyEmailOtp)
router.post('/password/request-reset', requestPasswordResetOtp)
router.post('/password/reset', resetPasswordWithOtp)
router.get('/profile', authenticate, profile)
router.put('/profile', authenticate, avatarUpload.single('avatar'), updateProfile)
router.post('/users', authenticate, authorizeAdmin, requirePermission('manage_users'), createUser)
router.get('/users', authenticate, authorizeAdmin, requirePermission('manage_users'), listUsers)
router.get('/users/:id', authenticate, authorizeAdmin, requirePermission('manage_users'), getUser)
router.patch('/users/:id', authenticate, authorizeAdmin, requirePermission('manage_users'), updateUserRole)
router.delete('/users/:id', authenticate, authorizeAdmin, requirePermission('manage_users'), deleteUser)

export default router
