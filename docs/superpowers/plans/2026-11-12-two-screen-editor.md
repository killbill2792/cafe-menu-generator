# Two-screen Owner Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement task-by-task. Checkboxes track completion.

**Goal:** Keep Screen 1 and Screen 2 visually present and separately image-editable inside the Seiyun owner Studio.
**Architecture:** Continue using the single source-of-truth product draft and existing renderers. Add simultaneous preview containers, per-product optional showcase photo index, and dedicated upload buttons; do not modify public TV visual styles.
**Tech Stack:** Plain HTML/CSS/JavaScript, Supabase Auth/Storage/Postgres JSON.
**Spec:** `docs/superpowers/specs/2026-11-12-two-screen-editor-design.md`

## Global constraints
No new service, paid dependency, backend migration, arbitrary image positioning, or change to live TV layout. Preserve image upload fixes, all photo security policies, and owner publishing approval.

## Review focus
1. Screen 2 preview with no photo should remain visible with an action to upload.
2. Selecting Screen 1 item must not remove either screen.
3. Uploading ad photo must not replace Screen 1's menu photo.
4. Switch between photographed and unphotographed products, preserving chosen ad photo.
5. Responsive MacBook/small laptop layout must show both previews without horizontal clipping.

### Task 1 — Persistent previews and selection
**Files:** `studio/app.js`, `studio/styles.css`.
- [ ] Add a failing test for two portrait preview containers on the Edit menu page.
- [ ] Implement both previews and selection to the existing contextual product editor.
- [ ] Keep refresh logic updating both previews and add responsive layout.
- [ ] Run browser test for selection and no unexpected disappearance.
- [ ] Commit.

### Task 2 — Independent ad photo selection
**Files:** `studio/app.js`, `studio/cloud-bridge.js`.
- [ ] Add a failing test: two uploaded photos, Screen 1 uses primary, Screen 2 uses optional showcasePrimary; fallback without it.
- [ ] Use `showcasePrimary` only in Screen 2 rendering.
- [ ] Give each screen its own upload button; add Screen 2 image selector in shared inspector; persist through existing draft storage.
- [ ] Browser test both assignments and draft persistence mock; verify no changes to price/content.
- [ ] Commit.

### Task 3 — End-to-end regression and handoff
**Files:** `studio/README.md`, `agent.md`.
- [ ] Test menu 23-item fit, Screen 2 photo-first view, empty state, two-screen edit workflow, responsive.
- [ ] Verify new commits in `main` and check for a Cloudflare deployment; never assume push == live.
- [ ] Update README and handoff with approved UX, rollout, and unresolved device/browser verification.
- [ ] Commit.
