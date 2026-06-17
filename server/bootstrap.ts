import { connectDatabase } from './config/database.js'
import { ensureDefaultAdmin } from './services/auth.service.js'
import { migrateLegacyBlogStatuses } from './services/blogMigration.service.js'

let bootstrapped = false
let bootstrapPromise: Promise<void> | null = null

export async function ensureBootstrapped(): Promise<void> {
  if (bootstrapped) return

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      await connectDatabase()
      await migrateLegacyBlogStatuses()
      await ensureDefaultAdmin()
      bootstrapped = true
    })().catch((error) => {
      bootstrapPromise = null
      throw error
    })
  }

  await bootstrapPromise
}
