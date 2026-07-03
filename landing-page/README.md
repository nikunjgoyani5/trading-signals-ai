# Trading Signals AI - Landing Page

Next.js public marketing site with exchange onboarding pages, blogs, and contact form.

For full project handover, see `../TECHNICAL_HANDOVER.md`.

## Stack

- Next.js (App Router)
- React, TypeScript, Tailwind CSS
- i18n locales: `en`, `pl`, `th`

## Local setup

```bash
npm install
cp env.example .env.local
npm run dev
```

Default dev URL: `http://localhost:3001` (see `env.example`).

## API proxy

In local dev, `/api/*` requests are rewritten to the server at `API_PROXY_TARGET` (default `http://localhost:5001`) via `next.config.ts`. Start the server first:

```bash
cd ../server && npm run dev
```

## Main routes

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/blogs`, `/blogs/[slug]` | Public blog list and detail |
| `/contact` | Contact form (posts to `/api/inquiries`) |
| `/how-it-works/*` | Exchange-specific onboarding pages |
| `/privacy-policy`, `/terms-of-service` | Legal pages |

## Environment

From `env.example`:

| Variable | Purpose |
|----------|---------|
| `API_PROXY_TARGET` | Backend for `/api` rewrites |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap/robots |
| `NEXT_PUBLIC_API_BASE_URL` | Optional; leave empty to use same-origin `/api` proxy |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
