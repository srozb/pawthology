// Pawthology — main.js (v2)
// UI controller: renders phases, manages state, handles input.
// Integrates: narrative, glossary tooltips, SVG icons, grouped summary,
// case abandonment, treatment history.
// Imports: CONTENT (data+glossary+icons), evaluateCase/availableCases (engine), t (i18n).
// Pure DOM manipulation — no framework, no build, no runtime network.

import { CONTENT, GLOSSARY, ICONS } from "../data/index.js";
import { evaluateCase, availableCases, availableDrugs, availableProcedures, levelFromXp } from "./game.js";
import { t, detectLang, AVAILABLE_LANGS, LANG_LABELS } from "./i18n.js";
import { track } from "./track.js";

/* ---- XP: najlepszy wynik na przypadek (best-per-case) ----
   totalXp = Σ max(0, bestXp[caseId]). Poprawa przy powtórce podnosi total;
   gorsza powtórka nic nie zmienia — dziecko nie blokuje się trwale po jednym
   złym wyniku, a jednocześnie nie można „farmić” tego samego łatwego przypadku. */
function outcomeRank(o) {
  return { critical: 0, deteriorating: 1, "not-responding": 2, improving: 3, recovered: 4 }[o] ?? -1;
}
function loadMap(key) {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); if (v && typeof v === "object" && !Array.isArray(v)) return v; } catch { /* ignore */ }
  return null;
}
function migrateBestXp() {
  const saved = loadMap("pawthology.bestXp");
  if (saved) return saved;
  // Migracja z historii (autoritative record każdej próby).
  const best = {};
  for (const e of JSON.parse(localStorage.getItem("pawthology.history") || "[]")) {
    if (!e || !e.caseId) continue;
    const x = Number(e.xpEarned) || 0;
    if (!(e.caseId in best) || x > best[e.caseId]) best[e.caseId] = x;
  }
  return best;
}
function migrateBestOutcome() {
  const saved = loadMap("pawthology.bestOutcome");
  if (saved) return saved;
  const best = {};
  for (const e of JSON.parse(localStorage.getItem("pawthology.history") || "[]")) {
    if (!e || !e.caseId || !e.patientOutcome) continue;
    if (!(e.caseId in best) || outcomeRank(e.patientOutcome) > outcomeRank(best[e.caseId])) best[e.caseId] = e.patientOutcome;
  }
  return best;
}
function sumXp(best) { return Object.values(best).reduce((s, x) => s + Math.max(0, x), 0); }

/* ============================== STATE ============================== */

const state = {
  lang: localStorage.getItem("pawthology.lang") || detectLang(),
  bestXp: migrateBestXp(),
  bestOutcome: migrateBestOutcome(),
  history: JSON.parse(localStorage.getItem("pawthology.history") || "[]"),
  view: "cases",       // "cases" | "game" | "about" | "history" | "encyclopedia"
  currentCaseId: null,
  phase: "intake",     // "intake" | "exams" | "diagnosis" | "treatment" | "outcome"
  selectedExams: [],
  diagnosis: null,
  treatments: [],      // [{ drug: id, doseMg: number }]
  procedures: [],           // ["id", ...] zlecone zabiegi + operacje (kind z danych)
  recommendations: [],      // ["id", ...] zalecone zalecenia dla opiekuna
  treatmentSections: { drugs: false, procedures: false, surgeries: false, recommendations: false },  // które sekcje leczenia rozwinięte
  diagnosisOrder: null,     // przetasowana kolejność opcji diagnozy (na sesję przypadku) — prawidłowa nie zawsze pierwsza
  expandedDrugGroups: new Set(),  // rozwinięte grupy leków w leczeniu (po id grupy)
  lastResult: null,
  glossaryExpanded: new Set(),  // expanded glossary entry ids in popups
  historyExpanded: new Set(),    // rozwinięte wpisy historii (klucz = entry.date)
  encyclopediaTab: "exams",      // aktywna zakładka katalogu: exams|diseases|drugs|procedures|recommendations|glossary
  levelOpen: {}                  // rozwinięte poziomy składane (klawisz = numer poziomu) — tylko gdy zwijalny
};
state.totalXp = sumXp(state.bestXp);  // total XP = suma najlepszych wyników per przypadek

/* ---- DEBUG (z URL) ----
   Tryb debugu do testowania progresu bez „przerabiania” całej gry:
     #unlocked | #debug | ?debug=true | ?debug=1   → wszyscy pacjenci + pełny katalog (poziom 3),
                                                    XP zablokowane (nie liczą się, nie psują zapisu)
     ?xp=N                                          → total XP ustawione na N (stałe dla sesji),
                                                    odblokowania wynikają z progów; XP nie liczą się
   W trybie debug NIE zapisujemy bestXp/bestOutcome/history — realny zapis w localStorage
   pozostaje nietknięty. Wynik przypadku (XP) nadal jest pokazywany na ekranie konsekwencji.
   Hash (#unlocked) działa „na żywo” (hashchange); parametry ? wymagają przeładowania. */
function parseDebugFromUrl() {
  const params = new URLSearchParams(window.location.search || "");
  const hash = (window.location.hash || "").toLowerCase();
  let unlockAll = false;
  let xpOverride = null;
  if (hash.includes("unlocked") || hash.includes("debug")) unlockAll = true;
  const d = params.get("debug");
  if (d === "" || d === "1" || d === "true") unlockAll = true;
  if (params.get("unlock") === "1" || params.get("unlock") === "true") unlockAll = true;
  const xp = params.get("xp");
  if (xp !== null) {
    const n = Number(xp);
    if (Number.isFinite(n) && n >= 0) xpOverride = n;
  }
  return { active: unlockAll || xpOverride !== null, unlockAll, xpOverride };
}
state.debug = parseDebugFromUrl();

/** XP używane do decyzji o odblokowaniu (przypadki / poziom gracza / katalog leków).
 *  W trybie unlockAll → Infinity (wszystko otwarte); przy ?xp=N → N; inaczej realny total. */
function effectiveXp() {
  if (state.debug.unlockAll) return Infinity;
  if (state.debug.xpOverride !== null) return state.debug.xpOverride;
  return state.totalXp;
}

/** XP pokazywane w badge'ach — tekst (dla unlockAll → „∞”). */
function displayXpStr() {
  if (state.debug.unlockAll) return "∞";
  if (state.debug.xpOverride !== null) return String(state.debug.xpOverride);
  return String(state.totalXp);
}

function persist() {
  localStorage.setItem("pawthology.lang", state.lang);
  if (state.debug.active) return;  // tryb debug: nie psujemy realnego zapisu w localStorage
  localStorage.setItem("pawthology.bestXp", JSON.stringify(state.bestXp));
  localStorage.setItem("pawthology.bestOutcome", JSON.stringify(state.bestOutcome));
  localStorage.setItem("pawthology.history", JSON.stringify(state.history));
}

/* ============================== I18N + LOOKUP HELPERS ============================== */

function tt(key) { return t(key, state.lang); }

/** Localized field picker: picks `${base}En` or `${base}Pl`. */
function loc(obj, base) {
  const k = base + (state.lang === "en" ? "En" : "Pl");
  return obj[k] || obj[base + "Pl"] || obj[base + "En"] || "";
}

/** tt with {name} interpolation */
function ttf(key, vars) {
  let s = tt(key);
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

/* ============================== PATIENT IMAGE ============================== */

// Render a patient <img> with SVG icon fallback (onerror) for accessibility/graceful degradation.
// kind: "intake" | "treated" | "deteriorating". Falls back to species SVG icon if image missing.
function patientImg(c, kind, altKey, cls) {
  const sp = getSpecies(c.species);
  const vars = { name: c.patientName || loc(sp, "label"), species: loc(sp, "label") };
  const alt = ttf(altKey, vars);
  const fallbackIcon = `species-${c.species}`;
  const file = kind === "treated" ? c.imageTreated : kind === "deteriorating" ? c.imageDeteriorating : c.image;
  if (!file) {
    // No image data — render fallback SVG span directly
    const span = h("span", { class: `${cls} ${cls}--fallback`, "aria-hidden": "true" });
    setIcon(span, fallbackIcon);
    return [span, alt];
  }
  const img = h("img", {
    class: cls,
    src: `img/cases/${file}`,
    alt,
    loading: "lazy",
    decoding: "async",
    onerror: function () {
      // Graceful degradation: swap to fallback SVG span
      const span = document.createElement("span");
      span.className = `${cls} ${cls}--fallback`;
      span.setAttribute("aria-hidden", "true");
      setIcon(span, fallbackIcon);
      this.replaceWith(span);
    }
  });
  return [img, alt];
}

/* ============================== DOM HELPER ============================== */

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === false || v == null) { /* skip */ }
    else el.setAttribute(k, v);
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    el.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return el;
}

function live(msg) {
  const el = document.getElementById("live");
  if (!el) return;
  el.textContent = "";
  setTimeout(() => { el.textContent = msg; }, 50);
}

/* ============================== DATA LOOKUPS ============================== */

const getCase = (id) => CONTENT.cases.find((c) => c.id === id);
const getSpecies = (id) => CONTENT.species.find((s) => s.id === id);
const getDisease = (id) => CONTENT.diseases.find((d) => d.id === id);
const getExam = (id) => CONTENT.exams.find((e) => e.id === id);
const getDrug = (id) => CONTENT.drugs.find((d) => d.id === id);
const getProcedure = (id) => CONTENT.procedures.find((p) => p.id === id);
const getRecommendation = (id) => CONTENT.recommendations.find((r) => r.id === id);

/* ============================== CONSTANTS ============================== */

const PHASES = ["intake", "exams", "diagnosis", "treatment", "outcome"];
const PHASE_KEYS = { intake: "phase.intake", exams: "phase.exams", diagnosis: "phase.diagnosis", treatment: "phase.treatment", outcome: "phase.outcome" };

// Drug group colors — calm clinical palette
const GROUP_COLORS = {
  "antiseptic-topical": "#26827e",
  "ear-drops": "#6a4c93",
  "antibiotic": "#d32f2f",
  "antiparasitic": "#f57c00",
  "nsaid": "#1565c0",
  "opioid": "#2e7d32",
  "otc-human-analgesic": "#c62828",
  "antiprotozoal": "#00838f",
  "calcium": "#c9a227"
};

/* ============================== ICON HELPER ============================== */

/** Inject an SVG icon by id. Returns empty string if not found. */
function iconSvg(id) {
  const svg = ICONS[id];
  if (!svg) return "";
  return `<span class="icon-wrap" aria-hidden="true">${svg}</span>`;
}

/** Set innerHTML on an element from an icon id. */
function setIcon(el, id) {
  if (ICONS[id]) el.innerHTML = ICONS[id];
}

/* ============================== KNOWLEDGE MODAL (wskazówki konsultanta + info) ============================== */

// Otwiera modal wiedzy: tytuł + treść (HTML, z terminami słownikowymi) + opcjonalny link zewn. (np. Wikipedia).
// Wspólny dla wskazówek konsultanta (hint) i rozszerzenia wiedzy o leku/chorobie/gatunku (info).
function openKnowledge({ title, bodyHtml, wikiUrl, wikiLabel, hintKind }) {
  closeKnowledge();
  const overlay = h("div", { class: `knowledge-overlay${hintKind ? " knowledge-overlay--hint" : ""}` });
  const modal = h("div", { class: "knowledge-modal", role: "dialog", "aria-modal": "true", "aria-label": title });

  const header = h("div", { class: "knowledge-modal-header" });
  if (hintKind) {
    const ic = h("span", { class: "knowledge-modal-icon" }); setIcon(ic, "consultant");
    header.append(ic);
  }
  header.append(h("h3", { class: "knowledge-title" }, title));
  const closeBtn = h("button", { class: "knowledge-close", "aria-label": tt("knowledge.close"), onclick: closeKnowledge });
  closeBtn.innerHTML = iconSvg("cross");
  header.append(closeBtn);
  modal.append(header);

  const body = h("div", { class: "knowledge-body" });
  if (bodyHtml) body.innerHTML = bodyHtml;
  modal.append(body);

  if (wikiUrl) {
    const link = h("a", {
      class: "knowledge-link",
      href: wikiUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      title: tt("knowledge.wikiHint")
    });
    link.innerHTML = iconSvg("external-link");
    link.append(document.createTextNode(" " + (wikiLabel || tt("knowledge.readMore"))));
    modal.append(h("div", { class: "knowledge-link-row" }, link));
  }

  overlay.append(modal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeKnowledge(); });
  document.addEventListener("keydown", knowledgeEsc);
  document.body.append(overlay);
  attachGlossaryHandlers(body);
  closeBtn.focus();
}
function knowledgeEsc(e) { if (e.key === "Escape") closeKnowledge(); }
function closeKnowledge() {
  document.querySelectorAll(".knowledge-overlay").forEach((o) => o.remove());
  document.removeEventListener("keydown", knowledgeEsc);
}

/** Mały przycisk „ℹ” — nie wybiera karty (stopPropagation), otwiera modal wiedzy o obiekcie. */
function infoButton(getOpts) {
  const btn = h("button", {
    class: "info-btn",
    type: "button",
    "aria-label": tt("knowledge.infoAbout"),
    dataset: { tip: tt("knowledge.infoAbout") },
    onclick: (e) => { e.stopPropagation(); e.preventDefault(); openKnowledge(getOpts()); }
  });
  btn.innerHTML = iconSvg("info");
  return btn;
}

/** Buduje opcje wiedzy dla obiektu z polami infoPl/infoEn + wikiPl/wikiEn. */
function knowledgeOpts(obj, titleField) {
  const en = state.lang === "en";
  let title = loc(obj, titleField);
  if (!title && obj[titleField]) title = obj[titleField];   // np. drug.inn (pole niezlokalizowane)
  return {
    title,
    bodyHtml: formatInfoBody((en ? (obj.infoEn || obj.infoPl) : (obj.infoPl || obj.infoEn)) || "", state.lang),
    wikiUrl: en ? (obj.wikiEn || obj.wikiPl) : (obj.wikiPl || obj.wikiEn),
    wikiLabel: tt("knowledge.readMore")
  };
}

/** Wiedza o leku — jak knowledgeOpts + rubryki „odpowiednie / toksyczne / brak dawki dla gatunków".
 *  Każdy gatunek w jednej z 3 kategorii: ok (ma dosing), toxic (speciesToxic), no-dose (reszta). */
