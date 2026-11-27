# Menu Generator — source provenance, honest design counts, owner safeguards

## What owners actually browse

The registry contains **47 selectable combinations**, but the visual gallery shows **31 independently different compositions**, not 47 separate source templates. The 31 are:

- **8 original Seiyun families** with optional Warm, Dark and Clean treatment chips (8 × 3 = 24 combinations). They were authored by Seiyun; the four external projects below informed design patterns, not their complete HTML pages.
- **21 actual MIT OpenTempl source documents**, taken from 12 source collections, licensed geometry retained with names, page dimensions, font properties and placement.
- **2 actual MIT Canvix café menu documents**, the complete-menu originals `artisan-menu` and `cafe-menu`, preserving their text/shape/line geometry.

This corrects the earlier misleading phrase "24 imported templates": there never were 24 imported vendor designs. The long-running "36 imported" claim is **not supported by current repository history**. Counts must not silently change to appeal to marketing.

The **Canvix count of 366** refers to **122 original designs and 244 computed style/typography variants across social, slides, document, print, logo and other categories**, not 366 cafés or menus. The current two native café print designs are imported, while food/social ads are not mislabeled as complete menus. The **OpenTempl 337** is a whole-editor all-categories number; only reviewed café/menu/price-list source records enter the Menu Generator.

## Original Seiyun inspirations — not copied source pages

| Project | URL | Code license/status | Influence |
| --- | --- | --- | --- |
| Restaurant Menu Pages | https://github.com/aymalkhalid/restaurant-menu-pages | README claims MIT; standalone root LICENSE not confirmed | Photo-left, photo-right, editorial |
| Caresdev Restaurant Menu | https://github.com/caresdev/restaurant-menu | MIT described | Data-driven compact/cards |
| Themefisher Restaurant Bootstrap | https://github.com/themefisher/restaurant-bootstrap | MIT code; **demo photos excluded** | Gallery, classic list |
| Colorlib Tavola | https://github.com/ColorlibHQ/bootstrap-templates/tree/main/tavola | MIT code; **demo assets excluded** | Feature + list |

## Actual imported template source code and licenses

| Source | Verified original data | Source path in this repository | Legal notice |
| --- | --- | --- | --- |
| OpenTempl | https://github.com/noah-thing/opentempl | `studio/vendor/opentempl/curated-menu.js` | `studio/vendor/opentempl/LICENSE`, `SOURCE.md` |
| Canvix | https://github.com/mir-ashiq/canvix | `studio/vendor/canvix/curated-menu.js` | `studio/vendor/canvix/LICENSE`, `SOURCE.md` |
| Daybrush Moveable | https://github.com/daybrush/moveable | `studio/vendor/moveable/moveable.min.js` | `studio/vendor/moveable/LICENSE`, `SOURCE.md` |

Only selected source geometries/properties are imported; no vendor account or database, untrusted source scripts, sample-product logos/stock photographs or arbitrary asset references are executed in the owner browser.

Typography for these native layouts is restored with an explicit allowlist of Google Fonts family names in `studio/template-fonts.js`, never by transmitting business data. Fallback fonts are used offline if that stylesheet is unavailable.

## Data and exports

Supabase's existing owner-private product catalog, names, ingredient descriptions, prices, brand and uploaded photo URLs remain the only source for content. Design-specific positions use `draft.menuArtwork.layoutOverrides[templateId]` and touch/mouse coordinates corrected for display scaling; editing a layout is distinct from editing a product price. The source renderer omits template demo dishes and only binds allowed owner media. A genuine multi-item source design repeats on overflow pages instead of silently changing to an unrelated generic style. Single-product feature boards can continue as compact remainder pages.

Print/PDF is browser Print → Save as PDF. PNG/JPG are browser downloads, multi-page ZIP where needed. The app is an **export-first artifact generator**, not a TV-display service.

## Verification and release limits

CI: `.github/workflows/artwork-redesign-tests.yml` runs source binding, safety, pagination and layout unit tests; end-to-end Chromium browser checks on desktop and simulated touch 390px; captures screenshots; checks GIF89a and encoded MP4/WebM, full-resolution PNG bytes, print window, resize persistence and no mobile horizontal overflow. Test images are synthetic where indicated; don't equate them with actual owner Storage authentication.

**Not verified by those tests**: real signed-in Supabase uploads and CORS on the Cloudflare deployment; iPhone Safari-native physical touch; production publish; photorealistic liquid pouring from a single photograph; pixel-perfect preview/video equivalence in all browsers. They must be reported distinctly and checked before production completion claims.
