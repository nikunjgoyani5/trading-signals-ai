# Technical Handover - Trading Signals AI

Prepared from repository evidence in `trading-signals-ai` on branch `main`.

Evidence policy used:
- Verified from repository: explicit in source/config/scripts/files in this checkout
- Inferred from code: derived from implementation behavior
- Not Found in Repository: no verifiable evidence in this checkout

---

# Project Overview

## Purpose of the application

- Verified from repository: Monorepo-style project split into three apps:
  - `admin/` - admin dashboard/client
  - `landing-page/` - public marketing/blog site
  - `server/` - backend API
- Verified from repository: Blog/public content is served through backend APIs and consumed by both admin and landing surfaces.

## Main user types

- Verified from repository:
  - Admin users managing content and dashboard via `admin/`
  - Public users consuming marketing pages and blogs via `landing-page/`
- Inferred from code:
  - Internal operators using server-managed auth and content workflows.

## Major modules/features

- Verified from repository:
  - Admin authentication and blog management flows
  - Dashboard overview endpoints and UI panels
  - Public landing pages with exchange-specific onboarding pages
  - Public blog list/detail pages
  - AI-assisted blog/image generation endpoints on server

---

# Workspace Structure

| Path | Role | Stack |
|------|------|-------|
| `admin/` | Admin SPA | React 19 + Vite + RTK Query |
| `landing-page/` | Public website | Next.js 16 App Router |
| `server/` | API backend | Express + TypeScript + MongoDB |

---

# Component Handover

## `admin/`

### Verified from repository

- Vite + React TypeScript app (`admin/package.json`)
- Uses Redux store/provider (`src/main.tsx`, `src/redux/store.ts`)
- Route model:
  - Public: `/`, `/forgot-password`, `/reset-password`
  - Protected: `/admin/*` (dashboard + blog CRUD)
- API layer uses RTK Query base wrapper with token refresh (`src/redux/api/baseQuery.ts`)
- Local dev proxy for `/api` and `/uploads` configured in `vite.config.ts`
- Vercel-side `/api/*` forwarding implemented in `admin/middleware.ts` using `API_SERVER_URL`

### Inferred from code

- Admin UI is intended to run same-origin with a proxied API in Vercel deployments to reduce CORS friction.

## `landing-page/`

### Verified from repository

- Next.js app router project (`landing-page/package.json`, `landing-page/app/`)
- Public blog APIs consumed via:
  - `GET /api/blogs/public`
  - `GET /api/blogs/public/:slug`
  (`landing-page/lib/blogs-api.ts`)
- API base URL is driven by `NEXT_PUBLIC_API_BASE_URL` (`landing-page/lib/api.ts`)
- SEO metadata and canonical base URL use `NEXT_PUBLIC_SITE_URL` (`landing-page/app/layout.tsx`)
- Includes policy and how-it-works route set under `app/`

### Inferred from code

- Landing experience is content/SEO-focused and depends on server API availability for blog pages.

## `server/`

### Verified from repository

- Express app mounted under `/api` (`server/app.ts`)
- Startup bootstrap chain:
  - DB connect
  - legacy blog status migration
  - default admin ensure
  (`server/bootstrap.ts`)
- Route groups (`server/routes/index.ts`):
  - `/health`
  - `/auth`
  - `/dashboard`
  - `/blogs`
  - `/generate-blog`
  - `/generate-image`
- Environment validation uses Zod with required secrets/config (`server/config/env.ts`)
- Vercel deployment routing in `server/vercel.json` points to `api/index.ts`

### Inferred from code

- Server is the central source of truth for auth/session/content workflows across both frontends.

---

# Environment Configuration

## Admin (`admin/.env.example`)

- Verified from repository:
  - `VITE_API_BASE_URL`
  - `VITE_API_PROXY_TARGET`
  - `VITE_BLOG_PUBLIC_URL`
  - optional `VITE_VERCEL_PROTECTION_BYPASS`

## Landing (`landing-page/env.example`)

- Verified from repository:
  - `NEXT_PUBLIC_API_BASE_URL`
  - `NEXT_PUBLIC_SITE_URL`

## Server (`server/.env.example`)

- Verified from repository:
  - Core runtime: `NODE_ENV`, `PORT`, `API_PUBLIC_URL`
  - CORS/client: `CORS_ORIGIN`, `CLIENT_URL`
  - DB/auth: `DB_URI`, JWT secrets + expiry values
  - Admin bootstrap: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
  - Media: Cloudinary keys
  - AI: `OPENAI_API_KEY`, `OPENAI_IMAGE_MODEL` (optional)
  - Email reset: Brevo keys/sender fields

Do not commit secret values in `.env` files.

---

# Local Development

| Component | Install | Dev command | Default port/source |
|----------|---------|-------------|---------------------|
| `admin/` | `npm install` | `npm run dev` | Vite default; proxies API to `VITE_API_PROXY_TARGET` |
| `landing-page/` | `npm install` | `npm run dev` | Next dev default (typically 3000) |
| `server/` | `npm install` | `npm run dev` | `PORT` from `server/.env` (default `3000` in `.env.example`) |

---

# Deployment & Infrastructure

| Topic | Status | Notes |
|------|--------|-------|
| Monorepo deployment guide | Not Found in Repository | No root deployment runbook file found |
| Admin deployment wiring | Verified from repository | `admin/middleware.ts` + `admin/vercel.json` |
| Server deployment wiring | Verified from repository | `server/vercel.json` routes to `api/index.ts` |
| Landing deployment config | Partial | Next project config exists; platform pipeline not explicitly documented |
| Docker | Not Found in Repository | No Dockerfiles found in these three apps |
| CI/CD workflows | Not Found in Repository | No `.github/workflows` found in this checkout |

---

# Integrations

| Integration | Component(s) | Evidence |
|------------|---------------|----------|
| MongoDB/Mongoose | `server` | `server/config/database.ts`, dependencies |
| Cloudinary | `server` | env requirements + dependency |
| OpenAI | `server` | `OPENAI_API_KEY`, generate routes |
| Brevo (email) | `server` | env requirements for forgot/reset flows |
| Vercel deployment protection bypass flow | `admin` | middleware header injection support |

---

# Known Risks / Technical Debt

| Item | Evidence |
|------|----------|
| Missing root-level unified deployment runbook | No root ops/deploy docs in checkout |
| Cross-app env coupling can cause integration issues | Admin and landing each depend on server URL/env alignment |
| Vercel bypass token flow requires coordinated env setup | `admin/middleware.ts` + `admin/vite.config.ts` behavior |

---

# Handover Checklist

| Item | Status |
|------|--------|
| Component READMEs available (`admin`, `landing-page`, `server`) | Verified |
| Root technical handover document | Verified |
| Environment variables documented | Verified |
| API/component boundaries documented | Verified |
| Deployment process fully documented | Partial |
| Infrastructure ownership documented | Partial |

