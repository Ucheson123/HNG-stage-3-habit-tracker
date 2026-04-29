# HNG14 Stage 3: Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built to strict TRD specifications.

## Project Overview
This application is a local-first, deterministic habit tracker built with Next.js App Router, React, TypeScript, and Tailwind CSS. It utilizes `localStorage` for all data persistence to ensure a fast, offline-capable user experience without relying on external databases. 

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest (Unit), React Testing Library (Integration), Playwright (E2E)

## Setup & Run Instructions
1. Clone the repository: `git clone <your-repo-url>`
2. Navigate to the directory: `cd hng-stage-3-habit-tracker`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open `http://localhost:3000` in your browser.

## Test Instructions
The test suite validates the application against the exact TRD contracts.

- **Run Unit Tests (with Coverage):** `npm run test:unit`
- **Run Integration Tests:** `npm run test:integration`
- **Run End-to-End Tests:** `npm run test:e2e` (Requires `npx playwright install` first)
- **Run All Tests:** `npm run test`

## Local Persistence Structure
Data is stored deterministically in `localStorage` using three exact keys:
1. `habit-tracker-users`: JSON array of `User` objects (`id`, `email`, `password`, `createdAt`).
2. `habit-tracker-session`: JSON object of the active `Session` (`userId`, `email`) or `null`.
3. `habit-tracker-habits`: JSON array of `Habit` objects tracking daily `completions` array.

## PWA Implementation
The app implements a custom Service Worker (`public/sw.js`) and Web Manifest (`public/manifest.json`). The Service Worker instantly caches the app shell routes (`/`, `/login`, `/signup`, `/dashboard`) on install and intercepts `fetch` requests to serve the cached UI when the device is offline, preventing the default browser crash screen.

## Assumptions & Trade-offs
- **Authentication:** Passwords are stored in plain text in `localStorage` strictly to satisfy the local, deterministic requirements of this specific stage without external services.
- **Timezones:** Streak calculations assume the user's local browser timezone for the definition of "today" (YYYY-MM-DD).

## Test Mapping & Verification

### Unit Tests
- `tests/unit/slug.test.ts`: Verifies `getHabitSlug` generates lowercase, hyphenated, alphanumeric strings.
- `tests/unit/validators.test.ts`: Verifies `validateHabitName` rejects empty/long strings and trims valid inputs.
- `tests/unit/streaks.test.ts`: Verifies `calculateCurrentStreak` accurately counts consecutive days backwards from today and ignores duplicates.
- `tests/unit/habits.test.ts`: Verifies `toggleHabitCompletion` safely adds/removes dates immutably without duplicates.

### Integration Tests
- `tests/integration/auth-flow.test.tsx`: Verifies signup/login form submissions, duplicate email rejection, and routing behavior.
- `tests/integration/habit-form.test.tsx`: Verifies habit creation, empty name validation, editing (preserving immutable fields), explicit deletion confirmation, and completion toggling.

### End-to-End Tests
- `tests/e2e/app.spec.ts`: Verifies the complete user journey in a Chromium browser, including splash screen delays, protected route redirects, habit lifecycle, session persistence across reloads, and offline PWA cache rendering.