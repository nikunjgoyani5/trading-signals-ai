import type { Metadata } from "next";
import Navbar from "@/components/common/navbar/Navbar";
import "./globals.css";
import { Inter, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import Footer from "@/components/common/footer/Footer";
import { I18nProvider } from "@/components/I18nProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import SmoothScrollHandler from "@/components/common/SmoothScrollHandler";
import { VideoAutoplayProvider } from "@/components/video/VideoAutoplayContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const ttHoves = localFont({
  src: [
    {
      path: "../assets/fonts/tt-hoves/TT Hoves Pro Trial Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/tt-hoves/TT Hoves Pro Trial Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/tt-hoves/TT Hoves Pro Trial Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/tt-hoves/TT Hoves Pro Trial DemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/tt-hoves/TT Hoves Pro Trial Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/tt-hoves/TT Hoves Pro Trial ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/tt-hoves/TT Hoves Pro Trial Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-hoves",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const siteName = "Trading Signals";
const defaultDescription =
  "AI-powered trading signals and strategies to help you make informed decisions in the markets.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - AI-Powered Trading Signals`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    "trading signals",
    "AI trading",
    "algorithmic trading",
    "market analysis",
    "trading strategies",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: `${siteName} - AI-Powered Trading Signals`,
    description: defaultDescription,
    images: [
      {
        url: "/images/grad_3.png",
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - AI-Powered Trading Signals`,
    description: defaultDescription,
    images: ["/images/grad_3.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`relative ${inter.variable} ${spaceMono.variable} ${ttHoves.variable} ${ttHoves.className}`}
      >
        <I18nProvider>
          <QueryProvider>
            <VideoAutoplayProvider>
              <SmoothScrollHandler />
              <Navbar />
              {children}
              <Footer />
            </VideoAutoplayProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}