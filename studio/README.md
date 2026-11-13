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
