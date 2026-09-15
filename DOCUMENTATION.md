# InnoRyze Marketing Maturity Assessment — Project Documentation

## 1. Overview

This is a **Vite + React + TypeScript** single-page application that implements a **7-step marketing maturity assessment wizard**. Users answer a series of category-based questions about their marketing operations (split by business type: **B2B** or **B2C**), and the app submits their answers to a backend API which scores them, benchmarks them against industry standards, and returns a personalized growth plan ("Crawl / Walk / Run") along with an executive summary.

The project was scaffolded/managed via **Lovable** (lovable.dev) and uses the **shadcn-ui** component library on top of **Tailwind CSS**.

- **Project name (package.json):** `vite_react_shadcn_ts`
- **Lovable project URL:** https://lovable.dev/projects/3d480ded-8f24-44c3-b4b3-e4aaba946e25

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 5 (`@vitejs/plugin-react-swc`) |
| Language | TypeScript 5 |
| UI library | React 18 |
| Routing | react-router-dom v6 |
| Styling | Tailwind CSS 3 + `tailwindcss-animate` + `@tailwindcss/typography` |
| Component kit | shadcn-ui (Radix UI primitives + `class-variance-authority`) |
| Forms | react-hook-form + zod + `@hookform/resolvers` |
| Data fetching / cache | `@tanstack/react-query` |
| Charts | Recharts |
| Notifications | `sonner` + custom `use-toast` hook / Toaster |
| Dev-only tooling | `lovable-tagger` (component tagging in dev mode) |
| Package manager | Supports both `npm` (package-lock.json) and `bun` (bun.lock / bun.lockb) |
| Misc dependency | `mongoose` (listed in dependencies, but no backend/server code exists in this repo — see §7) |

---

## 3. Project Structure

```
imma-a4151a59-main/
├── index.html                # Vite HTML entry point
├── vite.config.ts            # Vite config (port 8080, "@" -> src alias)
├── tailwind.config.ts        # Tailwind theme/config
├── postcss.config.js
├── tsconfig*.json            # TypeScript project configs
├── components.json           # shadcn-ui CLI config
├── eslint.config.js          # ESLint flat config
├── package.json
├── public/                   # Static assets served as-is
└── src/
    ├── main.tsx               # React root bootstrap (mounts <App /> into #root)
    ├── App.tsx                # Top-level providers + router
    ├── App.css / index.css    # Global styles
    ├── vite-env.d.ts
    ├── api.ts                 # Backend API client + shared TypeScript types
    ├── config/
    │   └── questions.ts       # All assessment questions, categories, challenge options
    ├── hooks/
    │   ├── useWizardPersistence.ts  # sessionStorage/localStorage persistence for wizard state
    │   ├── use-toast.ts
    │   └── use-mobile.tsx
    ├── lib/
    │   └── utils.ts           # `cn()` class-merging helper (clsx + tailwind-merge)
    ├── assets/                # Logo SVGs (light/dark)
    ├── components/
    │   ├── BackgroundLayer.tsx  # Ambient animated background
    │   ├── FocusTooltip.tsx
    │   ├── GlowingCard.tsx
    │   ├── NavLink.tsx
    │   ├── ScrollToTop.tsx
    │   ├── Stepper.tsx           # Step progress indicator (1–7)
    │   └── ui/                   # shadcn-ui primitives (accordion, dialog, button, form, etc.)
    ├── pages/
    │   ├── Index.tsx            # "/" route — renders <AssessmentWizard />
    │   └── NotFound.tsx         # catch-all "*" route
    └── wizard/
        ├── AssessmentWizard.tsx     # Orchestrates the 7-step flow + state management
        ├── Step1BusinessType.tsx    # Choose B2B or B2C
        ├── Step2BasicInfo.tsx       # Collects name, email, business name, etc.
        ├── Step3Categories.tsx      # Choose which maturity categories to assess
        ├── Step4Questions.tsx       # Answer scored questions + challenge (multi-select) question per category
        ├── Step5Results.tsx         # Shows scores, benchmarks, category insights; pick a growth plan
        ├── Step6Growth.tsx          # Growth simulation for the selected plan (crawl/walk/run)
        └── Step7ExecutiveSummary.tsx# Final executive summary / report view
```

---

## 4. Application Flow

