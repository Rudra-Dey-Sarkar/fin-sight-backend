# Fin-Sight Backend

Fin-Sight Backend is a Node.js and Express API for a finance dashboard system. It supports JWT authentication, role-based access control, financial record management, and dashboard analytics backed by PostgreSQL.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (`pg`)
- JWT authentication
- Zod validation
- bcryptjs password hashing

## Project Structure

```text
fin-sight-backend/
├── access-control/
├── config/
├── constants/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── dashboard/
│   ├── record/
│   └── user/
├── scripts/
├── src/
├── tests/
├── .env
├── .env.example
├── package.json
└── README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Update `.env` with your PostgreSQL connection and JWT secret.

3. Run the database migration:

```bash
npm run migrate
```

4. Seed the initial admin user and sample records:

```bash
npm run seed
```

5. Start the API:

```bash
npm start
```

The server runs on `http://localhost:5000` by default.

## Environment Variables

Copy `.env.example` values into your local environment and update them as needed:

- `PORT`
- `DATABASE_URL`
- `DATABASE_SSL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SAMPLE_RECORD_SEED`

## Scripts

- `npm start` starts the API server
- `npm run dev` runs the server with the same command used for start
- `npm run migrate` creates tables and indexes
- `npm run seed` inserts the initial admin user and sample records

## Role Access

- `viewer`: can read dashboard summary only
- `analyst`: can read dashboard summary and financial records
- `admin`: full access to authentication, users, records, and dashboard endpoints

## API Overview

### Health

- `GET /health`

### Auth

- `POST /api/auth/login`

Request body:

```json
{
  "email": "admin@finsight.local",
  "password": "Admin@12345"
}
```

### Users

- `POST /api/users`
- `GET /api/users`
- `PATCH /api/users/:id`

Create user body:

```json
{
  "name": "Ava Analyst",
  "email": "ava@example.com",
  "password": "StrongPass123",
  "role": "analyst",
  "status": "active"
}
```

Update user body:

```json
{
  "role": "viewer",
  "status": "inactive"
}
```

### Records

- `POST /api/records`
- `GET /api/records`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`

Create record body:

```json
{
  "amount": 2500,
  "type": "income",
  "category": "Consulting",
  "date": "2026-04-03",
  "notes": "Project milestone payment"
}
```

Supported query parameters for `GET /api/records`:

- `dateFrom`
- `dateTo`
- `type`
- `category`
- `page`
- `limit`

### Dashboard

- `GET /api/dashboard/summary`

Dashboard response fields:

- `totalIncome`
- `totalExpense`
- `netBalance`
- `categoryTotals`
- `recentActivity`
- `monthlyTrends`

## Authentication

Protected routes require a bearer token:

```text
Authorization: Bearer <jwt-token>
```

The login response returns a token and the authenticated user summary.

## Sample Admin Credentials

- Email: `admin@finsight.local`
- Password: `Admin@12345`

These values come from `.env` and can be changed before running the seed script.

## Assumptions and Trade-offs

- Viewer access is limited to dashboard summaries.
- Analysts can inspect records but cannot create, update, or delete them.
- Admins are the only users allowed to manage users or mutate records.
- Automated Jest tests are intentionally deferred, but the code is structured for easy addition later.
- The permission provider is asynchronous so the permission source can move to Redis or a database later without changing middleware logic.
