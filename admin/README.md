# Trading Signals AI - Admin App

React + Vite admin client for managing dashboard metrics and blog content.

## Stack

- React 19 + TypeScript
- Vite 8
- Redux Toolkit + RTK Query
- React Router
- Tailwind CSS 4

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

Primary variables from `.env.example`:

- `VITE_API_BASE_URL` (default `/api`)
- `VITE_API_PROXY_TARGET` (local API target, default `http://localhost:5001`)
- `VITE_VERCEL_PROTECTION_BYPASS` (optional; needed when proxy target is Vercel-protected)
- `VITE_BLOG_PUBLIC_URL` (public landing/blog URL)

## Runtime behavior

- Dev server proxies `/api` and `/uploads` to `VITE_API_PROXY_TARGET` via `vite.config.ts`.
- On Vercel, `middleware.ts` forwards `/api/*` to `API_SERVER_URL` (server-side env), optionally adding `x-vercel-protection-bypass`.
- API auth uses cookie credentials plus bearer token flow in `src/redux/api/baseQuery.ts`.

## Main routes

- Public: `/`, `/forgot-password`, `/reset-password`
- Protected: `/admin/dashboard`, `/admin/blogs`, `/admin/blogs/create`, `/admin/blogs/edit/:blogId`, `/admin/enquiries`

For full project handover, see `../TECHNICAL_HANDOVER.md`.

## Deployment notes

- Deployment is currently manual and managed on an internal server.
- Current admin URL (provided operationally): `http://64.227.173.140:5174/`
- Do not store admin credentials in repository files.

