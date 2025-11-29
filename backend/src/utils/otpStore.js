import crypto from 'crypto'

const normalizeEmail = (value = '') => value.trim().toLowerCase()
const normalizePhone = (value = '') => value.replace(/[^0-9]/g, '')
const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes

const emailOtpStore = new Map()
const mobileOtpStore = new Map()

const upsertEntry = (store, identifier) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + OTP_TTL_MS
    store.set(identifier, {
        code,
        expiresAt,
        verified: false,
        verificationToken: null,
    })
    return { identifier, code, expiresAt }
}

const verifyCode = (store, identifier, inputCode) => {
    const entry = store.get(identifier)
    if (!entry) {
        return null
    }

    if (entry.expiresAt < Date.now()) {
        store.delete(identifier)
        return null
    }

    if (entry.code !== String(inputCode).trim()) {
        return null
    }

    const verificationToken = crypto.randomUUID()
    entry.verified = true
    entry.verificationToken = verificationToken
    return { verificationToken }
}

const consumeVerifiedToken = (store, identifier, verificationToken) => {
    const entry = store.get(identifier)
    if (!entry) {
        return false
    }

    if (entry.expiresAt < Date.now()) {
        store.delete(identifier)
        return false
    }

    if (!entry.verified || entry.verificationToken !== verificationToken) {
        return false
    }

    store.delete(identifier)
    return true
}

const discardEntry = (store, identifier) => store.delete(identifier)

export const createEmailOtp = (email) => {
    const normalized = normalizeEmail(email)
    return upsertEntry(emailOtpStore, normalized)
}

export const verifyEmailOtpCode = (email, inputCode) => {
    const normalized = normalizeEmail(email)
    return verifyCode(emailOtpStore, normalized, inputCode)
}

export const consumeVerifiedEmailToken = (email, verificationToken) => {
    const normalized = normalizeEmail(email)
    return consumeVerifiedToken(emailOtpStore, normalized, verificationToken)
}

export const discardEmailOtp = (email) => {
    const normalized = normalizeEmail(email)
    return discardEntry(emailOtpStore, normalized)
}

export const createMobileOtp = (phoneNumber) => {
    const normalized = normalizePhone(phoneNumber)
    return upsertEntry(mobileOtpStore, normalized)
}

export const verifyMobileOtpCode = (phoneNumber, inputCode) => {
    const normalized = normalizePhone(phoneNumber)
    return verifyCode(mobileOtpStore, normalized, inputCode)
}

export const consumeVerifiedMobileToken = (phoneNumber, verificationToken) => {
    const normalized = normalizePhone(phoneNumber)
    return consumeVerifiedToken(mobileOtpStore, normalized, verificationToken)
}

export const discardMobileOtp = (phoneNumber) => {
    const normalized = normalizePhone(phoneNumber)
    return discardEntry(mobileOtpStore, normalized)
}

export const formatMobileNumber = (countryCode = '', phone = '') => normalizePhone(`${countryCode}${phone}`)
