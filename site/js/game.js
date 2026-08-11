// Pawthology — CZYSTY SILNIK OCENY.
// Brak importu danych, brak DOM, brak window/fetch. Dostaje CONTENT jako argument (S7).
// Deterministyczny: ten sam (case, decisions, content) → ten sam wynik.
// Wywołanie: evaluateCase(caseObj, decisions, content) → result.
// Każdy werdykt niesie rule + claimId + detailPl/detailEn — to jest ślad,
// którym LLM diagnozuje błędy oceny (filar F0). Szczegóły: research/data-model.md.

export function evaluateCase(caseObj, decisions, content) {
  if (!caseObj || !decisions || !content) throw new TypeError("evaluateCase: requires (case, decisions, content)");
  const verdicts = [];
  const doseBreakdown = [];

  const sp = content.species.find((s) => s.id === caseObj.species);
  if (!sp) throw new Error("Unknown species: " + caseObj.species);
  const disease = content.diseases.find((d) => d.id === caseObj.trueDiagnosis);
  if (!disease) throw new Error("Unknown trueDiagnosis: " + caseObj.trueDiagnosis);

  const weightKg = Number(decisions.weightKg);
  const orderedExams = Array.isArray(decisions.exams) ? decisions.exams.slice() : [];
  const diagnosis = typeof decisions.diagnosis === "string" ? decisions.diagnosis : null;
  const treatments = Array.isArray(decisions.treatments) ? decisions.treatments.slice() : [];

  let dxPossible = true; // czy diagnoza była w ogóle możliwa (wymagane badania zlecone)

  // --- FAZA: BADANIA ---
  evaluateExams(caseObj, disease, orderedExams, content, verdicts);
  // diagnoza niemożliwa bez wymaganych badań
  const missingRequired = disease.requiredExams.filter((id) => !orderedExams.includes(id));
  if (missingRequired.length > 0) dxPossible = false;

  // --- FAZA: DIAGNOZA ---
  evaluateDiagnosis(caseObj, disease, diagnosis, dxPossible, missingRequired, content, verdicts);

  // --- FAZA: LECZENIE + DAWSKA ---
  evaluateTreatment(caseObj, disease, sp, treatments, weightKg, content, verdicts, doseBreakdown);

  // --- FAZA: ZABIEGI + OPERACJE ---
  const orderedProcedures = Array.isArray(decisions.procedures) ? decisions.procedures.slice() : [];
  evaluateProcedures(caseObj, orderedProcedures, content, verdicts);

  // --- FAZA: ZALECENIA ---
  const orderedRecs = Array.isArray(decisions.recommendations) ? decisions.recommendations.slice() : [];
  evaluateRecommendations(caseObj, orderedRecs, content, verdicts);

  // --- FAZA: RACJONALNOŚĆ (AMR) ---
  evaluateRationality(disease, treatments, content, verdicts);

  // --- XP i LOS PACJENTA ---
  const xp = Math.max(0, sumXp(verdicts, content));
  const patientOutcome = synthesizeOutcome(verdicts, disease);

  return { xp, patientOutcome, verdicts, doseBreakdown, dxPossible };
}

