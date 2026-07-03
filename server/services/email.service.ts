import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'
import type { InquiryDocument } from '../models/inquiry.model.js'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const BREVO_SENDERS_URL = 'https://api.brevo.com/v3/senders'
const BREVO_SMTP_HOST = 'smtp-relay.brevo.com'
const BREVO_SMTP_PORT = 587

const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  'yopmail.com',
]

type BrevoApiConfig = {
  mode: 'api'
  apiKey: string
  senderEmail: string | null
}

type BrevoSmtpConfig = {
  mode: 'smtp'
  user: string
  pass: string
}

type BrevoConfig = BrevoApiConfig | BrevoSmtpConfig

function isPlaceholderBrevoKey(raw: string): boolean {
  if (/your-api-key|xkeysib-your|xsmtpsib-your|change-me|example\.com\|/i.test(raw)) {
    return true
  }
  if (raw.startsWith('xkeysib-') && raw.length < 50) {
    return true
  }
  if (raw.startsWith('xsmtpsib-') && raw.length < 50) {
    return true
  }
  return false
}

function parseBrevoSmtpKey(raw: string): BrevoConfig | null {
  const separator = raw.includes('|') ? '|' : raw.includes(':') ? ':' : null

  if (separator) {
    const [user, key] = raw.split(separator).map((part) => part.trim())
    if (!user || !key) {
      return null
    }
    if (key.startsWith('xkeysib-')) {
      return { mode: 'api', apiKey: key, senderEmail: user }
    }
    if (key.startsWith('xsmtpsib-')) {
      return { mode: 'smtp', user, pass: key }
    }
    return null
  }

  if (raw.startsWith('xkeysib-')) {
    return { mode: 'api', apiKey: raw, senderEmail: null }
  }

  return null
}

function resolveBrevoConfig(): BrevoConfig | null {
  const directKey = env.BREVO_API_KEY?.trim()
  if (directKey && !isPlaceholderBrevoKey(directKey)) {
    return {
      mode: 'api',
      apiKey: directKey,
      senderEmail: env.BREVO_SENDER_EMAIL?.trim() ?? null,
    }
  }

  const smtpKey = env.BREVO_SMTP_KEY?.trim()
  if (!smtpKey || isPlaceholderBrevoKey(smtpKey)) {
    return null
  }

  return parseBrevoSmtpKey(smtpKey)
}

export function getBrevoSenderEmail(): string {
  return (env.BREVO_SENDER_EMAIL ?? env.ADMIN_EMAIL).trim()
}

export function isBrevoConfigured(): boolean {
  return Boolean(resolveBrevoConfig() && getBrevoSenderEmail())
}

const INQUIRY_NOTIFY_DEFAULT = 'tradingsignals@yopmail.com'

function getInquiryNotifyEmail(): string {
  return (env.INQUIRY_NOTIFY_EMAIL || INQUIRY_NOTIFY_DEFAULT).trim()
}

export function getInquiryNotifyEmailAddress(): string {
  return getInquiryNotifyEmail()
}

export function isInquiryEmailReady(): boolean {
  return Boolean(resolveBrevoConfig() || getGmailConfig())
}

function isDisposableRecipient(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return DISPOSABLE_DOMAINS.includes(domain ?? '')
}

function getGmailConfig() {
  const user = env.GMAIL_USER?.trim()
  const pass = env.GMAIL_APP_PASSWORD?.trim()
  if (!user || !pass || /your-verified|your-google|example\.com/i.test(user + pass)) {
    return null
  }
  return { user, pass }
}

