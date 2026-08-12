# Architecture

> Golden rule: **data is the product, code is a thin evaluation/rendering layer.**
> New content = new entry in the data table. Code does not change upon extension.

## Directory Layout

```
pawthology/
  package.json                  # {"type":"module"} — ESM in Node and browser
  README.md                      # this project — start
  site/                          # game (deploy: site/ only)
    index.html                   # semantic DOM, About/Sources, safety footer
    styles.css                   # responsive presentation
    js/
      game.js                    # PURE evaluation engine (no DOM, no data imports)
      main.js                    # DOM render, input, dose slider, localStorage, i18n
      i18n.js                    # pl/en strings, t(key, lang), missingKeys(lang)
    data/                        # CONTENT DIRECTORIES (extended by entries)
      species.js                 # species + per-species toxicity
      exams.js                   # exams: cost, time, purpose, graphic
      drugs.js                   # drugs + drugGroups — groups, dosing mg/kg per species, toxicity, minLevel (progressive unlock)
      diseases.js                # diseases: differentiation, recommended/contraindicated groups, AMR
      cases.js                   # cases: signalment, history, 3-paragraph examResults, procedures/recommendations, 3-state graphics
      procedures.js              # procedures (kind=procedure) + surgeries (kind=surgery) + recommendations — minLevel in procedures/surgeries
      rubrics.js                 # scoring config (rule deltas) + unlock thresholds + epiloguePl/En per rule
      glossary.js                # glossary terms with inflection (forms[]) → tooltips in content
      icons.js                   # Lucide icons (bundled, ISC license)
      index.js                   # aggregates → CONTENT (single import for UI/runner)
    img/                         # graphics (generated from art/prompts)
      cases/                     # patient illustrations (3 states: intake/treated/deteriorating)
      exams/                     # exam tiles (1:1)
      procedures/                # procedure/surgery tiles (1:1)
      drug-groups/              # drug group banners (2:1)
  scenarios/                     # golden suite (executable behavior specification)
    *.json
  tests/
    game.test.js                 # node --test, engine logic (pure, no DOM)
    scenarios.test.js            # auto-reads all of scenarios/
    assets.test.js               # graphics exist + naming convention
  tools/
    replay.js                    # headless runner: --trace / --check / --lang
    explore.js                  # case emulator: answer key + auto good/bad playthrough + --all
    validate_game.js             # data consistency + claimIds traceability + winnability (minLevel ≤ difficulty)
    derive_levels.js            # minLevel consistency in data with case dependencies (--check = guard)
    scaffold_case.py             # scaffold of a new case (--new) + completeness verification (--check)
    _dump.mjs                   # dumps CONTENT as JSON for Python tools (scaffold_case.py)
    optimize_images.js          # image optimization helper
  art/prompts/                  # graphics PROMPTs (patients, exams, procedures, drug groups) + STYLE-GUIDE
  research/
    brief.md                     # project contract (mission, audience, goals, myths)
    data-model.md                # historical F1 schema (canonical living schema → EXTENDING.md)
    claims.md                    # claims ledger (ID, class, source, status)
    assets.md                    # assets origin (licenses)
  docs/
    ARCHITECTURE.md              # this file
    EXTENDING.md                 # canonical extending guide (living schema)
    LLM-PIPELINE.md              # LLM extension loop
    skills/                      # SKILLs: pawthology-onboarding, pawthology-art-pipeline
```

## Separation of Concerns

### Data (`site/data/*`) — product

Six content directories (`species`, `exams`, `drugs`, `diseases`, `cases`, `rubrics`) plus `index.js` aggregating them into `CONTENT`. Each directory is an array of entries with fields described in [data-model.md](../research/data-model.md). **This is where new content is added** — not in code. `index.js` imports everything and exports `CONTENT` as the single entry point for the UI and runner.

### Engine (`site/js/game.js`) — thin evaluation layer

Pure, deterministic engine. **Does not import data** — receives `CONTENT` as an argument (S7 rule). No `document`, `window`, `fetch` — runs in Node and browser. **The only rule implementation** (no duplicate in Python — eliminates drift between runtime and tests).

### Render (`site/js/main.js`) — presentation layer

DOM, player input, dose slider, drug tooltips, localStorage (XP, completed cases, language), view switcher: cases list / game / History / **Clinical catalog (encyclopedia)** / About game. Imports `CONTENT` from `data/index.js`, `evaluateCase`/`availableCases`/`levelFromXp`/`availableDrugs`/`availableProcedures` from `game.js`, `t`/`STRINGS` from `i18n.js`.

