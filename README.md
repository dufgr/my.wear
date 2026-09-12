# my.wear

my.wear is a responsive apparel storefront built with Next.js. It supports product discovery, variant selection, shopping carts, customer accounts, shipping addresses, order history, and Stripe checkout.

## Preview

Screenshots and a live demo link can be added here when available.

## Core Features

- Browse products by category and explore color variants.
- Responsive storefront layouts for mobile, tablet, and desktop screens.
- Email and password registration and sign-in through Better Auth.
- Optional Google sign-in when OAuth credentials are configured.
- Persistent carts, shipping addresses, and order history.
- Stripe Checkout integration for card payments.
- PostgreSQL persistence with Drizzle ORM.

## Tech Stack

- Next.js 16.4.1 with the App Router
- React 19.3.1 and TypeScript 5
- Tailwind CSS 4 and shadcn/ui components built on Radix UI
- PostgreSQL 16, Drizzle ORM, and Drizzle Kit
- Better Auth for email/password and optional Google authentication
- Stripe for hosted checkout
- Docker Compose for local PostgreSQL development

## Architecture

The App Router serves storefront and account pages. Server components read catalog and order data through Drizzle, while server actions handle cart updates, addresses, and checkout preparation. Better Auth persists users and sessions in PostgreSQL using the shared Drizzle schema. Stripe Checkout handles payment collection, and a webhook updates order status.

The database schema separates catalog categories, products, and product variants, then relates variants to cart items and order items. User-owned carts, addresses, sessions, and orders are connected through foreign keys. Catalog sample data is provided in `src/db/seed.ts`.

## Local Development

### Requirements

- Node.js 20.9 or newer
- npm
- Docker Desktop with the Docker daemon running

### Install and configure

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from the example and replace the Better Auth secret with a random value of at least 32 characters:

   ```bash
   cp .env.example .env
   ```

   The example values connect to the local PostgreSQL container. The local auth bypass is enabled only in development, so you can test the cart without signing in. It is always disabled in production; set `NEXT_PUBLIC_LOCAL_AUTH_BYPASS=false` to test email/password authentication locally. Google sign-in appears only when both Google OAuth values are set.

3. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Apply the checked-in Drizzle migrations to the local database:

   ```bash
   npm run db:migrate
   ```

5. Optionally populate the sample catalog:

   ```bash
   npm run db:seed
   ```

   The seed script clears existing catalog variants, products, and categories before inserting sample data. Use it only with a disposable development database.

6. Start the application:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Create an account on the authentication page to test local sign-in. Add Stripe test keys to `.env` to exercise checkout.

For schema changes, generate and apply versioned migrations with `npm run db:generate` and `npm run db:migrate`. `npm run db:push` is available for local development when you do not need to preserve migration history.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret used to sign authentication data |
| `BETTER_AUTH_URL` | Canonical application URL used by Better Auth |
| `NEXT_PUBLIC_APP_URL` | Base URL used to build Stripe return URLs |
| `NEXT_PUBLIC_LOCAL_AUTH_BYPASS` | Enables the local development identity; ignored in production |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth client secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js publishable key |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Signature secret for Stripe webhooks |

## Vercel Deployment

Deploy the repository as a Next.js application on Vercel and configure production environment variables in the Vercel project settings. Use a managed PostgreSQL database such as Neon for `DATABASE_URL`, set a strong `BETTER_AUTH_SECRET`, and set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the production domain. Configure Google OAuth credentials and Stripe keys to enable those production integrations. Run generated Drizzle migrations against the production database before serving traffic. The application is structured for Vercel's serverless Next.js deployment model.
