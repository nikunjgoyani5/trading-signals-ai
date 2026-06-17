"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import blog1 from "@/assets/images/blog-1.jpg";
import blog2 from "@/assets/images/blog-2.jpg";
import blog3 from "@/assets/images/blog-3.jpg";
import Link from "next/link";
import HoverFxButton from "@/components/common/HoverFxButton";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BlogImage from "@/components/Blogs/BlogImage";
import Container from "@/components/common/container/Container";
import { fetchPublicBlogs } from "@/lib/blogs-api";

interface PostData {
  title: string;
  desc: string;
  image: any;
  slug?: string;
}

// Helper to strip HTML tags for preview text
const stripHtml = (html: string) => {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export default function CTA() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentBlogs() {
      try {
        const { blogs } = await fetchPublicBlogs({ page: 1, limit: 3 });

        const recentBlogs = blogs.slice(0, 3).map((blog) => ({
          title: blog.title,
          desc: stripHtml(blog.content),
          image: blog.coverImage || "",
          slug: blog.slug
        }));

        setPosts(recentBlogs);
      } catch (error) {
        console.error("Error fetching blogs for CTA:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentBlogs();
  }, []);


  if (!loading && posts.length === 0) return null;

  return (
    <section className="w-full bg-transparent section-pb relative overflow-hidden">
      <Container>
        <div className="flex flex-col gap-12 lg:gap-14.5">

          {/* ── Header ── */}
          <div className="flex flex-col items-center text-center gap-2.5 max-w-[500px] mx-auto">
            {/* Badge */}
            <div className="px-3.5 py-1.5 rounded-full">
              <span className="text-[15px] font-mono tracking-widest uppercase text-vivid-cyan">
                {t("blog.title")}
              </span>
            </div>

            {/* Heading */}
            <h2 className="head-size text-white">
              {t("blog.heading")}
            </h2>

            <p
              className="desc-size"
            >
              {t("blog.description")}
            </p>
          </div>

          {/* ── Cards + CTA ── */}
          <div className="flex flex-col gap-12">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-5 items-stretch min-h-[400px]">
              {loading ? (
                // Simple loading state
                [...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-4">
                    <div className="bg-white/5 aspect-[460/300] rounded-2xl" />
                    <div className="h-6 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                  </div>
                ))
              ) : (
                posts.map((post, i) => (
                  <Link
                    href={post.slug !== "#" ? `/blogs/${post.slug}` : "/blogs"}
                    key={i}
                    className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[460/300] flex-shrink-0">
                      <BlogImage
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/*
                      Content — flex-col + justify-between
                      Top group: title + description
                      Bottom: View more — always aligned across all cards
                    */}
                    <div
                      className="flex flex-col flex-1 pt-6 justify-between gap-4"
                    >
                      {/* Top: title + description */}
                      <div className="flex flex-col gap-3">
                        <h3
                          className="text-xl 3xl:text-[27px] text-white leading-tight line-clamp-2 font-hoves"
                        >
                          {post.title}
                        </h3>

                        <p
                          className="card-desc-size2 line-clamp-3"
                        >
                          {post.desc}
                        </p>
                      </div>

                      {/* Bottom: View more — pinned to bottom by justify-between */}
                      <span
                        className="card-desc-size2 text-white! underline underline-offset-4 decoration-white/30 group-hover:decoration-white transition-all font-hoves"
                      >
                        {t("blog.viewMore")}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {posts.length > 0 && (
              <div className="flex justify-center mt-4">
                <HoverFxButton
                  href="/blogs"
                  className="px-7 py-3"
                >
                  {t("blog.cta")}
                </HoverFxButton>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}



