# Pawthology — Data model and schema (F1)

> ⚠ **Historical F1 design document.** Current, canonical living-schema → `docs/EXTENDING.md`.
> Some field names have changed here (e.g. `wound-swab-cytologia`→`…-cytology`, `unitNote`→`unitNotePl`, added `optionalExams`, `R-EXAM-HARMFUL` removed, rules 15→28). Treat this as historical context, not a recipe — build according to `EXTENDING.md`.
>
> Primary principle: **data is the product, code is a thin evaluation/rendering layer.**
> New content (species, disease, drug, exam, case) = new entry in a table.
> This enables LLM expansion while preserving auditability.

## 0. Structural decisions to confirm

| # | Question | Recommendation |
|---|---|---|
| S1 | JS Modules | **ES modules** (no build, `package.json` with `"type":"module"`); served by `python -m http.server` (ESM via `file://` blocks CORS, but we serve anyway). Cleaner directory separation and testability in Node than the starter's UMD. |
| S2 | Diagnosis: choice or free-text? | **Choice from a differential list** (true diagnosis + distractors). Free-text cannot be reliably evaluated. Openness remains in exams (any) and treatment (any drug + any dose). Consistent with the skill's `case-diagnosis` mechanics. |
| S3 | Dose input: mg/kg or total mg? | **Main slider = total mg**, derived mg/kg = mg/kg shown live (and this mg/kg is scored). The daughter calculates `mg/kg from label × weight = mg` and the slider verifies. Blindly guessing "forgot to multiply by weight" (dose = weight) falls below the band → teaches. |
| S4 | Exam results: code or data? | **Data per case**: `case.examResults[examId] = {text, value, flags}`. Fully auditable, the LLM authorizes the result text, golden scenarios can assert them. |
| S5 | Patient weight | A digital scale in the UI reveals `case.weightKg` exactly; the challenge is **arithmetic** (O-01), not reading. In the engine, `weightKg` is an input. |
| S6 | Rubrics: code or data? | **Rule predicates in `game.js`** (logic), **deltas/config in `data/rubrics.js`** (data). The LLM tunes scoring by editing data, not logic. |
| S7 | Engine vs content | `game.js` **does not import** data — it receives `content` as an argument. Full decoupling: tests and runner inject content. |

## 1. Directory layout (final, not only F1)

```
pawthology/
  package.json                  # {"type":"module"} — ESM in Node
  site/
    index.html                   # semantic DOM, About/Sources, safety footer
    styles.css
    js/
      game.js                    # PURE engine: evaluateCase(case, decisions, content) → result
      main.js                    # DOM, render, input, dose slider, localStorage, i18n
      i18n.js                    # strings pl/en, lookup(key, lang)
    data/
      species.js                 # dog, cat
      exams.js
      drugs.js
      diseases.js
      cases.js
      rubrics.js                 # config deltas + rule mappings
      index.js                   # aggregates everything → CONTENT
  scenarios/
    *.json                       # golden suite (executable specification)
  tests/
    game.test.js                 # node --test, engine logic
  tools/
    replay.js                    # headless runner: --trace / --check
    validate_game.py             # structure validation + traceability (extended from skill)
  research/
    brief.md  data-model.md  claims.md  assets.md
```

## 2. Content catalogs (schema + example)

### 2.1 species — `site/data/species.js`

```js
export const species = [
  {
    id: "cat",
    labelPl: "Kot", labelEn: "Cat",
    weightRangeKg: { min: 2, max: 8 },        // for scale visualization
    toxicDrugs: ["acetaminophen", "ibuprofen"], // species toxic (every dose harmful)
    notesPl: "Koty słabo glukuronidują — wiele leków ludzkich jest toksycznych.",
    claimIds: ["C-SPC-01"]
  },
  { id: "dog", labelPl: "Pies", labelEn: "Dog", weightRangeKg: { min: 2, max: 60 }, toxicDrugs: ["ibuprofen"], notesPl: "...", claimIds: ["C-SPC-02"] }
];
```

### 2.2 exams — `site/data/exams.js`

