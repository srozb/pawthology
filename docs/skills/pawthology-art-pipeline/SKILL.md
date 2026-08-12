---
name: pawthology-art-pipeline
description: Producing consistent patient illustrations for the Pawthology game and integrating images into the game. ALWAYS use this skill when the user asks for: artwork/illustrations/images for Pawthology, prompts for generating patient images, "art prompt", adding an image to a case, replacing SVG icons with a real illustration, describing a patient in 3 states (suffering/treated/deteriorating). Triggers: "Pawthology artwork", "patient illustration", "image for a case", "art prompt Pawthology", "generate images Pawthology", "integrate images", "patient illustration", "3 patient states", "dior/edi/frodo/cody/dante artwork". Load this skill whenever patient visuals for Pawthology are mentioned — even without the word "skill".
---

# Pawthology — Patient Illustration Pipeline

This skill produces **consistent, realistic veterinary illustrations** that replace the current SVG icons and integrates them into the game. Realistic, but without blood/gore — appropriate for a 10-year-old; clinically honest for adults/students. The canonical style source is `../../../art/prompts/STYLE-GUIDE.md` — this skill is a workflow layer on top of it.

## Model: 3 states per patient (and why)

Each patient has **3 illustrations**, mapped to game phases:

| State | When in game | What it shows |
|---|---|---|
| `01-intake` | case selection card + intake phase | suffering, untreated — evident clinical signs |
| `02-treated` | outcome: good treatment | after diagnosis and treatment — bandage/splint/clean ear/application, calm |
| `03-deteriorating` | outcome: no/wrong treatment | condition has worsened — more swelling/more hair loss/weakness |

**Why 3:** the game gives honest +/− feedback. Intake teaches recognizing symptoms; treated shows the fruit of good treatment; deteriorating shows the consequence of neglect. Three images = a complete case narrative. And this is the heart of consistency: **the same patient** across 3 images (identical coat pattern, markings, build, sex, ears) — only mood/posture/treatment change.

## Style contract (non-negotiables)

Full master: `../../../art/prompts/STYLE-GUIDE.md`. Condensed rules you must hold to at all costs:

- **One fixed exam room** in all images: steel table, warm cream wall, window on the left (key light), sage towel, oak floor, stethoscope in the background. Never a white studio.
- **One palette + light family**: muted, warm clinical tones; the animal's coat color = the strongest accent. In `deteriorating`, the same light but slightly dimmed/cooler (a signal of decline, not drama).
- **One framing family**: medium shot, camera at table height, shallow depth of field. Animal ~60% of frame.
- **Render style**: soft, naturalistic, painterly. **Not** photorealistic plastic, **not** cartoon/anime/chibi. Emotions **only** through posture/ears/eyes — **never** a human smile or facial expression.
- **Honesty + boundaries for a child**: suffering is evident, but **no blood/gore/bones**. Abrasion = clean pink; fracture = swelling + (after treatment) splint; ear = dark discharge; fleas = hair loss + black specks.
- **Negative prompt** is constant (cartoon, anime, blood, text, watermark, deformations…) — in every prompt file.

## Patient identification (canonical)

Five patients from `art/prompts/README.md`. Coat/build are **fixed** for each one across their 3 images:

| Patient | Species | Coat/build | Case |
|---|---|---|---|
| Dior | cat, 5 yrs, DSH | tortoiseshell (orange+black patches, white paws and chest), green eyes | fleas |
| Edi | cat, 2 yrs, DSH | gray classic tabby, white chin, amber eyes, slender | parasitic diarrhea |
| Cody | dog, 4 yrs, mixed breed | brown-and-white, black patch above eye, white muzzle, floppy ears, ~12 kg | pad abrasion |
| Dante | dog, 6 yrs, flat-coated | cream-gold, broad head, long floppy ears, ~22 kg | otitis externa |
| Frodo | dog, 3 yrs, shaggy | dark gray/grizzled, long shaggy hair over eyes, bushy tail, ~18 kg | femoral fracture |

For a **new patient**, define the identity once (coat, markings, build, sex, ear shape, eye color) and keep it identical across 3 images. Full procedure: `references/new-patient-art-procedure.md`.

## Authoring a prompt file

Each image = one `.md` file with YAML frontmatter (24 keys, same order everywhere) + a ready-to-use EN prompt. Full schema: `../../../art/prompts/SCHEMA.md`.

- **Location:** `art/prompts/patients/<patient>/{01-intake,02-treated,03-deteriorating}.md`
- **Frontmatter keys:** `id, patient, species, breed, age, sex, coat, build, caseId, diagnosis, phase, state, filename, dimensions, aspectRatio, purpose, style, lighting, palette, environment, camera, mood, honesty, avoid`.
- **`coat` and `build` must be character-for-character identical** across the 3 files of the same patient (this is the visual anchor). Verify with grep after writing.
- **Each file is self-contained** — style, palette, lighting, environment are inlined in the frontmatter and prompt (the model sees one file = gets all anchors).
- **EN prompt** under `# Prompt (EN)` — ready to paste into a generative model.