function drugKnowledgeOpts(drug) {
  const base = knowledgeOpts(drug, "inn");
  const en = state.lang === "en";
  const species = CONTENT.species;
  const toxic = new Set(drug.speciesToxic || []);
  const ok = [], tox = [], nodose = [];
  for (const sp of species) {
    if (toxic.has(sp.id)) { tox.push(sp); continue; }
    if (drug.dosing && drug.dosing[sp.id]) { ok.push(sp); continue; }
    nodose.push(sp);
  }
  const chip = (sp, kind) => {
    const name = loc(sp, "label");
    return `<span class="species-chip chip-${kind}" data-tip="${escAttr(name)}" role="img" aria-label="${escAttr(name)}">${iconSvg(`species-${sp.id}`)}</span>`;
  };
  const row = (iconId, labelKey, list, kind) => {
    if (!list.length) return "";
    return `<div class="suitability-row">
      <span class="suitability-label chip-${kind}">${iconSvg(iconId)} ${tt(labelKey)}</span>
      <span class="species-chips">${list.map((sp) => chip(sp, kind)).join("")}</span>
    </div>`;
  };
  let suit = "";
  if (ok.length || tox.length || nodose.length) {
    suit = `<div class="species-suitability">` +
      row("check", "drug.suitableFor", ok, "ok") +
      row("cross", "drug.toxicFor", tox, "toxic") +
      row("triangle-alert", "drug.noDoseFor", nodose, "nodose") +
      `</div>`;
  }
  return { ...base, bodyHtml: (base.bodyHtml || "") + suit };
}

// escape atrybutu dla data-tip / aria-label (bezpieczne wstawienie nazwy gatunku)
function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ============================== GLOSSARY TERM WRAPPING ============================== */

// Build term → entry lookup (case-insensitive), longest terms first.
const GLOSSARY_BY_TERM = new Map();
GLOSSARY.forEach((g) => {
  if (g.term) GLOSSARY_BY_TERM.set(g.term.toLowerCase(), g);
  if (g.termEn && g.termEn !== g.term) GLOSSARY_BY_TERM.set(g.termEn.toLowerCase(), g);
  // Odmienione formy (fleksja) — indeksujemy jak term, by tooltip pojawiał się też
  // dla "antybiotyku", "oporności", "infekcji bakteryjnej" itd. (P4).
  if (Array.isArray(g.forms)) for (const f of g.forms) GLOSSARY_BY_TERM.set(f.toLowerCase(), g);
});
const GLOSSARY_TERMS_SORTED = [...GLOSSARY_BY_TERM.keys()].sort((a, b) => b.length - a.length);

const LETTER_RE = "a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ";
const GLOSSARY_RE = new RegExp(
  `(^|[^${LETTER_RE}])(${GLOSSARY_TERMS_SORTED.map(escapeRegExp).join("|")})(?=$|[^${LETTER_RE}])`,
  "gi"
);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Wrap glossary terms in a plain-text string with <span> elements.
 * Returns an HTML string (escaped + wrapped). Safe for innerHTML.
 */
function wrapGlossaryTerms(text, lang) {
  if (!text) return "";
  const escaped = escapeHtml(text);
  return escaped.replace(GLOSSARY_RE, (match, prefix, term) => {
    const entry = GLOSSARY_BY_TERM.get(term.toLowerCase());
    if (!entry) return match;
    return `${prefix}<span class="glossary-term" data-gid="${entry.id}" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" aria-describedby="glossary-popup-${entry.id}">${escapeHtml(term)}</span>`;
  });
}

/**
 * Dzieli tekst na akapity (po \n\n), owija każdy w <p> z terminami słownikowymi.
 * Pierwszy akapit dostaje klasę „lead" (sygnał wstępu). Brak \n\n → jeden <p>
 * (zgodność wsteczna ze starymi krótkimi tekstami infoPl/infoEn).
 */
function formatInfoBody(text, lang) {
  if (!text) return "";
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return "";
  return paragraphs
    .map((p, i) => `<p${i === 0 ? ' class="lead"' : ""}>${wrapGlossaryTerms(p, lang)}</p>`)
    .join("");
}

/** Attach glossary popup handlers to all .glossary-term elements in a container. */
function attachGlossaryHandlers(container) {
  if (!container) return;
  container.querySelectorAll(".glossary-term").forEach((span) => {
    const gid = span.dataset.gid;
    const entry = GLOSSARY.find((g) => g.id === gid);
    if (!entry) return;

    const showPopup = () => {
      // Close other popups
      document.querySelectorAll(".glossary-popup").forEach((p) => p.remove());
      state.glossaryExpanded.delete(gid);

      const simple = state.lang === "en" ? entry.simpleEn : entry.simplePl;
      const full = state.lang === "en" ? entry.fullEn : entry.fullPl;
      const isExpanded = state.glossaryExpanded.has(gid);

      const popup = h("div", {
        class: "glossary-popup",
        id: "glossary-popup-" + gid,
        role: "tooltip",
        onclick: (e) => e.stopPropagation()
      });
      popup.innerHTML = `<p class="glossary-text">${escapeHtml(isExpanded ? full : simple)}</p>`;
      const toggle = h("button", {
        class: "glossary-toggle",
        onclick: (e) => {
          e.stopPropagation();
          track("glossary/expand");
          if (state.glossaryExpanded.has(gid)) state.glossaryExpanded.delete(gid);
          else state.glossaryExpanded.add(gid);
          showPopup();
        }
      }, isExpanded ? tt("glossary.less") : tt("glossary.more"));
      popup.append(toggle);

      // Position near the term
      span.insertAdjacentElement("afterend", popup);
      span.setAttribute("aria-expanded", "true");
      // Close on outside click
      setTimeout(() => {
        document.addEventListener("click", function closer(e) {
          if (!popup.contains(e.target) && e.target !== span) {
            popup.remove();
            span.setAttribute("aria-expanded", "false");
            document.removeEventListener("click", closer);
            state.glossaryExpanded.delete(gid);
          }
        });
      }, 10);
    };

    span.addEventListener("mouseenter", showPopup);
    span.addEventListener("mouseleave", () => {
      // Small delay so the pointer can move onto the popup itself
      setTimeout(() => {
        if (document.activeElement === span) return; // keyboard user — keep open
        const popup = span.nextElementSibling;
        if (!popup || !popup.matches(":hover")) {
          if (popup && popup.classList.contains("glossary-popup")) popup.remove();
          span.setAttribute("aria-expanded", "false");
          state.glossaryExpanded.delete(gid);
        }
      }, 200);
    });
    span.addEventListener("focus", showPopup);
    span.addEventListener("blur", () => {
      setTimeout(() => {
        const popup = span.nextElementSibling;
        if (popup && popup.classList.contains("glossary-popup")) {
          // Keep if mouse is over popup
          if (!popup.matches(":hover")) { popup.remove(); span.setAttribute("aria-expanded", "false"); }
        }
      }, 200);
    });
    span.addEventListener("click", (e) => {
      e.stopPropagation();
      const existing = span.nextElementSibling;
      if (existing && existing.classList.contains("glossary-popup")) {
        existing.remove();
        span.setAttribute("aria-expanded", "false");
        state.glossaryExpanded.delete(gid);
      } else {
        showPopup();
      }
    });
    span.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showPopup();
      }
    });
  });
}

/* ============================== RENDER DISPATCH ============================== */

function render() {
  document.documentElement.lang = state.lang;
  const app = document.getElementById("app");
  app.textContent = "";

  app.append(renderHeader());

  if (state.view === "about") {
    app.append(renderAbout());
  } else if (state.view === "history") {
    app.append(renderHistory());
  } else if (state.view === "encyclopedia") {
    app.append(renderEncyclopedia());
  } else if (state.view === "cases" || !state.currentCaseId) {
    state.view = "cases";
    app.append(renderCaseSelection());
  } else {
    app.append(renderGame());
  }
}

/* ============================== HEADER ============================== */

function renderHeader() {
  const header = h("div", { class: "app-header" });

  const titleWrap = h("div", { class: "header-title", role: "button", tabindex: "0", title: tt("nav.home"), "aria-label": tt("nav.home") });
  titleWrap.innerHTML = iconSvg("paw");
  titleWrap.append(
    h("h1", {}, tt("app.title")),
    h("span", { class: "subtitle" }, tt("app.subtitle"))
  );
  const goHome = () => { track("view/cases"); state.view = "cases"; render(); };
  titleWrap.addEventListener("click", goHome);
  titleWrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goHome(); }
  });
  header.append(titleWrap);

  const actions = h("div", { class: "header-actions" });
  actions.append(
    h("span", { class: "xp-badge" }, `${tt("label.xpTotal")}: ${displayXpStr()}`)
  );
  if (state.debug.active) {
    actions.append(h("span", {
      class: "debug-pill",
      title: state.debug.unlockAll
        ? tt("debug.unlockedAll")
        : ttf("debug.xpSet", { xp: String(state.debug.xpOverride) })
    }, tt("debug.badge")));
  }

  // History button
  const histBtn = h("button", {
    class: "btn-icon",
    onclick: () => { track("view/history"); state.view = "history"; render(); },
    "aria-label": tt("history.view"),
    title: tt("history.view")
  });
  histBtn.innerHTML = iconSvg("history");
  actions.append(histBtn);

  // Encyclopedia button (katalog)
  const encBtn = h("button", {
    class: "btn-icon",
    onclick: () => { track("view/encyclopedia"); state.view = "encyclopedia"; render(); },
    "aria-label": tt("encyclopedia.title"),
    title: tt("encyclopedia.title")
  });
  encBtn.innerHTML = iconSvg("book-open");
  actions.append(encBtn);

  // About button
  const aboutBtn = h("button", {
    class: "btn-icon",
    onclick: () => { track("view/about"); state.view = "about"; render(); },
    "aria-label": tt("about.title"),
    title: tt("about.title")
  });
  aboutBtn.innerHTML = iconSvg("info");
  actions.append(aboutBtn);

  // GitHub source link (zewnętrzny — otwiera nową kartę)
  const ghLink = h("a", {
    class: "btn-icon",
    href: "https://github.com/srozb/pawthology",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": tt("nav.github"),
    title: tt("nav.github")
  });
  ghLink.innerHTML = iconSvg("github");
  actions.append(ghLink);

  // Language selector (rozwijane menu)
  const langSelect = h("select", {
    class: "lang-select",
    "aria-label": tt("lang.select"),
    title: tt("lang.select"),
    onchange: (e) => setLang(e.target.value),
  });
  for (const code of AVAILABLE_LANGS) {
    langSelect.append(h("option", { value: code }, LANG_LABELS[code] || code));
  }
  langSelect.value = state.lang;
  actions.append(langSelect);

  header.append(actions);
  return header;
}

/* ============================== CASE SELECTION ============================== */

function renderCaseSelection() {
  const container = h("div");
  const unlocked = new Set(availableCases(CONTENT, effectiveXp()));

  // Group by difficulty (asc); within group sort by unlock threshold (asc).
  const groups = {};
  [...CONTENT.cases]
    .sort((a, b) => (a.difficulty - b.difficulty) || ((a.unlockXpThreshold ?? 0) - (b.unlockXpThreshold ?? 0)))
    .forEach((c) => { (groups[c.difficulty] = groups[c.difficulty] || []).push(c); });

  Object.keys(groups).map(Number).sort((a, b) => a - b).forEach((level) => {
    const cases = groups[level];
    // Poziom jest zwijalny, gdy KAŻDY przypadek jest wyleczony (recovered/improving)
    // LUB zablokowany (jeszcze nie odblokowany) — czyli brak aktywnych (do grania).
    const stats = cases.map((c) => {
      const isUnlocked = unlocked.has(c.id);
      const isDone = c.id in state.bestXp;
      const isCured = isDone && outcomeRank(state.bestOutcome[c.id]) >= 3;
      return { isUnlocked, isCured, isLocked: !isUnlocked };
    });
    const nCured = stats.filter((s) => s.isCured).length;
    const nLocked = stats.filter((s) => s.isLocked).length;
    const foldable = stats.every((s) => s.isCured || s.isLocked);
    const open = foldable ? !!state.levelOpen[level] : true;

    const group = h("div", { class: `difficulty-group ${foldable ? "is-foldable" : ""} ${!open ? "is-collapsed" : ""}` });

    // Nagłówek poziomu: zwykła etykieta (gdy aktywny) lub przycisk składany (gdy zwijalny).
    const labelText = `${tt("level.label")} ${level} · ${DIFFICULTY_DOTS[level] || "●"}`;
    if (!foldable) {
      group.append(h("div", { class: "section-label difficulty-group-label" }, labelText));
    } else {
      const header = h("button", {
        class: "level-toggle",
        "aria-expanded": open ? "true" : "false",
        "aria-label": `${open ? tt("level.toggleCollapse") : tt("level.toggleExpand")} · ${labelText}`,
        onclick: () => toggleLevel(level)
      });
      header.append(
        h("span", { class: "chevron level-chevron", "aria-hidden": "true" }, "▾"),
        h("span", { class: "level-title" }, labelText),
        buildLevelBadge(nCured, nLocked, cases.length)
      );
      group.append(header);
    }

    const grid = h("div", { class: "case-grid" });
    cases.forEach((c) => grid.append(buildCaseCard(c, unlocked)));
    group.append(grid);
    container.append(group);
  });

  // Attach glossary handlers to narrative previews
  attachGlossaryHandlers(container);
  return container;
}

/** Buduje plakietkę statusu dla zwijalnego poziomu (wyleczone / zablokowane). */
function buildLevelBadge(nCured, nLocked, nTotal) {
  const badge = h("span", { class: "level-badge" });
  const parts = [];
  if (nCured) parts.push(h("span", { class: "level-badge__part level-badge--cured" },
    h("span", { class: "level-badge__icon", "aria-hidden": "true" }, "✓"),
    ` ${ttf("level.curedCount", { n: String(nCured) })}`));
  if (nLocked) parts.push(h("span", { class: "level-badge__part level-badge--locked" },
    h("span", { class: "level-badge__icon", "aria-hidden": "true" }, "🔒"),
    ` ${ttf("level.lockedCount", { n: String(nLocked) })}`));
  if (!nCured && !nLocked) parts.push(h("span", { class: "level-badge__part" }, ttf("level.patients", { n: String(nTotal) })));
  parts.forEach((p, i) => { if (i) badge.append(h("span", { class: "level-badge__sep", "aria-hidden": "true" }, "·")); badge.append(p); });
  return badge;
}

function toggleLevel(level) {
  state.levelOpen[level] = !state.levelOpen[level];
  render();
}

const DIFFICULTY_DOTS = { 1: "●○○", 2: "●●○", 3: "●●●" };

