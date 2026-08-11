// Agregator treści. Silnik (game.js) NIE importuje tego — dostaje CONTENT jako
// argument (S7). UI i runner/testy wstrzykują pełny obiekt.
import { species } from "./species.js";
import { exams } from "./exams.js";
import { drugs, drugGroups } from "./drugs.js";
import { diseases } from "./diseases.js";
import { cases } from "./cases.js";
import { procedures, recommendations } from "./procedures.js";
import { rubricConfig, unlockThresholds } from "./rubrics.js";
import { GLOSSARY } from "./glossary.js";
import { ICONS } from "./icons.js";

export const CONTENT = {
  species,
  exams,
  drugs,
  drugGroups,
  diseases,
  cases,
  procedures,
  recommendations,
  rubricConfig,
  unlockThresholds,
  glossary: GLOSSARY,
  icons: ICONS
};

export { GLOSSARY, ICONS };
export default CONTENT;
