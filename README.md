# Keto frontend

Next.js App Router, React, TypeScript and Lucide icons. Built as a local frontend preview for the Keto hostel platform. Source lives in `keto/frontend`.

## Run

Use Node.js 22 or newer. In this directory:

```sh
npm install
npm run dev
```

Open http://localhost:3000. To verify production:

```sh
npm run typecheck
npm run build
npm start
```

## Included

- Responsive homepage using the supplied logo, red accent, neutral backgrounds and locally hosted fonts.
- Filter hostels by location and audience; sort a copied dataset by fee or availability.
- Hostel detail dialog with floors, rooms and labeled upper/lower bunks. Query-string navigation supports browser Back.
- Three-field enquiry, separate from registration and bed allocation.
- Three-step admission preview: student details, guardian/address, photo and Aadhaar file selection.
- Inline validation, numeric phone constraints, disabled invalid submits, synchronous submit lock, unsaved-change confirmation, native leave-page warning, focus-contained dialogs, success feedback and explicit successful-submit reset.
- Light/dark mode, reduced-motion support, loading skeletons and branded 404.
- Public metadata and WebSite structured data. Preview is deliberately `noindex`.

## Preview boundaries

All hostels, prices, rooms, availability and amenities are illustrative data in `src/lib/data.ts`. Photography is illustrative, not a representation of a real Keto property. Forms are local demonstrations: no backend requests, uploads, persistent student data or actual registrations. Use synthetic information and sample files. The admission preview is reachable from the footer; it is not a secure admission URL.

Authentication, owner/warden dashboards, signed admission links/QR generation, real enquiry delivery, private document storage, bed holds, atomic allocation, payment records, SMS and fines are backend/future-phase work. Do not accept real student documents until these controls are implemented.

Only the theme preference is stored in localStorage. Analytics hooks emit generic action names only when an authorized `window.gtag` integration exists; no analytics service is configured. No phone or WhatsApp number was invented.

Plain text is escaped by React. No user HTML is accepted, so DOMPurify is unnecessary for these forms. The only HTML insertion is developer-authored JSON-LD with `<` escaped. Server validation and database constraints must match frontend limits when a backend is added.

## Vercel

Import the repository, select `frontend` as the Root Directory if the repository contains `keto`'s contents, and keep the detected Next.js preset. If this directory itself is the repository root, leave Root Directory at its default. Build command: `npm run build`. Let Vercel manage the output directory.

Set `NEXT_PUBLIC_SITE_URL` to the actual production origin before deployment. No secrets belong in `NEXT_PUBLIC_` variables. Change preview `noindex` only after replacing sample content. Private application and dashboard routes must remain non-indexable. There has been no deployment from this task.

## Checklist decisions

Forms clear on success or confirmed discard; failed live submissions must preserve data. Effects clean up timers and event listeners. Lazy loading is used for below-the-fold imagery, with the hero loaded eagerly. Decorative icons are hidden by the icon library's defaults; meaningful images have alt text. Mixed-language inputs use `dir=auto`, telephone and email use `ltr`. Containers use 12/16px corners; section grids use 12 columns and gap-based spacing. Local dialogs scroll without globally hiding body overflow.

Performance budgets require a production Lighthouse run on an agreed mobile profile; no universal 1.5-second or CLS guarantee is claimed. The initial frontend has no destructive API calls or optimistic server updates. File MIME/size checks here are UX validation, not security validation.

## Assets

Logo supplied by the project owner, losslessly encoded as WebP. Illustrative room photos from Unsplash image IDs: `1555854877-bab0e564b8d5`, `1611892440504-42a792e24d32`, `1520277739336-7bf67edfa768`, `1566665797739-1674de7a421a`. Replace with actual hostel photography before launch. DM Sans and Manrope downloaded through Google Fonts and served locally.

## Verification

Production build and TypeScript validation passed. Browser checks covered enquiry validation, unsaved-change confirmation, successful submission and state reset; floor/room history with browser Back; and all admission steps including completion using harmless sample files. A 390px mobile viewport showed no horizontal page overflow, all image assets loaded, and the page contained one h1. Browser console had no captured errors during these checks. Desktop, mobile and dark-mode layouts were visually inspected. A logo contrast correction was applied to dark mode.

Dependencies are pinned and the lockfile is included. The build uses TypeScript 6 and Next.js worker threads because the development sandbox blocks child-process spawning; type validation remains enabled. The standard `npm run dev` command is intended for your normal terminal. `npm run build` followed by `npm start` was used for browser verification in this sandbox.