/* ----------------------------- BADANIA ----------------------------- */
function evaluateExams(caseObj, disease, orderedExams, content, verdicts) {
  const required = disease.requiredExams || [];
  const supportive = disease.supportiveExams || [];
  const results = caseObj.examResults || {};

  // zlecono wymagane → +
  required.forEach((id) => {
    if (orderedExams.includes(id)) {
      pushVerdict(verdicts, "exams", "R-EXAM-NEEDED", content,
        `Zlecono wymagane badanie „${examLabel(content, id)}”.`);
    }
  });
  // zlecono wspomagające → też +
  supportive.forEach((id) => {
    if (orderedExams.includes(id)) {
      pushVerdict(verdicts, "exams", "R-EXAM-NEEDED", content,
        `Zlecono wspomagające badanie „${examLabel(content, id)}”.`);
    }
  });
  // brak wymaganego → -
  const missing = required.filter((id) => !orderedExams.includes(id));
  if (missing.length > 0) {
    pushVerdict(verdicts, "exams", "R-EXAM-MISSED", content,
      `Nie zlecono wymaganego badania: ${missing.map((id) => examLabel(content, id)).join(", ")}. Diagnoza niepewna.`);
  }
  // zbędne badania → -  (każde spoza {wymagane, wspomagające, opcjonalne})
  const optional = disease.optionalExams || [];
  const relevant = new Set([...required, ...supportive, ...optional]);
  orderedExams.forEach((id) => {
    if (relevant.has(id)) return;
    const r = results[id];
    const extra = r && r.textPl ? ` — ${r.textPl}` : "";
    pushVerdict(verdicts, "exams", "R-EXAM-REDUNDANT", content,
      `Zlecono zbędne badanie „${examLabel(content, id)}” — nie przynosi informacji do tej sprawy${extra}`);
  });
}

/* ----------------------------- DIAGNOZA ----------------------------- */
function evaluateDiagnosis(caseObj, disease, diagnosis, dxPossible, missing, content, verdicts) {
  if (!dxPossible) {
    if (diagnosis === disease.id) {
      // trafiona diagnoza mimo braku wymaganego badania — to strzał w ciemno (R-DX-LUCKY).
      // Los pacjenta: jeśli leczenie trafione, pacjent wyzdrowieje (biologicznie leczenie działa),
      // ale XP karze za brak potwierdzenia badaniem.
      pushVerdict(verdicts, "diagnosis", "R-DX-LUCKY", content,
        `Diagnoza trafiona, ale bez wymaganego badania — to trafiony strzał w ciemno, nie rozumowanie.`);
    } else {
      pushVerdict(verdicts, "diagnosis", "R-DX-BLOCKED", content,
        `Diagnoza bez podstaw: brak badań (${missing.map((id) => examLabel(content, id)).join(", ")}).`);
    }
    return;
  }
  if (diagnosis === disease.id) {
    pushVerdict(verdicts, "diagnosis", "R-DX-CORRECT", content,
      `Diagnoza zgodna z wynikami: ${diseaseLabel(content, disease.id)}.`);
  } else {
    pushVerdict(verdicts, "diagnosis", "R-DX-WRONG", content,
      `Błędna diagnoza. Wyniki wskazują: ${diseaseLabel(content, disease.id)}, a nie ${diseaseLabel(content, diagnosis)}.`);
  }
}

