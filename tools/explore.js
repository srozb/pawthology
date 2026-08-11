#!/usr/bin/env node
// Case explorer — "emulation" for LLM (headless testability pillar).
//
//   node tools/explore.js                       # list all cases
//   node tools/explore.js <caseId>              # answer key + auto-playthrough (good + bad variants)
//   node tools/explore.js <caseId> --trace      # + full verdict trace for each path
//   node tools/explore.js <caseId> --only good   # only the GOOD path
//   node tools/explore.js <caseId> --only toxic # only the specified path (good|toxic|noexam|notreat|wrongdx)
//
// Purpose: without constructing JSON, the LLM sees for any case:
//   1. ANSWER KEY — what the engine considers correct (required exams, diagnosis, drug groups,
//      doses, procedures/surgeries, recommendations, contraindications).
//   2. GOOD AUTO-PLAYTHROUGH — synthesized canonical correct decisions → outcome + trace.
//   3. BAD AUTO-PLAYTHROUGH — species toxicity / no exams / no treatment / wrong diagnosis → contrast.
//
// This complements replay.js (which requires a hand-written scenario.json). explore.js
// generates decisions from case data, so the LLM can verify grading consistency
// (whether the good path → recovered, whether toxicity → critical) without writing JSON.

import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { exit } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

async function load() {
  const game = await import(pathToFileURL(resolve(ROOT, "site/js/game.js")).href);
  const contentMod = await import(pathToFileURL(resolve(ROOT, "site/data/index.js")).href);
  return { game, content: contentMod.CONTENT };
}

const BLUE = "\x1b[34m", GREEN = "\x1b[32m", RED = "\x1b[31m", YELLOW = "\x1b[33m", DIM = "\x1b[2m", BOLD = "\x1b[1m", RESET = "\x1b[0m";
const c = (s, col) => process.stdout.isTTY ? `${col}${s}${RESET}` : s;

// --- Answer key: what the engine considers correct for a case ---
function answerKey(cs, content) {
  const sp = content.species.find((s) => s.id === cs.species);
  const dis = content.diseases.find((d) => d.id === cs.trueDiagnosis);
  const lines = [];
  lines.push(c(`ANSWER KEY — ${cs.id}`, BOLD + BLUE));
  lines.push(`  Patient: ${cs.patientName || "?"} — ${sp.labelPl} ${cs.breedPl ? "· " + cs.breedPl : ""} · ${cs.weightKg} kg${cs.agePl ? " · " + cs.agePl : ""}`);
  lines.push(`  True diagnosis: ${dis.labelPl} (${dis.id})  bacterial: ${dis.bacterialInfection ? "YES" : "no"}`);
  lines.push(`  Required exams:    ${dis.requiredExams.join(", ") || "(none)"}`);
  if (dis.supportiveExams?.length) lines.push(`  Supportive exams: ${dis.supportiveExams.join(", ")}`);
  if (dis.optionalExams?.length) lines.push(`  Optional exams:  ${dis.optionalExams.join(", ")}`);
  lines.push(`  Recommended drug groups: ${dis.recommendedGroups.join(", ") || "(none — e.g. procedure only)"}`);
  if (dis.contraindicatedGroups?.length) lines.push(`  Contraindicated groups: ${dis.contraindicatedGroups.join(", ")}`);

  // drugs from recommended groups + doses for species
  const recDrugs = content.drugs.filter((d) => dis.recommendedGroups.includes(d.groupId));
  if (recDrugs.length) {
    lines.push(`  First-line drugs (from recommended groups):`);
    recDrugs.forEach((d) => {
      const dz = d.dosing?.[sp.id];
      if (d.dosingType === "systemic" && dz?.mgPerKg) {
        const mid = (dz.mgPerKg.min + dz.mgPerKg.max) / 2;
        lines.push(`    • ${d.inn} — ${d.routePl} · ${dz.mgPerKg.min}–${dz.mgPerKg.max} mg/kg · ${dz.frequencyPl || ""} · dose for ${cs.weightKg}kg ≈ ${(mid * cs.weightKg).toFixed(1)} mg`);
      } else {
        lines.push(`    • ${d.inn} — ${d.routePl} · topical (no mg slider) · ${dz?.unitNotePl || dz?.frequencyPl || ""}`);
      }
    });
  }
  // toxic to species
  if (sp.toxicDrugs?.length) {
    const tox = sp.toxicDrugs.map((id) => content.drugs.find((d) => d.id === id)).filter(Boolean);
    lines.push(`  Toxic to species (TRAP): ${tox.map((d) => d.inn).join(", ")}`);
  }
  // procedures/surgeries/recommendations
  if (cs.expectedProcedures?.length) lines.push(`  Required PROCEDURES:        ${cs.expectedProcedures.join(", ")}`);
  if (cs.expectedSurgeries?.length) lines.push(`  Required SURGERIES:           ${cs.expectedSurgeries.join(", ")}`);
  if (cs.optionalProcedures?.length) lines.push(`  Optional procedures:          ${cs.optionalProcedures.join(", ")}${cs.optionalProcedures.length ? " (alternative to surgery)" : ""}`);
  if (cs.contraindicatedProcedures?.length) lines.push(`  Contraindicated procedures:   ${cs.contraindicatedProcedures.join(", ")} → R-PROC-CONTRA`);
  if (cs.expectedRecommendations?.length) lines.push(`  Required RECOMMENDATIONS:     ${cs.expectedRecommendations.join(", ")}`);
  return lines.join("\n");
}

