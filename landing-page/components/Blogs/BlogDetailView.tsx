"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  createdAt: string;
}

interface Props {
  post: BlogPost;
  formattedDate: string;
}

export default function BlogDetailView({ post, formattedDate }: Props) {
  const { t } = useTranslation();

  return (
    <article className="section-py">

      {/* Author + date */}
      <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-3 mb-7">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[linear-gradient(276deg,_rgba(0,240,255,1)_15%,_rgba(0,18,184,1)_76%)] flex items-center justify-center overflow-hidden shrink-0">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
              <path d="M10 26L18 10L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 21H23" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm xl:text-base 2xl:text-lg font-medium whitespace-nowrap">TradingSignals AI</span>
            <span className="text-gray-500 text-sm xl:text-base lg:block hidden">·</span>
            <time className="text-gray-400 text-sm xl:text-base whitespace-nowrap" dateTime={post.createdAt}>
              {formattedDate}
            </time>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-white text-[32px] sm:text-[40px] xl:text-[52px] font-bold leading-[1.15] tracking-tight mb-8">
        {post.title}
      </h1>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full aspect-video rounded-3xl overflow-hidden  border border-white/5 shadow-2xl shadow-black/40">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Blog body - Render content string as HTML */}
      <div 
        className="blog-prose text-[#c8cdd8] text-[15px] md:text-[17px] xl:text-lg leading-relaxed text-justify overflow-hidden break-words min-w-0"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />

      {/* Back link */}
      <div className="mt-10 pt-8 border-t border-white/10">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-gray-400 text-sm xl:text-base hover:text-white transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("blog.backToBlog")}
        </Link>
      </div>
    </article>
  );
}
