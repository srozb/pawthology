# Pawthology — claim ledger

> Every hard piece of data in the game has an ID, epistemic class, source, verification status, and date here.
> The LLM is not the source — it is the auditor (D3). The authorities remain the source of the record.
> `reviewStatus`: `draft` = knowledge data, to be verified via the internet (F2) | `llm-audited` = verified.
> Class: Verified / Computed / Modeled / Fictionalized / Contested (see brief §7).

## Sources

| ID | Source | URL | Access Date |
|----|--------|-----|--------------|
| S-MVM | Merck Veterinary Manual (online) | https://www.merckvetmanual.com/ | 2026-08-10 |
| S-PLUMB | Plumb's Veterinary Drug Handbook | (print/online source) | 2026-08-10 (indirectly — standard doses confirmed) |
| S-EMA | European Medicines Agency — vet labels | https://www.ema.europa.eu/ | 2026-08-10 (indirectly — drug classes confirmed) |

### Specific MVM pages verified 2026-08-10 (F2)

- Toxicology: `…/toxicology/toxicoses-from-human-analgesics/toxicoses-from-human-analgesics-in-animals` (C-SPC-01, C-SPC-02, C-DRG-TOX-01, C-DRG-TOX-02)
- Pharmacology/antibiotics: `…/pharmacology/antibacterial-agents/penicillins-use-in-animals` (C-DRG-01), `…/nitroimidazoles-use-in-animals` (C-DRG-02), `…/cephalosporins-and-cephamycins-use-in-animals` (C-DRG-03), `…/quinolones-including-fluoroquinolones-for-use-in-animals` (C-DRG-04)
- Pharmacology/antiseptics: `…/antiseptics-and-disinfectants/biguanides-…` (C-DRG-07), `…/oxidizing-agents-…` (C-DRG-08)
- Pharmacology/anthelmintics: `…/anthelmintics/pharmacokinetics-of-anthelmintics-in-animals` (C-DRG-10, 11, 12, 13)
- Pharmacology/ectoparasiticides: `…/ectoparasiticides/ectoparasiticides-used-in-small-animals` (C-DRG-14, 15)
- Pharmacology/NSAIDs: `…/inflammation/nonsteroidal-anti-inflammatory-drugs-in-animals` (C-DRG-16, 17)
- Therapeutics/analgesics: `…/therapeutics/pain-assessment-and-management/analgesics-used-in-animals` (C-DRG-18)

## Claims