/* ----------------------------- LECZENIE + DAWKA ----------------------------- */
function evaluateTreatment(caseObj, disease, species, treatments, weightKg, content, verdicts, doseBreakdown) {
  const recGroups = disease.recommendedGroups || [];
  const contraGroups = disease.contraindicatedGroups || [];

  if (treatments.length === 0 && recGroups.length > 0) {
    pushVerdict(verdicts, "treatment", "R-NO-TREATMENT", content,
      `Nie przepisano leczenia pierwszej linii (${recGroups.map((g) => groupLabel(content, g)).join(", ")}).`);
  }

  treatments.forEach((rx, idx) => {
    const drug = content.drugs.find((d) => d.id === rx.drug);
    if (!drug) {
      pushVerdict(verdicts, "treatment", "R-DRUG-GROUP-MISMATCH", content,
        `Nieznany lek: ${rx.drug}.`);
      return;
    }
    // M4: duplikat tego samego leku — nie pompuj XP; pierwsza dawka oceniona
    const earlier = treatments.slice(0, idx).some((p) => p.drug === rx.drug);
    if (earlier) {
      pushVerdict(verdicts, "treatment", "R-DRUG-DUPLICATE", content,
        `${drug.inn} przepisany ponownie — powielanie tego samego leku nie ma sensu klinicznego i nie dodaje skuteczności.`);
      return;
    }
    // gatunkowa toksyczność — dominująca
    if ((species.toxicDrugs || []).includes(drug.id) || (drug.speciesToxic || []).includes(species.id)) {
      pushVerdict(verdicts, "treatment", "R-DRUG-SPECIES-TOXIC", content,
        `${drug.inn} jest toksyczny dla ${speciesLabel(content, species.id)}. ${drugTooltip(drug)}.`);
      return; // przy toksycznym dawka nie ma znaczenia
    }
    // grupa — M1: używamy groupPl TYCH leków (nie pierwszego z grupy)
    if (contraGroups.includes(drug.groupId)) {
      pushVerdict(verdicts, "treatment", "R-DRUG-CONTRAINDICATED", content,
        `${drug.inn} (grupa: ${drug.groupPl}) jest przeciwwskazany przy ${diseaseLabel(content, disease.id)}.`);
    } else if (recGroups.includes(drug.groupId)) {
      pushVerdict(verdicts, "treatment", "R-DRUG-GROUP-MATCH", content,
        `${drug.inn} — właściwa grupa (${drug.groupPl}) dla ${diseaseLabel(content, disease.id)}.`);
    } else {
      pushVerdict(verdicts, "treatment", "R-DRUG-GROUP-MISMATCH", content,
        `${drug.inn} (grupa: ${drug.groupPl}) nie jest leczeniem pierwszej linii przy ${diseaseLabel(content, disease.id)}.`);
    }
    // dawka (tylko systemic)
    if (drug.dosingType === "systemic") {
      evaluateDose(drug, species, rx, weightKg, content, verdicts, doseBreakdown);
    }
  });
}

function evaluateDose(drug, species, rx, weightKg, content, verdicts, doseBreakdown) {
  const spDosing = drug.dosing && drug.dosing[species.id];
  const doseMg = Number(rx.doseMg);
  // M2/M3/L3: brak wagi, brak dawki, ujemna dawka → błąd (nie „recovered”)
  const noWeight = !Number.isFinite(weightKg) || weightKg <= 0;
  const noDose = !Number.isFinite(doseMg) || doseMg < 0;
  if (!spDosing || !spDosing.mgPerKg || noWeight || noDose) {
    doseBreakdown.push({ drug: drug.id, drugName: drug.inn, doseMg, weightKg, mgPerKg: NaN, band: spDosing ? spDosing.mgPerKg : null, verdict: "invalid" });
    const reason = noWeight
      ? `nie zważono pacjenta (waga = ${fmt(weightKg)} kg) — bez wagi nie da się liczyć mg/kg. Zważ pacjenta i oblicz: dawka mg = mg/kg × waga kg.`
      : `brak lub niepoprawna dawka (${fmt(doseMg)} mg) leku systemic — nie da się ocenić bezpieczeństwa.`;
    pushVerdict(verdicts, "treatment", "R-DOSE-INVALID", content,
      `${drug.inn}: ${reason}`);
    return;
  }
  const band = spDosing.mgPerKg; // {min,max}
  const mgPerKg = doseMg / weightKg;
  const entry = { drug: drug.id, drugName: drug.inn, doseMg, weightKg, mgPerKg: round(mgPerKg), band, verdict: "in-range" };
  doseBreakdown.push(entry);

  if (band.min === 0 && band.max === 0) {
    // lek w ogóle niepolecany (np. OTC ludzki) — zarejestrowany jako poza pasmem
    entry.verdict = "over";
    pushVerdict(verdicts, "treatment", "R-DOSE-OVER", content,
      `${drug.inn}: ${fmt(doseMg)} mg = ${fmt(mgPerKg)} mg/kg. Lek niepolecany — pasmo bezpieczeństwa niewyznaczone.`);
    return;
  }
  if (mgPerKg >= band.min && mgPerKg <= band.max) {
    entry.verdict = "in-range";
    pushVerdict(verdicts, "treatment", "R-DOSE-IN-RANGE", content,
      `${drug.inn}: ${fmt(doseMg)} mg = ${fmt(mgPerKg)} mg/kg, w paśmie ${fmt(band.min)}–${fmt(band.max)} mg/kg.`);
  } else if (mgPerKg < band.min) {
    entry.verdict = "under";
    pushVerdict(verdicts, "treatment", "R-DOSE-UNDER", content,
      `${drug.inn}: ${fmt(mgPerKg)} mg/kg poniżej pasma ${fmt(band.min)}–${fmt(band.max)} — niedodawkowanie, leczenie nieskuteczne. (Oblicz: dawka mg = mg/kg × waga kg.)`);
  } else {
    entry.verdict = "over";
    pushVerdict(verdicts, "treatment", "R-DOSE-OVER", content,
      `${drug.inn}: ${fmt(mgPerKg)} mg/kg powyżej pasma ${fmt(band.min)}–${fmt(band.max)} — przedawkowanie, ryzyko toksyczności. (Waga = ${fmt(weightKg)} kg.)`);
  }
}

