# Seiyun Online Visual Menu Studio

**Current implementation:** Static web frontend + hosted Supabase Auth/Postgres/Storage. This is the canonical app at \`studio/index.html\`; deploy the \`studio\` folder to Cloudflare Pages as the static output directory.

## Owner workflow
- Visit the hosted website and sign in using an owner account.
- All existing menu items are available on the same **photo-first editable menu canvas**. Click a drink card to change the photo, name, ingredients, description, variants and prices.
- Use Preview to inspect the full menu and product showcase. Then Publish to create an atomic published revision.
- Under Published, open stable TV URLs for Screen 1 and Screen 2. TVs poll published revisions every 30 seconds; drafts never go directly live.
- Backup, rollback and configurable screens remain available.

## Photo requirements
The main product image must show the complete cup. Both displays use CSS object-fit: contain and non-zooming motion to preserve the rim and base. Only photo assets uploaded for that exact product appear on its card.

## Hosting/security
- \`studio/cloud.js\` contains **only Supabase's public publishable key**, never any service-role secret.
- \`studio/cloud-bridge.js\` supplies owner authentication, draft upload/save, atomic publish/rollback and public read-only polling, layered on the existing approved editor.
- Authenticated writes are protected by RLS; the public can read only published menu data and public product-photo URLs.
- See \`studio/DEPLOY.md\` for live deployment and required owner actions.

## Verification
Headless Chromium simulated owner session: menu contained 23/23 products, editing a product updated the draft, preview rendered all items, publishing advanced the revision without JavaScript errors. Supabase grants/RLS checks passed via the connected project. **Actual owner signup, live image upload, live TV operation and Cloudflare Pages connection remain to be verified**.

## Both-screen owner editor (2026-11-12)
Both Screen 1 (complete visual menu) and Screen 2 (animated product showcase) remain visible together inside **Edit menu**, even when a product is selected. Click a drink in Screen 1 or use the Screen 2 drink selector. The same contextual inspector edits the selected drink. Use **Upload photo** for its Screen 1 menu card and **Upload photo for Screen 2** for an alternative advertisement shot of that SAME drink.

A single product stores all photos in `photos[]`. Screen 1 uses `primary`, Screen 2 optionally uses `showcasePrimary`, falling back to `primary`. Choosing Screen 2's photo does not replace its Screen 1 photo. New uploads save privately to Supabase; the customer TVs only change when the owner selects **Publish**. The editor previews don't turn off the Screen 2's normal rotation for published display URLs.

The responsive owner workspace displays both portrait previews beside the inspector on larger screens; narrow viewports stack them. No separate product catalog, paid service, new API, or DB migration was added. Full-screen TV presentation is unchanged.

**Verification:** GitHub code review and JavaScript syntax checks passed; simulated tests verified the two previews, both edit buttons, Screen 2 upload action, separated photo choice, and fallback. A real authenticated browser test, Cloudflare deployment, and Samsung TV validation are still pending; do not claim those are complete.

## Menu Generator: download-first 24-design library

**Edit menu** retains product names, ingredients, prices and the owner's real photos. The **Menu generator** tab shows 24 ready-to-use choices (eight distinct layout families in three styles), automatically filled with that same catalog. Owners choose a design and output size (US Letter, A4, digital portrait, landscape or square). The **Photo space** control gives larger real drink photos more area and adds pages when needed. For just one drink, use **Adjust one drink** and **Selected drink space**; full photos are contained, not cropped.

The menu generator makes downloadable artifacts. **Publishing to a TV or our website is NOT required.** Choose **Print / Save PDF** to open the native print dialog (choose *Save as PDF*), or **Download PNG/JPG**. Multi-page raster downloads arrive in a ZIP. A failure to load a product image for raster export is surfaced explicitly rather than shipping an inaccurate file.

The 24 choices are eight different compositions × three visual treatments, not 24 separate upstream GitHub downloads. See [MENU_GALLERY_SOURCES.md](MENU_GALLERY_SOURCES.md) for exact open-source sources, asset rules and third-party image-export dependencies. Only owner-uploaded photographs are used. Existing animated Screen 2, existing Supabase owner authentication, private drafts and TV publish flow are preserved.

**Verification boundary:** Node/renderer tests, local Chromium desktop/mobile UI, sample three-page Chromium PDF, and PNG ZIP packaging with a mocked capture engine passed. Real CDN capture, actual Supabase CORS, Cloudflare auto-deployment and signed-in production exports need verification after deployment; do not claim those have passed.

## Creative Studio: two owner-facing features (2026-11-26)

The owner opens **Menu Generator** or **Product Showcase**. Legacy screen assignments and published-display tabs are not shown in the new owner workspace. Existing public menu links and `?screen=` routes continue to be supported for backward compatibility. There is no new database table or owner account.

**Menu Generator:** immediately displays a selected layout filled from the existing Supabase draft. Owners tap a visible brand name, product name, ingredients or price to change the actual corresponding draft field, click a product photo to zoom/pan the **image pixels within the existing frame**, optionally open Branding to change name/logo/colors/font, browse the existing 24 template combinations, and download PDF/PNG/JPG. Existing 24 combinations are *not* 24 independent upstream menu packs.

**Product Showcase:** choose a product (ignores legacy screen category filters), existing product photograph, any of six vendored MIT Motion Lab modes, background and speed. The browser runs actual motion, not a screenshot or subtle CSS float. Download GIF via MIT gifenc or native MP4/WebM depending on browser support. A safe, edge-connected near-white pixel flood-fill tool can save an additional transparent PNG copy; it is not AI segmentation and will not work for complex backgrounds.

No AI model or paid API is called to generate normal menus/showcases. Native video support and file types are browser-dependent; running the video render consumes CPU. Tests and roadmap: `specs/0002-two-feature-creative-studio.md`, `docs/superpowers/plans/2026-11-26-creative-studio.md`. Sources and licenses: `studio/vendor/motion-lab/SOURCE.md`, `studio/vendor/gifenc/LICENSE.md`.

**Known boundaries:** this is a two-feature owner UI shell using existing menu gallery code and an actual existing motion library, not wholesale adoption of OpenTempl/Canvix. High-fidelity physical liquid pouring requires real footage/3D/video generation. Authentication, connected Supabase upload and real CORS video capture still need live post-deploy verification. Cloudflare Workers deployment is a separate step from merging the GitHub PR.
