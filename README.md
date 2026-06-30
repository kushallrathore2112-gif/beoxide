# be.oxide

Collection drop storefront with pre-orders and admin panel.

## Deploy (not Netlify)

This app is a **Node.js server** (Express + SQLite). **Netlify cannot run it** — Netlify only hosts static HTML or serverless functions, not a full backend with a database.

Use **[Render](https://render.com)** instead (free tier works):

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your repo
4. Render will detect `render.yaml`, or set manually:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Add environment variables:
   - `ADMIN_USERNAME` = `kushal.kabeer`
   - `ADMIN_PASSWORD` = your password
   - `SESSION_SECRET` = any long random string
6. Deploy — you get a URL like `https://be-oxide.onrender.com`

**Why Netlify fails:**
- No Express server to handle `/api/*`
- SQLite database needs a persistent server
- `better-sqlite3` is a native Node module (not supported on Netlify static hosting)
- Root `index.html` pointed to `localhost` (fixed for local dev only)

## Quick Start (local)

```bash
cp .env.example .env
npm install
npm start
```

- **Store:** http://localhost:3200
- **Admin:** http://localhost:3200/admin

Default admin login (change in `.env`):
- Username: `kushal.kabeer`
- Password: `wegotthis`

## Structure

Each **collection** is an album-style drop with three categories:
- Tees
- Joggers
- Tank Tops

Customers browse collections and submit **pre-orders** for active drops. You manage everything from the admin panel.

## Admin Panel

- **Dashboard** — stats and recent pre-orders
- **Collections** — create/edit/archive drops
- **Products** — add tees, joggers, tank tops to each collection
- **Pre-Orders** — view, update status, delete

## API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/collections` | — | List collections |
| GET | `/api/collections/:slug` | — | Collection + products |
| POST | `/api/preorders` | — | Submit pre-order |
| POST | `/api/admin/login` | — | Admin login |
| GET | `/api/preorders` | Admin | List pre-orders |

Database: SQLite at `data/beoxide.db`