The entire experience is driven by `src/wizard/AssessmentWizard.tsx`, a single stateful component that renders one of seven steps based on `currentStep` (1–7):

1. **Step 1 — Business Type**: User selects `B2B` or `B2C`. This choice determines which question set and category labels are used throughout the rest of the flow (see `src/config/questions.ts`).
2. **Step 2 — Basic Info**: Collects `firstName`, `email`, `businessName`, and optionally `country`/`industry`. On "Next," calls `startAssessment()` (POST `/api/assessments/start`) which returns an `assessmentId` used for all subsequent calls.
3. **Step 3 — Categories**: User selects which maturity categories to be assessed on (e.g., Data Management, Targeting, Channels, Content, etc. for B2B; different set for B2C — see `CATEGORY_LABELS` / `CATEGORY_GROUPS` in `questions.ts`).
4. **Step 4 — Questions**: For each selected category, the user answers 4 scored Likert-style questions plus 1 "challenge" question (multi-select, up to 3 options) about blockers in that category. On submit, calls `submitAssessment()` (POST `/api/assessments/:id/submit`) which returns the full `SubmitAssessmentResponse` (scores, benchmarks, per-category analysis, growth simulation options).
5. **Step 5 — Results**: Displays category scores vs. benchmarks, per-category strengths/weaknesses (`strongCategories`, `stretchCategories`, `analysis.perCategory`), and lets the user pick a growth plan: `crawl`, `walk`, or `run`.
6. **Step 6 — Growth**: Shows the growth simulation (`current` vs `after` score per category) for the selected plan, with the option to switch plans.
7. **Step 7 — Executive Summary**: Final report combining results + selected plan; "Finish" clears all persisted state and resets the wizard back to Step 1.

Users can navigate **Back** at any step (except Step 1), and a **"Start Over"** control (visible from Step 2 onward) resets the entire wizard and clears persisted state.

---

## 5. State Management & Persistence

State lives entirely in local React state inside `AssessmentWizard`, split into two persistence tiers via `src/hooks/useWizardPersistence.ts`:

- **Session state** (`sessionStorage`, prefix `imma_v1_`): `currentStep`, `businessType`, `userInfo`, `selectedCategories`, `assessmentId`, `answers`, `results`, `selectedPlan`. This means a user's progress survives a page refresh but **not** a closed tab/browser (by design — session storage semantics).
- **Theme preference** (`localStorage`, key `imma_theme_preference`): dark/light mode, persists indefinitely across sessions. Defaults to **dark mode**.

All storage reads/writes are wrapped in try/catch (`safeGetSessionItem` / `safeSetSessionItem`) to silently degrade if storage is unavailable or full.

---

## 6. API Contract (`src/api.ts`)

The frontend expects a backend running at:

```ts
export const API_BASE_URL = "http://localhost:5000";
```

> ⚠️ This is hardcoded (not an environment variable). To point at a different backend, this constant must be edited directly, or refactored to use a Vite env variable (e.g. `import.meta.env.VITE_API_BASE_URL`).

### Endpoints consumed

| Function | Method | Endpoint | Purpose |
|---|---|---|---|
| `startAssessment(data)` | POST | `/api/assessments/start` | Creates a new assessment; returns `{ assessmentId }` |
| `submitAssessment(id, data)` | POST | `/api/assessments/:id/submit` | Submits answers; returns full scoring/analysis payload |
| `getAssessment(id)` | GET | `/api/assessments/:id` | Fetches an existing assessment (defined but not currently called from the wizard UI) |
| `generatePDF(id)` | POST | `/api/assessments/:id/pdf` | Requests PDF export; explicitly handles `501 Not Implemented` (defined but not currently called from the wizard UI) |

### Key shared types

- `UserInfo` — `firstName`, `email`, `businessName`, optional `country`/`industry`
- `Answer` — `{ score: number; note?: string }`
- `SubmitAssessmentResponse` — `scores`, `analysis.perCategory`, `benchmarks`, `options` (crawl/walk/run plan descriptions), `growthSimulation` (per-plan before/after scores), optional `resultMode`, `strongCategories`, `stretchCategories`

**Note:** No backend/server source is present in this repository — `mongoose` appears in `package.json` dependencies but there is no corresponding server code, suggesting the backend is either a separate repository/service or was removed. To run the app end-to-end, a compatible API server implementing the above contract must be running on port 5000.

