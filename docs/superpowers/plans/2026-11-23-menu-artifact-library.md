# Menu Artifact Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [x]`) for tracking.

**Goal:** Add a 24-choice, export-first menu generator with safe product-photo sizing, multipage previews and download paths to the existing Seiyun owner Studio.

**Architecture:** Existing Supabase draft remains the only product source. Add a versioned gallery renderer to the owner page; use reviewed fixed renderer styles rather than executing untrusted GitHub template scripts. A template option is a combination of layout family and style; one rendering/export pipeline serves all 24 and multiple artifact sizes.

**Tech Stack:** vanilla JavaScript, CSS Grid/Flex, Supabase, browser print-to-PDF, pinned MIT html2canvas + JSZip for raster exports.

**Spec:** `specs/0001-menu-artifact-library.md`

## Global Constraints
- Screen 2 and existing published TV rendering code unchanged.
- Owner uploads and Supabase RLS unchanged; product photos only from that owner; no stock images.
- All 23 products visible over one or more pages, never truncated or silently omitted.
- Default `object-fit:contain` and adjustable photo *space*, not forced cropping.
- No arbitrary GitHub HTML/JS or CDN design assets executed by owner browsers.
- Library architecture not capped at 24; count launch choices honestly.

## Review Focus
- Long product names and missing images: render accurate price and placeholder, never data mismatch.
- Image sizing 25–70%: entire photo visible and caption still fits; page count adapts.
- More products than fit: each enabled item exactly once across print/download pages.
- PNG/JPG when CDN missing or storage image CORS fails: actionable failure, no success toast.
- Clicking a template or changing photo size cannot publish changes or affect Screen 2.

---
### Task 1: Registry and normalized renderer
Files: create `studio/menu-gallery.js`; test `tests/menu-gallery.test.js`.
Interfaces: `window.SeiyunMenuGallery.registry`, `renderPages(state,options)`.
- [x] Write failing registry count, unique ID, escaped data, paginate tests; run RED.
- [x] Build 8 compositions × 3 treatments and page renderer using existing menu data.
- [x] Run tests GREEN and commit.

### Task 2: Owner gallery and photo prominence
Files: modify `studio/app.js`, `studio/index.html`; create `studio/menu-gallery.css`.
Interfaces: `renderMenuGallery()`, `saveSoon()`, existing `draft.menuArtwork` field.
- [x] Write failing UI-level tests for 24 selectable designs and photo-size bounds; run RED.
- [x] Integrate navigation, previews, preview page changes, and per-item overrides.
- [x] Run tests GREEN, check responsive CSS, commit.

### Task 3: Exports and attribution
Files: `studio/menu-gallery.js`, `studio/index.html`, `studio/MENU_GALLERY_SOURCES.md`, tests.
- [x] Write failing tests for multipage print structure, download action/error state.
- [x] Implement print browser save-as-PDF and PNG/JPG (ZIP for multipage).
- [ ] Verify real CDN rasterization and authenticated Supabase photo export on deployed Cloudflare (pending production environment).
- [x] Commit.

### Task 4: Merge and release verification
Files: `agent.md`, `studio/README.md`, specs.
- [x] Run full available syntax, tests and browser checks at portrait/print/mobile.
- [x] Review diff and correct critical issues; document evidence.
- [x] Merge feature branch to main after GitHub Actions green; PR #3 squash merged as b48ee5faa5ffdcfb41de8f60b7133121f7574f8c and verified main files.
- [ ] Verify deployed Cloudflare if accessible; record any blockers/real-auth limitations.

## Verification ledger (2026-11-23)
- [x] Node unit tests 7/7 pass; 24 templates, 8 families, 5 size profiles, data escaping, photo controls.
- [x] 360 combinations (24 × 5 profiles × 3 photo-space levels) retain 23 menu products with no duplication.
- [x] Real headless Chromium desktop/mobile owner gallery interaction checks, 390px no horizontal overflow.
- [x] Photo fit with supplied Seiyun Coffee photo; other 22 missing photos labeled explicitly.
- [x] Real Chromium US Letter PDF render: 3 pages with 23 products, image visible after eager-load fix.
- [x] Real JSZip packaged three generated PNG files using **mocked html2canvas capture**; output image conversion and remote CDN CORS remain unverified.
- [ ] Verify live authenticated Supabase image export and Cloudflare deployment after merge.

## Post-merge verification
- [x] GitHub Actions pull-request job `Menu artwork tests` succeeded (run 45312636328 / job 138171862077) before squash merge.
- [x] Confirmed merged main source contains 24 choices, 8 layouts, both gallery assets, export action, photo protections and unchanged Screen 2 editor.
- [x] Re-evaluated exact `main` JavaScript and 360 output combinations using 31 products / 26 enabled; all 26 included once across pages.
- [x] Added CI trigger for push to main (commit `6d7fcb7cd48d4bdda32b120482205405d3e39907`); post-push CI result not accessible through available GitHub tool, so not claimed green.
- [ ] Live Cloudflare Workers build, actual authenticated owner workflow and CDN image rasterization could not be verified from this environment; Cloudflare DNS lookup failed.
