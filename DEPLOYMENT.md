# Deployment Playbook

This repository contains the Vite frontend (`frontend/`) and Express API (`backend/`). Use this checklist to publish the project through GitHub, DigitalOcean, and Vercel.

---

## 1. Push to GitHub

1. Sign in to GitHub → **New Repository** → name it `computerized-chhappaiwala` (or similar) without initializing files.
2. On your machine:
   ```bash
   cd /path/to/ccw-sitamarhi
   git init
   git remote add origin https://github.com/<user>/<repo>.git
   git add .
   git commit -m "Initial import"
   git branch -M main
   git push -u origin main
   ```
3. Enable branch protection / PR workflows as needed once the repo exists.

> DigitalOcean App Platform and Vercel can now pull the code directly from GitHub for automated deploys.

---

## 2. Backend + Database on DigitalOcean

### Option A – App Platform (recommended)

1. In DigitalOcean, create a **Managed MySQL** cluster:
   - Note the hostname, port (default `25060`), database name, user, and password.
   - Add your droplet/VPC to the trusted sources list.
2. Create an **App Platform** project → **Create App** → select your GitHub repo → choose the `backend` directory.
3. Build & run commands:
   - Build: `npm install`
   - Run: `npm run start`
4. Under **Environment Variables**, set the keys from `backend/.env.example`:
   - `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `EMAIL_*` variables (if email sending is required)
5. After the first deploy, open the App Platform console and run:
   ```bash
   npm run db:sync
   npm run db:seed       # optional: seeds default roles/users/services
   ```
6. Expose the service via HTTPS by enabling the default DigitalOcean certificate. The public URL should look like `https://api.computerizedchhappaiwala.com`.

### Option B – Droplet (manual)

1. Provision an Ubuntu 22+ droplet.
2. Install Node 20 LTS, Nginx, and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx
   sudo npm install -g pm2
   ```
3. Clone the GitHub repo on the droplet and configure `.env` using the Managed MySQL credentials.
4. Install dependencies + build static assets:
   ```bash
   cd /var/www/ccw-sitamarhi/backend
   npm install
   pm2 start src/server.js --name ccw-api
   pm2 save && pm2 startup
   ```
5. Configure Nginx as a reverse proxy on `api.computerizedchhappaiwala.com` pointing to `http://localhost:4000` and secure with Let’s Encrypt.

### Database migrations

- `npm run db:sync` syncs all Sequelize models.
- `npm run db:seed` seeds baseline roles, permissions, and demo data.
- `npm run db:ensure-register` ensures newer columns exist for user registration.

---

## 3. Frontend on Vercel

1. In Vercel, **Import Project** from the GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Configure build settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables from `frontend/.env.example` (at least `VITE_API_URL` pointing to the DigitalOcean backend URL, plus `VITE_INQUIRY_EMAIL`).
5. Deploy. Vercel will automatically rebuild on every push to `main`.

### Optional: Preview Environments

Vercel can create preview deployments for Pull Requests. Remember to set preview-specific env values (e.g., `VITE_API_URL=https://staging-api...`).

---

## 4. DNS & SSL

- Point `api.computerizedchhappaiwala.com` to DigitalOcean (App Platform or Droplet) and issue a TLS cert.
- Point the main `computerizedchhappaiwala.com` domain (or `www`) to the Vercel project.
- Keep `sitemap.xml` and `robots.txt` in `frontend/public/` so Vercel serves them automatically.

---

## 5. Post-Deploy Checklist

- Verify `https://api.../health` returns `{ status: "ok" }`.
- Run through login/signup, orders, and payment flows using live Razorpay keys.
- Trigger the contact form to ensure SMTP credentials work (logs appear in DO console).
- Submit the sitemap URL to Google Search Console once DNS propagates.
