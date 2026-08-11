# Procedure: Art for a NEW patient

Step-by-step, for when you add illustrations for a patient who does not yet have prompt files. Assumes the case already exists in `site/data/cases.js` (because art is based on case data — species, weight, diagnosis, symptoms). If the case is also new — start with `../../pawthology-onboarding/references/case-authoring-template.md`.

> Your patient = a new clinical case from `cases.js`. First **define the visual identity once**, then write 3 files, then generate + integrate.

## Step 1: Define the visual identity (once, in writing)

Before writing any prompt, establish and record the fixed identity. You will describe this identically across 3 files, character for character.

| Trait | Value (example) | Notes |
|---|---|---|
| `patient` | `burek` | kebab-case, = folder name |
| `species` | `dog` | = `case.species` |
| `breed` | `beagle type` | |
| `age` | `"7 years"` | = `case` signal |
| `sex` | `male` | |
| `coat` | `tricolor — black saddle, tan eyebrows, white chest and paws, short coat` | **most important — fixed across 3 images** |
| `build` | `medium, ~15 kg` | = `case.weightKg` |
| Eye color | `dark brown` | |
| Ear shape | `semi-floppy` | |

**Rule:** the coat must be distinct from the existing 5 patients (see table in `../../../../art/prompts/README.md`), so the player can easily recognize the patient in the UI.

## Step 2: Create 3 prompt files

Directory: `art/prompts/patients/<patient>/`. Three files:

```
art/prompts/patients/burek/
  01-intake.md
  02-treated.md
  03-deteriorating.md
```

### Frontmatter — 24 keys in the same order (see `../../../../art/prompts/SCHEMA.md`)

Copy frontmatter from an existing patient (e.g. `art/prompts/patients/cody/01-intake.md`) and change the values. **`coat` and `build` must be identical across 3 files.** What may change: `phase`, `state`, `filename`, `purpose`, `mood`, `lighting` (deteriorating = slightly dimmer/cooler), `camera` (deteriorating = slightly closer), `honesty`, and the prompt content.

### Content — 3 states of the same patient

| File | State | Posture | Ears | Eyes | Clinical sign |
|---|---|---|---|---|---|
| `01-intake` | suffering | tense/limb raised | slightly back | dull, downcast | evident symptom of the case |
| `02-treated` | treated | relaxed | forward | bright, alert | visible treatment (bandage/splint/clean/application) |
| `03-deteriorating` | worse | hunched, low | flattened | dull, half-closed | symptom worsened (more swelling/more hair loss) |

Each file has 4 sections after the frontmatter: `# Prompt (EN)` (ready prompt), `# Situation description (PL)`, `# Consistency anchors` (what is identical for this patient), `# Integration notes`. Use existing files as templates.

## Step 3: Verify consistency (before generating — saves time)

```bash
# coat identical 3× (should be 1 line × 3)
grep -h "^coat:" art/prompts/patients/<patient>/*.md | sort | uniq -c

# build identical 3×
grep -h "^build:" art/prompts/patients/<patient>/*.md | sort | uniq -c

# filename unique (3 unique)
grep -h "^filename:" art/prompts/patients/<patient>/*.md | sort | uniq | wc -l

# dimensions + aspect ratio fixed (3× each)
grep -h "^dimensions:\|^aspectRatio:" art/prompts/patients/<patient>/*.md | sort | uniq -c

# full frontmatter key set (24, same order)
for f in art/prompts/patients/<patient>/*.md; do
  awk '/^---/{c++; next} c==1 && /^[a-zA-Z]/{print $1}' "$f" | tr '\n' ',' ; echo
done
```

## Step 4: Generate images (user / model)

For each of 3 files: frontmatter + EN prompt → generative model → PNG 1536×1152 → save as `filename`. Details in `../SKILL.md` §"Generating images".

## Step 5: Integration into the game

```js
// site/data/cases.js — in the case entry:
image: "burek-01-intake.png",
imageTreated: "burek-02-treated.png",
imageDeteriorating: "burek-03-deteriorating.png"
```

PNG files → `site/img/cases/`. `main.js`: `<img src="img/cases/..." alt="<description>">` + SVG fallback. Image existence test. Full details in `../SKILL.md` §"Integration into the game".

## Step 6: Final verification

```bash
node tools/validate_game.js .
node --test
node tools/replay.js --check
# + check image paths:
for f in $(node -e "import('./site/data/index.js').then(m=>m.CONTENT.cases.flatMap(c=>[c.image,c.imageTreated,c.imageDeteriorating].filter(Boolean))).then(arr=>arr.forEach(x=>console.log(x)))"); do
  curl -s -o /dev/null -w "%{http_code}  $f\n" "http://localhost:8000/site/img/cases/$f"
done
```

All 200 + verification loop green = done.

## Pitfalls specific to a new patient

- **Coat too similar to an existing patient.** Dior=tortoiseshell, Edi=gray tabby, Cody=brown-and-white, Dante=cream-gold, Frodo=dark gray. A new patient must be visually distinct from all of them.
- **Forgetting one state.** Without `03-deteriorating` the game can't show the consequence of neglect — the +/− narrative is incomplete. Always 3.
- **`caseId`/`diagnosis` in frontmatter inconsistent with `cases.js`.** The frontmatter must point to the real `case.id` and `trueDiagnosis`.
