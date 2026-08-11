#!/usr/bin/env python3
"""Scaffold + completeness checker for new Pawthology cases.

Two modes:
  --new   creates a skeleton (art/prompts dirs, scenario stubs, suggests a claimId) + prints a checklist
  --check <caseId>  completeness linter: all case artifacts must exist

Does NOT generate medical content (that is the LLM/human role per EXTENDING.md) - only structure + guardrails.

Usage:
  python3 tools/scaffold_case.py --new --id case-feline-herpesvirus --species cat --disease feline-herpesvirus --name Bageera --weight 4 --diff 2
  python3 tools/scaffold_case.py --check case-feline-herpesvirus
"""
import argparse, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "site" / "data"
SCEN = ROOT / "scenarios"
ART = ROOT / "art" / "prompts" / "patients"
CLAIMS = ROOT / "research" / "claims.md"


def load_content():
    """Load data via node _dump.mjs (same as the Python validator used to)."""
    dump = ROOT / "tools" / "_dump.mjs"
    r = subprocess.run(["node", str(dump)], capture_output=True, text=True)
    if r.returncode != 0:
        print("Failed to load data (node _dump.mjs):", r.stderr, file=sys.stderr)
        sys.exit(1)
    return json.loads(r.stdout)


def next_claim_id(prefix: str) -> str:
    """Next free C-<PREFIX>-NN from claims.md."""
    used = set()
    if CLAIMS.exists():
        for m in re.finditer(rf"{re.escape(prefix)}-(\d+)", CLAIMS.read_text(encoding="utf-8")):
            used.add(int(m.group(1)))
    n = 1
    while n in used:
        n += 1
    return f"{prefix}-{n:02d}"


def slugify(name: str) -> str:
    # ASCII-fold Polish diacritics (Latek -> cody), per the image-naming convention in site/img/cases/
    tbl = str.maketrans("ąćęłńóśźżĄĆĘŁŃÓŚŹŽ",
                       "acelnoszzACELNOSZZ")
    name = name.translate(tbl)
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


# ----- --new -----------------------------------------------------------------

STYLE_HINT = "<!-- Content per art/prompts/STYLE-GUIDE.md: realistic veterinary illustration, no blood/gore, suitable for a 10-year-old. -->\n"