/** Build a case selection card. `unlocked` is the Set of currently available case ids. */
function buildCaseCard(c, unlocked) {
  const isUnlocked = unlocked.has(c.id);
  const isDone = c.id in state.bestXp;                          // przypadek podjęty
  const isCured = isDone && outcomeRank(state.bestOutcome[c.id]) >= 3;  // recovered lub improving
  const sp = getSpecies(c.species);
  const requiredXp = Math.max(
    CONTENT.unlockThresholds[c.difficulty] ?? 0,
    c.unlockXpThreshold ?? 0
  );

  const card = h("div", {
    class: `card case-card ${isUnlocked ? "clickable" : "locked"} ${isCured ? "cured" : ""}`,
    ...(isUnlocked ? { tabindex: "0", role: "button", onclick: () => selectCase(c.id), onkeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectCase(c.id); } } } : {})
  });

  // Miniatura pacjenta (góra karty): wyleczony → zdjęcie „po”, inaczej intake.
  // Brak ilustracji: unlocked → ikona gatunku (placeholder), locked → kłódka.
  const imgKind = (isCured && c.imageTreated) ? "treated" : "intake";
  const imgFile = imgKind === "treated" ? c.imageTreated : c.image;
  const [imgEl] = (isUnlocked && imgFile)
    ? patientImg(c, imgKind, "image.cardAlt", "case-card-image")
    : (() => { const s = h("span", { class: "case-card-image case-card-image--fallback", "aria-hidden": "true" }); setIcon(s, isUnlocked ? `species-${c.species}` : "lock"); return [s]; })();

  card.append(
    imgEl,
    h("div", { class: "case-header" },
      h("div", { class: "case-name-block" },
        h("div", { class: "case-patient-name" }, c.patientName || loc(c, "signal")),
        h("div", { class: "case-meta" },
          h("span", { class: "card-tag" }, loc(sp, "label")),
          h("span", { class: "difficulty-dots", "aria-hidden": "true" }, DIFFICULTY_DOTS[c.difficulty] || "●"),
          isCured ? h("span", { class: "case-badge case-badge--cured" }, tt("case.cured")) : null
        )
      )
    ),
    h("div", { class: "case-narrative-preview" }, loc(c, "narrative"))
  );

  if (!isUnlocked) {
    const missing = Math.max(0, requiredXp - effectiveXp());
    const lockInfo = h("div", { class: "lock-info" });
    lockInfo.innerHTML = iconSvg("lock");
    lockInfo.append(document.createTextNode(" " + ttf("case.lockMissingXp", { xp: missing })));
    card.append(lockInfo);
  }

  return card;
}

/* ============================== GAME (phase dispatcher) ============================== */

function renderGame() {
  const c = getCase(state.currentCaseId);
  if (!c) { state.view = "cases"; return renderCaseSelection(); }

  const container = h("div");

  // Nagłówek pacjenta — pasek statusu: rząd akcji (porzuć / konsultant / od nowa) + blok tożsamości
  // (duże imię, meta: gatunek · rasa · waga · wiek). Czysta typografia zamiast ciasnego toolbara.
  const sp = getSpecies(c.species);
  const header = h("div", { class: "patient-header" });

  // Rząd akcji (lewo: porzuć; prawo: konsultant + od nowa) — ghost-buttons z ikonami Lucide.
  const actionRow = h("div", { class: "patient-header-actions" });
  const abandonBtn = h("button", {
    class: "btn-ghost btn-header-action",
    onclick: abandonCase,
    title: tt("case.abandon"),
    "aria-label": tt("case.abandon")
  });
  abandonBtn.innerHTML = iconSvg("arrow-left");
  abandonBtn.append(document.createTextNode(" " + tt("case.abandonShort")));
  actionRow.append(abandonBtn);

  const rightActions = h("div", { class: "patient-header-actions-right" });
  // Konsultant — wskazówka dla trudniejszych przypadków (difficulty >= 2). Nienachalna, opt-in.
  if (c.difficulty >= 2 && c.hints) {
    const consultBtn = h("button", {
      class: "btn-ghost btn-header-action",
      title: tt("consultant.title"),
      onclick: () => {
        const ph = state.phase;
        const key = (ph === "diagnosis") ? "diagnosis" : (ph === "treatment") ? "treatment" : "exams";
        const txt = c.hints[`${key}${state.lang === "en" ? "En" : "Pl"}`];
        openKnowledge({
          title: tt("consultant.title"),
          bodyHtml: wrapGlossaryTerms(txt || "", state.lang),
          hintKind: true
        });
      }
    });
    consultBtn.innerHTML = iconSvg("consultant");
    consultBtn.append(document.createTextNode(" " + tt("consultant.short")));
    rightActions.append(consultBtn);
  }
  const resetBtn = h("button", {
    class: "btn-ghost btn-header-action",
    onclick: resetCase,
    title: tt("action.reset"),
    "aria-label": tt("action.reset")
  });
  resetBtn.innerHTML = iconSvg("rotate-ccw");
  resetBtn.append(document.createTextNode(" " + tt("action.reset")));
  rightActions.append(resetBtn);
  actionRow.append(rightActions);
  header.append(actionRow);

  // Blok tożsamości pacjenta — duże imię + meta: gatunek · rasa · waga · wiek + ℹ gatunek.
  const identity = h("div", { class: "patient-identity" });
  identity.append(h("h2", { class: "patient-name-large" }, c.patientName || ""));
  const meta = h("div", { class: "patient-meta" });
  const metaParts = [
    loc(sp, "label"),
    loc(c, "breed"),
    `${c.weightKg} ${tt("label.kg")}`,
    loc(c, "age")
  ].filter(Boolean);
  metaParts.forEach((part, i) => {
    if (i > 0) meta.append(h("span", { class: "patient-meta-sep", "aria-hidden": "true" }, "·"));
    meta.append(h("span", { class: "patient-meta-item" }, part));
  });
  if (sp.infoPl || sp.infoEn) meta.append(infoButton(() => knowledgeOpts(sp, "label")));
  identity.append(meta);
  header.append(identity);
  container.append(header);

  // Stepper
  container.append(renderStepper());

  // Phase content
  const phaseRenderers = {
    intake: renderIntake,
    exams: renderExams,
    diagnosis: renderDiagnosis,
    treatment: renderTreatment,
    outcome: renderOutcome
  };
  const phaseContent = phaseRenderers[state.phase](c);
  container.append(phaseContent);

  return container;
}

function renderStepper() {
  const stepper = h("div", { class: "stepper" });
  const currentIdx = PHASES.indexOf(state.phase);
  PHASES.forEach((p, i) => {
    const isActive = i === currentIdx;
    const isDone = i < currentIdx;
    const isLocked = i > currentIdx;  // etapy przyszłe — wyszarzone, NIE klikalne
    const classes = ["stepper-step"];
    if (isActive) classes.push("active");
    if (isDone) classes.push("done", "clickable");
    if (isLocked) classes.push("stepper-step--locked");
    const step = h("div", { class: classes.join(" ") });
    if (isDone) {
      // Etapy zrobione — klikalne (nawigacja wstecz). OUTCOME (indeks 4) nigdy tu nie trafia,
      // bo jest tylko active lub locked — nie da się kliknąć w przód.
      step.setAttribute("role", "button");
      step.setAttribute("tabindex", "0");
      step.setAttribute("aria-label", tt(PHASE_KEYS[p]));
      step.addEventListener("click", () => goToPhase(p));
      step.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToPhase(p); }
      });
    } else if (isLocked) {
      step.setAttribute("aria-disabled", "true");
      step.setAttribute("aria-label", `${tt(PHASE_KEYS[p])} (${tt("stepper.locked")})`);
    } else {
      step.setAttribute("aria-current", "step");
    }
    const iconSpan = h("span", { class: "stepper-icon" });
    setIcon(iconSpan, `phase-${p}`);
    step.append(iconSpan, h("span", {}, tt(PHASE_KEYS[p])));
    stepper.append(step);
  });
  return stepper;
}

/* ============================== PHASE 1: INTAKE (narrative) ============================== */

function renderIntake(c) {
  const sp = getSpecies(c.species);
  const container = h("div");

  // Big narrative block — the main reading content
  const narrativeCard = h("div", { class: "narrative-card" });

  // Visit header — name jest już w patient-header (zawsze widoczny); tu tylko etykieta sekcji
  narrativeCard.append(h("div", { class: "narrative-header" },
    h("span", { class: "visit-label" }, tt("intake.visit"))
  ));

  // Patient illustration — hero (full-width), SVG fallback if image missing
  const [heroImg] = c.image
    ? patientImg(c, "intake", "image.intakeAlt", "intake-hero-image")
    : (() => { const s = h("span", { class: "intake-hero-image intake-hero-image--fallback", "aria-hidden": "true" }); setIcon(s, `species-${c.species}`); return [s]; })();
  narrativeCard.append(heroImg);

  // Narrative text (big, readable)
  const narrativeText = h("div", { class: "narrative-text" });
  // Ekran przyjęcia: rozbudowana narracja (narrativeLong), jeśli jest; karta listy używa krótkiej `narrative`.
  const _en = state.lang === "en";
  const _nar = _en ? (c.narrativeLongEn || c.narrativeEn) : (c.narrativeLongPl || c.narrativePl);
  narrativeText.innerHTML = wrapGlossaryTerms(_nar, state.lang);

  narrativeCard.append(h("div", { class: "narrative-body" }, narrativeText));

  container.append(narrativeCard);

  // "Watch for" — symptoms as highlighted chips (reading comprehension)
  container.append(h("div", { class: "section-label" }, tt("intake.watchFor")));
  const watchGrid = h("div", { class: "watch-grid" });
  const symptoms = state.lang === "en" ? (c.symptomsEn || c.symptomsPl) : (c.symptomsPl || c.symptomsEn);
  (symptoms || []).forEach((s) => {
    watchGrid.append(h("div", { class: "watch-chip" }, s));
  });
  container.append(watchGrid);

  // Patient info: weight (prominent)
  container.append(h("div", { class: "section-label" }, tt("intake.patient")));
  const weightCard = h("div", { class: "card weight-card" });
  const wIcon = h("span", { class: "weight-icon" });
  setIcon(wIcon, "paw");
  weightCard.append(
    h("div", { class: "weight-display" },
      wIcon,
      h("div", { class: "weight-value" }, `${c.weightKg} ${tt("label.kg")}`),
      h("div", { class: "weight-label" }, tt("case.weightHint"))
    ),
    h("p", { class: "card-meta dose-hint" }, tt("intake.doseHint"))
  );
  container.append(weightCard);

  // Action
  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-primary", onclick: () => goToPhase("exams") }, tt("action.orderExams"))
  ));

  attachGlossaryHandlers(container);
  return container;
}

/* ============================== PHASE 2: EXAMS ============================== */

function renderExams(c) {
  const container = h("div");
  container.append(h("h2", {}, tt("phase.exams")));

  // Group exams by groupPl
  const groups = {};
  CONTENT.exams.forEach((e) => {
    const g = loc(e, "group");
    (groups[g] = groups[g] || []).push(e);
  });

  Object.entries(groups).forEach(([groupName, exams]) => {
    container.append(h("div", { class: "section-label" }, groupName));
    const grid = h("div", { class: "tile-grid" });
    exams.forEach((e) => {
      const isSelected = state.selectedExams.includes(e.id);
      const card = h("div", {
        class: `card exam-tile clickable ${isSelected ? "selected" : ""}`,
        tabindex: "0",
        role: "checkbox",
        "aria-checked": String(isSelected),
        onclick: () => toggleExam(e.id),
        onkeydown: (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggleExam(e.id); } }
      });

      // Obrazek na górze kafelka + ikona fallback (gdy brak PNG)
      const tileImage = h("div", { class: "tile-image" });
      if (e.image) {
        tileImage.append(h("img", {
          class: "tile-img",
          src: `img/${e.image}`,
          alt: "",
          loading: "lazy",
          onerror: function () { this.remove(); this.parentElement.classList.add("tile-image--fallback"); }
        }));
      } else {
        tileImage.classList.add("tile-image--fallback");
      }
      const fbSpan = h("span", { class: "tile-fallback-icon", "aria-hidden": "true" });
      setIcon(fbSpan, `exam-${e.id}`);
      tileImage.append(fbSpan);
      card.append(tileImage);

      const body = h("div", { class: "tile-body" });
      const headerDiv = h("div", { class: "option-header" });
      headerDiv.append(h("span", { class: "option-title" }, loc(e, "label")));
      if (e.infoPl || e.infoEn) headerDiv.append(infoButton(() => knowledgeOpts(e, "label")));
      body.append(headerDiv);

      // Description with glossary
      const descDiv = h("div", { class: "option-desc" });
      const descText = state.lang === "en" ? (e.whatItTestsEn || e.whatItTestsPl) : e.whatItTestsPl;
      descDiv.innerHTML = wrapGlossaryTerms(descText, state.lang);
      body.append(descDiv);

      if (e.turnaroundTurns > 0) {
        const clockIcon = h("span", { class: "turn-icon" });
        setIcon(clockIcon, "clock");
        body.append(h("div", { class: "turn-tag" }, clockIcon, ` ${e.turnaroundTurns}`));
      }

      if (isSelected) {
        const checkIcon = h("span", { class: "check-icon" });
        setIcon(checkIcon, "check");
        body.append(h("div", { class: "card-meta selected-tag" }, checkIcon, " " + (state.lang === "en" ? "Ordered" : "Zlecono")));
      }

      card.append(body);
      grid.append(card);
    });
    container.append(grid);
  });

  // Selected summary
  if (state.selectedExams.length > 0) {
    const summary = h("div", { class: "selected-summary" });
    summary.append(document.createTextNode(state.lang === "en" ? "Ordered: " : "Zlecono: "));
    state.selectedExams.forEach((id) => {
      const e = getExam(id);
      summary.append(h("span", { class: "chip" }, loc(e, "label")));
    });
    container.append(summary);
  }

  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-secondary btn-back", onclick: () => goToPhase("intake") }, tt("action.back")),
    h("button", { class: "btn-primary", onclick: () => goToPhase("diagnosis") }, tt("action.diagnose"))
  ));

  attachGlossaryHandlers(container);
  return container;
}

/* ============================== PHASE 3: DIAGNOSIS ============================== */

