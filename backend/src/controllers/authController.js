import bcrypt from 'bcryptjs'
import { Role, User } from '../models/index.js'
import { signToken } from '../utils/token.js'
import { canManageRole } from '../utils/rbac.js'
import {
    consumeVerifiedEmailToken,
    createEmailOtp,
    discardEmailOtp,
    formatMobileNumber,
    verifyEmailOtpCode,
} from '../utils/otpStore.js'
import { sendEmailOtpMessage } from '../utils/email.js'

const setNoStore = (res) => {
    if (res?.set) {
        res.set('Cache-Control', 'no-store')
    }
}

const sanitizeRoleMeta = (roleMeta) => {
    if (!roleMeta) {
        return null
    }
    const plain = typeof roleMeta.toJSON === 'function' ? roleMeta.toJSON() : roleMeta
    return {
        name: plain.name,
        label: plain.label,
        description: plain.description,
    }
}

const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    company: user.company,
    designation: user.designation,
    gstNumber: user.gstNumber,
    addressText: user.address || null,
    address: {
        line1: user.addressLine1,
        line2: user.addressLine2,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
    },
    preferences: user.preferences || {},
    roleMeta: sanitizeRoleMeta(user.roleMeta),
})
const normalizeRoleName = (value = '') => value.trim().toLowerCase()

const resolveIdentifierQuery = (identifierInput) => {
    if (!identifierInput) {
        return null
    }
    const trimmed = identifierInput.trim().toLowerCase()
    if (!trimmed) {
        return null
    }

    if (trimmed.includes('@')) {
        return { field: 'email', value: trimmed }
    }

    return { field: 'username', value: trimmed }
}

const findUserByIdentifier = async (identifierInput) => {
    const query = resolveIdentifierQuery(identifierInput)
    if (!query) {
        return null
    }
    return User.findOne({ where: { [query.field]: query.value } })
}

const loginHandler = async (req, res, next, allowedRoles, forbiddenMessage) => {
    try {
        const { password } = req.body
        const identifierInput = req.body.identifier || req.body.email || req.body.username

        if (!identifierInput || !password) {
            return res.status(400).json({ message: 'Email/username and password are required' })
        }

        const user = await findUserByIdentifier(identifierInput)
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        if (user.status === 'inactive') {
            return res.status(403).json({ message: 'Account is inactive. Contact support.' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: forbiddenMessage || 'You are not allowed to access this area.' })
        }

        const token = signToken({ id: user.id, role: user.role })
        return res.json({ user: sanitizeUser(user), token })
    } catch (error) {
        next(error)
    }
}

export const register = async (req, res, next) => {
    try {
        const {
            name,
            username,
            email,
            password,
            address,
            verificationToken,
            contactNumber,
            contactCountryCode,
        } = req.body

        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'Name, username, email, and password are required' })
        }

        if (!verificationToken) {
            return res.status(400).json({ message: 'Email OTP verification is required' })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const normalizedUsername = username.trim().toLowerCase()
        const normalizedMobile =
            contactCountryCode && contactNumber ? formatMobileNumber(contactCountryCode, contactNumber) : null

        const hasVerifiedOtp = consumeVerifiedEmailToken(normalizedEmail, verificationToken)

        if (!hasVerifiedOtp) {
            return res.status(403).json({ message: 'Please verify your email via OTP before registering.' })
        }

        const existingByEmail = await User.findOne({ where: { email: normalizedEmail } })
        if (existingByEmail) {
            return res.status(409).json({ message: 'Email already registered' })
        }

        const existingByUsername = await User.findOne({ where: { username: normalizedUsername } })
        if (existingByUsername) {
            return res.status(409).json({ message: 'Username already taken' })
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashed,
            role: 'customer',
            address: address?.trim() || null,
            emailVerifiedAt: verificationToken ? new Date() : null,
            mobileNumber: normalizedMobile,
        })
        const token = signToken({ id: user.id, role: user.role })

        res.status(201).json({
            user: sanitizeUser(user),
            token,
        })
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role = 'customer', status = 'active', username, address } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const normalizedRole = normalizeRoleName(role)
        if (!normalizedRole) {
            return res.status(400).json({ message: 'Role is required' })
        }

        const targetRole = await Role.findOne({ where: { name: normalizedRole } })
        if (!targetRole) {
            return res.status(400).json({ message: 'Role does not exist' })
        }

        if (!canManageRole(req.user?.role, normalizedRole)) {
            return res.status(403).json({ message: 'You are not allowed to create this role' })
        }

        const existing = await User.findOne({ where: { email: normalizedEmail } })
        if (existing) {
            return res.status(409).json({ message: 'User already exists' })
        }

        let normalizedUsername = username?.trim()
        if (!normalizedUsername) {
            normalizedUsername = `${name.split(' ')[0] || 'user'}_${Date.now()}`.toLowerCase()
        }

        const usernameExists = await User.findOne({ where: { username: normalizedUsername } })
        if (usernameExists) {
            return res.status(409).json({ message: 'Username already exists' })
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            username: normalizedUsername,
            email: normalizedEmail,
            address: address?.trim() || null,
            password: hashed,
            role: normalizedRole,
            status: status === 'inactive' ? 'inactive' : 'active',
        })

        await user.reload({
            include: [
                {
                    model: Role,
                    as: 'roleMeta',
                    attributes: ['name', 'label', 'description'],
                },
            ],
        })

        setNoStore(res)
        res.status(201).json({ user: sanitizeUser(user) })
    } catch (error) {
        next(error)
    }
}

