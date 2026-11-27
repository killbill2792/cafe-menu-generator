# Two-feature Seiyun Creative Studio — design
**Status:** Accepted (owner explicitly requested complete owner-interface replacement, 2026-11-26)

## Problem
The current Studio exposes five tabs and a Screen 1 / Screen 2 mental model. Owners must select a product and edit via separate below-the-preview forms, cannot simply edit on the artwork, and see a nearly-static product showcase with a white photo rectangle. Owners already have signage/printing tools: the product must produce reusable menu and moving ad **artifacts**, not manage their TVs. Owner explicitly approved the modular open-source engine direction and authorized implementation.

## Goals
- Exactly **two primary destinations**: **Menu Generator** and **Product Showcase**. Hide legacy screen assignment / publication workflows from the new owner UI, but preserve underlying data and existing public/published routes for backward compatibility.
- Menu shows the selected pre-populated design **first**, with gallery choices collapsible and searchable. Owners directly edit title, tagline, product name, ingredients and price on the artwork. Optional brand settings (logo or text-only, font, palette) remain hidden until requested.
- 24 existing choices remain from the current gallery, extendable through vetted source adapters. Do not falsely call them 24 imported templates. Preserve existing PDF/PNG/JPG artwork exports and owner data with no re-entry.
- Actual photo zoom/pan modifies the photo inside the frame, independent of frame width. Fit-first default.
- Product Showcase selects an existing drink, real saved photo, and **six existing MIT Motion Lab modes** (Portal, Orbit, Cascade, Tunnel, Carousel, Marquee). User can change speed, background and visible title; animation plays live rather than being a still screenshot.
- Export a portable animated artifact without AI calls. Prefer native downloadable MP4 if browser supports it; otherwise WebM. GIF via vetted MIT gifenc if practical. Show accurate supported-format labels; never promise an unsupported encoder.
- Reuse current Supabase owner-scoped auth, product drafts, product-photo uploads and RLS. No new table, paid API, or duplicate account system.
- Safeguard public menu links and legacy screen query routes. No automatic publish or destructive migration.

## Alternatives
A. **Adopt entire OpenTempl or Canvix application**: rich editor, but creates second UI/auth/data architecture and large migration; rejected for this rollout.
B. **Selected: thin owner shell using existing catalog/export pipeline plus genuine reusable MIT Motion Lab engine**: faster, reversible, preserves data, can later add vetted template adapters. An unobtrusive on-artboard edit affordance uses standard contenteditable, not a second design form. Tradeoff: first release retains existing 24 gallery combinations; it does not automatically import OpenTempl's nine menu documents.
C. Rebuild app/backend or write another animation library: discarded; duplicates working functions and raises risks.

## Data/architecture
```mermaid
flowchart LR
 S[Existing Supabase owner-scoped draft] --> M[Menu Generator]
 S --> A[Product Showcase]
 M --> E[Existing gallery renderer + in-place data edits]
 E --> D[PDF / PNG / JPG]
 A --> L[Vendored MIT Motion Lab modes]
 L --> V[Live animated browser canvas]
 V --> X[Native video / GIF output when supported]
 E --> S
 A --> S
 ```
- `draft.branding`: optional `name`, `tagline`, `logoUrl`, `palette`, `headingFont`; safe allowlisted properties. Default Seiyun branding. Text-only when logo unset.
- `draft.menuArtwork`: existing `templateId`, `format`, `imageSpace`, `photoSizeByProduct`; optional `photoTransformByProduct` for `zoom` and `x/y`. Existing gallery renderer remains format/pagination source.
- `draft.showcaseArtwork`: `productId`, `mode` (six allowlisted values), `background`, `speed`, `duration`. A selected product is never filtered by legacy screen category. Showcase picks `photos[showcasePrimary]` if valid, else primary photo.
- New `studio/creative-studio.js/css` is the only owner-facing router for authenticated Studio (2 options); existing `?screen` and public-menu routes bypass it. `vendor/motion-lab/motion.js` and `scene.css` copied unchanged with upstream LICENSE and source commit/attribution.
- Save through existing `saveSoon()`, upload via existing `addPhotos` for selected product / Cloudflare Supabase Storage; after upload update current live canvas (old upload handler updates hidden form, so hook explicitly).
- Export uses browser capture and file download; MediaRecorder files have browser-dependent codec. No server-side ffmpeg, no claim all browsers produce MP4.
- All user-visible headings/price strings escaped before HTML composition. Contenteditable commits on blur; changes to product fields update canonical draft once (not image-only decoration).
- Legacy tab names remain only in non-owner compatibility paths; owner sees exactly 2.

## STRIDE / supply chain
Spoofing & privilege: Supabase Auth/RLS unchanged, only current owner's draft. Tampering: allowlisted font/palette/motion IDs; reject arbitrary HTML or scripts from editing fields and remote GitHub template URLs; sanitize URL schemes for logo/photo. Repudiation: draft revision/update tracking as existing; downloadable files are explicit owner actions. Information disclosure: no unauthenticated draft preview or cross-owner storage. DoS: cap recording duration and dimensions, reject giant image files using existing upload limits, avoid recursive expensive capture loops. Supply chain: preserve MIT Motion Lab notice, pin vendored source, no stock assets. Browser availability/CORS errors should show explicit actionable feedback.

## Rollout / acceptance
1. Add tests before code: only two nav options; draft persistence of inline edits and branding; no legacy screen filter on selected showcase; six modes and real frame changes; photo zoom changes image transform; video format detected rather than promised.
2. Implement on branch, test with reference 23 products and photo uploads, browser desktop/mobile and exports, without touching Supabase schema.
3. Audit existing public routes, approve PR only after regression checks. Merge if green; Cloudflare deployment separate and must be verified.
4. MVP **does not** mean hundreds of independently imported menu templates or photorealistic coffee pouring. Template adapters and advanced cutout/video quality remain incremental work; no fake completion claims.

## Missing reference files
Uploaded Spec Before Code refers to `assets/spec-template.md` and `assets/threat-model.md`, which were not attached. This document includes the required alternative/spec/threat sections instead.
