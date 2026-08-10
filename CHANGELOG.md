# Changelog

## [0.8.1](https://github.com/asqit/praceprojuniora/compare/v0.8.0...v0.8.1) (2026-08-10)

### Bug Fixes

* add package "enrichment" to docker image ([a1ac0fb](https://github.com/asqit/praceprojuniora/commit/a1ac0fba1128bf731459931b81c019d50e4e8f7c))

### Chores

* update CHANGELOG.md ([058db39](https://github.com/asqit/praceprojuniora/commit/058db3981d8cf829df1a2b7af44db8b01e27f143))

## [0.8.0](https://github.com/asqit/praceprojuniora/compare/v0.7.2...v0.8.0) (2026-08-10)

### Features

- **enrichment:** rule-based enrichment pipeline (`@ppj/enrichment` package) — detects seniority, work type, tech tags, experience years, and junior relevance from job title and description
- **enrichment:** Czech language signals — `vývojář`, `programátor`, `začátečník`, `absolvent*` added to IT and junior signal sets
- **enrichment:** `enrichPending` task wired up — runs on daily cron and writes `relevanceScore`, `workType`, `tags` back to DB
- **community:** upvote/downvote system — `POST /api/v1/listing/vote/:id` endpoint; votes stored in DB and persisted per-user via localStorage
- **community:** votes progressively adjust `relevanceScore` — each additional vote carries slightly more weight than the previous
- **community:** `pruneIrrelevant` weekly cron — hard-deletes listings older than 14 days with `relevanceScore < 35`; respects `manuallyAdded` guard
- **ui:** listing card redesign — company avatar, icon meta row (location, work type, posted date), description snippet, pill-style tech tags, pill CTA button
- **ui:** `⚡ Doporučujeme` badge on listings with score ≥ 80; `Komunita rozhodla` badge on listings approaching deletion (score < 40)
- **ui:** community score info box above the listings grid

### Bug Fixes

- **enrichment:** `\babsolvent\b` pattern replaced with `\babsolvent` to correctly match `absolventský` and derived forms
- **enrichment:** `normalizeJuniorScore` formula simplified (`score + 50`) and wrapped with `Math.round` — fixes `57.999...` float leak
- **enrichment:** `programátor` moved from `WEAK_IT` (score 2) to `STRONG_IT` (score 5) so Czech programmer titles correctly flip `isDevRole`
- **db:** migration history (`__drizzle_migrations`) bootstrapped manually after previous migrations were applied outside drizzle-kit
- **api:** unreachable `process.exit(1)` after `throw` removed from enrich script

### Breaking Changes

- `isDevRole` removed from `Enrichment` type and no longer written to DB — use `relevanceScore >= 40` as filter instead

## [0.7.2](https://github.com/asqit/praceprojuniora/compare/v0.7.1...v0.7.2) (2026-07-15)

### Bug Fixes

- skip firefox and use chromium for puppeteer ([8dfd0c0](https://github.com/asqit/praceprojuniora/commit/8dfd0c022e589354864ae97d0f8b4a3ad7651e06))
- trying to apply fix for PDF ([5c34b72](https://github.com/asqit/praceprojuniora/commit/5c34b7277e119b9f6b34970fba70797d8b881735))

## [0.7.1](https://github.com/asqit/praceprojuniora/compare/v0.7.0...v0.7.1) (2026-07-08)

### Bug Fixes

- fix missing internal package copy in docker ([fd0670a](https://github.com/asqit/praceprojuniora/commit/fd0670a77a968d961c70dc3bf0ae6dcf6e2dc7ca))

## [0.7.0](https://github.com/asqit/praceprojuniora/compare/v0.6.1...v0.7.0) (2026-07-08)

### Features

- **client:** base UI for cv-builder. really rough needs lot of more work ([44e4f61](https://github.com/asqit/praceprojuniora/commit/44e4f612a44155cc3fae27d75d1c0a1239b17f0b))
- **cv:** add session-based builder flow, template export fixes, and desktop only gate ([2c2a74d](https://github.com/asqit/praceprojuniora/commit/2c2a74d4fcbbb31f9baf83737bf125d24f34a55a))
- **cv:** updated UI/UX, added new template, added export to markdown ([f967004](https://github.com/asqit/praceprojuniora/commit/f967004e26cc2fdd9534360db5b7441b4fea6e31))
- **pdf:** adding groundwork for pdf generation via puppeteer ([d4d2f6c](https://github.com/asqit/praceprojuniora/commit/d4d2f6c5232293850fac2af6d99b23d31021c5bc))

### Chores

- refactoring ([441b20b](https://github.com/asqit/praceprojuniora/commit/441b20bc5e1a34a71f520c381b4bcfe9530c7b19))

## [0.6.1](https://github.com/asqit/praceprojuniora/compare/v0.6.0...v0.6.1) (2026-06-29)

### Bug Fixes

- fix build-step by adding env check ([ceb361c](https://github.com/asqit/praceprojuniora/commit/ceb361c94c3315ed373d2a3f2ed61dcaf5705ce0))

## [0.6.0](https://github.com/asqit/praceprojuniora/compare/v0.5.2...v0.6.0) (2026-06-29)

### Features

- add more analytics ([7c67069](https://github.com/asqit/praceprojuniora/commit/7c670692520f0e74abee34f68b2a958d7955de5e))

## [0.5.2](https://github.com/asqit/praceprojuniora/compare/v0.5.1...v0.5.2) (2026-05-25)

### Bug Fixes

- harder scoring ([05d639d](https://github.com/asqit/praceprojuniora/commit/05d639d0b26609579a4e9faff9de78755e28afe9))

## [0.5.1](https://github.com/asqit/praceprojuniora/compare/v0.5.0...v0.5.1) (2026-05-25)

### Bug Fixes

- move type into shared pacakge for both client and server ([fd435fe](https://github.com/asqit/praceprojuniora/commit/fd435fea161293370103112ab7edb401429e9de6))

## [0.5.0](https://github.com/asqit/praceprojuniora/compare/v0.4.1...v0.5.0) (2026-05-25)

### Features

- add users & security tokens ([a473065](https://github.com/asqit/praceprojuniora/commit/a473065ffaed6acdf312f0492c6873abaaa01129))

## [0.4.1](https://github.com/asqit/praceprojuniora/compare/v0.4.0...v0.4.1) (2026-05-24)

### Bug Fixes

- revert to build-time email & added docker arg ([14cb726](https://github.com/asqit/praceprojuniora/commit/14cb72690ebdee19738d724a0be4d05be00110ea))

## [0.4.0](https://github.com/asqit/praceprojuniora/compare/v0.3.0...v0.4.0) (2026-05-24)

### Features

- tweak scraper, add new data-source ([3e52b9b](https://github.com/asqit/praceprojuniora/commit/3e52b9b89208462b0d5eb47844a07e074406b567))

## [0.3.0](https://github.com/asqit/praceprojuniora/compare/v0.2.0...v0.3.0) (2026-05-23)

### Features

- add hero redesign & gamification ([a3e9f83](https://github.com/asqit/praceprojuniora/commit/a3e9f83579c4bfbf2409d471d01487dcad150396))

## [0.2.0](https://github.com/asqit/praceprojuniora/compare/v0.1.4...v0.2.0) (2026-05-09)

### Features

- frontend improvements ([d21f547](https://github.com/asqit/praceprojuniora/commit/d21f5471fba9d8a4ea5ac138ac65a0caf328e5c1))

### Bug Fixes

- add unique constraint for jobs.title ([#15](https://github.com/asqit/praceprojuniora/issues/15)) ([e0db6a7](https://github.com/asqit/praceprojuniora/commit/e0db6a7914125985f9f690e0089c64cf44c9327f))
- fix on-conflict clause ([#13](https://github.com/asqit/praceprojuniora/issues/13)) ([6cab3bd](https://github.com/asqit/praceprojuniora/commit/6cab3bd641eb8d36a6e4f9b4300d53abae59589f))

## [0.1.4](https://github.com/asqit/praceprojuniora/compare/v0.1.3...v0.1.4) (2026-04-25)

## [0.1.3](https://github.com/asqit/praceprojuniora/compare/v0.1.2...v0.1.3) (2026-04-24)

## [0.1.2](https://github.com/asqit/praceprojuniora/compare/v0.1.1...v0.1.2) (2026-04-24)

### Bug Fixes

- fix on-conflict clause ([#13](https://github.com/asqit/praceprojuniora/issues/13)) ([#14](https://github.com/asqit/praceprojuniora/issues/14)) ([6282fe4](https://github.com/asqit/praceprojuniora/commit/6282fe489201b9e6c28cbc7fbcabdc9deb099fbe))

## 0.1.1 (2026-04-20)

### Bug Fixes

- bad sqlite ([cb32622](https://github.com/asqit/praceprojuniora/commit/cb326227905215613f374970fdfb10e3f9925ef3))
- deployment fixes, url normalization and api correctness improvements ([fc47701](https://github.com/asqit/praceprojuniora/commit/fc47701c6e4e6ed345f189d5ff874051a19e1a4b))
- invalid migrations directory ([d37077f](https://github.com/asqit/praceprojuniora/commit/d37077fbd7357ea12d48b9bcd31e9dee2de11c19))
- migration ([8a8df57](https://github.com/asqit/praceprojuniora/commit/8a8df577f49f8345e6f807d92d9f7b634b34aa98))

### Chores

- add release script ([fdd151e](https://github.com/asqit/praceprojuniora/commit/fdd151eda761dd2a3b014288b4aeffad23743a9e))
- setting starter version after rewrite ([71df7cc](https://github.com/asqit/praceprojuniora/commit/71df7ccf00aca75376a02a557f43cf5a11099e1d))
