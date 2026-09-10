# Lumina Health — AI-Powered Personal Health Management Platform

> **Frontend prototype.** This repository contains only the UI/UX demonstration of the platform.
> Everything runs on **mock data and frontend state** — there is no backend, database, API,
> authentication service, real OCR, real document processing, HRM model, PyTorch code or RAG pipeline.
> AI responses are conceptual simulations and are **not medical advice or diagnosis**.

Lumina Health connects fragmented health information — records, reports, medications, vitals and
appointments — into one secure, role-aware experience with an AI intelligence layer, patient consent
controls and a full audit trail.

```
FRAGMENTED HEALTH DATA → CONNECTED EXPERIENCE → ROLE + CONSENT → RAG → HRM → ROLE-SPECIFIC AI INSIGHT
```

## Tech stack

- Next.js (App Router) + React + **JavaScript** (no TypeScript)
- Tailwind CSS + shadcn/ui-style components
- Lucide React icons
- Recharts for charts
- Framer Motion for animation
- React Three Fiber + Drei for the 3D "Health Intelligence Core"

## Getting started

```bash
npm install
npm run dev      # development on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page with the 3D Health Intelligence Core and the interactive RAG/HRM workflow |
| `/login` | Sign-in UI (demo — any credentials work) |
| `/roles` | Role selection: Patient, Doctor, Nurse, Laboratory, Pharmacist, Administrator |
| `/patient` | Patient dashboard — vitals, trends, reports, medications, Health Intelligence |
| `/doctor` | Doctor dashboard — assigned patients, schedule, pending reports |
| `/nurse` | Nurse dashboard — tasks, vitals to record, observations, alerts |
| `/laboratory` | Laboratory dashboard — queue + simulated upload pipeline (Uploading → Reading → Extracting → Ready) |
| `/pharmacist` | Pharmacist dashboard — dispensing queue, medication changes |
| `/admin` | Admin dashboard — users, roles, access requests, security events, charts |
| `/records` | Health records with filters (Reports / Prescriptions / Lab Results / Visits / Vitals) |
| `/reports` · `/reports/[id]` | Report list and the medical report viewer (document preview + extracted info) |
| `/vitals` | Six vital charts with 7D / 30D / 90D / 1Y ranges |
| `/medications` | Medication cards + yearly timeline |
| `/appointments` | Calendar + appointment cards + booking dialog |
| `/assistant` | Role-aware AI explainer with RAG and HRM visualizations |
| `/consent` | "Who can access your health information?" with animated toggles and consent timeline |
| `/audit` | Filterable audit timeline (role, action, resource, time, status) |
| `/settings` | Profile, notifications, privacy and appearance settings |
| `/dashboard` | Convenience redirect to the current role's dashboard |

## Suggested demo flow

1. Open the landing page → **Explore Platform**
2. Continue as **Patient** → view the health overview
3. Open a report → **Ask Health Intelligence**
4. Watch the mock AI: permission check → retrieval → RAG context → HRM reasoning → insight
5. Open **Consent & Access** → grant/revoke access
6. Switch role to **Doctor** in the sidebar → different dashboard + *Clinical Intelligence*
7. Open **Audit Activity** → see the consent and AI events you just created

## Accessibility & motion

- Keyboard navigation and visible focus states throughout
- ARIA labels on interactive controls; semantic landmarks
- `prefers-reduced-motion` is respected globally and by the 3D scene
- Mobile: compact header, bottom navigation, full-screen AI panel

## Mock data

All entities live in `lib/data.js` (deterministic, SSR-safe series generation) and `lib/ai-engine.js`
(keyword-matched role-aware mock responses). No network calls are made at runtime.
