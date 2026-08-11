// Testy logiki silnika (czyste, bez DOM). node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateCase, availableCases, availableDrugs, availableProcedures, levelFromXp } from "../site/js/game.js";
import { CONTENT } from "../site/data/index.js";

function verdictRules(result) {
  return new Set(result.verdicts.map((v) => v.rule));
}

test("otarcie: poprawne leczenie → recovered, wysokie XP", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw");
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection", "wound-swab-cytology"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 24 }],
    procedures: ["wound-clean-debride"],
    recommendations: ["wound-observation"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-EXAM-NEEDED"));
  assert.ok(rules.has("R-DX-CORRECT"));
  assert.ok(rules.has("R-DRUG-GROUP-MATCH"));
  assert.ok(rules.has("R-PROC-REQUIRED"));
  assert.ok(rules.has("R-REC-REQUIRED"));
  assert.equal(r.patientOutcome, "recovered");
  assert.ok(r.xp >= 65 && r.xp <= 75, "xp w oczekiwanym zakresie, był " + r.xp);
});

test("otarcie: antybiotyk przy braku infekcji → AMR + mismatch", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw");
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "amoxicillin-clavulanate", doseMg: 300 }], // 25 mg/kg
    procedures: ["wound-clean-debride"],
    recommendations: ["wound-observation"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-ABX-IRRATIONAL"));
  assert.ok(rules.has("R-DRUG-GROUP-MISMATCH"));
  assert.ok(!rules.has("R-DX-WRONG"));
});

test("kot + acetaminophen → toksyk gatunkowy → critical", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fleas-cat");
  const r = evaluateCase(c, {
    weightKg: 5,
    exams: ["flea-comb"],
    diagnosis: "flea-infestation",
    treatments: [{ drug: "acetaminophen", doseMg: 50 }],
    procedures: [],
    recommendations: ["treat-environment", "treat-all-pets"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-DRUG-SPECIES-TOXIC"));
  assert.equal(r.patientOutcome, "critical");
});

test("kot + acetaminophen przy biegunce też toksyczny (gatunek > choroba)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-diarrhea-cat");
  const r = evaluateCase(c, {
    weightKg: 4,
    exams: ["fecal-exam"],
    diagnosis: "diarrhea-parasitic",
    treatments: [{ drug: "acetaminophen", doseMg: 100 }],
    procedures: [],
    recommendations: ["rehydration-if-needed", "recheck-fecal-2w"]
  }, CONTENT);
  assert.ok(verdictRules(r).has("R-DRUG-SPECIES-TOXIC"));
  assert.equal(r.patientOutcome, "critical");
});

test("złamanie: buprenorfina poprawna dawka → recovered-ish", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog");
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "buprenorphine", doseMg: 0.36 }], // 0.02 mg/kg
    procedures: ["fracture-osteosynthesis"],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-DX-CORRECT"));
  assert.ok(rules.has("R-DRUG-GROUP-MATCH"));
  assert.ok(rules.has("R-DOSE-IN-RANGE"));
  assert.ok(r.patientOutcome === "recovered" || r.patientOutcome === "improving", r.patientOutcome);
});

test("złamanie: antybiotyk → AMR (uraz bez infekcji)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog");
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "amoxicillin-clavulanate", doseMg: 360 }], // 20 mg/kg, poprawna dawka abx ale irracjonalna
    procedures: ["fracture-osteosynthesis"],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-ABX-IRRATIONAL"));
  assert.ok(rules.has("R-DRUG-GROUP-MISMATCH"));
});

test("niedodawkowanie: dawka bez mnożenia przez wagę → R-DOSE-UNDER", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw");
  // gracz „zapomniał mnożyć": dał 1 mg zamiast 12–25 mg/kg × 12 kg
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "amoxicillin-clavulanate", doseMg: 1 }],
    procedures: ["wound-clean-debride"],
    recommendations: ["wound-observation"]
  }, CONTENT);
  const dose = r.doseBreakdown.find((d) => d.drug === "amoxicillin-clavulanate");
  assert.ok(dose, "brak doseBreakdown dla abx");
  assert.equal(dose.verdict, "under");
  assert.ok(verdictRules(r).has("R-DOSE-UNDER"));
});

test("przedawkowanie: dawka ×10 → R-DOSE-OVER", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog");
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "buprenorphine", doseMg: 3.6 }], // 0.2 mg/kg, 10× za dużo
    procedures: ["fracture-osteosynthesis"],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  const dose = r.doseBreakdown.find((d) => d.drug === "buprenorphine");
  assert.equal(dose.verdict, "over");
  assert.ok(verdictRules(r).has("R-DOSE-OVER"));
});

