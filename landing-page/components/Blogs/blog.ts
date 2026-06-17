// types/blog.ts
import type { StaticImageData } from "next/image";

export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "chart"; component: React.ReactNode }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "divider" }
  | { type: "callout"; variant: "info" | "warning" | "success" | "tip"; text: string };

type MultilingualText = {
  en: string;
  pl: string;
  th: string;
};

// Define the different block types in your content array
type ContentBlock =
  | { type: "paragraph"; text: MultilingualText }
  | { type: "heading"; level: number; text: MultilingualText }
  | { type: "chart"; component: any }; // Replace 'any' with your React component type

export interface BlogPostDetail {
  slug: string; // Slugs usually stay in English for URL consistency
  title: MultilingualText;
 author: { name: string; avatar: StaticImageData | string };
  publishedAt: string;
  content: ContentBlock[];
  tags: MultilingualText[]; 
  readingTime: number;
}