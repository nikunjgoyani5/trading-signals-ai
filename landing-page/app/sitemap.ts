import type { MetadataRoute } from "next";
import { fetchPublicBlogs } from "@/lib/blogs-api";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const exchangeSlugs = [
  "binance",
  "bitfinex",
  "bitget-futures",
  "bitget-spot",
  "blofin",
  "bybit",
  "exmo",
  "gate",
  "htx",
  "kraken",
  "kucoin",
  "mexc",
  "okx",
  "xt",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...exchangeSlugs.map((slug) => ({
      url: `${siteUrl}/how-it-works/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  try {
    const { blogs: posts } = await fetchPublicBlogs(
      { page: 1, limit: 500 },
      { next: { revalidate: 3600 } },
    );

    const blogEntries: MetadataRoute.Sitemap = posts
      .filter((p) => typeof p.slug === "string" && p.slug.length > 0)
      .map((p) => ({
        url: `${siteUrl}/blogs/${encodeURIComponent(p.slug)}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...staticEntries, ...blogEntries];
  } catch {
    return staticEntries;
  }
}