```js
export const exams = [
  {
    id: "wound-swab-cytologia",
    labelPl: "Wymaz z rany + cytologia", labelEn: "Wound swab + cytology",
    groupPl: "Diagnostyka laboratoryjna",
    whatItTestsPl: "Obecność bakterii i komórek zapalnych w ranie.",
    cost: 40,           // points-cost (cost has no currency; translates to "expensive")
    turnaroundTurns: 1, // how many "turns" to wait (time simplification)
    claimIds: ["C-EXM-03"]
  },
  // otoscopy, ear cytology, fecal exam, radiograph, inspection/comb, blood panel...
];
```

### 2.3 drugs — `site/data/drugs.js` (heart of extensibility)

```js
export const drugs = [
  {
    id: "chlorhexidine",
    inn: "Chlorheksydyna",                 // pharmac. name
    groupPl: "Antyseptyk miejscowy", groupEn: "Topical antiseptic",
    tooltipPl: "Antyseptyk do odkażania rany — nie jest antybiotykiem, nie wybiera oporności (AMR).",
    routePl: "miejscowo",
    dosing: {                               // per species
      dog: { mgPerKg: { min: 1, max: 4 }, unitNote: "roztwór 0.05–2%", frequencyPl: "1–2× dziennie" },
      cat:  { mgPerKg: { min: 1, max: 4 }, unitNote: "roztwór 0.05–2%", frequencyPl: "1–2× dziennie" }
    },
    contraindicatedForDisease: [],          // e.g. nsaids → ["renal-disease"]
    speciesToxic: [],                        // species toxic (every dose harmful)
    antibiotic: false,                       // drives R-ABX-* rule
    minLevel: 1,                             // 1..3 — player level at which the drug is visible in catalog (progressive unlock). None = 1.
    claimIds: ["C-DRG-07"], reviewStatus: "llm-audited", reviewDate: "2025-01-15",
    sources: ["S-MVM"]
  },
  {
    id: "acetaminophen",
    inn: "Acetaminofen (paracetamol)",
    groupPl: "Analgetyk/antypiretyk (ludzki OTC)", groupEn: "Analgesic/antipyretic (human OTC)",
    tooltipPl: "Ludzki lek OTC — u kota toksyczny (niewydolność glukuronidacji); u psa wąski margines.",
    routePl: "p.o.",
    dosing: { dog: { mgPerKg: { min: 0, max: 0 }, unitNote: "toksyczny / niepolecany w weterynarii", frequencyPl: "—" } },
    speciesToxic: ["cat"],
    antibiotic: false,
    claimIds: ["C-DRG-TOX-01"], reviewStatus: "llm-audited", reviewDate: "2025-01-15", sources: ["S-MVM"]
  }
  // antibiotics, antiparasitics, nsaids, opioids, ear drops, fluids...
];
```

### 2.4 diseases — `site/data/diseases.js`

```js
export const diseases = [
  {
    id: "uncomplicated-abrasion",
    labelPl: "Niepowikłane otarcie", labelEn: "Uncomplicated abrasion",
    differentials: ["wound-infection", "abscess"],   // diagnosis distractors
    requiredExams: ["wound-inspection"],              // R-EXAM-NEEDED
    supportiveExams: ["wound-swab-cytologia"],        // R-EXAM-NEEDED (partially)
    recommendedGroups: ["antiseptic-topical"],       // R-DRUG-GROUP-MATCH
    contraindicatedGroups: [],                        // R-DRUG-CONTRAINDICATED (group)
    bacterialInfection: false,                        // R-ABX-IRRATIONAL if antibiotic
    claimIds: ["C-DIS-01"]
  }
];
```

### 2.5 cases — `site/data/cases.js`