// --- Synthesize decisions for a path ---
function buildDecisions(cs, content, path) {
  const sp = content.species.find((s) => s.id === cs.species);
  const dis = content.diseases.find((d) => d.id === cs.trueDiagnosis);
  const base = { weightKg: cs.weightKg, exams: [], diagnosis: null, treatments: [], procedures: [], recommendations: [] };

  if (path === "good") {
    base.exams = [...dis.requiredExams, ...(dis.supportiveExams || [])];
    base.diagnosis = cs.trueDiagnosis;
    // one drug from each recommended group, at mid-band dose (systemic) or 0 (topical)
    dis.recommendedGroups.forEach((gid) => {
      const d = content.drugs.find((x) => x.groupId === gid && (x.dosingType === "topical" || x.dosing?.[sp.id]?.mgPerKg));
      if (!d) return;
      let doseMg = 0;
      if (d.dosingType === "systemic") {
        const dz = d.dosing?.[sp.id];
        if (dz?.mgPerKg) doseMg = +(((dz.mgPerKg.min + dz.mgPerKg.max) / 2) * cs.weightKg).toFixed(2);
      }
      base.treatments.push({ drug: d.id, doseMg });
    });
    // procedures: required + surgeries (or optional alternative if no surgery prescribed)
    base.procedures = [...(cs.expectedProcedures || []), ...(cs.expectedSurgeries || [])];
    if (!cs.expectedSurgeries?.length && cs.optionalProcedures?.length) {
      base.procedures = [...base.procedures, ...cs.optionalProcedures];
    }
    base.recommendations = [...(cs.expectedRecommendations || [])];
    return base;
  }
  if (path === "toxic") {
    // species toxicity: correct dx + correct procedure, but toxic drug
    base.exams = [...dis.requiredExams];
    base.diagnosis = cs.trueDiagnosis;
    const toxicId = sp.toxicDrugs?.find((id) => content.drugs.find((d) => d.id === id));
    if (toxicId) {
      const d = content.drugs.find((x) => x.id === toxicId);
      const dz = d.dosing?.[sp.id];
      let doseMg = dz?.mgPerKg ? +(((dz.mgPerKg.min || 1) * cs.weightKg)).toFixed(2) : 1;
      base.treatments.push({ drug: toxicId, doseMg });
    }
    base.procedures = [...(cs.expectedProcedures || [])];
    base.recommendations = [...(cs.expectedRecommendations || [])];
    return base;
  }
  if (path === "noexam") {
    // no required exams → R-DX-BLOCKED (diagnosis in the dark); correct treatment
    base.exams = [];
    base.diagnosis = cs.trueDiagnosis;
    dis.recommendedGroups.forEach((gid) => {
      const d = content.drugs.find((x) => x.groupId === gid && (x.dosingType === "topical" || x.dosing?.[sp.id]?.mgPerKg));
      if (!d) return;
      base.treatments.push({ drug: d.id, doseMg: (d.dosingType === "systemic" && d.dosing?.[sp.id]?.mgPerKg) ? +(((d.dosing[sp.id].mgPerKg.min + d.dosing[sp.id].mgPerKg.max) / 2) * cs.weightKg).toFixed(2) : 0 });
    });
    base.procedures = [...(cs.expectedProcedures || []), ...(cs.expectedSurgeries || [])];
    base.recommendations = [...(cs.expectedRecommendations || [])];
    return base;
  }
  if (path === "notreat") {
    // correct diagnosis, no treatment
    base.exams = [...dis.requiredExams];
    base.diagnosis = cs.trueDiagnosis;
    base.procedures = [...(cs.expectedProcedures || [])];
    base.recommendations = [...(cs.expectedRecommendations || [])];
    return base;
  }
  if (path === "wrongdx") {
    // wrong diagnosis + treatment under wrong diagnosis
    base.exams = [...dis.requiredExams];
    const wrong = (cs.diagnosisOptions || []).find((o) => o !== cs.trueDiagnosis);
    base.diagnosis = wrong || cs.trueDiagnosis;
    // drug from wrong-diagnosis groups (if any) — demonstrates treatment that bypasses the cause
    const wrongDis = content.diseases.find((d) => d.id === base.diagnosis);
    if (wrongDis?.recommendedGroups?.length) {
      const d = content.drugs.find((x) => wrongDis.recommendedGroups.includes(x.groupId));
      if (d) base.treatments.push({ drug: d.id, doseMg: d.dosingType === "systemic" && d.dosing[sp.id]?.mgPerKg ? +(((d.dosing[sp.id].mgPerKg.min + d.dosing[sp.id].mgPerKg.max) / 2) * cs.weightKg).toFixed(2) : 0 });
    }
    return base;
  }
  return base;
}

