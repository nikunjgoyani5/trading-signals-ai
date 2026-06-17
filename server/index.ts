import app from './app.js'
import { ensureBootstrapped } from './bootstrap.js'
import { env } from './config/env.js'

async function bootstrap() {
  await ensureBootstrapped()

  app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`)
    console.log(`Health: http://localhost:${env.PORT}/api/health`)
    console.log(`Default admin: ${env.ADMIN_EMAIL}`)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
