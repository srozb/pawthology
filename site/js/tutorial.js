// Pawthology — mini-tutorial (wariant A: modal per faza).
//
// Samodzielny moduł: importuje tylko `t` z i18n.js. Renderuje własny overlay
// (do document.body, by przetrwać re-render SPA), reużywając klas .knowledge-*
// dla spójności wizualnej z dymkami „konsultanta". Logika aktywacji lives in main.js
// (state.tutorial + pawthology.tutorialDone).
//
// Zasada: tutorial uczy MECHANIKI interfejsu i myślenia klinicznego, NIE podaje
// gotowych odpowiedzi — nie psuje sensu gry.
//
// API:
//   TUT_STEPS                          — ["intake","exams","diagnosis","treatment","outcome"]
//   shouldRun(state, caseObj, done)    — czy tutorial ma się uruchomić dla tego przypadku
//   showStep(idx, lang, {onSkip,onClose,onComplete}) — pokaż bąbelk kroku
//   closeTutorial()                   — usuń bąbelk (z listenerem ESC)

import { t } from "./i18n.js";

export const TUT_STEPS = ["intake", "exams", "diagnosis", "treatment", "outcome"];

/** Warunek uruchomienia: pierwszy przypadek (threshold 0), gracz bez XP, nie w debug, nie zrobiony. */
export function shouldRun(state, caseObj, done) {
  if (done) return false;
  if (state?.debug?.active) return false;
  if ((caseObj?.unlockXpThreshold ?? 0) !== 0) return false;
  if ((state?.totalXp ?? 0) > 0) return false;
  return true;
}

// Minimalny helper DOM (decoupled od main.js — ten moduł nie zależy od jego h/iconSvg).
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (v === false || v == null) continue;
    else el.setAttribute(k, v);
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    el.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return el;
}

let _esc = null;

export function closeTutorial() {
  document.querySelectorAll(".tutorial-overlay").forEach((e) => e.remove());
  if (_esc) { document.removeEventListener("keydown", _esc); _esc = null; }
}

export function showStep(stepIndex, lang, { onSkip, onClose, onComplete } = {}) {
  closeTutorial();
  const phase = TUT_STEPS[stepIndex];
  if (!phase) return;
  const isLast = stepIndex === TUT_STEPS.length - 1;

  const overlay = h("div", { class: "tutorial-overlay knowledge-overlay knowledge-overlay--hint" });
  const modal = h("div", { class: "knowledge-modal", role: "dialog", "aria-modal": "true", "aria-label": t("tut.title", lang) });

  // Nagłówek: tytuł + licznik kroku + zamknięcie
  const header = h("div", { class: "knowledge-modal-header" });
  const counter = h("span", { class: "tutorial-counter" }, `${t("tut.stepLabel", lang)} ${stepIndex + 1} / ${TUT_STEPS.length}`);
  header.append(h("h3", { class: "knowledge-title" }, t("tut.title", lang), " ", counter));
  const xBtn = h("button", { class: "knowledge-close", type: "button", "aria-label": t("tut.closeAria", lang) }, "✕");
  xBtn.addEventListener("click", () => onClose?.());
  header.append(xBtn);
  modal.append(header);

  // Treść kroku (plain text — bez interpolacji, bez glosariusza)
  const body = h("div", { class: "knowledge-body" });
  body.append(h("p", {}, t("tut.step." + phase, lang)));
  modal.append(body);

  // Stopka: Pomiń | Dalej / Zakończ
  const footer = h("div", { class: "tutorial-footer" });
  const skipBtn = h("button", { class: "btn btn-secondary", type: "button" }, t("tut.skip", lang));
  skipBtn.addEventListener("click", () => onSkip?.());
  const primaryBtn = h("button", { class: "btn btn-primary", type: "button" }, isLast ? t("tut.done", lang) : t("tut.next", lang));
  primaryBtn.addEventListener("click", () => (isLast ? onComplete?.() : onClose?.()));
  footer.append(skipBtn, primaryBtn);
  modal.append(footer);

  overlay.append(modal);
  // Klik poza modalem = zamknięcie bąbelka (kontynuacja, NIE pominęcie)
  overlay.addEventListener("click", (e) => { if (e.target === overlay) onClose?.(); });

  document.body.append(overlay);
  _esc = (e) => { if (e.key === "Escape") onClose?.(); };
  document.addEventListener("keydown", _esc);
  primaryBtn.focus();
}
