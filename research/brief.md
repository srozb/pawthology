# Pawthology — Project Brief

> Status: contract closed (F0). Implementation not yet started.
> Owner: `srozb` · contact: `github@rozbicki.eu`
> Target Repo: `srozb/pawthology` (PRIVATE, for now we do not create remote, no deployment).
> Serving: locally `python -m http.server` from the repo directory.

## 1. Mission and User Contract

- **Mission (real-world outcome):** the player is able to carry out a simple line of clinical reasoning — weigh the patient, order the right exams, make a diagnosis from the results, choose a drug of the right group considering the species and calculate a safe and effective mg/kg dose — understanding **why** each decision is good or bad, without falsifying veterinary knowledge.
- **Success (observable):** the player independently (without hints) solves a new, unpracticed case: chooses rational exams, diagnoses, selects a drug appropriate for the species and enters a dose in the safety band correctly calculated from the weight.
- **Primary Audience:** the owner's 9-year-old daughter (will weigh the animal, calculate the dose). Secondary audience (ambition): adult / veterinary student — the game should carry **true** knowledge, without "childish simplifications". We don't hold the daughter by the hand; the UI carries the weight of navigation (hover → one sentence about the drug), learning remains solid.
- **Baseline:** none assumed. The player does not need to know anything about veterinary medicine upon entry; the game teaches in a loop: decision→consequence→explanation.
- **Myths to fix (feedback targets them):**
  - `M-ANTIBIOTIC-DEFAULT` — every wound/injury/fracture = antibiotic.
  - `M-HUMAN-OTC-SAFE` — human OTC drugs (paracetamol/acetaminophen, ibuprofen) are safe for animals.
  - `M-DOSE-EYEBALL` — you can dose "by eye", weight does not matter.
  - `M-EXAM-SKIP` — you can treat without exams.
  - `M-SINGLE-SYMPTOM-DX` — diagnosis from a single symptom.
  - `M-SPECIES-IRRELEVANT` — a dog and a cat are the same regarding drugs.
- **Outcomes (ID, observable):**
  - `O-01` Weigh the patient and calculate the drug dose from mg/kg (arithmetic from weight).
  - `O-02` Order exams that are diagnostically justified and reject unnecessary/expensive/harmful ones.
  - `O-03` Make a differential diagnosis from exam results.
  - `O-04` Choose a drug from the right therapeutic group considering the patient's species.
  - `O-05` Select a dose in the safety and efficacy band (neither under- nor overdose).
  - `O-06` Avoid irrational pharmacotherapy (antibiotic in the absence of infection → AMR; contraindicated drug conditions).
- **Scope:** small animal clinic; seed species: **dog, cat**; ~5 cases; catalog of ~15–20 drugs in therapeutic groups; exams catalog. Excluded: invasive surgery (simulated only as a "stabilization/referral" decision), complex anesthesiology, oncology, exotic cases. Depth: pharmacology mg/kg + species toxicity + rationality — fair to a student, without delving into specialized subtleties.
- **Session length:** 5–10 min per case; full seed ~30–45 min.
- **Assessment:** practice = gameplay with feedback per decision; transfer = new unpracticed case without hints in this session.
- **Retention:** one-off (no longitudinal state for now; `learning/` is out of seed scope).
- **Source Standard:** Merck Veterinary Manual (online, free, authoritative) as a basis; Plumb's Veterinary Drug Handbook / BSAVA as the gold standard, when available; drug labels (EMA/manufacturer). **Factual sign-off: The LLM verifies facts in external sources over the internet** and records `reviewStatus: "llm-audited"` + the audit date in `claims.md`. All pharmacological claims are `llm-audited` (one step — this is a game, not a textbook; a safety message discreetly reminds that with a sick animal you go to a vet).

## 2. Game Contract