test("brak wymaganych badań → R-EXAM-MISSED i R-DX-LUCKY (trafiona w ciemno)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-otitis-dog");
  const r = evaluateCase(c, {
    weightKg: 22,
    exams: ["physical-exam"], // brak otoskopii i cytologii
    diagnosis: "otitis-externa", // trafiona, ale bez badań
    treatments: [{ drug: "ear-drops-complex", doseMg: 0 }]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-EXAM-MISSED"));
  assert.ok(rules.has("R-DX-LUCKY"), `spodziewano R-DX-LUCKY, mam: ${[...rules].join(", ")}`);
  assert.ok(!rules.has("R-DX-BLOCKED"), "trafiona w ciemno to R-DX-LUCKY, nie R-DX-BLOCKED");
  assert.equal(r.dxPossible, false);
});

test("błędna diagnoza bez badań → R-DX-BLOCKED", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-otitis-dog");
  const r = evaluateCase(c, {
    weightKg: 22,
    exams: ["physical-exam"],
    diagnosis: "diarrhea-bacterial", // błędna diagnoza bez badań
    treatments: [{ drug: "amoxicillin-clavulanate", doseMg: 300 }]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-DX-BLOCKED"));
  assert.ok(!rules.has("R-DX-LUCKY"));
  assert.equal(r.patientOutcome, "not-responding");
});

test("zbędne badanie (panel krwi) → R-EXAM-REDUNDANT", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw");
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection", "blood-panel"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 24 }]
  }, CONTENT);
  assert.ok(verdictRules(r).has("R-EXAM-REDUNDANT"));
});

test("determinizm: ten sam input → ten sam wynik", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-diarrhea-cat");
  const d = { weightKg: 4, exams: ["fecal-exam"], diagnosis: "diarrhea-parasitic",
              treatments: [{ drug: "fenbendazole", doseMg: 200 }] }; // 50 mg/kg
  const a = evaluateCase(c, d, CONTENT);
  const b = evaluateCase(c, d, CONTENT);
  assert.deepEqual(a, b);
});

test("topical: brak oceny dawki (chlorheksydyna nie daje R-DOSE-*)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw");
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 999 }] // topical — dawka niepunktowana
  }, CONTENT);
  assert.ok(!verdictRules(r).has("R-DOSE-OVER"));
  assert.ok(!verdictRules(r).has("R-DOSE-UNDER"));
  assert.equal(r.doseBreakdown.length, 0);
});

test("ibuprofen u psa → toksyk gatunkowy (z species.toxicDrugs)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog");
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "ibuprofen", doseMg: 400 }],
    procedures: ["fracture-osteosynthesis"],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  assert.ok(verdictRules(r).has("R-DRUG-SPECIES-TOXIC"));
  assert.equal(r.patientOutcome, "critical");
});

test("brak leczenia przy zaleconej grupie → R-NO-TREATMENT", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog");
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: []
  }, CONTENT);
  assert.ok(verdictRules(r).has("R-NO-TREATMENT"));
});

test("każdy werdykt ma rule + claimId + delta", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-otitis-dog");
  const r = evaluateCase(c, {
    weightKg: 22,
    exams: ["otoscopy", "ear-cytology"],
    diagnosis: "otitis-externa",
    treatments: [{ drug: "ear-drops-complex", doseMg: 0 }]
  }, CONTENT);
  assert.ok(r.verdicts.length > 0);
  r.verdicts.forEach((v) => {
    assert.ok(typeof v.rule === "string" && v.rule.startsWith("R-"), "rule: " + v.rule);
    assert.ok(typeof v.claimId === "string" && v.claimId.startsWith("C-"), "claimId: " + v.claimId);
    assert.equal(typeof v.delta, "number");
    assert.ok(typeof v.detailPl === "string" && v.detailPl.length > 0);
  });
});

test("availableCases: progresywne odblokowanie przez XP", () => {
  const easy = availableCases(CONTENT, 0);
  assert.ok(easy.includes("case-abrasion-paw"));
  // Poziom 2 odblokowuje się przy 150 XP (5 przypadków poziomu 1, próg 48% — dla gracza, który nie musi grać idealnie).
  const justUnder = availableCases(CONTENT, 149);
  assert.ok(!justUnder.includes("case-diarrhea-cat"), "diarrhea locked below level-2 gate");
  const atGate = availableCases(CONTENT, 150);
  assert.ok(atGate.includes("case-diarrhea-cat"), "diarrhea unlocked at level-2 gate");
  // fracture-dog rozłożone na 200 XP.
  const more = availableCases(CONTENT, 210);
  assert.ok(more.includes("case-fracture-dog"));
  assert.ok(more.length >= easy.length);
});