---

## 7. Questions & Scoring Content (`src/config/questions.ts`)

This file is a large static content module (~800 lines) defining the entire assessment questionnaire, independent of any backend:

- **`CATEGORY_DESCRIPTIONS`** — one-line explanation per category, separately for B2B and B2C.
- **`CATEGORY_GROUPS`** — groups categories into 4 UX sections: *Strategy & Foundation*, *Data/Technology & Enablement*, *Campaigns & Execution*, *Performance & Operations*.
- **`CATEGORY_LABELS`** — human-readable display names per category key.
- **`QUESTIONS`** — for each business type and category, an array of 5 questions:
  - 4 standard Likert/maturity questions (`Question`: `id`, `text`, `helperText`)
  - 1 **challenge question** (`ChallengeQuestion`): multi-select (up to 3) of common blockers, flagged via `isChallenge: true` and an `options` array of `ChallengeOption` (`id`, `label`)
- **`isChallengeQuestion()`** — type guard distinguishing `Question` from `ChallengeQuestion`.

**B2B categories:** data, targeting, channels, content, lead-to-pipe, analytics, technology, customer-experience, people, process
**B2C categories:** offers-targeting, channels, engagement, data-analytics, technology, customer-experience, loyalty, people, process

---

## 8. Routing

`src/App.tsx` wraps the app in `QueryClientProvider` (react-query), `TooltipProvider`, and two toast systems (`Toaster` + `Sonner`), then defines routes via `react-router-dom`:

- `/` → `Index` (renders the full `AssessmentWizard`)
- `*` → `NotFound` (catch-all 404)

A comment in the code marks where custom routes should be added: `// ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE`.

---

## 9. Theming & Branding

- Dark mode is the default; toggled via a segmented control in the sticky header (desktop) or a mobile dropdown menu.
- Theme class (`light`) is toggled on `document.documentElement`; Tailwind's dark-mode strategy consumes this.
- **Logo swap based on theme**: dark mode uses a remote SVG hosted at `https://innooryze.com/wp-content/uploads/2025/05/Frame-72.svg`; light mode uses a local asset `src/assets/ir-logo-light-mode.svg`.
- Header includes a "Contact Us" external link to `https://innooryze.com/contact`.

---

## 10. Development

### Prerequisites
Node.js + npm (or Bun, since both lockfiles are present).

### Scripts (`package.json`)

```bash
npm run dev        # Start Vite dev server (http://localhost:8080)
npm run build       # Production build
npm run build:dev   # Development-mode build
npm run lint        # Run ESLint
npm run preview     # Preview a production build locally
```

### Dev server config
- Runs on **port 8080**, bound to all interfaces (`host: "::"`).
- `lovable-tagger`'s `componentTagger()` plugin is only enabled in development mode.
- Path alias: `@` → `./src`.

### Running the full app
1. `npm i`
2. Ensure a backend implementing the `/api/assessments/*` contract (see §6) is running at `http://localhost:5000`.
3. `npm run dev` and open `http://localhost:8080`.

Without a live backend, the wizard will get stuck at Step 2 (Basic Info) and Step 4 (Questions submission), since both rely on successful API calls; failures surface as destructive toast notifications ("Failed to start/submit assessment. Please try again.").

---

## 11. Deployment

Per the original `README.md`, this project was designed to be deployed/published via **Lovable** (Share → Publish from the Lovable project dashboard), with optional custom domain support (Project → Settings → Domains). It can also be built as a standard static site (`npm run build`) and hosted anywhere that serves static files, provided the backend API is reachable at the URL configured in `src/api.ts`.

---

## 12. Known Gaps / Things to Verify Before Production Use

- `API_BASE_URL` is hardcoded to `localhost:5000` — needs to be made configurable (env var) for any non-local deployment.
- No backend source is included in this repo; the API contract in `src/api.ts` must be implemented separately.
- `mongoose` is an unused dependency at the frontend level (no `import` of it appears in `src/`) — likely a leftover from a backend that used to live in/alongside this repo.
- `getAssessment()` and `generatePDF()` are defined in `api.ts` but not invoked anywhere in the current wizard flow — potential dead code or features planned but not wired up in the UI.