function renderDiagnosis(c) {
  const container = h("div");
  container.append(h("h2", {}, tt("phase.diagnosis")));

  // Exam results
  container.append(h("div", { class: "section-label" }, state.lang === "en" ? "Exam Results" : "Wyniki badań"));

  if (state.selectedExams.length === 0) {
    container.append(h("div", { class: "card" },
      h("p", { class: "card-meta" }, state.lang === "en" ? "No exams ordered. Diagnosis will be uncertain." : "Nie zlecono badań. Diagnoza będzie niepewna.")
    ));
  } else {
    state.selectedExams.forEach((id) => {
      const e = getExam(id);
      const result = c.examResults?.[id];
      const card = h("div", { class: "card result-card" });

      const iconSpan = h("span", { class: "exam-icon" });
      setIcon(iconSpan, `exam-${id}`);
      card.append(h("div", { class: "option-title" }, iconSpan, " ", loc(e, "label")));

      if (result) {
        const body = h("div", { class: "exam-result-body" });
        const en = state.lang === "en";
        const pick = (pl, enV) => en ? (enV || pl) : (pl || enV);
        const intro = pick(result.introPl, result.introEn);
        const findings = pick(result.findingsPl, result.findingsEn);
        const closing = pick(result.closingPl, result.closingEn);
        if (intro) {
          const p = h("p", { class: "exam-narrative" });
          p.innerHTML = wrapGlossaryTerms(intro, state.lang);
          body.append(p);
        }
        if (findings) {
          const p = h("p", { class: "exam-findings" });
          p.innerHTML = wrapGlossaryTerms(findings, state.lang);
          body.append(p);
        }
        if (closing) {
          const p = h("p", { class: "exam-narrative" });
          p.innerHTML = wrapGlossaryTerms(closing, state.lang);
          body.append(p);
        }
        // Wsteczna zgodność: stary jednozdaniowy textPl, gdy brak struktury 3-akapitowej.
        if (!intro && !findings && !closing && result.textPl) {
          const p = h("p", { class: "exam-findings" });
          p.innerHTML = wrapGlossaryTerms(en ? (result.textEn || result.textPl) : result.textPl, state.lang);
          body.append(p);
        }
        card.append(body);
      } else {
        // Badanie zlecono, ale przypadek nie ma dla niego dedykowanego wyniku (np. zbędne badanie
        // bez wpisu) — profesjonalny komunikat negatywny, nie „Brak wyniku”.
        card.append(h("p", { class: "card-meta", style: "font-style:italic" }, state.lang === "en" ? "Result within normal limits — no deviation relevant to this case." : "Wynik w normie — bez odchyleń istotnych dla tego przypadku."));
      }
      container.append(card);
    });
  }

  // Diagnosis selection — kolejność losowana (prawidłowa nie zawsze pierwsza)
  container.append(h("div", { class: "section-label" }, tt("label.diagnosis")));
  const dxOrder = (state.diagnosisOrder && state.diagnosisOrder.length === c.diagnosisOptions.length) ? state.diagnosisOrder : c.diagnosisOptions;
  dxOrder.forEach((dId) => {
    const d = getDisease(dId);
    if (!d) return;
    const isSelected = state.diagnosis === dId;
    const header = h("div", { class: "option-header" });
    header.append(h("div", { class: "option-title" }, loc(d, "label")));
    if (d.infoPl || d.infoEn) header.append(infoButton(() => knowledgeOpts(d, "label")));
    const card = h("div", {
      class: `card option-card clickable ${isSelected ? "selected" : ""}`,
      tabindex: "0",
      role: "radio",
      "aria-checked": String(isSelected),
      onclick: () => selectDiagnosis(dId),
      onkeydown: (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); selectDiagnosis(dId); } }
    }, header);
    if (isSelected) {
      const checkIcon = h("span", { class: "check-icon" });
      setIcon(checkIcon, "check");
      card.append(h("div", { class: "selected-tag" }, checkIcon));
    }
    container.append(card);
  });

  // Action
  const canProceed = state.diagnosis !== null;
  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-secondary btn-back", onclick: () => goToPhase("exams") }, tt("action.back")),
    h("button", {
      class: "btn-secondary btn-extend-dx",
      title: state.lang === "en" ? "Go back to exams; previous selections are kept — add more without unchecking." : "Wróć do badań; poprzednie zaznaczenia zostają — dodaj kolejne bez odznaczania.",
      onclick: () => goToPhase("exams")
    }, tt("action.extendDx")),
    h("button", {
      class: "btn-primary",
      disabled: !canProceed,
      onclick: () => { if (canProceed) goToPhase("treatment"); else live(state.lang === "en" ? "Select a diagnosis first." : "Wybierz diagnozę."); }
    }, tt("action.prescribe"))
  ));

  if (!canProceed) {
    container.append(h("p", { class: "card-meta" }, state.lang === "en" ? "Select a diagnosis to proceed." : "Wybierz diagnozę, aby kontynuować."));
  }

  attachGlossaryHandlers(container);
  return container;
}

/* ============================== PHASE 4: TREATMENT ============================== */

function renderTreatment(c) {
  const sp = getSpecies(c.species);
  const container = h("div");
  container.append(h("h2", {}, tt("phase.treatment")));

  // Skrót ustaleń z badań — co już wiemy, by łatwiej dobrać lek/zabieg. Pokazuje wybrane
  // badania i ich kluczowe ustalenia (findings) + potwierdzoną diagnozę. Pomaga graczowi
  // połączyć wyniki z wyborem leczenia bez powrotu do ekranu diagnozy.
  container.append(buildFindingsSummary(c));

  // Progresywne odblokowanie: katalog leków/zabiegów/operacji jest filtrowany wg
  // poziomu gracza (levelFromXp). Encja z minLevel>level jest ukryta (mniej bałaganu
  // dla początkującego). validate_game.py wymusza, że wszystko WYMAGANE na trudności D
  // ma minLevel<=D — przypadek zawsze wygralny. Trapy (antybiotyk/otc) są dostępne
  // już na L1, bo są kluczową lekcją (AMR, toksyczność).
  const playerLevel = levelFromXp(CONTENT, effectiveXp());
  const availDrugs = availableDrugs(CONTENT, playerLevel);
  const availProcedures = availableProcedures(CONTENT, playerLevel, "procedure");
  const availSurgeries = availableProcedures(CONTENT, playerLevel, "surgery");
  const hiddenDrugs = CONTENT.drugs.length - availDrugs.length;

  // 4 sekcje składane (collapsible): Leki / Zabiegi / Operacje / Zalecenia.
  // Kolejność stała. Sekcje procedures/surgeries renderujemy TYLKO jeśli są dostępne.

  // --- Sekcja LEKI ---
  // Katalog leków (createDrugCard, grupowane) + (jeśli zlecono) podsekcja „Zlecone leczenie”
  // z createPrescribedEntry — slider dawki żyje tam; bez niego systemic leki zawsze dają R-DOSE-UNDER.
  container.append(buildTreatmentSection("drugs", () => {
    const body = [];
    // Grupuj leki wg CONTENT.drugGroups (uporządkowanych) z bannerem + opisem.
    // Grupy są ZWIJANE (domyślnie zwinięte) — kliknięcie nagłówka rozwija listę leków.
    // Grupa z już przepisanym lekiem rozwija się automatycznie (by widać zlecony lek).
    // Leki zablokowane poziomem (minLevel>level) pokazujemy jako karty-disabled z zamkiem —
    // progresywne odblokowanie jest widoczne (gracz wie, że coś go czeka na wyższym poziomie).
    const groups = (CONTENT.drugGroups || []);
    groups.forEach((g) => {
      const allInGroup = CONTENT.drugs.filter((d) => d.groupId === g.id);
      const drugsInGroup = allInGroup.filter((d) => (d.minLevel ?? 1) <= playerLevel);
      const lockedInGroup = allInGroup.filter((d) => (d.minLevel ?? 1) > playerLevel);
      if (drugsInGroup.length === 0 && lockedInGroup.length === 0) return;
      const hasPrescribed = state.treatments.some((t) => allInGroup.some((d) => d.id === t.drug));
      const isOpen = hasPrescribed || state.expandedDrugGroups.has(g.id);
      const groupDiv = h("div", { class: `drug-group ${isOpen ? "drug-group--open" : "drug-group--collapsed"}` });
      const header = h("button", {
        class: "drug-group-header",
        "aria-expanded": isOpen ? "true" : "false",
        onclick: () => toggleDrugGroup(g.id)
      });
      if (g.image) {
        header.append(h("img", {
          class: "drug-group-banner",
          src: `img/${g.image}`,
          alt: "",
          loading: "lazy",
          onerror: function () { this.style.display = "none"; }
        }));
      }
      const textDiv = h("div", { class: "drug-group-text" });
      const titleRow = h("div", { class: "drug-group-title-row" });
      titleRow.append(h("span", { class: "drug-group-title" }, loc(g, "label")));
      const chev = h("span", { class: "drug-group-chevron", "aria-hidden": "true" }, "▾");
      titleRow.append(chev);
      const countLbl = state.lang === "en"
        ? `${drugsInGroup.length} available${lockedInGroup.length ? ` · ${lockedInGroup.length} locked` : ""}`
        : `${drugsInGroup.length} dost.` + (lockedInGroup.length ? ` · ${lockedInGroup.length} zablok.` : "");
      titleRow.append(h("span", { class: "drug-group-count" }, countLbl));
      textDiv.append(titleRow);
      textDiv.append(h("div", { class: "drug-group-desc" }, loc(g, "desc")));
      header.append(textDiv);
      groupDiv.append(header);
      const drugsWrap = h("div", { class: `drug-group-drugs ${isOpen ? "" : "drug-group-drugs--hidden"}` });
      drugsInGroup.forEach((d) => drugsWrap.append(createDrugCard(d, c, sp)));
      lockedInGroup.forEach((d) => drugsWrap.append(createDrugCard(d, c, sp, true)));
      groupDiv.append(drugsWrap);
      body.push(groupDiv);
    });
    // Zlecone leczenie (tylko jeśli coś zlecono) — karty z sliderem dawki.
    if (state.treatments.length > 0) {
      body.push(h("div", { class: "section-label" }, state.lang === "en" ? "Prescribed" : "Zlecone leczenie"));
      state.treatments.forEach((rx, i) => body.push(createPrescribedEntry(rx, i, c, sp)));
    }
    return body;
  }, state.treatments.length, availDrugs.length));

  // --- Sekcja ZABIEGI (kind=procedure) — jeśli są dostępne LUB zablokowane (widoczne) ---
  const lockedProcs = CONTENT.procedures.filter((p) => p.kind === "procedure" && (p.minLevel ?? 1) > playerLevel);
  if (availProcedures.length > 0 || lockedProcs.length > 0) {
    container.append(buildTreatmentSection("procedures", () => {
      const grid = h("div", { class: "tile-grid" });
      availProcedures.forEach((p) => grid.append(createProcedureCard(p, "procedure")));
      lockedProcs.forEach((p) => grid.append(createProcedureCard(p, "procedure", true)));
      return grid;
    },
      state.procedures.filter((id) => getProcedure(id)?.kind === "procedure").length,
      availProcedures.length + lockedProcs.length));
  }

  // --- Sekcja OPERACJE (kind=surgery) — jeśli są dostępne LUB zablokowane (widoczne) ---
  const lockedSurgeries = CONTENT.procedures.filter((p) => p.kind === "surgery" && (p.minLevel ?? 1) > playerLevel);
  if (availSurgeries.length > 0 || lockedSurgeries.length > 0) {
    container.append(buildTreatmentSection("surgeries", () => {
      const grid = h("div", { class: "tile-grid" });
      availSurgeries.forEach((p) => grid.append(createProcedureCard(p, "surgery")));
      lockedSurgeries.forEach((p) => grid.append(createProcedureCard(p, "surgery", true)));
      return grid;
    },
      state.procedures.filter((id) => getProcedure(id)?.kind === "surgery").length,
      availSurgeries.length + lockedSurgeries.length));
  }

  // --- Sekcja ZALECENIA — zawsze (zalecenia nie są blokowane poziomem) ---
  container.append(buildTreatmentSection("recommendations", () =>
    CONTENT.recommendations.map((r) => createRecommendationCard(r)),
    state.recommendations.length,
    CONTENT.recommendations.length));

  // Action
  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-secondary btn-back", onclick: () => goToPhase("diagnosis") }, tt("action.back")),
    h("button", { class: "btn-primary", onclick: finishCase }, tt("action.finish"))
  ));

  // Safety footer (discrete)
  container.append(h("div", { class: "safety-footer" }, tt("safety.note")));

  attachGlossaryHandlers(container);
  return container;
}

/** Skrót ustaleń z badań dla ekranu leczenia. Pokazuje potwierdzoną diagnozę + kluczowe
 *  wyniki każdego zleconego badania (jedy zdanie findings/closing). Pomaga graczowi wybrać
 *  lek/zabieg wiedząc, co badania już wykazały. */
function buildFindingsSummary(c) {
  const card = h("div", { class: "card findings-summary" });
  const en = state.lang === "en";
  const hdr = h("div", { class: "findings-summary-header" });
  const ic = h("span", { class: "findings-summary-icon" }); setIcon(ic, "phase-exams");
  hdr.append(ic, h("span", { class: "findings-summary-title" }, en ? "From the work-up" : "Z ustaleń badania"));
  card.append(hdr);

  // Potwierdzona diagnoza
  if (state.diagnosis) {
    const d = getDisease(state.diagnosis);
    if (d) {
      const row = h("div", { class: "findings-dx" });
      row.append(h("span", { class: "findings-dx-label" }, en ? "Diagnosis: " : "Rozpoznanie: "));
      const dxText = h("span", { class: "findings-dx-val" });
      dxText.innerHTML = wrapGlossaryTerms(loc(d, "label"), state.lang);
      row.append(dxText);
      card.append(row);
    }
  }

  // Kluczowe ustalenia z zleconych badań (jedy zdanie)
  const list = h("ul", { class: "findings-list" });
  let any = false;
  state.selectedExams.forEach((id) => {
    const e = getExam(id);
    const r = c.examResults?.[id];
    if (!e) return;
    const li = h("li", { class: "finding-item" });
    const eIc = h("span", { class: "exam-icon" }); setIcon(eIc, `exam-${id}`);
    li.append(h("span", { class: "finding-item-label" }, eIc, " ", loc(e, "label")));
    if (r) {
      const pick = (pl, enV) => en ? (enV || pl) : (pl || enV);
      const snippet = pick(r.findingsPl, r.findingsEn) || pick(r.closingPl, r.closingEn) || pick(r.textPl, r.textEn) || "";
      const txt = h("span", { class: "finding-item-text" });
      txt.innerHTML = wrapGlossaryTerms(snippet, state.lang);
      li.append(txt);
      any = true;
    } else {
      li.append(h("span", { class: "finding-item-text finding-item-text--muted" }, en ? "normal, no deviation" : "w normie, bez odchyleń"));
      any = true;
    }
    list.append(li);
  });
  if (any) card.append(list);
  else card.append(h("p", { class: "card-meta" }, en ? "No exams ordered." : "Nie zlecono badań."));
  return card;
}

/** Buduje sekcję leczenia z nagłówkiem (chevron + tytuł + licznik) i składanym body. */
function buildTreatmentSection(key, renderBody, nOrdered, mTotal) {
  const open = !!state.treatmentSections[key];
  const title = tt("treatment.section." + key);
  const section = h("div", { class: `treatment-section ${open ? "" : "treatment-section--collapsed"}` });

  const header = h("button", {
    class: "section-toggle",
    "aria-expanded": open ? "true" : "false",
    "aria-label": title,
    onclick: () => toggleSection(key)
  });
  const chevron = h("span", { class: "chevron", "aria-hidden": "true" }, "▾");
  const titleSpan = h("span", { class: "section-title" }, title);
  const countSpan = h("span", { class: "section-count" }, ttf("treatment.sectionCount", { n: String(nOrdered), m: String(mTotal) }));
  header.append(chevron, titleSpan, countSpan);
  section.append(header);

  const body = h("div", { class: "section-body " + (open ? "" : "section-body--hidden") });
  const nodes = renderBody();
  if (Array.isArray(nodes)) nodes.forEach((n) => body.append(n));
  else body.append(nodes);
  section.append(body);
  return section;
}

