# Design: source-backed menu gallery and cinematic product studio
**Status:** Accepted via owner's repeated implementation instruction, 2026-11-26
**Scope:** Current `main` from PR #4. Keep Supabase owner data/auth, published routes, existing exports.

## Problem
The current Menu Generator advertises 24 selections but displays abstract color-block thumbnails and uses 8 in-house layouts × 3 palettes. Users cannot judge layout by browsing. The owner asked for source-backed reusable menu designs and real image-rich thumbnails, plus direct manipulation rather than below-canvas forms. The Product Showcase uses Motion Lab's gallery cards; repeated tiny images and mismatched export motion fail the single-product hero-ad requirement.

## Goals / measurable acceptance
1. The owner's design library renders **actual populated preview pages** for every visible design; no decorative bars substituted for preview. Distinguish legacy 24 combinations from newly integrated source documents and label license/source.
2. Import usable original MIT-licensed OpenTempl **Menu** documents as a separate, attributable family; preserve source geometry/decorative elements when feasible, replace original restaurant names/prices/photos with current owner's data, and avoid loading/sample stock photos. Every enabled product occurs in exported pages (no omissions). No product editing required to switch layouts.
3. Menu text and brand, selected photo and featured product can be directly selected. Expose resize/move controls on canvas with touch and mouse; save layout transforms independent from canonical product information; keep preview and export identical. Avoid clipping and off-page placement.
4. Product Showcase must be a **single drink hero composition**, live full-frame animated background + flavor elements + typography, not repeated gallery cards. Provide Cinematic Reveal, Ingredient Motion, Product Spotlight, Fresh/Iced, Warm Café. The same time-parametrized renderer powers live preview, still PNG, GIF and native MP4/WebM exports.
5. No extra paid AI or per-export tokens. Reuse validated open-source libraries and preserve license metadata. Owner's own photos only; source template demo images are deliberately not imported.
6. Test actual mobile touch/desktop interactions, real static/animated file downloads, 26 products across pages, no cross-tenant data access, branding text/price correctness, real template preview diversity.

## Architecture
```mermaid
flowchart TD
 S[Owner scoped Supabase menu] --> C[Canonical product + brand model]
 C --> L[Menu source registry: existing + MIT OpenTempl documents]
 L --> B[Populate, paginate, create artboards]
 B --> G[Real artwork thumbnail gallery]
 B --> E[Direct DOM editing: move/resize, save design overrides]
 E --> X[Print/PDF, PNG/JPG]
 C --> H[Hero scene presets + photo cutout]
 H --> A[Single time-parametrized 2D scene]
 A --> P[Live preview and direct layer selection]
 A --> V[Still PNG, GIF, native MP4/WebM]
 ```
Menu documents are bundled as a pinned vendored data source. The adapter interprets only allowlisted object types (background, text, lines, simple shapes) and binds owner products/prices, with measured per-page capacity. It does not execute scripts/HTML from source templates. On-menu adjustments are stored under `draft.menuArtwork.layoutOverridesByTemplate`; on-showcase transforms under `draft.showcaseArtwork.layers`. Catalog names/prices remain in canonical products.

## Alternatives
- Keep tweaking the eight CSS renderers and generic Motion Lab card effects: quickest, but recreates the repeated failed experience. Rejected.
- Adopt all of OpenTempl or Canvix (full React/Next/Prisma app) immediately: brings many editor features but duplicates auth/data and increases upgrade/security risk; source template import plus constrained edit layer is more reversible. Rejected for this increment.
- Use generative video per café: photorealistic but recurring AI cost, no consistency; not default. Owner-approved optional later only.

## Security (STRIDE)
Spoofing/privileges: existing Supabase Auth/RLS unchanged; reads/writes only current user's draft. Tampering: vendor template file is pinned, static and trusted at build; no arbitrary GitHub URLs or injected HTML, editable text always escaped, colors/fonts/motion IDs allowlisted. Repudiation: explicit draft autosave and download action; no auto publish. Information disclosure: no asset harvesting from other tenants or public presentation of private drafts; no hardcoded secrets in JS. DoS: cap canvas dimensions/frame counts, photo input bytes, max templates per visible batch; stop animation on route changes; avoid huge decoded image retention. Supply chain: retain upstream MIT attribution/revision; native browser codec availability detected instead of pretending all browsers offer MP4. Export photo CORS must be verified live.

## Rollout / tests
Implement on separate branch; CI unit (registry, deterministic binding, pagination, layering) and headless Chromium iPhone-sized viewport plus real imports, screenshots, PNG/GIF/video. Preserve existing 24, but label them accurately. Merge only if regressions green and test screenshots reflect the requested UX. Cloudflare deployment and authenticated Supabase photo export remain separate verification gates. No claim of true footage/liquid physics from one photo.

## Missing skill references
Uploaded Spec Before Code references `assets/spec-template.md` and `assets/threat-model.md` which were not bundled; this document includes equivalent sections. Uploaded UI/UX Pro Max lists a Windows-only `scripts/search.py` that is not mounted here; its visual hierarchy/accessibility guidelines will be applied manually and the missing script recorded.