export const loginCustomer = (req, res, next) => loginHandler(req, res, next, ['customer'], 'Customer account required for this portal.')

export const loginStaff = (req, res, next) =>
    loginHandler(req, res, next, ['admin', 'owner', 'employee'], 'Staff account required for this portal.')

export const requestEmailOtp = async (req, res) => {
    const { email } = req.body || {}
    if (!email) {
        return res.status(400).json({ message: 'Email is required' })
    }
    const { code, expiresAt } = createEmailOtp(email)

    try {
        await sendEmailOtpMessage({ to: email, code, expiresAt, intent: 'register' })
    } catch (error) {
        console.error('Failed to send OTP email:', error)
        return res.status(500).json({ message: 'Unable to send OTP email. Please try again later.' })
    }

    if (process.env.NODE_ENV !== 'production') {
        console.info(`OTP for ${email}: ${code}`)
    }

    return res.json({
        message: 'OTP sent to your email address',
        expiresIn: Math.floor((expiresAt - Date.now()) / 1000),
        debugCode: process.env.NODE_ENV === 'production' ? undefined : code,
    })
}

export const requestPasswordResetOtp = async (req, res) => {
    const { identifier } = req.body || {}
    if (!identifier) {
        return res.status(400).json({ message: 'Email or username is required' })
    }

    const user = await findUserByIdentifier(identifier)
    if (!user) {
        return res.status(404).json({ message: 'Account not found' })
    }

    const { code, expiresAt } = createEmailOtp(user.email)

    try {
        await sendEmailOtpMessage({ to: user.email, code, expiresAt, intent: 'password-reset' })
    } catch (error) {
        console.error('Failed to send password reset OTP:', error)
        return res.status(500).json({ message: 'Unable to send OTP email. Please try again later.' })
    }

    if (process.env.NODE_ENV !== 'production') {
        console.info(`Password reset OTP for ${user.email}: ${code}`)
    }

    return res.json({
        message: 'OTP sent to your email address',
        expiresIn: Math.floor((expiresAt - Date.now()) / 1000),
    })
}

export const resetPasswordWithOtp = async (req, res, next) => {
    try {
        const { identifier, otp, newPassword } = req.body || {}

        if (!identifier || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email/username, OTP, and new password are required' })
        }

        if (String(newPassword).length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' })
        }

        const user = await findUserByIdentifier(identifier)
        if (!user) {
            return res.status(404).json({ message: 'Account not found' })
        }

        const verificationResult = verifyEmailOtpCode(user.email, otp)
        if (!verificationResult) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        const hashed = await bcrypt.hash(newPassword, 10)
        user.password = hashed
        if (!user.emailVerifiedAt) {
            user.emailVerifiedAt = new Date()
        }
        await user.save()
        discardEmailOtp(user.email)

        return res.json({ message: 'Password reset successful. You can now sign in with your new password.' })
    } catch (error) {
        next(error)
    }
}

export const verifyEmailOtp = async (req, res) => {
    const { email, otp } = req.body || {}
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' })
    }

    const result = verifyEmailOtpCode(email, otp)
    if (!result) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    return res.json({
        message: 'Email verified successfully',
        verificationToken: result.verificationToken,
    })
}

export const profile = async (req, res) => {
    const user = req.user
    setNoStore(res)
    res.json({ user: sanitizeUser(user) })
}

export const updateProfile = async (req, res, next) => {
    try {
        const payload = req.body || {}
        const user = await User.findByPk(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'Profile not found' })
        }

        const assignString = (field, value) => {
            if (typeof value === 'undefined') {
                return
            }
            user[field] = value?.trim() ? value.trim() : null
        }

        assignString('name', payload.name)
        assignString('mobileNumber', payload.phone)
        assignString('company', payload.company)
        assignString('designation', payload.designation)
        assignString('gstNumber', payload.gstNumber)
        assignString('addressLine1', payload.addressLine1)
        assignString('addressLine2', payload.addressLine2)
        assignString('city', payload.city)
        assignString('state', payload.state)
        assignString('pincode', payload.pincode)

        if (typeof payload.preferences !== 'undefined') {
            let nextPreferences = payload.preferences
            if (typeof nextPreferences === 'string') {
                try {
                    nextPreferences = JSON.parse(nextPreferences)
                } catch (error) {
                    nextPreferences = {}
                }
            }
            user.preferences = {
                ...(user.preferences || {}),
                ...(nextPreferences || {}),
            }
        }

        if (req.file) {
            const publicPath = `/uploads/avatars/${req.file.filename}`
            const baseUrl = `${req.protocol}://${req.get('host')}`
            user.avatarUrl = `${baseUrl}${publicPath}`
        }

        await user.save()
        req.user = user

        return res.json({ user: sanitizeUser(user) })
    } catch (error) {
        next(error)
    }
}