// === Progresywne odblokowanie leków/zabiegów/operacji (minLevel) ===

test("levelFromXp: poziom gracza z totalXp", () => {
  assert.equal(levelFromXp(CONTENT, 0), 1, "0 XP = poziom 1");
  assert.equal(levelFromXp(CONTENT, 149), 1, "poniżej progu L2 = poziom 1");
  assert.equal(levelFromXp(CONTENT, 150), 2, "próg L2 (150) = poziom 2");
  assert.equal(levelFromXp(CONTENT, 399), 2, "poniżej progu L3 = poziom 2");
  assert.equal(levelFromXp(CONTENT, 400), 3, "próg L3 (400) = poziom 3");
});

test("availableDrugs: filtry minLevel — imidocarb tylko na L3", () => {
  const l1 = availableDrugs(CONTENT, 1);
  const l3 = availableDrugs(CONTENT, 3);
  assert.ok(!l1.some((d) => d.id === "imidocarb"), "imidocarb (antiprotozoal) ukryty na L1");
  assert.ok(l3.some((d) => d.id === "imidocarb"), "imidocarb dostępny na L3");
  assert.ok(l1.length < l3.length, "L3 ma więcej leków niż L1");
  // L1 ma wszystkie grupy oprócz antiprotozoal (trapy AMR/toksycznosć zostają — to lekcja)
  assert.ok(l1.some((d) => d.groupId === "antibiotic"), "antybiotyk (trapa AMR) dostępny na L1");
  assert.ok(l1.some((d) => d.groupId === "otc-human-analgesic"), "otc (trapa toksycznosci) dostępny na L1");
  assert.ok(!l1.some((d) => d.groupId === "antiprotozoal"), "antiprotozoal ukryty na L1");
});

test("availableProcedures: zabiegi/operacje filtrowane wg poziomu", () => {
  // L1: 3 zabiegi, 0 operacji (sekcja operacji ukryta)
  const l1proc = availableProcedures(CONTENT, 1, "procedure");
  const l1surg = availableProcedures(CONTENT, 1, "surgery");
  assert.equal(l1surg.length, 0, "brak operacji na L1 (sekcja operacji ukryta)");
  assert.ok(!l1proc.some((p) => p.id === "fracture-stabilize-splint"), "szyna (złamanie L2) ukryta na L1");
  assert.ok(l1proc.some((p) => p.id === "wound-clean-debride"), "oczyszczanie rany (L1) dostępne");
  // L2: + szyna + operacja osteosyntezy
  const l2proc = availableProcedures(CONTENT, 2, "procedure");
  const l2surg = availableProcedures(CONTENT, 2, "surgery");
  assert.ok(l2proc.some((p) => p.id === "fracture-stabilize-splint"), "szyna dostępna na L2");
  assert.ok(l2surg.some((p) => p.id === "fracture-osteosynthesis"), "osteosynteza dostępna na L2");
});

test("winnability: każdy przypadek wygralny na swoim poziomie", () => {
  // Dla każdego przypadku trudności D: wszystkie leki z grup zalecanych + expectedProcedures/Surgeries
  // mają minLevel <= D (inaczej gracz na poziomie D nie ma czym wyleczyć).
  for (const cs of CONTENT.cases) {
    const d = CONTENT.diseases.find((x) => x.id === cs.trueDiagnosis);
    assert.ok(d, `choroba dla ${cs.id}`);
    for (const grp of (d.recommendedGroups || [])) {
      for (const drug of CONTENT.drugs.filter((x) => x.groupId === grp)) {
        assert.ok(
          (drug.minLevel ?? 1) <= cs.difficulty,
          `${cs.id} (L${cs.difficulty}): lek ${drug.id} [${grp}] minLevel=${drug.minLevel ?? 1} > ${cs.difficulty} — niewygralny`
        );
      }
    }
    for (const pid of [...(cs.expectedProcedures || []), ...(cs.expectedSurgeries || [])]) {
      const p = CONTENT.procedures.find((x) => x.id === pid);
      assert.ok(p, `zabieg ${pid} istnieje`);
      assert.ok(
        (p.minLevel ?? 1) <= cs.difficulty,
        `${cs.id} (L${cs.difficulty}): zabieg ${pid} minLevel=${p.minLevel ?? 1} > ${cs.difficulty} — niewygralny`
      );
    }
  }
});