def cmd_new(args, content):
    cid = args.id
    if any(c["id"] == cid for c in content["cases"]):
        sys.exit(f"ERROR: case {cid} already exists in cases.js")
    if args.species and not any(s["id"] == args.species for s in content["species"]):
        print(f"NOTE: species {args.species!r} does not exist - add it in species.js (EXTENDING section: species)")
    if args.disease and not any(d["id"] == args.disease for d in content["diseases"]):
        print(f"NOTE: disease {args.disease!r} does not exist - add it in diseases.js (EXTENDING section: disease)")
    case_claim = next_claim_id("C-CASE")
    slug = slugify(args.name)

    # 1. art prompts
    adir = ART / slug
    adir.mkdir(parents=True, exist_ok=True)
    for fn, phase in [("01-intake.md", "intake - signs, patient appearance"),
                      ("02-treated.md", "after treatment - healthy, bright"),
                      ("03-deteriorating.md", "deterioration - lethargic, signs worsening")]:
        p = adir / fn
        if not p.exists():
            p.write_text(f"# {args.name} - {phase}\n\n{STYLE_HINT}\n## Subject\n\n- Species: {args.species}\n- Patient: {args.name}\n- Phase: {phase.split(' - ')[0]}\n\n## Focus\n\n<!-- what is visible in the illustration -->\n\n## Avoid\n\nblood, gore, frightening details\n", encoding="utf-8")
            print(f"  created {p.relative_to(ROOT)}")

    # 2. scenario stubs (good + bad)
    for tag, diag, note in [("good", args.disease or "TODO", "good path - correct treatment"),
                            ("bad", "TODO-wrongdx", "bad path - antibiotic for a virus / wrong dose / no treatment")]:
        sp = SCEN / f"{cid.replace('case-', '')}-{tag}.json"
        if not sp.exists():
            stub = {
                "id": f"{cid.replace('case-', '')}-{tag}",
                "caseId": cid,
                "decisions": {"weightKg": args.weight or 0, "exams": [], "diagnosis": diag, "treatments": []},
                "expected": {"_TODO": f"run: node tools/replay.js {sp.name} --trace and fill in expected"},
            }
            sp.write_text(json.dumps(stub, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"  created {sp.relative_to(ROOT)}  ({note})")

    # 3. checklist
    print(f"""
✓ Skeleton created. ClaimId for the case: {case_claim} (add it to claims.md)

CHECKLIST - fill in by hand per EXTENDING.md:

[ ] 1. DATA - site/data/cases.js: add an entry for {cid}
      - all fields per schema (see case-authoring-template section 1)
      - claimIds: ["{case_claim}"]
      - examResults: 3 paragraphs (introPl/findingsPl/closingPl + *En) per exam
      - images: 0 or 3 (a full set: image+imageTreated+imageDeteriorating) or none
      - image filenames: {slug}-0<1|2|3>-(intake|treated|deteriorating).png in site/img/cases/

[ ] 2. DEPENDENT ENTITIES (if any are missing - check the NOTES above):
      - disease {args.disease} in diseases.js (+ claimIds, recommendedGroups, requiredExams)
      - any new exam in exams.js (+ claimIds C-EXM-NN, image)
      - any new drug in drugs.js (+ groupId, per-species dosing, bidirectional speciesToxic)
      - any new recommendations in procedures.js recommendations[] (claimIds C-RUB-REC)

[ ] 3. CLAIMS - research/claims.md: add a row
      | {case_claim} | <statement> | <Class> | S-MVM | O-NN | case: {cid} | cases.js {cid} | draft | - |
      + claims for new diseases/drugs/exams (C-DIS-NN, C-DRG-NN, C-EXM-NN)

[ ] 4. SCENARIOS - scenarios/: fill in the stubs with decisions, then:
      node tools/replay.js scenarios/<file>.json --trace   # learn the actual result
      set expected (xp / patientOutcome / mustContainVerdicts / mustNotContainVerdicts)

[ ] 5. ART - art/prompts/patients/{slug}/: fill in the 3 prompts, generate PNGs into site/img/cases/

[ ] 6. VERIFICATION:
      node tools/validate_game.js .
      node tools/explore.js {cid} --trace
      node tools/explore.js {cid} --only toxic    # if species-toxic
      node --test
      node tools/replay.js --check
      node tools/explore.js --all
      node tools/replay.js --lang en

[ ] 7. SKILL check: python3 tools/scaffold_case.py --check {cid}
""")


# ----- --check ---------------------------------------------------------------

REQUIRED_CASE_FIELDS = [
    "id", "difficulty", "species", "weightKg", "patientName",
    "narrativePl", "narrativeEn", "signalPl", "signalEn",
    "historyPl", "historyEn", "symptomsPl", "symptomsEn",
    "trueDiagnosis", "diagnosisOptions", "examResults",
    "epilogueClosingGoodPl", "epilogueClosingGoodEn",
    "epilogueClosingBadPl", "epilogueClosingBadEn",
    "expectedProcedures", "expectedSurgeries", "expectedRecommendations",
    "claimIds",
]


def cmd_check(args, content):
    case = next((c for c in content["cases"] if c["id"] == args.check), None)
    if not case:
        sys.exit(f"ERROR: case {args.check} does not exist in cases.js")
    exam_ids = {e["id"] for e in content["exams"]}
    disease_ids = {d["id"] for d in content["diseases"]}
    sp_ids = {s["id"] for s in content["species"]}
    proc_ids = {p["id"] for p in content["procedures"]}
    rec_ids = {r["id"] for r in content["recommendations"]}
    drug_ids = {d["id"] for d in content["drugs"]}
    proc_kind = {p["id"]: p.get("kind") for p in content["procedures"]}
    claims_text = CLAIMS.read_text(encoding="utf-8") if CLAIMS.exists() else ""
    all_claim_ids = set(re.findall(r"(C-[A-Z]+-\d+)", claims_text))

    errors, warnings = [], []

    # 1. fields
    for f in REQUIRED_CASE_FIELDS:
        if f not in case:
            errors.append(f"missing field `{f}`")
    if "image" in case and not all(k in case for k in ("image", "imageTreated", "imageDeteriorating")):
        errors.append("images: rule 0 or 3 - missing imageTreated/imageDeteriorating (a full set or none)")

    # 2. references
    if case.get("species") not in sp_ids:
        errors.append(f"species {case.get('species')!r} does not exist")
    if case.get("trueDiagnosis") not in disease_ids:
        errors.append(f"trueDiagnosis {case.get('trueDiagnosis')!r} does not exist in diseases.js")
    for opt in case.get("diagnosisOptions", []):
        if opt not in disease_ids:
            errors.append(f"diagnosisOption {opt!r} does not exist in diseases.js")
    for ex in case.get("examResults", {}):
        if ex not in exam_ids:
            errors.append(f"examResults key {ex!r} does not exist in exams.js")
        else:
            # 3 paragraphs?
            er = case["examResults"][ex]
            for fld in ("introPl", "findingsPl", "closingPl"):
                if fld not in er:
                    warnings.append(f"examResults[{ex}] missing {fld} (old textPl fallback?)")

    # 3. procedures/surgeries/recommendations + kind
    for pid in case.get("expectedProcedures", []) + case.get("optionalProcedures", []) + case.get("contraindicatedProcedures", []):
        if pid not in proc_ids:
            errors.append(f"procedure {pid!r} does not exist in procedures.js")
        elif proc_kind.get(pid) != "procedure":
            errors.append(f"procedure field {pid!r} has kind={proc_kind.get(pid)!r} (must be procedure)")
    for sid in case.get("expectedSurgeries", []):
        if sid not in proc_ids:
            errors.append(f"surgery {sid!r} does not exist")
        elif proc_kind.get(sid) != "surgery":
            errors.append(f"expectedSurgeries {sid!r} has kind={proc_kind.get(sid)!r} (must be surgery)")
    for rid in case.get("expectedRecommendations", []):
        if rid not in rec_ids:
            errors.append(f"recommendation {rid!r} does not exist in recommendations")

    # 4. claimIds
    for cid in case.get("claimIds", []):
        if cid not in all_claim_ids:
            errors.append(f"claimId {cid!r} not found in claims.md")

    # 5. weight within species range
    sp_obj = next((s for s in content["species"] if s["id"] == case.get("species")), None)
    if sp_obj and "weightKg" in case:
        wr = sp_obj["weightRangeKg"]
        if not (wr["min"] <= case["weightKg"] <= wr["max"]):
            warnings.append(f"weight {case['weightKg']} outside species weightRangeKg ({wr['min']}-{wr['max']})")

    # 6. patient images - do the PNG files exist?
    for fld, suffix in [("image", "01-intake"), ("imageTreated", "02-treated"), ("imageDeteriorating", "03-deteriorating")]:
        if fld in case:
            png = ROOT / "site" / "img" / "cases" / Path(case[fld]).name
            if not png.exists():
                warnings.append(f"{fld} -> {png.name} does not exist in site/img/cases/ (placeholder required)")
            art_p = ART / slugify(case["patientName"]) / f"{suffix}.md"
            if not art_p.exists():
                warnings.append(f"art prompt {art_p.relative_to(ROOT)} does not exist")

    # 7. scenarios - do files exist for this case?
    case_scen = [f for f in SCEN.glob("*.json") if json.loads(f.read_text(encoding="utf-8")).get("caseId") == case["id"]]
    if not case_scen:
        errors.append("no scenario files in scenarios/ for this case (at least good + 1 bad)")
    elif len(case_scen) < 2:
        warnings.append("only 1 scenario - at least 2 recommended (good + a regression guard)")

    # 8. do disease recommendedGroups exist as groups?
    dis = next((d for d in content["diseases"] if d["id"] == case.get("trueDiagnosis")), None)
    if dis:
        group_ids = {g["id"] for g in content.get("drugGroups", [])}
        for g in dis.get("recommendedGroups", []):
            if g not in group_ids:
                errors.append(f"disease.recommendedGroups {g!r} has no entry in drugGroups")

    # summary
    print(f"=== CHECK of case {case['id']} ({case.get('patientName')}) ===")
    if errors:
        print(f"\n✗ ERRORS ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
    if warnings:
        print(f"\n⚠ Warnings ({len(warnings)}):")
        for w in warnings:
            print(f"  - {w}")
    if not errors and not warnings:
        print("\n✓ COMPLETE - all fields, references, images, scenarios, claims present.")
    print()
    if errors:
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description="Scaffold + check Pawthology cases")
    ap.add_argument("--new", action="store_true", help="create a skeleton for a new case")
    ap.add_argument("--check", metavar="CASEID", help="check completeness of an existing case")
    ap.add_argument("--id", help="(new) case id, e.g. case-feline-herpesvirus")
    ap.add_argument("--species", help="(new) species id")
    ap.add_argument("--disease", help="(new) disease id")
    ap.add_argument("--name", help="(new) patient name")
    ap.add_argument("--weight", type=float, help="(new) weight in kg")
    ap.add_argument("--diff", type=int, help="(new) difficulty 1-3")
    a = ap.parse_args()
    if a.check:
        cmd_check(a, load_content())
    elif a.new:
        if not a.id or not a.name:
            ap.error("--new requires --id and --name")
        cmd_new(a, load_content())
    else:
        ap.print_help()


if __name__ == "__main__":
    main()
