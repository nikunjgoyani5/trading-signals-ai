# Trading Signals AI

Monorepo for the Trading Signals AI platform: admin dashboard, public landing site, and API server.

Repository: `https://github.com/nikunjgoyani5/trading-signals-ai.git`  
Branch: `main`

For architecture, environment variables, integrations, deployment, and operational notes, see `TECHNICAL_HANDOVER.md`.

## Components

| Path | Purpose |
|------|---------|
| `admin/` | React admin dashboard (blogs, enquiries, dashboard) |
| `landing-page/` | Next.js marketing site, blogs, contact form |
| `server/` | Express + TypeScript API |

## Quick start

**Server** (default port `5001`):

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

**Admin**:

```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

**Landing page** (default dev port `3001`):

```bash
cd landing-page
npm install
cp env.example .env.local
npm run dev
```

## Documentation

| Document | Scope |
|----------|-------|
| `TECHNICAL_HANDOVER.md` | Full project handover |
| `admin/README.md` | Admin app |
| `landing-page/README.md` | Landing site |
| `server/README.md` | API server |
