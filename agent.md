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

## Direct-on-canvas owner editing — new current prototype (2026-11-07)

The owner requested that **Screen 1 itself become the visual editing interface**, instead of a separate long list of products and form. This is a refinement to approved photo-first Approach A. **Implemented in local prototype** at `/mnt/data/seiyun_visual_editor/Seiyun_Menu_Studio.html` and source in draft PR #1 under `studio/`. The customer-facing menu and the editor share the same photo-first renderer. Select a product card on the portrait canvas to edit that card in a compact side inspector (name, photo from library or upload, category, ingredients, promotional description, multiple sizes/prices, visibility). The new product button adds a card. Card changes are visible in the canvas immediately.

**Screen 1 customer-facing layout corrections requested by owner:** Use bold high-contrast names; show concise **ingredients** on every card, along with sizes and prominent prices; show full contained image (no cropped cup) when assigned. **Remove** 'Find your favorite', total item counts, and decorative footer. Header displays only **seiyun / YEMENI COFFEE**. All enabled products visible simultaneously, no menu rotation.

**Tested:** 23 all-at-once menu cards at 1080×1920 with no clipping/overflow (minimum card height 216px); editing name/ingredients/price updates canvas; actual PNG image upload works; preview both screens and local Publish works. Chromium test produced no JS errors. **Reload persistence is not verified** because local/localhost browser navigation is blocked in the test runner. Full-height photographic showcase remains Screen 2. Public repo `studio/` omits the owner's three product photos; the downloadable offline HTML includes them. Do not misrepresent the sample photos as exact named products.

**Unchanged remaining work:** secure Supabase owner login/storage, online published versioning and synchronization to both TVs, TV model/browser test, physical reading-distance check, optional realistic drink footage. Do not claim production readiness. GitHub PR #1 is still a **draft** for owner review; no live deployment.

## Typography feedback — pending approval (2026-11-07)

Owner **approves the current Screen 1 image-first layout, on-canvas editing workflow, Screen 2 composition, prices, ingredients and rest of UI**, but **does not approve the typography/fonts**. Current source uses a mix of Arial/system sans, Georgia serif, and Inter fallback, including tightly letter-spaced uppercase bold names. Do NOT redesign other parts of the interface while adjusting fonts. Preserve authentic `seiyun / YEMENI COFFEE` brand identity. The next one-at-a-time decision is selecting a **readable, premium, no-extra-fee licensed typeface pairing** for distant TV readability (particularly product names, ingredients and price badges). Candidate recommendation: Plus Jakarta Sans 800 for product names/prices, DM Sans 500–600 for ingredients/secondary, with brand lockup unchanged; show the owner typography examples for approval before changing code. Both are available under SIL OFL via Google Fonts. Check offline/cached font loading behavior on TVs and provide system fallbacks; don't commit unlicensed font files.

## Typography Option B approved and implemented for review (2026-11-07)

The owner explicitly approved **Fraunces for display headings + DM Sans for readable menu information**, with **all layouts and functionality unchanged**, and requested an updated screen preview **before merging**. This exact scope is implemented on draft PR #1 (branch `feature/all-at-once-portrait-menu`), in `studio/styles.css` (additive font-family overrides) and `studio/index.html` (Google Fonts stylesheet link). No app behavior, data, card geometry, colors, images or motion were changed. The standalone local preview is `/mnt/data/seiyun_font_option_b/Seiyun_Menu_Studio.html`, with review image `/mnt/data/seiyun_font_option_b/option_b_both_screens_review.png` and a source ZIP `/mnt/data/Seiyun_Font_Option_B_Review.zip`. **Do not merge or deploy** until owner reviews and approves the result.