// === NOWE REGUŁY: zabiegi, operacje, zalecenia ===
// verdictRules(r) = Set(r.verdicts.map(v => v.rule)) — helper już zdefiniowany powyżej.

test("zabieg wymagany zlecony → R-PROC-REQUIRED", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-malocclusion-rabbit"); // Dodo, 2.2 kg
  const r = evaluateCase(c, {
    weightKg: 2.2,
    exams: ["physical-exam", "radiograph"],
    diagnosis: "malocclusion",
    treatments: [{ drug: "meloxicam", doseMg: 1.1 }], // 0.5 mg/kg
    procedures: ["incisor-trim-bur"],
    recommendations: ["hay-diet", "recheck-teeth-3m"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-PROC-REQUIRED"));
  assert.equal(r.patientOutcome, "recovered");
});

test("brak wymaganego zabiegu → R-PROC-MISSING + improving (nie recovered)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-malocclusion-rabbit"); // Dodo, 2.2 kg
  const r = evaluateCase(c, {
    weightKg: 2.2,
    exams: ["physical-exam", "radiograph"],
    diagnosis: "malocclusion",
    treatments: [{ drug: "meloxicam", doseMg: 1.1 }], // 0.5 mg/kg
    procedures: [],
    recommendations: ["hay-diet", "recheck-teeth-3m"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-PROC-MISSING"));
  assert.equal(r.patientOutcome, "improving");
});

test("FIC: lek tylko wspomagajacy (opioid=analgezja) — brak leku + zalecenia → improving (nie not-responding)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-feline-cystitis"); // Bazyl, 5 kg
  const d = CONTENT.diseases.find((x) => x.id === "feline-cystitis");
  assert.ok(d.drugIsSupportive, "FIC powinno miec drugIsSupportive (opioid = analgezja, nie kuratywny)");
  const r = evaluateCase(c, {
    weightKg: 5,
    exams: ["physical-exam", "urinalysis"],
    diagnosis: "feline-cystitis",
    treatments: [], // brak opioidu — ale brak tez antybiotyku (przeciwwskazany)
    procedures: [],
    recommendations: ["increase-water-intake", "stress-reduction"] // 2/3 zalecen
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-NO-TREATMENT"), "brak leku pierwszej linii → R-NO-TREATMENT (karyfikacja XP)");
  assert.ok(!rules.has("R-DRUG-CONTRAINDICATED"), "nie podano szkodliwego leku");
  // FIC samaustepujace: bez analgezji, ale z zaleceniami domowymi → poprawa (nie not-responding)
  assert.equal(r.patientOutcome, "improving", "FIC bez opioidu + zalecenia → improving (nie not-responding)");
});

test("operacja wymagana zlecona → R-SURG-REQUIRED", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog"); // Frodo, 18 kg
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "buprenorphine", doseMg: 0.36 }], // 0.02 mg/kg
    procedures: ["fracture-osteosynthesis"],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-SURG-REQUIRED"));
  assert.equal(r.patientOutcome, "recovered");
});

test("brak operacji → R-SURG-MISSING + improving", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog"); // Frodo, 18 kg
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "buprenorphine", doseMg: 0.36 }], // 0.02 mg/kg
    procedures: [],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-SURG-MISSING"));
  assert.equal(r.patientOutcome, "improving");
});

test("szyna ALTERNATYWA zamiast operacji → R-PROC-REQUIRED + brak R-SURG-MISSING + recovered", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog"); // Frodo, 18 kg
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "buprenorphine", doseMg: 0.36 }], // 0.02 mg/kg
    procedures: ["fracture-stabilize-splint"],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-PROC-REQUIRED"), "szyna jako alternatywa powinna odpalić R-PROC-REQUIRED");
  assert.ok(!rules.has("R-SURG-MISSING"));
  assert.equal(r.patientOutcome, "recovered");
});

