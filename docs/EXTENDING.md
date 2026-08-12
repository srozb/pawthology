# Project Extension (canonical guide)

> **Golden rule: data is the product, code is a thin layer.**
> New content = new entry in a table in `site/data/`. Code (`game.js`) does not change upon extension (unless a new evaluation rule).
> After each change run the verification loop ("Verification" section at the end).

This is a **living schema** — the current state of data. `research/data-model.md` is a historical F1 design document (some field names have changed — the truth is here).

## Table of Contents

- [Content Entities](#content-entities)
- [Add a new drug](#add-a-new-drug)
- [Add a new species](#add-a-new-species)
- [Add a new exam](#add-a-new-exam)
- [Add a new disease](#add-a-new-disease)
- [Add a new case](#add-a-new-case)
- [Add a procedure / surgery](#add-a-procedure--surgery)
- [Add a recommendation](#add-a-recommendation)
- [Add a drug group](#add-a-drug-group)
- [Add graphics](#add-graphics)
- [Add a glossary term](#add-a-glossary-term)
- [Tune scoring](#tune-scoring)
- [Verification](#verification)

## Content Entities

| Data file | Entity | What engine evaluates |
|---|---|---|
| `site/data/species.js` | species | species toxicity (R-DRUG-SPECIES-TOXIC) |
| `site/data/exams.js` | exam | R-EXAM-NEEDED / REDUNDANT / MISSED |
| `site/data/drugs.js` | drug + `drugGroups` | R-DRUG-GROUP-* / R-DOSE-* / R-ABX-* / R-DRUG-SPECIES-TOXIC |
| `site/data/diseases.js` | disease | requiredExams / recommendedGroups / bacterialInfection maps |
| `site/data/cases.js` | case | ties species + diagnosis + exam results + procedures/recommendations |
| `site/data/procedures.js` | procedures (`kind=procedure`) + surgeries (`kind=surgery`) + recommendations | R-PROC-* / R-SURG-* / R-REC-* |
| `site/data/rubrics.js` | scoring config (deltas) + thresholds | just numbers (data) |
| `site/data/glossary.js` | glossary terms | tooltips in content (UI, not evaluated) |
| `site/data/index.js` | aggregates everything → `CONTENT` | single import for UI/runner |

---

## Add a new drug

A drug is an entry in the `drugs` array in `site/data/drugs.js`.

### 1. Entry in `site/data/drugs.js`

```js
{
  id: "doxycycline",                              // unique, kebab-case
  inn: "Doksycyklina",                            // pharmacological name (DO NOT repeat "drops (antibiotic+…)" — use ingredients, e.g. "Gentamicin + clotrimazole + betamethasone")
  groupId: "antibiotic",                          // therapeutic group (matches diseases.recommendedGroups); must exist in drugGroups
  groupPl: "Antybiotyk (tetracyklina)", groupEn: "Antibiotic (tetracycline)",
  tooltipPl: "Tetracyklina; u młodych zwierząt przebarwienia zębów. Lek rezerwy.",
  tooltipEn: "Tetracycline; in young animals teeth discoloration. Reserve drug.",
  routePl: "p.o.", routeEn: "oral",               // route of administration (separate line on card)
  dosingType: "systemic",                         // "systemic" (mg slider, evaluates R-DOSE-*) | "topical" (no dose evaluation)
  dosing: {
    dog: { mgPerKg: { min: 5, max: 10 }, frequencyPl: "1–2× dziennie 7 dni" },
    cat: { mgPerKg: { min: 5, max: 10 }, frequencyPl: "1–2× dziennie 7 dni" }
    // for topical: instead of mgPerKg use unitNotePl (e.g. "kilkanaście kropli / ucho")
    // no entry for species → player can select, but dose = invalid (R-DOSE-INVALID)
  },
  speciesToxic: [],                                // species for which ANY dose is toxic → R-DRUG-SPECIES-TOXIC (dominates → critical)
  antibiotic: true,                                // drives R-ABX-IRRATIONAL (when disease.bacterialInfection=false) / R-ABX-INDICATED (when true)
  minLevel: 1,                                     // 1..3 — player level from which drug is visible in catalog (progressive unlock; see §Progressive unlock). Missing = 1. Calculated by `tools/derive_levels.js --check`.
  // --- educational fields (opt-in, "ℹ" button in treatment) ---
  infoPl: "2–4 educational sentences: mechanism + species notes + AMR. Can use \\n\\n for paragraphs.",
  infoEn: "...",
  wikiPl: "https://pl.wikipedia.org/wiki/...",    // Wikipedia URL (pl→pl.wiki, en→en.wiki; if pl does not exist → en)
  wikiEn: "https://en.wikipedia.org/wiki/...",
  // --- audit metadata ---
  reviewStatus: "draft",                           // "draft" = needs verification | "llm-audited" = source verified
  reviewDate: null,                                // ISO YYYY-MM-DD after verification
  sources: ["S-MVM"],                              // source IDs defined in claims.md
  claimIds: ["C-DRG-NEW-01"]                        // claim IDs in claims.md
}
```

### 2. Claim in `research/claims.md`

```md
| C-DRG-NEW-01 | Doxycycline 5–10 mg/kg 1–2× p.o.; teeth discoloration in young | Verified | S-MVM | O-04,O-05,O-06 | tetracycline | drug doxycycline | draft | — |
```

### 3. Verification + scenarios

`node tools/validate_game.js .` (catches missing claimIds/sources/reviewStatus, one-way toxicity, min>max), then golden scenario (`replay --trace`). After source audit → `llm-audited`.

### Species Toxicity (if applicable)

Set **bidirectionally**:
- `drug.speciesToxic: ["cat"]` in `drugs.js`
- `"drug"` in `species.toxicDrugs` in `species.js`

Validator yells on one-way. Toxic drug → `patientOutcome = "critical"` (dominates everything in `synthesizeOutcome`).

### Drug Naming (convention)

Use **real ingredient names**, not descriptive repetitions. Bad: "Ear drops (antibiotic + antifungal + steroid)". Good: "Gentamicin + clotrimazole + betamethasone". `groupPl` carries the class, `routePl` the route — don't duplicate them in `inn`.

---

## Add a new species

A species is an entry in the `species` array in `site/data/species.js`.

```js
{                                               // EXAMPLE — fictional new species (do not overwrite existing id!)
  id: "ferret",
  labelPl: "Fretka", labelEn: "Ferret",
  weightRangeKg: { min: 0.5, max: 2 },          // for weight scale visualization + validator checks case.weightKg ∈ range
  toxicDrugs: ["acetaminophen", "ibuprofen"],   // drugs toxic for this species — ALSO ADD species to drug.speciesToxic (bidirectionally)
  notesPl: "Fretki mają specyficzną fizjologię — wiele leków dla psów/kotów jest toksycznych.",
  notesEn: "Ferrets have specific physiology — many dog/cat drugs are toxic.",
  infoPl: "...", infoEn: "...", wikiPl: "...", wikiEn: "...",  // educational (opt-in)
  claimIds: ["C-SPC-NEW-01"]
}
```

**Doses per species in drugs:** for each drug available for the new species add `dosing.ferret` in `drugs.js`. Without it, the drug is selectable but dose = invalid.

**Bidirectional toxicity:** for each drug in `toxicDrugs` add `"ferret"` to `drug.speciesToxic`.

---

## Add a new exam

An exam is an entry in the `exams` array in `site/data/exams.js`.

```js
{
  id: "urinalysis",
  labelPl: "Badanie moczu", labelEn: "Urinalysis",
  groupPl: "Diagnostyka laboratoryjna", groupEn: "Lab diagnostics",   // group header in exams phase
  image: "exams/urinalysis.png",                // tile graphic (2:1 or 1:1); placeholder in site/img/exams/
  whatItTestsPl: "Parametry moczu: gęstość, białko, glukoza, krwinki.",
  whatItTestsEn: "Urine parameters: specific gravity, protein, glucose, cells.",
  cost: 35,                // cost-points (no currency; implies "expensive")
  turnaroundTurns: 1,      // how many "turns" of waiting (time simplification, Modeled)
  // --- educational (opt-in, "ℹ" button) ---
  infoPl: "...", infoEn: "...", wikiPl: "...", wikiEn: "...",
  claimIds: ["C-EXM-NEW-01"]
}
```

**Link to diseases:** add `id` to `disease.requiredExams` (R-EXAM-NEEDED + missing → R-EXAM-MISSED) or `disease.supportiveExams` (R-EXAM-NEEDED partially) or `disease.optionalExams` (does not penalize as redundant). Without this, the exam is available but doesn't affect scoring (any order outside {required,supportive,optional} → R-EXAM-REDUNDANT).

**Results in cases:** add entry in `case.examResults` (see [Add a new case](#add-a-new-case)).

---

## Add a new disease

A disease is an entry in the `diseases` array in `site/data/diseases.js`.

```js
{
  id: "renal-disease",
  labelPl: "Niewydolność nerek", labelEn: "Renal disease",
  requiredExams: ["blood-panel"],               // without them (≥1) → R-EXAM-MISSED, diagnosis impossible (R-DX-BLOCKED)
  supportiveExams: ["urinalysis"],               // helpful, not mandatory → R-EXAM-NEEDED
  optionalExams: ["physical-exam"],             // acceptable, not penalized as redundant
  recommendedGroups: [],                        // first line drug groupId → R-DRUG-GROUP-MATCH (+15)
  contraindicatedGroups: ["nsaid"],             // groupId that are harmful → R-DRUG-CONTRAINDICATED (-20)
  bacterialInfection: false,                    // true → antibiotic = R-ABX-INDICATED (+5); false → R-ABX-IRRATIONAL (-15, AMR)
  // --- educational (opt-in) ---
  infoPl: "...", infoEn: "...", wikiPl: "...", wikiEn: "...",
  claimIds: ["C-DIS-NEW-01"]
}
```

**Inclusion in cases:** add to `case.diagnosisOptions` (and optionally `case.trueDiagnosis`).

---

## Add a new case

A case is an entry in the `cases` array in `site/data/cases.js`. It is the richest entity. Full worked example: `docs/skills/pawthology-onboarding/references/case-authoring-template.md`.

```js
{
  id: "case-renal-cat",
  difficulty: 3,                                   // 1..3; thresholds in rubrics.js unlockThresholds {1:0, 2:150, 3:400}
  unlockXpThreshold: 400,                          // max(unlockThresholds[difficulty], this)
  species: "cat",                                  // must exist in species.js
  weightKg: 4,                                     // in species.weightRangeKg; engine calculates dose from this
  patientName: "Filemon",                          // for patient header and narrative
  breedPl: "Dachowiec", breedEn: "Domestic shorthair",  // for meta in header (opt)
  agePl: "12 lat", ageEn: "12 years",              // for meta in header (opt)
  // --- narrative ---
  narrativePl: "Wizyta Filemona. … [story beat → specific clinical hints]",
  narrativeEn: "...",
  narrativeLongPl: "… [expanded version on intake screen: 3–4 sentences — patient behavior + owner interaction + clinical hook]",
  narrativeLongEn: "...",
  signalPl: "Kot, 12 lat, chudnie, nie je, wymiotuje.", signalEn: "...",
  historyPl: "Stopniowo pogarsza się od tygodnia; pije więcej wody.", historyEn: "...",
  symptomsPl: ["wymioty", "anoreksja", "osłabienie"], symptomsEn: ["vomiting", "anorexia", "lethargy"],
  // --- diagnosis ---
  trueDiagnosis: "renal-disease",                  // must exist in diseases.js
  diagnosisOptions: ["renal-disease", "diarrhea-bacterial", "otitis-externa", "uncomplicated-abrasion"],  // 4–5, all in diseases.js
  // --- exam results (3 paragraphs) ---
  examResults: {
    "blood-panel": {
      introPl:    "Z ostrożności zlecasz panel… [narrative intro, italic]",
      findingsPl:  "Podwyższona kreatynina i mocznik; izostenuria. [middle = clinical signal, emphasis]",
      closingPl:  "Wynik potwierdza podejrzenie… [narrative closing, italic]",
      flags: { infection: false }                   // descriptive METADATA (UI/comment), NOT engine input. R-ABX-* controls disease.bacterialInfection; R-EXAM-REDUNDANT controls exam membership in {required,supportive,optional}.
      // Each of the 6 fields has a *Pl/*En pair. Old one-sentence textPl still works (fallback).
    }
  },
  // --- COMPONENT TREATMENT: procedures + surgeries + recommendations (orthogonal to drugs) ---
  expectedProcedures: ["wound-clean-debride"],     // kind=procedure; missing → R-PROC-MISSING (-10), blocks recovered
  expectedSurgeries: [],                           // kind=surgery; missing → R-SURG-MISSING (-20), blocks recovered
  expectedRecommendations: ["wound-observation"],  // missing → R-REC-MISSING (-5)
  optionalProcedures: [],                          // acceptable; with alternativeTo=[surgId] → satisfies lack of surgery (R-PROC-REQUIRED, not R-SURG-MISSING)
  contraindicatedProcedures: [],                   // harmful → R-PROC-CONTRA (-15, deteriorating)
  // --- patient graphics (3 states) ---
  image: "cody-01-intake.png",                    // intake (list card + intake screen)
  imageTreated: "cody-02-treated.png",            // good outcome (recovered/improving)
  imageDeteriorating: "cody-03-deteriorating.png",// bad outcome
  // or no trio → species icon fallback (e.g. Dodo before graphics)
  // --- closing epilogue (opt-in) ---
  epilogueClosingGoodPl: "Stan się poprawił — Filemon znów interesuje się jedzeniem.",
  epilogueClosingBadPl:  "Bez leczenia stan się pogarsza — konieczna pilna hospitalizacja.",
  epilogueClosingGoodEn: "...", epilogueClosingBadEn: "...",
  // --- consultant hints (opt-in, difficulty>=2) ---
  hints: { examsPl: "...", diagnosisPl: "...", treatmentPl: "..." /* + En */ },
  // --- metadata ---
  claimIds: ["C-CASE-06"]
}
```

**Treatment = 4 sections (UI), evaluated orthogonally:** Drugs / Procedures / Surgeries / Recommendations. The engine evaluates each independently. Not every case needs every section (e.g. abrasion = only topical drug + recommendation; fracture = drug + surgery + 2 recommendations).

**Patient outcome (`synthesizeOutcome`)** — synthesized from verdicts in priority order:
1. R-DRUG-SPECIES-TOXIC → **critical** (dominates)
2. R-PROC-CONTRA → **deteriorating**
3. R-DOSE-OVER (systemic) → **deteriorating**
4. R-DRUG-CONTRAINDICATED / R-ABX-IRRATIONAL → **not-responding**
5. R-NO-TREATMENT → **not-responding** (exception: supportive-only disease + correct dx + recommendations → **improving**)
6. R-DOSE-UNDER / R-DOSE-INVALID → **not-responding**
7. R-DX-WRONG → **deteriorating** (treatment misses the cause)
8. R-DX-BLOCKED → **not-responding** (wrong diagnosis, made blind without required exams)
9. correct dx (R-DX-CORRECT **or R-DX-LUCKY**) + R-DRUG-GROUP-MATCH + !procMissing → **recovered** (LUCKY = correct blind guess, treated as correct for outcome; XP still penalized for the missing exam)
10. correct dx + procMissing, or correct dx + group-MISMATCH → **improving**

Lack of required procedure/surgery (`R-PROC-MISSING` / `R-SURG-MISSING`) blocks recovered → max improving.

### Case verification (CRITICAL — use `explore`)

After adding a case, **before** writing a golden scenario, run the emulator:

```bash
node tools/explore.js case-renal-cat            # answer key + 5 paths (good + 4 bad)
node tools/explore.js case-renal-cat --trace    # + full trail of verdicts
```

This synthesizes canonical correct treatment from case data and shows the outcome. **Check invariants:** good path → recovered (or improving if procedural-only case), toxic → critical, good ≥ each bad (XP and outcome). If `explore` reports a violation — you have a bug in case data (e.g. wrong groupId, missing expectedProcedures, one-way toxic). Only when `explore` is green, write golden scenarios confirming specific variants.

---

## Add a procedure / surgery

A procedure (`kind=procedure`) or surgery (`kind=surgery`) is an entry in the `procedures` array in `site/data/procedures.js`.

```js
{
  id: "wound-clean-debride",
  kind: "procedure",                              // "procedure" (R-PROC-*, +10/-10/-5) | "surgery" (R-SURG-*, +15/-20/-10 — stricter)
  labelPl: "Oczyszczenie i odnerwienie rany", labelEn: "Wound cleaning and debridement",
  image: "procedures/wound-clean-debride.png",   // tile graphic; placeholder in site/img/procedures/
  alternativeTo: [],                             // for optional alternative procedure: [surgeryId, ...] — satisfies lack of surgery
  minLevel: 1,                                   // 1..3 — player level from which visible (progressive unlock; see §Progressive unlock). Missing = 1. `tools/derive_levels.js --check` verifies.
  // --- educational (opt-in) ---
  infoPl: "2–4 sentences: why, how, notes. \\n\\n for paragraphs.", infoEn: "...",
  wikiPl: "https://pl.wikipedia.org/wiki/...", wikiEn: "https://en.wikipedia.org/wiki/...",
  // --- metadata ---
  reviewStatus: "draft", reviewDate: null,
  sources: ["S-MVM"], claimIds: ["C-PROC-NEW-01"]
}
```

**Link to cases:** add `id` to `case.expectedProcedures` (kind=procedure) or `case.expectedSurgeries` (kind=surgery). Validator checks kind — surgery in `expectedProcedures` = error.

**Alternative logic:** optional procedure with `alternativeTo: ["fracture-osteosynthesis"]` in `case.optionalProcedures` — when player orders this procedure instead of surgery, engine gives `R-PROC-REQUIRED` (not `R-SURG-MISSING`). When player orders both surgery and alternative → `R-PROC-EXTRA` on alternative.

---

## Add a recommendation

A recommendation is an entry in the `recommendations` array in `site/data/procedures.js` (same file as procedures).

```js
{
  id: "recheck-if-recurrent",
  labelPl: "Kontrola, jeśli objawy wrócą", labelEn: "Recheck if symptoms recur",
  // recommendations do not have an image field (full-width text cards)
  infoPl: "...", infoEn: "...", wikiPl: "...", wikiEn: "...",
  reviewStatus: "draft", reviewDate: null,
  sources: ["S-MVM"], claimIds: ["C-REC-NEW-01"]
}
```

**Link:** add `id` to `case.expectedRecommendations`. Missing → `R-REC-MISSING` (-5); excess → `R-REC-EXTRA` (-3).

---

## Add a drug group

A drug group is an entry in the `drugGroups` array in `site/data/drugs.js` (same file). This is the **section banner** in the treatment phase: graphic + title + one-sentence description (what the group is, when to use it).

```js
{
  id: "antibiotic",                               // must match drug.groupId and disease.recommendedGroups/contraindicatedGroups
  labelPl: "Antybiotyki", labelEn: "Antibiotics",
  descPl: "Leki przeciwbakteryjne — uzasadnione tylko przy potwierdzonej infekcji bakteryjnej; nadużycie napędza oporność (AMR).",
  descEn: "Antibacterial drugs — justified only by confirmed bacterial infection; overuse drives resistance (AMR).",
  image: "drug-groups/antibiotic.png"             // 2:1 banner; placeholder in site/img/drug-groups/
}
```

Order in array = display order. DO NOT render a group without drugs.

---

## Add graphics

Graphics are PNG files in `site/img/` + `image` field in data + PROMPT in `art/prompts/`. Graphic locations:

| Type | `image` field | PNG directory | Prompts directory | Aspect |
|---|---|---|---|---|
| Patient (3 states) | `case.image` / `imageTreated` / `imageDeteriorating` | `site/img/cases/` | `art/prompts/patients/<patient>/` | 4:3 |
| Exam | `exam.image` | `site/img/exams/` | `art/prompts/exams/` | 1:1 (tile) |
| Procedure/surgery | `procedure.image` | `site/img/procedures/` | `art/prompts/procedures/` | 1:1 (tile) |
| Drug group (banner) | `drugGroup.image` | `site/img/drug-groups/` | `art/prompts/drug-groups/` | 2:1 |

**Workflow:**
1. Create PROMPT according to style in `art/prompts/STYLE-GUIDE.md` (realistic, soft painterly veterinary illustration, no blood/gore, for 9-year-old).
2. Generate PNG (user / image model) and place in `site/img/<directory>/`.
3. Set `image` field in data (relative path `site/img/`, e.g. `"exams/otoscopy.png"`).
4. `node --test` (test `assets.test.js` verifies that `image` fields point to existing files).

**Patient graphics — 0 or 3 rule (complete or fallback):** a case must have a **complete set of 3 images** (`image` + `imageTreated` + `imageDeteriorating`) or **none** (then UI shows species icon as fallback). Adding 1 or 2 of 3 = fail `assets.test.js`. Naming: `<patient>-0<1|2|3>-(intake|treated|deteriorating).png` (e.g. `cody-01-intake.png`). The three states correspond to game phases: intake / treated / deteriorating.

When PNG doesn't exist or fails to load, UI shows fallback (species icon / Lucide icon) — doesn't break the game. Full patient graphics procedure: `docs/skills/pawthology-art-pipeline/references/new-patient-art-procedure.md`.

**The same graphics in Clinical Catalog:** the Catalog subpage (book-open button in header, `state.view="encyclopedia"`) reuses `image` fields (exams, procedures), drug group banners (`drugGroup.image`), and `infoPl`/`infoEn` + `wikiPl`/`wikiEn` content from the treatment screen — without duplication. By adding a graphic or info content, you automatically enrich the catalog too. Therefore, every entity (exam, disease, drug, procedure, recommendation) should have `infoPl` — without it the catalog card shows a placeholder. (`game.test.js` test enforces `infoPl` presence for all entities).

---

## Add a glossary term

A glossary term is an entry in the `GLOSSARY` array in `site/data/glossary.js` (export `GLOSSARY`, not `glossary`). These are **tooltips** in content (descriptions of exams, drugs, diseases) — highlighted terms show definitions. Not evaluated by engine.

```js
{
  id: "g-antibiotic",                          // unique, g-<slug>
  term: "antybiotyk",                            // nominative form (base)
  termEn: "antibiotic",
  forms: ["antybiotyku", "antybiotykiem", "antybiotyków", "antybiotyki"],  // INFLECTED FORMS — automatically indexed
  simplePl: "Lek zabijający bakterie. Nie działa na wirusy.",   // one sentence — for 9-year-old (short tooltip)
  simpleEn: "A drug that kills bacteria. Not effective against viruses.",
  fullPl: "Antybiotyk to lek zabijający bakterie lub hamujący ich wzrost; nie działa na wirusy. Nadużycie napędza oporność (AMR).",  // full — for adult/student (deeper tooltip)
  fullEn: "An antibiotic kills bacteria or inhibits their growth; ineffective against viruses. Overuse drives resistance (AMR).",
  source: null,                                  // source URL (medically critical → Wikipedia/authority) or null
  verified: false                               // bool — whether verified with source
}
```

**Inflection:** only exact matches (nominative forms + `forms[]`) give a tooltip. Add every inflected form occurring in the content to `forms[]` — they are automatically indexed in `GLOSSARY_BY_TERM` and regex. Without this, an inflected form won't get a tooltip.

**Two levels:** `simple*` = one sentence for 9-year-old (main tooltip), `full*` = full explanation for adult (expansion). `source`+`verified` for medically critical terms (toxicology, AMR).

---

## Tune scoring

Scoring is **data** in `site/data/rubrics.js` — **NOT logic**. Rule predicates (whether a rule fires) are in `game.js` and don't change during tuning.

### Changing XP delta

```js
"R-DRUG-SPECIES-TOXIC":  { delta: -40, claimId: "C-RUB-TOX", epiloguePl: "...", epilogueEn: "..." },
//                    ↑ change this number
```

Each entry also has `epiloguePl/En` — one consequence sentence for the dynamic epilogue on the results screen (delta>=0 = what was done right; delta<0 = what was done wrong + consequence). You edit it once → shared across all cases.

### Changing unlock thresholds

```js
export const unlockThresholds = { 1: 0, 2: 150, 3: 400 };
```

Case unlocked when `totalXp >= max(unlockThresholds[difficulty], case.unlockXpThreshold)`. XP = sum of `max(0, bestXp[caseId])` (best result per case, floor 0).

### Progressive unlock of drugs and procedures

Besides level/case thresholds, the **drugs, procedures and surgeries** themselves also have a visibility threshold in the treatment catalog. The `minLevel` field (1..3) in `drugs.js` and `procedures.js` determines from which player level the entity appears on the treatment screen. Goal: reduce overwhelm on L1, and instead introduce tools gradually.

For the current per-level catalog (which drugs/procedures/surgeries unlock at L1/L2/L3), run:

```bash
node tools/derive_levels.js        # prints the L1/L2/L3 breakdown + verifies minLevel consistency
```

Mechanics:
- `levelFromXp(content, totalXp)` → level 1..3 (engine, `site/js/game.js`).
- `availableDrugs(content, level)` / `availableProcedures(content, level, kind)` → filtered catalog (engine).
- `renderTreatment` (`site/js/main.js`) hides drugs/procedures with `minLevel > level` and hides "Surgeries" section when no surgeries at this level. The "unlock-hint" footer counts hidden ones.
- **Winnability**: `tools/validate_game.js` checks that for every case of difficulty D, all drugs from `recommendedGroups` and all `expectedProcedures`/`expectedSurgeries` have `minLevel <= D`. Without this, a player at level = difficulty would not have tools to cure.
- `tools/derive_levels.js --check` verifies consistency: calculates minimum level from case dependencies (recommended/contraindicated/speciesToxic) and compares with `minLevel` saved in data. Mismatch = error.

Convention when adding new entity:
- drug/procedure used in `recommendedGroups`/`expectedProcedures` of a difficulty D case → `minLevel <= D` (enforced by `validate_game.js`).
- toxic trap (antibiotic, human OTC) visible already on L1 — because it's a lesson, not a reward — so `minLevel = 1`.
- new specific drug (e.g. antiprotozoal) hidden until case that requires it; then `minLevel = D`.

### Full list of rules

| Phase (stage) | Rule | Delta | When |
|---|---|---|---|
| exams | R-EXAM-NEEDED | +10 | required/supportive ordered |
| exams | R-EXAM-REDUNDANT | −5 | redundant exam |
| exams | R-EXAM-MISSED | −10 | missing required → R-DX-BLOCKED |
| diagnosis | R-DX-CORRECT | +20 | correct diagnosis (with exams) |
| diagnosis | R-DX-WRONG | −25 | wrong diagnosis → deteriorating |
| diagnosis | R-DX-BLOCKED | −15 | wrong diagnosis without required exams (in the dark) → not-responding |
| diagnosis | R-DX-LUCKY | −15 | correct diagnosis without required exams (lucky blind guess; treated as correct for patient outcome, penalized in XP) |
| treatment | R-DRUG-GROUP-MATCH | +15 | drug from recommendedGroups |
| treatment | R-DRUG-GROUP-MISMATCH | −10 | drug outside recommended group |
| treatment | R-DRUG-CONTRAINDICATED | −20 | drug from contraindicatedGroups |
| treatment | R-DRUG-DUPLICATE | −5 | same groupId twice |
| treatment | R-NO-TREATMENT | −15 | no treatment with recommended group |
| treatment | R-DRUG-SPECIES-TOXIC | −40 | species toxic drug → critical |
| treatment | R-DOSE-IN-RANGE | 0 | dose within mgPerKg band |
| treatment | R-DOSE-UNDER | −10 | underdose |
| treatment | R-DOSE-OVER | −25 | overdose → deteriorating |
| treatment | R-DOSE-INVALID | −20 | missing weight/dose or drug without dosing for species |
| rationality | R-ABX-INDICATED | +5 | antibiotic when bacterialInfection=true |
| rationality | R-ABX-IRRATIONAL | −15 | antibiotic when bacterialInfection=false (AMR) |
| procedure | R-PROC-REQUIRED | +10 | required procedure ordered |
| procedure | R-PROC-MISSING | −10 | missing required procedure → blocks recovered |
| procedure | R-PROC-EXTRA | −5 | redundant procedure |
| procedure | R-PROC-CONTRA | −15 | harmful procedure → deteriorating |
| procedure | R-SURG-REQUIRED | +15 | required surgery ordered |
| procedure | R-SURG-MISSING | −20 | missing required surgery → blocks recovered |
| procedure | R-SURG-EXTRA | −10 | redundant surgery (stricter than procedure) |
| recommendation | R-REC-REQUIRED | +5 | correct recommendation |
| recommendation | R-REC-MISSING | −5 | missing recommendation |
| recommendation | R-REC-EXTRA | −3 | redundant recommendation |

### Adding a new rule (rare — requires code)

1. Add entry in `rubricConfig` in `rubrics.js` (`delta` + `claimId` + `epiloguePl/En`).
2. Add predicate in `game.js` (function pushing verdict via `pushVerdict`).
3. Add `C-RUB-*` claim in `claims.md`.
4. Add golden scenarios testing new rule.
5. Update rules table above + `ARCHITECTURE.md`.

---

## Verification

After **every** change run the loop (order matters — fastest feedback first):

```bash
node tools/validate_game.js .          # data consistency + claimIds traceability + bidirectional toxicity + kinds
node --test                                # logic tests + scenarios.test.js (auto-reads scenarios/) — NOTE: without path!
node tools/replay.js --check               # whole golden suite PASS (exit≠0 on fail)
node tools/explore.js --all               # evaluation invariants for all cases (good≥bad, toxic=critical)
node tools/replay.js --lang en             # translations completeness (if UI keys touched)
python3 tools/scaffold_case.py --check <caseId>  # completeness of ONE case: all fields, refs, graphics, scenarios, claims
```

`node --test` **without path** — `node --test tests/` = `MODULE_NOT_FOUND` in ESM.

### Creating a new case — `scaffold_case.py`

`python3 tools/scaffold_case.py --new --id <caseId> --species <id> --disease <id> --name <Name> [--weight N] [--diff 1-3]` creates scaffold: directories `art/prompts/patients/<slug>/` (3 prompts), scenario stubs in `scenarios/`, suggests next `C-CASE-NN`, prints checklist. **It doesn't generate medical content** (that's LLM's role according to schema below) — just structure + guardrail. After filling data run `--check <caseId>` to verify completeness (fields, references, 0/3 graphics, scenarios, claims).

### What is caught by which tool

| Tool | Catches | Why |
|---|---|---|
| `validate_game.js .` | dangling references, missing claimIds/sources/reviewStatus, one-way toxicity, min>max, ID duplicates, wrong kind in expectedProcedures/Surgeries, **winnability (minLevel > case difficulty)** | Data errors before running JS; fastest feedback |
| `node --test` | predicate logic; scenarios.test.js matches engine; assets.test.js (graphics exist) | Logic + asset regression |
| `replay --check` | whole golden suite PASS | Executable behavior specification |
| `explore --all` | evaluation invariants: good path ≥ each bad, toxic=critical, good≠critical | Case evaluation consistency (catches bugs like "patient deteriorates despite good treatment") |
| `scaffold_case.py --check <caseId>` | completeness of ONE case: all fields, refs, graphics 0/3, scenarios, claims | After adding a case — did we forget art prompts/scenario/claim |
| `derive_levels.js --check` | mismatch of `minLevel` in data with derivative from case dependencies (stored > derived) | Progressive unlock consistency (no excessively hidden entities) |
| `replay --lang en` | missing UI keys | i18n completeness |

All five green. If `explore --all` FAIL → `explore <caseId> --trace` and read the trail.

### `explore.js` — case emulator (KEY for LLM)

```bash
node tools/explore.js                          # list of cases
node tools/explore.js <caseId>                 # answer key + 5 auto-paths
node tools/explore.js <caseId> --trace         # + full trail of verdicts
node tools/explore.js <caseId> --only good     # just one path
node tools/explore.js --all                    # all cases + invariants (regression)
```

`explore` **synthesizes decisions from case data** (you don't need to write JSON): picks required exams, true diagnosis, drug from recommendedGroups at mid-band dose, required procedures/surgeries, recommendations — and compares with 4 bad variants (toxic, no exams, no treatment, wrong diagnosis). Shows "ANSWER KEY" (what the engine considers correct) + invariants. It's the fastest way to verify evaluation consistency of a new case.