**Testing:** headless Chromium verified Screen 1 has 23/23 cards fully within a 1080×1920 frame, Screen 2 continues to show a featured drink, the visual editor still edits products, and there were no JS exceptions. **Critical preview caveat:** the test browser blocks external Google Fonts; screenshots display fallback Noto Serif/Inter, not real Fraunces/DM Sans. An internet-connected local browser will request the actual families from Google Fonts. Future production needs a font-availability/offline fallback strategy, especially for always-on TVs. Fonts are open-source SIL OFL, but **no font binaries were committed or distributed**.


## Screen 1 work completed on review branch (2026-11-07)

- Branch: `feature/all-at-once-portrait-menu`. Source: `screen1/index.html`, `screen1/renderer.js`, `screen1/styles.css`, `screen1/reference-data.js`.
- A source-matching standalone downloadable HTML preview with the owner's three photos was delivered separately in the conversation. The **public GitHub repo deliberately omits real product photographs** until product-name mapping and publication rights are confirmed.
- Tested in headless Chromium at 1080×1920: all 23 reference menu items immediately visible, four categories, 23 prices, no scroll/clipping or console errors. Existing local owner studio was also patched and browser-tested to remove menu pagination; **that standalone local studio package is not yet committed to this repository**.
- Reference facts were transcribed from supplied café menu photo and **must be verified before live publishing**. Individual row images are neutral placeholders, not product-specific photos yet.
- The UI/UX Pro Max skill Markdown was fully read. Its `--design-system` Python script/data were not included in the uploaded file, so the required generator could not be run; design tokens were recorded provisionally. See `screen1/README.md`.
- The layout is a **prototype proposal**, not final visual approval. Actual Samsung TV/browser, reading distance, live Supabase authentication/storage/publication, and overflow with very large menus remain untested.

## Production handoff — Supabase applied, Cloudflare not yet connected (2026-11-07)

- The owner explicitly authorized implementing the full-cup display rule and live online publishing. The existing visual editor, typography and menu/showcase layouts remain unchanged except for whole-cup image containment/non-cropping float animation.
- The connected `cafe-menu-generator` Supabase project (ref `tfknuqbaahesuqugfaib`) now has **three RLS-protected tables**, `studio_private`, `studio_live`, `studio_history`, and the public media bucket `menu-products`. `publish_studio()` and `rollback_studio()` are authenticated atomic RPCs with explicit owner checks; anonymous users have no draft access or write privileges. The security advisor reports intentional warnings for the signed-in users' security-definer RPCs. Do not remove owner checks or expose EXECUTE to anonymous.
- Canonical hosted client source: `studio/index.html`, `studio/app.js`, `studio/styles.css`, `studio/cloud.js` (public key only), `studio/cloud-bridge.js`; older `screen1/` has been removed. Deployment instructions: `studio/DEPLOY.md`; schema migration source: `supabase/migrations/20261107_studio_online.sql` (already applied once, do not blindly reapply).
- Cloudflare Pages **has not been authorized/deployed by the user**. To go live, connect GitHub repository main to free Cloudflare Pages, deploy output directory `studio`, set Supabase Auth Site URL to production Pages domain, create/confirm owner account, verify menu facts and upload drink photos, Publish, then open two public display links on actual Samsung TVs. See deploy runbook. No production website URL exists until host is connected.
- Headless Chromium completed a **mocked-Supabase owner-session test** of 23 menu products, direct edits, cloud draft save, previews and publish revision with no browser exceptions. SQL privilege tests confirmed anon cannot read private drafts, mutate live records, or execute publish. Real signup, live file upload, and TV browser behavior are still **untested**.
- Operational limitations: no free-tier 24/7 SLA, internet-dependent initial load, readable density at real viewing distance unverified, and current ad motion is photographic (not AI-generated coffee pours).

## Release merged to main, awaiting Cloudflare authorization (2026-11-07)

