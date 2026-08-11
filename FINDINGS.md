# Pawthology Audit Findings & TODO

This document tracks identified issues and areas for improvement before the initial public release of Pawthology.

## 1. Documentation Language (English Translation Needed) — DONE
The repository is now fully in English. Translated files:
- [x] `README.md`
- [x] `docs/ARCHITECTURE.md`
- [x] `docs/EXTENDING.md`
- [x] `docs/LLM-PIPELINE.md`
- [x] `research/brief.md`
- [x] `research/claims.md`
- [x] `research/data-model.md`
- [x] `research/assets.md`
- [x] `site/index.html` - HTML `lang` is now `en` and meta description is in English.
- [x] `docs/skills/*.md` (README + 2 SKILL.md + 2 references) — English, with broken `.mjs`/`validate_game.py` references fixed to `.js`/`validate_game.js`.

Note: Polish diacritics remain only inside code blocks that document the bilingual data schema (`labelPl`, `tooltipPl`, `frequencyPl` field values) and in game data files themselves (`site/data/*.js`) — these are intentional and represent the Polish UI strings the game actually renders.

## 2. Cleanup of Unnecessary Elements — DONE
There are traces of the development process that should not be included in the public release:
- [x] **Development machine references**: No hardcoded local paths or machine hostnames remain in the tracked tree.
- [x] **LLM Agent Skills Directory**: DECISION — keep public. The `docs/skills/` directory is now translated to English and serves as onboarding for external LLM/content contributors. Public.
- [x] **Internal Scripts**: DECISION — keep public. The `research/` directory (brief, claims, data-model, assets) is translated to English and provides valuable design provenance for contributors. Public.

## 3. Medical Accuracy Verification — DONE
The data model is heavily reliant on the Merck Veterinary Manual and Plumb's. Status:
- [x] **Diagnosis Logic**: `tools/explore.js --all` and `tools/replay.js --check` pass — all 10 cases winnable, no dead-ends, grading invariants (good≥fair, toxic=critical, fair≠critical) hold for every case.
- [x] **Data integrity**: `tools/validate_game.js .` OK (**0 warnings**); `tools/derive_levels.js --check` OK (24 entities, 10 winnable cases, progressive-unlock winnability holds).
- [x] **Drug Dosing**: reviewed against Merck Vet Manual / Plumb's — all 19 drugs' `mgPerKg` bands are clinically sound. Key points verified: enrofloxacin cat 5 mg/kg strict (retinotoxic above 5); meloxicam cat 0.05–0.1 short-course (nephrotoxic risk); carprofen cat 2 mg/kg single dose (cats highly sensitive); fenbendazole 45–55 band = ±10% safety window around the 50 mg/kg source value (so the dose slider is hittable).
- [x] **Species Toxicity**: bidirectional and correct — amoxicillin-clavulanate + cefalexin toxic in rabbit (beta-lactam enterotoxemia); acetaminophen toxic in cat (methemoglobinemia, glucuronidation deficit); ibuprofen toxic in dog + cat (gastric ulcers, renal failure). Validator enforces `species.toxicDrugs` ↔ `drug.speciesToxic` symmetry.
- [x] **Source audit**: all 19 drugs now `reviewStatus: "llm-audited"` (imidocarb upgraded from `draft` after confirming 5–6 mg/kg IM/SC, single dose, repeat in 2 weeks for canine babesiosis). 0 draft drugs remain.

## 4. Stylistic Layer & Storytelling (English) — first pass DONE
While the Polish text is engaging, the English translations in `site/data/cases.js` contained structural errors, clunky phrasings, and some non-existent words. First pass fixed the glaring errors flagged below; a deeper literary rewrite can follow.
- [x] **Vocabulary & Grammar Errors**: Fixed "priciered" (not a word) -> "ran up the bill"; fixed "reasonably well-looking" -> "otherwise looks well"; fixed "un-dewormed" -> "never dewormed"; fixed "lets you examine" -> "lets you handle him".
- [x] **Flow and Immersion**: Rewrote "Only after a quiet word and gently steadying his head does he let you look" -> "He only lets you look once you've spoken quietly and steadied his head with a gentle hand"; "Blood draws in cats can be fireworks" -> "Drawing blood from a cat can be quite a production"; "it would have no material" -> "there'd be nothing to sample".
- [x] **Polish errors fixed in parallel**: "łapo o mało trzyma" -> "ledwo go trzyma"; "błędne śluzówki" -> "blade śluzówki"; "Wymagała powtórną wizytę" -> "Wymagana ponowna wizyta".
- [ ] (Optional, future) Full literary rewrite of PL + EN narratives — light, engaging, consistent medical terminology.

## 5. Minor Glitches & Technical Inconsistencies — DONE
- [x] **File Extensions**: Standardized to `.js` in `tools/` (`explore.js`, `derive_levels.js`, `replay.js`, `validate_game.js`). `scaffold_case.py` stays Python (it wraps Node data loading via `_dump.mjs`).
- [x] **Tech Stack Fragmentation**: `tools/validate_game.js` (Node) replaces the Python validator. All CLI tools now emit English output + comments. `scaffold_case.py` kept in Python (thin wrapper) but translated to English.
- [x] **Broken references fixed**: all `.mjs` -> `.js` and `validate_game.py` -> `validate_game.js` references updated across docs + package.json + README.
- [x] Restored `tools/_dump.mjs` helper (used by `scaffold_case.py` to load game data).
- [ ] **i18n Duplication**: (deferred) Consider whether having both `Pl` and `En` keys in the data files is scalable long-term, or if the data layer should be refactored to separate translation files. Not a blocker for public release.