/* ----------------------------- ZABIEGI + OPERACJE ----------------------------- */
// Zabiegi (kind=procedure) i operacje (kind=surgery) — równoległe sekcje leczenia.
// alternatives: jeśli zlecono zabieg z alternativeTo=[surgeryId], konwertuje brak operacji na zaspokojony.
function evaluateProcedures(caseObj, orderedIds, content, verdicts) {
  const ordered = new Set(orderedIds);
  const expectedProc = caseObj.expectedProcedures || [];
  const expectedSurg = caseObj.expectedSurgeries || [];
  const optional = caseObj.optionalProcedures || [];
  const contra = caseObj.contraindicatedProcedures || [];
  const allProcedures = content.procedures || [];

  // zbierz operacje zaspokojone alternatywnym zabiegiem (szyna zamiast osteosyntezy)
  const surgCoveredByAlt = new Set();
  ordered.forEach((pid) => {
    const p = allProcedures.find((x) => x.id === pid);
    if (p && Array.isArray(p.alternativeTo)) {
      p.alternativeTo.forEach((surgId) => surgCoveredByAlt.add(surgId));
    }
  });

  // 1. zabiegi wymagane (kind=procedure)
  expectedProc.forEach((pid) => {
    const p = allProcedures.find((x) => x.id === pid);
    if (ordered.has(pid)) {
      pushVerdict(verdicts, "procedure", "R-PROC-REQUIRED", content,
        `Zlecono wymagany zabieg: ${procLabel(content, pid)}.`);
    } else {
      pushVerdict(verdicts, "procedure", "R-PROC-MISSING", content,
        `Zaniechano wymaganego zabiegu: ${procLabel(content, pid)}.`);
    }
  });

  // 2. operacje wymagane (kind=surgery) — pomńij jeśli zaspokojone alternatywą
  expectedSurg.forEach((sid) => {
    if (surgCoveredByAlt.has(sid)) return; // szyna zaspokaja brak operacji
    const s = allProcedures.find((x) => x.id === sid);
    if (ordered.has(sid)) {
      pushVerdict(verdicts, "procedure", "R-SURG-REQUIRED", content,
        `Zlecono wymaganą operację: ${procLabel(content, sid)}.`);
    } else {
      pushVerdict(verdicts, "procedure", "R-SURG-MISSING", content,
        `Zaniechano wymaganej operacji: ${procLabel(content, sid)}.`);
    }
  });

  // 2b. opcjonalny zabieg-alternatywa zlecony w zastępstwie brakującej operacji → R-PROC-REQUIRED
  // (szyna zamiast osteosyntezy — zaspokaja wymóg stabilizacji, traktuj jak wymagany zabieg)
  optional.forEach((pid) => {
    if (!ordered.has(pid)) return;
    const p = allProcedures.find((x) => x.id === pid);
    if (p && Array.isArray(p.alternativeTo) &&
        p.alternativeTo.some((sid) => expectedSurg.includes(sid) && !ordered.has(sid))) {
      pushVerdict(verdicts, "procedure", "R-PROC-REQUIRED", content,
        `Zlecono zabieg alternatywny (${procLabel(content, pid)}) w zastępstwie operacji — wystarczający dla stabilizacji.`);
    }
  });

  // 3. zlecone, ale nie w {expectedProc, expectedSurg, optional} → zbędne
  const relevant = new Set([...expectedProc, ...expectedSurg, ...optional]);
  ordered.forEach((pid) => {
    if (relevant.has(pid)) return;
    const p = allProcedures.find((x) => x.id === pid);
    // szkodliwy (w contraindicated) → osobna reguła
    if (contra.includes(pid)) {
      pushVerdict(verdicts, "procedure", "R-PROC-CONTRA", content,
        `Zlecono zabieg szkodliwy przy ${diseaseLabel(content, caseObj.trueDiagnosis)}: ${procLabel(content, pid)}.`);
    } else if (p && p.kind === "surgery") {
      // zbędna operacja (kind=surgery) → surowsza kara niż zbędny zabieg
      pushVerdict(verdicts, "procedure", "R-SURG-EXTRA", content,
        `Zlecono operację zbędną w tej sprawie: ${procLabel(content, pid)}.`);
    } else {
      pushVerdict(verdicts, "procedure", "R-PROC-EXTRA", content,
        `Zlecono zabieg zbędny w tej sprawie: ${procLabel(content, pid)}.`);
    }
  });

  // 4. zlecono operację ktora byla opcjonalną alternatywą, a operacja tez zlecona → "extra" na opcjonalnej
  // (jeśli surgery ordered i splint też ordered → splint zbędny, bo surgery ją zaspokaja)
  if (expectedSurg.length > 0 && expectedSurg.some((sid) => ordered.has(sid))) {
    optional.forEach((pid) => {
      if (ordered.has(pid)) {
        const p = allProcedures.find((x) => x.id === pid);
        if (p && Array.isArray(p.alternativeTo) && p.alternativeTo.some((sid) => expectedSurg.includes(sid) && ordered.has(sid))) {
          pushVerdict(verdicts, "procedure", "R-PROC-EXTRA", content,
            `Zlecono zarówno operację, jak i zabieg alternatywny (${procLabel(content, pid)}) — wystarczy jedno z nich.`);
        }
      }
    });
  }
}

