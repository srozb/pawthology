# LLM-driven expansion pipeline

> **The LLM is not the source — it is the author and auditor.** The authorities (Merck Veterinary Manual, EMA, Plumb's) remain the source of the record.
> Every content candidate undergoes validation and source auditing before merge.

## LLM-driven growth loop

```
LLM adds content  →  data/*.js (entry with claimIds, sources, reviewStatus="draft")
                  →  tools/validate_game.py   (self-verification of structure + units + references + kinds)
                  →  node tools/explore.mjs <caseId>   (ANSWER KEY + auto good/bad playthrough — BEFORE scenarios)
                  →  scenarios/*.json          (golden: test expected behavior)
                  →  node tools/replay.js --trace  (diagnose grading errors)
                  →  node tools/explore.mjs --all     (grading invariants for all cases)
                  →  source audit via internet   (factual sign-off → "llm-audited")
                  →  merge
```

Everything is dependency-light, readable for the LLM, without a browser.

## Step 1: Candidate generation

### Prompt — drug candidate

```text
You are a content author for an educational veterinary game. Add the drug "<name>" to the catalog.

Required fields (compliant with the schema in site/data/drugs.js):
- id: unique, kebab-case
- inn: pharmacological name
- groupId: therapeutic group (must exist in diseases.recommendedGroups of some disease)
- groupPl / groupEn: group label
- tooltipPl / tooltipEn: ONE sentence — what the drug is used for, in what group, species notes
- routePl / routeEn: route of administration
- dosingType: "systemic" (mg slider, R-DOSE-* grading) or "topical" (no dose grading)
- dosing: per species { dog: {mgPerKg:{min,max}, frequencyPl}, cat: {...} }
  for topical: unitNotePl instead of mgPerKg
- speciesToxic: [] or a list of toxic species (EVERY dose is harmful)
- antibiotic: true/false (drives R-ABX-IRRATIONAL / R-ABX-INDICATED)
- reviewStatus: "draft" (ALWAYS at this stage — verification in step 4)
- reviewDate: null
- sources: ["S-MVM"] (ID from claims.md)
- claimIds: ["C-DRG-NEW-XX"] (new claim ID)

Return:
1. Ready JS object to be inserted into the drugs array in site/data/drugs.js
2. Claim row to be added in research/claims.md (ID, claim, class: Verified,
   source: S-MVM, outcome, scope, location, reviewStatus: draft)
3. If the drug is toxic to a species: explicitly indicate to add it to species.toxicDrugs

Do not invent doses — if you are unsure, leave the dosing fields empty and mark
reviewStatus="draft" with the note "TO BE VERIFIED: dose unknown".
```

### Prompt — case candidate

```text
Add a clinical case to the game. Required fields (compliant with site/data/cases.js):
- id, difficulty (1-3), unlockXpThreshold, species, weightKg
- signalPl/En, historyPl/En, symptomsPl/En
- trueDiagnosis (must exist in diseases.js)
- diagnosisOptions (4-5 options, all must exist in diseases.js)
- examResults: per exam (id must exist in exams.js), 3 paragraphs {introPl, findingsPl, closingPl} + *En; flags:{infection?, redundant?} are descriptive METADATA, NOT engine input
- claimIds

Return the JS object + claims.md row. Ensure all references (species,
trueDiagnosis, diagnosisOptions, examResults keys) exist in the data.
```

## Step 2: Structure self-verification

The LLM runs the validator on its candidates **before** merge:

```bash
python3 tools/validate_game.py .
```

The validator rejects:
- missing `claimIds`, `sources`, `reviewStatus`
- `claimIds` pointing to non-existent claims in `claims.md`
- dangling references (exam/disease/drug/species does not exist)
- inconsistent bidirectional toxicity (`species.toxicDrugs` ↔ `drug.speciesToxic`)
- doses `min > max`
- duplicate IDs
- **lack of winnability**: a drug from `recommendedGroups` (or a procedure from `expectedProcedures/Surgeries`) of a case with difficulty D has `minLevel > D` — without this, a player at level = difficulty wouldn't have the tools to cure

Additionally, run the threshold consistency guard:

```bash
node tools/derive_levels.mjs --check   # stored minLevel ≤ derived from case dependencies
```
If the validator fails — the LLM fixes and retries.

## Step 3: Testing expected behavior

First **the emulator** (does not require writing JSON):

```bash
node tools/explore.mjs <caseId>          # ANSWER KEY + 5 auto-paths — check invariants
node tools/explore.mjs <caseId> --trace  # + full trace
```

`explore` will synthesize from the case data: required exams, true diagnosis, a drug from recommendedGroups at mid-band dose, required procedures/surgeries, recommendations — and compare with 4 bad variants. If invariants are violated (good<bad, toxic≠critical, good=critical) — fix the data BEFORE scenarios.

Then the LLM writes golden scenarios (format below) and runs:

```bash
node tools/replay.js --check       # whole suite, exit≠0 on fail
node tools/explore.mjs --all       # grading invariants for all cases
```

If a new drug/case breaks existing scenarios — regression. The LLM reads `--trace` and diagnoses.

## Step 4: Diagnosing grading errors — `--trace`

This is the LLM's key tool. `--trace` emits the full reasoning trace of the engine:

```bash
node tools/replay.js scenarios/diarrhea-cat-paracetamol-toxic.json --trace
```

Output:

```
[PASS] diarrhea-cat-paracetamol-toxic (case-diarrhea-cat)  xp=0 outcome=critical
    --- verdicts (trace for the LLM) ---
    exams        R-EXAM-NEEDED            Δ  10  [C-RUB-EXAM]
                 Required exam "Fecal exam (parasitology)" ordered.
    diagnosis    R-DX-CORRECT             Δ  20  [C-RUB-DX]
                 Diagnosis consistent with results: Parasitic diarrhea (nematodes).
    treatment    R-DRUG-SPECIES-TOXIC     Δ -40  [C-RUB-TOX]
                 Acetaminophen (paracetamol) is toxic to Cat. Human OTC drug...
```

Each verdict shows:
- **stage** — which phase (exams / diagnosis / treatment / rationality)
- **rule** — which rule fired (R-*)
- **delta** — XP change
- **claimId** — traceability to `claims.md` (which claim justifies this grading)
- **detail** — why this rule fired, in human language

The LLM reads this trace and sees: if the scoring is wrong, which rule / claim / drug data is at fault. Then: if it's a delta — it edits `rubrics.js`; if it's a predicate — it requires a change in `game.js` (rare); if it's data — it edits `data/*.js`.

## Step 5: Source audit (factual sign-off — D3)

This is the final verification. The LLM opens an authoritative source on the internet and confirms the fact.

### Prompt — source verification

```text
Open <URL> and confirm the mg/kg dose of the drug <drug> for the species <species>.

Return JSON:
{
  "claimId": "C-DRG-XX",
  "confirmed": true/false,
  "value": { "min": 12.5, "max": 25 },        // confirmed mg/kg range
  "frequency": "2× daily",                     // if the source provides it
  "sourceUrl": "https://...",                  // actual URL that was opened
  "accessDate": "2025-01-15",                   // today's ISO date
  "notes": "any notes, contraindications"
}

If the source CONTRADICTS the data in site/data/drugs.js:
- DO NOT edit data/*.js at this stage
- Return confirmed=false with a description of the discrepancy in notes
```

### Preferred sources

1. **Merck Veterinary Manual** — `https://www.merckvetmanual.com/` (free, authoritative)
2. **EMA** — `https://www.ema.europa.eu/` (veterinary drug labels)
3. **Plumb's Veterinary Drug Handbook** (gold standard, paid/printed)

### After confirmation

- Set `reviewStatus: "llm-audited"` and `reviewDate: <date>` in `drugs.js` (for this drug)
- Update the row in `claims.md`: change `reviewStatus` to `llm-audited`, enter `ReviewDate`, update the URL and access date of the S-* source
- If discrepancy: add a DISCREPANCY note in `claims.md` and leave `reviewStatus: "draft"`

### Verification priority

1. **Species toxicity** (C-DRG-TOX-*, C-SPC-*) — highest didactic risk
2. **Antibiotics** (C-DRG-01..04) — AMR, doses, contraindications
3. **NSAIDs/opioids** (C-DRG-16..18) — narrow margins
4. **Antiparasitics** (C-DRG-10..15)
5. **Antiseptics, exams, diseases**

## Golden scenario format

File `scenarios/*.json`:

```json
{
  "id": "scenario-name",
  "caseId": "case-abrasion-paw",
  "decisions": {
    "weightKg": 12,
    "exams": ["wound-inspection", "wound-swab-cytology"],
    "diagnosis": "uncomplicated-abrasion",
    "treatments": [{ "drug": "chlorhexidine", "doseMg": 24 }],
    "procedures": ["wound-clean-debride"],
    "recommendations": ["wound-observation"]
  },
  "expected": {
    "xp": [50, 60],
    "patientOutcome": "recovered",
    "mustContainVerdicts": ["R-EXAM-NEEDED", "R-DX-CORRECT", "R-DRUG-GROUP-MATCH", "R-PROC-REQUIRED", "R-REC-REQUIRED"],
    "mustNotContainVerdicts": ["R-ABX-IRRATIONAL", "R-DRUG-SPECIES-TOXIC"]
  }
}
```

`expected` fields:
- `xp` — `[min, max]` (range) or a number (exact); optional
- `patientOutcome` — one of `recovered | improving | not-responding | deteriorating | critical`; optional
- `mustContainVerdicts` — list of R-* rules that MUST appear; optional
- `mustNotContainVerdicts` — list of R-* rules that CANNOT appear; optional

Each `expected` field is optional — only those present are checked.

## Full example: LLM adds a new drug

1. **Generates** the `doxycycline` entry in `drugs.js` + the `C-DRG-NEW-01` claim in `claims.md` (`reviewStatus: "draft"`).
2. **Validates**: `python3 tools/validate_game.py .` → must pass.
3. **Tests**: writes `scenarios/doxycycline-good.json` + `doxycycline-irrational.json`; `node tools/replay.js --check` → must PASS.
4. **Diagnoses** (if fail): `node tools/replay.js scenarios/doxycycline-good.json --trace` → reads the trace, fixes.
5. **Audits source**: opens Merck Vet Manual, confirms 5–10 mg/kg dose, returns JSON.
6. **Bumps**: `reviewStatus: "llm-audited"`, `reviewDate: "2025-01-15"` in `drugs.js` and `claims.md`.
7. **Merge**.
