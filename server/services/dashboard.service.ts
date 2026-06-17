import mongoose from 'mongoose'
import { env } from '../config/env.js'
import { Blog } from '../models/blog.model.js'
import { User } from '../models/user.model.js'
import { isBrevoConfigured } from './email.service.js'
import { isMongoConnectionError } from '../utils/isMongoConnectionError.js'

export type PublicationTrendPoint = {
  month: string
  label: string
  count: number
}

export type DashboardRecentBlog = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export type BlogStatusCounts = {
  draft: number
  published: number
  archived: number
}

export type DashboardActivityItem = {
  id: string
  type: 'created' | 'updated'
  title: string
  slug: string
  timestamp: string
}

export type DashboardAnalytics = {
  overview: {
    totalBlogs: number
    blogsThisMonth: number
    blogsLastMonth: number
    monthOverMonthChange: number | null
    blogsThisWeek: number
    blogsWithCover: number
    coverImageRate: number
    totalAdmins: number
    avgWordsPerPost: number
    postsUpdatedLast7Days: number
    statusCounts: BlogStatusCounts
  }
  contentHealth: {
    score: number
    label: string
    tips: string[]
  }
  publicationTrend: PublicationTrendPoint[]
  recentBlogs: DashboardRecentBlog[]
  recentActivity: DashboardActivityItem[]
  integrations: {
    cloudinaryConfigured: boolean
    brevoConfigured: boolean
    openAiConfigured: boolean
    dbConnected: boolean
  }
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const day = copy.getDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function calcMonthOverMonthChange(current: number, previous: number): number | null {
  if (previous === 0) {
    return current > 0 ? 100 : null
  }
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function buildContentHealth(
  totalBlogs: number,
  coverImageRate: number,
  avgWordsPerPost: number,
): DashboardAnalytics['contentHealth'] {
  if (totalBlogs === 0) {
    return {
      score: 0,
      label: 'No content yet',
      tips: ['Create your first blog post to start building your content library.'],
    }
  }

  let score = 0
  const tips: string[] = []

  score += Math.round(coverImageRate * 0.45)
  if (coverImageRate < 80) {
    tips.push('Add cover images to more posts - posts with visuals perform better on the live site.')
  }

  if (avgWordsPerPost >= 600) {
    score += 35
  } else if (avgWordsPerPost >= 300) {
    score += 22
    tips.push('Consider longer articles (600+ words) for stronger SEO on tradingsignals.ai.')
  } else {
    score += 10
    tips.push('Several posts are short - expand content depth for better reader engagement.')
  }

  if (totalBlogs >= 10) {
    score += 20
  } else if (totalBlogs >= 5) {
    score += 12
    tips.push('Publish more posts to build a consistent content pipeline.')
  } else {
    score += 5
    tips.push('Aim for at least 10 published posts for a healthy content catalog.')
  }

  score = Math.min(100, score)

  let label = 'Needs attention'
  if (score >= 80) label = 'Excellent'
  else if (score >= 60) label = 'Good'
  else if (score >= 40) label = 'Fair'

  if (tips.length === 0) {
    tips.push('Content library looks healthy - keep publishing on a regular schedule.')
  }

  return { score, label, tips }
}

function emptyAnalytics(): DashboardAnalytics {
  const now = new Date()
  const publicationTrend: PublicationTrendPoint[] = []

  for (let i = 5; i >= 0; i -= 1) {
    const pointDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    publicationTrend.push({
      month: `${pointDate.getFullYear()}-${String(pointDate.getMonth() + 1).padStart(2, '0')}`,
      label: monthLabel(pointDate),
      count: 0,
    })
  }

  return {
    overview: {
      totalBlogs: 0,
      blogsThisMonth: 0,
      blogsLastMonth: 0,
      monthOverMonthChange: null,
      blogsThisWeek: 0,
      blogsWithCover: 0,
      coverImageRate: 0,
      totalAdmins: 0,
      avgWordsPerPost: 0,
      postsUpdatedLast7Days: 0,
      statusCounts: { draft: 0, published: 0, archived: 0 },
    },
    contentHealth: buildContentHealth(0, 0, 0),
    publicationTrend,
    recentBlogs: [],
    recentActivity: [],
    integrations: {
      cloudinaryConfigured: Boolean(
        env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
      ),
      brevoConfigured: isBrevoConfigured(),
      openAiConfigured: Boolean(env.OPENAI_API_KEY?.trim()),
      dbConnected: mongoose.connection.readyState === 1,
    },
  }
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const now = new Date()
  const thisMonthStart = startOfMonth(now)
  const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  const nextMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1))
  const weekStart = startOfWeek(now)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  try {
    const [
      totalBlogs,
      blogsThisMonth,
      blogsLastMonth,
      blogsThisWeek,
      blogsWithCover,
      publishedTotal,
      draftCount,
      publishedCount,
      archivedCount,
      totalAdmins,
      postsUpdatedLast7Days,
      trendAgg,
      recentBlogs,
      wordStats,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({
        status: 'published',
        publishedAt: { $gte: thisMonthStart, $lt: nextMonthStart },
      }),
      Blog.countDocuments({
        status: 'published',
        publishedAt: { $gte: lastMonthStart, $lt: thisMonthStart },
      }),
      Blog.countDocuments({
        status: 'published',
        publishedAt: { $gte: weekStart },
      }),
      Blog.countDocuments({
        status: 'published',
        coverImage: { $exists: true, $nin: [null, ''] },
      }),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' }),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'archived' }),
      User.countDocuments(),
      Blog.countDocuments({ updatedAt: { $gte: sevenDaysAgo } }),
      Blog.aggregate<{ _id: { year: number; month: number }; count: number }>([
        {
          $match: {
            status: 'published',
            publishedAt: { $gte: sixMonthsAgo, $ne: null },
          },
        },
        {
          $group: {
            _id: { year: { $year: '$publishedAt' }, month: { $month: '$publishedAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Blog.find()
        .sort({ updatedAt: -1 })
        .limit(6)
        .select('title slug status coverImage createdAt updatedAt publishedAt')
        .lean(),
      Blog.aggregate<{ totalWords: number; postCount: number }>([
        { $match: { status: 'published' } },
        {
          $project: {
            wordCount: {
              $size: {
                $filter: {
                  input: { $split: ['$content', ' '] },
                  as: 'word',
                  cond: { $ne: ['$$word', ''] },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalWords: { $sum: '$wordCount' },
            postCount: { $sum: 1 },
          },
        },
      ]),
    ])

    const coverImageRate =
      publishedTotal > 0 ? Math.round((blogsWithCover / publishedTotal) * 100) : 0
    const avgWordsPerPost =
      wordStats[0] && wordStats[0].postCount > 0
        ? Math.round(wordStats[0].totalWords / wordStats[0].postCount)
        : 0

    const trendMap = new Map(
      trendAgg.map((item) => [
        `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        item.count,
      ]),
    )

    const publicationTrend: PublicationTrendPoint[] = []
    for (let i = 5; i >= 0; i -= 1) {
      const pointDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${pointDate.getFullYear()}-${String(pointDate.getMonth() + 1).padStart(2, '0')}`
      publicationTrend.push({
        month: key,
        label: monthLabel(pointDate),
        count: trendMap.get(key) ?? 0,
      })
    }

    const mappedRecentBlogs: DashboardRecentBlog[] = recentBlogs.map((blog) => ({
      id: String(blog._id),
      title: blog.title,
      slug: blog.slug ?? '',
      status: blog.status ?? 'draft',
      coverImage: blog.coverImage,
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString(),
    }))

    const activityItems: DashboardActivityItem[] = []

    for (const blog of recentBlogs) {
      const createdAt = blog.createdAt
      const updatedAt = blog.updatedAt
      const wasUpdated = updatedAt.getTime() - createdAt.getTime() > 60_000

      activityItems.push({
        id: `${blog._id}-updated`,
        type: wasUpdated ? 'updated' : 'created',
        title: blog.title,
        slug: blog.slug ?? '',
        timestamp: (wasUpdated ? updatedAt : createdAt).toISOString(),
      })
    }

    activityItems.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return {
      overview: {
        totalBlogs,
        blogsThisMonth,
        blogsLastMonth,
        monthOverMonthChange: calcMonthOverMonthChange(blogsThisMonth, blogsLastMonth),
        blogsThisWeek,
        blogsWithCover,
        coverImageRate,
        totalAdmins,
        avgWordsPerPost,
        postsUpdatedLast7Days,
        statusCounts: {
          draft: draftCount,
          published: publishedCount,
          archived: archivedCount,
        },
      },
      contentHealth: buildContentHealth(publishedTotal, coverImageRate, avgWordsPerPost),
      publicationTrend,
      recentBlogs: mappedRecentBlogs,
      recentActivity: activityItems.slice(0, 8),
      integrations: {
        cloudinaryConfigured: Boolean(
          env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
        ),
        brevoConfigured: isBrevoConfigured(),
        openAiConfigured: Boolean(env.OPENAI_API_KEY?.trim()),
        dbConnected: mongoose.connection.readyState === 1,
      },
    }
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return emptyAnalytics()
    }
    throw error
  }
}