PR #1 was merged into **main** (commit `eef41b47ac66b584041243d9d5aebe4f2f3c38eb`). The production-ready source is on `main` at `studio/`; the authenticated Supabase tables/media bucket are already created. The website is **NOT PUBLICLY LIVE** until the user completes the Cloudflare Pages GitHub connection using `studio/DEPLOY.md`, configures Supabase Auth redirect, creates/confirm owner login, and verifies the real two Samsung portrait TVs. The backend is on the Supabase **free** organization tier. Studio source contains a public publishable key only. Do not claim production signup, remote image uploads, two-TV delivery or recovery tests were performed beyond the mocked browser flow and real SQL grants checks. Full-cup image fit and approved two-screen editor implemented; metadata values from the photo require owner verification.

## Current authentication redirect fix (2026-11-07)

Owner's live site is `https://cafe-menu-generator.raj-techai2026.workers.dev/` (Cloudflare Workers, **not** a Pages `.pages.dev` URL). Existing sign-up link erroneously sent user to localhost. Supabase `auth.users` confirmed **1 user / 1 email confirmed / 0 pending**, so user does **not** need unverified-account bypass. In `studio/cloud.js` on `main`, `auth.signUp` now explicitly sets `options.emailRedirectTo` to the hosted URL. Next required owner action: set Supabase Auth **Site URL** and **Redirect URLs** to the exact hosted URL in dashboard at `https://supabase.com/dashboard/project/tfknuqbaahesuqugfaib/auth/url-configuration`. Connector doesn't expose managed Auth Site URL settings. Check Cloudflare Worker redeploy status for the GitHub commit; don't claim live Worker updated without verification. Keep email verification enabled.

## Samsung / PDF / QR extension, November 7, 2026

User requested Samsung TV connection instructions, printable full menu PDF, and QR codes for published online menu and Google review request. Implemented in branch `feature/print-menu-and-qr` (pending PR/merge) in `studio/menu-extras.js`, `studio/menu-extras.css`, `studio/index.html`, and `studio/cloud-bridge.js`. Read `studio/TV_PRINT_QR.md` and `specs/0003-samsung-tv-print-qr.md` before changing this functionality.

The public menu QR points to a responsive published-catalog route `?catalog=1&owner=<owner UUID>`. This does NOT expose drafts. The Google review QR is deliberately configurable in the owner's Screens section; never guess or embed the wrong café's review URL. Native print dialog handles printing or Save as PDF of draft/published menu. The approved photo-first TV designs stay untouched. Google review URL is saved to the private draft and becomes customer-visible after Publish.

Local browser validation with mocked signed-in Supabase client: 23 products on printable menu, 3 A4 PDF pages without clipping long ingredient lines, QR PNG download event, Google URL allowlist, public phone menu with no owner login, and no JS exceptions. QR library tested via a drawing stub because automated Chromium cannot fetch the remote CDN in this environment. Real CDN-generated QR scans and deployed Samsung TV compatibility remain unverified.

As of this work the actual connected Supabase database still had **one private draft, zero published menus, zero uploaded product photographs**. Two public TV routes won't show a finished product until the owner publishes; Screen 2 requires product-specific photos. The user must physically check the Samsung Internet app and portrait rotation (Samsung model unspecified). Cloudflare deployment status must be checked separately after merging; pushing GitHub alone is NOT confirmation of live update.

## Photo upload production hotfix pushed (2026-11-12)

**User explicitly authorized** committing the previously tested image upload repair to `main`. GitHub write permissions were restored and the following changes were successfully committed:
- `studio/cloud.js`: secure random ID fallback for photo filenames on older browsers; **existing production email-confirmation redirect is preserved**.
- `studio/app.js`: expands file picker to common image formats and HEIC extensions.
- `studio/cloud-bridge.js`: uploads small PNG/JPEG/WebP/AVIF originals directly (no canvas conversion), converts other or oversized browser-decodable photos to WebP/JPEG under 6 MiB while preserving aspect ratio, rejects non-image files, shows file-specific failures, saves the draft online before reporting success.

