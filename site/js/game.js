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
  // maxXp = „designed ceiling” danego przypadku (najlepszy zamierzony przebieg).
  // SUWamy wynik: nie można zarobić więcej niż zaprojektowano (powstrzymuje to napompowanie
  // XP przez powielanie leków tej samej grupy itp.). bestXp per przypadek = max przebiegów,
  // więc i tak nigdy nie przekroczy maxXp — cap wymusza uczciwość wyniku.
  const xpRaw = Math.max(0, sumXp(verdicts, content));
  const maxXp = Number.isFinite(caseObj.maxXp) ? caseObj.maxXp : Infinity;
  const xp = Math.min(xpRaw, maxXp);
  const patientOutcome = synthesizeOutcome(verdicts, disease);

  return { xp, xpRaw, maxXp, patientOutcome, verdicts, doseBreakdown, dxPossible };
}

/* ----------------------------- BADANIA ----------------------------- */
function evaluateExams(caseObj, disease, orderedExams, content, verdicts) {
  const required = disease.requiredExams || [];
  const supportive = disease.supportiveExams || [];
  const results = caseObj.examResults || {};

  // zlecono wymagane → +
  required.forEach((id) => {
    if (orderedExams.includes(id)) {
      pushVerdict(verdicts, "exams", "R-EXAM-NEEDED", content, (lang) =>
        lang === "en"
          ? `Required exam ordered: “${examLabel(content, id, lang)}”.`
          : `Zlecono wymagane badanie „${examLabel(content, id, lang)}”.`);
    }
  });
  // zlecono wspomagające → też +
  supportive.forEach((id) => {
    if (orderedExams.includes(id)) {
      pushVerdict(verdicts, "exams", "R-EXAM-NEEDED", content, (lang) =>
        lang === "en"
          ? `Supportive exam ordered: “${examLabel(content, id, lang)}”.`
          : `Zlecono wspomagające badanie „${examLabel(content, id, lang)}”.`);
    }
  });
  // brak wymaganego → -
  const missing = required.filter((id) => !orderedExams.includes(id));
  if (missing.length > 0) {
    pushVerdict(verdicts, "exams", "R-EXAM-MISSED", content, (lang) =>
      lang === "en"
        ? `Required exam not ordered: ${missing.map((id) => examLabel(content, id, lang)).join(", ")}. Diagnosis uncertain.`
        : `Nie zlecono wymaganego badania: ${missing.map((id) => examLabel(content, id, lang)).join(", ")}. Diagnoza niepewna.`);
  }
  // zbędne badania → -  (każde spoza {wymagane, wspomagające, opcjonalne})
  const optional = disease.optionalExams || [];
  const relevant = new Set([...required, ...supportive, ...optional]);
  orderedExams.forEach((id) => {
    if (relevant.has(id)) return;
    const r = results[id];
    pushVerdict(verdicts, "exams", "R-EXAM-REDUNDANT", content, (lang) => {
      const extra = r ? (lang === "en" ? (r.textEn || r.textPl) : r.textPl) : "";
      const suffix = extra ? ` — ${extra}` : "";
      return lang === "en"
        ? `Redundant exam ordered: “${examLabel(content, id, lang)}” — adds no information to this case${suffix}`
        : `Zlecono zbędne badanie „${examLabel(content, id, lang)}” — nie przynosi informacji do tej sprawy${suffix}`;
    });
  });
}

