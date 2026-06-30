# TODO

## CV Builder

- [ ] Create CV data model
- [ ] Design markdown schema for CV content
- [ ] Implement markdown → HTML rendering
- [ ] Integrate Puppeteer for HTML → PDF export
- [ ] Support multiple CV themes/styles via CSS
- [ ] Create theme switching mechanism
- [ ] Build drag & drop CV editor UI
- [ ] Add inline editing for sections
- [ ] Add content hints/suggestions in editor
- [ ] Implement autosave (requires accounts)
- [ ] Add export (PDF / Markdown)
- [ ] Add import from existing markdown

---

## CV Analyzer (Paid)

- [ ] Define monetization model (one-time vs subscription)
- [ ] Design analysis pipeline
- [ ] Create CV upload flow
- [ ] Extract text from PDF/DOCX
- [ ] Normalize CV structure
- [ ] Integrate LLM provider (Haiku / Sonnet)
- [ ] Create prompt templates for HR-oriented analysis
- [ ] Implement scoring categories
  - [ ] readability
  - [ ] ATS compatibility
  - [ ] impact / wording
  - [ ] structure
  - [ ] missing sections
- [ ] Generate actionable improvement suggestions
- [ ] Add analysis history
- [ ] Implement payment flow
- [ ] Add rate limits / usage limits

---

## Tinder-style Personalized Job Swapper (Paid)

- [ ] Design user profile model
- [ ] Support CV upload or CV selection from DB
- [ ] Parse and extract user skills
- [ ] Create job ingestion pipeline
- [ ] Normalize job listings
- [ ] Implement matching engine (CV ↔ jobs)
- [ ] Generate ranking using LLM
- [ ] Design swipe UI (like / skip)
- [ ] Save user preferences from swipes
- [ ] Improve recommendations over time
- [ ] Add apply / save actions
- [ ] Add recommendation explanation
- [ ] Add payment / subscription gating

---

## Cross-cutting

- [ ] Authentication
- [ ] User dashboard
- [ ] Analytics
- [ ] Feature flags
- [ ] Admin panel
- [ ] Usage tracking
- [ ] Billing
- [ ] Error monitoring
