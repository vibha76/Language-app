# LinguaVerse architecture

## Information architecture

Learner: Home → Learn → Lesson → Practice → Review → Test → Exam → Certificate.
Supporting surfaces: Conversation, Vocabulary, Grammar, Stories, Progress, Polyglot, Profile, Notifications.
Institutional surfaces: Teacher → Classroom → Assignments → Analytics; Parent → child-safe progress summary; Admin → Content → Review → Publish → Analytics.

## Content model

All educational content is data, not UI logic. `Language → Course → Unit → Lesson → Exercise → Question` is the core hierarchy. Scripts, vocabulary, grammar concepts, characters, videos and content versions are independently addressable. A language is configured with a script and progression framework (`CEFR`, `classical`, or an internal descriptor set), so UI components never branch on language names.

Recommended content lifecycle: **Draft → Review → Approved → Published → Archived**. AI can draft content, but publishing requires a human review gate for educational accuracy.

## Mastery engine

Maintain per-vocabulary and per-skill evidence. A useful initial composite is recognition 20%, recall 20%, listening 15%, speaking 20%, writing 15%, contextual usage 10%. Apply recency decay and spaced-review scheduling. A single correct MCQ never marks mastery.

## AI architecture

Frontend/API calls use stable service contracts. Adapters implement speech-to-text, TTS, pronunciation scoring, writing evaluation, conversation, adaptive planning and content generation. Providers are selected server-side from configuration. Never ship credentials to the browser. Store only the minimum AI interaction telemetry needed for quality, safety, billing and debugging, with retention controls.

## Scale plan

PostgreSQL is the source of truth. Index all user/time and language/content access paths; paginate learner feeds and admin tables. For millions of events, partition high-volume event/attempt tables by time and/or tenant, and stream analytics events into a warehouse rather than running heavy aggregates on the transactional database. Object storage + CDN serves media. Cache published content by immutable content-version IDs. Use queues for media processing, AI generation, certificate rendering and analytics ingestion.

## Security and child safety

Use secure HTTP-only sessions, CSRF protection where applicable, server-side authorization, schema validation, rate limits and signed object URLs. Keep child mode separate from adult social/competitive surfaces. Parent dashboards should expose learning outcomes and time, not private AI conversation transcripts by default. Add audit logs for admin publishing and role changes.

## Route map

`/` landing/home · `/onboarding` · `/languages` · `/learn/[language]/map` · `/learn/[language]/lesson/[slug]` · `/practice/speaking` · `/practice/writing` · `/practice/listening` · `/conversation` · `/stories/[id]` · `/review` · `/tests/[id]` · `/exam/[id]` · `/exam/[id]/results` · `/certificates/[id]` · `/verify/[certificateId]` · `/progress` · `/analytics` · `/profile` · `/achievements` · `/polyglot` · `/teacher` · `/classroom/[id]` · `/parent` · `/admin` · `/settings`.

## Certification

A certificate is issued only after a versioned exam submission is finalized, scoring rules are applied server-side, and the passing threshold is met. Generate a globally unique certificate ID plus a cryptographically random verification token. Public verification returns only certificate metadata intended for verification.