test("zarówno operacja jak szyna → R-PROC-EXTRA", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-fracture-dog"); // Frodo, 18 kg
  const r = evaluateCase(c, {
    weightKg: 18,
    exams: ["radiograph"],
    diagnosis: "fracture",
    treatments: [{ drug: "buprenorphine", doseMg: 0.36 }], // 0.02 mg/kg
    procedures: ["fracture-osteosynthesis", "fracture-stabilize-splint"],
    recommendations: ["strict-rest", "recheck-radiograph"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-PROC-EXTRA"));
});

test("zbędny zabieg → R-PROC-EXTRA", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw"); // Cody, 12 kg
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection", "wound-swab-cytology"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 24 }],
    procedures: ["incisor-trim-bur"], // obcy zabieg (dla królika), zbędny przy otarciu
    recommendations: ["wound-observation"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-PROC-EXTRA"));
});

test("zalecenie wymagane zlecone → R-REC-REQUIRED", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw"); // Cody, 12 kg
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection", "wound-swab-cytology"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 24 }],
    procedures: ["wound-clean-debride"],
    recommendations: ["wound-observation"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-REC-REQUIRED"));
});

test("brak zalecenia → R-REC-MISSING", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw"); // Cody, 12 kg
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection", "wound-swab-cytology"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 24 }],
    procedures: ["wound-clean-debride"],
    recommendations: []
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-REC-MISSING"));
});

test("zbędne zalecenie → R-REC-EXTRA", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw"); // Cody, 12 kg
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection", "wound-swab-cytology"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 24 }],
    procedures: ["wound-clean-debride"],
    recommendations: ["wound-observation", "hay-diet"] // hay-diet — zbędne przy otarciu (dla królika)
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-REC-EXTRA"));
});

test("zbędna operacja (kind=surgery) → R-SURG-EXTRA (-10), nie R-PROC-EXTRA (-5)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-abrasion-paw"); // Cody, otarcie — operacja zupełnie obca
  const r = evaluateCase(c, {
    weightKg: 12,
    exams: ["wound-inspection", "wound-swab-cytology"],
    diagnosis: "uncomplicated-abrasion",
    treatments: [{ drug: "chlorhexidine", doseMg: 24 }],
    procedures: ["fracture-osteosynthesis"], // operacja złamania przy otarciu — zbędna
    recommendations: ["wound-observation"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-SURG-EXTRA"), "zbędna operacja powinna odpalić R-SURG-EXTRA, nie R-PROC-EXTRA");
  assert.ok(!rules.has("R-PROC-EXTRA"));
});

test("fenbendazol ma pasmo bezpieczeństwa (regresja: punktowe min==max było nietrafialne przy kroku suwaka)", () => {
  const d = CONTENT.drugs.find((x) => x.id === "fenbendazole");
  const b = d.dosing.cat.mgPerKg;
  assert.ok(b.min < b.max, `fenbendazol musi mieć pasmo (min<max), jest ${b.min}-${b.max} — punktowe min==max powoduje, że suwak nie trafia dokładnie 50 mg/kg`);
  assert.ok(b.min <= 50 && 50 <= b.max, "50 mg/kg (dawka celowa z MVM) musi być w paśmie");
});

test("fenbendazol 100 mg dla 2 kg kota = w paśmie (przypadek Jami/glistnica)", () => {
  const c = CONTENT.cases.find((x) => x.id === "case-roundworm-cat");
  const r = evaluateCase(c, {
    weightKg: 2, exams: ["fecal-exam"], diagnosis: "roundworm-infestation",
    treatments: [{ drug: "fenbendazole", doseMg: 100 }], // 50 mg/kg — w środku pasma 45-55
    recommendations: ["wound-observation"]
  }, CONTENT);
  const rules = verdictRules(r);
  assert.ok(rules.has("R-DOSE-IN-RANGE"), "100 mg = 50 mg/kg musi być w paśmie (regresja na bug niemożliwej dawki)");
});

test("katalog: dane encyklopedii są kompletne (infoPl/infoEn dla badań/chorób/leków/zabiegów/zaleceń)", () => {
  // katalog (encyclopedia) reużywa infoPl/infoEn — bez nich karta pokazuje placeholder
  for (const e of CONTENT.exams) assert.ok(e.infoPl, `badanie ${e.id} bez infoPl (katalog pokaze placeholder)`);
  for (const d of CONTENT.diseases) assert.ok(d.infoPl, `choroba ${d.id} bez infoPl`);
  for (const d of CONTENT.drugs) assert.ok(d.infoPl, `lek ${d.id} bez infoPl`);
  for (const p of CONTENT.procedures) assert.ok(p.infoPl, `zabieg ${p.id} bez infoPl`);
  for (const r of CONTENT.recommendations) assert.ok(r.infoPl, `zalecenie ${r.id} bez infoPl`);
});
