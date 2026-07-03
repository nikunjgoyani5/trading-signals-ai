import app from './app.js'
import { ensureBootstrapped } from './bootstrap.js'
import { env } from './config/env.js'
import {
  getInquiryNotifyEmailAddress,
  isInquiryEmailReady,
} from './services/email.service.js'

async function bootstrap() {
  await ensureBootstrapped()

  app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`)
    console.log(`Health: http://localhost:${env.PORT}/api/health`)
    console.log(`Default admin: ${env.ADMIN_EMAIL}`)
    console.log(`Inquiry notify email: ${getInquiryNotifyEmailAddress()}`)
    if (!isInquiryEmailReady()) {
      console.warn(
        '[email] Contact form emails will NOT send until you add GMAIL_USER + GMAIL_APP_PASSWORD',
      )
      console.warn(
        '[email] (yopmail delivery) or BREVO_API_KEY / BREVO_SMTP_KEY in tradingSignals/server/.env',
      )
    } else {
      console.log('[email] Inquiry email delivery is configured')
    }
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
