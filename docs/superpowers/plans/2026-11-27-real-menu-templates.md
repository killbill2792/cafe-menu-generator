# Actual Menu Documents and WYSIWYG Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand beyond 24 abstract menu variants with genuine MIT OpenTempl source documents, show faithful live thumbnails, and let owners directly drag/resize elements and reclaim whitespace.

**Architecture:** Vend curated upstream element JSON to a structured adapter, build OpenTempl pages using actual x/y/font/shape coordinates, bind owner-specific product records, and share the resulting HTML with gallery and image/PDF exports. Overlay Moveable for editing; preserve normalized layout overrides in the owner draft.

**Tech Stack:** Vanilla JS and CSS, Supabase, Node assert tests, Chromium browser/CI, MIT OpenTempl native JSON, MIT Moveable and existing html2canvas/JSZip.

**Spec:** `specs/0003-real-template-library-wysiwyg.md`

## Global Constraints
No demo photos, no new database or paid API, no arbitrary remote scripts, keep 24 existing choices and public routes, keep owner data private, no per-owner AI calls.

## Review Focus
- A 26-product source template must output 26 unique product IDs, not source dummy items or duplicated products.
- Text-only/no-photo products remain legible; empty image regions do not make empty 1000px cards.
- Custom drag/resize on a scaled mobile artboard converts pointer coordinates to native page coordinates.
- Preview thumbnails must be the *same actual first page* as export, no fake style cards.
- Product name editing updates owner data; its position and size edits update design-only settings.

### Task 1: Actual upstream template pack
**Files:** Create `studio/vendor/opentempl/curated-menu.js`, `studio/vendor/opentempl/SOURCE.md`, `studio/open-template-adapter.js`; test `tests/open-template-adapter.test.js`.
**Interfaces:** `window.SeiyunOpenMenuPack`, `window.SeiyunOpenMenuAdapter.render(state,templateId,format,overrides)` → `{pages,productCount,pageCount}`.
- [ ] Write tests verifying real source IDs, source document geometry + no stock images.
- [ ] Run tests and observe missing module failures.
- [ ] Vend MIT source JSON templates selected by concrete menu/food names from source registry and license notice.
- [ ] Implement deterministic data binding, overflow pages, HTML escape and safe photos.
- [ ] Run tests and commit.

### Task 2: One shared renderer and real gallery previews
**Files:** Modify `studio/menu-gallery.js`, `studio/creative-studio.js/css`, `studio/index.html`; test `tests/menu-gallery.test.js` and browser test.
**Interfaces:** `registry` includes imported source items with distinct `source`, `renderPages()` supports imports; `renderFirstPageThumbnail(state,t)` uses `renderPages(...).pages[0]`.
- [ ] Write failing gallery test: actual imported choices, 24 legacy retained, thumbnail content equal to rendered first page, all data safe.
- [ ] Run RED.
- [ ] Wire imported source registry and native rendered first-page preview card rather than swatches; search/filter; scale page to frame.
- [ ] Rework capacity and grid row sizing to reclaim whitespace without losing products.
- [ ] Run CI, inspect screenshots, commit.

### Task 3: True direct manipulation
**Files:** Create `studio/creative-layout-editor.js`, modify `studio/creative-studio.js/css`, `studio/menu-gallery.js`, `studio/index.html`; test `tests/creative-layout.test.js` plus browser.
**Interfaces:** `window.SeiyunLayoutEditor.attach(pageEl,{onCommit})`; `draft.menuArtwork.layoutOverrides[templateId][elementKey]`.
- [ ] Test normalized drag/size/scale mutations and persistence, price vs layout separation, exported HTML contains final geometry.
- [ ] Run RED.
- [ ] Load pinned MIT Moveable, attach handles to selected text/photo/card in actual scaled page; normalize position to page coords, support touch.
- [ ] Compact card flow using source renderer; reflow without empty cards; include all products in PDF/PNG.
- [ ] Browser test touch and scaled editor, commit.

### Task 4: Review and integration
**Files:** `agent.md`, `studio/README.md`, `specs/README.md`.
- [ ] Re-run Node tests and real browser screenshots/print checks.
- [ ] Review licenses and script failure fallbacks, new source pack provenance.
- [ ] Record progress and unresolved Cloudflare/owner-auth checks.

### Task 5: Import exact Canvix café menu originals
**Files:** Create `studio/vendor/canvix/curated-menu.js`, `studio/vendor/canvix/LICENSE`, `studio/vendor/canvix/SOURCE.md`; modify `studio/menu-gallery.js`, `studio/index.html`, `studio/open-template-adapter.js`; test `tests/canvix-menu-adapter.test.js`.
**Interfaces:** `window.SeiyunCanvixMenuPack`, source registry items `canvix:artisan-menu`, `canvix:cafe-menu` use same source-page adapter and owner catalog as OpenTempl.
- [ ] Add failing tests for exact MIT source IDs/geometry, two designs and their provenance.
- [ ] Observe RED in CI.
- [ ] Convert reviewed native Canvix text/shape/line/sticker geometry into the app's normalized source format; preserve source coordinate/font/color and page backgrounds (not demo stock art).
- [ ] Bind exactly 26 owner products (never Canvix demo brand/food), with actual non-overlapping pages and export/print parity.
- [ ] Run tests and review browser screens, commit.

### Task 6: Visual quality gates and release eligibility
**Files:** `tests/creative-ui.browser.js`, `studio/creative-studio.js/css`, `studio/open-template-adapter.js/css`, `agent.md`.
- [ ] Test real-photo previews and all output sizes; no text spills, blank only pages, or duplicate products.
- [ ] Verify real play/encoded GIF/MP4 visual distinctness for Saffron vs Matcha, not just file bytes.
- [ ] Record exact verified and blocked items; keep feature branch open if signed-in Cloudflare/Supabase test unavailable.