Latest commit on `main`: `fba4bd0a3c1f96a26a21c861f7969c9d4c41fa26`. All three files were fetched back from GitHub and verified. No changes to DB/schema, RLS policies, menus, TV layout, pricing, or product data. Local headless Chromium tests with original café PNG and oversized PNG and Node syntax tests already passed on the prepared patch; **real authenticated production upload is not yet verified**. The production Cloudflare Workers site `https://cafe-menu-generator.raj-techai2026.workers.dev/` could not be reached from the current execution environment (network/DNS restriction), and GitHub showed no commit statuses or workflows for this commit. **Check Cloudflare Workers Deployments for the new SHA and trigger the existing Worker's deploy if not automatic; do not recreate the Worker.** Then sign in, upload a PNG, reload, and confirm persistent photo and Screen 2 preview. Current outstanding limitation: GIF/HEIC/TIFF conversion only works where the owner's browser can decode them. If post-deployment uploads fail, collect exact error; debug Supabase Storage and network logs.

## Both-screen owner editing (2026-11-12)
Owner requires **Screen 1 and Screen 2 previews always visible together on Edit menu**, even after a drink is selected. Implemented on `main` in `studio/dual-editor.js`, `studio/styles.css`, `studio/index.html`, and `studio/cloud-bridge.js`. Both portrait previews sit beside the shared inspector and stack on narrower viewports. Clicking a Screen 1 card or choosing a product for Screen 2 changes the selection, never hides the other preview. Screen 2 has its own upload button and can use a different photo of the same drink via optional `showcasePrimary` (index into existing `photos[]`); fallback is Screen 1's `primary`. No new products, DB migration, or separate ad catalog. TV layouts and publish workflow unchanged. Design and implementation checklist are in `docs/superpowers/specs/2026-11-12-two-screen-editor-design.md` and `docs/superpowers/plans/2026-11-12-two-screen-editor.md`. JS syntax, mocked dual-panel rendering, and image separation tests passed. Real authenticated browser and Cloudflare Workers deployment **not verified**. Check Cloudflare Deployments and reload the existing website; only after successful live testing consider implementation production-ready.

## Menu template and image zoom proposal — awaiting owner approval (2026-11-12)

Owner said the current Screen 1 photo-first 4-column cards render drinks too small, requested a **second menu template** with a **photo on the left and name/ingredients/price on the right**, plus an adjustable **per-product image zoom** and ability to switch templates. A **static concept preview** has been shown in ChatGPT; this is NOT production or merged UI. Current Studio supports screen roles and product photo selection but **does not yet offer a menu-template picker, per-product image scale/position controls, or customizable card layout**. Owner has not approved the new template's final layout or how to resolve the constraint of all 23 items simultaneously on a portrait Screen 1.

**Decision pending:** If all 23 items remain visible on a single portrait TV, horizontal cards still have limited height and cannot make every cup dramatically larger. A truly larger-photo alternative would need fewer cards per view, rotation/pagination or a second physical screen; this conflicts with the prior all-at-once requirement. Recommendation: maintain the existing 23-item template; offer a new side-by-side compact template and a fit-first, optional zoom control with a clear cropping warning. Preserve full-cup default, bold readable names, prices and ingredients, real product-photo mapping, approved fonts, draft/preview/publish, both screen previews. Do not implement or change live design without explicit owner approval of the tradeoff.

## Reusable menu template library research — pending architectural choice (2026-11-12)

Owner's product objective: a **library of 5–6 ready-to-use menu layout presets** with per-business preferences, rather than code revisions for every request ('not 4x4', move image left, change density, etc.). This is broader than the prior single side-by-side template idea. This turn is **research and architecture options only**; no code or production template import approved.

