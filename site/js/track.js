// Pawthology — warstwa analityki produktu (lejek B).
//
// Cel: wiedzieć, jak większość gra — bez profilowania ani śledzenia osób.
//
// Prywatność:
//   • Brak cookies. Brak cross-site ID. Brak persist poza kartą.
//   • Token sesji w sessionStorage (per-karta, ginie po zamknięciu karty).
//   • GoatCounter jest cookieless i haszuje IP; tu tylko emitujemy zdarzenia.
//
// Lejek (per-sesja) vs liczniki (agregowane):
//   • Każde zdarzenie leci jako czysta ścieżka (np. "case/open/case-abrasion-paw")
//     → w dashboardzie GC zagregowane liczniki (grupowane po ścieżce).
//   • Token sesji jedzie w polach referrer każdego zdarzenia → po eksporcie CSV
//     można grupować hit-y po referrer, by zrekonstruować lejek per-sesja.
//   • Graceful degradation: gdyby GC zignorował referrer, liczniki agregowane
//     pozostają poprawne (lejek per-sesja przepada, ale ratio etapów zostaje).
//
// NIE śledzimy: tryb debug (testy QA), localhost, brak GC (adblock/offline → no-op).

const SESSION_KEY = "pawthology.sid";

/** Token sesji per-karta (8 znaków base36). Generowany lennie, trzymany w sessionStorage. */
function sessionId() {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return null;  // sessionStorage niedostępne (tryb prywatny) — bez tokena
  }
}

/** Czy emisja jest aktywna: GC załadowany, nie-localhost. */
function enabled() {
  if (typeof window === "undefined") return false;
  if (!window.goatcounter || typeof window.goatcounter.count !== "function") return false;
  try {
    const host = location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return false;
  } catch { /* ignore */ }
  return true;
}

let sessionStarted = false;

/** Odpala zdarzenie do GC. ciche no-op, gdy GC nieaktywny. */
export function track(event) {
  if (!enabled()) return;
  const sid = sessionId();
  const ref = sid ? "https://pawthology.session/" + sid : null;
  const fire = (path) => {
    const opts = { path, event: true };
    if (ref) opts.referrer = ref;
    try { window.goatcounter.count(opts); } catch { /* ignore */ }
  };
  // Raz na sesję: marker „sesja się rozpoczęła" (czysty licznik, bez fragmentacji).
  if (!sessionStarted) { sessionStarted = true; fire("session/start"); }
  fire(event);
}
