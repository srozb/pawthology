# Frontmatter — shared structure (same in every file)

Every `.md` prompt file begins with a YAML frontmatter with a **consistent set of keys**
in the same order, so the set is uniform and easy to parse.

## Keys

### Patient identification (patient prompts)
- `id` — unique image id, e.g. `dior-01-intake`
- `patient` — patient name, e.g. `dior`
- `species` — species: `cat` / `dog` / `rabbit` / `parrot`
- `breed` — breed/type, e.g. `domestic shorthair (DSH)` / `mixed breed`
- `age` — age, e.g. `5 years`
- `sex` — `female` / `male`
- `coat` — coat (very precise — CONSTANT for that patient across all 3 of its images)
- `build` — body build, e.g. `medium, adult`

### Clinical context
- `caseId` — in-game case id, e.g. `case-fleas-cat`
- `diagnosis` — diagnosis (English; Latin/scientific names kept)
- `phase` — `intake` / `treated` / `deteriorating`
- `state` — short state description, e.g. `suffering — untreated`

### Output file
- `filename` — output PNG/WebP name, e.g. `dior-01-intake.png`
- `dimensions` — `1536x1152` (patients), `768x768` (exams/procedures), `768x384` (drug-groups)
- `aspectRatio` — `4:3` / `1:1` / `2:1`
- `purpose` — where in the game (e.g. `intake hero + card thumbnail`)

### Style anchors (inlined because the model only sees this one file)
- `style` — rendering style
- `lighting` — lighting
- `palette` — color palette
- `environment` — surroundings (constant clinic)
- `camera` — framing/camera
- `mood` — mood/emotion
- `honesty` — honesty rule (no blood, child-appropriate)
- `avoid` — negative prompt

## File body (after frontmatter)

Every prompt file uses a single English block:

```
# Prompt (EN)

> [ready-to-paste English prompt for the model — detailed, 1–3 paragraphs,
   ending with the negative-prompt sentence: "No blood, no gore, no cartoon,
   no anime, no text, no watermark, no logo, no collage, no split panel,
   no deformed anatomy."]
```

## Example (abbreviated)

```yaml
---
id: dior-01-intake
patient: dior
species: cat
breed: domestic shorthair (DSH)
age: "5 years"
sex: female
coat: tortoiseshell — ginger and black patches, white paws and chest blaze
build: medium, adult
caseId: case-fleas-cat
diagnosis: flea infestation / flea allergy dermatitis
phase: intake
state: suffering — untreated
filename: dior-01-intake.png
dimensions: 1536x1152
aspectRatio: 4:3
purpose: intake hero + card thumbnail
style: realistic veterinary medical illustration, soft naturalistic painterly
lighting: soft diffused daylight from left window, warm-neutral key, gentle fill
palette: muted warm clinic — cream, sage, brushed steel, ginger/black fur accent
environment: cozy modern veterinary exam room, stainless-steel table, cream wall, left window
camera: medium shot, eye-level at table height, shallow depth of field
mood: distress, restlessness, quiet suffering
honesty: show suffering via posture and eyes — no blood, no gore, child-appropriate
avoid: cartoon, anime, anthropomorphic smile, humanized expression, blood, gore, text, watermark, logo, collage, split panel, extra limbs, deformed anatomy
---
```
