---
name: pawthology-onboarding
description: Onboarding and clinical content expansion for the Pawthology game — a veterinary clinic simulator for a 10-year-old and adults/students. ALWAYS use when the user asks to: add a case/drug/species/exam/disease to Pawthology, tune scoring, explain why a case scores a certain way, fix a failing golden scenario, onboard to the Pawthology code. Triggers: "pawthology", "add case/drug/species/exam/disease", "tune scoring", "replay --trace", "golden scenario", "validate_game", "node --test", "claims.md", "headless test Pawthology". Load this skill whenever the word Pawthology appears or a request to extend the veterinary game is made — even without the word "skill".
---

# Pawthology — onboarding and clinical content expansion

This skill is a thin navigation/workflow layer over existing prose in the repo. It does not duplicate schemas — it points you to where to read them. Read this file, then load referenced/cited files only when you need detail.

## The project in 30 seconds

- **What it is:** an educational clinical decision simulator for small animal veterinary practice. The player weighs the patient, selects exams, makes a diagnosis, calculates an mg/kg dose, and treats. Real pharmacology (real drug names, real mg/kg, species toxicity, AMR reasoning) — no "dumbing down for kids"; the interface carries navigation, the learning stays real.
- **Audience:** a 10-year-old girl (does not like being patronized) + adults/veterinary students.
- **Stack:** vanilla HTML/CSS/JS, ESM (`"type":"module"`), no build step, no runtime network, no analytics. Serve locally: `python3 -m http.server 8000` → `http://localhost:8000/site/`.
- **Central pillar:** headless testability. Pure engine (`site/js/game.js`) + runner (`tools/replay.js`) + golden suite (`scenarios/*.json`) + validator (`tools/validate_game.js`). An LLM can run the logic without a browser and diagnose scoring.

## The golden rule (and why)

> **Data is the product; code is a thin evaluation/rendering layer. New content = a new entry in a table in `site/data/`. Code does not change when extending.**

This is the most important project principle and the reason LLM-driven growth is safe: adding a drug/case/species is editing data (`site/data/*.js`) + a claim in `research/claims.md` + a golden scenario — **not** editing `game.js`. The engine receives `CONTENT` as an argument (rule S7), so tests and the runner inject the same data as the UI — one source of truth for the rules. If you started writing per-case logic in code, you would lose headless testability and introduce drift between runtime and tests.

## First 3 files to read (if new to the project)

1. `../../ARCHITECTURE.md` — directory layout, separation of concerns (data / engine / render / tools), principles (S7, etc.).
2. `../../EXTENDING.md` — schemas and steps for every entity (drug, species, exam, disease, case, scoring).
3. `../../research/data-model.md` — historical F1 context (note: some field names have changed; the current schema is in `EXTENDING.md`).

## Verification loop — after EVERY data change

This is non-negotiable. Headless testability is a pillar; a change without verification is a regression waiting to happen.

```bash
node tools/validate_game.js .          # data consistency + claim traceability + bidirectional toxicity + kind correctness + minLevel winnability
node tools/derive_levels.js --check     # minLevel consistency in data vs derived from case dependencies (guard)
node --test                             # engine logic + scenarios.test.js (auto-reads all of scenarios/) + assets.test.js — NOTE: no path!
node tools/replay.js --check            # full golden suite — exit≠0 on fail
node tools/explore.js --all             # scoring invariants for all cases (good≥bad, toxic=critical, good≠critical)
node tools/replay.js --lang en          # translation completeness (if you touched UI keys)
```

All six must be green. Why each one:
- **validate_game.js** — catches data errors (dangling references, missing claimIds/sources/reviewStatus, inconsistent toxicity, min>max, duplicate IDs, wrong kind in expectedProcedures/Surgeries, **winnability: a drug/procedure from case dependencies has minLevel > difficulty**) **before** you run JS.
- **node --test** — rule logic (predicates) + scenarios.test.js + assets.test.js (graphics exist).
- **replay --check** — the golden suite (executable behavior specification) still passes.
- **derive_levels --check** — that the `minLevel` stored in data matches the derived level from case dependencies (no overly hidden drugs/procedures).
- **explore --all** — scoring invariants per case (catches bugs like "a properly treated patient deteriorates" without playing in the UI).
- **--lang en** — that you did not leave a hole in i18n.

Details and how to read the output: `references/verify-and-diagnose.md`.

## What do you want to add? (decision tree)

