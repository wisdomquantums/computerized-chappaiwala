import { sendMail, isEmailConfigured } from '../config/mailer.js'

const BRAND_NAME = 'Computerized Chhappaiwala'

const minutesUntil = (timestamp) => Math.max(1, Math.ceil((timestamp - Date.now()) / 60000))

const buildOtpTemplate = (intent, code, minutes) => {
    const shared = {
        footer: 'Please do not share this code with anyone.',
        expiry: `This code expires in ${minutes} minute(s).`,
    }

    if (intent === 'password-reset') {
        return {
            subject: 'Reset your password',
            heading: 'Reset your password',
            body: `Use the code below to set a new password for your ${BRAND_NAME} account.`,
            ...shared,
        }
    }

    return {
        subject: 'Verify your email',
        heading: 'Verify your email',
        body: `Use the code below to finish creating your ${BRAND_NAME} account.`,
        ...shared,
    }
}

export const sendEmailOtpMessage = async ({ to, code, expiresAt, intent = 'register' }) => {
    const otpLifespanMinutes = minutesUntil(expiresAt)
    const template = buildOtpTemplate(intent, code, otpLifespanMinutes)
    const text = `${template.body} Code: ${code}. ${template.expiry}`
    const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5;">
            <h2 style="margin-bottom: 8px;">${template.heading}</h2>
            <p style="margin: 0 0 16px;">${template.body}</p>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0 0 16px;">${code}</p>
            <p style="margin: 0 0 16px;">${template.expiry}</p>
            <p style="color: #64748b; font-size: 12px;">${template.footer}</p>
        </div>
    `

    await sendMail({ to, subject: template.subject, text, html })
}

export const ensureEmailConfigured = () => {
    if (!isEmailConfigured()) {
        throw new Error('Email transport is not configured')
    }
}
