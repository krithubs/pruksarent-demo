# Pruksa Rental Website Demo

Next.js 14 proposal demo for a bilingual Pruksa rental website.

## Features

- Thai/English language toggle with localStorage persistence
- Homepage smart search, living type cards, featured projects, promotions, blog highlights, map preview
- Rent listing with filters, sort, grid/list/map view
- Project detail with gallery, lead form, available units, favorite, compare, and booking modal
- Promotions listing/detail with eligible project reuse
- Blog listing/detail with categories, rich article layout, related posts, share actions
- About page with Pruksa Rental story, category explainer, how-it-works, system/data flow, scope notes
- Contact page with contact cards, map preview, and validated lead form
- Cookie consent banner with Accept/Reject/Customize

## Tech Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- shadcn-style local components
- lucide-react icons
- react-hook-form + zod
- Framer Motion for subtle hero animation
- Mock JSON data in `/data`

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Phase 2 Placeholders

- PMS/iPlern booking integration
- Mobile payment transaction
- CMS backend such as Strapi, Payload, or WordPress
- CRM/CDP integrations and production analytics datalayer
