# Technical Handover - Trading Signals AI

Prepared from repository evidence in `trading-signals-ai` on branch `main`.

Evidence policy used:
- **Verified from repository**: explicit in source, config, scripts, or files in this checkout
- **Inferred from code**: derived from implementation behavior
- **Operationally provided (not in repo)**: manually supplied deployment/runtime metadata from prior handover
- **Not Found in Repository**: no verifiable evidence in this checkout

---

# Project Overview

## Purpose of the application

- **Verified from repository**: Monorepo with three apps:
  - `admin/` — admin dashboard for blogs, enquiries, and metrics
  - `landing-page/` — public marketing site, exchange onboarding pages, blogs, contact form
  - `server/` — central Express API (auth, blogs, AI generation, inquiries, dashboard)
- **Verified from repository**: Public blog content and contact inquiries flow through the server; admin manages content and enquiry status.

## Main user types

| User | Surface | Evidence |
|------|---------|----------|
| Admin | `admin/` | JWT auth, protected `/admin/*` routes |
| Public visitor | `landing-page/` | Public pages, blog list/detail, contact form |
| Internal operator | `server/` bootstrap | Default admin created on startup |

## Major modules/features

| Feature | Server route | Client surface |
|---------|--------------|----------------|
| Auth (login, refresh, forgot/reset password) | `/api/auth` | `admin/` |
| Dashboard metrics | `/api/dashboard` | `admin/` dashboard |
| Blog CRUD + public APIs | `/api/blogs` | `admin/`, `landing-page/` |
| AI blog generation | `/api/generate-blog` | `admin/` |
| AI cover image generation | `/api/generate-image` | `admin/` |
| Contact enquiries | `/api/inquiries` | `landing-page/contact`, `admin/enquiries` |
| Health check | `/api/health` | ops |

---

# Tech Stack

| Component | Stack | Evidence |
|-----------|-------|----------|
| `admin/` | React 19, Vite, TypeScript, RTK Query, Tailwind 4 | `admin/package.json` |
| `landing-page/` | Next.js App Router, i18n locales (en/pl/th) | `landing-page/package.json`, `locales/` |
| `server/` | Express, TypeScript, Mongoose, Zod | `server/package.json` |
| Database | MongoDB | `server/config/database.ts` |
| Media | Cloudinary | `server/config/cloudinary.ts` |
| AI | OpenAI HTTP APIs (blog + image) | `server/services/generate*.service.ts` |
| Email | Brevo API/SMTP, Gmail SMTP (nodemailer) | `server/services/email.service.ts` |

---

# High-Level Architecture

```
landing-page (Next.js)          admin (Vite/React)
        |                              |
        |  /api/* proxy/rewrite        |  /api/* Vite proxy or Vercel middleware
        v                              v
              server (Express /api)
                      |
        +-------------+-------------+
        |             |             |
     MongoDB      Cloudinary      OpenAI
                      |
                   Brevo / Gmail (email)
```

- **Verified from repository**: Landing proxies `/api/*` to server via `landing-page/next.config.ts` rewrites (`API_PROXY_TARGET`, default `http://localhost:5001`).
- **Verified from repository**: Admin dev proxy in `admin/vite.config.ts`; Vercel middleware forwards `/api/*` in `admin/middleware.ts`.

---

# Repository Structure

| Path | Purpose |
|------|---------|
| `admin/src/pages/` | Login, dashboard, blogs, enquiries |
| `admin/src/redux/api/` | RTK Query APIs (auth, blogs, dashboard, inquiries) |
| `admin/middleware.ts` | Vercel API proxy to `API_SERVER_URL` |
| `landing-page/app/` | App Router pages (home, blogs, contact, how-it-works, legal) |
| `landing-page/components/sections/contact/` | Contact form UI |
| `landing-page/lib/api.ts` | Public API helpers including `submitInquiry` |
| `server/routes/` | Express route modules |
| `server/services/` | Business logic |
| `server/scripts/` | Blog migration, email diagnostics |

---

# Environment Configuration