function createDrugCard(drug, c, sp, locked = false) {
  const isPrescribed = state.treatments.some((t) => t.drug === drug.id);
  const isToxic = (sp.toxicDrugs || []).includes(drug.id) || (drug.speciesToxic || []).includes(sp.id);
  const hasDosing = !!(drug.dosing && drug.dosing[sp.id]);
  const isNoDose = !isToxic && !hasDosing;   // bursztynowy tag: brak dawki dla tego gatunku (nie toksyczny)
  const groupColor = GROUP_COLORS[drug.groupId] || "var(--primary)";
  const reqLevel = drug.minLevel ?? 1;

  const card = h("div", {
    class: `card option-card drug-card ${isPrescribed ? "selected" : ""} ${isToxic ? "toxic" : ""} ${isNoDose ? "no-dose" : ""} ${locked ? "locked" : ""}`,
    tabindex: locked ? "-1" : "0",
    role: "button",
    "aria-disabled": locked ? "true" : "false",
    "aria-describedby": `tt-${drug.id}`
  });
  card.style.setProperty("--group-color", groupColor);

  // Color bar on left
  const colorBar = h("div", { class: "drug-color-bar" });
  card.append(colorBar);

  // Header with icon + name
  const headerDiv = h("div", { class: "option-header" });
  const groupIcon = h("span", { class: "drug-group-icon" });
  setIcon(groupIcon, `drug-${drug.groupId}`);
  headerDiv.append(groupIcon, h("span", { class: "option-title" }, drug.inn));

  if (isToxic) {
    const toxicTag = h("span", { class: "card-tag danger" });
    const toxicIcon = h("span", { class: "toxic-icon" });
    setIcon(toxicIcon, "cross");
    toxicTag.append(toxicIcon, state.lang === "en" ? " TOXIC" : " TOKSYCZNY");
    headerDiv.append(toxicTag);
  } else if (isNoDose) {
    const noDoseTag = h("span", { class: "card-tag warn" });
    const warnIcon = h("span", { class: "warn-icon" });
    setIcon(warnIcon, "triangle-alert");
    noDoseTag.append(warnIcon, " " + tt("drug.noDoseTag"));
    headerDiv.append(noDoseTag);
  }
  if (locked) {
    const lockTag = h("span", { class: "card-tag lock-tag" });
    const lockIcon = h("span", { class: "lock-icon" }); setIcon(lockIcon, "lock");
    lockTag.append(lockIcon, ` L${reqLevel}`);
    headerDiv.append(lockTag);
  } else if (drug.infoPl || drug.infoEn) headerDiv.append(infoButton(() => drugKnowledgeOpts(drug)));
  card.append(headerDiv);

  // Droga podania jako osobna linia (rozdzielone od grupy)
  const routeDiv = h("div", { class: "drug-route" });
  routeDiv.append(h("span", { class: "drug-route-label" }, t("label.route", state.lang) + ":"));
  routeDiv.append(h("span", { class: "drug-route-val" }, " " + loc(drug, "route")));
  card.append(routeDiv);

  // Description with glossary — tylko grupa (route wydzielony powyżej)
  const descDiv = h("div", { class: "option-desc" });
  descDiv.innerHTML = wrapGlossaryTerms(loc(drug, "group"), state.lang);
  card.append(descDiv);

  // Tooltip (hover + focus + touch)
  const tooltip = h("div", { class: "tooltip-content", id: `tt-${drug.id}`, role: "tooltip" });
  tooltip.innerHTML = wrapGlossaryTerms(loc(drug, "tooltip"), state.lang);
  card.append(tooltip);

  // Toggle tooltip on touch/click (tylko dla odblokowanych)
  if (!locked) {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      document.querySelectorAll(".drug-card.show-tooltip").forEach((el) => {
        if (el !== card) el.classList.remove("show-tooltip");
      });
      card.classList.toggle("show-tooltip");
    });
  }

  if (locked) {
    // Zablokowany lek: komunikat zamiast przycisku przepisywania
    card.append(h("div", { class: "lock-note" },
      state.lang === "en" ? `Unlocks at level ${reqLevel}` : `Odblokuje się na poziomie ${reqLevel}`));
  } else {
    // Add/Remove button
    const btnText = isPrescribed
      ? (state.lang === "en" ? "✗ Remove" : "✗ Usuń")
      : (state.lang === "en" ? "+ Prescribe" : "+ Przepisz");
    card.append(h("button", {
      class: `btn-small ${isPrescribed ? "btn-danger" : "btn-primary"}`,
      onclick: (e) => { e.stopPropagation(); toggleTreatment(drug.id); }
    }, btnText));
  }

  return card;
}

/** Karta zabiegu/operacji — bez color-bar, bez tooltipa, bez suwaka dawki. */
function createProcedureCard(proc, sectionKey, locked = false) {
  const isOrdered = !locked && state.procedures.includes(proc.id);
  const reqLevel = proc.minLevel ?? 1;
  const card = h("div", {
    class: `card option-card procedure-card ${sectionKey === "surgery" ? "procedure-card--surgery" : ""} ${isOrdered ? "selected" : ""} ${locked ? "locked" : "clickable"}`,
    tabindex: locked ? "-1" : "0",
    role: "button",
    "aria-disabled": locked ? "true" : "false",
    "aria-pressed": String(isOrdered),
    "aria-label": locked ? `${loc(proc, "label")}` : `${loc(proc, "label")} — ${isOrdered ? tt("action.cancelProc") : tt("action.orderProc")}`,
    onclick: locked ? null : () => toggleProcedure(proc.id),
    onkeydown: locked ? null : (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggleProcedure(proc.id); } }
  });

  // Obrazek na górze kafelka + ikona fallback
  const tileImage = h("div", { class: "tile-image" });
  if (proc.image) {
    tileImage.append(h("img", {
      class: "tile-img",
      src: `img/${proc.image}`,
      alt: "",
      loading: "lazy",
      onerror: function () { this.remove(); this.parentElement.classList.add("tile-image--fallback"); }
    }));
  } else {
    tileImage.classList.add("tile-image--fallback");
  }
  const fbSpan = h("span", { class: "tile-fallback-icon", "aria-hidden": "true" });
  setIcon(fbSpan, `exam-${proc.id}`);
  tileImage.append(fbSpan);
  card.append(tileImage);

  const header = h("div", { class: "option-header" });
  header.append(h("span", { class: "option-title" }, loc(proc, "label")));
  if (locked) {
    const lockTag = h("span", { class: "card-tag lock-tag" });
    const lockIcon = h("span", { class: "lock-icon" }); setIcon(lockIcon, "lock");
    lockTag.append(lockIcon, ` L${reqLevel}`);
    header.append(lockTag);
  } else if (proc.infoPl || proc.infoEn) header.append(infoButton(() => knowledgeOpts(proc, "label")));
  card.append(header);

  // Opis: pierwszy akapit info; jeśli krótki/brak — fallback na label.
  const descDiv = h("div", { class: "option-desc" });
  const infoFirst = (state.lang === "en" ? (proc.infoEn || proc.infoPl) : (proc.infoPl || proc.infoEn)) || "";
  const firstPara = infoFirst.split("\n\n")[0].trim() || loc(proc, "label");
  descDiv.innerHTML = wrapGlossaryTerms(firstPara, state.lang);
  card.append(descDiv);

  if (locked) {
    card.append(h("div", { class: "lock-note" },
      state.lang === "en" ? `Unlocks at level ${reqLevel}` : `Odblokuje się na poziomie ${reqLevel}`));
  } else {
    card.append(h("button", {
      class: `btn-small ${isOrdered ? "btn-danger" : "btn-primary"}`,
      onclick: (e) => { e.stopPropagation(); toggleProcedure(proc.id); }
    }, isOrdered ? tt("action.cancelProc") : tt("action.orderProc")));
  }

  return card;
}

/** Karta zalecenia dla opiekuna — analogiczna do procedure-card, bez dawki. */
function createRecommendationCard(rec) {
  const isOrdered = state.recommendations.includes(rec.id);
  const card = h("div", {
    class: `card option-card recommendation-card clickable ${isOrdered ? "selected" : ""}`,
    tabindex: "0",
    role: "button",
    "aria-pressed": String(isOrdered),
    "aria-label": `${loc(rec, "label")} — ${isOrdered ? tt("action.cancelProc") : tt("action.orderProc")}`,
    onclick: () => toggleRecommendation(rec.id),
    onkeydown: (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggleRecommendation(rec.id); } }
  });

  const header = h("div", { class: "option-header" });
  header.append(h("span", { class: "option-title" }, loc(rec, "label")));
  if (rec.infoPl || rec.infoEn) header.append(infoButton(() => knowledgeOpts(rec, "label")));
  card.append(header);

  const descDiv = h("div", { class: "option-desc" });
  const infoFirst = (state.lang === "en" ? (rec.infoEn || rec.infoPl) : (rec.infoPl || rec.infoEn)) || "";
  const firstPara = infoFirst.split("\n\n")[0].trim() || loc(rec, "label");
  descDiv.innerHTML = wrapGlossaryTerms(firstPara, state.lang);
  card.append(descDiv);

  card.append(h("button", {
    class: `btn-small ${isOrdered ? "btn-danger" : "btn-primary"}`,
    onclick: (e) => { e.stopPropagation(); toggleRecommendation(rec.id); }
  }, isOrdered ? tt("action.cancelProc") : tt("action.orderProc")));

  return card;
}

function createPrescribedEntry(rx, index, c, sp) {
  const drug = getDrug(rx.drug);
  if (!drug) return h("div", { class: "card" }, `? ${rx.drug}`);

  const entry = h("div", { class: "card prescribed-entry" });
  entry.style.setProperty("--group-color", GROUP_COLORS[drug.groupId] || "var(--primary)");

  const headerDiv = h("div", { class: "option-header" });
  const groupIcon = h("span", { class: "drug-group-icon" });
  setIcon(groupIcon, `drug-${drug.groupId}`);
  headerDiv.append(groupIcon, h("span", { class: "option-title" }, drug.inn));
  headerDiv.append(h("button", { class: "btn-small btn-danger", onclick: () => removeTreatment(index) },
    state.lang === "en" ? "✗ Remove" : "✗ Usuń"));
  entry.append(headerDiv);

  const descDiv = h("div", { class: "option-desc" });
  descDiv.innerHTML = wrapGlossaryTerms(loc(drug, "group") + " · " + loc(drug, "route"), state.lang);
  entry.append(descDiv);

  const spDosing = drug.dosing && drug.dosing[c.species];

  if (!spDosing) {
    entry.append(h("div", { class: "no-dosing-note" }, tt("drug.noDoseNote")));
    attachGlossaryHandlers(entry);
    return entry;
  }

  if (drug.dosingType === "systemic" && spDosing.mgPerKg) {
    entry.append(createDoseSlider(drug, c.species, c.weightKg, index, spDosing.mgPerKg));
  } else {
    entry.append(h("div", { class: "topical-note" },
      state.lang === "en" ? "Topical dose — not scored by dose." : "Dawka miejscowa — nie punktowana wg dawki."));
    if (spDosing.unitNotePl) entry.append(h("div", { class: "card-meta" }, loc(spDosing, "unitNote")));
    if (spDosing.frequencyPl) {
      const clockIcon = h("span", { class: "freq-icon" });
      setIcon(clockIcon, "clock");
      entry.append(h("div", { class: "card-meta" }, clockIcon, " " + loc(spDosing, "frequency")));
    }
  }

  attachGlossaryHandlers(entry);
  return entry;
}

function createDoseSlider(drug, speciesId, weightKg, index, band) {
  const section = h("div", { class: "dose-section" });

  const isNoBand = band.min === 0 && band.max === 0;
  const sliderMax = isNoBand ? 100 : Math.max(band.max * weightKg * 3, band.max * weightKg + 1);
  const step = sliderMax / 500;
  const currentDose = state.treatments[index].doseMg || 0;
  const currentMgPerKg = weightKg > 0 ? currentDose / weightKg : 0;

  const slider = h("input", {
    type: "range",
    class: `dose-slider ${isNoBand ? "no-band" : ""}`,
    min: "0",
    max: String(sliderMax),
    step: String(step),
    value: String(currentDose),
    "aria-label": `${tt("label.dose")}: ${fmt(currentDose)} ${tt("label.mg")} = ${fmt(currentMgPerKg)} ${tt("label.mgPerKg")}`,
    "aria-valuemin": "0",
    "aria-valuemax": String(sliderMax),
    "aria-valuenow": String(currentDose)
  });

  if (!isNoBand) {
    const safeStartPct = (band.min * weightKg / sliderMax) * 100;
    const safeEndPct = (band.max * weightKg / sliderMax) * 100;
    slider.style.setProperty("--safe-start", safeStartPct + "%");
    slider.style.setProperty("--safe-end", safeEndPct + "%");
  }

  const readout = h("div", { class: "dose-readout" });
  const doseVal = h("span", { class: "dose-val" }, `${tt("label.dose")}: ${fmt(currentDose)} ${tt("label.mg")}`);
  const mgPerKgVal = h("span", { class: "dose-mgperkg" }, `${tt("label.mgPerKg")}: ${fmt(currentMgPerKg)}`);
  const bandInfo = h("span", { class: "dose-band" },
    isNoBand
      ? (state.lang === "en" ? "Safety band: not established" : "Pasmo bezpieczeństwa: niewyznaczone")
      : `${tt("label.doseRange")}: ${fmt(band.min)}–${fmt(band.max)} ${tt("label.mgPerKg")}`
  );
  const status = h("span", { class: `dose-status ${getDoseStatusClass(currentMgPerKg, band, isNoBand)}` },
    getDoseStatusLabel(currentMgPerKg, band, isNoBand));
  readout.append(doseVal, mgPerKgVal, bandInfo, status);

  const spDosing = drug.dosing[speciesId];
  if (spDosing.frequencyPl) {
    const clockIcon = h("span", { class: "freq-icon" });
    setIcon(clockIcon, "clock");
    readout.append(h("span", { class: "card-meta" }, clockIcon, " " + loc(spDosing, "frequency")));
  }

  slider.addEventListener("input", () => {
    const dose = parseFloat(slider.value) || 0;
    state.treatments[index].doseMg = dose;
    const mgPerKg = weightKg > 0 ? dose / weightKg : 0;

    doseVal.textContent = `${tt("label.dose")}: ${fmt(dose)} ${tt("label.mg")}`;
    mgPerKgVal.textContent = `${tt("label.mgPerKg")}: ${fmt(mgPerKg)}`;
    status.textContent = getDoseStatusLabel(mgPerKg, band, isNoBand);
    status.className = `dose-status ${getDoseStatusClass(mgPerKg, band, isNoBand)}`;
    slider.setAttribute("aria-valuenow", String(dose));
    slider.setAttribute("aria-label", `${tt("label.dose")}: ${fmt(dose)} ${tt("label.mg")} = ${fmt(mgPerKg)} ${tt("label.mgPerKg")}`);
  });

  section.append(slider, readout);
  return section;
}

function getDoseStatusClass(mgPerKg, band, isNoBand) {
  if (isNoBand) return "over";
  if (mgPerKg >= band.min && mgPerKg <= band.max) return "in-range";
  if (mgPerKg < band.min) return "under";
  return "over";
}

function getDoseStatusLabel(mgPerKg, band, isNoBand) {
  const en = state.lang === "en";
  if (isNoBand) return en ? "Not recommended" : "Niepolecany";
  if (mgPerKg >= band.min && mgPerKg <= band.max) return en ? "✓ In range" : "✓ W paśmie";
  if (mgPerKg < band.min) return en ? "↓ Underdose" : "↓ Niedodawkowanie";
  return en ? "↑ Overdose" : "↑ Przedawkowanie";
}

/* ============================== PHASE 5: OUTCOME (grouped summary) ============================== */

