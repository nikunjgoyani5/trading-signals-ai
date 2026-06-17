import 'dotenv/config'
import mongoose from 'mongoose'
import { Blog } from '../models/blog.model.js'
import { migrateLegacyBlogStatuses } from '../services/blogMigration.service.js'

async function main() {
  await mongoose.connect(process.env.DB_URI!)
  await migrateLegacyBlogStatuses()

  const stats = await Blog.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  console.log('Status counts after migration:', stats)

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
