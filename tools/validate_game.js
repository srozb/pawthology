#!/usr/bin/env node
/**
 * Validator of readiness and consistency of the 'Pawthology' project.
 * 
 * Usage:
 *   node tools/validate_game.js [PROJECT_DIR] [--with-tests]
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
let withTests = false;
let projectDir = '.';

for (const arg of args) {
  if (arg === '--with-tests') {
    withTests = true;
  } else {
    projectDir = arg;
  }
}

const root = path.resolve(process.cwd(), projectDir);

const errors = [];
const warnings = [];

// 1. Project files
const requiredFiles = [
  "research/brief.md", "research/claims.md", "research/assets.md",
  "research/data-model.md",
  "site/index.html", "site/styles.css",
  "site/js/game.js", "site/js/i18n.js", "site/js/main.js",
  "site/data/index.js", "site/data/species.js", "site/data/exams.js",
  "site/data/drugs.js", "site/data/diseases.js", "site/data/cases.js",
  "site/data/procedures.js",
  "site/data/rubrics.js",
  "tools/replay.js", "tests/game.test.js",
  "package.json",
];

for (const rel of requiredFiles) {
  const fullPath = path.join(root, rel);
  if (!fs.existsSync(fullPath)) {
    if (rel.endsWith('main.js')) {
      warnings.push(`Missing (UI phase): ${rel}`);
    } else {
      errors.push(`Missing required file: ${rel}`);
    }
  }
}

// Scenarios
const scenDir = path.join(root, 'scenarios');
if (!fs.existsSync(scenDir)) {
  errors.push("Missing golden scenarios (scenarios/*.json)");
} else {
  const files = fs.readdirSync(scenDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    errors.push("Missing golden scenarios (scenarios/*.json)");
  }
}

// 2. Load data directly
let content = null;
try {
  const dataModulePath = path.join(root, 'site/data/index.js');
  const module = await import('file://' + dataModulePath);
  content = module.CONTENT;
} catch (e) {
  errors.push(`Failed to load data (site/data/index.js): ${e.message}`);
}

// 3. claims.md -> set of claimIds
const claimsPath = path.join(root, 'research/claims.md');
const claimIds = new Set();
if (fs.existsSync(claimsPath)) {
  const text = fs.readFileSync(claimsPath, 'utf8');
  const regex = /^\|\s*(C-[A-Z0-9-]+)\s*\|/gm;
  let match;
  while ((match = regex.exec(text)) !== null) {
    claimIds.add(match[1]);
  }
}

function _claim(obj, errors, kind) {
  const ids = obj.claimIds || [];
  if (!ids.length) {
    errors.push(`${kind} ${obj.id}: missing claimIds`);
    return;
  }
  for (const cid of ids) {
    if (!claimIds.has(cid)) {
      errors.push(`${kind} ${obj.id}: claimId '${cid}' missing in research/claims.md`);
    }
  }
}

function validateContent(c) {
  const idsSeen = {};
  function seen(kind, ident) {
    if (!idsSeen[kind]) idsSeen[kind] = [];
    idsSeen[kind].push(ident);
  }

  // species
  const spIds = new Set();
  for (const s of (c.species || [])) {
    seen('species', s.id); spIds.add(s.id);
    _claim(s, errors, 'species');
    if (!s.toxicDrugs || s.toxicDrugs.length === 0) {
      warnings.push(`species ${s.id}: empty toxicDrugs (possibly OK)`);
    }
  }

  // exams
  const examIds = new Set();
  for (const e of (c.exams || [])) {
    seen('exams', e.id); examIds.add(e.id);
    if (typeof e.cost !== 'number' || e.cost <= 0) {
      errors.push(`exam ${e.id}: cost must be > 0`);
    }
    _claim(e, errors, 'exam');
  }

  // drugs
  const drugIds = new Set();
  const groupIds = new Set();
  for (const d of (c.drugs || [])) {
    seen('drugs', d.id); drugIds.add(d.id); groupIds.add(d.groupId);
    if (!['systemic', 'topical'].includes(d.dosingType)) {
      errors.push(`drug ${d.id}: dosingType must be systemic|topical, is '${d.dosingType}'`);
    }
    if (!['draft', 'llm-audited'].includes(d.reviewStatus)) {
      errors.push(`drug ${d.id}: reviewStatus disallowed: '${d.reviewStatus}'`);
    }
    if (!d.sources || d.sources.length === 0) {
      errors.push(`drug ${d.id}: missing sources`);
    }
    _claim(d, errors, 'drug');
    if (d.dosingType === 'systemic') {
      for (const [sp, dos] of Object.entries(d.dosing || {})) {
        const mg = dos.mgPerKg;
        if (mg && (mg.min || 0) > (mg.max || 0)) {
          errors.push(`drug ${d.id} (${sp}): mgPerKg.min > max`);
        }
      }
    }
    for (const sp of (d.speciesToxic || [])) {
      const spObj = c.species.find(x => x.id === sp);
      if (!spObj) {
        errors.push(`drug ${d.id}: speciesToxic -> unknown species '${sp}'`);
      } else if (!(spObj.toxicDrugs || []).includes(d.id)) {
        warnings.push(`drug ${d.id} speciesToxic=[${sp}], but species.toxicDrugs does not contain ${d.id} (one-way)`);
      }
    }
  }

  for (const s of c.species) {
    for (const did of (s.toxicDrugs || [])) {
      const drug = c.drugs.find(x => x.id === did);
      if (!drug) {
        errors.push(`species ${s.id}.toxicDrugs -> unknown drug '${did}'`);
      } else if (!(drug.speciesToxic || []).includes(s.id)) {
        warnings.push(`species ${s.id}.toxicDrugs contains ${did}, but drug.speciesToxic does not contain ${s.id} (one-way)`);
      }
    }
  }

  // diseases
  const diseaseIds = new Set();
  for (const d of (c.diseases || [])) {
    seen('diseases', d.id); diseaseIds.add(d.id);
    const exList = [].concat(d.requiredExams || [], d.supportiveExams || [], d.optionalExams || []);
    for (const ex of exList) {
      if (!examIds.has(ex)) {
        errors.push(`disease ${d.id}: exam '${ex}' does not exist in exams`);
      }
    }
    const grList = [].concat(d.recommendedGroups || [], d.contraindicatedGroups || []);
    for (const g of grList) {
      if (!groupIds.has(g)) {
        warnings.push(`disease ${d.id}: group '${g}' has no drug (possibly OK)`);
      }
    }
    _claim(d, errors, 'disease');
  }

  // procedures + recommendations
  const procIds = new Set();
  const recIds = new Set();
  for (const p of (c.procedures || [])) {
    seen('procedures', p.id);
    if (!['procedure', 'surgery'].includes(p.kind)) {
      errors.push(`procedure ${p.id}: kind must be procedure|surgery, is '${p.kind}'`);
    }
    procIds.add(p.id);
    if (!p.sources || p.sources.length === 0) {
      errors.push(`procedure ${p.id}: missing sources`);
    }
    if (!['draft', 'llm-audited'].includes(p.reviewStatus)) {
      errors.push(`procedure ${p.id}: reviewStatus disallowed: '${p.reviewStatus}'`);
    }
    _claim(p, errors, 'procedure');
  }
  for (const r of (c.recommendations || [])) {
    seen('recommendations', r.id);
    recIds.add(r.id);
    if (!r.sources || r.sources.length === 0) {
      errors.push(`recommendation ${r.id}: missing sources`);
    }
    if (!['draft', 'llm-audited'].includes(r.reviewStatus)) {
      errors.push(`recommendation ${r.id}: reviewStatus disallowed: '${r.reviewStatus}'`);
    }
    _claim(r, errors, 'recommendation');
  }

  // cases
  for (const cs of (c.cases || [])) {
    seen('cases', cs.id);
    if (!spIds.has(cs.species)) {
      errors.push(`case ${cs.id}: unknown species '${cs.species}'`);
    }
    if (!diseaseIds.has(cs.trueDiagnosis)) {
      errors.push(`case ${cs.id}: trueDiagnosis '${cs.trueDiagnosis}' does not exist`);
    }
    for (const opt of (cs.diagnosisOptions || [])) {
      if (!diseaseIds.has(opt)) {
        errors.push(`case ${cs.id}: diagnosisOption '${opt}' does not exist in diseases`);
      }
    }
    for (const ex of Object.keys(cs.examResults || {})) {
      if (!examIds.has(ex)) {
        errors.push(`case ${cs.id}: result for exam '${ex}' which does not exist in exams`);
      }
    }
    const pidList = [].concat(cs.expectedProcedures || [], cs.optionalProcedures || [], cs.contraindicatedProcedures || []);
    for (const pid of pidList) {
      if (!procIds.has(pid)) {
        errors.push(`case ${cs.id}: procedure '${pid}' does not exist in procedures`);
      } else {
        const pobj = c.procedures.find(x => x.id === pid);
        if (pobj && pobj.kind !== 'procedure') {
          errors.push(`case ${cs.id}: procedure field '${pid}' has kind='${pobj.kind}' (requires procedure; surgeries go to expectedSurgeries)`);
        }
      }
    }
    for (const sid of (cs.expectedSurgeries || [])) {
      if (!procIds.has(sid)) {
        errors.push(`case ${cs.id}: surgery '${sid}' does not exist in procedures`);
      } else {
        const pobj = c.procedures.find(x => x.id === sid);
        if (pobj && pobj.kind !== 'surgery') {
          errors.push(`case ${cs.id}: expectedSurgeries '${sid}' has kind='${pobj.kind}' (requires surgery)`);
        }
      }
    }
    for (const rid of (cs.expectedRecommendations || [])) {
      if (!recIds.has(rid)) {
        errors.push(`case ${cs.id}: recommendation '${rid}' does not exist in recommendations`);
      }
    }
    const spObj = c.species.find(x => x.id === cs.species);
    if (spObj && !(cs.weightKg >= spObj.weightRangeKg.min && cs.weightKg <= spObj.weightRangeKg.max)) {
      warnings.push(`case ${cs.id}: weight ${cs.weightKg} outside species weightRangeKg`);
    }

    const diff = cs.difficulty || 1;
    const dis = c.diseases.find(x => x.id === cs.trueDiagnosis);
    if (dis) {
      for (const grp of (dis.recommendedGroups || [])) {
        for (const drug of c.drugs) {
          if (drug.groupId === grp && (drug.minLevel || 1) > diff) {
            errors.push(`case ${cs.id} (L${diff}): group '${grp}' recommended, but drug ${drug.id} has minLevel=${drug.minLevel || 1} > ${diff} — unwinnable (unlock by lowering minLevel)`);
          }
        }
      }
    }
    for (const pid of [].concat(cs.expectedProcedures || [], cs.expectedSurgeries || [])) {
      const pobj = c.procedures.find(x => x.id === pid);
      if (pobj && (pobj.minLevel || 1) > diff) {
        errors.push(`case ${cs.id} (L${diff}): required procedure/surgery '${pid}' has minLevel=${pobj.minLevel || 1} > ${diff} — unwinnable`);
      }
    }
    _claim(cs, errors, 'case');
  }

  // glossary
  const glosIds = new Set();
  for (const g of (c.GLOSSARY || c.glossary || [])) {
    seen('glossary', g.id); glosIds.add(g.id);
    if (!g.id || !g.id.startsWith('g-')) {
      errors.push(`glossary: id '${g.id}' must start with 'g-'`);
    }
    if (!g.term || !g.termEn) {
      errors.push(`glossary ${g.id}: missing term/termEn`);
    }
    if (!g.simplePl && !g.fullPl) {
      errors.push(`glossary ${g.id}: missing simplePl/fullPl (NOT defPl — bad schema)`);
    }
    if (g.defPl || g.defEn) {
      errors.push(`glossary ${g.id}: defPl/defEn field must not exist — use simplePl/simpleEn/fullPl/fullEn`);
    }
  }

  // rubrics
  for (const [rule, cfg] of Object.entries(c.rubricConfig || {})) {
    if (!rule.startsWith('R-')) {
      errors.push(`rubricConfig: key '${rule}' does not start with R-`);
    }
    if (!claimIds.has(cfg.claimId)) {
      errors.push(`rubric ${rule}: claimId '${cfg.claimId}' missing in claims.md`);
    }
  }

  // duplicates
  for (const [kind, lst] of Object.entries(idsSeen)) {
    const counts = {};
    for (const id of lst) {
      counts[id] = (counts[id] || 0) + 1;
    }
    const dups = Object.keys(counts).filter(k => counts[k] > 1);
    if (dups.length > 0) {
      errors.push(`duplicate IDs in ${kind}: ${dups.sort().join(', ')}`);
    }
  }

  // drafts
  const drafts = c.drugs.filter(d => d.reviewStatus === 'draft').length;
  if (drafts > 0) {
    warnings.push(`${drafts} drugs have reviewStatus='draft' — requires verification`);
  }
}

if (content) {
  validateContent(content);
}

// 4. optional tests
if (withTests) {
  const commands = [
    ['node', '--test'],
    ['node', 'tools/replay.js', '--check'],
    ['node', 'tools/explore.js', '--all']
  ];
  for (const cmd of commands) {
    try {
      execSync(cmd.join(' '), { cwd: root, stdio: 'pipe' });
    } catch (e) {
      const out = (e.stdout || '').toString();
      const err = (e.stderr || '').toString();
      errors.push(`Failed: ${cmd.join(' ')}\n${out.slice(-1500)}${err.slice(-800)}`);
    }
  }
}

console.log("=== Pawthology — validation ===");
if (warnings.length > 0) {
  console.log(`\n⚠ Warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.log("  - " + w);
  }
}

if (errors.length > 0) {
  console.log(`\n✗ Errors (${errors.length}):`);
  for (const e of errors) {
    console.log("  - " + e);
  }
  console.log(`\nRESULT: FAIL (${errors.length} errors)`);
  process.exit(1);
}

console.log(`\n✓ RESULT: OK (${warnings.length} warnings)`);
process.exit(0);