/* ----------------------------- ZALECENIA ----------------------------- */
function evaluateRecommendations(caseObj, orderedIds, content, verdicts) {
  const ordered = new Set(orderedIds);
  const expected = caseObj.expectedRecommendations || [];
  const allRecs = content.recommendations || [];

  expected.forEach((rid) => {
    if (ordered.has(rid)) {
      pushVerdict(verdicts, "recommendation", "R-REC-REQUIRED", content,
        `Zlecono właściwe zalecenie: ${recLabel(content, rid)}.`);
    } else {
      pushVerdict(verdicts, "recommendation", "R-REC-MISSING", content,
        `Zaniechano kluczowego zalecenia: ${recLabel(content, rid)}.`);
    }
  });
  // zbędne zalecenia
  ordered.forEach((rid) => {
    if (expected.includes(rid)) return;
    pushVerdict(verdicts, "recommendation", "R-REC-EXTRA", content,
      `Zalecono coś zbędnego: ${recLabel(content, rid)}.`);
  });
}

/* ----------------------------- RACJONALNOŚĆ ----------------------------- */
function evaluateRationality(disease, treatments, content, verdicts) {
  const abxGiven = treatments.some((rx) => {
    const d = content.drugs.find((x) => x.id === rx.drug);
    return d && d.antibiotic;
  });
  if (!abxGiven) return;
  if (disease.bacterialInfection) {
    pushVerdict(verdicts, "rationality", "R-ABX-INDICATED", content,
      `Antybiotyk uzasadniony — rozpoznanie wiąże się z infekcją bakteryjną.`);
  } else {
    pushVerdict(verdicts, "rationality", "R-ABX-IRRATIONAL", content,
      `Antybiotyk NIEUZASADNIONY — rozpoznanie nie wiąże się z infekcją bakteryjną. To napędza oporność (AMR) i naraża pacjenta na skutki uboczne bez korzyści.`);
  }
}