| Task | Data file | Full recipe |
|---|---|---|
| New drug | `site/data/drugs.js` | `../../EXTENDING.md` §"Add a new drug" |
| New species | `site/data/species.js` | `../../EXTENDING.md` §"Add a new species" |
| New exam | `site/data/exams.js` | `../../EXTENDING.md` §"Add a new exam" |
| New disease | `site/data/diseases.js` | `../../EXTENDING.md` §"Add a new disease" |
| New case | `site/data/cases.js` | `../../EXTENDING.md` §"Add a new case" + `references/case-authoring-template.md` (worked example) |
| New procedure / surgery | `site/data/procedures.js` | `../../EXTENDING.md` §"Add a procedure / surgery" |
| New recommendation | `site/data/procedures.js` | `../../EXTENDING.md` §"Add a recommendation" |
| New drug group | `site/data/drugs.js` (`drugGroups`) | `../../EXTENDING.md` §"Add a drug group" |
| Graphics | `site/img/` + `art/prompts/` | `../../EXTENDING.md` §"Add graphics" + `../pawthology-art-pipeline/SKILL.md` |
| Glossary term | `site/data/glossary.js` | `../../EXTENDING.md` §"Add a glossary term" |
| Scoring tuning | `site/data/rubrics.js` | `../../EXTENDING.md` §"Tune scoring" |
| New scoring rule | `game.js` (predicate) + `rubrics.js` (delta) + `claims.md` | `../../LLM-PIPELINE.md` (rare — requires a code change) |

Golden rule reminder: only "new scoring rule" touches `game.js`. Everything else is data. EXTENDING.md is the **canonical living schema** (updated); `research/data-model.md` is the historical F1 document.

## Adding a case — full workflow (most common task)

A case is a rich entry (signal, history, symptoms, differential diagnosis, per-case exam results). This is the canonical form of extension.

**Quick start:** `python3 tools/scaffold_case.py --new --id case-<id> --species <id> --disease <id> --name <Name> --weight <kg> --diff <1-3>` creates a skeleton (art prompts + scenario stubs + `C-CASE-NN` suggestion + checklist). Then fill in the data following the steps below, and finally run `python3 tools/scaffold_case.py --check <caseId>` to verify completeness.

1. **Define the patient and presentation** — species (must exist in `species.js`), weight (within `species.weightRangeKg`), signal, history, symptoms (PL+EN). Write narratively (story beat → concrete clinical clues), because this teaches reading comprehension.
2. **Choose a diagnosis** — `trueDiagnosis` must exist in `diseases.js`. `diagnosisOptions` (4–5) must all exist in `diseases.js`. Diagnosis = choice from differentials (not free-text — cannot be reliably scored).
3. **Define exam results** — `examResults`: keys must exist in `exams.js`. Each `{ introPl, findingsPl, closingPl }` (3 paragraphs, +*En) — the old single-sentence `textPl` still works as a fallback. `flags: { infection, redundant }` are **descriptive metadata** (UI/comment), NOT engine inputs — R-ABX-* is driven by `disease.bacterialInfection`; R-EXAM-REDUNDANT is driven by the exam's membership in `{required,supportive,optional}` in `disease`.
4. **Add a claim** — a `C-CASE-*` row in `research/claims.md` with `reviewStatus: "draft"`.
5. **Link claims** — `claimIds: ["C-CASE-XX"]` in the case entry.
6. **Run the verification loop** — 5 commands (section above). validate_game.js catches dangling references immediately.
6b. **Run the case emulator** — `node tools/explore.js <caseId> --trace`. This synthesizes the canonical good treatment from the data and shows whether invariants hold. If `explore` reports a violation (e.g. the good path gives deteriorating) — you have a bug in the case data (wrong groupId, missing expectedProcedures, one-sided toxicity). Fix it BEFORE writing scenarios.
7. **Write golden scenarios** — at least one "good" (recovered) + optionally error scenarios (toxic, wrong dose, irrational antibiotic). **Always run `--trace` first** to learn the actual outcome, then set `expected`. See `references/case-authoring-template.md` — a full worked example (case + claim + 2 scenarios + verification).
8. **Source audit** (if new pharmacological knowledge) — see "Epistemic boundary" section below.

## Diagnosing scoring: `explore` + `replay --trace`

Key LLM tools. **Start with `explore`** (no need to write JSON):