- **Main player actions:** weigh → order exams → diagnose → prescribe drug(s) + dose → observe consequences. The mechanics extend the `case-diagnosis` profile with an **exams phase** and a **treatment phase with open input (drug choice + dose slider)** and a **rules engine evaluating the entire set of decisions**.
- **Loop per case:** (1) history + weighing, (2) ordering exams, (3) diagnosis, (4) treatment, (5) consequences: XP + patient outcome + verdicts per decision with referral to `claimId`.
- **Structure:** clinical simulator (diagnostic scenario + treatment sandbox), progressive unlocking of harder cases through XP (without named level tiers).
- **Presentation:** semantic DOM (patient/exams/drugs cards), simple subtle visual states of the patient (stands up → lies down → gets worse), without graphic content; no illustrations at the start (licenses), optionally simple icons later. DOM accessible and testable.
- **Dosing:** interactive dose slider calculating `mg/kg ↔ total mg` live with a visual safety band; daughter calculates/verifies, slider confirms.
- **Accessibility:** keyboard, touch, `prefers-reduced-motion`, visible focus, live region for feedback, no color communication. Language **pl** as default, structure ready for **i18n (en)** (string keys layer).
- **Constraints:** offline, no runtime network, no analytics/accounts/tracks, no build, vanilla HTML/CSS/JS. Local progress (localStorage) + reset.
- **Safety (discreet):** a one-line note in the treatment screen footer + a line in About: "This is a simulation. Never give a drug to an animal without a veterinarian." Without modal interruptions.

## 3. Headless Testability Architecture (Central Pillar — Owner's Requirement)

Goal: The LLM can run the game logic without a browser, get a structured result and **diagnose why** something scored the way it did.

- **Pure Engine** (`site/js/game.js`) — functions without `document`/`window`/`fetch`, UMD pattern (works in Node `require` and in the browser). `evaluateCase(case, decisions) → { xp, patientOutcome, verdicts[] }`. Deterministic. **The only implementation of the rules** (no duplicate in Python — eliminates drift).
- **Headless Runner** (`tools/replay.js`) — loads `game.js`+`content.js` without a browser. Modes: single scenario, `--trace` (full rule trace), `--check` (entire golden suite, exit≠0 on fail). The verdict trace points to the rule + `claimId` + detail — this is what the LLM reads.
- **Golden Suite** (`scenarios/*.json`) — executable specification of expected clinical behavior per case (correct treatment, overdose, species toxic, antibiotic for a fracture, no exams→no diagnosis…). Regression for LLM expansion: new content ⇒ new scenarios ⇒ runner catches breakage.
- **Structure Validator** (`tools/validate_game.py`, extended from the skill) — rejects missing `claimIds`/`sources`/`reviewDate`, incorrect dose units, dangling references. The LLM runs this on candidates before merge.
- **(Future) Property/fuzz tests** — invariants (toxic dose always degrades the patient; correct diagnosis+correct treatment always improves).
- **i18n check** — runner with `--lang en` catches missing translation keys.

## 4. Delivery Contract

- **Local goal:** Local development environment (prepared).
- **GitHub:** we don't create it for now. Ultimately `srozb/pawthology`, **private**, deployment only when the owner authorizes (for now **we don't deploy**, we serve locally).
- **Public artifact:** when deployed — only `site/`; exams, tests, scenarios, research remain out of deploy.
- **Definition of done:** `validate_game.py .` passes; `node --test tests/` passes; `node tools/replay.js --check` passes the golden suite; factual sign-off `llm-audited` saved in `claims.md` with dates; accessibility smoke (keyboard/touch/reduced-motion/narrow/wide); `python -m http.server` serves `/site/` without console errors; About/Sources view with `claimId` traceability.

## 5. Case Seed (~5, selected for myths)