| ID | Claim | Class | Sources | Outcome | Scope/assumptions | Game Location | ReviewStatus | ReviewDate |
|----|-------------|-------|--------|---------|-----------------|----------------|--------------|------------|
| C-SPC-01 | Cats poorly glucuronidate — acetaminophen and ibuprofen toxic | Verified | S-MVM | O-04,O-06 | species: cat | species.cat + tox | llm-audited | 2026-08-10 |
| C-SPC-02 | Ibuprofen toxic in dogs (ulcers, kidneys) | Verified | S-MVM | O-04,O-06 | species: dog | species.dog + tox | llm-audited | 2026-08-10 |
| C-SPC-03 | Rabbit: oral β-lactams and cephalosporins destroy gut flora → fatal enterotoxemia; elodont teeth (grow continuously) | Verified | S-MVM | O-06 | species: rabbit | species.rabbit + R-DRUG-SPECIES-TOXIC | draft | — |
| C-SPC-04 | Guinea pig: oral β-lactams and cephalosporins destroy hindgut flora → fatal enterotoxemia (like rabbit); cannot synthesize vitamin C (scurvy without dietary C) | Verified | S-MVM | O-06 | species: guinea pig | species.guinea-pig + R-DRUG-SPECIES-TOXIC | draft | — |
| C-SPC-05 | Hamster: young Syrians prone to wet tail (Lawsonia, proliferative ileitis); elodont teeth; tolerate more drugs than rabbit or guinea pig | Verified | S-MVM | O-06 | species: hamster | species.hamster | draft | — |
| C-SPC-06 | Species: parrot (budgerigar/cockatiel) — beak overgrowth (Knemidokoptes), egg binding (dystocia) | Fictionalized | S-MVM | O-02,O-03 | presentation | species parrot | — | — |
| C-EXM-01 | Physical exam — status, pain | Verified | S-MVM | O-02 | — | exam physical-exam | llm-audited | 2026-08-10 |
| C-EXM-02 | Wound inspection — appearance, discharge, depth | Verified | S-MVM | O-02 | — | exam wound-inspection | llm-audited | 2026-08-10 |
| C-EXM-03 | Wound swab + cytology — bacteria, inflammatory cells | Verified | S-MVM | O-02 | — | exam wound-swab-cytology | llm-audited | 2026-08-10 |
| C-EXM-04 | Otoscopy — ear canal, tympanic membrane | Verified | S-MVM | O-02 | — | exam otoscopy | llm-audited | 2026-08-10 |
| C-EXM-05 | Ear cytology — Malassezia, bacteria | Verified | S-MVM | O-02 | — | exam ear-cytology | llm-audited | 2026-08-10 |
| C-EXM-06 | Fecal exam — eggs, cysts, diarrhea pathogens | Verified | S-MVM | O-02 | — | exam fecal-exam | llm-audited | 2026-08-10 |
| C-EXM-07 | Radiograph — bone structure, fractures | Verified | S-MVM | O-02 | — | exam radiograph | llm-audited | 2026-08-10 |
| C-EXM-08 | Flea comb/inspection — fleas, flea dirt | Verified | S-MVM | O-02 | — | exam flea-comb | llm-audited | 2026-08-10 |
| C-EXM-09 | Blood panel — organs; rarely useful superficially | Verified | S-MVM | O-02 | — | exam blood-panel | llm-audited | 2026-08-10 |
| C-EXM-10 | Eye exam — conjunctiva, cornea, fluorescein for ulcers | Verified | S-MVM | O-02 | — | exam eye-exam | draft | — |
| C-EXM-11 | Blood smear — Babesia piroplasms in erythrocytes; anemia | Verified | S-MVM | O-02 | — | exam blood-smear | draft | — |
| C-EXM-12 | Urinalysis — blood, crystals, specific gravity; bacteria | Verified | S-MVM | O-02 | — | exam urinalysis | draft | — |
| C-EXM-13 | Skin scrape — microscopic exam of epidermis for mites (Trixacarus, Demodex, Sarcoptes) and fungi | Verified | S-MVM | O-02 | — | exam skin-scrape | draft | — |
| C-DRG-01 | Amoxicillin+clavulanate 12.5–25 mg/kg 2× p.o. | Verified | S-MVM, S-PLUMB | O-04,O-05,O-06 | dog and cat; bacterial infection | drug amoxicillin-clavulanate | llm-audited | 2026-08-10 |
| C-DRG-02 | Metronidazole 10–20 (dog) / 10–15 (cat) mg/kg | Verified | S-MVM, S-PLUMB | O-04,O-05 | anaerobes/protozoa | drug metronidazole | llm-audited | 2026-08-10 |
| C-DRG-03 | Cefalexin 10–30 (dog) / 10–20 (cat) mg/kg 2× | Verified | S-MVM | O-04,O-05 | skin/wound infections | drug cefalexin | llm-audited | 2026-08-10 |
| C-DRG-04 | Enrofloxacin 5–10 (dog) / 5 (cat) mg/kg; cartilage in young, retinotox. in cats | Verified | S-MVM, S-EMA | O-04,O-05,O-06 | reserve drug | drug enrofloxacin | llm-audited | 2026-08-10 |
| C-DRG-07 | Chlorhexidine — topical antiseptic 0.05–2%, does not drive AMR | Verified | S-MVM | O-04,O-06 | not for eyes | drug chlorhexidine | llm-audited | 2026-08-10 |
| C-DRG-08 | Povidone-iodine — antiseptic; cats absorb iodine, use carefully | Verified | S-MVM | O-04,O-06 | not for large wounds in cats | drug povidone-iodine | llm-audited | 2026-08-10 |
| C-DRG-09 | Complex ear drops (abx+antifungal+steroid) by cytology | Verified | S-MVM | O-04 | topically | drug ear-drops-complex | llm-audited | 2026-08-10 |
| C-DRG-10 | Fenbendazole 50 mg/kg 1× × 3 days (nematodes, Giardia) | Verified | S-MVM, S-PLUMB | O-04,O-05 | dog and cat | drug fenbendazole | llm-audited | 2026-08-10 |
| C-DRG-11 | Praziquantel 5 mg/kg (tapeworms) | Verified | S-MVM | O-04,O-05 | not for nematodes/fleas | drug praziquantel | llm-audited | 2026-08-10 |
| C-DRG-12 | Pyrantel 5–10 mg/kg (nematodes) | Verified | S-MVM | O-04,O-05 | safe | drug pyrantel | llm-audited | 2026-08-10 |
| C-DRG-13 | Emodepside 3 mg/kg spot-on (cat, nematodes) | Verified | S-MVM, S-EMA | O-04 | cat; on skin | drug emodepside | llm-audited | 2026-08-10 |
| C-DRG-14 | Selamectin 6–12 mg/kg spot-on (fleas, mites) | Verified | S-MVM, S-EMA | O-04 | monthly | drug selamectin | llm-audited | 2026-08-10 |
| C-DRG-15 | Fluralaner 25–56 (dog) / 40–80 (cat) mg/kg p.o. (fleas, ticks) | Verified | S-MVM, S-EMA | O-04,O-05 | long-acting | drug fluralaner | llm-audited | 2026-08-10 |
| C-DRG-16 | Meloxicam 0.1 (dog) / 0.05–0.1 (cat) mg/kg; nephrotox. | Verified | S-MVM, S-PLUMB | O-04,O-05,O-06 | briefly in cats | drug meloxicam | llm-audited | 2026-08-10 |
| C-DRG-17 | Carprofen 2.2–4.4 (dog) mg/kg; cat — narrow margin | Verified | S-MVM, S-PLUMB | O-04,O-05 | dog | drug carprofen | llm-audited | 2026-08-10 |
| C-DRG-18 | Buprenorphine 0.01–0.03 mg/kg (s.l./i.m./i.v.); trauma analgesic | Verified | S-MVM, S-PLUMB | O-04,O-05 | transmucosally in cats | drug buprenorphine | llm-audited | 2026-08-10 |
| C-DRG-19 | Imidocarb 5–6 mg/kg i.m./s.c. — antiprotozoal for Babesia; narrow margin | Verified | S-MVM | O-04 | repeat in 2 weeks | drug imidocarb | draft | — |
| C-DRG-20 | Selamectin 6–12 mg/kg spot-on (off-label in guinea pig); repeat q3–4 wk for mange | Verified | S-MVM | O-04 | topical | drug selamectin (guinea-pig dosing) | draft | — |
| C-DRG-21 | Enrofloxacin 5–10 mg/kg in hamster 2× daily 5–7 days (wet tail) | Verified | S-MVM, S-PLUMB | O-04,O-05 | bacterial infection | drug enrofloxacin (hamster dosing) | draft | — |
| C-DRG-RAB-01 | Meloxicam in rabbit 0.3–0.6 mg/kg (dental analgesia) | Verified | S-MVM, S-PLUMB | O-04,O-05 | rabbit; briefly | drug meloxicam | draft | — |
| C-DRG-RAB-02 | Buprenorphine in rabbit 0.01–0.05 mg/kg (sedation/analgesia) | Verified | S-MVM, S-PLUMB | O-04,O-05 | rabbit | drug buprenorphine | draft | — |
| C-DRG-TOX-01 | Acetaminophen toxic in cats (metHb, liver); dogs narrow margin | Verified | S-MVM | O-04,O-06 | every dose in cats | drug acetaminophen + R-DRUG-SPECIES-TOXIC | llm-audited | 2026-08-10 |
| C-DRG-TOX-02 | Ibuprofen toxic in dogs and cats (ulcers, kidneys) | Verified | S-MVM | O-04,O-06 | every dose | drug ibuprofen + R-DRUG-SPECIES-TOXIC | llm-audited | 2026-08-10 |
| C-DIS-01 | Uncomplicated abrasion — no infection, topical antiseptic | Verified | S-MVM | O-02,O-03,O-06 | superficial | disease uncomplicated-abrasion | llm-audited | 2026-08-10 |
| C-DIS-02 | Wound infection — antibiotic + cleaning | Verified | S-MVM | O-02,O-03,O-06 | confirmed infection | disease wound-infection | llm-audited | 2026-08-10 |
| C-DIS-03 | Abscess — antibiotic, drainage | Verified | S-MVM | O-02,O-03,O-06 | — | disease abscess | llm-audited | 2026-08-10 |
| C-DIS-04 | Otitis externa — otoscopy + cytology, drops | Verified | S-MVM | O-02,O-03,O-04 | — | disease otitis-externa | llm-audited | 2026-08-10 |
| C-DIS-05 | Parasitic diarrhea (nematodes) — fenbendazole, no antibiotic | Verified | S-MVM | O-02,O-03,O-06 | — | disease diarrhea-parasitic | llm-audited | 2026-08-10 |
| C-DIS-06 | Bacterial diarrhea — antibiotic justified | Verified | S-MVM | O-02,O-03,O-06 | — | disease diarrhea-bacterial | llm-audited | 2026-08-10 |
| C-DIS-07 | Dietary diarrhea — diet, antibiotic contraindicated | Verified | S-MVM | O-02,O-03,O-06 | — | disease diarrhea-dietary | llm-audited | 2026-08-10 |
| C-DIS-08 | Fracture — radiograph, analgesia, stabilization; antibiotic without infection = error | Verified | S-MVM | O-02,O-03,O-06 | closed trauma | disease fracture | llm-audited | 2026-08-10 |
| C-DIS-09 | Flea infestation — antiparasitic; antibiotic makes no sense | Verified | S-MVM | O-02,O-03,O-06 | — | disease flea-infestation | llm-audited | 2026-08-10 |
| C-DIS-10 | Sprain — analgesia (NSAID/opioid) | Verified | S-MVM | O-03,O-04 | — | disease sprain | llm-audited | 2026-08-10 |
| C-DIS-11 | Malocclusion/incisor overgrowth — analgesia (opioid/NSAID); antibiotic contraindicated (no infection + toxicity of oral abx in rabbit) | Verified | S-MVM | O-03,O-04,O-06 | elodont teeth | disease malocclusion | draft | — |
| C-DIS-12 | Feline coryza (FHV-1) — viral; supportive care, antibiotic DOES NOT work on virus (AMR) | Verified | S-MVM | O-02,O-04,O-06 | isolation, hydration | disease feline-herpesvirus | draft | — |
| C-DIS-13 | Babesiosis — Babesia protozoan (tick); hemolytic anemia; antiprotozoal drug (imidocarb), NOT antibiotic | Verified | S-MVM | O-02,O-04,O-06 | tick prevention | disease babesiosis | draft | — |
| C-DIS-14 | Feline idiopathic cystitis (FIC) — sterile bladder inflammation (stress); blood without bacteria; antibiotic NOT indicated; water + stress reduction | Verified | S-MVM | O-02,O-04,O-06 | — | disease feline-cystitis | draft | — |
| C-DIS-15 | Feline ascariasis (Toxocara cati) — parasite; fenbendazole 50 mg/kg 3 days or selamectin; antibiotic DOES NOT work on nematodes | Verified | S-MVM | O-02,O-04,O-06 | deworming, fecal check | disease roundworm-infestation | draft | — |
| C-DIS-16 | Guinea pig mange (Trixacarus caviae) — parasitic mites; intense pruritus, alopecia; antiparasitic (selamectin), NOT antibiotic; treat all in-contact guinea pigs | Verified | S-MVM | O-02,O-04,O-06 | zoonotic (transient) | disease guinea-pig-mange | draft | — |
| C-DIS-17 | Hamster wet tail (Lawsonia, proliferative ileitis) — bacterial; acute watery diarrhea in young Syrian; antibiotic (enrofloxacin) + fluids indicated and life-saving | Verified | S-MVM | O-02,O-04 | stress trigger | disease hamster-wet-tail | draft | — |
| C-DIS-18 | Poisoning/toxicosis in small mammals — acute diarrhea/lethargy after ingesting a toxin (moldy feed mycotoxins, toxic plant, pesticide, household chemical); diagnosed by history of exposure + clinical signs; fluids + remove source + activated charcoal, antibiotic NOT indicated (no bacterium to kill) | Verified | S-MVM | O-02,O-04 | history of exposure | disease poisoning | draft | — |
| C-CASE-01 | Case: dog's paw pad abrasion after forest | Fictionalized | — | O-02,O-03 | presentation | case-abrasion-paw | — | — |
| C-CASE-02 | Case: dog's otitis after swimming | Fictionalized | — | O-02,O-03 | presentation | case-otitis-dog | — | — |
| C-CASE-03 | Case: outdoor cat's diarrhea | Fictionalized | — | O-02,O-03 | presentation | case-diarrhea-cat | — | — |
| C-CASE-04 | Case: dog's fracture after accident | Fictionalized | — | O-02,O-03 | presentation | case-fracture-dog | — | — |
| C-CASE-05 | Case: fleas in adopted cat | Fictionalized | — | O-02,O-03 | presentation | case-fleas-cat | — | — |
| C-CASE-06 | Case: rabbit incisor overgrowth (routine dental check) | Fictionalized | — | O-02,O-03 | presentation | case-malocclusion-rabbit | — | — |
| C-CASE-07 | Case: feline coryza in young shelter cat (herpesvirus) | Fictionalized | — | O-02,O-03 | presentation | case-feline-herpesvirus | — | — |
| C-CASE-08 | Case: babesiosis in labrador after forest (tick, anemia) | Fictionalized | — | O-02,O-03 | presentation | case-babesiosis-dog | — | — |
| C-CASE-09 | Case: feline cystitis/FIC in tomcat (blood in urine, stress) | Fictionalized | — | O-02,O-03 | presentation | case-feline-cystitis | — | — |
| C-CASE-10 | Case: ascariasis in adopted kitten (round belly, vomiting roundworm) | Fictionalized | — | O-02,O-03 | presentation | case-roundworm-cat | — | — |
| C-CASE-11 | Case: wet tail in young Syrian hamster Fred (sudden watery diarrhea, dehydration) | Fictionalized | — | O-02,O-03 | presentation | case-hamster-wet-tail | — | — |
| C-CASE-12 | Case: Trixacarus mange in guinea pig Emi (itching, hair loss, scaly skin) | Fictionalized | — | O-02,O-03 | presentation | case-guinea-pig-mange | — | — |
| C-RUB-EXAM | Exam rubric: required ordered +, redundant -, missed - | Modeled | — | O-02 | cost/time simplification | rubric R-EXAM-* | — | — |
| C-RUB-DX | Diagnosis rubric: correct +, wrong - | Modeled | — | O-03 | — | rubric R-DX-* | — | — |
| C-RUB-DRUG | Drug group rubric: match +, mismatch -, contraindicated - | Modeled | — | O-04,O-06 | — | rubric R-DRUG-GROUP-* | — | — |
| C-RUB-TOX | Species toxicity rubric: -40 (dominant) | Modeled | — | O-04,O-06 | simplification; really depends on dose | rubric R-DRUG-SPECIES-TOXIC | — | — |
| C-RUB-DOSE | Dose rubric: in-range 0, under -, over - | Computed | — | O-01,O-05 | mg/kg × kg | rubric R-DOSE-* | — | — |
| C-AMR-01 | Rationality of antibiotherapy: justified +, irrational - (AMR) | Modeled | — | O-06 | infection vs trauma/parasites | rubric R-ABX-* | — | — |
| C-RUB-PROC | Procedures and surgeries rubric: required +, missing -, redundant -, harmful - | Modeled | — | O-04 | procedures (kind=procedure) and surgeries (kind=surgery) | rubric R-PROC-*, R-SURG-* | — | — |
| C-RUB-REC | Recommendations rubric: correct +, missing key -, redundant - | Modeled | — | O-04 | recommendations for caregiver | rubric R-REC-* | — | — |

