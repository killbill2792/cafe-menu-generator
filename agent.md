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