## Server (`server/.env.example`, validated in `server/config/env.ts`)

| Variable | Purpose |
|----------|---------|
| `NODE_ENV`, `PORT` | Runtime (default port `5001`) |
| `API_PUBLIC_URL` | Public API base URL |
| `CORS_ORIGIN`, `CLIENT_URL`, `LANDING_PAGE_URL` | CORS and client references |
| `DB_URI` | MongoDB connection |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_*_EXPIRES_IN` | Auth tokens |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Bootstrap admin |
| `OPENAI_API_KEY`, `OPENAI_IMAGE_MODEL` | AI blog/image generation |
| `MAX_BLOG_AI_COVER_GENERATIONS` | AI cover limit per blog (3–5, default 3) |
| `CLOUDINARY_*` | Blog cover uploads |
| `BREVO_API_KEY`, `BREVO_SMTP_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` | Password reset + inquiry email |
| `INQUIRY_NOTIFY_EMAIL` | Recipient for new contact form submissions |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `EMAIL_USE_GMAIL_FOR_DISPOSABLE` | Gmail SMTP for disposable inboxes (e.g. yopmail) |

## Admin (`admin/.env.example`)

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | API path prefix (default `/api`) |
| `VITE_API_PROXY_TARGET` | Dev proxy target (default `http://localhost:5001`) |
| `VITE_BLOG_PUBLIC_URL` | Public blog base URL |
| `VITE_VERCEL_PROTECTION_BYPASS` | Optional Vercel protection bypass |
| `API_SERVER_URL`, `VERCEL_PROTECTION_BYPASS` | Server-side Vercel env for middleware |