/* ----------------------------- DIAGNOZA ----------------------------- */
function evaluateDiagnosis(caseObj, disease, diagnosis, dxPossible, missing, content, verdicts) {
  if (!dxPossible) {
    if (diagnosis === disease.id) {
      // trafiona diagnoza mimo braku wymaganego badania — to strzał w ciemno (R-DX-LUCKY).
      // Los pacjenta: jeśli leczenie trafione, pacjent wyzdrowieje (biologicznie leczenie działa),
      // ale XP karze za brak potwierdzenia badaniem.
      pushVerdict(verdicts, "diagnosis", "R-DX-LUCKY", content, (lang) =>
        lang === "en"
          ? `Diagnosis correct, but without the required exam — a lucky guess, not clinical reasoning.`
          : `Diagnoza trafiona, ale bez wymaganego badania — to trafiony strzał w ciemno, nie rozumowanie.`);
    } else {
      pushVerdict(verdicts, "diagnosis", "R-DX-BLOCKED", content, (lang) =>
        lang === "en"
          ? `Groundless diagnosis: missing exams (${missing.map((id) => examLabel(content, id, lang)).join(", ")}).`
          : `Diagnoza bez podstaw: brak badań (${missing.map((id) => examLabel(content, id, lang)).join(", ")}).`);
    }
    return;
  }
  if (diagnosis === disease.id) {
    pushVerdict(verdicts, "diagnosis", "R-DX-CORRECT", content, (lang) =>
      lang === "en"
        ? `Diagnosis consistent with findings: ${diseaseLabel(content, disease.id, lang)}.`
        : `Diagnoza zgodna z wynikami: ${diseaseLabel(content, disease.id, lang)}.`);
  } else {
    pushVerdict(verdicts, "diagnosis", "R-DX-WRONG", content, (lang) =>
      lang === "en"
        ? `Wrong diagnosis. Findings indicate: ${diseaseLabel(content, disease.id, lang)}, not ${diseaseLabel(content, diagnosis, lang)}.`
        : `Błędna diagnoza. Wyniki wskazują: ${diseaseLabel(content, disease.id, lang)}, a nie ${diseaseLabel(content, diagnosis, lang)}.`);
  }
}

