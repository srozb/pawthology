# Case authoring template — worked example

Copy-paste template for adding a case. We walk through `case-renal-cat` (a cat with kidney failure) end-to-end: data + claim + 2 golden scenarios + verification. It assumes that `renal-disease`, `urinalysis`, and the drug `maropitant` (anti-nausea, Cerenia/Rx) already exist — add them earlier via `../../../EXTENDING.md` (§drug/§disease/§exam) if they do not. All `claimIds` must resolve in `research/claims.md`.

> Remember: patient + narrative in `cases.js`; claim in `claims.md`; scenarios in `scenarios/`; **nothing in `game.js`**.

## 1. Entry in `site/data/cases.js`

```js
{
  id: "case-renal-cat",
  difficulty: 3,                                   // 1..3; thresholds in rubrics.js unlockThresholds
  unlockXpThreshold: 90,                           // max(unlockThresholds[difficulty], this)
  species: "cat",                                  // must exist in species.js
  weightKg: 4,                                     // within species.weightRangeKg; engine computes dose from this
  patientName: "Filemon",                          // for narrative and UI
  narrativePl: "Wizyta Filemona. Starszy kot od tygodnia słabnie, nie je i wymiotuje — właścicielka przynosi go zawiniętego w koc, zvinienie leży w garstce i wymiotach przy wejściu.",
  narrativeEn: "Filemon's visit. The elderly cat has been weakening for a week, not eating and vomiting — the owner carries him wrapped in a blanket, the trouble shows in the hunched posture and vomit on entry.",
  // narrativeLongPl/En (optional): extended narrative for the intake screen (3–4 sentences:
  // patient behavior + owner interaction + clinical hook). The short narrativePl stays on the list card.
  narrativeLongPl: "Wizyta Filemona. Starszy kot od tygodnia słabnie… [expanded version of the above]",
  narrativeLongEn: "Filemon's visit. The elderly cat has been weakening for a week… [expanded version of the above]",
  signalPl: "Kot, 12 lat, chudnie, nie je, wymiotuje.",
  signalEn: "Cat, 12 years, losing weight, not eating, vomiting.",
  historyPl: "Stopniowo pogarsza się od tygodnia; pije więcej wody.",
  historyEn: "Gradually worsening over a week; drinks more water.",
  symptomsPl: ["wymioty", "anoreksja", "osłabienie", "odwodnienie", "polidypsja"],
  symptomsEn: ["vomiting", "anorexia", "lethargy", "dehydration", "polydipsia"],
  trueDiagnosis: "renal-disease",                  // must exist in diseases.js
  diagnosisOptions: [                              // 4–5; all must exist in diseases.js
    "renal-disease", "diarrhea-bacterial", "otitis-externa", "uncomplicated-abrasion"
  ],
  examResults: {                                   // keys must exist in exams.js
    "blood-panel": {
      // Exam result = 3 paragraphs: narrative intro / clinical signal / narrative closing.
      introPl:    "Z ostrożności zlecasz panel… [narrative intro: patient behavior, why ordered]",
      findingsPl: "Podwyższony kreatynina i mocznik; izosthenuria w OCI. [middle paragraph = clinical signal, concrete]",
      closingPl:  "Wynik potwierdza podejrzenie… [narrative closing, conclusion/hook]",
      flags: { infection: false }
    },
    "radiograph": {
      introPl: "…", findingsPl: "Bez zmian strukturalnych.", closingPl: "…",
      flags: { redundant: true }
    }
    // Each of the 6 fields has a *Pl/*En pair. The old single-sentence textPl still works (fallback).
  },
  // --- TREATMENT COMPONENTS: procedures + surgeries + recommendations (orthogonal to drugs) ---
  expectedProcedures: ["wound-clean-debride"],        // kind=procedure; id from procedures.js
  expectedSurgeries: [],                               // kind=surgery; alternative → optionalProcedures with alternativeTo
  expectedRecommendations: ["wound-observation"],     // id from recommendations[] in site/data/procedures.js
  optionalProcedures: [],                              // permissible (not required); e.g. splint as alternativeTo a surgery
  contraindicatedProcedures: [],                       // harmful → R-PROC-CONTRA (-15, deteriorating)
  claimIds: ["C-CASE-07"]
}
```