**Clinical catalog** (`state.view = "encyclopedia"`, book-open button in header) is a subpage for browsing content without treating — 6 tabs (Exams / Diseases / Drugs / Procedures and surgeries / Recommendations / Glossary). It reuses the same `infoPl`/`infoEn` fields, graphics (`image`), drug group banners and glossary tooltips (`formatInfoBody` + `attachGlossaryHandlers`) as the treatment screen. Zero game logic — pure data review. Gives the player (and LLM) insight into the exams/diseases/drugs catalog before playing.

### Tools (`tools/`) — testability

Headless runner (`replay.js`) and validator (`validate_game.js`). See "Testability pillar" section below.

## Engine Contract

```js
// site/js/game.js — PURE: no data import, no DOM.
// Receives content as an argument (S7). Deterministic.

export function evaluateCase(caseObj, decisions, content) → result
export function availableCases(content, totalXp) → string[]   // IDs of unlocked cases
export function diagnosisOptionsFor(caseObj) → string[]       // allowed diagnoses
```

### Input `decisions`

```js
{
  weightKg: 12,
  exams: ["wound-inspection", "wound-swab-cytology"],
  diagnosis: "uncomplicated-abrasion",
  treatments: [ { drug: "chlorhexidine", doseMg: 24 } ],   // total mg; mg/kg = doseMg/weightKg
  procedures: ["wound-clean-debride"],                   // kind=procedure (procedures) + kind=surgery (surgeries)
  recommendations: ["wound-observation"]                // recommendations for caregiver
}
```

### Output `result`

```js
{
  xp: 55,                              // sum of verdict deltas (floor 0)
  patientOutcome: "recovered",         // recovered | improving | not-responding | deteriorating | critical
  dxPossible: true,                    // whether diagnosis was possible (required exams ordered)
  verdicts: [
    {
      stage: "exams",                   // exams | diagnosis | treatment | procedure | recommendation | rationality
      rule: "R-EXAM-NEEDED",            // rule ID (from rubricConfig)
      delta: +10,                       // XP change
      claimId: "C-RUB-EXAM",            // traceability to claims.md
      detailPl: "Zlecono wymagane badanie „Oględziny rany”.",
      detailEn: "..."                   // en = pl until full i18n of details (MVP)
    }
    // ...more verdicts
  ],
  doseBreakdown: [                      // only for systemic drugs
    { drug: "chlorhexidine", drugName: "Chlorheksydyna", doseMg: 24, weightKg: 12,
      mgPerKg: 2.0, band: {min: 1, max: 4}, verdict: "in-range" }
  ]
}
```

Each verdict carries `rule` + `claimId` + `detail` — this is the trail by which **LLM diagnoses evaluation errors** (see [LLM-PIPELINE.md](LLM-PIPELINE.md)).

### Evaluation Rules (R-*)

The engine evaluates six decision phases, each by predicates in `game.js` with deltas from `rubrics.js`. Full table with comments: `EXTENDING.md` §"Full list of rules".

| Phase | Rules | When |
|------|--------|-------|
| exams | R-EXAM-NEEDED (+10) / REDUNDANT (−5) / MISSED (−10) | required ordered / redundant / missing required |
| diagnosis | R-DX-CORRECT (+20) / WRONG (−25) / BLOCKED (−15) / LUCKY (−15) | correct / wrong / wrong without required exams / correct without required exams (lucky blind guess) |
| treatment | R-DRUG-GROUP-MATCH (+15) / MISMATCH (−10) / CONTRAINDICATED (−20) / DUPLICATE (−5) / NO-TREATMENT (−15) / SPECIES-TOXIC (−40) / DOSE-IN-RANGE (0) / UNDER (−10) / OVER (−25) / INVALID (−20) | group / toxicity / dose |
| rationality | R-ABX-INDICATED (+5) / IRRATIONAL (−15) | antibiotic + bacterialInfection |
| procedure | R-PROC-REQUIRED (+10) / MISSING (−10) / EXTRA (−5) / CONTRA (−15) / R-SURG-REQUIRED (+15) / MISSING (−20) / EXTRA (−10) | procedures (kind=procedure) and surgeries (kind=surgery) |
| recommendation | R-REC-REQUIRED (+5) / MISSING (−5) / EXTRA (−3) | recommendations for caregiver |

`patientOutcome` synthesized from verdicts in `synthesizeOutcome()` in priority order (full order in `EXTENDING.md` §"Patient outcome"): toxic → critical, R-PROC-CONTRA → deteriorating, R-DOSE-OVER → deteriorating, contraindicated drug / irrational abx / no treatment / wrong dose → not-responding, R-DX-WRONG → deteriorating, R-DX-BLOCKED → not-responding (wrong, blind), correct dx (R-DX-CORRECT or R-DX-LUCKY) + GROUP-MATCH + !procMissing → recovered. Lack of required procedure/surgery blocks recovered → max improving.