// Auto-playthrough paths. "expect" is a HINT (expected outcome for a typical case),
// NOT a hard assertion — the real outcome depends on data (e.g. wrong diagnosis + toxic drug for
// species → critical, not deteriorating). Hard assertions are in sanityCheck() at the end.
const PATHS = [
  { id: "good", label: "GOOD (canonical)", color: GREEN, expect: "recovered" },
  { id: "toxic", label: "BAD: species toxicity", color: RED, expect: "critical" },
  { id: "noexam", label: "BAD: no exams (dx in the dark)", color: YELLOW, expect: "recovered/improving" },
  { id: "notreat", label: "BAD: no treatment", color: YELLOW, expect: "not-responding/improving" },
  { id: "wrongdx", label: "BAD: wrong diagnosis", color: RED, expect: "deteriorating/critical" },
];

function printTrace(result, color) {
  result.verdicts.forEach((v) => {
    console.log(`    ${v.stage.padEnd(13)} ${v.rule.padEnd(24)} Δ${String(v.delta).padStart(4)}  ${c(`[${v.claimId}]`, DIM)}`);
    console.log(`    ${"".padEnd(13)} ${v.detailPl}`);
  });
  if (result.doseBreakdown?.length) {
    console.log(`    ${c("--- doses ---", DIM)}`);
    result.doseBreakdown.forEach((d) => {
      console.log(`    ${d.drugName}: ${d.doseMg} mg / ${d.weightKg} kg = ${d.mgPerKg} mg/kg [${d.band?.min}–${d.band?.max}] → ${d.verdict}`);
    });
  }
}

// Patient outcome rank (higher is better): recovered > improving > not-responding > deteriorating > critical.
const OUTCOME_RANK = { recovered: 4, improving: 3, "not-responding": 2, deteriorating: 1, critical: 0 };

// Grading invariants — independent of case data. If broken → real grading bug.
// (Per-path "expect" is a hint; hard assertions are here.)
function sanityCheck(cs, content, summary) {
  const get = (id) => summary.find((s) => s.path === id);
  const checks = [];
  const good = get("good");
  const toxic = get("toxic");
  const sp = content.species.find((s) => s.id === cs.species);
  const hasToxic = sp?.toxicDrugs?.length > 0;

  // 1. The good path must NEVER be critical or deteriorating (never triggers toxicity/wrong dx).
  if (good) {
    const bad = good.outcome === "critical" || good.outcome === "deteriorating";
    checks.push({ ok: !bad, msg: `Good path does not yield critical/deteriorating (got: ${good.outcome}, xp=${good.xp})` });
  }
  // 2. Species toxicity → ALWAYS critical (R-DRUG-SPECIES-TOXIC dominates in synthesizeOutcome).
  if (hasToxic && toxic) {
    checks.push({ ok: toxic.outcome === "critical", msg: `Toxic drug → critical (got: ${toxic.outcome}, xp=${toxic.xp})` });
  }
  // 2b. No exams (dx in the dark) + correct treatment → NOT deteriorating/critical.
  //     synthesizeOutcome: trafiona w ciemno (R-DX-LUCKY) + dobre leczenie → recovered (biologicznie
  //     leczenie działa; kara za brak badania zostaje w XP). Nigdy deteriorating/critical.
  const noexam = get("noexam");
  if (noexam) {
    const bad = noexam.outcome === "deteriorating" || noexam.outcome === "critical";
    checks.push({ ok: !bad, msg: `No exams + correct treatment → recovered/improving, NOT deteriorating/critical (got: ${noexam.outcome})` });
  }
  // 3. Monotonicity: good path >= every bad path (XP and outcome rank).
  //    Doing things correctly must not score worse than making a mistake.
  if (good) {
    summary.filter((s) => s.path !== "good").forEach((s) => {
      const xpOk = good.xp >= s.xp;
      const rankOk = OUTCOME_RANK[good.outcome] >= OUTCOME_RANK[s.outcome];
      checks.push({ ok: xpOk && rankOk, msg: `Good path (xp=${good.xp}, ${good.outcome}) >= "${s.label}" (xp=${s.xp}, ${s.outcome})` });
    });
  }
  return checks;
}