**Treatment consists of 4 assembled sections** (UI): Drugs / Procedures / Surgeries / Recommendations. The engine scores each orthogonally:
- **Drugs** (`diseases.recommendedGroups` + `treatments[]` with dose): R-DRUG-*, R-DOSE-*, R-ABX-*.
- **Procedures** (`expectedProcedures`, `kind=procedure`): R-PROC-REQUIRED (+10) / R-PROC-MISSING (-10) / R-PROC-EXTRA (-5) / R-PROC-CONTRA (-15).
- **Surgeries** (`expectedSurgeries`, `kind=surgery`): R-SURG-REQUIRED (+15) / R-SURG-MISSING (-20) / R-SURG-EXTRA (-10). Alternative: a procedure with `alternativeTo=[surgeryId]` in `optionalProcedures` satisfies the missing surgery (does not fire R-SURG-MISSING, fires R-PROC-REQUIRED).
- **Recommendations** (`expectedRecommendations`): R-REC-REQUIRED (+5) / R-REC-MISSING (-5) / R-REC-EXTRA (-3).
A missing required procedure/surgery → `patientOutcome` max "improving" (not "recovered"). Species toxicity (R-DRUG-SPECIES-TOXIC) dominates everything → "critical".

**Note:** `narrativePl` starts with a story beat (Filemon's visit...), then concrete clinical clues — this teaches reading comprehension. Optional `narrativeLongPl/En` is the expanded version of this narrative for the intake screen (3–4 sentences: atmosphere + patient behavior + owner interaction + clinical hook); the short `narrativePl` stays on the list card. `examResults` has 3 paragraphs: `introPl` (narrative intro, italic) / `findingsPl` (clinical signal, accent with a vertical line) / `closingPl` (narrative closing, italic) — each with a *En pair. `flags: { infection, redundant }` in `examResults` are **descriptive metadata**, NOT engine inputs — R-EXAM-REDUNDANT fires when the ordered exam does not belong to `{disease.requiredExams, supportiveExams, optionalExams}` (so `radiograph` is redundant because it is not in those sets for `abrasion-paw`).

### 1a. Optional educational fields (opt-in, non-intrusive)

Beyond the scoring core, a case can carry additional educational value. All fields are optional — a missing field = no UI element.

- **`hints`** (object) — consultant hints for more difficult cases. A "Consultant" button in the toolbar appears when `c.difficulty >= 2 && c.hints`. Clicking opens a modal with the hint text for the current phase. The hint **guides reasoning, does not give the answer** (e.g. "Think about which exam would show bone structure", not "Order an X-ray").
  ```js
  hints: {
    examsPl: "…", examsEn: "…",
    diagnosisPl: "…", diagnosisEn: "…",
    treatmentPl: "…", treatmentEn: "…"
  }
  ```
- **`epilogueClosingGoodPl/En` + `epilogueClosingBadPl/En`** (strings) — a closing "what happened to the patient" paragraph on the outcome screen (timeline, controls, patient-specific — name, symptoms). Good outcome (recovered/improving) → `epilogueClosingGood`; bad → `epilogueClosingBad`. **Important: these fields do NOT list errors or drugs** — they only describe the patient's outcome. Errors are described by the dynamically assembled epilogue from verdicts (see below). Complements the generic `outcome.comment.*`.

Extending knowledge about **drugs/diseases/species** is not a case field — these are fields on the objects themselves:
- `drug.infoPl/infoEn` + `wikiPl/wikiEn` (URL) → "ℹ" button next to the drug on the treatment screen.
- `disease.infoPl/infoEn` + `wikiPl/wikiEn` → "ℹ" button next to the diagnosis option.
- `species.infoPl/infoEn` + `wikiPl/wikiEn` → "ℹ" button next to the species in the toolbar.

The `info*` text is 2–4 educational sentences (mechanism/species notes/AMR); `wiki*` is a full Wikipedia URL (pl→pl.wikipedia, en→en.wikipedia; when a pl article does not exist, `wikiPl` = the en URL). The `info*` content is educational prose anchored in Wikipedia — it does not require an entry in `claims.md` (the link is the source).

### 1b. Dynamic "Case timeline" epilogue (honest — assembled from actual verdicts)

The epilogue on the outcome screen **is NOT static text**. It is dynamically assembled from:
1. **Consequence fragments from `rubricConfig`** in `site/data/rubrics.js` — each entry has `epiloguePl/En` (1 sentence: what was done right for delta>=0, what was done wrong + consequence for delta<0). The renderer takes ONLY verdicts that actually fired in `r.verdicts` and joins their fragments (positive first, then negative in stage order: exams→diagnosis→treatment→rationality).
2. **The case-closing** `epilogueClosingGood/BadPl/En` from `cases.js` — a separate paragraph (italic, dividing line) with the patient's outcome timeline.

**Honesty principle:** the epilogue lists only the errors the player actually made. If the player did not give an antibiotic — the text does not mention antibiotics or antimicrobial resistance. If they did — it does. This distinction is carried by the fragment in `rubricConfig`, fired conditionally by the engine.

**To tune the error narrative:** edit the `epiloguePl/En` of the relevant entry in `rubrics.js` (shared across all cases). **To tune the patient outcome timeline:** edit `epilogueClosing*` in `cases.js` (case-specific). The assembly logic is in `renderOutcome` in `main.js` — it does not require changes when adding a new case.

Backward-compat: if a case has old `epilogueGoodPl/BadPl` (without `Closing`), the renderer uses them as a fallback.

## 2. Claim in `research/claims.md`

```md
| C-CASE-07 | Starszy kot: niewydolność nerek — kreatynina/mocznik↑, izostenuria, polidypsja; RTG bez zmian = zbędne | Verified | S-MVM | O-02,O-03,O-04 | case: renal-cat | cases.js case-renal-cat | draft | — |
```

After auditing the source (Merck Vet Manual): change `draft`→`llm-audited`, enter the ReviewDate, update the source URL/access date for `S-MVM`.

## 3. Golden scenarios in `scenarios/`

Always **run `--trace` first** to learn the actual outcome, then set `expected`.

### `scenarios/renal-cat-good.json`

```json
{
  "id": "renal-cat-good",
  "caseId": "case-renal-cat",
  "decisions": {
    "weightKg": 4,
    "exams": ["blood-panel", "urinalysis", "physical-exam"],
    "diagnosis": "renal-disease",
    "treatments": [{ "drug": "maropitant", "doseMg": 8 }]
  },
  "expected": {
    "patientOutcome": "improving",
    "mustContainVerdicts": ["R-EXAM-NEEDED", "R-DX-CORRECT"],
    "mustNotContainVerdicts": ["R-EXAM-REDUNDANT", "R-ABX-IRRATIONAL"]
  }
}
```

### `scenarios/renal-cat-redundant-rtg.json` (blocks a regression: redundant X-ray is penalized)

```json
{
  "id": "renal-cat-redundant-rtg",
  "caseId": "case-renal-cat",
  "decisions": {
    "weightKg": 4,
    "exams": ["blood-panel", "physical-exam", "radiograph"],
    "diagnosis": "renal-disease",
    "treatments": [{ "drug": "maropitant", "doseMg": 8 }]
  },
  "expected": {
    "mustContainVerdicts": ["R-EXAM-REDUNDANT"]
  }
}
```

## 4. Verification

```bash
node tools/validate_game.js .     # catches dangling references, claimIds, toxicity
node --test                        # no path! logic + scenarios.test.js auto-reads scenarios/
node tools/replay.js --check       # full suite PASS (with the 2 new scenarios)
node tools/replay.js scenarios/renal-cat-good.json --trace   # confirm the actual outcome before finalizing expected
```

If `renal-cat-good` does not PASS: run `--trace`, read the trace, locate the fault (delta? data? predicate?) — see `verify-and-diagnose.md`.