function renderOutcome(c) {
  const r = state.lastResult;
  if (!r) { resetCase(); return h("div"); }

  const sp = getSpecies(c.species);
  const container = h("div");
  container.append(h("h2", {}, tt("phase.outcome")));

  // Patient state visual (SVG)
  container.append(renderPatientState(r.patientOutcome, sp, c));

  // Outcome comment (narrative)
  const commentKey = `outcome.comment.${r.patientOutcome}`;
  container.append(h("div", { class: "outcome-comment" }, ttf(commentKey, { name: c.patientName || loc(sp, "label") })));

  // Epilog — uczciwy opis przebiegu przypadku, ZŁOŻONY Z FAKTYCZNYCH WERDYKTÓW.
  // Fragmenty-konsekwencje pochodzą z rubricConfig[rule].epiloguePl/En (tylko odpalone reguły —
  // nie wymieniamy błędów których gracz nie popełnił). DEDUPLIKUJEMY po regule: gdy ta sama
  // reguła odpala się wielokrotnie (np. 2 złe leki → R-DRUG-GROUP-MISMATCH ×2), zdanie pojawia
  // się raz — liczbę pokazuje wynik XP, nie narracja. Dzielimy na 2 sekcje: co poszło dobrze
  // (delta>=0) / co do poprawy (delta<0), z osobnymi etykietami — by nie był monolitem.
  // Zamykający (epilogueClosing*) to os czasu wyniku pacjenta, specyficzny dla przypadku.
  {
    const goodOutcomes = ["recovered", "improving"];
    const isGood = goodOutcomes.includes(r.patientOutcome);
    const en = state.lang === "en";
    const stageOrder = { exams: 0, diagnosis: 1, treatment: 2, procedure: 3, recommendation: 4, rationality: 5 };
    const pickEp = (v) => {
      const cfg = CONTENT.rubricConfig[v.rule];
      if (!cfg) return null;
      return en ? (cfg.epilogueEn || cfg.epiloguePl) : (cfg.epiloguePl || cfg.epilogueEn);
    };
    // Buduj fragmenty, deduplikując po regule (pierwsze wystąpienie).
    const seenRule = new Set();
    const all = (r.verdicts || [])
      .map((v) => ({ v, text: pickEp(v) }))
      .filter((x) => x.text);
    const dedup = all.filter((x) => {
      if (seenRule.has(x.v.rule)) return false;
      seenRule.add(x.v.rule);
      return true;
    });
    // Posortuj: pozytywne (delta>=0) pierwsze, potem negatywne w porządku stage.
    dedup.sort((a, b) => {
      const ap = a.v.delta >= 0 ? 0 : 1;
      const bp = b.v.delta >= 0 ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return (stageOrder[a.v.stage] ?? 9) - (stageOrder[b.v.stage] ?? 9);
    });
    const positives = dedup.filter((x) => x.v.delta >= 0);
    const negatives = dedup.filter((x) => x.v.delta < 0);
    // Zamykający przypadek (tylko wynik pacjenta) — z backward-compat na stare nazwy pól.
    // recovered → good; improving → improving (fallback bad); reszta → bad.
    const pickClosing = (plKey, enKey, fbPl, fbEn) => en
      ? (c[enKey] || c[plKey] || c[fbEn] || c[fbPl])
      : (c[plKey] || c[enKey] || c[fbPl] || c[fbEn]);
    let closing;
    if (r.patientOutcome === "improving") {
      // improving: prefer improving-closing, fallback to bad (nie good — improving ≠ pełne wyleczenie)
      closing = en
        ? (c.epilogueClosingImprovingEn || c.epilogueClosingImprovingPl || c.epilogueClosingBadEn || c.epilogueClosingBadPl || c.epilogueBadEn || c.epilogueBadPl)
        : (c.epilogueClosingImprovingPl || c.epilogueClosingImprovingEn || c.epilogueClosingBadPl || c.epilogueClosingBadEn || c.epilogueBadPl || c.epilogueBadEn);
    } else if (isGood) {
      closing = pickClosing("epilogueClosingGoodPl", "epilogueClosingGoodEn", "epilogueGoodPl", "epilogueGoodEn");
    } else {
      closing = pickClosing("epilogueClosingBadPl", "epilogueClosingBadEn", "epilogueBadPl", "epilogueBadEn");
    }

    if (dedup.length > 0 || closing) {
      const epDiv = h("div", { class: "card epilogue" });
      const lbl = h("div", { class: "section-label epilogue-label" });
      const ic = h("span", { class: "epilogue-icon" }); setIcon(ic, isGood ? "check" : "cross");
      lbl.append(ic, " " + tt("epilogue.label"));
      const body = h("div", { class: "epilogue-body" });
      // Sekcja: co poszło dobrze (tylko jeśli są pozytywy).
      if (positives.length > 0) {
        body.append(h("div", { class: "epilogue-section-label epilogue-section-label--pos" }, tt("epilogue.didRight")));
        const ul = h("ul", { class: "epilogue-fragments epilogue-fragments--pos" });
        for (const x of positives) {
          const li = h("li", { class: "epilogue-fragment" });
          li.innerHTML = wrapGlossaryTerms(x.text, state.lang);
          ul.append(li);
        }
        body.append(ul);
      }
      // Sekcja: co do poprawy (tylko jeśli są negatywy).
      if (negatives.length > 0) {
        body.append(h("div", { class: "epilogue-section-label epilogue-section-label--neg" }, tt("epilogue.toImprove")));
        const ul = h("ul", { class: "epilogue-fragments epilogue-fragments--neg" });
        for (const x of negatives) {
          const li = h("li", { class: "epilogue-fragment" });
          li.innerHTML = wrapGlossaryTerms(x.text, state.lang);
          ul.append(li);
        }
        body.append(ul);
      }
      // Zamykający: os czasu pacjenta.
      if (closing) {
        const pClose = h("p", { class: "epilogue-closing" });
        pClose.innerHTML = wrapGlossaryTerms(closing, state.lang);
        body.append(pClose);
      }
      epDiv.append(lbl, body);
      container.append(epDiv);
    }
  }

  // XP breakdown
  const xpPos = r.verdicts.filter((v) => v.delta > 0).reduce((s, v) => s + v.delta, 0);
  const xpNeg = r.verdicts.filter((v) => v.delta < 0).reduce((s, v) => s + v.delta, 0);
  container.append(h("div", { class: "card xp-breakdown-card" },
    h("div", { class: "xp-breakdown-row" },
      h("span", { class: "xp-breakdown-label" }, tt("outcome.xpBreakdown")),
      h("span", { class: "xp-breakdown-total" }, `${r.xp >= 0 ? "+" : ""}${r.xp}`)
    ),
    h("div", { class: "xp-breakdown-detail" },
      h("span", { class: "xp-pos" }, `${tt("outcome.xpPositive")}: +${xpPos}`),
      h("span", { class: "xp-neg" }, `${tt("outcome.xpNegative")}: ${xpNeg}`),
      h("span", { class: "xp-total-badge" }, `${tt("label.xpTotal")}: ${displayXpStr()}`)
    ),
    h("div", { class: "xp-record-note" },
      r.debugFrozen
        ? tt("debug.outcomeNote")
        : (r.wasPlayedBefore && r.xpDelta === 0
            ? tt("outcome.recordNotBeaten")
            : (r.xpDelta > 0
                ? ttf("outcome.recordNew", { delta: r.xpDelta })
                : tt("outcome.recordFirst")))
    )
  ));

  // Grouped verdicts
  const positive = r.verdicts.filter((v) => v.delta > 0);
  const negative = r.verdicts.filter((v) => v.delta < 0);
  const neutral = r.verdicts.filter((v) => v.delta === 0);

  if (positive.length > 0) {
    const checkIcon = h("span", { class: "verdict-group-icon" });
    setIcon(checkIcon, "check");
    container.append(h("div", { class: "section-label verdict-group-label" }, checkIcon, " " + tt("outcome.well")));
    container.append(renderVerdictGroup(positive));
  }

  if (negative.length > 0) {
    const crossIcon = h("span", { class: "verdict-group-icon" });
    setIcon(crossIcon, "cross");
    container.append(h("div", { class: "section-label verdict-group-label" }, crossIcon, " " + tt("outcome.improve")));
    container.append(renderVerdictGroup(negative));
  }

  if (neutral.length > 0) {
    const infoIcon = h("span", { class: "verdict-group-icon" });
    setIcon(infoIcon, "info");
    container.append(h("div", { class: "section-label verdict-group-label" }, infoIcon, " " + tt("outcome.neutral")));
    container.append(renderVerdictGroup(neutral));
  }

  // Dose breakdown
  if (r.doseBreakdown && r.doseBreakdown.length > 0) {
    container.append(h("div", { class: "section-label" }, tt("label.doseRange")));
    container.append(renderDoseBreakdown(r.doseBreakdown));
  }

  // Educational tip (if there were mistakes)
  const tip = getTip(r.verdicts);
  if (tip) {
    const tipIcon = h("span", { class: "tip-icon" });
    setIcon(tipIcon, "info");
    container.append(h("div", { class: "tip-card" },
      h("div", { class: "tip-header" }, tipIcon, " " + tt("outcome.tip")),
      h("p", { class: "tip-text" }, tip)
    ));
  }

  // Actions
  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-primary", onclick: nextPatient }, tt("action.next")),
    h("button", { onclick: resetCase }, tt("action.reset"))
  ));

  attachGlossaryHandlers(container);
  return container;
}

function renderPatientState(outcome, sp, c) {
  const label = t("outcome." + outcome, state.lang);
  // Choose illustration by outcome: good → treated image, bad → deteriorating image
  const goodOutcomes = ["recovered", "improving"];
  const isGood = goodOutcomes.includes(outcome);
  const kind = isGood ? "treated" : "deteriorating";
  const altKey = isGood ? "image.treatedAlt" : "image.deterioratingAlt";
  const fallbackIcon = `species-${c.species}`;

  const stateDiv = h("div", { class: "patient-state", role: "status", "data-outcome": outcome });
  const imageWrap = h("div", { class: "patient-state-image" });
  // Imię pacjenta jest już w nagłówku (patient-header) — tutaj tylko wizual + etykieta wyniku.
  const file = kind === "treated" ? c.imageTreated : c.imageDeteriorating;
  if (file) {
    const [visual] = patientImg(c, kind, altKey, "patient-visual patient-visual--photo");
    imageWrap.append(visual);
  } else {
    // Brak ilustracji (np. Dodo) — subtelna ikona gatunku Lucide jako placeholder, bez „paskudnego” SVG.
    const ph = h("span", { class: "patient-visual patient-visual--placeholder", "aria-hidden": "true" });
    setIcon(ph, fallbackIcon);
    imageWrap.append(ph);
  }
  stateDiv.append(imageWrap);
  const callout = h("div", { class: `patient-state-callout state-${outcome}` });
  callout.append(h("span", { class: "patient-state-dot" }));
  callout.append(h("span", { class: "patient-state-label" }, label));
  stateDiv.append(callout);
  return stateDiv;
}

function renderVerdictGroup(verdicts) {
  const list = h("ul", { class: "verdict-list" });
  verdicts.forEach((v) => {
    const isPositive = v.delta > 0;
    const isNegative = v.delta < 0;
    const item = h("li", { class: `verdict-item ${isPositive ? "positive" : isNegative ? "negative" : "neutral"}` });

    const deltaSpan = h("span", { class: `verdict-delta ${isPositive ? "positive" : isNegative ? "negative" : ""}` });
    deltaSpan.textContent = `${v.delta > 0 ? "+" : ""}${v.delta}`;

    const detailDiv = h("div", { class: "verdict-detail" });
    const stageSpan = h("span", { class: "verdict-stage" }, tt("verdict.stage." + v.stage));
    const detailText = h("div", { class: "verdict-detail-text" });
    detailText.innerHTML = wrapGlossaryTerms(v.detailPl, state.lang);
    detailDiv.append(stageSpan, detailText);
    detailDiv.append(h("div", { class: "verdict-meta" },
      h("span", { class: "verdict-rule" }, v.rule),
      h("span", { class: "verdict-claim" }, tt("verdict.claimRef") + ": " + v.claimId)
    ));

    item.append(deltaSpan, detailDiv);
    list.append(item);
  });
  return list;
}

function getTip(verdicts) {
  const rules = new Set(verdicts.map((v) => v.rule));
  // Priority: most dangerous mistake first
  if (rules.has("R-DRUG-SPECIES-TOXIC")) return tt("tip.species-toxic");
  if (rules.has("R-DOSE-OVER")) return tt("tip.dose-over");
  if (rules.has("R-DOSE-INVALID")) return tt("tip.dose-invalid");
  if (rules.has("R-DOSE-UNDER")) return tt("tip.dose-under");
  if (rules.has("R-DX-WRONG") || rules.has("R-DX-BLOCKED")) return tt("tip.dx-wrong");
  if (rules.has("R-ABX-IRRATIONAL")) return tt("tip.abx-irrational");
  if (rules.has("R-EXAM-MISSED")) return tt("tip.exam-missed");
  if (rules.has("R-NO-TREATMENT")) return tt("tip.no-treatment");
  if (rules.has("R-EXAM-REDUNDANT")) return tt("tip.redundant-exam");
  return null;
}

function renderDoseBreakdown(breakdown) {
  const container = h("div", { class: "card dose-breakdown" });
  breakdown.forEach((d) => {
    const row = h("div", { class: "dose-breakdown-row" });
    const statusIcon = h("span", { class: "dose-status-icon" });
    setIcon(statusIcon, d.verdict === "in-range" ? "check" : "cross");

    row.append(
      statusIcon,
      h("span", { class: "option-title" }, d.drugName),
      h("span", {}, `${fmt(d.doseMg)} ${tt("label.mg")}`),
      h("span", { class: "dose-mgperkg" }, `${fmt(d.mgPerKg)} ${tt("label.mgPerKg")}`),
      d.band ? h("span", { class: "dose-band" }, `${fmt(d.band.min)}–${fmt(d.band.max)}`) : null
    );
    container.append(row);
  });
  return container;
}

/* ============================== HISTORY VIEW ============================== */