```js
export const cases = [
  {
    id: "case-abrasion-paw",
    difficulty: 1,                      // 1..3; XP unlocks harder ones
    unlockXpThreshold: 0,               // requires 0 XP to start
    species: "dog",
    weightKg: 12,                       // revealed by scale
    signalPl: "Pies, 4 lata, kuleje na przednią łapę.",
    historyPl: "Właściciel zauważył otarcie poduszkiet po spacerze w lesie.",
    symptomsPl: ["kuleje", "otarcie poduszki", "brak ropnej wydzieliny"],
    trueDiagnosis: "uncomplicated-abrasion",
    diagnosisOptions: ["uncomplicated-abrasion", "wound-infection", "abscess", "sprain"],
    examResults: {                     // data, not code (S4)
      "wound-inspection":     { textPl: "Świeże otarcie, czyste brzegi, bez ropy i obrzęku.", flags: { infection: false } },
      "wound-swab-cytologia": { textPl: "Brak bakterii; pojedyncze neutrofile.", flags: { infection: false } },
      "blood-panel":          { textPl: "W normie — badanie nie przynosi informacji.", flags: { redundant: true } }
    },
    claimIds: ["C-CASE-01"]
  }
];
```

### 2.6 rubrics — `site/data/rubrics.js` (deltas = data)

```js
export const rubricConfig = {
  "R-EXAM-NEEDED":     { delta: +10, claimId: "C-RUB-EXAM" },
  "R-EXAM-REDUNDANT":  { delta:  -5, claimId: "C-RUB-EXAM" },
  "R-EXAM-HARMFUL":    { delta: -15, claimId: "C-RUB-EXAM" },
  "R-EXAM-MISSED":     { delta: -10, claimId: "C-RUB-EXAM" },
  "R-DX-CORRECT":      { delta: +20, claimId: "C-RUB-DX" },
  "R-DX-WRONG":        { delta: -25, claimId: "C-RUB-DX" },
  "R-DRUG-GROUP-MATCH":   { delta: +15, claimId: "C-RUB-DRUG" },
  "R-DRUG-GROUP-MISMATCH":{ delta: -10, claimId: "C-RUB-DRUG" },
  "R-DRUG-CONTRAINDICATED":{ delta: -20, claimId: "C-RUB-DRUG" },
  "R-DRUG-SPECIES-TOXIC":  { delta: -40, claimId: "C-RUB-TOX" },
  "R-DOSE-IN-RANGE":   { delta:   0, claimId: "C-RUB-DOSE" },   // correct = no penalty; base
  "R-DOSE-UNDER":      { delta: -10, claimId: "C-RUB-DOSE" },
  "R-DOSE-OVER":       { delta: -25, claimId: "C-RUB-DOSE" },
  "R-ABX-IRRATIONAL":  { delta: -15, claimId: "C-AMR-01" },
  "R-ABX-INDICATED":   { delta:  +5, claimId: "C-AMR-01" }
};
```

Rule predicates (whether a given rule fires) are functions in `game.js` (S6).

## 3. Engine contract — `site/js/game.js`

```js
// PURE: no data import, no DOM. Receives content as an argument (S7).
export function evaluateCase(caseObj, decisions, content) → result
export function availableCases(content, totalXp) → string[]
export function levelFromXp(content, totalXp) → number        // 1..3 (progressive unlock)
export function availableDrugs(content, level) → drug[]      // filtered by minLevel
export function availableProcedures(content, level, kind) → procedure[]  // kind="procedure"|"surgery"
```

**Input `decisions` (currently — full schema in EXTENDING.md):**
```js
{
  weightKg: 12,
  exams: ["wound-inspection", "wound-swab-cytology"],
  diagnosis: "uncomplicated-abrasion",
  treatments: [ { drug: "chlorhexidine", doseMg: 24 } ],   // total mg (S3); mg/kg = doseMg/weightKg
  procedures: ["wound-clean-debride"],                   // kind=procedure + kind=surgery
  recommendations: ["wound-observation"]                  // recommendations for caregiver
}
```

**Output `result`:** `xp` (sum of deltas, floor 0), `patientOutcome` (5 grades), `dxPossible`, `verdicts[]` (each: `stage` ∈ {exams, diagnosis, treatment, procedure, recommendation, rationality} + `rule` + `delta` + `claimId` + `detailPl/En`), `doseBreakdown[]` (for systemic drugs).

