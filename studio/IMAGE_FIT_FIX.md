# Full-drink photo display — implemented

Owner requirement (already approved): every Screen 1 product photo must show the whole cup, with prices, bold title, sizes and ingredients retained; Screen 2 remains full-drink showcase. No layout redesign or new upload is required.

Root cause: the CSS grid image item was taller than the `.pf-photo` frame and `overflow:hidden` clipped the drink, despite `object-fit:contain`. Reproduced in Chromium with the supplied 1024×1536 Seiyun cup: image 248×370 px inside a 248×190 px frame. After `position:absolute; inset:0`, both are 248×190 px and the full cup is visible.

Fix: `studio/styles.css` commit `9b0f9bd9b11e59f06a44c31f31b078c90bbfd43d` updates the final Screen 1 image rule for TV and preview. No backend or product data changes.

Pending: confirm Cloudflare Workers serves the new CSS, hard-refresh browser, and verify the uploaded Seiyun Coffee photo on the real studio and TV. The entire 23-product layout still limits how physically large each cup can appear; changing that requires separate design approval.