The existing patient prompt files in `art/prompts/patients/` (one directory per patient, 3 states each) are already complete — use them as templates.

## Generating images (handoff to user)

This skill **describes** how; the **user generates** them with an LLM model. Technical specs:

- **Dimensions:** 1536×1152 (**4:3** aspect ratio, landscape). Fixed for the entire series.
- **Format:** PNG, full scene (no transparency).
- **Filename:** = the `filename` field from frontmatter (e.g. `dior-01-intake.png`).
- **Procedure:** take frontmatter + EN prompt from the file → paste into the model → save PNG under the `filename`.
- **Card thumbnail:** cropped from the same image (a separate step, not a generation).

## Integration into the game (after images are generated)

1. **Place files in `site/img/cases/<filename>`** (keep frontmatter names).
2. **`site/data/cases.js`:** add image fields to the case entry:
   ```js
   image: "dior-01-intake.png",              // intake (card + admission)
   imageTreated: "dior-02-treated.png",       // outcome: good treatment
   imageDeteriorating: "dior-03-deteriorating.png"  // outcome: deterioration
   ```
   Data is the product — this is where you define it; the code is thin.
3. **`site/js/main.js`:** the case card + intake and outcome phases use `<img src="img/cases/..." alt="description">` instead of / alongside the SVG icon. **Descriptive `alt`** (accessibility): e.g. "Dior — tortoiseshell cat scratching behind her ear, black specks in her coat".
4. **Keep SVG icons as fallback** (if image fails to load — `onerror` → show icon).
5. **Add a test:** verify that every `cases[].image` (and variants) exists in `site/img/cases/`. (Add to `tests/` or `validate_game.js`.)
6. **Verify:** run the verification loop with `pawthology-onboarding` (validate_game.js, node --test, replay --check) + `curl`/scrapling that image paths return 200.

## Consistency checklist (before accepting an image)

- [ ] Same room (wall, table, window on left, towel, floor).
- [ ] Same palette and light family.
- [ ] Same camera height and framing family.
- [ ] Same render style (soft painterly, not plastic/cartoon).
- [ ] For this patient: identical coat/markings/build/sex/ears across 3 images.
- [ ] No negative-prompt elements (blood, text, cartoon, deformations).
- [ ] Emotion through posture/eyes, not through human facial expressions.

Full checklist: `../../../art/prompts/STYLE-GUIDE.md` §10.

## Pitfalls

- **`coat` drift between states.** The most common error — the model changes markings/coat between intake and treated. Verify with grep: `grep -h "^coat:" art/prompts/patients/<p>/*.md | sort | uniq -c` (3× identical).
- **Inconsistent room.** Each file inlines the environment, but the model can drift. Stick to the exam room description from STYLE-GUIDE word for word.
- **Anthropomorphic smiles.** The model likes "human" faces. Require emotion only through posture/ears/eyes; repeat "no humanized expression" in the prompt.
- **Blood/gore.** A child plays this. Abrasion = clean pink, fracture = swelling. Repeat "no blood, no gore" in the prompt.
- **Text in the image.** Models generate text/logos. Negative prompt: `text, letters, numbers, watermark, logo, signature`.
- **Missing `alt` on integration.** Accessibility — every `<img>` needs a descriptive `alt`.
- **Images not in `cases.js`.** A PNG file alone does nothing — add `image*` fields to the data; that's where the UI is defined.
- **Scrapling drops SVG.** If you're verifying rendering and icons vanish from the DOM — it's a serialization quirk (foreign namespace), not a bug. Verify `innerHTML.length` at runtime.

## References

| File | Read when… |
|---|---|
| `../../../art/prompts/STYLE-GUIDE.md` | Style master — full rules, palette, exam room, lighting, camera, negative prompt, checklist |
| `../../../art/prompts/SCHEMA.md` | Writing a prompt file — full frontmatter schema (24 keys) |
| `../../../art/prompts/README.md` | Patient map, directory structure, 3 states |
| `../../../art/prompts/patients/*/0*.md` | Templates — 15 ready-made prompt files |
| `references/new-patient-art-procedure.md` | Adding art for a NEW patient — step-by-step from identity through 3 files to integration |
| `../pawthology-onboarding/SKILL.md` | You don't know the project — orientation + golden rule + verification loop |

## Quick pipeline checklist

- [ ] Patient identity defined (coat, markings, build, sex, ears, eyes).
- [ ] 3 prompt files in `art/prompts/patients/<p>/` (01/02/03), 24-key frontmatter.
- [ ] `coat`/`build` identical across 3 files (grep verified).
- [ ] `filename` unique, dimensions 1536×1152, 4:3.
- [ ] Images generated (PNG, name = `filename`) → `site/img/cases/`.
- [ ] `image`/`imageTreated`/`imageDeteriorating` in `cases.js`.
- [ ] `<img>` with descriptive `alt` in `main.js`; SVG fallback preserved.
- [ ] Image existence test + verification loop with pawthology-onboarding all green.
