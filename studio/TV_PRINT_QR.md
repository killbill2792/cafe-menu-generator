# Samsung TV, printable menu and QR-code guide

**Current website:** https://cafe-menu-generator.raj-techai2026.workers.dev/

## Put the menu on the TVs
1. On the owner laptop, log in, confirm menu names/prices and assign photos to drinks. Screen 2 intentionally shows only products with real assigned photos.
2. Open **Preview** and verify both portrait screens. Then **Publish menu**. Screens use a separate published version; drafts stay private.
3. Go to **Published**; open the Complete Visual Menu and Animated Product Showcase links. Each link is public and includes a `screen=` ID, `mode=published`, and the public menu owner identifier.
4. On Samsung TV 1, press Home → Internet/Web Browser (label depends on model). Open the **menu** link and bookmark it.
5. On Samsung TV 2, open the **showcase** link and bookmark it.
6. Put each browser in full screen if available and disable Sleep/Off Timer where appropriate. Test the physical portrait orientation; some Samsung consumer TVs don't rotate browser content just because the panel is mounted vertically.
7. Check both screens after publishing changes. They poll Supabase every ~30 seconds and keep the last known good screen if online refresh fails.

**Do not put the owner dashboard URL or credentials on a public café TV.** Use only published screen links. For some older Samsung models, a connected laptop/mini-PC or dedicated signage player may be needed to keep a browser and portrait content running unattended. TV model-specific support and all-day uptime require onsite testing.

## Print the complete menu / save PDF
1. Owner dashboard → **Screens** or **Published**.
2. Choose **Print draft / Save as PDF** for your current working menu, or **Print published menu** for the version customers see.
3. The browser opens a print-friendly, category-grouped full menu. Select **Save as PDF** as the printer destination, or choose a physical printer.
4. All enabled products, ingredients, sizes and prices are included; photo areas display the actual uploaded product photo when assigned. More products can create more A4 pages; items are kept together across page breaks.

## Generate menu and Google review QR codes
1. Owner dashboard → **Screens** → **Menu PDF & QR codes**.
2. **Scan the full menu:** Download the PNG QR to a mobile-friendly **published** catalog. It does not expose drafts or owner editor controls. The code becomes useful after the first Publish.
3. **Google reviews:** In your business's official Google Business Profile on a computer, select **Read Reviews → Get more reviews → Copy link**. Paste that exact Google review-request link into the dashboard. Don't guess it from the business name.
4. Download **Review QR PNG**, or select **Print QR signs** to print both. Print the full menu also includes the two QR blocks when set.
5. Save the review URL in draft; Publish when you want the customer-facing mobile menu's Google review link updated.

Source: https://support.google.com/business/answer/16816815?hl=en
Google prohibits incentivized or misleading reviews; do not offer discounts or rewards for posting reviews.

## Verified vs pending
- Locally tested: owner QR controls, valid/invalid review link handling, print preview with all 23 reference products, PDF output of three A4 pages without clipped ingredients, QR PNG download flow (QR generation library stub in offline test), published mobile catalog without login, browser JS errors none.
- Pending: real Cloudflare deploy of this GitHub feature, independently scan a QR built by the CDN-delivered library on the deployed site, verify printed product images and Samsung TV behavior from inside the café.
- No app auth or Supabase tables were modified for these features. QRCode.js is MIT-licensed, pinned to v1.0.0 in the frontend.
