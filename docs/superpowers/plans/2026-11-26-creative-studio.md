# Two-feature Creative Studio implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace owner-facing five-tab Studio with two downloadable-artifact features using current Supabase catalog and existing MIT motion engine.

**Architecture:** Keep legacy auth/cloud/public screen infrastructure; add a new two-option owner shell and artboard. Menu reuses existing gallery and exports with direct edits. Showcase uses vendored Motion Lab (MIT) for six actual live modes plus browser-native export when supported.

**Tech Stack:** Vanilla JS + CSS, Supabase, GitHub Actions node tests, playwright/Chromium browser tests, Motion Lab MIT, existing menu-gallery.

**Spec:** `specs/0002-two-feature-creative-studio.md`

## Global constraints
- No new database, auth service or paid API; owner-facing tabs are exactly Menu Generator and Product Showcase.
- Do not alter published public/screen routes or owner-scoped data safeguards.
- No third-party sample photos; use only mapped owner photos.
- Default photo fit preserves full drink; zoom/pan is real image transform, no forced layout box resizing.
- Source license notices must remain for vendored motion code; exports report supported formats honestly.

## Review focus
1. Legacy `?screen=...` URLs keep their previous renderer; new route only affects owner Studio.
2. Selecting a menu item commits edits to the same product ID and can survive saves/reloads.
3. Uploading into Product Showcase updates animation with selected drink; no inherited category filter.
4. 1–100 products do not disappear or get matched to the wrong photos.
5. Native video export unsupported: show error or a supported WebM fallback, never mislabel as MP4.

### Task 1 — Replace owner navigation
Files: `studio/creative-studio.js`, `studio/creative-studio.css`, `studio/index.html`.
- [ ] Write failing browser/DOM test: owner UI has only two primary routes and still has hidden legacy uploader.
- [ ] Implement new shell/router and separate auth/public route handling.
- [ ] Verify desktop/mobile and existing screen URLs; commit.

### Task 2 — Menu artboard direct editing
Files: `studio/menu-gallery.js`, `studio/creative-studio.js`, CSS, tests.
- [ ] Write failing tests: click-to-edit brand/name/ingredients/price mapped to exact product, save on blur, photo image zoom independent from box; no script injection.
- [ ] Reuse gallery `renderPages`, brand customization and existing PDF/PNG/JPG actions.
- [ ] Browser-test 24 menu choices, 23 items, direct edits and downloading; commit.

### Task 3 — Genuine motion and export
Files: `studio/vendor/motion-lab/*`, `studio/creative-studio.js`, CSS, tests.
- [ ] Vend MIT upstream assets with exact license; write fail-first tests for six modes, product selection, saved photos and no filter.
- [ ] Integrate `MotionScene` modes into product showcase, responsive real-time preview; build native video/GIF export path for supported browsers.
- [ ] Test successive frames differ, selected image visible, export blob has correct container MIME; commit.

### Task 4 — Regression, review and handoff
Files: `agent.md`, `studio/README.md`, `specs/README.md`.
- [ ] Full test suite and browser/print check; confirm no disruption to existing Supabase Auth and current saved drafts.
- [ ] Create PR, inspect CI, merge only if checks green and scope respected.
- [ ] Check Cloudflare deployment separately; document unverified live-session/video codecs.
