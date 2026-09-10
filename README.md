# LinguaVerse 🌍

A playful, content-driven AI language-learning universe designed to scale from a learner prototype into a real EdTech SaaS.

## Built

- Premium learner dashboard and responsive mobile navigation
- Language Explorer with regional/difficulty filters
- Content-driven journey map and level unlocking model
- Interactive micro-video lesson experience
- Kannada demo lesson with real vocabulary, dialogue and exercises
- Speaking, listening, writing and vocabulary practice studio
- Pronunciation/writing/conversation adapter interfaces
- Adaptive AI conversation interface
- Spaced-repetition vocabulary center
- Grammar Intelligence studio
- Practice test with scoring and result state
- Certification experience + public certificate verification
- Progress analytics with skill mastery and AI learning insight
- Learner profile and accessibility/privacy settings
- Teacher classroom surface
- Admin content-operations surface
- PostgreSQL/Prisma schema for multi-language learning at scale
- Human review workflow: Draft → Review → Approved → Published

## Architecture

```text
Next.js App Router
  ├── Learner UI
  ├── Teacher / Parent / Admin surfaces
  ├── Route handlers (/api)
  ├── Content layer (language → course → unit → lesson → exercise)
  ├── Learning engine (attempts → mastery → review → progression)
  └── AI service interfaces
        ├── Speech-to-text
        ├── Text-to-speech
        ├── Pronunciation scoring
        ├── Writing evaluation
        ├── Conversation
        └── Adaptive recommendations

PostgreSQL / Prisma
Object storage → video / audio / certificates
External AI providers → accessed only by server-side adapters
```

## Core data model

`User`, `Profile`, `Language`, `Script`, `Course`, `Unit`, `Lesson`, `Video`, `Character`, `Vocabulary`, `GrammarConcept`, `Exercise`, `Question`, `Attempt`, `LearningProgress`, `LearningSession`, `XPTransaction`, `Achievement`, `UserAchievement`, `Test`, `Exam`, `Certificate`, `Notification`, `AIInteraction`, `ContentVersion`.

The schema is language-agnostic: language-specific behavior belongs in content/configuration and service adapters, not UI components.

## AI integration

The repository deliberately does **not** pretend that an external speech or LLM provider is connected. `src/ai/contracts.ts` defines replaceable service contracts and safe mock adapters. `/api/ai/writing` and `/api/ai/conversation` demonstrate the server-side boundary.

To productionize, implement providers behind these interfaces and load credentials from server-only environment variables. Never expose provider keys to the browser.

## Routes

- `/` learner home
- `/languages` language explorer
- `/learn` journey map
- `/lesson/[id]` interactive lesson
- `/practice` practice studio
- `/conversation` AI conversation
- `/vocabulary` spaced repetition
- `/grammar` grammar intelligence
- `/tests` practice assessment
- `/progress` analytics
- `/certificates` certification
- `/verify/[id]` public verification
- `/profile` learner profile
- `/settings` settings/accessibility
- `/classroom` teacher classroom
- `/admin` admin CMS surface
- `/onboarding` personalized onboarding

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

For database work, set `DATABASE_URL` to PostgreSQL and run Prisma migrations/generation as appropriate for the deployment environment.

## Adding a language

1. Add a `Language` record with a stable BCP-47-style code.
2. Add or reuse a `Script` record.
3. Define its progression framework and skill descriptors.
4. Add courses/units/lessons through content records.
5. Add vocabulary, grammar, dialogue and assessment content.
6. Attach reviewed audio/video assets.
7. Configure speech/TTS/pronunciation provider support if available.

No learner UI rewrite should be necessary.

## Adding a course or lesson

Create content records, attach exercises and vocabulary, add media metadata, then progress the content through `ContentVersion` status: `DRAFT → REVIEW → APPROVED → PUBLISHED`.

## Certification

Formal examinations remain separate from gamification. An exam can contain weighted sections for reading, listening, vocabulary, grammar, writing and speaking. After passing, issue a unique certificate ID and verification token. `/verify/[id]` exposes only verification-safe data.

## Production roadmap

1. Wire authentication/session provider and Prisma persistence.
2. Implement transactional progress + XP + mastery updates.
3. Add object storage and signed media URLs.
4. Connect production STT/TTS/LLM/pronunciation/OCR providers through adapters.
5. Add real content CMS workflows and reviewer permissions.
6. Add parent/child consent and school tenancy boundaries.
7. Add automated unit/integration/e2e tests and CI.
8. Add observability, rate limiting, queues and caching for scale.
9. Add offline lesson caching/PWA capabilities.
10. Expand reviewed language/course content to 100+ languages.

## Current limitation

This repository contains a functional product foundation and interactive demo surfaces. External credentials are still required for production AI, authentication, storage, email/notifications, and a live PostgreSQL deployment. Mock adapters are explicitly marked in code and API responses.
