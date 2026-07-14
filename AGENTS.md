<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-overview -->

# Sacrament Meeting Planner

A minimal, reverent web application for LDS church leaders and members to organize and manage sacrament meetings.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` with `@theme inline` tokens)
- **Fonts**: Inter (body), Lora (headings) via `next/font/google`

## Design System

- **Primary**: `#003366` — deep navy for headers and key actions
- **Secondary**: `#A7B6C2` — soft steel blue for highlights and accents
- **Background**: `#F9FAFB` — light neutral background
- **Text**: `#2E2E2E` — dark gray for readability
- **Muted**: `#4A5568` — secondary body text / icons (WCAG AA on light backgrounds)
- **Accent**: `#CBB67C` — warm gold for subtle emphasis
- **Border**: `#9AA3AF` — gray borders with ≥3:1 contrast on white
- **Radii**: `6px` / `10px` / `16px` / `24px` (sm/md/lg/xl)
- **Shadows**: soft, card, elevated — all subtle and muted
- **Spacing**: `4/8/16/24/32/48px` scale

## Key Files

- `app/globals.css` — all design tokens, base styles, component classes, utilities
- `app/layout.tsx` — root layout with font setup and metadata
- `app/page.tsx` — home page
- `app/lib/types.ts` — domain types
- `app/lib/dates.ts` — Sunday-aware date helpers (date-fns)
- `app/lib/meeting-db.ts` — in-memory meetings data + query helpers
- `app/lib/api.ts` — server-side fetch helpers for meeting APIs
- `app/api/meetings/` — REST route handlers

## API Routes

- `GET /api/meetings` — list meetings (`?scope=all|upcoming|past`, `?type=…`, `?date=…`)
- `POST /api/meetings` — create meeting (date, type, presiding, conducting)
- `GET /api/meetings/current` — current Sunday meeting (or most recent on/before)
- `GET /api/meetings/[id]` — single meeting by id

Pages load meeting data via `app/lib/api.ts` (server-side HTTP fetch to `/api/meetings*`).
Browser mutations use `app/lib/client-api.ts` or relative `fetch('/api/...')`.
Creating a meeting uses a client modal (`CreateMeetingButton` / `CreateMeetingModal`), not a `/meetings/new` page.

### Env (server fetch base URL)

`app/lib/api.ts` needs an absolute origin for SSR self-fetch:

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_BASE_URL` | Preferred. Full origin, e.g. `https://your-app.vercel.app` (no trailing slash). |
| `VERCEL_URL` | Auto-set by Vercel (host only). Code prefixes `https://`. |

Local default if unset: `http://localhost:3000`.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server

## Guidelines

- Keep UI minimal and uncluttered
- All buttons and inputs must have rounded corners
- Use consistent spacing and soft shadows
- Tone should feel peaceful, organized, and spiritually aligned
- Responsive for desktop and mobile

## Conventions

- Use Tailwind utility classes for colors (`bg-white`, `border-border`, `text-foreground`, `text-muted`, `bg-primary/10`, `bg-secondary/20`, etc.) instead of `var(--color-...)` — all design tokens are registered in `@theme inline` and available as Tailwind utilities.
- Prefer `text-muted` over `text-foreground/40–70` or `text-secondary` for secondary copy — low-opacity text often fails WCAG AA.
- Meetings are Sunday-based. Use `date-fns` via `app/lib/dates.ts` for calendar math.
- Fetch meetings through `/api/meetings*` using helpers in `app/lib/api.ts`.

## App Requirements

The app should support creating sacrament meeting entries for each Sunday, with default meeting details and one of the following meeting types:

- **testimony**
- **regular**
- **stake** (non-sacrament meeting)
- **general** (non-sacrament meeting)

### Leader capabilities

Leaders should be able to:

- View and navigate between a list of sacrament meeting entries and their details
- Manage sacrament meeting details including:
  - Opening Hymn
  - Opening Prayer
  - Ward Business
  - Stake Business (true/false)
  - Sacrament Hymn
  - Speakers
  - Musical Numbers
  - Closing Hymn
  - Closing Prayer

### Program view

Users should be able to view and print the meeting program for the current and past weeks.
<!-- END:project-overview -->