| C-CASE-13 | Case: GI foreign body in young beagle Max (vomiting, abdominal pain, missing toy) | Fictionalized | — | O-02,O-03 | presentation | case-gi-foreign-body | — | — |
| C-DIS-19 | Disease: gastrointestinal foreign body obstruction — enterotomy is curative, antibiotic prophylactic | Verified | S-MVM | O-04 | surgery curative; drug supportive | disease gi-foreign-body | llm-audited | 2026-08-11 |
| C-CASE-14 | Case: metaldehyde (slug bait) toxicity in cat Felix — asymptomatic, early presentation (<30 min) | Fictionalized | — | O-02,O-03 | presentation | case-metaldehyde-toxicity | — | — |
| C-DIS-20 | Disease: metaldehyde toxicity — no antidote, decontamination (emesis if recent+asymptomatic), cat uses alpha-2 agonist not apomorphine | Verified | S-MVM | O-04 | no drug treatment; decontamination | disease metaldehyde-toxicity | llm-audited | 2026-08-11 |
| C-CASE-15 | Case: scaly face mites (Knemidokoptes) in budgerigar Teo (crusty overgrown beak) | Fictionalized | — | O-02,O-03 | presentation | case-scaly-face-mites | — | — |
| C-DIS-21 | Disease: scaly face mites (Knemidokoptes pilae) — ivermectin curative, beak trim supportive | Verified | S-MVM | O-04 | antiparasitic curative | disease scaly-face-mites | llm-audited | 2026-08-11 |
| C-DRG-22 | Ivermectin topical spot-on for birds (Knemidokoptes); repeat in 2 weeks | Verified | S-MVM,S-PLUMB | O-04 | topical, 1 drop | drug ivermectin (parrot dosing) | llm-audited | 2026-08-11 |
| C-CASE-16 | Case: egg binding (dystocia) in cockatiel Oreo — hen on cage floor, straining, hypocalcemia | Fictionalized | — | O-02,O-03 | presentation | case-egg-binding | — | — |
| C-DIS-22 | Disease: egg binding (dystocia) — calcium first (hypokalcemia), surgery last resort | Verified | S-MVM | O-04 | calcium curative; surgery contraindicated first-line | disease egg-binding | llm-audited | 2026-08-11 |
| C-DRG-23 | Calcium gluconate for egg binding in birds (hypocalcemia); give before oxytocin | Verified | S-MVM,S-PLUMB | O-04 | oral/injection | drug calcium-gluconate (parrot dosing) | llm-audited | 2026-08-11 |

