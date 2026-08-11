# Pawthology — Asset ledger (provenance)

> Every asset in `site/` is documented here with its license and modifications.
> Per the skill policy: no asset with unknown rights enters `site/`.

| Path (deploy) | Provenance | Creator | License | Modifications | Generation model/prompt |
|------------------|-------------|--------|---------|-------------|------------------------|
| site/data/icons.js | Original inline SVG (own work, not copied) | worker (subagent) | CC0 / Public Domain | none (pure line-art, stroke-based) | none (hand-written SVG) |
| site/img/cases/*.png (15 files) | Patient illustrations — 5 patients × 3 states (intake/treated/deteriorating). Names map 1:1 to `filename` in frontmatter of `art/prompts/patients/*/*.md`. | owner (srozb) using an LLM model | Repo owner's rights (owner-generated) | none (generated directly from prompts, no post-processing) | Prompts in `art/prompts/patients/<patient>/{01-intake,02-treated,03-deteriorating}.md`; style master in `art/prompts/STYLE-GUIDE.md`. Dimensions 1536×1152 (4:3) nominally — some generated as 2816×1536 (panorama, kept as-is). |

## Notes
- The 15 patient illustrations (intake/treated/deteriorating) replace SVG icons in: the case selection card (thumbnail), the intake phase (hero), the outcome phase (treated/deteriorated). SVG icons remain as `onerror` fallback (graceful degradation) and in the toolbar/stepper/other UI.
- Patient states (standing/lying/worse) are implemented via illustrations (`imageTreated`/`imageDeteriorating` in `cases.js`), not CSS — the contract is in `docs/skills/pawthology-art-pipeline/SKILL.md`.
- Any future assets (new patients, icons, visualizations) must be documented here with license and modifications before entering `site/`.
- The test `tests/assets.test.js` verifies: every `cases[].image*` points to an existing file in `site/img/cases/`, no orphaned PNGs, names follow the convention `<patient>-0<state>-(intake|treated|deteriorating).png`.
