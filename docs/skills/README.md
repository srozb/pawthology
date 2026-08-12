# Pawthology Skills

Two skills that help a future LLM quickly understand the project and extend it.
Canonical, versioned with the repo, compliant with the skill-creator anatomy (triggering frontmatter + body + bundled references).

| Skill | When it triggers | What it provides |
|---|---|---|
| [`pawthology-onboarding/`](pawthology-onboarding/SKILL.md) | adding a case / drug / species / exam / disease, tuning scoring, debugging evaluation via `--trace`, code onboarding | Orientation, golden rule, verification loop, decision tree, case-adding workflow, evaluation diagnosis, epistemic boundary |
| [`pawthology-art-pipeline/`](pawthology-art-pipeline/SKILL.md) | generating patient illustrations/art descriptions, adding images to the game, "art prompt", "image for a case" | 3-state patient model, style contract, prompt file authoring, image integration in `cases.js`/`main.js` |

## How to use

1. **Future LLM session in this repo:** when the user asks to extend Pawthology, read the corresponding `SKILL.md` first. Skills are a thin navigation/workflow layer over existing prose (`docs/ARCHITECTURE.md`, `docs/EXTENDING.md`, `docs/LLM-PIPELINE.md`, `art/prompts/*`) — they reference it via relative paths, they do not duplicate it.
2. **Relative paths** in skills are resolved from the directory of the given `SKILL.md`:
   - repo root = `../../../` (from `docs/skills/<skill>/`)
   - `docs/ARCHITECTURE.md` = `../../ARCHITECTURE.md`
   - `art/prompts/STYLE-GUIDE.md` = `../../../art/prompts/STYLE-GUIDE.md`
   - `site/data/cases.js` = `../../../site/data/cases.js`

## Skill location (repo only)

Skills live **exclusively in this repo** (`docs/skills/`). There is no copy in `~/.pi/...` — versioning with the game code guarantees consistency. To help a new LLM session find them, point the user to the path `docs/skills/pawthology-onboarding/SKILL.md` (or have them `grep`/`read` this directory). If pi ever supports auto-trigger from a repo — the skills are already in a skill-creator-compatible format (frontmatter + body + bundled references) and ready for registration without content duplication.

## Project status

The catalog grows over time, so these docs avoid hard-coded counts. For the current state, run:

- `node tools/explore.js` — list of cases (id, difficulty, diagnosis)
- `node tools/derive_levels.js` — per-level drug/procedure/surgery catalog + `minLevel` consistency
- `node tools/replay.js --check` — golden scenario suite (pass count in the summary)
- `node tools/validate_game.js .` — data consistency; `research/claims.md` is the claim ledger
- `node --test` — engine, scenario, and asset tests

Verification loop: `node tools/validate_game.js .` → `node tools/derive_levels.js --check` → `node --test` (no path!) → `node tools/replay.js --check` → `node tools/explore.js --all` → `node tools/replay.js --lang en`.