1. **Paw abrasion/wound** → *M-ANTIBIOTIC-DEFAULT*. Exam: inspection ± cytology. Treatment: cleaning + topical antiseptic; antibiotic only if infected.
2. **Otitis externa (dog)** → *M-EXAM-SKIP / M-SINGLE-SYMPTOM-DX*. Exam: otoscopy + cytology. Treatment: ear drops according to cytology.
3. **Diarrhea — differentiation** (parasites / bacteria / diet) → *M-ANTIBIOTIC-DEFAULT*. Exam: fecal exam. Treatment: antiparasitic vs antibiotic vs diet.
4. **Bone fracture** → *M-ANTIBIOTIC-DEFAULT*. Exam: radiograph. Treatment: stabilization/rest/surgery + analgesia; antibiotic = error (injury without infection).
5. **Fleas/external parasites** → drug group: antiparasitics. Exam: comb/inspection. Treatment: spot-on/tablet.

## 6. Drug Catalog Seed (~15–20, grouped by therapeutic group, real compounds)

- **Topical antiseptics:** chlorhexidine, octenidine, povidone-iodine (attention cat).
- **Ear drops (complex):** antibiotic+antifungal+steroid.
- **Antibiotics:** amoxicillin+clavulanate, metronidazole, cefalexin, enrofloxacin (attention: cartilage in young — didactic point).
- **Antiparasitics:** fenbendazole, praziquantel, pyrantel, emodepside (cat), selamectin, fluralaner.
- **Analgesics/NSAIDs:** meloxicam, carprofen (dog), buprenorphine.
- **Species Toxins (available by mistake, they teach):** acetaminophen/paracetamol (toxic: cat), ibuprofen (toxic: dog, cat).
- **Supportive:** LRS fluids.

## 7. Epistemic Classification (Skill Requirement, visible in About/Sources)

- **Verified:** facts about drugs (indications, species toxicity, mg/kg ranges) — with source citations.
- **Computed:** dose calculation (mg/kg × kg), exam time/cost — explicit formula, tested.
- **Modeled:** patient outcome and severity distribution — simplification with assumptions (they are an approximation, not a prediction).
- **Fictionalized:** case scenarios and patient history (presentation of real medicine).
- **Contested:** out of seed scope (any controversies are excluded from the scored game).

## 8. Decision Log (D1–D10, closed)

| ID | Decision |
|---|---|
| D1 | No named levels. One fair simulator; depth (tooltip→lesson→source) makes it interesting for adults. |
| D2 | Seed: dog + cat, ~5 cases (section 5). |
| D3 | The LLM does a factual sign-off verifying facts in external sources over the internet; `reviewStatus: "llm-audited"`. |
| D4 | Discreet safety message (treatment screen footer + line in About), no modals. |
| D5 | Drug catalog 15–20, grouped by therapeutic group; player selects any and enters any dose; the engine scores. |
| D6 | Interactive dose slider calculating live mg/kg ↔ mg, with a visual safety band. |
| D7 | Points + fair narration of patient outcome; subtle visual degradation (animal lies down / feels worse), no graphic content. |
| D8 | XP unlocks harder cases (`difficulty` field), without tier labels. |
| D9 | Owner `srozb`, `github@rozbicki.eu`. Repo `srozb/pawthology`, **private**, we don't create remote yet, we don't deploy. |
| D10 | UI in Polish; structure ready for i18n (en). |
| D11 | Headless LLM-testability: pure engine + `--trace` runner + golden suite + validator — central pillar. |

## 9. Phases

- **F0** Requirements — ✔ this brief.
- **F1** Data model + schema (species/exams/drugs/diseases/cases/rubrics) + golden-scenario format + validation contracts. Determines extensibility and testability.
- **F2** Exams + drugs + `claims.md` ledger — doses, species toxicity, exam indications; `llm-audited` sign-off via internet (D3).
- **F3** Architecture: pure scoring engine + headless runner + golden suite (F1 already partially), then DOM render + game phases + XP + About/Sources.
- **F4** Implementation: vanilla HTML/CSS/JS, local progress, accessibility, i18n.
- **F5** Validation + audit: `validate_game.py`, `node --test`, `replay --check`, accessibility smoke, local serve.
- **F6** LLM expansion pipeline: schema+validator+scenarios ready in F1; candidate-generation→audit→merge workflow run on demand.
- **F7** Deployment (when authorized): GitHub Pages, only `site/`.
