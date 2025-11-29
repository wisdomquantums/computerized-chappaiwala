# Computerized Chhappaiwala – Frontend

React 19 + Vite client for the CCW platform. Uses Redux Toolkit, React Router, Tailwind utilities, and custom admin widgets.

## Getting Started

```bash
cd frontend
npm install
cp .env.example .env        # point VITE_API_URL to the live backend
npm run dev                  # http://localhost:5173
```

## Build & Preview

```bash
npm run build
npm run preview
```

## Environment Variables

| Key                  | Description                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- |
| `VITE_API_URL`       | Public HTTPS URL to the backend API (`https://api.computerizedchhappaiwala.com/api`). |
| `VITE_DEV_API_URL`   | Local dev API fallback (`http://localhost:4000/api`).                                 |
| `VITE_INQUIRY_EMAIL` | Email shown inside the contact form metadata.                                         |

## Deploying to Vercel

1. Push this repo to GitHub (see root `DEPLOYMENT.md`).
2. In Vercel → **Add New Project** → Import GitHub repo.
3. Set **Root Directory** to `frontend`.
4. Build command: `npm run build` · Output directory: `dist` · Install command: `npm install`.
5. Add the environment variables above under **Settings → Environment Variables** (copy from `.env.example`).
6. Trigger deploy. Vercel will serve the static build over its CDN.

## Production Considerations

- Configure `VITE_API_URL` to point at the HTTPS load balancer in front of the DigitalOcean backend.
- Use Vercel Protect or custom headers for caching-sensitive admin routes.
- Rebuild whenever sitemap/robots/meta is updated so crawlers get the latest assets from `/public`.
