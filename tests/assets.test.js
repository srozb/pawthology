// Testy zasobów graficznych — weryfikują, że pola image* w cases.js wskazują na
// pliki istniejące w site/img/cases/ i odwrotnie (brak osieroconych plików).
// node --test (bez ścieżki!) — patrz pawthology-onboarding pitfalls.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CONTENT } from "../site/data/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = join(__dirname, "..", "site", "img", "cases");

const filesInDir = (() => {
  try { return new Set(readdirSync(IMG_DIR)); }
  catch { return new Set(); }
})();

// Wszystkie referencje obrazów z cases.js (pomijamy puste/null)
function caseImageRefs() {
  const refs = new Map(); // filename → [caseIds]
  for (const c of CONTENT.cases) {
    for (const key of ["image", "imageTreated", "imageDeteriorating"]) {
      const f = c[key];
      if (f) {
        if (!refs.has(f)) refs.set(f, []);
        refs.get(f).push(`${c.id}.${key}`);
      }
    }
  }
  return refs;
}

test("przypadek ma albo komplet 3 obrazów, albo żaden (fallback SVG)", () => {
  for (const c of CONTENT.cases) {
    const count = ["image", "imageTreated", "imageDeteriorating"].filter((k) => c[k]).length;
    assert.ok(count === 0 || count === 3, `${c.id}: ma ${count}/3 obrazów — albo komplet, albo żaden (fallback SVG)`);
  }
});

test("wszystkie referencje image* w cases.js wskazują na istniejące pliki", () => {
  const refs = caseImageRefs();
  assert.ok(refs.size > 0, "brak referencji obrazów w cases.js");
  const missing = [];
  for (const [file, usedBy] of refs) {
    if (!filesInDir.has(file)) missing.push(`${file} (używany przez: ${usedBy.join(", ")})`);
  }
  assert.deepEqual(missing, [], `brakujące pliki obrazów w site/img/cases/: ${missing.join("; ")}`);
});

test("brak osieroconych plików WebP w site/img/cases/ (nieużywanych przez cases.js)", () => {
  const refs = caseImageRefs();
  const orphaned = [...filesInDir].filter((f) => f.endsWith(".webp") && !refs.has(f));
  assert.deepEqual(orphaned, [], `osierocone pliki (nie ma ich w cases.js): ${orphaned.join(", ")}`);
});

test("nazwy plików obrazów zgodne z konwencją <pacjent>-0<stan>.webp", () => {
  const re = /^[a-z0-9-]+-0[123]-(intake|treated|deteriorating)\.webp$/;
  const bad = [];
  for (const [file] of caseImageRefs()) {
    if (!re.test(file)) bad.push(file);
  }
  assert.deepEqual(bad, [], `niezgodne z konwencją nazw: ${bad.join(", ")}`);
});

// --- Grafiki egzaminów, zabiegów i grup leków ---
// Pola `image` w exams.js / procedures.js wskazują na pliki w site/img/exams|procedures/.
// Pola `image` w drugGroups wskazują na site/img/drug-groups/.
function resolveImgDir(category) {
  const sub = category === "exam" ? "exams" : category === "procedure" ? "procedures" : "drug-groups";
  return join(__dirname, "..", "site", "img", sub);
}

function filesExistInDir(dir) {
  try { return new Set(readdirSync(dir)); }
  catch { return new Set(); }
}

// Mapa: kategoria -> [{file, src}], gdzie src = ids.description
function categoryImageRefs() {
  const refs = [];
  CONTENT.exams.forEach((e) => {
    if (e.image) refs.push({ file: e.image, src: `exam ${e.id}` });
  });
  CONTENT.procedures.forEach((p) => {
    if (p.image) refs.push({ file: p.image, src: `procedure ${p.id}` });
  });
  if (CONTENT.drugGroups) {
    CONTENT.drugGroups.forEach((g) => {
      if (g.image) refs.push({ file: g.image, src: `drugGroup ${g.id}` });
    });
  }
  return refs;
}

test("grafiki egzaminów/zabiegów/grup-leków istnieją w site/img/", () => {
  const refs = categoryImageRefs();
  assert.ok(refs.length > 0, "brak referencji grafik egzaminów/zabiegów/grup");
  const missing = [];
  for (const r of refs) {
    // file = "<sub>/<file>.webp" (ścieżka względna katalogu img)
    const [sub, name] = r.file.includes("/") ? r.file.split("/") : [null, r.file];
    if (!sub) { missing.push(`${r.file} (${r.src}) — brak katalogu`); continue; }
    const dir = join(__dirname, "..", "site", "img", sub);
    const set = filesExistInDir(dir);
    if (!set.has(name)) missing.push(`${r.file} (${r.src})`);
  }
  assert.deepEqual(missing, [], `brakujące grafiki: ${missing.join("; ")}`);
});

test("referencje grafik egzaminów/zabiegów/grup-leków wskazują poprawne katalogi", () => {
  const valid = [/^exams\/[a-z0-9-]+.webp$/, /^procedures\/[a-z0-9-]+.webp$/, /^drug-groups\/[a-z0-9-]+.webp$/];
  const bad = categoryImageRefs().filter((r) => !valid.some((re) => re.test(r.file)));
  assert.deepEqual(bad, [], `niepoprawne ścieżki grafik: ${bad.map((b) => b.file).join(", ")}`);
});