**Verified external references (recheck licenses and individual assets at import):**
- https://github.com/screentinker/templates — digital-signage template catalog, slide JSON or sandboxed HTML; individual template licenses vary (MIT, Apache-2.0, BSD, ISC, 0BSD, CC0, Unlicense) and should be checked per template. It is not a drop-in renderer for our app.
- https://github.com/ColorlibHQ/bootstrap-templates — MIT Bootstrap website templates including restaurant `tavola`; code targets Bootstrap 6 alpha and modern browsers, so port layout patterns only, not modern JS into older Samsung TVs without testing.
- https://github.com/themefisher/restaurant-bootstrap — MIT restaurant website code; README specifically says sample images are **not licensed for reuse**.
- https://github.com/GrapesJS/grapesjs — BSD-3-Clause vanilla JS drag-and-drop editor, heavier and more flexible, requires secure component restrictions.
- https://github.com/gridstack/gridstack.js — MIT draggable/resizable layout library, a possible phase-two custom-grid control, not complete menu templates.
- https://puckeditor.com/docs — MIT editor but React-oriented and does not integrate directly with current vanilla JS app.
- Canva's content terms restrict redistribution or resale of unaltered/pro assets and off-platform Pro content templates; don't bulk-import unlicensed Canva designs.

**Approaches to get owner approval on, one major choice:** (A) import independent 3rd-party template HTML as-is (fast initial demos, but hard to preserve shared data, fonts, all-item semantics, TV reliability); (B) **recommended** curate six permissively licensed layout inspirations and implement a common versioned declarative template/preset layer over existing Supabase menu data and Screen1/Screen2 renderer, with customization controls, safe preview and publish; (C) full drag-and-drop editing using GrapesJS/GridStack (more control, more engineering/support, performance/legibility problems; future optional advanced mode). Current recommendation B: 6 template families (photo-left rows; full-photo cards; editorial list; compact all-items grid; featured-plus-list; category panels), density/overflow warning for small screens, zoom/full-fit default and explicit crop warning, no duplicated products or unlicensed photos. Keep full-cup safety, existing dual previews, and TV published snapshots.

**Unresolved decision:** User must choose curated presets + constrained customization (recommended) versus a truly free-form drag/drop canvas now. Until choice and design doc are approved, do not implement or assume all templates are licensed/importable. Methodology references `assets/spec-template.md` and `assets/threat-model.md` have not been supplied in this project; create equivalent content in spec when approved rather than silently skipping the threat model.

## Owner prefers open-source embedded editor over preset-only library (2026-11-12)