/* ----------------------------- LECZENIE + DAWKA ----------------------------- */
function evaluateTreatment(caseObj, disease, species, treatments, weightKg, content, verdicts, doseBreakdown) {
  const recGroups = disease.recommendedGroups || [];
  const contraGroups = disease.contraindicatedGroups || [];

  if (treatments.length === 0 && recGroups.length > 0) {
    pushVerdict(verdicts, "treatment", "R-NO-TREATMENT", content, (lang) =>
      lang === "en"
        ? `First-line treatment not prescribed (${recGroups.map((g) => groupLabel(content, g, lang)).join(", ")}).`
        : `Nie przepisano leczenia pierwszej linii (${recGroups.map((g) => groupLabel(content, g, lang)).join(", ")}).`);
  }

  treatments.forEach((rx, idx) => {
    const drug = content.drugs.find((d) => d.id === rx.drug);
    if (!drug) {
      pushVerdict(verdicts, "treatment", "R-DRUG-GROUP-MISMATCH", content, (lang) =>
        lang === "en"
          ? `Unknown drug: ${rx.drug}.`
          : `Nieznany lek: ${rx.drug}.`);
      return;
    }
    // M4: duplikat tego samego leku — nie pompuj XP; pierwsza dawka oceniona
    const earlier = treatments.slice(0, idx).some((p) => p.drug === rx.drug);
    if (earlier) {
      pushVerdict(verdicts, "treatment", "R-DRUG-DUPLICATE", content, (lang) =>
        lang === "en"
          ? `${drug.inn} prescribed again — repeating the same drug makes no clinical sense and adds no efficacy.`
          : `${drug.inn} przepisany ponownie — powielanie tego samego leku nie ma sensu klinicznego i nie dodaje skuteczności.`);
      return;
    }
    // gatunkowa toksyczność — dominująca
    if ((species.toxicDrugs || []).includes(drug.id) || (drug.speciesToxic || []).includes(species.id)) {
      pushVerdict(verdicts, "treatment", "R-DRUG-SPECIES-TOXIC", content, (lang) =>
        lang === "en"
          ? `${drug.inn} is toxic to ${speciesLabel(content, species.id, lang)}. ${drugTooltip(drug, lang)}.`
          : `${drug.inn} jest toksyczny dla ${speciesLabel(content, species.id, lang)}. ${drugTooltip(drug, lang)}.`);
      return; // przy toksycznym dawka nie ma znaczenia
    }
    // grupa — M1: używamy groupPl TYCH leków (nie pierwszego z grupy)
    if (contraGroups.includes(drug.groupId)) {
      pushVerdict(verdicts, "treatment", "R-DRUG-CONTRAINDICATED", content, (lang) =>
        lang === "en"
          ? `${drug.inn} (group: ${lang === "en" ? (drug.groupEn || drug.groupPl) : drug.groupPl}) is contraindicated in ${diseaseLabel(content, disease.id, lang)}.`
          : `${drug.inn} (grupa: ${drug.groupPl}) jest przeciwwskazany przy ${diseaseLabel(content, disease.id, lang)}.`);
    } else if (recGroups.includes(drug.groupId)) {
      pushVerdict(verdicts, "treatment", "R-DRUG-GROUP-MATCH", content, (lang) =>
        lang === "en"
          ? `${drug.inn} — correct group (${lang === "en" ? (drug.groupEn || drug.groupPl) : drug.groupPl}) for ${diseaseLabel(content, disease.id, lang)}.`
          : `${drug.inn} — właściwa grupa (${drug.groupPl}) dla ${diseaseLabel(content, disease.id, lang)}.`);
    } else {
      pushVerdict(verdicts, "treatment", "R-DRUG-GROUP-MISMATCH", content, (lang) =>
        lang === "en"
          ? `${drug.inn} (group: ${lang === "en" ? (drug.groupEn || drug.groupPl) : drug.groupPl}) is not first-line treatment for ${diseaseLabel(content, disease.id, lang)}.`
          : `${drug.inn} (grupa: ${drug.groupPl}) nie jest leczeniem pierwszej linii przy ${diseaseLabel(content, disease.id, lang)}.`);
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
    pushVerdict(verdicts, "treatment", "R-DOSE-INVALID", content, (lang) => {
      const reason = noWeight
        ? (lang === "en"
            ? `patient not weighed (weight = ${fmt(weightKg)} kg) — without weight, mg/kg cannot be calculated. Weigh the patient and compute: dose mg = mg/kg × weight kg.`
            : `nie zważono pacjenta (waga = ${fmt(weightKg)} kg) — bez wagi nie da się liczyć mg/kg. Zważ pacjenta i oblicz: dawka mg = mg/kg × waga kg.`)
        : (lang === "en"
            ? `missing or invalid dose (${fmt(doseMg)} mg) for a systemic drug — safety cannot be assessed.`
            : `brak lub niepoprawna dawka (${fmt(doseMg)} mg) leku systemic — nie da się ocenić bezpieczeństwa.`);
      return `${drug.inn}: ${reason}`;
    });
    return;
  }
  const band = spDosing.mgPerKg; // {min,max}
  const mgPerKg = doseMg / weightKg;
  const entry = { drug: drug.id, drugName: drug.inn, doseMg, weightKg, mgPerKg: round(mgPerKg), band, verdict: "in-range" };
  doseBreakdown.push(entry);

  if (band.min === 0 && band.max === 0) {
    // lek w ogóle niepolecany (np. OTC ludzki) — zarejestrowany jako poza pasmem
    entry.verdict = "over";
    pushVerdict(verdicts, "treatment", "R-DOSE-OVER", content, (lang) =>
      lang === "en"
        ? `${drug.inn}: ${fmt(doseMg)} mg = ${fmt(mgPerKg)} mg/kg. Drug not recommended — safety range undefined.`
        : `${drug.inn}: ${fmt(doseMg)} mg = ${fmt(mgPerKg)} mg/kg. Lek niepolecany — pasmo bezpieczeństwa niewyznaczone.`);
    return;
  }
  if (mgPerKg >= band.min && mgPerKg <= band.max) {
    entry.verdict = "in-range";
    pushVerdict(verdicts, "treatment", "R-DOSE-IN-RANGE", content, (lang) =>
      lang === "en"
        ? `${drug.inn}: ${fmt(doseMg)} mg = ${fmt(mgPerKg)} mg/kg, within the ${fmt(band.min)}–${fmt(band.max)} mg/kg range.`
        : `${drug.inn}: ${fmt(doseMg)} mg = ${fmt(mgPerKg)} mg/kg, w paśmie ${fmt(band.min)}–${fmt(band.max)} mg/kg.`);
  } else if (mgPerKg < band.min) {
    entry.verdict = "under";
    pushVerdict(verdicts, "treatment", "R-DOSE-UNDER", content, (lang) =>
      lang === "en"
        ? `${drug.inn}: ${fmt(mgPerKg)} mg/kg below the ${fmt(band.min)}–${fmt(band.max)} range — underdosed, treatment ineffective. (Compute: dose mg = mg/kg × weight kg.)`
        : `${drug.inn}: ${fmt(mgPerKg)} mg/kg poniżej pasma ${fmt(band.min)}–${fmt(band.max)} — niedodawkowanie, leczenie nieskuteczne. (Oblicz: dawka mg = mg/kg × waga kg.)`);
  } else {
    entry.verdict = "over";
    pushVerdict(verdicts, "treatment", "R-DOSE-OVER", content, (lang) =>
      lang === "en"
        ? `${drug.inn}: ${fmt(mgPerKg)} mg/kg above the ${fmt(band.min)}–${fmt(band.max)} range — overdose, risk of toxicity. (Weight = ${fmt(weightKg)} kg.)`
        : `${drug.inn}: ${fmt(mgPerKg)} mg/kg powyżej pasma ${fmt(band.min)}–${fmt(band.max)} — przedawkowanie, ryzyko toksyczności. (Waga = ${fmt(weightKg)} kg.)`);
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
      pushVerdict(verdicts, "procedure", "R-PROC-REQUIRED", content, (lang) =>
        lang === "en"
          ? `Required procedure ordered: ${procLabel(content, pid, lang)}.`
          : `Zlecono wymagany zabieg: ${procLabel(content, pid, lang)}.`);
    } else {
      pushVerdict(verdicts, "procedure", "R-PROC-MISSING", content, (lang) =>
        lang === "en"
          ? `Required procedure omitted: ${procLabel(content, pid, lang)}.`
          : `Zaniechano wymaganego zabiegu: ${procLabel(content, pid, lang)}.`);
    }
  });

  // 2. operacje wymagane (kind=surgery) — pomńij jeśli zaspokojone alternatywą
  expectedSurg.forEach((sid) => {
    if (surgCoveredByAlt.has(sid)) return; // szyna zaspokaja brak operacji
    const s = allProcedures.find((x) => x.id === sid);
    if (ordered.has(sid)) {
      pushVerdict(verdicts, "procedure", "R-SURG-REQUIRED", content, (lang) =>
        lang === "en"
          ? `Required surgery ordered: ${procLabel(content, sid, lang)}.`
          : `Zlecono wymaganą operację: ${procLabel(content, sid, lang)}.`);
    } else {
      pushVerdict(verdicts, "procedure", "R-SURG-MISSING", content, (lang) =>
        lang === "en"
          ? `Required surgery omitted: ${procLabel(content, sid, lang)}.`
          : `Zaniechano wymaganej operacji: ${procLabel(content, sid, lang)}.`);
    }
  });

  // 2b. opcjonalny zabieg-alternatywa zlecony w zastępstwie brakującej operacji → R-PROC-REQUIRED
  // (szyna zamiast osteosyntezy — zaspokaja wymóg stabilizacji, traktuj jak wymagany zabieg)
  optional.forEach((pid) => {
    if (!ordered.has(pid)) return;
    const p = allProcedures.find((x) => x.id === pid);
    if (p && Array.isArray(p.alternativeTo) &&
        p.alternativeTo.some((sid) => expectedSurg.includes(sid) && !ordered.has(sid))) {
      pushVerdict(verdicts, "procedure", "R-PROC-REQUIRED", content, (lang) =>
        lang === "en"
          ? `Alternative procedure (${procLabel(content, pid, lang)}) ordered in place of surgery — sufficient for stabilization.`
          : `Zlecono zabieg alternatywny (${procLabel(content, pid, lang)}) w zastępstwie operacji — wystarczający dla stabilizacji.`);
    }
  });

  // 3. zlecone, ale nie w {expectedProc, expectedSurg, optional} → zbędne
  const relevant = new Set([...expectedProc, ...expectedSurg, ...optional]);
  ordered.forEach((pid) => {
    if (relevant.has(pid)) return;
    const p = allProcedures.find((x) => x.id === pid);
    // szkodliwy (w contraindicated) → osobna reguła
    if (contra.includes(pid)) {
      pushVerdict(verdicts, "procedure", "R-PROC-CONTRA", content, (lang) =>
        lang === "en"
          ? `Harmful procedure ordered in ${diseaseLabel(content, caseObj.trueDiagnosis, lang)}: ${procLabel(content, pid, lang)}.`
          : `Zlecono zabieg szkodliwy przy ${diseaseLabel(content, caseObj.trueDiagnosis, lang)}: ${procLabel(content, pid, lang)}.`);
    } else if (p && p.kind === "surgery") {
      // zbędna operacja (kind=surgery) → surowsza kara niż zbędny zabieg
      pushVerdict(verdicts, "procedure", "R-SURG-EXTRA", content, (lang) =>
        lang === "en"
          ? `Unnecessary surgery ordered in this case: ${procLabel(content, pid, lang)}.`
          : `Zlecono operację zbędną w tej sprawie: ${procLabel(content, pid, lang)}.`);
    } else {
      pushVerdict(verdicts, "procedure", "R-PROC-EXTRA", content, (lang) =>
        lang === "en"
          ? `Unnecessary procedure ordered in this case: ${procLabel(content, pid, lang)}.`
          : `Zlecono zabieg zbędny w tej sprawie: ${procLabel(content, pid, lang)}.`);
    }
  });

  // 4. zlecono operację ktora byla opcjonalną alternatywą, a operacja tez zlecona → "extra" na opcjonalnej
  // (jeśli surgery ordered i splint też ordered → splint zbędny, bo surgery ją zaspokaja)
  if (expectedSurg.length > 0 && expectedSurg.some((sid) => ordered.has(sid))) {
    optional.forEach((pid) => {
      if (ordered.has(pid)) {
        const p = allProcedures.find((x) => x.id === pid);
        if (p && Array.isArray(p.alternativeTo) && p.alternativeTo.some((sid) => expectedSurg.includes(sid) && ordered.has(sid))) {
          pushVerdict(verdicts, "procedure", "R-PROC-EXTRA", content, (lang) =>
            lang === "en"
              ? `Both surgery and an alternative procedure (${procLabel(content, pid, lang)}) were ordered — one is enough.`
              : `Zlecono zarówno operację, jak i zabieg alternatywny (${procLabel(content, pid, lang)}) — wystarczy jedno z nich.`);
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
      pushVerdict(verdicts, "recommendation", "R-REC-REQUIRED", content, (lang) =>
        lang === "en"
          ? `Appropriate recommendation given: ${recLabel(content, rid, lang)}.`
          : `Zlecono właściwe zalecenie: ${recLabel(content, rid, lang)}.`);
    } else {
      pushVerdict(verdicts, "recommendation", "R-REC-MISSING", content, (lang) =>
        lang === "en"
          ? `Key recommendation omitted: ${recLabel(content, rid, lang)}.`
          : `Zaniechano kluczowego zalecenia: ${recLabel(content, rid, lang)}.`);
    }
  });
  // zbędne zalecenia
  ordered.forEach((rid) => {
    if (expected.includes(rid)) return;
    pushVerdict(verdicts, "recommendation", "R-REC-EXTRA", content, (lang) =>
      lang === "en"
        ? `Unnecessary recommendation given: ${recLabel(content, rid, lang)}.`
        : `Zalecono coś zbędnego: ${recLabel(content, rid, lang)}.`);
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
    pushVerdict(verdicts, "rationality", "R-ABX-INDICATED", content, (lang) =>
      lang === "en"
        ? `Antibiotic justified — the diagnosis involves a bacterial infection.`
        : `Antybiotyk uzasadniony — rozpoznanie wiąże się z infekcją bakteryjną.`);
  } else {
    pushVerdict(verdicts, "rationality", "R-ABX-IRRATIONAL", content, (lang) =>
      lang === "en"
        ? `Antibiotic UNJUSTIFIED — the diagnosis does not involve a bacterial infection. It drives resistance (AMR) and exposes the patient to side effects with no benefit.`
        : `Antybiotyk NIEUZASADNIONY — rozpoznanie nie wiąże się z infekcją bakteryjną. To napędza oporność (AMR) i naraża pacjenta na skutki uboczne bez korzyści.`);
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
  // błędna diagnoza bez badań (R-DX-BLOCKED = pomyłka). Biologicznie: jeśli leczenie
  // jest trafione (właściwa grupa leku + wymagany zabieg; szkoda i dawka obsłużone
  // wyżej), pacjent się poprawia — leczenie działa mimo złej diagnozy. Nie nagradzamy
  // pełnym wyleczeniem (diagnoza była zła), więc co najwyżej improving. Kara XP za
  // R-DX-BLOCKED i R-EXAM-MISSED zostaje — to ona motywuje do zlecania badań.
  if (rules.has("R-DX-BLOCKED")) {
    if (procMissing) return "not-responding";
    const needsDrug = (disease.recommendedGroups || []).length > 0;
    const matched = rules.has("R-DRUG-GROUP-MATCH");
    const drugMismatch = rules.has("R-DRUG-GROUP-MISMATCH");
    if (needsDrug) return matched ? "improving" : "not-responding";
    return drugMismatch ? "not-responding" : "improving";
  }
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
function pushVerdict(verdicts, stage, rule, content, detailBuilder) {
  const cfg = content.rubricConfig[rule];
  if (!cfg) throw new Error("Unknown rubric rule: " + rule);
  // detailBuilder: (lang) => string — buduje tekst werdyktu w danym języku,
  // używając zlokalizowanych helperów etykiet (*Label(content, id, lang)).
  const detailPl = detailBuilder("pl");
  const detailEn = detailBuilder("en");
  verdicts.push({
    stage,
    rule,
    delta: cfg.delta,
    claimId: cfg.claimId,
    detailPl,
    detailEn
  });
}

function sumXp(verdicts) {
  return verdicts.reduce((s, v) => s + v.delta, 0);
}

function examLabel(content, id, lang = "pl") {
  const e = content.exams.find((x) => x.id === id);
  if (!e) return id;
  return lang === "en" ? (e.labelEn || e.labelPl) : e.labelPl;
}
function diseaseLabel(content, id, lang = "pl") {
  const d = content.diseases.find((x) => x.id === id);
  if (!d) return id;
  return lang === "en" ? (d.labelEn || d.labelPl) : d.labelPl;
}
function groupLabel(content, id, lang = "pl") {
  const d = content.drugs.find((x) => x.groupId === id);
  if (d) return lang === "en" ? (d.groupEn || d.groupPl) : d.groupPl;
  // fallback: z ewentualnej tabeli grup (tu przez pierwszy lek)
  return id;
}
function speciesLabel(content, id, lang = "pl") {
  const s = content.species.find((x) => x.id === id);
  if (!s) return id;
  return lang === "en" ? (s.labelEn || s.labelPl) : s.labelPl;
}
function procLabel(content, id, lang = "pl") {
  const p = (content.procedures || []).find((x) => x.id === id);
  if (!p) return id;
  return lang === "en" ? (p.labelEn || p.labelPl) : p.labelPl;
}
function recLabel(content, id, lang = "pl") {
  const r = (content.recommendations || []).find((x) => x.id === id);
  if (!r) return id;
  return lang === "en" ? (r.labelEn || r.labelPl) : r.labelPl;
}
function drugTooltip(drug, lang = "pl") {
  return lang === "en" ? (drug.tooltipEn || drug.tooltipPl || "") : (drug.tooltipPl || "");
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
