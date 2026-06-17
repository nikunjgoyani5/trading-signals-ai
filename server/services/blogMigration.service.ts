import { Blog } from '../models/blog.model.js'
import { AppMigration } from '../models/appMigration.model.js'
import { logger } from '../utils/logger.js'

async function hasMigration(name: string): Promise<boolean> {
  const existing = await AppMigration.findOne({ name }).lean()
  return Boolean(existing)
}

async function markMigration(name: string): Promise<void> {
  await AppMigration.updateOne({ name }, { $setOnInsert: { name, ranAt: new Date() } }, { upsert: true })
}

/**
 * One-time migrations so existing library posts become published (per product decision).
 * New posts created after these run stay draft by default.
 */
export async function migrateLegacyBlogStatuses(): Promise<void> {
  if (!(await hasMigration('blog_status_v1_missing_field'))) {
    const missingStatus = await Blog.updateMany(
      { $or: [{ status: { $exists: false } }, { status: null }] },
      [
        {
          $set: {
            status: 'published',
            publishedAt: { $ifNull: ['$publishedAt', '$createdAt'] },
            archivedAt: null,
          },
        },
      ],
    )

    if (missingStatus.modifiedCount > 0) {
      logger.info(
        `[blogs] Migrated ${missingStatus.modifiedCount} post(s) missing status → published`,
      )
    }

    await markMigration('blog_status_v1_missing_field')
  }

  // Fix: Mongoose default "draft" was stored on existing posts before migration ran.
  // One-time — publish all non-archived drafts that were never actually published.
  if (!(await hasMigration('blog_status_v2_legacy_drafts_to_published'))) {
    const legacyDrafts = await Blog.updateMany(
      {
        status: 'draft',
        publishedAt: null,
        archivedAt: null,
      },
      [
        {
          $set: {
            status: 'published',
            publishedAt: '$createdAt',
          },
        },
      ],
    )

    if (legacyDrafts.modifiedCount > 0) {
      logger.info(
        `[blogs] Published ${legacyDrafts.modifiedCount} legacy draft post(s) (existing library)`,
      )
    }

    await markMigration('blog_status_v2_legacy_drafts_to_published')
  }
}
