# Trading Signals AI - Server API

Node.js + Express + TypeScript backend for admin auth, dashboard metrics, blog CRUD, and AI generation endpoints.

## Stack

- Express 4
- TypeScript
- MongoDB + Mongoose
- Zod validation
- JWT auth (access + refresh)
- Cloudinary uploads

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` - tsx watch mode
- `npm run build` - compile TypeScript
- `npm start` - run compiled output
- `npm run typecheck` - type validation

## Core API routes

- `/api/health`
- `/api/auth/*`
- `/api/dashboard/*`
- `/api/blogs/*`
- `/api/generate-blog`
- `/api/generate-image`

## Environment highlights

Required from `.env.example`:

- `DB_URI`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CORS_ORIGIN`, `CLIENT_URL`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`

Optional:

- `OPENAI_API_KEY`, `OPENAI_IMAGE_MODEL`
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`

## Runtime notes

- Startup bootstraps DB connection, legacy blog status migration, and default admin creation.
- API is mounted under `/api` in `app.ts`.
- `vercel.json` routes all traffic to `api/index.ts` for serverless deployment.

## Deployment notes

- Deployment is currently manual and managed on an internal server.
- Current API base (provided operationally): `http://64.227.173.140:5020/api/`
- MongoDB database name in use: `ts-stage` (credentials omitted; configure via `DB_URI` in `.env`)
- Do not store secrets or admin passwords in repository files.