function renderHistory() {
  const container = h("div", { class: "history-content" });
  container.append(h("h2", {}, tt("history.title")));

  if (state.history.length === 0) {
    container.append(h("div", { class: "card history-empty" },
      h("p", { class: "card-meta" }, tt("history.empty"))
    ));
    container.append(h("div", { class: "action-bar" },
      h("button", { class: "btn-primary", onclick: () => { state.view = "cases"; render(); } },
        state.lang === "en" ? "← Back to patients" : "← Wróć do pacjentów")
    ));
    return container;
  }

  // Summary stats
  const totalXp = displayXpStr();  // spójne z badge'em w nagłówku (debug: uwzględnia override/∞)
  const outcomes = {};
  state.history.forEach((e) => { outcomes[e.patientOutcome] = (outcomes[e.patientOutcome] || 0) + 1; });

  const statsCard = h("div", { class: "card history-stats" });
  statsCard.append(
    h("div", { class: "stat-item" },
      h("span", { class: "stat-value" }, String(state.history.length)),
      h("span", { class: "stat-label" }, tt("history.completed"))
    ),
    h("div", { class: "stat-item" },
      h("span", { class: "stat-value" }, String(totalXp)),
      h("span", { class: "stat-label" }, tt("label.xp"))
    )
  );

  // Outcome distribution
  const distDiv = h("div", { class: "outcome-distribution" });
  const outcomeOrder = ["recovered", "improving", "not-responding", "deteriorating", "critical"];
  outcomeOrder.forEach((o) => {
    if (!outcomes[o]) return;
    const dot = h("span", { class: `outcome-dot state-${o}` });
    distDiv.append(h("span", { class: "outcome-count" },
      dot, ` ${t("outcome." + o, state.lang)}: ${outcomes[o]}`
    ));
  });
  statsCard.append(distDiv);
  container.append(statsCard);

  // History entries — klikalne karty z rozwijanym logiem (rozpoznanie / badania / leczenie / rezultat).
  const diseaseLabel = (id) => { const d = CONTENT.diseases.find((x) => x.id === id); return d ? loc(d, "label") : id; };
  const examLabelById = (id) => { const e = CONTENT.exams.find((x) => x.id === id); return e ? loc(e, "label") : id; };
  const drugLabelById = (id) => { const d = CONTENT.drugs.find((x) => x.id === x); return d ? (d.inn || loc(d, "label")) : id; };

  const historyGrid = h("div", { class: "history-grid" });
  state.history.slice().reverse().forEach((entry) => {
    const c = getCase(entry.caseId);
    const sp = entry.species ? getSpecies(entry.species) : null;
    const isCorrect = entry.diagnosisCorrect;
    const expanded = state.historyExpanded.has(entry.date);
    const histKey = String(entry.date).replace(/[^a-zA-Z0-9]/g, "");
    const toggleAndFocus = () => {
      if (expanded) state.historyExpanded.delete(entry.date);
      else state.historyExpanded.add(entry.date);
      render();
      const el = document.querySelector(`[data-histkey="${histKey}"]`);
      if (el) el.focus();
    };

    const card = h("div", {
      class: `card history-card ${expanded ? "history-card--expanded" : ""} clickable`,
      tabindex: "0",
      role: "button",
      "aria-expanded": expanded ? "true" : "false",
      "aria-label": `${entry.patientName} — ${t("outcome." + entry.patientOutcome, state.lang)}, ${tt(expanded ? "history.collapseDetails" : "history.expandDetails")}`,
      "data-histkey": histKey,
      title: tt(expanded ? "history.collapseDetails" : "history.expandDetails"),
      onclick: toggleAndFocus,
      onkeydown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleAndFocus(); } }
    });

    // Miniatura pacjenta: ilustracja odpowiadająca wynikowi (leczenie/pogorszenie), fallback ikona gatunku.
    const goodOutcomes = ["recovered", "improving"];
    const kind = goodOutcomes.includes(entry.patientOutcome) ? "treated" : "deteriorating";
    const altKey = kind === "treated" ? "image.treatedAlt" : "image.deterioratingAlt";
    const [thumb] = c && (kind === "treated" ? c.imageTreated : c.imageDeteriorating)
      ? patientImg(c, kind, altKey, "history-thumb")
      : (() => { const s = h("span", { class: "history-thumb history-thumb--fallback", "aria-hidden": "true" }); if (sp) setIcon(s, `species-${sp.id}`); return [s]; })();
    card.append(thumb);

    const body = h("div", { class: "history-card-body" });
    const headerDiv = h("div", { class: "history-card-header" });
    headerDiv.append(h("span", { class: "history-patient-name" }, entry.patientName || "?"));

    const dxIcon = h("span", { class: "history-dx-icon" });
    setIcon(dxIcon, isCorrect ? "check" : "cross");
    headerDiv.append(h("span", { class: `history-dx ${isCorrect ? "correct" : "wrong"}` },
      dxIcon, " " + (isCorrect ? tt("history.diagnosisCorrect") : tt("history.diagnosisWrong"))));
    body.append(headerDiv);

    // Sygnał przypadku (jednolinijkowy opis) — kontekst „ładnie opisanej” historii.
    if (c) {
      const sig = state.lang === "en" ? (c.signalEn || c.signalPl) : (c.signalPl || c.signalEn);
      if (sig) body.append(h("div", { class: "history-signal" }, sig));
    }

    const metaDiv = h("div", { class: "history-card-meta" });
    metaDiv.append(h("span", { class: `outcome-label state-${entry.patientOutcome}` },
      h("span", { class: `outcome-dot state-${entry.patientOutcome}` }),
      " " + t("outcome." + entry.patientOutcome, state.lang)));
    metaDiv.append(h("span", { class: "history-xp" }, `${entry.xpEarned >= 0 ? "+" : ""}${entry.xpEarned} XP`));
    const date = new Date(entry.date);
    metaDiv.append(h("span", { class: "history-date" }, date.toLocaleDateString(state.lang === "en" ? "en-GB" : "pl-PL")));
    body.append(metaDiv);

    // Podpowiedź rozwijania.
    body.append(h("div", { class: "history-expand-hint" }, tt(expanded ? "history.collapseDetails" : "history.expandDetails")));
    card.append(body);

    // Log szczegółów (tylko rozwinięty): rozpoznanie / zlecone badania / leczenie / rezultat.
    if (expanded) {
      const detail = h("div", { class: "history-detail" });
      const row = (label, valueNode) => detail.append(h("div", { class: "history-detail-row" },
        h("span", { class: "history-detail-label" }, label), valueNode));
      // Rozpoznanie
      row(tt("history.diagnosis"), h("span", { class: `history-detail-value ${isCorrect ? "pos" : "neg"}` },
        diseaseLabel(entry.diagnosis)));
      // Zlecone badania
      const exams = (entry.exams || []).map(examLabelById);
      row(tt("history.examsOrdered"), h("span", { class: "history-detail-value" },
        exams.length ? exams.join("·") : "—"));
      // Leczenie
      const txs = (entry.treatments || []).map((t) =>
        `${drugLabelById(t.drug)}${t.doseMg ? ` — ${t.doseMg} mg` : ""}`);
      row(tt("history.treatment"), h("span", { class: "history-detail-value" },
        txs.length ? txs.join("·") : "—"));
      // Zabiegi i operacje (jeśli zlecono)
      if (entry.procedures && entry.procedures.length) {
        const procLabels = entry.procedures.map((id) => { const p = getProcedure(id); return p ? loc(p, "label") : id; });
        row(tt("history.procedures"), h("span", { class: "history-detail-value" }, procLabels.join(" · ")));
      }
      // Zalecenia (jeśli zlecono)
      if (entry.recommendations && entry.recommendations.length) {
        const recLabels = entry.recommendations.map((id) => { const r = getRecommendation(id); return r ? loc(r, "label") : id; });
        row(tt("history.recommendations"), h("span", { class: "history-detail-value" }, recLabels.join(" · ")));
      }
      // Rezultat
      row(tt("history.outcome"), h("span", { class: "history-detail-value" },
        `${t("outcome." + entry.patientOutcome, state.lang)} · +${entry.xpEarned} XP`));
      card.append(detail);
    }
    historyGrid.append(card);
  });
  container.append(historyGrid);

  // Clear + back
  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-primary", onclick: () => { state.view = "cases"; render(); } },
      state.lang === "en" ? "← Back to patients" : "← Wróć do pacjentów"),
    h("button", { class: "btn-danger", onclick: clearHistory }, tt("history.clear"))
  ));

  return container;
}

/* ============================== ENCYCLOPEDIA (KATALOG) ============================== */

const ENCYC_TABS = [
  { id: "exams", key: "encyclopedia.tab.exams" },
  { id: "diseases", key: "encyclopedia.tab.diseases" },
  { id: "drugs", key: "encyclopedia.tab.drugs" },
  { id: "procedures", key: "encyclopedia.tab.procedures" },
  { id: "recommendations", key: "encyclopedia.tab.recommendations" },
  { id: "glossary", key: "encyclopedia.tab.glossary" }
];

function appendIf(parent, node) { if (node) parent.append(node); }

function encycWikiLink(url) {
  if (!url) return null;
  const a = h("a", { class: "encyc-wiki", href: url, target: "_blank", rel: "noopener noreferrer", title: tt("knowledge.wikiHint") });
  a.innerHTML = iconSvg("external-link");
  a.append(document.createTextNode(" " + tt("encyclopedia.wiki")));
  return a;
}

function encycInfoBody(obj) {
  const text = (state.lang === "en" ? (obj.infoEn || obj.infoPl) : (obj.infoPl || obj.infoEn)) || "";
  if (!text) return h("p", { class: "encyc-no-info" }, tt("encyclopedia.noInfo"));
  const div = h("div", { class: "encyc-info" });
  div.innerHTML = formatInfoBody(text, state.lang);
  attachGlossaryHandlers(div);
  return div;
}

function encycMeta(rows) {
  const meta = h("div", { class: "encyc-meta-rows" });
  let any = false;
  for (const r of rows) {
    if (!r) continue;
    const label = r.label ? r.label + ": " : "";
    meta.append(h("div", { class: "encyc-meta" }, h("span", { class: "encyc-meta-label" }, label), h("span", { class: "encyc-meta-val" }, r.value)));
    any = true;
  }
  return any ? meta : null;
}

function encycDoseRows(d) {
  const rows = [];
  rows.push({ label: tt("encyclopedia.route"), value: loc(d, "route") });
  if (d.dosingType === "topical") {
    rows.push({ label: tt("encyclopedia.dose"), value: tt("encyclopedia.topical") });
  } else {
    const parts = [];
    for (const sp of ["dog", "cat", "rabbit"]) {
      const dd = d.dosing && d.dosing[sp];
      if (dd && dd.mgPerKg) {
        const b = dd.mgPerKg;
        const bandStr = (b.min === b.max) ? ttf("encyclopedia.dosePoint", { v: b.min }) : ttf("encyclopedia.doseBand", { min: b.min, max: b.max });
        const spObj = getSpecies(sp);
        const spName = spObj ? loc(spObj, "label") : sp;
        parts.push(spName + ": " + bandStr);
      }
    }
    if (parts.length) rows.push({ label: tt("encyclopedia.dose"), value: parts.join(" · ") });
  }
  if (d.minLevel && d.minLevel > 1) rows.push({ label: "", value: ttf("encyclopedia.locked", { n: d.minLevel }) });
  return encycMeta(rows);
}

function renderEncyclopedia() {
  const container = h("div", { class: "encyc-content" });
  container.append(h("h2", {}, tt("encyclopedia.title")));
  container.append(h("p", { class: "encyc-subtitle" }, tt("encyclopedia.subtitle")));

  const tabBar = h("div", { class: "encyc-tabbar", role: "tablist" });
  for (const tab of ENCYC_TABS) {
    tabBar.append(h("button", {
      class: `encyc-tab ${state.encyclopediaTab === tab.id ? "encyc-tab--active" : ""}`,
      role: "tab",
      "aria-selected": String(state.encyclopediaTab === tab.id),
      onclick: () => { state.encyclopediaTab = tab.id; render(); }
    }, tt(tab.key)));
  }
  container.append(tabBar);

  let body;
  switch (state.encyclopediaTab) {
    case "exams": body = renderEncycExams(); break;
    case "diseases": body = renderEncycDiseases(); break;
    case "drugs": body = renderEncycDrugs(); break;
    case "procedures": body = renderEncycProcedures(); break;
    case "recommendations": body = renderEncycRecommendations(); break;
    case "glossary": body = renderEncycGlossary(); break;
    default: body = renderEncycExams();
  }
  container.append(body);

  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-primary", onclick: () => { state.view = "cases"; render(); } }, tt("encyclopedia.back"))
  ));
  return container;
}

function encycTileImage(entity, fallbackIcon) {
  const tileImage = h("div", { class: "tile-image" });
  if (entity.image) {
    tileImage.append(h("img", {
      class: "tile-img", src: `img/${entity.image}`, alt: "", loading: "lazy",
      onerror: function () { this.remove(); this.parentElement.classList.add("tile-image--fallback"); }
    }));
  } else {
    tileImage.classList.add("tile-image--fallback");
  }
  const fb = h("span", { class: "tile-fallback-icon", "aria-hidden": "true" }); setIcon(fb, fallbackIcon);
  tileImage.append(fb);
  return tileImage;
}

function renderEncycExams() {
  const wrap = h("div", { class: "encyc-grid encyc-grid--tiles" });
  wrap.append(h("div", { class: "encyc-count" }, ttf("encyclopedia.count", { n: CONTENT.exams.length })));
  for (const e of CONTENT.exams) {
    const card = h("div", { class: "card encyc-card" });
    card.append(encycTileImage(e, `exam-${e.id}`));
    card.append(h("div", { class: "encyc-card-header" }, h("h3", {}, loc(e, "label")), encycWikiLink(e.wikiPl || e.wikiEn)));
    appendIf(card, encycMeta([{ label: tt("encyclopedia.group"), value: loc(e, "group") }]));
    card.append(encycInfoBody(e));
    wrap.append(card);
  }
  return wrap;
}

function renderEncycDiseases() {
  const wrap = h("div", { class: "encyc-grid" });
  wrap.append(h("div", { class: "encyc-count" }, ttf("encyclopedia.count", { n: CONTENT.diseases.length })));
  for (const d of CONTENT.diseases) {
    const card = h("div", { class: "card encyc-card" });
    card.append(h("div", { class: "encyc-card-header" }, h("h3", {}, loc(d, "label")), encycWikiLink(d.wikiPl || d.wikiEn)));
    const badges = h("div", { class: "encyc-badges" });
    if (d.requiredExams && d.requiredExams.length) {
      const names = d.requiredExams.map((id) => { const ex = getExam(id); return ex ? loc(ex, "label") : id; }).join(", ");
      badges.append(h("span", { class: "encyc-badge" }, tt("encyclopedia.requiredExams") + ": " + names));
    }
    if (d.recommendedGroups && d.recommendedGroups.length) {
      const names = d.recommendedGroups.map((g) => { const grp = CONTENT.drugGroups.find((x) => x.id === g); return grp ? loc(grp, "label") : g; }).join(", ");
      badges.append(h("span", { class: "encyc-badge" }, tt("encyclopedia.recommendedGroups") + ": " + names));
    }
    if (badges.childNodes.length) card.append(badges);
    card.append(encycInfoBody(d));
    wrap.append(card);
  }
  return wrap;
}