## Headless Testability Pillar

Central project requirement: **LLM can run the game logic without a browser, get structured results and diagnose why** something scored the way it did.

### Pure Engine

`game.js` — functions without DOM, ESM, `require`-compatible. Deterministic: the same `(case, decisions, content)` → the same result.

### Headless runner — `tools/replay.js`

```bash
node tools/replay.js scenarios/abrasion-good.json          # single scenario → JSON
node tools/replay.js scenarios/abrasion-good.json --trace # + full trail of verdicts and doses
node tools/replay.js --check                              # whole golden suite, exit≠0 on fail
node tools/replay.js --lang en                            # i18n check (missing keys)
```

`--trace` mode emits per verdict: `stage · rule · delta · claimId · detail` + dose breakdown (`mg/kg vs band`). The LLM reads this.

### Case Explorer — `tools/explore.js` (emulator)

```bash
node tools/explore.js                          # list of cases
node tools/explore.js <caseId>                 # ANSWER KEY + 5 auto-paths (good + 4 bad)
node tools/explore.js <caseId> --trace         # + full trail of verdicts
node tools/explore.js --all                     # evaluation invariants for all cases (regression)
```

Key LLM tool: **synthesizes decisions from case data** (no need to write JSON). For each case it shows what the engine considers correct (required exams, diagnosis, drug groups, doses, procedures/surgeries, recommendations) and compares the canonical good path with 4 bad ones (toxic, no exams, no treatment, wrong diagnosis). Checks invariants: good path ≥ each bad (XP and outcome), toxic=critical, good≠critical. Catches bugs like "well-treated patient deteriorates" without playing in the UI.

### Golden suite — `scenarios/*.json`

Executable specification of expected clinical behavior. Each scenario is `decisions` (weight, exams, diagnosis, drugs+doses, procedures, recommendations) + `expected` (XP range, patient outcome, must-contain/must-not-contain verdicts). Scenarios cover: correct treatment, antibiotic without infection, species toxic (paracetamol in cat, ibuprofen in dog), overdose, underdose, no exams → diagnosis block, redundant exam, no treatment, alternative splint-instead-of-surgery, procedures/recommendations.

New content ⇒ new scenarios ⇒ `--check` catches regressions.

### Validator — `tools/validate_game.js`

```bash
node tools/validate_game.js .              # data consistency
node tools/validate_game.js . --with-tests # + node --test + replay --check + explore --all
```

Checks: file presence, ID uniqueness, references (exam/disease/drug/species/procedure/recommendation exists), bidirectional toxicity (`species.toxicDrugs` ↔ `drug.speciesToxic`), doses `min ≤ max`, `claimIds` exist in `claims.md`, `reviewStatus`/`sources` correct, kinds in `expectedProcedures`/`expectedSurgeries` (procedure vs surgery), **progressive unlock winnability** (for each difficulty D case: every drug from `recommendedGroups` and `expectedProcedures`/`expectedSurgeries` has `minLevel ≤ D` — without this, a player at level = difficulty would not have the tools to cure). LLM runs on content candidates before merge — this is structural self-verification.

### Tests — `tests/`

`node --test` (WITHOUT path — `node --test tests/` = MODULE_NOT_FOUND in ESM). `game.test.js` (engine logic, pure, no DOM), `scenarios.test.js` (auto-reads all of `scenarios/`), `assets.test.js` (patient/exam/procedure/group graphics exist + naming convention).

## Epistemic Classification

Every hard data point has a class (visible in About/Sources and `claims.md`):

- **Verified** — drug facts (indications, species toxicity, mg/kg ranges) with source citations.
- **Computed** — dose calculation (`mg/kg × kg`), explicit formula, tested in `game.test.js`.
- **Modeled** — patient outcome and severity distribution — simplification with assumptions.
- **Fictionalized** — case scenarios and patients (presentation of real medicine).
- **Contested** — out of seed scope (controversies excluded from scored game).

Details: [research/brief.md](../research/brief.md) §7.

## i18n

Strings layer in `site/js/i18n.js`: keys → `STRINGS.pl` (full) and `STRINGS.en` (complete). `t(key, lang)` function with fallback to `pl`. `missingKeys(lang)` — to check completeness (runner `--lang en`). Drug/exam/disease names have `labelPl`/`labelEn` in data (not in `i18n.js`).

Default language: `pl`. PL/EN switcher in UI, saved in `localStorage`.
