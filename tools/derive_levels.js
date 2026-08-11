#!/usr/bin/env node
// tools/derive_levels.js — report and linter for progressive unlock (minLevel).
//
// Usage:
//   node tools/derive_levels.js            # report: derived vs stored minLevel for each entity
//   node tools/derive_levels.js --check    # linter: exit 1 when stored minLevel != derived (or < required)
//
// Derivation rule (see docs/EXTENDING.md §Progressive unlock):
//   drug.minLevel = min difficulty of any case in which the drug is RELEVANT:
//     - groupId in disease.recommendedGroups   (required for cure)
//     - groupId in disease.contraindicatedGroups (AMR trap — educational)
//     - drug.speciesToxic contains the case species (toxicity trap — educational)
//   If never relevant -> 3 (advanced, unlocked last).
//   procedure/surgery.minLevel = min difficulty of any case in which it appears in
//     expectedProcedures/expectedSurgeries/optionalProcedures/contraindicatedProcedures
//     or is alternativeTo for a required procedure/surgery.
//
// The `--check` linter enforces two rules:
//   (A) CONSISTENCY: stored minLevel must equal the derived value (author didn't forget to update).
//       It can be overridden (e.g. otc-human-analgesic always L1 for toxicity lesson) — then
//       allow a difference ONLY when stored < derived (earlier unlock = safe).
//       Stored > derived = error (unwinnable case — validate_game.js also catches this).
//   (B) WINNABILITY: every case of difficulty D has all drugs from recommended groups
//       and expectedProcedures/Surgeries with minLevel<=D (delegated to validate_game.js — here just info).

import { CONTENT as C } from "../site/data/index.js";

const CHECK = process.argv.includes("--check");

function drugDerivedLevel(drug) {
  let lvl = 99;
  for (const cs of C.cases) {
    const d = C.diseases.find((x) => x.id === cs.trueDiagnosis);
    if (!d) continue;
    const relevant =
      (d.recommendedGroups || []).includes(drug.groupId) ||
      (d.contraindicatedGroups || []).includes(drug.groupId) ||
      (drug.speciesToxic || []).includes(cs.species);
    if (relevant) lvl = Math.min(lvl, cs.difficulty);
  }
  return lvl === 99 ? 3 : lvl;
}

function procDerivedLevel(proc) {
  let lvl = 99;
  for (const cs of C.cases) {
    const lists = [
      cs.expectedProcedures || [], cs.expectedSurgeries || [],
      cs.optionalProcedures || [], cs.contraindicatedProcedures || [],
    ];
    let hit = lists.some((l) => l.includes(proc.id));
    if (!hit && proc.alternativeTo) {
      const req = [...(cs.expectedSurgeries || []), ...(cs.expectedProcedures || [])];
      hit = req.some((r) => r === proc.alternativeTo || proc.alternativeTo.includes(r));
    }
    if (hit) lvl = Math.min(lvl, cs.difficulty);
  }
  return lvl === 99 ? 3 : lvl;
}

const rows = [];
for (const d of C.drugs) {
  rows.push({ kind: "drug", id: d.id, group: d.groupId, stored: d.minLevel ?? 1, derived: drugDerivedLevel(d) });
}
for (const p of C.procedures) {
  rows.push({ kind: p.kind, id: p.id, group: p.kind, stored: p.minLevel ?? 1, derived: procDerivedLevel(p) });
}

if (CHECK) {
  let bad = 0;
  for (const r of rows) {
    // Stored > derived = error (lessons fail / unwinnable case).
    // Stored < derived = OK (earlier unlock — author intentionally e.g. for traps).
    // Stored == derived = OK.
    if (r.stored > r.derived) {
      console.error(`✗ ${r.kind} ${r.id}: minLevel=${r.stored} > derived=${r.derived} (lessons fail / unwinnable case — lower minLevel to ${r.derived})`);
      bad++;
    }
  }
  if (bad > 0) {
    console.error(`\n✗ ${bad} minLevel inconsistencies (stored > derived). Fix or audit.`);
    process.exit(1);
  }
  // Check winnability per case (delegated to validate_game.js, but provide a readable report here).
  let unwinnable = 0;
  for (const cs of C.cases) {
    const d = C.diseases.find((x) => x.id === cs.trueDiagnosis);
    if (!d) continue;
    for (const grp of (d.recommendedGroups || [])) {
      for (const drug of C.drugs.filter((x) => x.groupId === grp)) {
        if ((drug.minLevel ?? 1) > cs.difficulty) {
          console.error(`✗ ${cs.id} (L${cs.difficulty}): drug ${drug.id} [${grp}] minLevel=${drug.minLevel ?? 1} > ${cs.difficulty}`);
          unwinnable++;
        }
      }
    }
    for (const pid of [...(cs.expectedProcedures || []), ...(cs.expectedSurgeries || [])]) {
      const p = C.procedures.find((x) => x.id === pid);
      if (p && (p.minLevel ?? 1) > cs.difficulty) {
        console.error(`✗ ${cs.id} (L${cs.difficulty}): procedure ${pid} minLevel=${p.minLevel ?? 1} > ${cs.difficulty}`);
        unwinnable++;
      }
    }
  }
  if (unwinnable > 0) {
    console.error(`\n✗ ${unwinnable} winnability violations. Case unwinnable at its own level.`);
    process.exit(1);
  }
  console.log(`✓ minLevel: all ${rows.length} entities consistent with derived; ${C.cases.length} winnable cases.`);
  process.exit(0);
}

// Report
console.log("PROGRESSIVE UNLOCK — minLevel report (derived vs stored)");
console.log("=".repeat(78));
const byLvl = { 1: [], 2: [], 3: [] };
for (const r of rows) {
  const flag = r.stored === r.derived ? "✓" : (r.stored < r.derived ? "~" : "✗");
  console.log(`  ${flag} ${r.kind.padEnd(8)} ${r.id.padEnd(24)} grp=${r.group.padEnd(18)} stored=${r.stored} derived=${r.derived}`);
  byLvl[r.stored]?.push(r.id);
}
console.log("-".repeat(78));
for (const lv of [1, 2, 3]) {
  console.log(`  L${lv} (${byLvl[lv].length}): ${byLvl[lv].join(", ")}`);
}
console.log("\nLegend: ✓ consistent | ~ earlier unlock (OK) | ✗ TOO HIGH (lessons fail — fix)");
console.log("Linter: `node tools/derive_levels.js --check` (exit 1 on violation).");
