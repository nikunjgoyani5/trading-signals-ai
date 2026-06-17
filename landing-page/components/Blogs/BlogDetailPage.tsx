"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import BlogDetailView from "@/components/Blogs/BlogDetailView";
import NoiseOverlay from "../NoiseOverlay";
import { fetchPublicBlogBySlug } from "@/lib/blogs-api";

export default function BlogDetailPage() {
  const params = useParams();
  // The parameter could be a slug or an ID depending on the link clicked
  const identifier = (params?.slug || params?.id) as string;

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog", identifier],
    queryFn: () => fetchPublicBlogBySlug(identifier),
    enabled: !!identifier,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isLoading) {
    return (
      <div className="bg-[#010B24] min-h-screen flex flex-col lg:mt-28 font-hoves items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-4xl px-6">
          <div className="h-4 bg-white/10 w-32 rounded" />
          <div className="h-12 bg-white/10 w-full rounded" />
          <div className="h-64 bg-white/10 w-full rounded-xl" />
          <div className="h-4 bg-white/10 w-full rounded" />
          <div className="h-4 bg-white/10 w-2/3 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="bg-[#010B24] min-h-screen flex flex-col lg:mt-28 font-hoves items-center justify-center">
        <h2 className="text-white text-2xl font-bold">Blog not found</h2>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-[#010B24] min-h-screen flex flex-col font-hoves">
      <NoiseOverlay />
      <main className="flex-1">
        <BlogDetailView post={post} formattedDate={formattedDate} />
      </main>
    </div>
  );
}