function renderEncycDrugs() {
  const wrap = h("div", { class: "encyc-drugs" });
  wrap.append(h("div", { class: "encyc-count" }, ttf("encyclopedia.count", { n: CONTENT.drugs.length })));
  const byGroup = new Map();
  for (const d of CONTENT.drugs) {
    if (!byGroup.has(d.groupId)) byGroup.set(d.groupId, []);
    byGroup.get(d.groupId).push(d);
  }
  for (const [gid, drugs] of byGroup) {
    const g = CONTENT.drugGroups.find((x) => x.id === gid);
    const color = GROUP_COLORS[gid] || "#666";
    const section = h("div", { class: "drug-group encyc-group", style: { "--group-color": color } });
    const ghdr = h("div", { class: "drug-group-header" });
    if (g && g.image) {
      ghdr.append(h("img", { class: "drug-group-banner", src: `img/${g.image}`, alt: "", loading: "lazy", onerror: function () { this.style.display = "none"; } }));
    }
    const gtxt = h("div", { class: "drug-group-text" });
    if (g) {
      gtxt.append(h("div", { class: "drug-group-title" }, loc(g, "label")));
      if (loc(g, "desc")) gtxt.append(h("div", { class: "drug-group-desc" }, loc(g, "desc")));
    }
    ghdr.append(gtxt);
    section.append(ghdr);
    const grid = h("div", { class: "encyc-drug-list" });
    for (const d of drugs) {
      const card = h("div", { class: "card encyc-card encyc-drug-card" });
      card.append(h("div", { class: "encyc-card-header" }, h("h3", {}, d.inn), encycWikiLink(d.wikiPl || d.wikiEn)));
      appendIf(card, encycDoseRows(d));
      card.append(encycInfoBody(d));
      grid.append(card);
    }
    section.append(grid);
    wrap.append(section);
  }
  return wrap;
}

function renderEncycProcedures() {
  const wrap = h("div", { class: "encyc-grid encyc-grid--tiles" });
  wrap.append(h("div", { class: "encyc-count" }, ttf("encyclopedia.count", { n: CONTENT.procedures.length })));
  for (const p of CONTENT.procedures) {
    const card = h("div", { class: "card encyc-card" });
    card.append(encycTileImage(p, "check"));
    const kindLabel = p.kind === "surgery" ? tt("encyclopedia.kind.surgery") : tt("encyclopedia.kind.procedure");
    card.append(h("div", { class: "encyc-card-header" }, h("h3", {}, loc(p, "label")), encycWikiLink(p.wikiPl || p.wikiEn)));
    const rows = [{ label: tt("encyclopedia.group"), value: kindLabel }];
    if (p.minLevel && p.minLevel > 1) rows.push({ label: "", value: ttf("encyclopedia.locked", { n: p.minLevel }) });
    appendIf(card, encycMeta(rows));
    card.append(encycInfoBody(p));
    wrap.append(card);
  }
  return wrap;
}

function renderEncycRecommendations() {
  const wrap = h("div", { class: "encyc-grid" });
  wrap.append(h("div", { class: "encyc-count" }, ttf("encyclopedia.count", { n: CONTENT.recommendations.length })));
  for (const r of CONTENT.recommendations) {
    const card = h("div", { class: "card encyc-card" });
    card.append(h("div", { class: "encyc-card-header" }, h("h3", {}, loc(r, "label")), encycWikiLink(r.wikiPl || r.wikiEn)));
    card.append(encycInfoBody(r));
    wrap.append(card);
  }
  return wrap;
}

function renderEncycGlossary() {
  const wrap = h("div", { class: "encyc-grid" });
  wrap.append(h("div", { class: "encyc-count" }, ttf("encyclopedia.count", { n: CONTENT.glossary.length })));
  for (const g of CONTENT.glossary) {
    const card = h("div", { class: "card encyc-card encyc-glossary-card" });
    const title = state.lang === "en" ? (g.termEn || g.term) : (g.term || g.termEn);
    card.append(h("div", { class: "encyc-card-header" }, h("h3", {}, title)));
    const simple = (state.lang === "en" ? (g.simpleEn || g.simplePl) : (g.simplePl || g.simpleEn));
    const full = (state.lang === "en" ? (g.fullEn || g.fullPl) : (g.fullPl || g.fullEn));
    if (simple) card.append(h("div", { class: "encyc-gloss-simple" }, h("span", { class: "encyc-meta-label" }, tt("encyclopedia.glossary.simple") + ": "), document.createTextNode(simple)));
    if (full) {
      const fdiv = h("div", { class: "encyc-gloss-full" });
      fdiv.append(h("span", { class: "encyc-meta-label" }, tt("encyclopedia.glossary.full") + ": "));
      const body = h("span");
      body.innerHTML = wrapGlossaryTerms(full, state.lang);
      attachGlossaryHandlers(body);
      fdiv.append(body);
      card.append(fdiv);
    }
    if (!simple && !full) card.append(h("p", { class: "encyc-no-info" }, tt("encyclopedia.noInfo")));
    wrap.append(card);
  }
  return wrap;
}

/* ============================== ABOUT ============================== */

function renderAbout() {
  const container = h("div", { class: "about-content" });
  const en = state.lang === "en";
  container.append(h("h2", {}, tt("about.title")));

  // Co to za gra — przemycana wiedza, nie "dla dzieci".
  container.append(h("p", {}, tt("about.intro")));

  // Bezpieczeństwo — nie lecz sam, ufaj weterynarzowi.
  container.append(h("h3", {}, tt("about.safetyTitle")));
  container.append(h("p", {}, tt("about.safety")));
  container.append(h("div", { class: "safety-line" }, tt("safety.note")));

  // Darmowa i open source — kontrybucje i pipeline agentowy.
  container.append(h("h3", {}, tt("about.openTitle")));
  const openP = h("p", {}, tt("about.openSource") + " ");
  const ghLink = h("a", { href: "https://github.com/srozb/pawthology", target: "_blank", rel: "noopener noreferrer" },
    "github.com/srozb/pawthology");
  openP.append(ghLink);
  container.append(openP);

  // Źródła — weryfikacja faktów + claims.md.
  container.append(h("h3", {}, tt("about.sourcesTitle")));
  const srcP = h("p", { class: "card-meta" }, tt("about.sourcesBody") + " ");
  srcP.append(h("a", { href: "https://github.com/srozb/pawthology/blob/master/research/claims.md", target: "_blank", rel: "noopener noreferrer" },
    "claims.md"));
  container.append(srcP);

  // Klasy dowodowe — najtechniczniejsze, na końcu.
  container.append(h("h3", {}, tt("about.evidenceTitle")));
  container.append(h("p", { class: "card-meta" }, tt("about.evidenceIntro")));
  container.append(h("ul", { class: "card" },
    h("li", {}, h("strong", {}, "Verified: "), tt("about.eVerified")),
    h("li", {}, h("strong", {}, "Computed: "), tt("about.eComputed")),
    h("li", {}, h("strong", {}, "Modeled: "), tt("about.eModeled")),
    h("li", {}, h("strong", {}, "Fictionalized: "), tt("about.eFictional"))
  ));

  container.append(h("div", { class: "action-bar" },
    h("button", { class: "btn-primary", onclick: () => { state.view = "cases"; render(); } },
      en ? "← Back" : "← Powrót")
  ));

  return container;
}

/* ============================== ACTIONS ============================== */

function selectCase(id) {
  state.currentCaseId = id;
  state.view = "game";
  track("case/open/" + id);
  state.phase = "intake";
  state.selectedExams = [];
  state.diagnosis = null;
  state.treatments = [];
  state.procedures = [];
  state.recommendations = [];
  state.treatmentSections = { drugs: false, procedures: false, surgeries: false, recommendations: false };
  state.expandedDrugGroups = new Set();
  state.diagnosisOrder = shuffledDiagnosisOptions(id);
  state.lastResult = null;
  state.glossaryExpanded.clear();
  live(tt("phase.intake"));
  render();
}

// Przetasuj kolejność opcji diagnozy (Fisher–Yates) — prawidłowa nie zawsze pierwsza.
// Stabilna w obrębie sesji przypadku (ustawiana przy starcie/resecie przypadku).
function shuffledDiagnosisOptions(caseId) {
  const c = getCase(caseId);
  if (!c || !Array.isArray(c.diagnosisOptions)) return null;
  const arr = c.diagnosisOptions.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function goToPhase(phase) {
  track("phase/enter/" + phase);
  state.phase = phase;
  state.glossaryExpanded.clear();
  live(tt(PHASE_KEYS[phase]));
  render();
}

function toggleExam(id) {
  const idx = state.selectedExams.indexOf(id);
  if (idx >= 0) state.selectedExams.splice(idx, 1);
  else state.selectedExams.push(id);
  render();
}

function selectDiagnosis(id) {
  state.diagnosis = id;
  render();
}

function toggleTreatment(drugId) {
  const idx = state.treatments.findIndex((t) => t.drug === drugId);
  if (idx >= 0) {
    state.treatments.splice(idx, 1);
  } else {
    state.treatments.push({ drug: drugId, doseMg: 0 });
  }
  render();
}

function toggleProcedure(id) {
  const idx = state.procedures.indexOf(id);
  if (idx >= 0) state.procedures.splice(idx, 1);
  else state.procedures.push(id);
  render();
}

function toggleRecommendation(id) {
  const idx = state.recommendations.indexOf(id);
  if (idx >= 0) state.recommendations.splice(idx, 1);
  else state.recommendations.push(id);
  render();
}

function toggleSection(key) {
  state.treatmentSections[key] = !state.treatmentSections[key];
  render();
}

function toggleDrugGroup(groupId) {
  if (state.expandedDrugGroups.has(groupId)) state.expandedDrugGroups.delete(groupId);
  else state.expandedDrugGroups.add(groupId);
  render();
}

function removeTreatment(index) {
  state.treatments.splice(index, 1);
  render();
}

function finishCase() {
  const c = getCase(state.currentCaseId);
  if (!c) return;

  const decisions = {
    weightKg: c.weightKg,
    exams: state.selectedExams,
    diagnosis: state.diagnosis,
    treatments: state.treatments.map((t) => ({ drug: t.drug, doseMg: Number(t.doseMg) || 0 })),
    procedures: [...state.procedures],
    recommendations: [...state.recommendations]
  };

  try {
    const result = evaluateCase(c, decisions, CONTENT);
    state.lastResult = result;

    // Best-per-case XP: liczy się tylko najlepszy wynik danego przypadku.
    // Poprawa przy powtórce podnosi total; gorsza powtórka nic nie zmienia.
    // Tryb debug (z URL) → XP zablokowane: nie modyfikujemy bestXp/total/history,
    // by realny zapis w localStorage pozostał nietknięty. Wynik przypadku nadal pokazujemy.
    const beforeTotal = state.totalXp;
    const prev = state.bestXp[c.id] ?? null;
    if (!state.debug.active) {
      if (prev === null || result.xp > prev) {
        state.bestXp[c.id] = result.xp;
        state.totalXp = sumXp(state.bestXp);
      }
      if (!(c.id in state.bestOutcome) || outcomeRank(result.patientOutcome) > outcomeRank(state.bestOutcome[c.id])) {
        state.bestOutcome[c.id] = result.patientOutcome;
      }
    }
    result.xpDelta = state.totalXp - beforeTotal;   // faktyczna zmiana total (0, gdy gorsza powtórka / debug)
    result.wasPlayedBefore = prev !== null;
    result.debugFrozen = state.debug.active;

    // Save to history (always, even on replay) — pominięte w trybie debug (nie psujemy zapisu)
    if (!state.debug.active) {
      const dxCorrect = state.diagnosis === c.trueDiagnosis;
      const entry = {
        caseId: c.id,
        patientName: c.patientName || loc(c, "signal"),
        species: c.species,
        diagnosis: state.diagnosis,
        exams: [...state.selectedExams],
        treatments: state.treatments.map((t) => ({ drug: t.drug, doseMg: Number(t.doseMg) || 0 })),
        procedures: [...state.procedures],
        recommendations: [...state.recommendations],
        diagnosisCorrect: dxCorrect,
        patientOutcome: result.patientOutcome,
        xpEarned: result.xp,
        date: new Date().toISOString()
      };
      const existingIdx = state.history.findIndex((h) => h.caseId === c.id);
      if (existingIdx === -1) {
        state.history.push(entry);
      } else if (result.xp >= state.history[existingIdx].xpEarned) {
        state.history.splice(existingIdx, 1);   // better or tie -> newest wins
        state.history.push(entry);
      }
      // worse than stored best -> keep the stored best, do not add
    }

    persist();
    state.phase = "outcome";
    track("phase/enter/outcome");
    track("case/complete/" + c.id);
    track("case/outcome/" + result.patientOutcome);
    live(`${tt("label.outcome")}: ${t("outcome." + result.patientOutcome, state.lang)}, XP: ${result.xp >= 0 ? "+" : ""}${result.xp}`);
    render();
  } catch (e) {
    live(state.lang === "en" ? "Error evaluating case: " + e.message : "Błąd oceny przypadku: " + e.message);
    console.error(e);
  }
}

function abandonCase() {
  if (confirm(tt("case.abandonConfirm"))) {
    track("case/abandon/" + state.currentCaseId);
    state.view = "cases";
    state.currentCaseId = null;
    state.phase = "intake";
    state.selectedExams = [];
    state.diagnosis = null;
    state.treatments = [];
    state.procedures = [];
    state.recommendations = [];
    state.treatmentSections = { drugs: false, procedures: false, surgeries: false, recommendations: false };
    state.expandedDrugGroups = new Set();
    state.diagnosisOrder = null;
    state.lastResult = null;
    state.glossaryExpanded.clear();
    render();
  }
}

function nextPatient() {
  state.view = "cases";
  state.currentCaseId = null;
  state.phase = "intake";
  state.selectedExams = [];
  state.diagnosis = null;
  state.treatments = [];
  state.procedures = [];
  state.recommendations = [];
  state.treatmentSections = { drugs: false, procedures: false, surgeries: false, recommendations: false };
  state.expandedDrugGroups = new Set();
  state.diagnosisOrder = null;
  state.lastResult = null;
  state.glossaryExpanded.clear();
  render();
}

function resetCase() {
  track("case/reset/" + state.currentCaseId);
  state.phase = "intake";
  state.selectedExams = [];
  state.diagnosis = null;
  state.treatments = [];
  state.procedures = [];
  state.recommendations = [];
  state.treatmentSections = { drugs: false, procedures: false, surgeries: false, recommendations: false };
  state.expandedDrugGroups = new Set();
  state.diagnosisOrder = shuffledDiagnosisOptions(state.currentCaseId);
  state.lastResult = null;
  state.glossaryExpanded.clear();
  live(state.lang === "en" ? "Case reset." : "Przypadek zresetowany.");
  render();
}

function clearHistory() {
  if (confirm(tt("history.clearConfirm"))) {
    state.history = [];
    state.bestXp = {};
    state.bestOutcome = {};
    state.totalXp = 0;
    state.levelOpen = {};
    persist();
    render();
  }
}

function setLang(lang) {
  if (!AVAILABLE_LANGS.includes(lang)) return;
  if (state.lang === lang) return;
  state.lang = lang;
  persist();
  render();
}

/* ============================== UTIL ============================== */

function fmt(n) {
  if (!Number.isFinite(n)) return "—";
  return (Math.round(n * 100) / 100).toString();
}

/* ============================== INIT ============================== */

render();

// Tryb debug z hashem (#unlocked / #debug) działa „na żywo” — zmiana hasha bez przeładowania
// przełącza tryb i odświeża widok. Parametry ? (np. ?xp=N) wymagają przeładowania strony.
window.addEventListener("hashchange", () => {
  state.debug = parseDebugFromUrl();
  render();
});
