# Trading Signals AI - Landing Page

Public marketing and blog frontend built with Next.js App Router.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- TanStack Query
- i18next + react-i18next
- Three.js stack (`@react-three/fiber`, `drei`, `postprocessing`)

## Local setup

```bash
npm install
cp env.example .env
npm run dev
```

## Environment

Variables from `env.example`:

- `NEXT_PUBLIC_API_BASE_URL` (backend base URL for blogs/public API)
- `NEXT_PUBLIC_SITE_URL` (site canonical URL for metadata/sitemap/robots)

## Key routes

- `/` (landing)
- `/blogs`
- `/blogs/[slug]`
- `/privacy-policy`
- `/terms-of-service`
- `/how-it-works/*` (exchange-specific pages)

## API integration

- `lib/api.ts` builds URLs from `NEXT_PUBLIC_API_BASE_URL`.
- `lib/blogs-api.ts` consumes:
  - `GET /api/blogs/public`
  - `GET /api/blogs/public/:slug`

## Notes

- `next.config.ts` allows remote image domains including Cloudinary.
- SEO metadata and canonical base are configured in `app/layout.tsx` using `NEXT_PUBLIC_SITE_URL`.

