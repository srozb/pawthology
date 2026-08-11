#!/usr/bin/env node
// Headless runner — LLM testability without a browser (pillar F0).
//   node tools/replay.js scenarios/abrasion-good.json            # single scenario -> JSON
//   node tools/replay.js scenarios/abrasion-good.json --trace   # + full verdict trace
//   node tools/replay.js --check                                # whole golden suite, exit!=0 on fail
//   node tools/replay.js --lang en                               # check i18n (missing keys)
// Loads site/js/game.js + site/data/index.js via dynamic import (absolute paths).

import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { exit } from "node:process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

async function loadModules() {
  const gameUrl = pathToFileURL(resolve(ROOT, "site/js/game.js")).href;
  const contentUrl = pathToFileURL(resolve(ROOT, "site/data/index.js")).href;
  const game = await import(gameUrl);
  const contentMod = await import(contentUrl);
  return { game, content: contentMod.CONTENT };
}

function scenarioDir() {
  return resolve(ROOT, "scenarios");
}

function runScenario(scenario, game, content, trace) {
  const caseObj = content.cases.find((c) => c.id === scenario.caseId);
  if (!caseObj) throw new Error("Case not found: " + scenario.caseId);
  const result = game.evaluateCase(caseObj, scenario.decisions, content);
  const exp = scenario.expected || {};

  const checks = [];
  if (Array.isArray(exp.xp)) {
    const [lo, hi] = exp.xp;
    checks.push({ name: "xp", pass: result.xp >= lo && result.xp <= hi,
      got: result.xp, want: `[${lo},${hi}]` });
  } else if (typeof exp.xp === "number") {
    checks.push({ name: "xp", pass: result.xp === exp.xp, got: result.xp, want: exp.xp });
  }
  if (exp.patientOutcome) {
    checks.push({ name: "patientOutcome", pass: result.patientOutcome === exp.patientOutcome,
      got: result.patientOutcome, want: exp.patientOutcome });
  }
  const gotRules = result.verdicts.map((v) => v.rule);
  (exp.mustContainVerdicts || []).forEach((r) => {
    checks.push({ name: "has:" + r, pass: gotRules.includes(r), got: false, want: true });
  });
  (exp.mustNotContainVerdicts || []).forEach((r) => {
    checks.push({ name: "lacks:" + r, pass: !gotRules.includes(r), got: gotRules.includes(r), want: false });
  });

  const allPass = checks.every((c) => c.pass);
  const out = {
    id: scenario.id,
    caseId: scenario.caseId,
    pass: allPass,
    xp: result.xp,
    patientOutcome: result.patientOutcome,
    dxPossible: result.dxPossible,
    checks,
    verdicts: trace ? result.verdicts : undefined,
    doseBreakdown: trace ? result.doseBreakdown : undefined
  };
  return out;
}

function printResult(out, trace) {
  const status = out.pass ? "PASS" : "FAIL";
  console.log(`[${status}] ${out.id} (${out.caseId})  xp=${out.xp} outcome=${out.patientOutcome}`);
  out.checks.forEach((c) => {
    if (!c.pass) console.log(`    ✗ ${c.name}: got=${JSON.stringify(c.got)} want=${JSON.stringify(c.want)}`);
  });
  if (trace && out.verdicts) {
    console.log("    --- verdicts (trace for LLM) ---");
    out.verdicts.forEach((v) => {
      console.log(`    ${v.stage.padEnd(12)} ${v.rule.padEnd(24)} Δ${String(v.delta).padStart(4)}  [${v.claimId}]`);
      console.log(`                 ${v.detailPl}`);
    });
    if (out.doseBreakdown && out.doseBreakdown.length) {
      console.log("    --- dose breakdown ---");
      out.doseBreakdown.forEach((d) => {
        console.log(`    ${d.drugName}: ${d.doseMg} mg / ${d.weightKg} kg = ${d.mgPerKg} mg/kg [band ${d.band?.min}–${d.band?.max}] → ${d.verdict}`);
      });
    }
  }
}

function listScenarios() {
  const dir = scenarioDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
}

async function main() {
  const args = process.argv.slice(2);
  const trace = args.includes("--trace");
  const check = args.includes("--check");
  const langIdx = args.indexOf("--lang");
  const lang = langIdx >= 0 ? args[langIdx + 1] : null;

  const { game, content } = await loadModules();

  if (lang) {
    const i18nUrl = pathToFileURL(resolve(ROOT, "site/js/i18n.js")).href;
    const i18n = await import(i18nUrl);
    const missing = i18n.missingKeys(lang);
    if (missing.length) {
      console.log(`i18n[${lang}]: missing ${missing.length} keys:`);
      missing.forEach((k) => console.log("  - " + k));
      exit(1);
    } else {
      console.log(`i18n[${lang}]: all UI keys present.`);
    }
    if (!check && langIdx === 0 && args.length === 2) return;
  }

  let scenarios = [];
  if (check) {
    scenarios = listScenarios().map((f) => JSON.parse(readFileSync(resolve(scenarioDir(), f), "utf8")));
  } else {
    const file = args.find((a) => !a.startsWith("--"));
    if (!file) {
      console.error("Usage: replay.js <scenario.json> [--trace] | --check | --lang <lang>");
      exit(2);
    }
    scenarios = [JSON.parse(readFileSync(resolve(process.cwd(), file), "utf8"))];
  }

  let failed = 0;
  scenarios.forEach((sc) => {
    let out;
    try {
      out = runScenario(sc, game, content, trace);
    } catch (e) {
      out = { id: sc.id || "?", caseId: sc.caseId, pass: false, checks: [], error: String(e) };
    }
    printResult(out, trace);
    if (!out.pass) failed++;
  });

  console.log(`\nSummary: ${scenarios.length - failed}/${scenarios.length} PASS`);
  exit(failed > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); exit(1); });