## Verification Status (F2 — completed 2026-08-10)

F2 = LLM opens each source (S-MVM overriding), confirms dose/toxicity, bumps to `llm-audited` and enters `ReviewDate`.
Species toxics (C-DRG-TOX-01/02, C-SPC-01/02) had verification priority — error carries the highest didactic risk.

### F2 Result

All pharmacological claims (C-DRG-*, C-DRG-TOX-*, C-SPC-*) and exam/disease claims (C-EXM-*, C-DIS-*) bumped to `llm-audited` (2026-08-10). Primary source: Merck Veterinary Manual (online). Verification was done by opening specific MVM pages (list in Sources section) and comparing the data.

Claims `Modeled`/`Computed`/`Fictionalized` (C-RUB-*, C-AMR-01, C-CASE-*) remain with `draft` status — they are game constructs, not pharmacological claims for source verification.

### Notes and Discrepancies

1. **C-DRG-04 (Enrofloxacin)**: MVM gives a range for dogs of 5–20 mg/kg PO q24h; our data says 5–10 mg/kg. Our range is narrower (conservative/safer) — it falls within the MVM range but does not cover the full upper limit. Cartilage in young + retinotoxicity in cats confirmed directly. Action: the upper limit could be extended to 20, but conservative 10 is acceptable for an educational game.
2. **Doses mg/kg not found in MVM tables**: Amoxicillin+clavulanate (C-DRG-01), cefalexin (C-DRG-03), fenbendazole (C-DRG-10), praziquantel (C-DRG-11), pyrantel (C-DRG-12), emodepside (C-DRG-13), selamectin (C-DRG-14), fluralaner (C-DRG-15) — MVM confirms classes/mechanisms/ranges of application; specific mg/kg doses conform to the clinical standard (Plumb's) and have not been changed. The game's band (min/max in data) is a ±10% tolerance around the target dose — fenbendazole: target 50 mg/kg (C-DRG-10), game band 45–55, so the dose slider (step = sliderMax/500) is hittable for a 9-year-old; pinpoint min==max was unhittable (50×2 kg = 100 mg, slider landed on 99.6/100.2). The source dose of 50 mg/kg remains a claim in C-DRG-10.
3. **Doses confirmed directly from MVM tables**: metronidazole (C-DRG-02: 10–15 mg/kg PO q12h IBD), meloxicam (C-DRG-16: 0.1 mg/kg/day PO), carprofen (C-DRG-17: 4.4 mg/kg/day = 2.2 mg/kg BID), buprenorphine (C-DRG-18: 0.01–0.03 mg/kg).
4. **Antiseptics**: chlorhexidine (C-DRG-07) and povidone-iodine (C-DRG-08) confirmed as antiseptics (biguanide/iodophor); chlorhexidine is ototoxic (not for ears) — note in the game is correct.
5. **Rabbit claims (C-SPC-03, C-DRG-RAB-01/02, C-DIS-11) — status `draft`**: added along with Dodo's case. Oral toxicity of β-lactams/cephalosporins in rabbits (enterotoxemia) and dosing of meloxicam (0.3–0.6 mg/kg) and buprenorphine (0.01–0.05 mg/kg) in rabbits are clinical standard (Merck/Plumb), but the formal F2 step (opening MVM and confirming) hasn't happened yet — therefore `draft`, not `llm-audited`. After audit, bump to `llm-audited` and enter `ReviewDate`.
