# Backlog

Found while building agent-swap-web (2026-11-05). Not fixed in the template yet.

| # | Problem | Evidence | Fix idea |
|---|---|---|---|
| 1 | `public/llms.txt` still describes the original site (CLI Manager / Solhun) and is not marked `TODO(create-opensource)` | `head -3 public/llms.txt` → "# CLI Manager (Solhun)" | Generate it from `site.config.ts` (route handler like `robots.ts`) or add a TODO marker |
| 4 | Widget label is Korean ("피드백") on English sites — feedback-kit-web has no label/locale prop | `grep 피드백 node_modules/@solhun/feedback-kit-web/dist/index.js` | Belongs to woorichicken/feedback-kit: add a `labels`/`locale` prop |
