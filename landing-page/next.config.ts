import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprod.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprod*.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.openai.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
