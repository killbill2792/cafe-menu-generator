# Deploy and verify Seiyun Creative Studio (export-first)

> **Current state:** Feature changes live on branch `feat/real-template-browser-cinematic-hero` and PR #5, **not verified on the production site**. Only report the owner-facing product as delivered after signed-in testing and a confirmed Cloudflare deployment. Read `agent.md`, `specs/0003-real-template-library-wysiwyg.md` and `specs/0004-cinematic-product-scenes.md` first.

## What the owner is using

The two primary owner tools are **Menu Generator** and **Product Showcase**. Both are visual design/preview workspaces that create **portable files**. The owner has existing printing, online distribution and digital display systems; **do not require publishing our site, managing TVs or subscribing to signage software** to use these files.

1. Sign in with the existing authorized Supabase owner account.
2. Catalog/products, ingredients, pricing, brand and uploaded photos populate automatically. Keep original photos; do not substitute vendor demo photography.
3. Choose a **real rendered menu layout** from the gallery, or a one-drink cinematic scene. Tap to edit/drag/resize directly on the artwork, not a stack of per-screen forms.
4. Choose output format and download: browser **Print / Save as PDF**, PNG, JPEG, multi-page ZIP, or scene GIF/MP4/WebM as browser supports.
5. Use the saved files anywhere—print shop, website, third-party signage, social, email. The old publication/TV functions remain for backward compatibility only.

## Cloudflare production

The previously deployed site is **https://cafe-menu-generator.raj-techai2026.workers.dev/** (Cloudflare Workers domain). The existing GitHub repository is `killbill2792/cafe-menu-generator`, and the static output is rooted at `studio/`.

1. Merge an approved, tested PR into the production branch after the owner approves. **GitHub CI success alone never proves the Worker deployed the new commit.**
2. In Cloudflare Workers & Pages, inspect the Worker deployment revision and its Git/CI connection. Deploy the exact merged SHA if no integration exists. Do not assume a push causes a rollout.
3. Open the exact production URL on desktop and a mobile device. Confirm that the owner sees **Menu Generator**, **Product Showcase**, **31 distinct layouts/47 combinations**, real previews and all five cinematic scenes. If still 24 swatches, Cloudflare is running old code.
4. Verify downloaded files are current and can be opened outside the application; not just rendering within the browser.

No new database, queue, compute service, paid video provider, background agent or TV player is required by this PR.

## Supabase security and owner checks

Use the already-configured owner-scoped Supabase Auth, `studio_private` draft, RLS-protected catalog and existing Storage. Do not create duplicate login/accounts or move to Canvix/another editor's database. Do not place any service-role or database password in browser scripts. The frontend may contain only the existing publishable Supabase credential, with tenant access enforced by RLS.

For Auth redirects, the Supabase URL Configuration Site URL and allowed Redirect URLs must match **https://cafe-menu-generator.raj-techai2026.workers.dev/**. Keep email confirmation/invite policy as the owner has authorized; don't bypass it for testing.

### Release evidence checklist

- [ ] **Owner sign-in** on the real Cloudflare domain; confirm correct already-owned menu names, price tiers, ingredients, brands and 23 reference products (no duplication).
- [ ] **Real photo upload** to the existing owner folder: PNG/JPEG/WebP/HEIC as supported; actual photo loads and its Storage URL allows in-browser export without canvas CORS tainting.
- [ ] **Draft re-open** after browser reload: template selection, photo zoom/pan, brand edits, and design-only drag/resize persist; no accidental product price mutations.
- [ ] **Menu flow**: browse all 31 layouts, filter/search, choose Canvix/OpenTempl source, inspect each native page, download PDF/PNG/JPG/multi-page ZIP. Verify original photos and full uncropped cups.
- [ ] **Showcase**: Saffron and Matcha photos produce visibly different scenes and ingredient motion; drag/resize, play/pause, download still/GIF/video; confirm media plays independently in another application.
- [ ] **Desktop, actual mobile Safari**, and normal touch/tablet interaction tested. Chromium desktop and simulated 390px touch have passed in GitHub Actions, but Safari is **not** covered by Chromium tests.
- [ ] **Review/approve PR #5** and confirm production deploy SHA/visible UI before marking the project complete.

## What is already automated

GitHub Action `.github/workflows/artwork-redesign-tests.yml` runs Node source-binding and safety/unit tests, a desktop/mobile Chromium end-to-end flow, output-file validation of PNG, ZIP, Print/PDF, GIF, MP4 where supported, gallery filter tests and resizing. Screenshots/artifacts are uploaded. **These samples are not a substitute for real authenticated owner photographs.**

## Constraints and fallbacks

- Not every design in upstream all-category catalogs is a café menu. The 366 Canvix count is 122 originals + 244 variations; only its two original complete café print layouts were imported. The 24 historical Seiyun entries were 8 custom layouts × 3 colors, not 24 external originals.
- When browser-native MP4 is unsupported, offer a supported WebM/GIF; never name an unsupported file as MP4. GIF may consume more CPU; keep output size/duration bounded.
- Near-white background removal is best-effort and can affect white foam/cream; preserve and allow restoration of originals.
- Ingredient particles are stylized graphics. **Physical pouring, steam simulation or true liquid mixing cannot reliably be derived from a single still photograph without real footage, 3D or optional generative media.**
- Google Fonts may not load offline; allow fallback typefaces.
- Multi-page output files belong to the café owner and remain usable without keeping our website open.

## Project continuity

Read `agent.md` and source provenance in `studio/MENU_GALLERY_SOURCES.md` before editing. The older documents about mandatory TV screens, publishing and 30-second refresh describe a legacy feature and must not be used to redefine the current export-first product.
