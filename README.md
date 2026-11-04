# Testimonial Engine — Customer Social Proof & Feedback Platform

An all-in-one customer social proof management suite inspired by **Testimonial.to**, built strictly in adherence with the provided **Product Requirements Document (PRD)** and **Software Requirements Specification (SRS)**.

---

## 🌟 Key Functional Modules (PRD & SRS Conformance)

### 1. 🎥 Capture Module (PRD 4.1)
- **Branded Collection Spaces (`/submit/[slug]`):** Custom header, logo, theme, brand color, and guiding prompts.
- **Dual Submission Engine:**
  - **In-Browser Video Recording:** Direct WebRTC webcam recording with live microphone visualizer meter, countdown, timer (up to 3 min limit), review playback, and file upload fallback.
  - **Text Testimonials:** Interactive 5-star rating selector, reviewer photo/avatar picker, text quote, company, social handles, and explicit permission consent checkbox.
- **Celebration & Thank You:** Fireworks confetti animation (`canvas-confetti`), branded message, and optional redirect URL.

### 2. 📊 Measure & Analytics Module (PRD 4.2)
- **Automated NPS Engine:** Net Promoter Score survey (0–10) calculation with index scale ($-100$ to $+100$) and visual promoter/passive/detractor gauges.
- **Promoter Follow-Up Automation:** Automatically triggers an invitation for Promoters (scores 9–10) to record a video review.
- **Brand Social Mentions Importer:** Import and display social praise from Twitter/X, LinkedIn, and Reddit directly onto your Wall of Love.

### 3. 💖 Showcase & Widget Module (PRD 4.3 & SRS 5.1)
- **Responsive Masonry Wall of Love (`/embed/[slug]/wall`):** Multi-column responsive layout with custom video playback and expandable transcripts.
- **Scrolling Marquee (`/embed/[slug]/carousel`):** Infinite animated horizontal ticker that pauses on hover.
- **Social Proof Badge (`/embed/[slug]/badge`):** Floating/inline pill with avatar stack and 5-star average.
- **Embed Generator:** Live customizer (Dark/Light mode, star ratings, border radius) with instant 1-line `<script>`, `<iframe>`, and React code snippet generators.
- **Universal Embed Script (`/embed.js`):** Lightweight asynchronous embed loader with auto-resizing via `postMessage`.

### 4. 🤖 AI & Automation Module (PRD 4.4)
- **Automated Speech-to-Text:** Whisper AI pipeline instant transcript generation for video testimonials.
- **AI Case Study Generator:** Synthesizes selected customer testimonials into structured case studies featuring Executive Summary, Challenge, Solution, and Measurable ROI metrics.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & APIs:** Next.js Serverless Route Handlers (`/api/v1/...`).
- **Database & ORM:** Prisma ORM with SQLite (out-of-the-box zero setup) / PostgreSQL compatible.
- **Media & Recording:** WebRTC `MediaRecorder` API, Web Audio API analyser, HTML5 Video.
- **Animations & Effects:** `canvas-confetti`, custom Tailwind marquee keyframes.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Sample Data
```bash
npx prisma db push
npm run prisma:seed
```
*Seeds realistic sample workspaces, spaces (e.g. SupaFlow), video & text reviews, NPS responses, and case studies.*

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧭 Key Routes & Pages

| Route | Description |
|---|---|
| `/` | Landing page showcasing features, live demo, and Wall of Love |
| `/dashboard` | Main management dashboard (Inbox, Wall builder, NPS, Case Studies, Settings) |
| `/submit/supaflow` | Public customer review submission landing page |
| `/embed/supaflow/wall` | Standalone Wall of Love masonry embed |
| `/embed/supaflow/carousel` | Standalone animated scrolling marquee embed |
| `/embed/supaflow/badge` | Standalone social proof badge embed |
| `/embed.js` | Universal CDN loader script |

---

## 📡 REST API Reference (SRS 4.1)

- `GET /api/v1/spaces` — List all spaces
- `POST /api/v1/spaces` — Create space
- `GET /api/v1/spaces/:slug` — Space config & public data
- `PATCH /api/v1/spaces/:slug` — Update space settings
- `POST /api/v1/testimonials/submit` — Submit review (video or text)
- `PATCH /api/v1/testimonials/:id` — Toggle featured, update review
- `DELETE /api/v1/testimonials/:id` — Delete review
- `POST /api/v1/nps/submit` — Record NPS survey score
- `POST /api/v1/ai/transcribe` — Speech-to-text transcription
- `POST /api/v1/ai/case-study` — Generate AI Case Study
- `GET /api/v1/embed/:slug` — Lightweight embed payload with CORS (`Access-Control-Allow-Origin: *`)

