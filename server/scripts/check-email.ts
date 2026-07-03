/**
 * Check email config for contact form (does not print secrets).
 * Run: npm run check:email
 */
import 'dotenv/config'
import {
  getInquiryNotifyEmailAddress,
  isInquiryEmailReady,
} from '../services/email.service.js'
import { env } from '../config/env.js'

function mask(value: string | undefined): string {
  if (!value?.trim()) return '(not set)'
  if (value.length < 8) return '(too short)'
  return `${value.slice(0, 4)}...${value.slice(-2)} (${value.length} chars)`
}

function isPlaceholderGmail(user: string | undefined, pass: string | undefined): boolean {
  if (!user || !pass) return true
  return /your-verified|your-google|example\.com/i.test(`${user}${pass}`)
}

const brevoKey = env.BREVO_SMTP_KEY?.trim() || env.BREVO_API_KEY?.trim() || ''
const gmailUser = env.GMAIL_USER
const gmailPass = env.GMAIL_APP_PASSWORD

console.log('\n--- Trading Signals email config ---\n')
console.log('INQUIRY_NOTIFY_EMAIL:', getInquiryNotifyEmailAddress())
console.log('BREVO_API_KEY / BREVO_SMTP_KEY:', mask(brevoKey))
console.log('BREVO_SENDER_EMAIL:', env.BREVO_SENDER_EMAIL || '(not set)')
console.log('GMAIL_USER:', gmailUser || '(not set)')
console.log('GMAIL_APP_PASSWORD:', mask(gmailPass))
console.log('EMAIL_USE_GMAIL_FOR_DISPOSABLE:', env.EMAIL_USE_GMAIL_FOR_DISPOSABLE)
console.log('Ready to send inquiry emails:', isInquiryEmailReady() ? 'YES' : 'NO')

if (!isInquiryEmailReady()) {
  console.log('\nResult: NOT READY — emails will NOT reach tradingsignals@yopmail.com')
  console.log('\nFix tradingSignals/server/.env with ONE of:')
  console.log('  1) GMAIL_USER + GMAIL_APP_PASSWORD (best for yopmail)')
  console.log('  2) BREVO_SMTP_KEY=verified@email.com|xkeysib-...')
  console.log('\nThen restart server and run: npm run test:inquiry-email\n')
  process.exit(1)
}

if (isPlaceholderGmail(gmailUser, gmailPass) && !brevoKey) {
  console.log('\nResult: Gmail placeholders detected — replace with real App Password.\n')
  process.exit(1)
}

console.log('\nResult: READY. Run: npm run test:inquiry-email\n')
