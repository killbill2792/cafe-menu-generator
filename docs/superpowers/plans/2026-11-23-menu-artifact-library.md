# Menu Artifact Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) for tracking.

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
- [ ] Write failing registry count, unique ID, escaped data, paginate tests; run RED.
- [ ] Build 8 compositions × 3 treatments and page renderer using existing menu data.
- [ ] Run tests GREEN and commit.

### Task 2: Owner gallery and photo prominence
Files: modify `studio/app.js`, `studio/index.html`; create `studio/menu-gallery.css`.
Interfaces: `renderMenuGallery()`, `saveSoon()`, existing `draft.menuArtwork` field.
- [ ] Write failing UI-level tests for 24 selectable designs and photo-size bounds; run RED.
- [ ] Integrate navigation, previews, preview page changes, and per-item overrides.
- [ ] Run tests GREEN, check responsive CSS, commit.

### Task 3: Exports and attribution
Files: `studio/menu-gallery.js`, `studio/index.html`, `studio/MENU_GALLERY_SOURCES.md`, tests.
- [ ] Write failing tests for multipage print structure, download action/error state.
- [ ] Implement print browser save-as-PDF and PNG/JPG (ZIP for multipage).
- [ ] Verify output page sizes, photo fidelity, exported count, library licenses and no stock photos.
- [ ] Commit.

### Task 4: Merge and release verification
Files: `agent.md`, `studio/README.md`, specs.
- [ ] Run full available syntax, tests and browser checks at portrait/print/mobile.
- [ ] Review diff and correct critical issues; document evidence.
- [ ] Merge feature branch to main only if green, and verify main head.
- [ ] Verify deployed Cloudflare if accessible; record any blockers/real-auth limitations.
