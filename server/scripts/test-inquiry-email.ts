/**
 * Send a test inquiry email pair. Run: npm run test:inquiry-email
 */
import 'dotenv/config'
import { sendInquiryEmails } from '../services/email.service.js'

const testInquiry = {
  ticketNumber: 'TSAI-TEST-0001',
  firstName: 'Test',
  lastName: 'User',
  email: process.env.TEST_USER_EMAIL ?? 'test@yopmail.com',
  phone: '+4712345678',
  message: 'Test inquiry email from script.',
} as Parameters<typeof sendInquiryEmails>[0]

async function main() {
  console.log('Sending test emails...')
  console.log('  Admin (INQUIRY_NOTIFY_EMAIL):', process.env.INQUIRY_NOTIFY_EMAIL)
  console.log('  User confirmation:', testInquiry.email)
  const result = await sendInquiryEmails(testInquiry)
  console.log('Done:', result)
  console.log('Check yopmail inbox or Brevo → Transactional → Logs.')
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  console.error('Failed:', message)
  console.error(
    '\nFix: add BREVO_SMTP_KEY or GMAIL_USER + GMAIL_APP_PASSWORD to tradingSignals/server/.env',
  )
  process.exit(1)
})
