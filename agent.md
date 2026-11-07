# Café Menu Generator — agent handoff

**Updated:** 2026-11-07  
**Project status:** Architecture under discussion; no production app deployed.  
**Repository:** https://github.com/killbill2792/cafe-menu-generator

## Read this first

The owner wants a **premium, image-rich café digital menu platform**, not an animated list that makes customers wait to see prices. **Quality cannot be sacrificed to reduce cost or development time.** The owner has Claude Pro ($20/month) and explicitly rejects additional subscriptions, paid AI credits, or mandatory new fees.

**Newest, high-priority correction (2026-11-07): SCREEN 1 MUST DISPLAY THE ENTIRE MENU AT ONCE.** Do **not** rotate/paginate the main menu or require viewers to wait. The real existing café menu in `IMG_3929.JPG` is dense text spread across two portrait displays. The goal is to preserve immediate menu discoverability while adding recognizable product photography. A single 9:16 display has finite space: the **exact visual density, content priority, and distance-legibility trade-off is NOT YET APPROVED**. Raise this architecture choice with the owner before changing UI. Never silently solve it by hiding items or using tiny unreadable text.

## Confirmed user requirements / decisions

- Current café has **two portrait TVs**, continuously on. Screen count and screen roles must be data-driven for future installations. This is **not** a limit of two screens.
- **Screen 1: comprehensive menu visible immediately** with visually identifiable drinks, product names, sizes and prices; ingredients/description should be compact but accessible. No carousel, pagination, timed menu rotation, or hidden categories on the main menu. Preserve clear view from real café viewing distance; don't falsely promise all-item hero-size photography if space cannot fit.
- **Screen 2: rotating promotional showcase**, with appetizing high-quality motion centered on a product, and a persistent horizontal product-thumbnail strip at bottom. The showcase may rotate; the full menu may not.
- Simple **owner product-entry screen**: upload 1+ photos/product; name, description, ingredients, category, variants (sizes/prices), tags, visibility. Do not ask owner to manually edit photos or videos.
- **Save draft → Preview → Publish**, with published versions isolated from drafts, validation, recovery/rollback and reliable cross-device distribution in production.
- **Professional configurable display presets (Approach A)**, with screen assignment/content filters and minor field-display variations. **No drag/drop/full layout-designer** in the first release.
- Product/category/screen counts **not artificially limited**. Three example drinks are photos used for testing, not a cap. First owner is rollout audience, not a one-café-only architecture.
- Preserve product fidelity: don't invent ingredients, toppings, names, pricing, or physically impossible liquid motions. Photo-based motion approved as a foundation; photorealistic AI action is optional only if high-quality and zero-extra-fee.
- Browser/cloud-first route preferred, no heavy installations for owner. TV/browser compatibility and offline resilience still need verification.

## User-provided visual assets (not pushed to this repo)

Three real Seiyun-branded drink photos in conversation attachments: `IMG_4858.PNG`, `IMG_4859.PNG`, `IMG_4866.PNG`. Current café menu installation reference: `IMG_3929.JPG`. These are **not in this GitHub repository**; source agents must request/locate assets if unavailable. Don't invent menu product names or ingredients based only on images.

## Existing prototype and critical mismatch

A local-only HTML demo was produced previously as `/mnt/data/cafe_studio/Seiyun_Menu_Studio.html` (with supporting `app.js`, `styles.css`, sample images) in the conversation environment, **not uploaded to this GitHub repository**. Its editing, screen configuration, draft/publish, and backup behavior are useful reference only. It is **not production-ready**: local browser persistence, no secure owner authentication, no shared TV updates, no hosted API. More importantly, its menu uses approximately 1–3 products per page with **automatic pagination**, violating the newest all-at-once requirement. Do not treat previous prototype behavior as approved.

A prior local architecture draft exists in conversation at `/mnt/data/cafe-display-spec/0001-cafe-visual-menu-architecture.md` and decisions at `/mnt/data/cafe-display-spec/DECISIONS.md`, **not guaranteed available in a future session**. The draft also allowed menu pagination/rotation; that requirement is now obsolete. Check and update the spec after the owner chooses the all-at-once menu density approach.

## Repository / integration status

- This GitHub repository was inspected on 2026-11-07. At handoff time its default branch `main` contained only `README.md`. This file is the first project handoff added.
- The owner says they **created a Supabase project** and may provide access. **Not yet selected or configured as an approved backend**. Before implementation: verify project ownership, access and free-tier constraints; design authentication, RLS, safe media uploads, private drafts, atomic publication, and read-only published display endpoints. **Never commit service-role keys, passwords, secrets, or private tokens to GitHub.**
- Candidate client stack: React, free Motion, free Embla; Remotion **conditional on commercial license eligibility**; Playwright for TV-size visual testing. Candidate hosting: Cloudflare Pages. These are proposals, not all final approvals. Evaluate no-additional-cost limits and Samsung browser model/year.
- The user authorized GitHub push of an `agent.md` continuation file. **Do not interpret that as permission to redesign or implement the full application.**

## Next architecture issue — one decision at a time

