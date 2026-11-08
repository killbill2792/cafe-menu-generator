# Seiyun Visual Café Menu Studio

A photo-first digital menu manager for **Seiyun Yemeni Coffee**. Two portrait display presets are configured by default, but the owner can add products and display configurations as needed.

- **Screen 1:** entire menu visible instantly, with the complete drink photograph, bold name, sizes, ingredients and price.
- **Screen 2:** full-drink photographic showcase with a horizontal product thumbnail rail and automatic rotation.
- **Owner Studio:** click a card on the actual menu to edit and upload photos; **Preview → Publish** updates both live display links.

## Installation and first-owner setup

Read **[studio/DEPLOY.md](studio/DEPLOY.md)**. This static site is intended for free Cloudflare Pages hosting with output directory **studio**; it uses an already-configured Supabase project and no paid AI service. Owner signup/sign-in and production-domain hosting require setup.

**Database migration:** [supabase/migrations/20261107_studio_online.sql](supabase/migrations/20261107_studio_online.sql). It has already been applied to the connected \`cafe-menu-generator\` Supabase project; do **not** apply a second time there. It is tracked for future environments.

**Project decisions and handoff:** [agent.md](agent.md).  
**Security and implementation design:** [specs/0002-secure-online-publishing.md](specs/0002-secure-online-publishing.md).

## Limits

- The 23 starter menu items were transcribed from a photo; the owner must verify all prices, ingredients and names before publishing.
- No product photo is silently assigned to a different named drink; owner uploads the correct pictures.
- Product photos are publicly downloadable by design. Draft menu data is owner-only via Supabase RLS.
- External font/CDN and data services require internet on initial load. Always-on Samsung TV playback must be tested on the actual model.
- A no-extra-fee free tier does not guarantee a commercial uptime SLA. Check project usage.