```bash
node tools/explore.js case-otitis-dog            # ANSWER KEY + 5 auto-paths
node tools/explore.js case-otitis-dog --trace    # + full verdict trace
node tools/explore.js case-otitis-dog --only toxic  # only one path: good|toxic|noexam|notreat|wrongdx
node tools/explore.js --all                       # invariants for all cases (CI)
```

`explore` synthesizes from case data: required exams, true diagnosis, drug from recommendedGroups at mid-band dose, required procedures/surgeries, recommendations — and compares with 4 bad variants (toxic, no exams, no treatment, wrong diagnosis). It shows what the engine considers correct and whether invariants hold (good≥bad, toxic=critical, good≠critical). This is the fastest way to verify scoring consistency.

When you want to test SPECIFIC player decisions (not auto-synthesized), you write a scenario and run:

```bash
node tools/replay.js scenarios/<file>.json --trace
```

The trace shows per verdict: `stage · rule · delta · claimId · detail`. You read it and decide where the fault lies:

| Symptom in the trace | Where to fix | Why |
|---|---|---|
| Rule fires but the delta is wrong | `site/data/rubrics.js` (data) | Tuning = data, not logic |
| Rule does NOT fire but should | `site/js/game.js` (predicate) — rare | Missing predicate / wrong condition |
| Rule fires on wrong data | `site/data/*.js` (entity data) | E.g. wrong groupId, missing speciesToxic |
| Verdict has wrong claimId | `research/claims.md` + `rubricConfig.claimId` | Traceability to source |
| Dose scored wrong | check `dosing[species].mgPerKg` + `weightKg` in the case | Engine computes mg/kg×kg vs band |

Details and trace anatomy: `references/verify-and-diagnose.md`.

## Epistemic boundary (decision D3)

