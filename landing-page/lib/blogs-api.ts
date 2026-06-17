import { getApiUrl } from "@/lib/api";

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt?: string;
};

export type BlogsListData = {
  blogs: BlogPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function parseEnvelope<T>(res: Response, errorMessage: string): Promise<T> {
  if (!res.ok) {
    throw new Error(errorMessage);
  }

  const json = (await res.json()) as ApiEnvelope<T>;

  if (!json.success || json.data == null) {
    throw new Error(json.message || errorMessage);
  }

  return json.data;
}

/** GET /api/blogs/public?page=&limit= */
export async function fetchPublicBlogs(
  params: { page?: number; limit?: number } = {},
  init?: RequestInit,
): Promise<BlogsListData> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;

  const res = await fetch(
    getApiUrl(`/api/blogs/public?page=${page}&limit=${limit}`),
    init,
  );

  return parseEnvelope<BlogsListData>(res, "Failed to fetch blogs");
}

/** GET /api/blogs/public/:slug */
export async function fetchPublicBlogBySlug(
  slug: string,
  init?: RequestInit,
): Promise<BlogPost> {
  const res = await fetch(
    getApiUrl(`/api/blogs/public/${encodeURIComponent(slug)}`),
    init,
  );

  return parseEnvelope<BlogPost>(res, "Blog not found");
}
