# Implementation plan — source templates + cinematic hero (2026-11-26)

**Scope fixed by owner:** Continue existing app, no blank new app, no AI calls during normal use. Spec: `specs/0003-source-menu-cinematic-hero.md`.

- [ ] Verify upstream MIT template documents, license and format.
- [ ] Add genuine source-backed entries and read-only adapter to current gallery; preserve all owner products.
- [ ] Replace fake gallery mini art with actual rendered first pages, lazy images and source/filter labels.
- [ ] Add on-canvas direct manipulation with touch support: movable/resizable brand and cards, persistent per-template layout overrides, editor/export parity.
- [ ] Repack incomplete last pages without huge white space and expose an actionable compact layout control.
- [ ] Replace six tiny-image motion styles with one-drink hero scene registry and coherent animated environments; maintain same scene renderer for live preview and downloads.
- [ ] Add adjustable hero/title/price positions and sizes on preview; save and apply to exports.
- [ ] Add tests (unit, real browser desktop/mobile, image download and GIF/video); inspect screenshot and test failure logs.
- [ ] Update docs and agent.md with exact source counts, supported features, and unresolved issues.
- [ ] Merge only after green; verify Cloudflare deployment / authenticated Supabase separately; do not claim live if unreachable.