Owner challenged the recommendation to ship only 5–6 curated menu templates, saying a directly embedded **open-source visual editing system** should offer café owners wider layout customization without repeated engineering requests. Reconsider preset-only approach as **not approved**. Research confirmed **GrapesJS Core** (https://github.com/GrapesJS/grapesjs, BSD-3-Clause) is a self-hosted framework-agnostic HTML/CSS drag-and-drop editor with blocks, style manager, layer navigation, assets and project-data serialization; suitable for investigation in the current vanilla-JS Studio. The distinct commercial **GrapesJS Studio SDK** is not the same as the free core, with branded/free plan limits and paid tiers; avoid unapproved paid dependencies. Alternatives: Puck MIT is React-oriented and requires a frontend rewrite; GridStack MIT offers grid drag/resize but not a complete rich editor.

**Suggested integration boundary (NOT YET APPROVED):** GrapesJS Core runs *only inside the authenticated owner editing page* to arrange product-photo, name, ingredients, size, price, category and branding blocks. Existing Supabase product catalog remains the single source of factual data, with a versioned layout JSON/CSS stored as a private draft and published via current workflow; the TV pages render a sanitized/published read-only snapshot without loading the GrapesJS editor. Need adapters for repeatable products, dynamic visibility, photo zoom/position, portrait overflow warnings, security sanitization (no owner-supplied arbitrary JS), asset upload, undo/redo, safe output for Samsung browser and maintaining Screen 1/2 preview. Start with a focused feasibility spike if approved. No code or migration has been made. **One open decision:** approve the GrapesJS Core integration direction rather than preset-only or immediate React/Puck rewrite. Do not claim drag/drop available live until implemented and tested.

## Owner decision direction: existing menu-board software, minimum editing (2026-11-12)

Owner clarified that **an unconstrained design editor such as GrapesJS would impose too much work on café owners**. They want an *existing ready-made, open-source restaurant/digital menu board*, used directly in our product, with the 23-product Supabase catalog and uploaded photos automatically mapped into its layout. The desired owner flow is minimal: choose a ready-made appearance, upload/change real drink photos if needed, verify prices, Preview, Publish. The earlier proposal to embed GrapesJS as the default editing interface is therefore **not approved** and should not be implemented without renewed request.

External research: https://github.com/screentinker/screentinker (MIT, self-hosted digital-signage CMS) offers an actual Menu Board widget with four looks (dark/light/chalkboard/bold), sections, descriptions, photos, multiple prices, portrait/landscape, examples, and CSV/sheet data feed. Details: https://www.screentinker.com/solutions/digital-menu-boards.html and https://www.screentinker.com/guides/digital-signage-widgets.html . It **paginates long menus**, which may conflict with old Seiyun preference for all 23 products visible at once. Its separately hosted managed version is subscription/trial, but the GitHub repo code is MIT; verify any per-template asset licenses and compatibility before import. Another possible base: https://github.com/HiroshiARAKI/Keinage (Apache-2.0, ready-made restaurant-menu board, currently React-based and extended-template plan gates in its code). It has more hosting/integration overhead than a layout-only adapter. A simple open-source QR menu template is not a suitable TV menu generator; distinguish product types.

**Proposed architecture for next owner approval:** default to a *prebuilt menu board rendered from our existing data*, not a free-form design canvas and not having the owner reenter 23 products. Compare using a self-hosted full signage CMS vs adapting its permissively licensed menu widget into our existing vanilla JS Studio/Supabase, retaining both-screen preview and secure publish. Product-specific photo fit, bold readable titles, prices, ingredients and all-at-once vs page turning require explicit testing. **No imported software or implementation has been approved/committed.**

## Screen 1 MIT template integration with zero owner design effort (2026-11-12)

Owner clarified the requirement: **Screen 2 remains the existing animated drink showcase without changes. Screen 1 should offer ready-made visually attractive restaurant menu designs borrowed from actual open-source MIT-licensed HTML/CSS projects**; the owner only selects a design, uploads actual photos, optionally edits facts, previews and publishes. No owner-built templates, no GrapesJS drag/drop, no manual row/column arrangement, no copy/paste menu re-entry, no new distinct menu CMS. Previous ScreenTinker and GrapesJS suggestions do not meet the owner-effort goal and are **not approved**.

Research-qualified source candidates:
- https://github.com/aymalkhalid/restaurant-menu-pages — multiple restaurant *menu page* designs, README explicitly MIT, designed for replacing images and item text.
- https://github.com/caresdev/restaurant-menu — MIT, vanilla HTML/CSS/JS menu, data.json with items/photos/variants; closest data-driven integration prospect.
- https://github.com/themefisher/restaurant-bootstrap — MIT *code*; README warns illustrative photographs do not carry rights of reuse.
- https://github.com/ColorlibHQ/bootstrap-templates/tree/main/tavola — MIT code; Bootstrap 6 alpha currently requires relatively new browser versions, so not necessarily suitable for older Samsung TV browsers without adaptation.
- https://github.com/uiuxlabz/restaurant-html-template — MIT restaurant website, menu.html, frameworks-free vanilla JS, requires copyright review of images.

**Proposed integration**: take the existing menu-layout markup and CSS from 2–3 verified MIT candidate sources, adapt to portrait 1080×1920 Screen 1, use the existing Supabase 23-product catalog/images/prices/ingredients, retain all-screen dual previews and draft/publish/rollback. Owner chooses a prebuilt look only; no per-item layout editing. Preserve license notices and confirm image license separately. Must test readability, whole-cup containment, item count/overflow, and older Samsung browser support. A licensed website template is not an instantly functioning digital signage screen: developers must adapt it once. No design source chosen or code imported yet; owner approval of source shortlist/implementation pending. Do not touch Screen 2.
