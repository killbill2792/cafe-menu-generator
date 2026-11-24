# Menu Generator — reviewed design sources and attribution

The 24 launch choices are **eight distinct page compositions × three visual treatments**. They are NOT 24 separately imported GitHub repositories. They use original Seiyun code for a normalized product renderer and **adapt familiar layout patterns** found in these open-source menu projects:

| Source | Source URL | License claim | How it informed the gallery |
|---|---|---|---|
| Restaurant Menu Pages | https://github.com/aymalkhalid/restaurant-menu-pages | MIT in README; no standalone root LICENSE was found during review | photo-left/photo-right item rows, editorial lead patterns |
| Caresdev Restaurant Menu | https://github.com/caresdev/restaurant-menu | MIT in README | auto-filled, data-driven menu cards and compact compositions |
| Themefisher Restaurant Bootstrap | https://github.com/themefisher/restaurant-bootstrap | MIT for code; demo images explicitly excluded | gallery grid and classic typographic list |
| Colorlib Tavola | https://github.com/ColorlibHQ/bootstrap-templates/tree/main/tavola | MIT for code | signature feature + list composition |

**No third-party sample photos are shipped or referenced.** Each item loads only the owner's attached product photo from the authenticated product catalog. Missing photos appear as labeled placeholders. We did not bundle vendor scripts or copy a template's complete HTML page: outside checkout, web navigation, photo collections and Bootstrap JS do not belong in a printable artifact.

Third-party runtime dependencies for optional raster export:
- html2canvas 1.4.1 (MIT): https://github.com/niklasvh/html2canvas
- JSZip 3.10.1 (MIT): https://github.com/Stuk/jszip

Both versions are pinned in `studio/index.html`; image-export unavailability produces an explicit error with a usable Print / Save PDF alternative. Font licensing remains governed by the Studio's existing Fraunces/DM Sans font delivery, not the third-party template assets.

## Expanding the library

Add a reviewed layout composition in `FAMILY`, CSS in `studio/menu-gallery.css`, and a source record with verified code/asset permissions. `REGISTRY` combines each composition with style looks and has no hard-coded design-count cap. This is **not** an arbitrary GitHub URL execution feature. Never execute untrusted repository scripts in an owner's browser.

## Test evidence and exclusions

- Node tests: 24 unique designs, eight compositions, all 23 products counted exactly once per chosen output, URL/HTML escaping, missing photo placeholders, per-item photo-space bounds, five export sizes, disabled products, zero-dollar prices.
- 360 remote-source scenario checks across 24 layouts × five sizes × three global photo prominence levels; all retained 23 products.
- Browser harness: template switch, global/per-drink settings, page navigation, no JS errors, mobile 390px no horizontal overflow; screenshots generated.
- Chromium PDF artifact: three US Letter pages, all 23 products, real Seiyun Coffee photo visible after eager image load adjustment.
- Browser export actions: printable popup includes all 23 products. Multi-page PNG ZIP contains three valid PNG files with **mocked html2canvas capture** and real JSZip. The actual CDN html2canvas rendering and Supabase Storage CORS behavior have not been verified on the deployed website.
- Cloudflare Workers deployment is separate from a successful GitHub merge. A real signed-in café account must verify downloading the original 2.2MB PNG and saved draft persistence.
