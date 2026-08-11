# STYLE-GUIDE — Pawthology master style

**One source document. Every illustration must follow it.**
Each prompt file inlines the key anchors, but they are fully defined here.

---

## 1. Style philosophy

**Realistic veterinary illustration, soft and naturalistic, painterly.**
Humane and warm, yet anatomically honest and clinically true.

- **NO** photorealistic plastic / airbrush / "plush skin".
- **NO** cartoon / anime / manga / chibi / plush-toy.
- **NO** anthropomorphic smiles, human facial expressions, talking mouths.
- **YES** soft, lightly painterly texture (like modern naturalistic educational
  illustration / realistic picture-book), with true animal anatomy, true coat
  texture, honest emotion conveyed **only** through posture, ears, eyes, tension.

Audience: 9-year-old girl + adult veterinary students. Therefore:
**clinically honest, but no blood/gore — child-appropriate.**

---

## 2. Rendering

- Soft, semi-detailed brush, warm texture, gentle boundary between sharp and
  soft; light grain, not clinical sharpness.
- Coat: soft directional strands, voluminous, not a smooth "film".
- Eyes: natural, moist, with light reflections, never cartoonish.
- Anatomically correct proportions: four paws, correct ears and tail, correct
  head:body ratio for the species.

---

## 3. Color palette (constant, muted, warm)

Dominated by warm, muted clinic tones; the strongest color accent is the
**animal's natural coat**.

| Element | Color |
|---|---|
| Wall | warm cream-beige |
| Table | brushed stainless steel (cool neutral gray with soft reflections) |
| Towel on table | muted sage-green |
| Floor | warm pale oak |
| Window / light | soft, neutral-cool daylight (not blue, not amber) |
| Accent | animal's coat (ginger/black patches, gray tabby, brown-white, cream-gold, silver) |

**Rule:** no neon, no oversaturated colors, no pure white studio background.

---

## 4. Environment — CONSTANT clinic room (identical in every image)

One, always the same, modern cozy veterinary exam room:

- **Exam table** of brushed stainless steel, center stage, where the action
  happens (the animal lies/stands on the table).
- **Wall behind the table** — warm cream-beige.
- **Window on the left** — admits soft diffused daylight (key light).
- **Towel** in muted sage folded on the table (under/beside the animal).
- **Small ceramic water bowl** (neutral).
- **Stethoscope** hanging on a wall hook (softly blurred in background).
- **Floor** — warm pale oak, softly visible at the bottom.
- Background props lightly blurred (shallow DOF) — not distracting.

**Never:** sterile white hospital room, hard white light, empty white background,
studio gradient. This is a **cozy small-animal clinic**, not an OR.

---

## 5. Light

- **Key light:** soft, diffused daylight from the left window.
- **Fill:** gentle, warm-neutral, soft — no hard shadows, no flash glare.
- Even, calm, good visibility of the whole animal.
- **Mood variant:** in the `deteriorating` phase the same light, but **slightly
  dimmed and a touch cooler** — a signal of worsening, never drama/black;
  the room stays the same.

---

## 6. Camera / framing (constant family)

- **Medium shot**, camera at **exam-table height** (eye level with the animal).
- Slightly long lens (compressed perspective).
- **Shallow depth of field** — background softly blurred.
- Animal centered, fills ~**60% of the frame**.
- Consistent framing across the series (a "family of frames").

**Phase variants (subtle):**
- `01-intake` — slightly wider medium shot, full animal on the table, more
  environment (establishes the room).
- `02-treated` — medium shot, animal centered, treatment visible, calm.
- `03-deteriorating` — a touch closer medium shot, animal lower/weaker,
  same environment, somber mood.

---

## 7. Emotion rendering (honest, non-anthropomorphic)

Emotion **only** through: posture, ear set, eye brightness, muscle tension,
a raised/guarded paw. **Never** a human smile, furrowed "human" brows, a
talking mouth.

| Phase | Posture | Ears | Eyes | Paws/state |
|---|---|---|---|---|
| `intake` (suffering) | tense, hunched or strained, head slightly lowered | slightly back/flattened | open but dull, downcast | paw raised/guarded, clinical sign visible |
| `treated` (treated) | relaxed, lying or sitting comfortably | natural/forward | bright, calm, alert | treatment visible (bandage, clean ear, application) |
| `deteriorating` (worse) | more hunched, weak, low head | flattened | dull, half-closed, matte | sign worsened (more swelling, more hair loss, more flaccid) |

---

## 8. Clinical honesty + child boundaries

**We show suffering honestly** (the animal is evidently suffering and weakened),
**but without blood/gore/open wounds/bone.**

- Pad abrasion: clean, dry scrape, maybe slight redness — no blood.
- Fracture: **thigh swelling**, paw raised, after treatment a **splint/bandage** — no exposed bone.
- Otitis: dark discharge subtly visible, reddened canal — no blood.
- Fleas: scratching, hair loss, "flea dirt" (black specks) in the coat — no wounds.
- Diarrhea: hunched posture, dull coat, weakness — nothing graphic.

---

## 9. Negative prompt (constant across all files)

```
cartoon, anime, manga, chibi, plush toy, anthropomorphic human smile,
humanized facial expression, talking mouth, blood, gore, viscera, exposed bone,
graphic open wound, text, letters, numbers, watermark, logo, signature, frame,
border, collage, diptych, split panel, multiple animals competing, extra limbs,
deformed anatomy, mutated paws, human hands, photorealistic plastic skin,
oversaturated colors, neon, harsh flash lighting, empty white background,
gradient studio backdrop, 3d render plastic, claymation
```

---

## 10. Consistency checklist (before accepting an image)

- [ ] Same room (wall, table, left window, props, floor).
- [ ] Same palette and light family.
- [ ] Same camera height and frame family (medium shot, table height).
- [ ] Same rendering style (soft painterly, not plastic, not cartoon).
- [ ] For this patient: identical coat, patches, build, sex, ear shape across
      all 3 of its images — only mood/pose/treatment differ.
- [ ] No negative-prompt elements (no blood, text, cartoon, etc.).
- [ ] Emotion through posture/eyes, not human facial expression.

---

## 11. Naming and output format

- File: `<patient>-<phase>.png` (e.g. `dior-01-intake.png`).
- Dimensions: **1536×1152** (ratio **4:3**), landscape orientation.
- Format: PNG for the generator, then optimized to WebP (see the
  `pawthology-optimize-images` skill) before deploy.
- Card thumbnail: crop from the same image (separate step, not a generation).

---

## 12. Game integration plan (separate step)

1. Generated files → `site/img/cases/<filename>`.
2. `site/data/cases.js`: add `image: "<filename>"` (and optionally
   `imageTreated`, `imageDeteriorating`) — data is the product, code stays thin.
3. `site/js/main.js`: case card + intake and outcome phases use an `<img>`
   instead of / beside the SVG icon (with a descriptive `alt` for accessibility).
4. Add a test verifying every `cases[].image` exists in `site/img/cases/`.
5. Keep existing SVG icons as a fallback (if the image fails to load).