/* ----------------------------- LOS PACJENTA ----------------------------- */
function synthesizeOutcome(verdicts, disease) {
  const rules = new Set(verdicts.map((v) => v.rule));
  // toksyk gatunkowy → krytyczny (najcięższy, sprawdzamy najpierw — dominuje nad wszystkim)
  if (rules.has("R-DRUG-SPECIES-TOXIC")) return "critical";
  // szkodliwy zabieg → pogorszenie
  if (rules.has("R-PROC-CONTRA")) return "deteriorating";
  // brak wymaganego zabiegu/operacji → nie pozwól na recovered (co najwyżej improving)
  const procMissing = rules.has("R-PROC-MISSING") || rules.has("R-SURG-MISSING");
  // przedawkowanie systemic znaczące → pogorszenie
  if (rules.has("R-DOSE-OVER")) return "deteriorating";
  // lek przeciwwskazany / irracjonalny antybiotyk → brak reakcji (lek nie trafia, nie pomaga)
  if (rules.has("R-DRUG-CONTRAINDICATED") || rules.has("R-ABX-IRRATIONAL")) return "not-responding";
  // brak leczenia pierwszej linii:
  // - zwykle (lek kuratywny, np. antybiotyk w infekcji) → brak reakcji
  // - wyjątek: lek tylko wspomagający (drugIsSupportive, np. opioid = analgezja w FIC):
  //   choroba samaustępująca; przy trafnej diagnozie, braku szkodliwego leku i podanych
  //   zaleceniach domowych pacjent poprawia się (lecz suboptymalnie — bez ulgi w bólu).
  if (rules.has("R-NO-TREATMENT")) {
    const correctDx = rules.has("R-DX-CORRECT") || rules.has("R-DX-LUCKY");
    if (disease.drugIsSupportive && correctDx && rules.has("R-REC-REQUIRED")) return "improving";
    return "not-responding";
  }
  // dawka: niedodawkowanie lub niepoprawna (brak wagi/dawki) → brak reakcji
  if (rules.has("R-DOSE-UNDER") || rules.has("R-DOSE-INVALID")) return "not-responding";
  // zła diagnoza (R-DX-WRONG) → leczenie omija przyczynę → pogorszenie
  if (rules.has("R-DX-WRONG")) return "deteriorating";
  // błędna diagnoza bez badań (R-DX-BLOCKED = pomyłka) → leczenie nie trafia w przyczynę
  if (rules.has("R-DX-BLOCKED")) return "not-responding";
  // poniżej tego punktu: brak problemu z dawką (OVER/UNDER/INVALID obsłużone wyżej)
  // R-DX-LUCKY = trafiona w ciemno — traktujemy jak poprawną diagnozę dla losu pacjenta
  // (biologicznie: dobre leczenie działa, nawet jeśli badania nie potwierdziły);
  // kara za brak badania zostaje w XP (R-DX-LUCKY -15, R-EXAM-MISSED -10).
  const correct = rules.has("R-DX-CORRECT") || rules.has("R-DX-LUCKY");
  const matched = rules.has("R-DRUG-GROUP-MATCH");
  const drugMismatch = rules.has("R-DRUG-GROUP-MISMATCH");
  if (correct && !procMissing) {
    const needsDrug = (disease.recommendedGroups || []).length > 0;
    if (needsDrug) {
      // choroba wymaga leku: pełne wyleczenie tylko gdy dobrano właściwą grupę
      return matched ? "recovered" : "improving";
    }
    // choroba wspomagająca (bez leku pierwszej linii, np. wirusowa): wyleczenie, gdy
    // nie podano szkodliwego/niewłaściwego leku (harm już obsłużony wyżej); błędny lek → tylko poprawa
    return drugMismatch ? "improving" : "recovered";
  }
  if (correct) return "improving";  // poprawna dx, ale brakuje wymaganego zabiegu
  return "not-responding";
}