function shouldUseGmailForRecipient(toEmail: string): boolean {
  if (env.EMAIL_USE_GMAIL_FOR_DISPOSABLE === false) {
    return false
  }
  if (!getGmailConfig()) {
    return false
  }
  return isDisposableRecipient(toEmail)
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function getVerifiedSenders(apiKey: string) {
  const res = await fetch(BREVO_SENDERS_URL, {
    headers: { 'api-key': apiKey, accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Could not load senders from Brevo. Check your API key.')
  }

  const data = (await res.json()) as { senders?: Array<{ email?: string; active?: boolean }> }
  return data.senders?.filter((sender) => sender.active !== false && sender.email) ?? []
}

async function resolveApiSenderEmail(apiKey: string, configuredSender: string | null): Promise<string> {
  const verified = await getVerifiedSenders(apiKey)

  if (!verified.length) {
    throw new Error('No verified sender in Brevo. Add & verify an email in Brevo → Senders.')
  }

  if (configuredSender) {
    const match = verified.find(
      (sender) => sender.email?.toLowerCase() === configuredSender.toLowerCase(),
    )
    if (match?.email) {
      return match.email
    }
    logger.warn(
      `[email] BREVO_SENDER_EMAIL "${configuredSender}" is not verified. Sending from "${verified[0].email}" instead.`,
    )
  }

  return verified[0].email!
}

async function sendViaBrevoApi(options: {
  apiKey: string
  senderEmail: string
  toEmail: string
  subject: string
  html: string
  replyTo?: string
}) {
  const payload: Record<string, unknown> = {
    sender: { name: env.BREVO_SENDER_NAME, email: options.senderEmail },
    to: [{ email: options.toEmail }],
    subject: options.subject,
    htmlContent: options.html,
    textContent: stripHtml(options.html),
  }

  if (options.replyTo) {
    payload.replyTo = { email: options.replyTo }
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': options.apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    let detail = body
    try {
      const parsed = JSON.parse(body) as { message?: string }
      detail = parsed.message ?? body
    } catch {
      /* keep raw body */
    }
    throw new Error(formatBrevoError(response.status, detail))
  }
}

async function sendViaGmail(options: {
  toEmail: string
  subject: string
  html: string
  replyTo?: string
}) {
  const gmail = getGmailConfig()
  if (!gmail) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD are required in server/.env')
  }

  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: gmail.user, pass: gmail.pass },
  })

  await transporter.sendMail({
    from: `"${env.BREVO_SENDER_NAME}" <${gmail.user}>`,
    to: options.toEmail,
    replyTo: options.replyTo || gmail.user,
    subject: options.subject,
    html: options.html,
    text: stripHtml(options.html),
  })
}

async function sendViaBrevoSmtp(options: {
  user: string
  pass: string
  toEmail: string
  subject: string
  html: string
  replyTo?: string
}) {
  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: BREVO_SMTP_PORT,
    secure: false,
    auth: { user: options.user, pass: options.pass },
  })

  await transporter.sendMail({
    from: `"${env.BREVO_SENDER_NAME}" <${options.user}>`,
    to: options.toEmail,
    replyTo: options.replyTo || options.user,
    subject: options.subject,
    html: options.html,
    text: stripHtml(options.html),
  })
}

function logDevEmailFallback(toEmail: string, subject: string, reason: string) {
  logger.warn(`[email] NOT sent (${reason}). To: ${toEmail}, Subject: ${subject}`)
}

async function sendHtmlEmail(options: {
  toEmail: string
  subject: string
  html: string
  replyTo?: string
  strict?: boolean
}): Promise<{ emailSent: boolean; devMode?: boolean; transport?: string }> {
  const config = resolveBrevoConfig()
  const isDev = env.NODE_ENV !== 'production'
  const mustSend = options.strict || !isDev
  const useGmail = shouldUseGmailForRecipient(options.toEmail)

  if (useGmail) {
    try {
      await sendViaGmail(options)
      logger.info(`[email] Sent via Gmail SMTP to ${options.toEmail}`)
      if (isDisposableRecipient(options.toEmail)) {
        logger.info(
          `[email] yopmail tip: open https://yopmail.com → inbox: ${options.toEmail.split('@')[0]}`,
        )
      }
      return { emailSent: true, transport: 'gmail' }
    } catch (gmailError) {
      const message = gmailError instanceof Error ? gmailError.message : String(gmailError)
      logger.error(`[email] Gmail SMTP error: ${message}`)
      if (!config) {
        if (!mustSend) {
          logDevEmailFallback(options.toEmail, options.subject, message)
          return { emailSent: false, devMode: true }
        }
        throw gmailError
      }
      logger.warn('[email] Falling back to Brevo after Gmail error.')
    }
  }

  if (!config) {
    const reason = 'Brevo is not configured. Set BREVO_API_KEY or BREVO_SMTP_KEY in server/.env'
    if (!mustSend) {
      logDevEmailFallback(options.toEmail, options.subject, reason)
      return { emailSent: false, devMode: true }
    }
    throw new Error(reason)
  }

  try {
    if (config.mode === 'smtp') {
      await sendViaBrevoSmtp({
        user: config.user,
        pass: config.pass,
        ...options,
      })
    } else {
      const senderEmail = await resolveApiSenderEmail(
        config.apiKey,
        config.senderEmail ?? env.BREVO_SENDER_EMAIL?.trim() ?? null,
      )
      await sendViaBrevoApi({
        apiKey: config.apiKey,
        senderEmail,
        ...options,
      })
    }

    logger.info(`[email] Sent via Brevo to ${options.toEmail}`)
    return { emailSent: true, transport: 'brevo' }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error(`[email] Brevo error: ${message}`)

    if (!mustSend) {
      logDevEmailFallback(options.toEmail, options.subject, message)
      return { emailSent: false, devMode: true }
    }

    throw error
  }
}

