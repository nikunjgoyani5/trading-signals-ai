import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

export function getBrevoSenderEmail(): string {
  return (env.BREVO_SENDER_EMAIL ?? env.ADMIN_EMAIL).trim()
}

export function isBrevoConfigured(): boolean {
  return Boolean(env.BREVO_API_KEY?.trim() && getBrevoSenderEmail())
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

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: env.BREVO_SENDER_NAME,
        email: getBrevoSenderEmail(),
      },
      to: [{ email: toEmail, name: userName || toEmail }],
      subject: 'Reset your Trading Signals Admin password',
      htmlContent: buildPasswordResetHtml(resetUrl, userName),
      textContent: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    let detail = body
    try {
      const parsed = JSON.parse(body) as { message?: string; code?: string }
      detail = parsed.message ?? body
    } catch {
      /* keep raw body */
    }
    logger.error(`[email] Brevo API error (${response.status}): ${detail}`)
    throw new Error(formatBrevoError(response.status, detail))
  }

  logger.info(`[email] Password reset email sent to ${toEmail}`)
  return true
}
