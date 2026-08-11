## 1. Cleanup Dev Artifacts (DONE)
- [x] Remove local paths and dev machine hostnames from the tracked tree.
- [x] Git commit the cleanup.

## 2. Docs Translation to English (DONE)
- [x] Translate `README.md`
- [x] Translate `docs/ARCHITECTURE.md`
- [x] Translate `docs/EXTENDING.md`
- [x] Translate `docs/LLM-PIPELINE.md`
- [x] Translate `research/brief.md`
- [x] Translate `research/claims.md`
- [x] Translate `research/data-model.md`
- [x] Translate `research/assets.md`
- [x] Translate `site/index.html` metadata.
- [x] Translate `docs/skills/*.md` files (README + 2 SKILL.md + 2 references).

## 3. Tooling Refactor (DONE)
- [x] Rewrite `tools/validate_game.py` to `tools/validate_game.js`
- [x] Rename `.mjs` scripts to `.js` in `tools/`
- [x] Update `package.json` scripts + references in docs (README, ARCHITECTURE, EXTENDING, skills).
- [x] Translate CLI tool output + comments to English (explore.js, derive_levels.js, replay.js, validate_game.js, scaffold_case.py).
- [x] Restore `tools/_dump.mjs` helper (used by scaffold_case.py).

## 4. Narrative Rewrite (Cases) (DONE - first pass)
- [x] Fixed English grammar errors + awkward literal translations in `site/data/cases.js` examResults (introEn/findingsEn/closingEn): "priciered"->"ran up the bill", "fireworks"->"quite a production", "reasonably well-looking"->"otherwise looks well", "un-dewormed"->"never dewormed", "lets you examine"->"lets you handle him", etc.
- [x] Fixed Polish errors: "łapo o mało trzyma"->"ledwo go trzyma", "błędne śluzówki"->"blade śluzówki", "Wymagała powtórną wizytę"->"Wymagana ponowna wizyta".
- [x] Smoothed repetitive "Wizyta X." / "X's visit." openings across the first 6 cases (PL + EN, short + long narrative) — varied, natural leads now.
- [ ] Make a dedicated Git commit for this rewrite.
- [ ] (Optional, future) Full literary rewrite of PL+EN narratives — deeper stylistic pass can follow.

## 5. Medical Verification (DONE)
- [x] Diagnosis logic: explore --all + replay --check pass (10 cases, 42 golden scenarios, invariants hold).
- [x] Data integrity: validate_game.js OK (0 warnings), derive_levels OK.
- [x] Drug dosing: all 19 drugs reviewed against MVM/Plumb's — clinically sound.
- [x] Species toxicity: bidirectional, correct (rabbit: beta-lactams; cat: acetaminophen; dog+cat: ibuprofen).
- [x] Source audit: all 19 drugs llm-audited (imidocarb upgraded draft->audited).