## Landing (`landing-page/env.example`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Optional direct API URL; empty uses same-origin `/api` rewrite |
| `API_PROXY_TARGET` | Server proxy target for rewrites (default `http://localhost:5001`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap/robots (default dev `http://localhost:3001`) |

Do not commit secrets in `.env` files.

---

# Local Development Setup

| Component | Install | Dev command | Default port |
|-----------|---------|-------------|--------------|
| `server/` | `npm install` | `npm run dev` | `5001` (`PORT` in `.env`) |
| `admin/` | `npm install` | `npm run dev` | Vite default (`5173`) |
| `landing-page/` | `npm install` | `npm run dev` | `3001` (per `env.example`) |

**Startup order (inferred):** MongoDB → server → admin and/or landing.

### Server email diagnostics

```bash
cd server
npm run check:email          # verify inquiry/reset email config
npm run test:inquiry-email   # test inquiry email flow
npm run sync:email-env       # sync email env helper
```

---

# Deployment Process

## Operationally provided (not in repository)

- Deployment mode: manual on internal server (primary runtime)
- API: `http://64.227.173.140:5020/api/`
- Admin: `http://64.227.173.140:5174/`
- Landing internal: `http://64.227.173.140:3020/`
- Landing Vercel preview: `https://tradingsignals-ai.vercel.app/`
- Production domain: `https://www.tradingsignals.ai/`
- MongoDB database name in use: `ts-stage`

Secrets and credentials are omitted from this document.

## Verified from repository

| Topic | Status | Notes |
|-------|--------|-------|
| Admin Vercel wiring | Verified | `admin/middleware.ts`, `admin/vercel.json` |
| Server Vercel wiring | Verified | `server/vercel.json` → `api/index.ts` |
| Landing Next config | Verified | `next.config.ts` rewrites + image remote patterns |
| Root deployment runbook | Not Found in Repository | |
| Docker | Not Found in Repository | |
| CI/CD workflows | Not Found in Repository | |

---

# External Integrations

| Integration | Usage | Files |
|-------------|-------|-------|
| MongoDB | Users, blogs, inquiries, migrations | `server/models/` |
| Cloudinary | Blog cover persistence | `server/utils/cloudinaryUpload.ts` |
| OpenAI | Blog text (`/v1/responses`), images (`/v1/images/generations`) | `generateBlog.service.ts`, `generateImage.service.ts` |
| Brevo | Forgot-password emails, inquiry notifications | `email.service.ts` |
| Gmail SMTP | Inquiry emails to disposable inboxes when configured | `email.service.ts` |

---

# Critical Business Logic

## Authentication

- **Verified from repository**: JWT access + refresh tokens; httpOnly cookies via `authCookie` utils; admin RTK Query refresh in `baseQuery.ts`.

## Blog workflow

- **Verified from repository**: Status constants in `server/constants/blogStatus.ts`; legacy migration on bootstrap (`bootstrap.ts`).
- **Verified from repository**: AI cover generations capped per blog via `MAX_BLOG_AI_COVER_GENERATIONS` (3–5) in `server/constants/blogCoverGeneration.ts`.

## Contact / inquiry workflow

**Verified from repository**

1. Public submits `POST /api/inquiries` from `landing-page` contact form (`lib/api.ts` → `submitInquiry`).
2. Server validates with Zod (`submitInquirySchema`: name, email, message min 10 chars).
3. Ticket number generated (`utils/ticketNumber.ts`); inquiry saved to MongoDB.
4. Emails sent via `sendInquiryEmails` to `INQUIRY_NOTIFY_EMAIL` (Brevo or Gmail path).
5. Client requires `emailSent: true` in response or shows error (inquiry may still be saved if email fails).
6. Admin lists inquiries at `GET /api/inquiries` (auth required).
7. Admin updates status via `PATCH /api/inquiries/:identifier/status` — statuses: `open`, `responded`, `resolved`.

## Public blog APIs

- **Verified from repository**: Landing consumes public blog endpoints via `landing-page/lib/blogs-api.ts`.

---

# Scheduled Jobs

**Status: Not Found in Repository**

No cron or queue workers. Bootstrap runs blog status migration once on server start.

---

# Known Issues / Technical Debt

| Item | Detail | Status |
|------|--------|--------|
| No root CI/CD | No `.github/workflows` in checkout | Verified |
| Cross-app env alignment | Admin, landing, and server ports/URLs must match | Verified |
| Inquiry saved but email fails | API returns success with `emailSent: false`; landing treats as error | Verified |
| Vercel Brevo IP allowlist | `.env.example` notes Vercel IPs vs Brevo authorized IPs | Verified |
| Landing README | Still create-next-app template | Verified |
| Operational vs repo ports | Local default `5001`; deployed API on `5020` | Operationally provided + Verified |

---

# Operational Notes

| Topic | Status | Detail |
|-------|--------|--------|
| Server bootstrap | Verified | DB connect, blog migration, default admin (`server/bootstrap.ts`) |
| Blog migration script | Verified | `npm run` via `server/scripts/run-blog-migration.ts` |
| Admin enquiries route | Verified | `/admin/enquiries` |
| Landing contact route | Verified | `/contact` (in navbar, footer, sitemap) |
| i18n | Verified | `landing-page/locales/en`, `pl`, `th` |

---

# Infrastructure Ownership

| Item | Status | Detail |
|------|--------|--------|
| Repository | Verified | `https://github.com/nikunjgoyani5/trading-signals-ai.git` |
| Internal server hosting | Operationally provided | `64.227.173.140` |
| Production domain | Operationally provided | `www.tradingsignals.ai` |
| MongoDB host | Partial | Database name `ts-stage`; connection in env only |

---

# Handover Checklist

| Item | Status |
|------|--------|
| Component READMEs available | Partial (landing README outdated) |
| Root README + technical handover | Verified |
| Environment variables documented | Verified |
| API/component boundaries documented | Verified |
| Inquiry/contact flow documented | Verified |
| Deployment process documented | Partial |
| Manual deployment context captured | Verified (operationally provided) |
| Secrets excluded from docs | Verified |

---

# Quick reference

| Item | Value |
|------|-------|
| API base (local) | `http://localhost:5001/api` |
| Health | `GET /api/health` |
| Submit inquiry | `POST /api/inquiries` (public) |
| List inquiries | `GET /api/inquiries` (auth) |
| Admin enquiries UI | `/admin/enquiries` |
| Landing contact | `/contact` |