function buildInquiryAdminHtml(inquiry: InquiryDocument): string {
  const fullName = `${inquiry.firstName} ${inquiry.lastName}`
  return `
    <div style="font-family: sans-serif; max-width: 560px;">
      <h2>New contact inquiry</h2>
      <p><strong>Ticket:</strong> ${inquiry.ticketNumber}</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Phone:</strong> ${inquiry.phone || '-'}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;color:#333;">${inquiry.message}</p>
    </div>
  `
}

function buildInquiryConfirmationHtml(inquiry: InquiryDocument): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2>Thank you for contacting us</h2>
      <p>Your email was successfully received and a ticket has been generated.</p>
      <p><strong>Ticket number:</strong> ${inquiry.ticketNumber}</p>
      <p>Our team will review your message and get back to you soon.</p>
      <p style="color:#888;font-size:14px;">Trading Signals AI</p>
    </div>
  `
}

export async function sendInquiryEmails(inquiry: InquiryDocument) {
  const notifyEmail = getInquiryNotifyEmail()
  const adminSubject = `New inquiry ${inquiry.ticketNumber} - Trading Signals AI`
  const userSubject = `Your inquiry ticket ${inquiry.ticketNumber} - Trading Signals AI`

  logger.info(`[inquiry] Sending admin notification to ${notifyEmail}`)

  const adminResult = await sendHtmlEmail({
    toEmail: notifyEmail,
    subject: adminSubject,
    html: buildInquiryAdminHtml(inquiry),
    replyTo: inquiry.email,
    strict: true,
  })

  let userSent = false
  try {
    const userResult = await sendHtmlEmail({
      toEmail: inquiry.email,
      subject: userSubject,
      html: buildInquiryConfirmationHtml(inquiry),
      replyTo: notifyEmail,
      strict: true,
    })
    userSent = userResult.emailSent
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.warn(`[inquiry] User confirmation email failed (${inquiry.email}): ${message}`)
  }

  const result = {
    notifyEmail,
    adminSent: adminResult.emailSent,
    userSent,
  }

  if (!result.adminSent) {
    throw new Error(
      `Could not send inquiry notification to ${notifyEmail}. ` +
        'Add GMAIL_USER + GMAIL_APP_PASSWORD (for yopmail) or BREVO_SMTP_KEY in tradingSignals/server/.env',
    )
  }

  return result
}

function buildPasswordResetHtml(resetUrl: string, userName: string): string {
  const safeName = userName.trim() || 'there'

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#010b24;font-family:Segoe UI,Roboto,sans-serif;color:#f9f9f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#010b24;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0b1736;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#12d7f5;">Trading Signals Admin</p>
                <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#ffffff;">Reset your password</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#c7ccd2;">
                  Hi ${safeName}, we received a request to reset your admin account password.
                  Click the button below to choose a new password. This link expires in 1 hour.
                </p>
                <p style="margin:0 0 28px;text-align:center;">
                  <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;border-radius:10px;background:linear-gradient(90deg,#123dff,#12d7f5);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                    Reset password
                  </a>
                </p>
                <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#adb1b8;">
                  If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="margin:0 0 24px;font-size:12px;line-height:1.5;word-break:break-all;color:#12d7f5;">
                  <a href="${resetUrl}" style="color:#12d7f5;">${resetUrl}</a>
                </p>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">
                  If you did not request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim()
}

function formatBrevoError(status: number, detail: string): string {
  const lower = detail.toLowerCase()
  if (
    status === 401 &&
    (lower.includes('unrecognised ip') ||
      lower.includes('unrecognized ip') ||
      lower.includes('authorised_ips') ||
      lower.includes('authorized_ips'))
  ) {
    return (
      'Brevo blocked the request from the server IP (Vercel). ' +
      'In Brevo go to Security → Authorized IPs and either disable IP restriction ' +
      'or allow cloud/serverless IPs. See https://app.brevo.com/security/authorised_ips'
    )
  }
  return `Brevo rejected the email (${status}): ${detail}`
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetUrl: string,
  userName: string,
): Promise<boolean> {
  if (!isBrevoConfigured()) {
    logger.warn(`[email] Brevo not configured. Password reset link for ${toEmail}: ${resetUrl}`)
    return false
  }

  const config = resolveBrevoConfig()
  if (!config || config.mode !== 'api') {
    logger.warn(`[email] Password reset requires Brevo API key. Link for ${toEmail}: ${resetUrl}`)
    return false
  }

  const senderEmail = await resolveApiSenderEmail(
    config.apiKey,
    config.senderEmail ?? env.BREVO_SENDER_EMAIL?.trim() ?? null,
  )

  await sendViaBrevoApi({
    apiKey: config.apiKey,
    senderEmail,
    toEmail,
    subject: 'Reset your Trading Signals Admin password',
    html: buildPasswordResetHtml(resetUrl, userName),
  })

  logger.info(`[email] Password reset email sent to ${toEmail}`)
  return true
}
