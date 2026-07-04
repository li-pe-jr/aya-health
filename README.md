# Aya — Your health companion

Aya by **Radix Studio** is a mobile-first PWA health companion for Ghanaian
users. Warm, calm and direct — like a trusted friend who happens to know about
health.

## Features

- **Splash / Welcome** with animated gold + green aurora
- **Onboarding** — name, about you, existing conditions, language (Twi, Ga, Ewe, English)
- **Home** — greeting, symptom check-in card, quick access, last check-in
- **Symptom Navigator** — select symptoms → guided follow-up questions → triage result
- **Result** — colour-coded recommendation (Home Care / Pharmacist / Clinic / Emergency), next steps, shareable summary, care finder, save to record
- **Health Profile** — summary, check history, medications, settings
- **Records & Medications** tabs with full loading/empty states
- Installable **PWA** (offline shell, manifest, service worker)

## Tech

- React 19 + TypeScript
- Tailwind CSS v4
- React Router
- `vite-plugin-pwa` (Workbox)
- lucide-react icons

State is persisted locally on-device (localStorage) — nothing leaves the phone.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build (+ PWA service worker)
npm run preview  # preview the production build
npm run lint     # oxlint
```

The app is mobile-first (max width 390px); on desktop it renders inside a
centred device frame.

> Aya offers guidance, not a diagnosis. Always seek professional care for
> anything serious or urgent.
