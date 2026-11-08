# Deploy Seiyun Menu Studio — owner checklist

This is a static web app with **zero mandatory extra subscriptions**, using an already-configured Supabase project for data and images. The photo-first design shows the full cup on both displays. **User still must connect Cloudflare Pages and create the owner sign-in**; no public URL exists until that happens.

## Step 1 — Publish your GitHub repository on Cloudflare Pages
1. Visit https://dash.cloudflare.com/ and create/sign into a FREE Cloudflare account.
2. Workers & Pages → Create application → Pages → **Connect to Git**.
3. Authorize the GitHub repository **killbill2792/cafe-menu-generator**.
4. Select **main** as the production branch.
5. Framework: **None**; Build command: leave blank; Build output directory: **studio**.
6. Deploy. Cloudflare gives a free HTTPS address of the form \`https://YOUR-SITE.pages.dev\`. Do not add a paid domain.

## Step 2 — Configure Supabase Auth confirmation URLs
Visit https://supabase.com/dashboard/project/tfknuqbaahesuqugfaib/auth/url-configuration and set:
- **Site URL**: the exact Cloudflare Pages HTTPS address.
- **Redirect URLs**: the same exact address (and its optional trailing slash).
Do not disclose service-role keys or database passwords. The frontend contains ONLY a publishable key, protected by database RLS.

## Step 3 — Give the owner access
1. Visit your Cloudflare URL on a laptop.
2. Click **Create owner account**, enter the owner's real email/password.
3. Confirm the account through the email link (if Supabase prompts for verification).
4. Sign in on the Cloudflare page.

If registration is disabled in Supabase Auth, first invite/create the owner in your project's Authentication → Users panel. Do not use the Supabase database password as the owner password.

**After creating the owner account, disable public signups** in Supabase Auth settings or use invite-only registration to avoid unrelated users consuming the free project's storage. Existing owner login remains available.

## Step 4 — Set up the first menu
- The editor starts with a best-effort transcription of the existing 23-item Seiyun menu photograph. **Verify every name, ingredient, size and price before publishing.** No photos are automatically assigned to the wrong drink.
- Click a drink **directly on Screen 1** to change it; **Upload photo** shows the whole cup (PNG/JPG/WebP/AVIF accepted).
- Verify visually on **Preview**: every menu item visible at once on Screen 1; Screen 2 rotates only photographed products.
- Click **Publish menu**. It creates a new revision while preserving previous published data for rollback.

## Step 5 — Open the live TV links
- Go to **Published** in the owner studio.
- Click the **Complete visual menu** screen to open its live link; copy that URL to portrait TV 1.
- Click the **Animated product showcase** screen to open its live link; copy that URL to portrait TV 2.
- Other screens can be added or reassigned under **Screens**. Published screen URLs contain a public owner ID and screen ID; they never contain passwords.
- The published menu is read-only on TV. Both URLs check for new published revisions every **30 seconds**, and a temporary refresh outage keeps the last successfully loaded menu visible. Draft changes never appear before Publish.

## Validation / limitations
- Tested in headless Chromium using a simulated signed-in owner: 23/23 items, direct edit, draft save, preview, and publish. Database privileges/RLS verified against the connected Supabase project.
- Live account signup/email confirmation, real image upload to Supabase from the deployed URL, Cloudflare connection, and Samsung TV behavior **still need real-world verification**.
- Supabase product images are public by design; upload only content authorized for display.
- The online app needs network access to first load; after loading, a brief API outage preserves its last successful published snapshot. Offline boot after TV restart is not guaranteed.
- Free-tier services have limits; do not assume 24/7 uptime SLA or free unlimited bandwidth/storage.
- This app does not generate liquid-pouring videos from one still photo; current showcase uses restrained photographic motion without cropping.

## Project continuity
Read \`agent.md\` at repository root before changing the UI or backend. The older \`screen1/\` subdirectory is superseded by \`studio/\`.

## Existing live Cloudflare Workers deployment — email confirmation redirect

The owner deployed the app at **https://cafe-menu-generator.raj-techai2026.workers.dev/**. Previous examples using a `.pages.dev` domain are outdated for this deployment.

**Required Supabase Auth setting (configure manually in dashboard):**
- Project: `tfknuqbaahesuqugfaib` → Authentication → URL Configuration.
- **Site URL:** `https://cafe-menu-generator.raj-techai2026.workers.dev/`
- **Redirect URLs:** add `https://cafe-menu-generator.raj-techai2026.workers.dev/` (exact URL).
- Save. Keep **Confirm email** enabled for security. Supabase uses the Site URL as fallback when a confirmation redirect is missing or disallowed.

The code in `studio/cloud.js` now passes `options.emailRedirectTo` with the hosted URL for future signups. A GitHub push doesn't guarantee the Worker has redeployed: check Cloudflare Deployments for the commit and redeploy manually if your Worker isn't linked to GitHub.

**2026-11-07 Supabase check:** one Auth user existed and its `email_confirmed_at` field was populated. No unconfirmed users remained. No account required manual bypass or auto-confirmation. An email-confirmation link opening localhost **after** successful verification is a redirect configuration issue, not necessarily an account-confirmation failure. Existing user should sign in on the production URL.

## TV setup, printable menus and QR codes
See [TV_PRINT_QR.md](TV_PRINT_QR.md) for published screen links, Samsung browser steps, full-menu Print / Save as PDF, and owner-managed menu/Google-review QR codes. Google review URL is intentionally not prefilled: supply it through the owner's official Google Business Profile.
