# 0005 — Full native design and motion editor integration

**Status:** Accepted direction by explicit owner order on Nov 26, 2026; implement on isolated branch. Supersedes incomplete Moveable/HTML editor decision in 0003/0004. 
**Problem:** Owners cannot reliably move/delete/restore menu elements; template gallery was built by importing only JSON documents and overlays, not the source editor. Product Showcase uses only five custom-looking motions and can treat a browser screenshot as a drink photo. The owner explicitly requires *complete existing editors* not more reimplemented controls, desktop and iPhone, owner-data prefill, broad real preview and independent downloaded files.

## Goal / non-goals
- Embed **the upstream full OpenTempl editor** (MIT, pinned to `015064f1005e63563f73ebe0dfbeb84d90439bcc`) and **the upstream full Motion Studio Open** (Apache-2.0, pinned to `dba311caff2e78c621c17f008eb1bc3f71f361b5`). Preserve native layers/undo/redo/object transforms, timelines/presets, and export facilities.
- Existing Seiyun Supabase Auth and user-owned catalog remain canonical. No new login, database, paid render API, third-party telemetry or per-export AI token charge.
- Launch in the same authenticated owner Studio with selected brand/menu/product data, full source editor in a contained viewport, coherent native saving/exposure. Native print/PNG/video outputs follow the editor.
- Import and display *source-native* templates, not misleading new counts of color palettes; full motion library has 224 generic presets, not 224 finished café ads. Owners see their selected approved product photo, not arbitrary screenshot thumbnails, before opening Product Showcase.
- No new native editor implementation, reimplementation of undo/redo/resize, speculative liquid simulation, arbitrary remote executable template code, or destructive change to existing public TV/published routes.
- Do not call release complete until live editor plus actual customer asset and output acceptance is demonstrated on desktop and iPhone.

## Design
```mermaid
flowchart TD
 A[Authenticated Seiyun owner, canonical Supabase draft] --> B[Studio native launcher + explicit photo chooser]
 B -->|exact-origin postMessage, nonce| C[Vendored full OpenTempl editor static build]
 B -->|exact-origin postMessage, nonce| D[Vendored full Motion Studio Open static build]
 C --> E[Native design objects and template gallery]
 D --> F[Native 224-preset library and video timeline]
 E --> G[Native PNG/PDF exports + autosaved design snapshots]
 F --> H[Native MP4/WebM/GIF exports + autosaved scene]
 G --> A
 H --> A
 ```
- Upstream apps are **built in GitHub Actions from pinned revisions**. Reuse their complete source, not copied elements or a distant uncontrolled iframe. Bundle built files into `studio/native/menu` and `studio/native/motion` (Cloudflare static assets). Build revision and bundled MIT/Apache/NOTICE metadata committed to auditable code. Do not claim usable until the asset build actually succeeds.
- Parent uses existing global `draft` and `saveSoon`; inserts a native studio iframe within authenticated owner shell after loading; sends limited scoped catalog/brand data with nonce, validates iframe source + `origin` before receiving revisions; artwork changes live in a versioned `draft.nativeArtworks` object, never overwrite product prices by guessing which design text field was edited.
- OpenTempl fork patch uses native `DesignSnapshot`, `createDesign`, `DesignDoc` and `EditorScreen`, producing multi-page prefilled editable designs. Its `IndexeddbPersistence` also provides native undo/history. Do not keep accidental sample stock images. The bridge may convert external uploaded photos only via user-controlled, CORS-safe fetch and native `prepareImage`.
- Motion Studio fork patch uses native `useSceneStore.addAssets`, template/track actions and project state rather than drawing our own animations. Explicitly selected product photo and name/price populate native workspace; all 224 generic presets remain browseable. Source motion assets licensed separately. Real liquid pouring requires licensed footage or generated frames; not a feature of arbitrary motion preset.
- Rollout is **opt-in editor switch until proof**: keep old published and draft paths untouched, native editors behind new launcher. Do NOT merge broken static assets, do NOT auto-publish.

## Threat model (STRIDE)
- **S:** no child access to service_role; only parent authenticated Supabase session; origin+source+nonce verification prevents unrelated window message spoofing. Browser origin alone is not user auth.
- **T:** validate JSON limits, product IDs, text, media MIME and source URLs; never accept child messages that mutate canonical products or ownership. Snapshot returned is a separate design draft.
- **R:** revision timestamps + native editor save status; preserve old drafts and ability to roll back; no silently overwritten owner artifact.
- **I:** minimize per-owner data crossing editor bridge; avoid upstream telemetry and third-party photo URLs; never send whole supabase session/JWT or secrets to an iframe.
- **D:** cap number of pages, image bytes, message payload size and rendering resolution; provide failure UI; don't freeze low-memory mobile Safari when loading a huge motion engine.
- **E:** serve only pinned audited native builds with versioned third-party licenses; keep static editor under same own domain; Supabase RLS unchanged.

## Alternatives
1. Continue adding Moveable/GridStack patches over HTML layouts: rejected after repeated production failures; no consistent object-history/export engine.
2. Adopt full Canvix editor for both: technically rich/mobile-oriented MIT alternative but imports Next/Prisma/custom auth; duplicate data/backend risks. Keep as tested fallback if native OpenTempl cannot satisfy editor UI.
3. Use Motion/GSAP/Remotion components only: rejected as user-facing primary; they are libraries/effects rather than full authoring experience; Remotion terms need scrutiny.

## Verification gates
- Both pinned upstream apps build inside CI with no paid credentials or server routes; accessible under correct static base path; no unsandboxed extra auth.
- Native OpenTempl: all owner products appear in multi-page design; select/drag/resize, delete, undo, reset, save and reopen, exported page matches live artboard. Test real desktop and iPhone Safari.
- Native motion: one correctly chosen real product image, diverse **native** presets/timeline, no webpage screenshot auto-picked, encode playable file; test Safari fallback.
- No stock template photography bundled in exported owner media; origin/license attribution preserved. Cloudflare production and authenticated Supabase Storage CORS tested after branch merge.
- Stop deployment on failing build, missing native app files or inability to populate/synchronize owner artifacts.

**Missing skill references:** `assets/spec-template.md`, `assets/threat-model.md` and `builder-check-prompt.md` were not provided with the uploaded methodologies. This document incorporates the required problem/goals/design/STRIDE/release/checklist instead.
