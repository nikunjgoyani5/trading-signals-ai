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
    statusCounts: {
      draft: number
      published: number
      archived: number
    }
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