/* ----------------------------- POMOCNICZE ----------------------------- */
function pushVerdict(verdicts, stage, rule, content, detailPl) {
  const cfg = content.rubricConfig[rule];
  if (!cfg) throw new Error("Unknown rubric rule: " + rule);
  verdicts.push({
    stage,
    rule,
    delta: cfg.delta,
    claimId: cfg.claimId,
    detailPl,
    detailEn: detailPl // en = pl do czasu i18n detali (poza zakresem MVP)
  });
}

function sumXp(verdicts) {
  return verdicts.reduce((s, v) => s + v.delta, 0);
}

function examLabel(content, id) {
  const e = content.exams.find((x) => x.id === id);
  return e ? e.labelPl : id;
}
function diseaseLabel(content, id) {
  const d = content.diseases.find((x) => x.id === id);
  return d ? d.labelPl : id;
}
function groupLabel(content, id) {
  const d = content.drugs.find((x) => x.groupId === id);
  if (d) return d.groupPl;
  // fallback: z ewentualnej tabeli grup (tu przez pierwszy lek)
  return id;
}
function speciesLabel(content, id) {
  const s = content.species.find((x) => x.id === id);
  return s ? s.labelPl : id;
}
function procLabel(content, id) {
  const p = (content.procedures || []).find((x) => x.id === id);
  return p ? p.labelPl : id;
}
function recLabel(content, id) {
  const r = (content.recommendations || []).find((x) => x.id === id);
  return r ? r.labelPl : id;
}
function drugTooltip(drug) {
  return drug.tooltipPl || "";
}
function fmt(n) {
  if (!Number.isFinite(n)) return "—";
  return (Math.round(n * 100) / 100).toString();
}
function round(n) {
  return Math.round(n * 100) / 100;
}

/* ----------------------------- API POMOCNICZE ----------------------------- */
// Poziom gracza (1..3) na podstawie totalXp i progów unlockThresholds.
// Używane do filtrowania katalogu leków/zabiegów/operacji (progresywne odblokowanie).
export function levelFromXp(content, totalXp) {
  let lvl = 1;
  for (const d of [1, 2, 3]) if (totalXp >= (content.unlockThresholds[d] ?? 0)) lvl = d;
  return lvl;
}

// Dostępne przypadki przy danym łącznym XP (dla UI / runnera).
export function availableCases(content, totalXp) {
  return content.cases
    .filter((c) => totalXp >= (content.unlockThresholds[c.difficulty] ?? 0) && totalXp >= (c.unlockXpThreshold ?? 0))
    .map((c) => c.id);
}

// Dostępne leki na danym poziomie gracza (minLevel <= level). UI pokazuje tylko te.
// Każdy lek ma opcjonalne `minLevel` (1..3, domyślnie 1). validate_game.py wymusza,
// że każda grupa zalecana dla przypadku trudności D ma wszystkie leki minLevel<=D.
export function availableDrugs(content, level) {
  return content.drugs.filter((d) => (d.minLevel ?? 1) <= level);
}

// Dostępne zabiegi (kind=procedure) lub operacje (kind=surgery) na danym poziomie.
export function availableProcedures(content, level, kind) {
  return content.procedures.filter((p) => p.kind === kind && (p.minLevel ?? 1) <= level);
}

// Dopuszczalne diagnozy dla przypadku (UI / walidator).
export function diagnosisOptionsFor(caseObj) {
  return caseObj.diagnosisOptions || [];
}