export const listUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Role,
                    as: 'roleMeta',
                    attributes: ['name', 'label', 'description'],
                },
            ],
        })
        const normalized = users.map((user) => sanitizeUser(user))
        setNoStore(res)
        res.json({ users: normalized })
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Role,
                    as: 'roleMeta',
                    attributes: ['name', 'label', 'description'],
                },
            ],
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        setNoStore(res)
        res.json({ user })
    } catch (error) {
        next(error)
    }
}

export const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params
        const {
            role,
            status,
            name,
            username,
            email,
            password,
            address,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
        } = req.body

        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!canManageRole(req.user?.role, user.role)) {
            return res.status(403).json({ message: 'You are not allowed to update this account' })
        }

        if (role) {
            const normalizedRole = normalizeRoleName(role)
            if (!normalizedRole) {
                return res.status(400).json({ message: 'Role is required' })
            }

            const roleExists = await Role.findOne({ where: { name: normalizedRole } })
            if (!roleExists) {
                return res.status(400).json({ message: 'Role does not exist' })
            }

            if (!canManageRole(req.user?.role, normalizedRole)) {
                return res.status(403).json({ message: 'You cannot assign this role' })
            }

            user.role = normalizedRole
        }

        if (status) {
            const nextStatus = status === 'active' || status === 'inactive' ? status : null
            if (!nextStatus) {
                return res.status(400).json({ message: 'Status must be active or inactive' })
            }
            user.status = nextStatus
        }

        if (typeof name !== 'undefined') {
            const trimmed = String(name).trim()
            if (!trimmed) {
                return res.status(400).json({ message: 'Name cannot be empty' })
            }
            user.name = trimmed
        }

        if (typeof username !== 'undefined') {
            const trimmed = String(username).trim().toLowerCase()
            if (!trimmed) {
                return res.status(400).json({ message: 'Username cannot be empty' })
            }
            if (trimmed !== user.username) {
                const usernameExists = await User.findOne({ where: { username: trimmed } })
                if (usernameExists && usernameExists.id !== user.id) {
                    return res.status(409).json({ message: 'Username already exists' })
                }
                user.username = trimmed
            }
        }

        if (typeof email !== 'undefined') {
            const normalizedEmail = String(email).trim().toLowerCase()
            if (!normalizedEmail) {
                return res.status(400).json({ message: 'Email cannot be empty' })
            }
            if (normalizedEmail !== user.email) {
                const emailExists = await User.findOne({ where: { email: normalizedEmail } })
                if (emailExists && emailExists.id !== user.id) {
                    return res.status(409).json({ message: 'Email already exists' })
                }
                user.email = normalizedEmail
            }
        }

        if (typeof password !== 'undefined' && password !== null && String(password).length > 0) {
            if (String(password).length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' })
            }
            user.password = await bcrypt.hash(password, 10)
        }

        const assignOptionalField = (field, value) => {
            if (typeof value === 'undefined') {
                return
            }
            user[field] = value && String(value).trim() ? String(value).trim() : null
        }

        assignOptionalField('address', address)
        assignOptionalField('addressLine1', addressLine1)
        assignOptionalField('addressLine2', addressLine2)
        assignOptionalField('city', city)
        assignOptionalField('state', state)
        assignOptionalField('pincode', pincode)

        await user.save()
        await user.reload({
            include: [
                {
                    model: Role,
                    as: 'roleMeta',
                    attributes: ['name', 'label', 'description'],
                },
            ],
        })
        setNoStore(res)
        res.json({ user: sanitizeUser(user) })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        if (req.user?.id === id) {
            return res.status(400).json({ message: 'You cannot delete your own account' })
        }

        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!canManageRole(req.user?.role, user.role)) {
            return res.status(403).json({ message: 'You are not allowed to delete this account' })
        }

        if (user.role === 'admin') {
            const admins = await User.count({ where: { role: 'admin' } })
            if (admins <= 1) {
                return res.status(409).json({ message: 'Cannot delete the last admin account' })
            }
        }

        await user.destroy()
        setNoStore(res)
        res.json({ message: 'User deleted' })
    } catch (error) {
        next(error)
    }
}
