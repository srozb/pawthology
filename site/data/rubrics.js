// Konfiguracja punktacji (deltas) — DANE, nie logika. LLM stroi punktację edytując to.
// Predykaty reguł (czy reguła się odpala) są w site/js/game.js.
// epiloguePl/epilogueEn — 1-zdaniowa narracyjna konsekwencja danej reguły (3 os./bezosobowo),
// doborana przez silnik epilogu w main.js. delta>=0 → co zrobiono dobrze; delta<0 → co zrobiono źle + konsekwencja.
export const rubricConfig = {
  // --- Badania ---
  "R-EXAM-NEEDED": {
    delta: +10, claimId: "C-RUB-EXAM",
    epiloguePl: "Zlecono wymagane badanie - dostarczyło informacji pomocnych w rozpoznaniu.",
    epilogueEn: "A required exam was ordered — it provided information useful for the diagnosis."
  },
  "R-EXAM-REDUNDANT": {
    delta: -5, claimId: "C-RUB-EXAM",
    epiloguePl: "Zlecono badanie zbędne w tej sprawie - nie przybliżyło diagnozy, a dodało tylko koszt i czas.",
    epilogueEn: "A redundant exam was ordered for this case — it didn't advance the diagnosis and only added cost and time."
  },
  "R-EXAM-MISSED": {
    delta: -10, claimId: "C-RUB-EXAM",
    epiloguePl: "Zaniechano kluczowego badania - diagnoza została postawiona w ciemno, bez potwierdzenia.",
    epilogueEn: "A key exam was skipped — the diagnosis was made blind, without confirmation."
  },
  // --- Diagnoza ---
  "R-DX-CORRECT": {
    delta: +20, claimId: "C-RUB-DX",
    epiloguePl: "Rozpoznanie było trafne - leczenie trafia w rzeczywistą przyczynę.",
    epilogueEn: "The diagnosis was correct — treatment addresses the real cause."
  },
  "R-DX-WRONG": {
    delta: -25, claimId: "C-RUB-DX",
    epiloguePl: "Rozpoznanie było błędne - leczenie nie trafia w przyczynę i nie przynosi ulgi.",
    epilogueEn: "The diagnosis was wrong — treatment misses the cause and brings no relief."
  },
  "R-DX-BLOCKED": {  // błędna diagnoza bez wymaganych badań
    delta: -15, claimId: "C-RUB-DX",
    epiloguePl: "Diagnoza postawiona bez wymaganych badań - była błędna i prowadzi na manowce.",
    epilogueEn: "The diagnosis was made without the required work-up — it was wrong and misleading."
  },
  "R-DX-LUCKY": {  // trafiona diagnoza, ale bez potwierdzenia badaniem (strzał w ciemno)
    delta: -15, claimId: "C-RUB-DX",
    epiloguePl: "Rozpoznanie okazało się trafne, ale postawione w ciemno, bez badania potwierdzającego - tym razem się udało, lecz bez dowodu to był przypadek, nie rozumowanie.",
    epilogueEn: "The diagnosis turned out to be correct, but it was made blind, without a confirming exam — this time it worked out, yet without proof it was luck, not reasoning."
  },
  // --- Leczenie: grupa ---
  "R-DRUG-GROUP-MATCH": {
    delta: +15, claimId: "C-RUB-DRUG",
    epiloguePl: "Wybrano lek z właściwej grupy - trafia on w dane schorzenie.",
    epilogueEn: "A drug from the right group was chosen — it targets the condition."
  },
  "R-DRUG-GROUP-MISMATCH": {
    delta: -10, claimId: "C-RUB-DRUG",
    epiloguePl: "Wybrano lek z niewłaściwej grupy - nie trafia on w dane schorzenie.",
    epilogueEn: "A drug from the wrong group was chosen — it doesn't target the condition."
  },
  "R-DRUG-CONTRAINDICATED": {
    delta: -20, claimId: "C-RUB-DRUG",
    epiloguePl: "Zastosowano lek przeciwwskazany w tym schorzeniu - był on ryzykowny dla pacjenta.",
    epilogueEn: "A drug contraindicated for this condition was used — it was risky for the patient."
  },
  "R-NO-TREATMENT": {
    delta: -15, claimId: "C-RUB-DRUG",
    epiloguePl: "Nie przepisano leczenia pierwszej linii - pacjent pozostał bez ukierunkowanej opieki.",
    epilogueEn: "No first-line treatment was prescribed — the patient was left without targeted care."
  },
  // --- Toksyczność gatunkowa (dominująca) ---
  "R-DRUG-SPECIES-TOXIC": {
    delta: -40, claimId: "C-RUB-TOX",
    epiloguePl: "Zastosowano lek toksyczny dla tego gatunku - stanowił on realne zagrożenie życia pacjenta.",
    epilogueEn: "A drug toxic to this species was used — it posed a real threat to the patient's life."
  },
  // --- Dawka (systemic) ---
  "R-DOSE-IN-RANGE": {
    delta: 0, claimId: "C-RUB-DOSE",
    epiloguePl: "Dawka mieściła się w paśmie bezpieczeństwa - podano ją prawidłowo.",
    epilogueEn: "The dose was within the safe range — it was given correctly."
  },
  "R-DOSE-UNDER": {
    delta: -10, claimId: "C-RUB-DOSE",
    epiloguePl: "Dawka była zbyt niska, by skutecznie pomóc pacjentowi.",
    epilogueEn: "The dose was too low to effectively help the patient."
  },
  "R-DOSE-OVER": {
    delta: -25, claimId: "C-RUB-DOSE",
    epiloguePl: "Dawka była zbyt wysoka - stwarzała ryzyko toksyczności dla pacjenta.",
    epilogueEn: "The dose was too high — it posed a risk of toxicity to the patient."
  },
  "R-DOSE-INVALID": {  // brak wagi / brak dawki / ujemna (M2/M3/L3)
    delta: -20, claimId: "C-RUB-DOSE",
    epiloguePl: "Dawka była nieprawidłowa - brak wagi lub dawki uniemożliwiał bezpieczne podanie.",
    epilogueEn: "The dose was invalid — missing weight or dose prevented safe administration."
  },
  // --- Racjonalność antybiotykoterapii ---
  "R-ABX-IRRATIONAL": {
    delta: -15, claimId: "C-AMR-01",
    epiloguePl: "Antybiotyk przepisano bez potwierdzonej infekcji - niepotrzebnie obciążał organizm i napędzał lekooporność.",
    epilogueEn: "An antibiotic was prescribed without confirmed infection — it needlessly burdened the body and drove resistance."
  },
  "R-ABX-INDICATED": {
    delta: +5, claimId: "C-AMR-01",
    epiloguePl: "Antybiotyk był uzasadniony potwierdzoną infekcją - to celowo dobrane leczenie.",
    epilogueEn: "The antibiotic was justified by confirmed infection — appropriately chosen treatment."
  },
  "R-DRUG-DUPLICATE": {  // duplikat tego samego leku (M4)
    delta: -5, claimId: "C-RUB-DRUG",
    epiloguePl: "Ten sam lek podano podwójnie - bez dodatkowego efektu, tylko ryzyko kumulacji.",
    epilogueEn: "The same drug was given twice — no added effect, only risk of accumulation."
  },
  // --- Zabiegi (kind=procedure) ---
  "R-PROC-REQUIRED": {
    delta: +10, claimId: "C-RUB-PROC",
    epiloguePl: "Zlecono wymagany zabieg - usuwa przyczynę lub warunek powodzenia leczenia.",
    epilogueEn: "A required procedure was ordered — it removes the cause or a condition for treatment success."
  },
  "R-PROC-MISSING": {
    delta: -10, claimId: "C-RUB-PROC",
    epiloguePl: "Zaniechano wymaganego zabiegu - sam lek nie rozwiąże problemu, bo nie usuwa przyczyny.",
    epilogueEn: "A required procedure was omitted — a drug alone will not solve the problem, because it does not remove the cause."
  },
  "R-PROC-EXTRA": {
    delta: -5, claimId: "C-RUB-PROC",
    epiloguePl: "Zlecono zabieg zbędny w tej sprawie - nie przynosi korzyści, a dodaje ryzyko i koszt.",
    epilogueEn: "An unnecessary procedure was ordered for this case — it brings no benefit and only adds risk and cost."
  },
  "R-PROC-CONTRA": {
    delta: -15, claimId: "C-RUB-PROC",
    epiloguePl: "Zlecono zabieg szkodliwy w tym stanie - pogarsza stan pacjenta zamiast pomagać.",
    epilogueEn: "A harmful procedure was ordered for this condition — it worsens the patient instead of helping."
  },
  // --- Operacje (kind=surgery) ---
  "R-SURG-REQUIRED": {
    delta: +15, claimId: "C-RUB-PROC",
    epiloguePl: "Zlecono wymaganą operację - stabilizuje problem, którego nie da się rozwiązać zachowawczo.",
    epilogueEn: "A required surgery was ordered — it stabilizes a problem that cannot be solved conservatively."
  },
  "R-SURG-MISSING": {
    delta: -20, claimId: "C-RUB-PROC",
    epiloguePl: "Zaniechano wymaganej operacji - problem pozostaje niestabilny i nie zgoi się sam.",
    epilogueEn: "A required surgery was omitted — the problem stays unstable and will not heal on its own."
  },
  "R-SURG-EXTRA": {
    delta: -10, claimId: "C-RUB-PROC",
    epiloguePl: "Zlecono operację zbędną - naraża pacjenta na narkozę i ryzyko bez korzyści.",
    epilogueEn: "An unnecessary surgery was ordered — it exposes the patient to anesthesia and risk without benefit."
  },
  // --- Zalecenia dla opiekuna ---
  "R-REC-REQUIRED": {
    delta: +5, claimId: "C-RUB-REC",
    epiloguePl: "Zlecono właściwe zalecenie - uczy opiekuna, co robić w domu, by leczenie się powiodło.",
    epilogueEn: "A proper recommendation was given — it teaches the carer what to do at home for treatment to succeed."
  },
  "R-REC-MISSING": {
    delta: -5, claimId: "C-RUB-REC",
    epiloguePl: "Zaniechano kluczowego zalecenia - bez niego opiekun może zepsuć efekt leczenia w domu.",
    epilogueEn: "A key recommendation was omitted — without it the carer can undo the treatment result at home."
  },
  "R-REC-EXTRA": {
    delta: -3, claimId: "C-RUB-REC",
    epiloguePl: "Zalecono coś zbędnego - nie szkodzi, ale zaśmieca plan leczenia i może zmylić opiekuna.",
    epilogueEn: "An unnecessary recommendation was given — it does not harm but clutters the plan and may confuse the carer."
  }
};

// Progi odblokowania trudności — jedno miejsce strojenia (Q1).
// Ekonomia: 5 przypadków poziomu 1 (max ~315 XP). Próg 150 = wyleczenie ~3 z 5 L1
// (z błędami) otwiera poziom 2 dla młodego gracza, który nie musi grać idealnie.
// Próg 400 dla poziomu 3 = większość L1+L2 (max ~575).
export const unlockThresholds = {
  1: 0,
  2: 150,
  3: 400
};
