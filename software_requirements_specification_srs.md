# Software Requirements Specification (SRS)
**Project Name:** Customer Social Proof & Feedback Platform  
**Document Version:** 1.0  
**Standard Adherence:** IEEE 830 / ISO/IEC/IEEE 29148  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the technical requirements for the development of a Testimonial Collection, Analytics, and Embedding System. It provides architectural blueprints, data schema specifications, API endpoint definitions, and system quality attributes.

### 1.2 Scope
The scope includes the web application front-end (Next.js App Router), backend microservices/APIs, media processing pipelines (transcoding, transcription), CDN distribution networks for embedded script delivery, and database architectures.

---

## 2. System Architecture & Tech Stack

```
   [ Client Browser ]
           │
  (JS Embed / Next.js)
           │
           ▼
 [ Edge CDN / Vercel ]
           │
   ┌───────┴────────────────────────┐
   ▼                                ▼
[ API Gateway ]            [ Media Processing Pipeline ]
(Next.js Serverless)       (AWS S3 + Mux / Whisper AI)
   │                                │
   ├────────────────────────────────┘
   ▼
[ PostgreSQL / Prisma ]
```

* **Frontend Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion (`motion/react`).
* **Backend Runtime:** Node.js / Serverless Edge Functions.
* **Database & ORM:** PostgreSQL with Prisma ORM.
* **Media & Video Processing:** Mux / AWS S3 + Transcoding Workers.
* **AI Integration:** OpenAI Whisper API / Custom Speech-to-Text engine.
* **Caching & CDN:** Redis (session/rate-limiting) + Cloudflare CDN (widget delivery).

---

## 3. Detailed Technical Requirements

### 3.1 Data Schema Design (Prisma / SQL)

```prisma
model User {
  id            String      @id @default(uuid())
  email         String      @unique
  name          String?
  workspaces    Workspace[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Workspace {
  id            String      @id @default(uuid())
  name          String
  slug          String      @unique
  ownerId       String
  owner         User        @relation(fields: [ownerId], references: [id])
  spaces        Space[]
  createdAt     DateTime    @default(now())
}

model Space {
  id            String        @id @default(uuid())
  name          String
  slug          String        @unique
  workspaceId   String
  workspace     Workspace     @relation(fields: [workspaceId], references: [id])
  customHeader  String?
  testimonials  Testimonial[]
  createdAt     DateTime      @default(now())
}

model Testimonial {
  id            String      @id @default(uuid())
  spaceId       String
  space         Space       @relation(fields: [spaceId], references: [id])
  type          Type        // VIDEO or TEXT
  rating        Int         @default(5)
  content       String      @db.Text
  videoUrl      String?
  transcript    String?     @db.Text
  authorName    String
  authorEmail   String
  authorAvatar  String?
  isFeatured    Boolean     @default(false)
  createdAt     DateTime    @default(now())
}

enum Type {
  VIDEO
  TEXT
}
```

---

## 4. Interface Specifications

### 4.1 Rest API Endpoints

#### 4.1.1 Capture Space API
* `POST /api/v1/spaces`
  * **Payload:** `{ "name": "SaaS Product Reviews", "workspaceId": "ws_123" }`
  * **Response:** `201 Created` with Space entity payload.
* `GET /api/v1/spaces/:slug`
  * **Response:** Public configuration for testimonial submission page.

#### 4.1.2 Testimonial Submission API
* `POST /api/v1/testimonials/submit`
  * **Payload:**
    ```json
    {
      "spaceId": "spc_abc123",
      "type": "VIDEO",
      "authorName": "Jane Doe",
      "authorEmail": "jane@example.com",
      "videoBlobUrl": "https://upload.s3.amazonaws.com/temp_vid_123.mp4"
    }
    ```
  * **Response:** `202 Accepted` (triggers async processing job).

---

## 5. Security & Performance Requirements

### 5.1 Media Transcoding & CDN Delivery
* **Video Encoding:** Standardize raw user recordings into HLS ($.m3u8$) format using H.264/AAC codecs to guarantee cross-device compatibility.
* **Embedding Performance:** The JavaScript embed bundle must be minified, compressed via Brotli, and served via edge caching ($Cache-Control: public, max-age=31536000, immutable$).

### 5.2 Security Standards
* **Rate Limiting:** IP-based rate limiting on submission endpoints ($10\text{ requests per minute}$) using Redis token bucket algorithms to prevent spam attacks.
* **CORS Policies:** Embed endpoints allow universal cross-origin requests (`Access-Control-Allow-Origin: *`), while administrative APIs restrict origins to authenticated domain sessions.