**How can a portrait menu show all products simultaneously with recognizable images and legible prices?** Explain the space trade-off with realistic dense-layout alternatives (e.g., compact product thumbnails per item and short price lines; category grouping; and what detail can move to the promo screen without hiding price/name). Validate against the owner's actual menu photo and viewing distance, not a three-product demo. Get approval before committing layout design.

Other unresolved decisions: accurate full catalog count/data; secure Supabase/hosting architecture; Remotion license eligibility; Samsung TV model/browser and offline behavior; per-product photo rights; practical visual acceptance criteria.

## Skills and workflow — mandatory

- Follow uploaded `Brainstorming.md.md` and `Spec before code.md.md` methodologies (when unavailable, request the source before implementation).
- Discuss one major design decision at a time; document alternatives, trade-offs, recommendation, approval and unresolved questions.
- Read existing repo and source artifacts first, then write/review the architecture spec in a documentation-only PR before implementing. Require owner approval of design/spec. Once approved, use the `superpowers:writing-plans` skill or flag that supporting instruction as missing.
- Supporting references named but not provided: `assets/spec-template.md`, `assets/threat-model.md`, `builder-check-prompt.md`, `visual-companion.md` and `superpowers:writing-plans`. Do not silently claim to have read them.
- Separate **confirmed requirement**, **proposed architecture**, **implemented feature** and **tested production behavior**. Never claim remote sync, secure login, real TV playback or AI-generated liquid videos based on the existing local demo.

## Checklist / current state

- [x] Methodology files read in earlier conversation; supporting references missing.
- [x] Owner decisions recorded above.
- [x] Actual current-menu reference photo supplied.
- [x] Repository inspected; handoff file requested.
- [ ] Choose and approve *all-menu-visible* portrait layout strategy (new blocker).
- [ ] Choose and approve secure free-tier Supabase/media/publishing backend and TV delivery.
- [ ] Revise full architecture spec and threat model; obtain approval.
- [ ] Write implementation plan per writing-plans method.
- [ ] Build, test real menu density, secure publish and continuous portrait playback.

## User review correction — 2026-11-07, after seeing combined two-screen preview

The user explicitly rejected the current visual treatment as **too much empty space and tiny product images**. Merely recreating the old text menu with miniature icons does not satisfy the purpose. The system must make it visually obvious **what drinks actually look like** on Screen 1; Screen 2 must present a striking, product-dominant, cinematic individual advertisement, not a small cup floating amid blank space. Keep the all-items-at-once requirement for Screen 1. Treat the existing two-column tiny-icon mockup as an **unapproved feasibility prototype**, not the approved final design. Focus on image-led composition and efficient use of the portrait screen; photographs must be prominent. Only 3 real photos have been supplied so far and they cannot be misrepresented as 23 different beverages.

**Unresolved layout trade-off for owner approval:** (A) a dense photo-first grid showing every product, with short name and price and less ingredient detail; or (B) a full legible price catalog with a smaller number of significantly larger photo features. The user wants both strong photography and complete immediate browsing, so do not presume the balance. Screen 2 should dedicate most available area to the featured drink (with visible bottom thumbnail rail), not large empty margins. Do not finalize design or claim this visual correction implemented until reviewed.

## Approved photo-first product wall and built local Studio (2026-11-07)

The owner **approved Approach A**: Screen 1 is an image-led product wall, not a tiny-thumbnail text menu. All active items must remain visible immediately, grouped by categories, with a large photo area plus short name/size/price. Longer ingredients and descriptions belong in the product editor and feature/promotion screen. The category grid can expand final-row cards to use empty cells. Screen 2 remains an individual product ad with a large featured drink, subtle photo-based motion and a persistent horizontal thumbnail strip.

A new **complete local browser prototype** was built in the conversation at `/mnt/data/seiyun_photo_first/Seiyun_Menu_Studio.html` and a source ZIP at `/mnt/data/seiyun_photo_first/Seiyun_Photo_First_Studio_and_Source.zip`. These files are **not part of this GitHub repository** unless subsequently committed. The local prototype contains the three owner-supplied photos in the product editor library, but assigns none automatically. It starts with 23 entries transcribed from the existing menu photo; the owner must verify all factual fields.

**Verified in headless Chromium:** all 23 product cards, four categories, no scroll or off-screen overflow on a 1080 × 1920 portrait layout; selecting three product photos gives three full-menu cards and three showcase thumbnails; Preview and local Publish work with no JavaScript errors. **Reload persistence was not independently tested**, because the test browser refused file and localhost navigation. Real Samsung TV playback and viewing-distance legibility are unverified. In the screenshot demo the three product photos were assigned to sample positions *for layout illustration only*, not confirmed menu mapping. The video-like motion is a slow animated photograph, **not real generated liquid pouring**.

The uploaded UI/UX Pro Max `SKILL.md` was read in full, but the required `scripts/search.py` and data files were not supplied, so automated design-system search was unavailable. This is recorded in the source README.

**Important for PR #1**: its older small-thumbnail `screen1/renderer.js` is now a superseded design, not a current approved implementation. Merge only after the new photo-first source is brought to the review branch and visually approved by the owner. Secure Supabase upload/storage, cross-TV publication, protected owner login, and remote hosting are still outstanding. Never publish secrets or assume a finished production platform exists.