> **The LLM is not the source — it is the author and auditor. The source of record remains authorities (Merck Veterinary Manual, EMA, Plumb's).**

- Every new pharmacological fact starts as `reviewStatus: "draft"`. After verification in an external authoritative source → `"llm-audited"` + `reviewDate` (ISO) + a real URL in `research/claims.md`.
- **Never fabricate a URL or reviewDate.** If you have not confirmed with a source — leave it as `draft`.
- Full loop (candidate generation → self-verification → tests → trace → source audit → merge): `../../LLM-PIPELINE.md`.
- Merck Vet Manual renders via JS → use `scrapling_stealthy_fetch`, not plain curl.
- Verification priority: species toxicity > antibiotics (AMR) > NSAIDs/opioids (narrow margins) > antiparasitics > the rest.

## Pitfalls (from audit post-mortems)

- **`node --test` without a path.** `node --test tests/` does NOT work in ESM (MODULE_NOT_FOUND). Run just `node --test`.
- **Bidirectional toxicity.** `drug.speciesToxic: ["cat"]` AND the drug listed in `species.toxicDrugs`. The validator flags one-sided entries. Always both sides.
- **`claimIds` must resolve.** Every `claimIds` in data must point to an existing row in `claims.md`; every `rubricConfig[*].claimId` too. The validator catches this.
- **Patient weight is not decoration.** With a `dosingType: "systemic"` drug, a missing `weightKg` (or 0) → `R-DOSE-INVALID`, not "recovered". The "eyeball the dose" myth must be enforced.
- **Diagnosis = choice from differentials.** Do not try to score free-text — it cannot be reliably graded. Openness remains in exams (any exam) and treatment (every drug/dose, every procedure, every recommendation).
- **kind in case fields.** `expectedProcedures`/`optionalProcedures`/`contraindicatedProcedures` = `kind: "procedure"`; `expectedSurgeries` = `kind: "surgery"`. The validator flags mismatches. A surgery in `expectedProcedures` = error.
- **`R-DX-BLOCKED` ≠ always deteriorating.** A blind diagnosis (missing required exams) gives `improving` if correct + well treated (you got lucky), `not-responding` if poorly treated — but NEVER `recovered` (diagnosis unconfirmed). `R-DX-WRONG` → `deteriorating` (treatment bypasses the cause).
- **i18n.** UI keys in `site/js/i18n.js` (full STRINGS.pl, STRINGS.en). Drug/exam/disease names have `labelPl`/`labelEn` in data. `--lang en` catches gaps. Verdict details (`detailPl`) are PL-only in the MVP — acceptable.
- **Drug naming.** Use real ingredient names (e.g. "Gentamicin + clotrimazole + betamethasone"), not descriptive repetitions ("Ear drops (antibiotic+…)"). `groupPl` carries the class, `routePl` carries the route — do not duplicate in `inn`.
- **Glossary inflection.** Glossary tooltips work only on exact matches (nominative + `forms[]`). Add every inflected form that appears in the content to `forms[]` — they are auto-indexed. Without this, an inflected form will not get a tooltip.
- **Epilogue = dynamically assembled, NOT static.** `epiloguePl/En` live in `rubrics.js` (shared across all cases — do NOT edit per-case) and fire only for actually triggered verdicts. `epilogueClosingGood/BadPl/En` in `cases.js` = patient timeline — **do not list errors/drugs the player did not make** (honesty). See `case-authoring-template.md §1b`.
- **Patient graphics: 0 or 3 (complete set or fallback).** A case must have **a complete set of 3 images** (`image`+`imageTreated`+`imageDeteriorating`) or **none** (then the species icon is used). Naming: `<patient>-0<1|2|3>-(intake|treated|deteriorating).png`. `assets.test.js` enforces this — adding 1 of 3 = fail.
- **`good` can legitimately = `improving` (not `recovered`).** A case without `disease.recommendedGroups` (procedural/dietary) → the good path is `improving`, not `recovered`. This is NOT a bug — the explore invariant allows `improving`. `explore --all` will stay green.
- **`minLevel` must be ≤ case difficulty.** Progressive unlock hides drugs/procedures at lower levels, but must NOT hide the tools needed to cure. If you add a drug to `recommendedGroups` (or a procedure to `expectedProcedures/Surgeries`) of a case with difficulty D, set its `minLevel ≤ D`. `validate_game.js` (winnability) and `derive_levels.js --check` will catch violations. Pitfall: hide new specific drugs (e.g. antiprotozoal) only until the case that needs them (`minLevel = D`).

## References

| File | Read when… |
|---|---|
| `../../ARCHITECTURE.md` | New to the project — layout, separation, principles, 28 rules |
| `../../EXTENDING.md` | Adding a specific entity — **canonical living schema** + full schemas and steps |
| `../../LLM-PIPELINE.md` | Full LLM-driven expansion loop (generation → verification → source audit) |
| `../../../research/data-model.md` | F1 project context (historical; current schema → EXTENDING.md) |
| `../../../research/claims.md` | Claim ledger format, verification priority |
| `references/case-authoring-template.md` | Adding a case — copy-paste worked example (data + claim + 2 golden + verification) |
| `references/verify-and-diagnose.md` | Something fails — `--trace` anatomy + `explore`, symptom→cause table |
| `../pawthology-art-pipeline/SKILL.md` | Generating graphics — patients, exams, procedures, drug groups |

## Quick extension checklist

- [ ] Changed only `site/data/*.js` (+ `claims.md` + `scenarios/`), NOT `game.js` (unless a new rule).
- [ ] All references (species, trueDiagnosis, diagnosisOptions, examResults keys, expectedProcedures/Surgeries, expectedRecommendations) exist.
- [ ] kind fields correct: `expectedProcedures`/`optionalProcedures`/`contraindicatedProcedures` = procedure; `expectedSurgeries` = surgery.
- [ ] **`infoPl`/`infoEn` present** for every entity (exam/disease/drug/procedure/recommendation) — without them the card in the Clinical catalog (encyclopedia subpage) shows a placeholder. The `game.test.js` test enforces this.
- [ ] **`minLevel` consistent**: every drug/procedure in case dependencies (recommendedGroups, expectedProcedures/Surgeries) has `minLevel ≤ difficulty`. `derive_levels.js --check` and `validate_game.js` green.
- [ ] Bidirectional toxicity (if applicable).
- [ ] Systemic doses: `min < max` (a band, not a point) — a point min==max is unattainable with the slider step (step = sliderMax/500); the player cannot hit it exactly. ±10% around the target dose is OK (fenbendazole 50 → 45–55).
- [ ] `claimIds`/`sources`/`reviewStatus` present; `reviewStatus` = `draft` if not source-audited.
- [ ] `validate_game.js` → OK (0 warnings).
- [ ] `derive_levels.js --check` → OK (stored ≤ derived).
- [ ] `node --test` → fail=0.
- [ ] `replay --check` → N/N PASS.
- [ ] `explore <caseId>` → invariants preserved (good≥bad, toxic=critical, good≠critical). — **CRITICAL for a new case.**
- [ ] `--lang en` → no missing keys (if UI was touched).
- [ ] Golden scenario locks in new behavior and PASSES.
