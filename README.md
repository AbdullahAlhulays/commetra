# Commetra landing page

A responsive React + Vite marketing site for Commetra, a social media comment management platform currently in development.

## Run locally

1. Install dependencies with `npm install`.
2. Start the development server with `npm run dev`.
3. Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

Run `npm run build` to create an optimized production build in `dist/`.

Run `npm run preview` to preview the production build locally.

## Error monitoring

Production builds report uncaught React errors, route errors, performance traces,
and sampled session replays to Sentry. The browser DSN and sampling rates are in
`src/instrument.ts`. Tracing samples 100% of transactions; replay samples 10%
of sessions and 100% of sessions with errors. Trace headers are limited to
requests to the site's own origin. Monitoring is disabled in local development.

## Pages

- `/` — Landing page
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/data-deletion` — Data deletion instructions
