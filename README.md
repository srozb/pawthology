# Pawthology

**Small Animal Clinical Decision Simulator (SPA / JS)** — gamification of small animal veterinary education. You take over a shift at the clinic: you admit the patient, order tests, make a diagnosis, prescribe treatment with real medications in mg/kg doses — and face the real consequences of every decision.

**Play online:** <https://pawthology.online>

## What is it about

Pawthology is an educational game designed to be **fun for both a 10-year-old and an adult** (pet owner, veterinary student). Under the guise of entertainment, it smuggles in a lot of professional knowledge: real diseases, tests, medications and their mechanisms of action, species toxicity, rationality of antibiotic therapy (AMR). The game does not simplify the knowledge "for children" — simplifications are only in the interface (hints, tooltips, navigation), while the learning remains real.

Beyond veterinary medicine itself, the game also practices more general skills:

- **Reading comprehension** — patient histories, test descriptions, and results to read with understanding.
- **Analytical thinking** — selecting tests for differential diagnosis, reasoning from results, weighing risks and costs.
- **Math** — calculating doses `mg/kg × kg = mg`, unit conversion, dose safety margins.

## For whom

- **Children (from ~10 years old)** — they weigh the animal, calculate the dose `mg/kg × kg = mg`, learn why not every wound needs an antibiotic. No "childish simplifications" — the knowledge is real, and the interface helps (tooltips, hints, ℹ buttons with explanations).
- **Adults and veterinary students** — species toxicity (cat vs dog), rationality of antibiotic therapy (AMR), systemic vs topical dosing, contraindications. The game does not hold your hand; the depth (tooltip → lesson → source) makes it interesting at any level.

## Local setup

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/site/` in your browser.

> The game is a static site (vanilla HTML/CSS/JS, ES modules, no build process, no runtime network, privacy-friendly analytics (GoatCounter)). Serve it via any HTTP server — ES modules require a server, not `file://`.

## Debug mode (URL)

For testing progression without grinding through every case, append a flag to the site URL:

- `…/site/#unlocked` (also `#debug`, or `?debug=true` / `?debug=1`) — **all patients unlocked**, full drug/procedure/surgery catalog (level 3), **XP frozen** (it stops counting and never touches your real save in `localStorage`).
- `…/site/?xp=2000` — **set total XP to 2000** (frozen for the session). Unlocks follow the normal thresholds, so e.g. `?xp=150` opens level 2, `?xp=400` opens everything.
- Both can be combined: `…/site/?xp=150#unlocked`.

Notes:
- The amber **DEBUG** pill in the header shows the active mode (hover for details).
- In debug mode your real `localStorage` save (best XP, outcomes, history) is **never modified** — per-case XP is still computed and shown on the outcome screen, but it isn't recorded.
- The hash form (`#unlocked`) toggles **live** (no reload); query params (`?xp=N`) need a page reload.

## Testing and validation

```bash
node --test                          # engine logic tests (clean, no DOM) — no path in ESM!
node tools/replay.js --check         # golden suite, exit≠0 on fail
node tools/replay.js --lang en        # check translation completeness (i18n)
node tools/explore.js --all          # answer key + Invariant scoring for each case
node tools/validate_game.js .      # data consistency + validity of progressive unlock
node tools/derive_levels.js --check  # minLevel consistent with case dependencies
python3 tools/scaffold_case.py --check <caseId>  # case completeness
```

Full verification (everything must be green): `validate_game.js` → `derive_levels --check` → `node --test` → `replay --check` → `explore --all` → `replay --lang en`.

## Mechanics (5 phases per case)

1. **Admission** — signalment, history, symptoms; patient's weight revealed via interactive scale.
2. **Testing** — the player orders any tests from the catalog (cost, time, purpose); each provides a result (3-paragraph narrative).
3. **Diagnosis** — selecting from a differential list based on test results.
4. **Treatment** — 4 sections (Medications / Procedures / Surgeries / Recommendations); dose slider calculates `mg ↔ mg/kg` live with a safety margin; tooltip for each medication. Medications, procedures, and surgeries unlock progressively with XP.
5. **Consequences** — XP + patient outcome (recovered → critical) + dynamic epilogue with verdicts and references to the claim (`claimId`).

XP accumulates per case (best score) and unlocks more difficult cases and a broader catalog of medications/procedures. There is also a **Clinical Catalog** — a subpage for browsing tests, diseases, medications, procedures, and recommendations without treatment (with the same illustrations and educational content).

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — code structure, engine contract, pillar of headless testability
- [docs/EXTENDING.md](docs/EXTENDING.md) — how to add a medication, species, test, disease, case, tune scoring
- [docs/LLM-PIPELINE.md](docs/LLM-PIPELINE.md) — LLM expansion loop (candidate → validation → source audit → merge)
- [docs/skills/](docs/skills/) — repo-only skills (`pawthology-onboarding`, `pawthology-art-pipeline`) for future LLM sessions
- [research/brief.md](research/brief.md) — full project contract (mission, audience, goals, non-goals, decisions)

## Free and open source

The game is **free and open source**, hosted on GitHub at [`srozb/pawthology`](https://github.com/srozb/pawthology) and deployed at <https://pawthology.online>. The code and content are deliberately structured so that new content can be added **agentically** — using an LLM that generates a candidate (a drug, a case, a disease) and then verifies the facts against authoritative sources before merge (see [docs/LLM-PIPELINE.md](docs/LLM-PIPELINE.md)). Contributions are welcome.

## Limitations and epistemics

**This is a simulation, not a textbook.** Every hard fact in the game has an epistemic class (visible in the About/Sources view and in [research/claims.md](research/claims.md)):

- **Verified** — facts about medications (indications, species toxicity, mg/kg ranges) with source citations (Merck Veterinary Manual, EMA, Plumb's).
- **Computed** — dose calculation (`mg/kg × kg`), explicit formula, tested.
- **Modeled** — patient outcome and severity distribution — a simplification with assumptions.
- **Fictionalized** — case scenarios and patients (presentation of real medicine).

Verification status: `reviewStatus` in `claims.md` — `draft` (to be verified) or `llm-audited` (verified via the internet). The LLM is the author and auditor, **not the source** — the authorities remain the sources.

**Safety:** this is a game teaching real doses, but with a sick animal you always go to the vet. This message is discreetly present in the footer of the treatment screen and in the About view — without intrusive modals.

## Safety

**This is a game, not a textbook or medical advice.** With a sick animal you always see a veterinarian — do not treat it yourself. Therapeutic decisions require credentials and training, and a mistake can cost the patient its life. The game teaches understanding; it does not replace the vet. This message is discreetly present in the footer of the treatment screen and in the About view — without intrusive modals.

## Author and license

- Author: `srozb` (`github@rozbicki.eu`)
- Repo: [`srozb/pawthology`](https://github.com/srozb/pawthology) (public) — live: <https://pawthology.online>
- Stack: vanilla HTML/CSS/JS (ES modules), Node 25+ (tests), Python 3 (validator)
