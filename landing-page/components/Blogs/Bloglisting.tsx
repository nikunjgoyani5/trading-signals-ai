"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import NoiseOverlay from "../NoiseOverlay";
import BlogImage from "./BlogImage";
import { useInfiniteQuery } from "@tanstack/react-query";
import HoverFxButton from "../common/HoverFxButton";
import {
  fetchPublicBlogs,
  type BlogPost,
  type BlogsListData,
} from "@/lib/blogs-api";

function BlogCard({ post }: { post: BlogPost }) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-3 group h-full">
      {/* Image */}
      <Link href={`/blogs/${post.slug || post._id}`}>
        <div className="w-full aspect-[17/11] rounded-2xl overflow-hidden border border-white/5">
          <BlogImage 
            src={post.coverImage || ""} 
            alt={post.title} 
            className="w-full h-full transition-transform duration-500 group-hover:scale-110 object-cover" 
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-grow px-1">
        <h3 className="text-white font-semibold text-[15px] xl:text-lg 2xl:text-xl min-h-13 leading-snug line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm xl:text-base 2xl:text-lg leading-snug line-clamp-3">
          {post.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}
        </p>
        <Link
          href={`/blogs/${post.slug || post._id}`}
          className="inline-flex items-center gap-1 text-white text-sm xl:text-base 2xl:text-lg font-medium underline underline-offset-4 decoration-white/20 hover:decoration-white hover:text-cyan-400 transition-all duration-300 mt-auto pt-2 w-fit"
        >
          {t("blog.viewMore")}
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}

export default function BlogListing() {
  const { t } = useTranslation();
  
  const { 
    data, 
    isLoading, 
    isError, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery<BlogsListData>({
    queryKey: ["blogs"],
    queryFn: async ({ pageParam = 1 }) =>
      fetchPublicBlogs({ page: Number(pageParam), limit: 12 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const blogPosts = data?.pages.flatMap((page) => page.blogs || []) || [];

  if (isLoading) {
    return (
      <section className="bg-[#010B24] min-h-screen py-12 lg:px-7 font-hoves">
        <NoiseOverlay />
        <div className="mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 bg-white/10 w-64 mx-auto rounded animate-pulse mb-4" />
            <div className="h-4 bg-white/10 w-96 mx-auto rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="w-full aspect-[17/11] rounded-2xl bg-white/10" />
                <div className="h-6 bg-white/5 w-full rounded" />
                <div className="h-4 bg-white/5 w-2/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-[#010B24] min-h-screen py-12 lg:px-7 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-semibold mb-4">{t("blog.errorHeading")}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white text-black rounded-full font-medium"
          >
            {t("blog.tryAgain")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#010B24] min-h-screen section-py font-hoves">
      <NoiseOverlay />
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-white text-4xl xl:text-5xl 2xl:text-6xl font-semibold mb-3 font-hoves">
            {t("blog.title")}
          </h1>
          <p className="text-gray-400 text-sm xl:text-base 2xl:text-lg font-hoves">
            {t("blog.description")}
          </p>
        </div>

        {/* Grid — fetched blogs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-7 mb-16">
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-gray-400">{t("blog.emptyState")}</p>
            </div>
          )}
        </div>

        {/* Show More button */}
        {hasNextPage && (
          <div className="flex justify-center">
            <HoverFxButton 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-10 h-14"
            >
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  <span>{t("blog.loading")}</span>
                </div>
              ) : (
                t("blog.cta")
              )}
            </HoverFxButton>
          </div>
        )}
      </div>
    </section>
  );
}
