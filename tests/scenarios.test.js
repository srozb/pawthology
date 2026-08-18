// Testy golden scenarios — ładuje wszystkie scenarios/*.json i asercjonuje
// przez evaluateCase (poza runnerem, w node --test).
// Każdy scenariusz = osobny test z dynamiczną nazwą z scenario.id.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateCase } from "../site/js/game.js";
import { CONTENT } from "../site/data/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCENARIO_DIR = resolve(__dirname, "..", "scenarios");

function loadScenarios() {
  return readdirSync(SCENARIO_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(SCENARIO_DIR, f), "utf8")));
}

function verdictRules(result) {
  return new Set(result.verdicts.map((v) => v.rule));
}

const scenarios = loadScenarios();
const caseIds = new Set(CONTENT.cases.map((c) => c.id));
const drugIds = new Set(CONTENT.drugs.map((d) => d.id));

// --- Walidacja strukturalna wszystkich scenariuszy ---

test("wszystkie scenariusze mają poprawne referencje caseId", () => {
  const bad = scenarios.filter((s) => !caseIds.has(s.caseId));
  assert.deepEqual(bad, [], `Scenariusze z nieistniejącym caseId: ${bad.map((s) => s.id).join(", ")}`);
});

test("żaden scenariusz nie odwołuje się do nieistniejącego leku w decisions.treatments", () => {
  const bad = [];
  for (const s of scenarios) {
    for (const rx of s.decisions.treatments || []) {
      if (!drugIds.has(rx.drug)) {
        bad.push(`${s.id}: lek "${rx.drug}" nie istnieje w data/drugs.js`);
      }
    }
  }
  assert.deepEqual(bad, [], `Scenariusze z nieistniejącymi lekami: ${bad.join("; ")}`);
});

test("każdy scenariusz ma wymagane pola (id, caseId, decisions, expected)", () => {
  const bad = scenarios.filter(
    (s) => !s.id || !s.caseId || !s.decisions || !s.expected
  );
  assert.deepEqual(bad, [], `Scenariusze z brakującymi polami: ${bad.map((s) => s.id).join(", ")}`);
});

// maxXp per case = wynik kanonicznego scenariusza „-good” (zamierzony najlepszy przebieg).
// Utrzymuje maxXp w synchronizacji ze zmianami rubryki: gdy delta się zmieni, test
// się posypie i wymusi przeliczenie maxXp w cases.js.
test("maxXp każdego przypadku = wynik kanonicznego scenariusza *-good", () => {
  const good = scenarios.filter((s) => s.id.endsWith("-good"));
  for (const s of good) {
    const c = CONTENT.cases.find((x) => x.id === s.caseId);
    const r = evaluateCase(c, s.decisions, CONTENT);
    assert.equal(r.xp, c.maxXp, `${c.id}: good scenario xp=${r.xp} ≠ maxXp=${c.maxXp}`);
  }
});

// Cap: żaden scenariusz nie przekracza maxXp swojego przypadku (ucięcie zachowuje uczciwość).
test("cap: żaden scenariusz nie przekracza maxXp przypadku", () => {
  for (const s of scenarios) {
    const c = CONTENT.cases.find((x) => x.id === s.caseId);
    const r = evaluateCase(c, s.decisions, CONTENT);
    assert.ok(r.xp <= c.maxXp, `${s.id}: xp=${r.xp} > maxXp=${c.maxXp}`);
  }
});

// --- Testy per-scenariusz (dynamiczne) ---

for (const scenario of scenarios) {
  test(`scenario: ${scenario.id} (${scenario.caseId})`, () => {
    const caseObj = CONTENT.cases.find((c) => c.id === scenario.caseId);
    assert.ok(caseObj, `caseId ${scenario.caseId} nie istnieje`);

    const result = evaluateCase(caseObj, scenario.decisions, CONTENT);
    const rules = verdictRules(result);
    const exp = scenario.expected;

    // XP
    if (Array.isArray(exp.xp)) {
      const [lo, hi] = exp.xp;
      assert.ok(
        result.xp >= lo && result.xp <= hi,
        `xp=${result.xp} poza zakresem [${lo},${hi}]`
      );
    } else if (typeof exp.xp === "number") {
      assert.equal(result.xp, exp.xp, `xp=${result.xp} ≠ ${exp.xp}`);
    }

    // patientOutcome
    if (exp.patientOutcome) {
      assert.equal(
        result.patientOutcome,
        exp.patientOutcome,
        `outcome=${result.patientOutcome} ≠ ${exp.patientOutcome}`
      );
    }

    // mustContainVerdicts
    for (const r of exp.mustContainVerdicts || []) {
      assert.ok(
        rules.has(r),
        `brak wymaganego werdyktu ${r} (posiadane: ${[...rules].join(", ")})`
      );
    }

    // mustNotContainVerdicts
    for (const r of exp.mustNotContainVerdicts || []) {
      assert.ok(
        !rules.has(r),
        `wystąpił zakazany werdykt ${r}`
      );
    }
  });
}
