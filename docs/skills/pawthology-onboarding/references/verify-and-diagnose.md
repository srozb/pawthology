# Verify & diagnose — verification loop and reading `--trace`

## Verification loop (after every change)

```bash
node tools/validate_game.js .
node tools/derive_levels.js --check
node --test
node tools/replay.js --check
node tools/explore.js --all
node tools/replay.js --lang en
```

### What each tool catches

| Command | Catches | Why |
|---|---|---|
| `validate_game.js .` | dangling references, missing claimIds/sources/reviewStatus, inconsistent bidirectional toxicity, doses min>max, duplicate IDs, wrong kind in expectedProcedures/Surgeries, **minLevel winnability** (a drug/procedure from case dependencies has minLevel > difficulty) | Data errors before you run JS; fastest feedback |
| `derive_levels.js --check` | `minLevel` in data inconsistent with the derived level from case dependencies (stored > derived) | Progressive unlock consistency |
| `node --test` | rule predicate logic; scenarios.test.js (auto-reads `scenarios/`); assets.test.js (graphics exist) | Logic + asset regression |
| `replay --check` | full golden suite PASS (exit≠0 on fail) | Executable behavior specification |
| `explore --all` | scoring invariants per case (good≥bad, toxic=critical, good≠critical) | Scoring consistency — catches "a properly treated patient deteriorates" without the UI |
| `replay --lang en` | missing UI keys in English | i18n completeness |

**`node --test` without a path!** `node --test tests/` = `MODULE_NOT_FOUND` in ESM.

### Expected green output

```
validate_game.js → "RESULT: OK (0 warnings)"
derive_levels    → "✓ All minLevel consistent" (exit 0)
node --test      → "ℹ fail 0"
replay --check   → "Summary: N/N PASS"
explore --all    → 10× "✓ case-... good=..." + "Scoring invariants (...) hold for all cases."
replay --lang en → no missing keys printed
```

## Case explorer — `tools/explore.js` (before you write a scenario)

```bash
node tools/explore.js                          # list cases
node tools/explore.js <caseId>                 # ANSWER KEY + 5 auto-paths
node tools/explore.js <caseId> --trace         # + full verdict trace
node tools/explore.js <caseId> --only toxic   # only one path (good|toxic|noexam|notreat|wrongdx)
```

`explore` **synthesizes decisions from case data** (you do not need to write JSON): it picks required exams, the true diagnosis, a drug from recommendedGroups at mid-band dose, required procedures/surgeries, recommendations — and compares with 4 bad variants. It shows the "ANSWER KEY" (what the engine considers correct) + checks invariants. This is the fastest way to verify scoring consistency for a new case — use it BEFORE you write golden scenarios.

## `--trace` anatomy

```bash
node tools/replay.js scenarios/diarrhea-cat-paracetamol-toxic.json --trace
```

```
[PASS] diarrhea-cat-paracetamol-toxic (case-diarrhea-cat)  xp=0 outcome=critical
    --- verdicts (trace for LLM) ---
    exams        R-EXAM-NEEDED            Δ  10  [C-RUB-EXAM]
                 Ordered required exam "Fecal exam (parasitology)".
    diagnosis    R-DX-CORRECT             Δ  20  [C-RUB-DX]
                 Diagnosis consistent with results: Parasitic diarrhea (nematodes).
    treatment    R-DRUG-SPECIES-TOXIC     Δ -40  [C-RUB-TOX]
                 Acetaminophen (paracetamol) is toxic for Cat...
    --- dose breakdown ---
    acetaminofen: 10 mg × 1 kg = 10 mg ... [outside band]
```

Each verdict = `stage · rule · delta · [claimId] · detail`. Below that, `dose breakdown` shows mg × kg vs the drug's mg/kg band. This is your scoring x-ray.

## Table: symptom in the trace → where to fix

| Symptom | Where | Action |
|---|---|---|
| Rule fires, delta is wrong | `site/data/rubrics.js` | Edit `delta` in `rubricConfig[R-*]` (data, not logic) |
| Rule does NOT fire but should | `site/js/game.js` (predicate) | Missing/wrong condition — rare, requires a code change |
| Rule fires on wrong data | `site/data/*.js` entity | E.g. wrong `groupId`, missing `speciesToxic`, wrong `bacterialInfection` |
| Verdict has wrong/missing claimId | `research/claims.md` + `rubricConfig.claimId` | Add a `C-RUB-*` claim, set `claimId` |
| Dose scored wrong | `dosing[species].mgPerKg` + `case.weightKg` | Engine computes mg/kg × kg; check the band and weight |
| No weight (weightKg=0) with systemic | `case.weightKg` | R-DOSE-INVALID — the "eyeball it" myth enforced |
| `R-EXAM-REDUNDANT` does not fire | `case.examResults[id].flags.redundant` + `disease.optionalExams` | An exam outside {required,supportive,optional} = redundant |
| `R-ABX-IRRATIONAL` does not fire | `disease.bacterialInfection` + `drug.antibiotic` | antibiotic + non-bacterial infection = irrational |
| `R-DRUG-SPECIES-TOXIC` does not fire | `drug.speciesToxic` + `species.toxicDrugs` (bidirectional!) | Both sides; the validator catches one-sided entries |
| `R-PROC-MISSING`/`R-SURG-MISSING` does not fire | `case.expectedProcedures`/`expectedSurgeries` + `procedure.kind` | kind=procedure→expectedProcedures; kind=surgery→expectedSurgeries |
| `R-DX-BLOCKED` gives unexpected outcome | `synthesizeOutcome` logic | blind dx + good treatment → improving; + bad → not-responding; never recovered |
| `R-DOSE-INVALID` instead of `R-DOSE-IN-RANGE` | `drug.dosing[species]` missing + `weightKg` | drug without dosing for species or weight=0 |

## Decision flow for a failing golden scenario

```
replay --check FAIL on <id>
  → replay scenarios/<id>.json --trace
    → are the verdicts as expected?
       YES → the expected in the scenario is wrong → fix expected (but only if the trace makes sense!)
       NO → which rule is wrong?
         delta wrong → rubrics.js (data)
         rule does not fire → game.js (predicate) — rare
         fires on wrong data → data/*.js entity
    → fix → verification loop from scratch
```

## Serving the UI (when you need to check rendering)

```bash
python3 -m http.server 8000   # in repo root
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/site/   # 200
# scrapling_screenshot via LAN IP (localhost can be refused in playwright):
#   http://localhost:8000/site/
# Note: scrapling drops <svg> in serialization (foreign namespace) — this is a tool quirk,
# not a bug. Verify icons via innerHTML.length at runtime, not via css_selector svg.
```
