# Cinematic Hero Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace multi-card motion with five high-quality animated one-drink scenes and ensure previews and MP4/GIF/still exports use one timeline and owner layer settings.

**Architecture:** Reuse authenticated Supabase product data. A versioned scene registry supplies environmental HTML/CSS/SVG layers with one hero product image. A shared deterministic draw(time) outputs live stage frames and encoded canvas frames; Moveable editor stores layer transforms.

**Tech Stack:** Vanilla JS/CSS/Canvas, MIT Anime.js or browser requestAnimationFrame, existing MIT gifenc, MediaRecorder for supported codecs, owner Supabase photos.

**Spec:** `specs/0004-cinematic-product-scenes.md`

## Global Constraints
One drink, no galleries, no paid AI, exact same visual scene in preview and export, fallback for unsupported codec/photo, protect original photographs and tenant data.

## Review Focus
- Preview and download must show the same product/price, scene palette and custom layer positions.
- A selected product with its photo must not be filtered by the legacy Screen 2 category.
- Saffron and Matcha visibly differ; not one gradient with renamed text.
- Still export uses actual completed scene, animated export contains multiple visually distinct frames.
- If an image has opaque white background, explain limitations rather than blindly removing foam.

### Task 1: Scene data and effects
**Files:** Create `studio/cinematic-scenes.js`, `studio/cinematic-scenes.css`, tests `tests/cinematic-scenes.test.js`.
**Interfaces:** `window.SeiyunCinematicScenes`: `registry`, `resolveProductScene(product,brand,selection)`, `renderScene(...)`, `drawFrame(ctx,state,time)`.
- [ ] Write RED tests on five scene IDs and unique Saffron/Matcha ingredient/background selection, one owner photo only.
- [ ] Implement deterministic layered frame model with fixed predictable phases.
- [ ] Run GREEN and commit.

### Task 2: Live preview + single export renderer
**Files:** Modify `studio/creative-showcase.js`, `studio/creative-studio.js/css`, `studio/index.html` plus browser tests.
- [ ] Write failing browser test: one hero image, scenes correctly selectable, time-varying scene layers and identical export composition.
- [ ] Replace Motion Lab gallery choice with five cinematic presets and environment motion; brand/price still drawn from owner data.
- [ ] Use single frame renderer for live/offscreen PNG, GIF, and native MP4/WebM; honor duration and position overrides.
- [ ] Run browser visual output and encoder tests; commit.

### Task 3: Editing and quality gate
**Files:** `studio/creative-layout-editor.js`, `studio/creative-studio.js/css`, `studio/README.md`, `agent.md`.
- [ ] Test drag/reposition/resize of drink and headline; output screenshot/GIF reflects saved transforms.
- [ ] Inspect representative frames with Seiyun Saffron and Matcha and 390px Safari-like viewport.
- [ ] Verify no stock assets or false pouring realism; document actual limitations.
- [ ] Run both subproject suites; PR/CI, merge only if all green and release can be verified.