async function main() {
  const args = process.argv.slice(2);
  const trace = args.includes("--trace");
  const all = args.includes("--all");
  const onlyIdx = args.indexOf("--only");
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
  const caseId = args.find((a) => !a.startsWith("--") && a !== only);

  const { game, content } = await load();

  if (all) {
    // Run sanity-check for all cases — global grading regression.
    let fails = 0;
    for (const cs of content.cases) {
      const summary = [];
      for (const p of PATHS) {
        if (p.id === "toxic" && !content.species.find((s) => s.id === cs.species).toxicDrugs?.length) continue;
        const decisions = buildDecisions(cs, content, p.id);
        const result = game.evaluateCase(cs, decisions, content);
        summary.push({ path: p.id, label: p.label, xp: result.xp, outcome: result.patientOutcome, expect: p.expect });
      }
      const sanity = sanityCheck(cs, content, summary);
      const ok = sanity.every((s) => s.ok);
      console.log(`${ok ? c("✓", GREEN) : c("✗", RED)}  ${cs.id.padEnd(28)}  good=${summary.find(s=>s.path==="good")?.outcome}  ${ok ? "" : sanity.filter(s=>!s.ok).map(s=>s.msg).join("; ")}`);
      if (!ok) fails++;
    }
    console.log(c("\nInvariants (good>=fair, toxic=critical, fair!=critical) for all cases.", DIM));
    exit(fails > 0 ? 1 : 0);
  }

  if (!caseId) {
    console.log(c("Cases in the game:", BOLD + BLUE));
    content.cases.forEach((cs) => {
      const sp = content.species.find((s) => s.id === cs.species);
      const dis = content.diseases.find((d) => d.id === cs.trueDiagnosis);
      console.log(`  ${cs.id.padEnd(28)} ${c("d" + cs.difficulty, DIM)}  ${cs.patientName || "?"} (${sp.labelPl}, ${cs.weightKg}kg) → ${dis.labelPl}`);
    });
    console.log(c("\nUsage: node tools/explore.js <caseId> [--trace] [--only good|toxic|noexam|notreat|wrongdx]  |  --all", DIM));
    return;
  }

  const cs = content.cases.find((x) => x.id === caseId);
  if (!cs) { console.error("Case not found: " + caseId); exit(1); }

  console.log(answerKey(cs, content));
  console.log("");

  const paths = only ? PATHS.filter((p) => p.id === only) : PATHS;
  const summary = [];
  for (const p of paths) {
    const decisions = buildDecisions(cs, content, p.id);
    if (p.id === "toxic" && !content.species.find((s) => s.id === cs.species).toxicDrugs?.length) {
      console.log(c(`\n[${p.label}]`, p.color) + c(" — skipped (no toxic drug for this species)", DIM));
      continue;
    }
    const result = game.evaluateCase(cs, decisions, content);
    const outCol = (result.patientOutcome === "critical" || result.patientOutcome === "deteriorating") ? RED : result.patientOutcome === "recovered" ? GREEN : YELLOW;
    console.log(c(`\n[${p.label}]`, p.color) + `  →  xp=${result.xp} outcome=${c(result.patientOutcome, outCol)}  ` + c(`(expect ${p.expect})`, DIM));
    if (trace) printTrace(result);
    summary.push({ path: p.id, label: p.label, xp: result.xp, outcome: result.patientOutcome, expect: p.expect });
  }

  console.log(c("\n=== SUMMARY ===", BOLD));
  summary.forEach((s) => console.log(`  ${" "}  ${s.label.padEnd(34)} xp=${String(s.xp).padStart(4)}  outcome=${s.outcome}  (expect ${s.expect})`));
  const sanity = sanityCheck(cs, content, summary);
  console.log("");
  sanity.forEach((s) => console.log("  " + (s.ok ? c("✓", GREEN) : c("✗", RED)) + " " + s.msg));
  const allOk = sanity.every((s) => s.ok);
  console.log(allOk ? c("\nInvariants hold — grading is consistent.", GREEN) : c("\nWARNING: grading invariant violated — check the trace and case data.", RED));
  if (!allOk) exit(1);
}

main().catch((e) => { console.error(e); exit(1); });
