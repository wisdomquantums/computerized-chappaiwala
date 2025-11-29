import nodemailer from 'nodemailer'

const parseBoolean = (value, defaultValue = true) => {
    if (value === undefined) return defaultValue
    return value === 'true' || value === true || value === 1 || value === '1'
}

const hasAuthCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)

const baseTransportConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: parseBoolean(process.env.EMAIL_SECURE, true),
    auth: hasAuthCredentials
        ? {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
        : undefined,
}

const transporter = hasAuthCredentials ? nodemailer.createTransport(baseTransportConfig) : null

export const isEmailConfigured = () => Boolean(transporter)

export const sendMail = async (options = {}) => {
    if (!transporter) {
        throw new Error('Email transport is not configured. Set EMAIL_USER and EMAIL_PASS in the environment.')
    }

    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER
    const payload = {
        from: fromAddress,
        ...options,
    }

    return transporter.sendMail(payload)
}