Full list of 28 R-* rules: `docs/EXTENDING.md` §"Full list of rules". `patientOutcome` synthesized in `synthesizeOutcome()` in priority order (toxic→critical, R-PROC-CONTRA/R-DOSE-OVER/R-DX-WRONG→deteriorating, missing treatment/wrong dose→not-responding, R-DX-BLOCKED→improving/not-responding, correct+matched+!procMissing→recovered). Case emulator: `node tools/explore.mjs <caseId>`.

## 4. Golden-scenario format — `scenarios/*.json`

```json
{
  "id": "abrasion-good",
  "caseId": "case-abrasion-paw",
  "decisions": {
    "weightKg": 12,
    "exams": ["wound-inspection", "wound-swab-cytologia"],
    "diagnosis": "uncomplicated-abrasion",
    "treatments": [ { "drug": "chlorhexidine", "doseMg": 24 } ]
  },
  "expected": {
    "xp": [90, 100],
    "patientOutcome": "recovered",
    "mustContainVerdicts": ["R-EXAM-NEEDED", "R-DX-CORRECT", "R-DRUG-GROUP-MATCH"],
    "mustNotContainVerdicts": ["R-ABX-IRRATIONAL", "R-DRUG-SPECIES-TOXIC"]
  }
}
```

Runner: `node tools/replay.js scenarios/abrasion-good.json --trace` → JSON with `pass: true/false` + diff (which verdict/XP/outcome does not match). `--check` runs the whole grid, exit≠0 on fail.

## 5. Claims ledger — `research/claims.md` (format)

```md
| ID | Claim | Class | Sources | Outcome | Scope/assumptions | Game Location | ReviewStatus | ReviewDate |
|----|-------------|-------|--------|--------|-----------------|----------------|--------------|------------|
| C-DRG-07 | Chlorhexidine: topical antiseptic, 0.05–2% solution, does not select AMR | Verified | S-MVM | O-04,O-06 | external, not for eyes | tooltip+drug | llm-audited | 2025-01-15 |
| C-DRG-TOX-01 | Acetaminophen toxic in cats (glucuronyltransferase deficiency) | Verified | S-MVM | O-04,O-06 | every dose | tooltip+drug+rule | llm-audited | 2025-01-15 |
| C-CASE-01 | Paw abrasion case (signal, history) | Fictionalized | — | O-02,O-03 | presentation | case | — | — |
```

Sources defined separately: `S-MVM = Merck Veterinary Manual, https://www.merckvetmanual.com/, access date`.

## 6. i18n — `site/js/i18n.js`

String keys, `pl` full, `en` stub at start. UI reads `t("exam.cost.label", lang)`. Runner with `--lang en` catches missing keys (pillars). Drug/exam names: `labelPl`/`labelEn` in data (already in schema). UI labels in `i18n.js`.

## 7. How this yields an LLM-drivable loop (reminder)

```
LLM adds drug  →  data/drugs.js (entry with claimIds, sources, reviewStatus)
                →  tools/validate_game.py  (structure + units + references)
                →  scenarios/*.json         (golden: expected behavior)
                →  node tools/replay.js --trace  (grading error diagnosis)
                →  source audit via internet  (factual sign-off, D3)
                →  merge
```

Everything is dependency-light, readable for the LLM, without a browser.

## 8. Open questions for F1 (beyond S1–S7)

- **Q1.** Should delta-XP and `unlockXpThreshold` thresholds be in `cases.js` (per case) or a global curve in `rubrics.js`? I recommend: `difficulty` in case + thresholds in `rubrics.js` (one place to tune).
- **Q2.** Should `patientOutcome` have 5 grades (proposed) or 3 (improvement / no change / deterioration)? 5 gives richer narrative and more assertions in golden; 3 is simpler. I recommend 5.
- **Q3.** Do we allow **multiple drugs** simultaneously (`treatments[]`)? I recommend yes (interactions outside seed scope — the engine evaluates each independently; flag in About: "drug interactions outside game scope").
- **Q4.** Do we add **blood panel** as an exam right at the start (distractor "expensive and unnecessary")? I recommend yes — teaches not to order redundant exams (R-EXAM-REDUNDANT).
