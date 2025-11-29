# Backend Service

Node.js + Express API powered by Sequelize + MySQL. Targets the `ccw-database` schema provisioned via XAMPP.

## Stack

- Express for routing
- Sequelize ORM with migration-style model definitions
- MySQL2 driver for database connectivity
- JWT auth (access tokens)
- Bcrypt password hashing
- Multer (placeholder) for file uploads
- Dotenv for environment configuration

## Folder layout

```
backend/
  package.json
  src/
    config/
      database.js        // Sequelize instance
    migrations/          // Manual migration helpers (sync scripts)
    models/              // Sequelize models
    routes/              // Feature routers (auth, services, orders, portfolio)
    controllers/         // Business logic per feature
    middleware/          // auth, error handlers
    utils/               // helpers
    server.js            // App bootstrap
```

## Environment variables (`backend/.env`)

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=ccw-database
JWT_SECRET=super-secret-key
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Computerized Chhappaiwala <youremail@gmail.com>"
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
```

> **Note:** When using Gmail you must create an App Password (under Google Account → Security → App passwords) and place it in `EMAIL_PASS`. Regular account passwords are not supported by Gmail SMTP.

```

## Scripts

- `npm run dev` – start API with nodemon
- `npm run start` – production start
- `npm run db:sync` – sync all models (migration-style)
- `npm run db:ensure-register` – add any missing columns used by the new registration flow

### Password reset endpoints

The API exposes an email-based OTP flow for password resets:

- `POST /auth/password/request-reset` – send a 6-digit OTP to the user’s registered email (accepts `identifier` which can be an email or username).
- `POST /auth/password/reset` – verify the OTP and set the new password.

## Deployment Notes

- Follow the root [`DEPLOYMENT.md`](../DEPLOYMENT.md) for GitHub, DigitalOcean, and Vercel setup.
- After provisioning the database, run `npm run db:sync` (and optionally `npm run db:seed`) against your production environment. These can be triggered via SSH/console in DigitalOcean.
- The `/health` endpoint returns `{ status: "ok" }` and is safe for uptime probes.
```
