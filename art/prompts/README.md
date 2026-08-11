# Pawthology Art — Prompt Set

A set of `.md` files with precise instructions (prompts) for the image-generation model.
The goal is **consistent, realistic veterinary illustrations** replacing the current
SVG icons in the educational game for a 9-year-old girl and adult veterinary
students — clinically honest, but without blood/gore, child-appropriate.

## How to use

1. Read **`STYLE-GUIDE.md`** first — it is the single source-of-truth style document.
   Every illustration must follow it so the set stays consistent.
2. Each file in `patients/<patient>/` describes one image and is **self-contained**
   (style, palette, lighting, environment are inlined in the frontmatter and the
   prompt, because the model only sees that one file).
3. Generate the image from the file. Output filename = the `filename` frontmatter
   field; dimensions = `dimensions` (1536×1152, 4:3 for patients).
4. Drop generated files into `site/img/cases/` (integration with `main.js` is a
   separate step — see the image-optimization skill).

## Structure

```
art/prompts/
  README.md            ← this file
  STYLE-GUIDE.md       ← MASTER style (whole-set consistency)
  SCHEMA.md            ← frontmatter structure (same keys in every file)
  patients/
    <patient>/   01-intake.md  02-treated.md  03-deteriorating.md
  exams/          <exam>.md (+ STYLE.md)
  procedures/     <procedure>.md
  drug-groups/    <group>.md
```

## Three states per patient (mapped to game phases)

| File phase | Patient state | When in the game |
|---|---|---|
| `01-intake` | suffering, untreated | case-selection card + intake screen |
| `02-treated` | diagnosed and treated, bandaged/medicated | outcome: good treatment |
| `03-deteriorating` | condition worsened | outcome: deterioration (bad outcome) |

## Patient identity (constant across the set)

| Patient | Species | Coat/build | Case |
|---|---|---|---|
| **Dior** | cat, female, 5 yrs, DSH | tortoiseshell (ginger + black patches, white paws and chest), adult | flea infestation |
| **Edi** | cat, male, 2 yrs, DSH | gray classic tabby, slender, hunter | parasitic diarrhea |
| **Cody** | dog, male, 4 yrs, mixed | brown-and-white, black patch above eye, ~12 kg, drooping ears | pad abrasion |
| **Dante** | dog, male, 6 yrs, flat-coated | cream-golden, drooping ears, ~22 kg | otitis externa |
| **Frodo** | dog, male, 3 yrs, shaggy | dark gray/silver, long tousled coat, ~18 kg | femoral fracture |
| **Dodo** | rabbit, 3 yrs, mini lop | golden-fawn agouti (ginger back, cream belly), long lop ears, ~2.2 kg | incisor overgrowth (malocclusion) |
| **Max** | dog, male, 3 yrs, Beagle | tricolor (black/white/tan), ~10 kg | GI foreign body (enterotomy) |
| **Felix** | cat, male, 2 yrs, DSH | black-and-white tuxedo, ~4 kg | metaldehyde toxicity (snail bait) |
| **Teo** | budgerigar, male, 2 yrs | yellow-green opaline | scaly face mites (beak overgrowth) |
| **Oreo** | cockatiel, female, 4 yrs | grey body, yellow face, orange cheeks | egg binding (salpingotomy) |

## Consistency — overriding rules

- **Same room** in every image (wall color, table, window, props).
- **Same palette and light family.**
- **Same camera height/framing** (medium shot, at table height).
- **For one patient: identical animal appearance** across its 3 images
  (coat, patches, build, sex, ear shape) — only mood/pose/treatment change.
- **Same rendering style** (soft, naturalistic, painterly; not plastic, not cartoon).

Details: `STYLE-GUIDE.md`. Frontmatter structure: `SCHEMA.md`.
