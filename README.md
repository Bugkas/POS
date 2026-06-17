# POS

POS is a lightweight Point-of-Sale web app built for small restaurants and food vendors. It provides a simple sales kiosk, inventory/ingredient tracking, and manager reporting with a focus on speed and easy Android deployment via Capacitor.

## Key Features

- Sales Kiosk: fast checkout interface for quick orders and payments.
- Inventory & Ingredients: manage menu items and ingredient quantities.
- Reports: sales and manager reports for tracking performance.
- Admin Tools: purchase logs, update manager, and settings screens.
- Mobile-ready: packaged for Android using Capacitor with a native Gradle build.

## Tech Stack

- Frontend: React + Vite
- Mobile wrapper: Capacitor (Android project under `android/`)
- Build: npm / Vite for web, Gradle for Android
- Linting: ESLint

## Quick start

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Open the Android project (after building and syncing Capacitor):

```bash
npx cap sync android
npx cap open android
```

## Project layout (high-level)

- `src/` — React app source (components, assets, data)
- `android/` — Capacitor Android project and Gradle configuration
- `public/` — static assets
- `package.json`, `vite.config.js` — build and dev tooling

If you want, I can expand the README with contribution guidelines, testing, or deployment steps.
