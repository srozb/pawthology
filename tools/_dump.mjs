// Helper for Python tools (scaffold_case.py): dumps CONTENT as JSON to stdout.
// JS tools (validate_game.js, replay.js, explore.js) import site/data directly
// and do NOT use this file.
import { CONTENT } from "../site/data/index.js";
console.log(JSON.stringify(CONTENT));
