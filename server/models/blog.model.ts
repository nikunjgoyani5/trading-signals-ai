import mongoose, { type Document, Schema } from 'mongoose'
import { BLOG_STATUSES, type BlogStatus } from '../constants/blogStatus.js'

export interface IBlog extends Document {
  title: string
  content: string
  coverImage?: string
  slug?: string
  status: BlogStatus
  publishedAt?: Date
  archivedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    coverImage: { type: String, required: false, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    status: {
      type: String,
      enum: BLOG_STATUSES,
      default: 'draft',
      required: true,
    },
    publishedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

blogSchema.index({ status: 1, createdAt: -1 })
blogSchema.index({ status: 1, publishedAt: -1 })

export const Blog = mongoose.model<IBlog>('Blog', blogSchema)
