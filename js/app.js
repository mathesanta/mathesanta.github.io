/* =========================================================
   GEMEINSAME LOGIK für alle Seiten
   (Speichern, Datum, Testmodus, Sterne, Badges, Antwortprüfung)
   ========================================================= */
"use strict";

const SPEICHER_KEY = "matheAdvent.stand.v1";
const TEST_KEY = "matheAdvent.test.v1";
const UNGESICHERT_KEY = "matheAdvent.ungesichert";
const MAX_STERNE = 24;        // ein goldener Stern pro Tag (Aufgabe 1)
const MAX_SCHNEEFLOCKEN = 24; // eine Bonus-Schneeflocke pro Tag (Aufgabe 2)
const STAUB_PRO_STERN = 15;   // so viele richtige Kopfrechenaufgaben braucht ein neuer Stern im Sternenhuus

/* ---------- Bilder ---------- */
const BILD = {
  stern: "bilder/stern.webp",
  sternGross: "bilder/stern-gross.webp",
  flocke: "bilder/schneeflocke.webp",
  elf: "bilder/elf.webp",
  dohle: "bilder/dohle.webp",
};

// Kleines Symbol im Text, z. B. ico("stern")
function ico(name, klasse = "ico", alt = "") {
  return `<img class="${klasse}" src="${BILD[name]}" alt="${alt}" aria-hidden="${alt ? "false" : "true"}">`;
}

/* ---------- localStorage (mit Absicherung, falls blockiert) ---------- */

function leseJSON(key, ersatz) {
  try {
    const roh = localStorage.getItem(key);
    return roh ? JSON.parse(roh) : ersatz;
  } catch (e) {
    return ersatz;
  }
}

function schreibeJSON(key, wert) {
  try {
    localStorage.setItem(key, JSON.stringify(wert));
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------- Spielstand ---------- */
// ergebnis["5-0"] = "stern"   → Tag 5, Aufgabe 1 richtig gelöst → goldener Stern
// ergebnis["5-1"] = "stern"   → Tag 5, Aufgabe 2 richtig gelöst → Bonus-Schneeflocke
// ergebnis["5-1"] = "loesung" → per Lösungsweg erledigt (keine Belohnung)
// ergebnis["5-0"] = "ersatz"  → Stern war verloren, wurde im Sternenhuus neu hergestellt
// staub: gesammelter Sternenstaub im Sternenhuus (0 bis STAUB_PRO_STERN)

function neuerStand() {
  return { version: 1, name: "", ergebnis: {}, versuche: {}, badges: [], staub: 0, gerettet: false };
}

function ladeStand() {
  const s = leseJSON(SPEICHER_KEY, null);
  if (!s || s.version !== 1) return neuerStand();
  return Object.assign(neuerStand(), s);
}

function speichereStand(stand) {
  schreibeJSON(SPEICHER_KEY, stand);
  schreibeJSON(UNGESICHERT_KEY, true); // Fortschritt hat sich geändert → an den Code erinnern
}

// Belohnung für eine Aufgabe: Aufgabe 1 bringt den goldenen Stern, jede weitere eine Schneeflocke
function belohnung(i) {
  return i === 0 ? "stern" : "schneeflocke";
}

function hatBelohnung(wert) {
  return wert === "stern" || wert === "ersatz";
}

function zaehle(stand, art) {
  return Object.entries(stand.ergebnis)
    .filter(([k, v]) => hatBelohnung(v) && belohnung(Number(k.split("-")[1])) === art).length;
}

function sterneGesamt(stand) {
  return zaehle(stand, "stern");
}

function schneeflockenGesamt(stand) {
  return zaehle(stand, "schneeflocke");
}

// Türchen, deren goldener Stern per Lösungsweg verloren ging (und noch nicht ersetzt wurde)
function verloreneSterne(stand) {
  return Object.entries(stand.ergebnis)
    .filter(([k, v]) => k.endsWith("-0") && v === "loesung")
    .map(([k]) => Number(k.split("-")[0]))
    .sort((a, b) => a - b);
}

/* ---------- Fortschritts-Code ---------- */
const CODE_PREFIX = "ADV1-";

function erzeugeCode(s) {
  const daten = { n: s.name, e: s.ergebnis, x: s.versuche, s: s.staub || 0 };
  return CODE_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(daten))));
}

function leseCode(code) {
  try {
    code = code.trim().replace(/\s+/g, "");
    if (!code.startsWith(CODE_PREFIX)) return null;
    const d = JSON.parse(decodeURIComponent(escape(atob(code.slice(CODE_PREFIX.length)))));
    if (!d || typeof d.e !== "object") return null;
    const ergebnis = {};
    for (const [k, v] of Object.entries(d.e)) {
      if (/^\d{1,2}-\d$/.test(k) && ["stern", "loesung", "ersatz"].includes(v)) ergebnis[k] = v;
    }
    return {
      name: String(d.n || "").slice(0, 24),
      ergebnis,
      versuche: d.x && typeof d.x === "object" ? d.x : {},
      staub: Math.max(0, Math.min(STAUB_PRO_STERN, Number(d.s) || 0)),
    };
  } catch (e) {
    return null;
  }
}

function kopiereText(text, fertig, fehler) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(fertig, fehler);
  } else {
    fehler();
  }
}

// Kopiert den Fortschritts-Code und merkt sich, dass er gesichert ist
function kopiereFortschrittsCode(stand) {
  kopiereText(erzeugeCode(stand), () => {
    schreibeJSON(UNGESICHERT_KEY, false);
    toast("Code kopiert! Speichere ihn z. B. in deinen Notizen. 📋", 4000);
  }, () => {
    location.href = "profil.html#code";
  });
}

/* ---------- Erinnerung beim Verlassen der Seite ----------
   Browser zeigen dabei nur ihren eigenen Standardtext („Seite verlassen?“).
   Beim Wechsel zwischen den Seiten des Kalenders erscheint die Frage nicht. */
let internerWechsel = false;

function geheZu(url) {
  internerWechsel = true;
  location.href = url;
}

function neuLaden() {
  internerWechsel = true;
  location.reload();
}

document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a[href]");
  if (a && a.origin === location.origin) internerWechsel = true;
}, true);

window.addEventListener("beforeunload", (e) => {
  if (internerWechsel || !leseJSON(UNGESICHERT_KEY, false)) return;
  e.preventDefault();
  e.returnValue = "";
});

window.addEventListener("pageshow", () => { internerWechsel = false; });

/* ---------- Datum & Testmodus ---------- */

function testEinstellungen() {
  return leseJSON(TEST_KEY, { aktiv: false, datum: null });
}

// ?testmodus=1 an eine Adresse hängen schaltet den Testmodus ein, ?testmodus=0 aus.
function initTestmodusAusUrl() {
  const p = new URLSearchParams(location.search);
  if (!p.has("testmodus")) return;
  const an = p.get("testmodus") !== "0";
  schreibeJSON(TEST_KEY, { aktiv: an, datum: an ? testEinstellungen().datum : null });
}

/* ---------- Vorschau für Prüfende ----------
   index.html?vorschau=1 öffnet alle 24 Türchen (ohne Testbalken) und merkt sich das
   in diesem Browser, damit es auf allen Seiten gilt. ?vorschau=0 beendet die Vorschau. */
const VORSCHAU_KEY = "matheAdvent.vorschau";

function vorschauAktiv() {
  const p = new URLSearchParams(location.search);
  if (p.has("vorschau")) schreibeJSON(VORSCHAU_KEY, p.get("vorschau") !== "0");
  return leseJSON(VORSCHAU_KEY, false) === true;
}

function heute() {
  const t = testEinstellungen();
  if (t.aktiv && t.datum) {
    const [j, m, d] = t.datum.split("-").map(Number);
    return new Date(j, m - 1, d, 12);
  }
  if (vorschauAktiv()) return new Date(KALENDER.jahr, 11, 24, 12);
  return new Date();
}

// Hinweis oben auf jeder Seite, solange die Vorschau läuft
document.addEventListener("DOMContentLoaded", () => {
  if (!vorschauAktiv()) return;
  const p = document.createElement("p");
  p.className = "vorschau-hinweis";
  p.innerHTML = `<b>Vorschau:</b> Alle 24 Türchen sind geöffnet. <a href="index.html?vorschau=0">Vorschau beenden</a>`;
  document.body.prepend(p);
});

function oeffnungsDatum(tag) {
  return new Date(KALENDER.jahr, 11, tag);
}

function istOffen(tag) {
  return heute() >= oeffnungsDatum(tag);
}

function istHeute(tag) {
  const h = heute();
  return h.getFullYear() === KALENDER.jahr && h.getMonth() === 11 && h.getDate() === tag;
}

function zeigeTestPanel(optionen = {}) {
  const t = testEinstellungen();
  if (!t.aktiv) return;
  document.body.classList.add("mit-testpanel");
  const div = document.createElement("div");
  div.className = "test-panel";
  div.innerHTML = `
    <strong>🧪 Testmodus</strong>
    <label>Datum: <input type="date" id="test-datum" value="${t.datum || ""}"></label>
    <button type="button" data-aktion="dez1">1.12.</button>
    <button type="button" data-aktion="dez24">24.12.</button>
    <button type="button" data-aktion="echt">Echtes Datum</button>
    ${optionen.positionsHelfer ? '<label><input type="checkbox" id="pos-helfer"> Positions-Helfer</label>' : ""}
    ${optionen.feier ? '<button type="button" data-aktion="feier">Feier zeigen</button>' : ""}
    <button type="button" data-aktion="aus">Beenden</button>`;
  document.body.appendChild(div);

  const setzeDatum = (datum) => {
    schreibeJSON(TEST_KEY, { aktiv: true, datum });
    neuLaden();
  };
  div.querySelector("#test-datum").addEventListener("change", (e) => setzeDatum(e.target.value || null));
  div.addEventListener("click", (e) => {
    const a = e.target.dataset.aktion;
    if (a === "dez1") setzeDatum(`${KALENDER.jahr}-12-01`);
    if (a === "dez24") setzeDatum(`${KALENDER.jahr}-12-24`);
    if (a === "echt") setzeDatum(null);
    if (a === "feier") zeigeRettungsFeier();
    if (a === "aus") {
      schreibeJSON(TEST_KEY, { aktiv: false, datum: null });
      geheZu(location.pathname + location.search.replace(/[?&]testmodus=[^&]*/, ""));
    }
  });
}

/* ---------- Badges ---------- */

// Badges zählen entweder goldene Sterne (Standard) oder Bonus-Schneeflocken (art: "schneeflocken")
function badgeWert(b, stand) {
  return b.art === "schneeflocken" ? schneeflockenGesamt(stand) : sterneGesamt(stand);
}

function erreichteBadges(stand) {
  return BADGES.filter((b) => badgeWert(b, stand) >= b.anzahl);
}

function pruefeNeueBadges(stand) {
  const neu = erreichteBadges(stand).filter((b) => !stand.badges.includes(b.id));
  if (neu.length) {
    stand.badges.push(...neu.map((b) => b.id));
    speichereStand(stand);
  }
  return neu;
}

function badgeBild(b, klasse = "badge-bild") {
  return `<img class="${klasse}" src="${b.bild}" alt="">`;
}

function konfettiHtml(anzahl) {
  return Array.from({ length: anzahl }, (_, i) => {
    const bild = i % 2 ? BILD.flocke : BILD.stern;
    return `<img class="konfetti" src="${bild}" alt="" style="left:${Math.random() * 100}%;width:${22 + Math.random() * 18}px;animation-delay:${Math.random() * 0.8}s;animation-duration:${1.8 + Math.random() * 1.2}s">`;
  }).join("");
}

// Zeigt nacheinander alle neuen Badges; danach wird `fertig` aufgerufen
function zeigeBadgeFeier(liste, fertig) {
  if (!liste.length) {
    if (fertig) fertig();
    return;
  }
  const b = liste[0];
  const hg = document.createElement("div");
  hg.className = "modal-hintergrund";
  hg.innerHTML = `
    ${konfettiHtml(18)}
    <div class="modal badge-modal" role="dialog" aria-modal="true" aria-labelledby="badge-titel">
      <div class="badge-gross">${badgeBild(b, "")}</div>
      <p class="modal-ueber">Neues Abzeichen!</p>
      <h2 id="badge-titel">${b.name}</h2>
      <p>${b.text}</p>
      <button type="button" class="knopf haupt">Juhu!</button>
    </div>`;
  document.body.appendChild(hg);
  const knopf = hg.querySelector("button");
  knopf.focus();
  knopf.addEventListener("click", () => {
    hg.remove();
    zeigeBadgeFeier(liste.slice(1), fertig);
  });
}

/* ---------- Große Feier, wenn alle 24 Sterne zurück sind ---------- */

function pruefeRettung(stand) {
  if (sterneGesamt(stand) < MAX_STERNE || stand.gerettet) return;
  stand.gerettet = true;
  speichereStand(stand);
  zeigeRettungsFeier();
}

function zeigeRettungsFeier() {
  const hg = document.createElement("div");
  hg.className = "rettung";
  const r = Math.min(window.innerWidth, window.innerHeight) * 0.36;
  const sterne = Array.from({ length: MAX_STERNE }, (_, i) => {
    const w = (i / MAX_STERNE) * 2 * Math.PI - Math.PI / 2;
    const zx = Math.cos(w) * r, zy = Math.sin(w) * r * 0.9;
    const sx = (Math.random() - 0.5) * window.innerWidth * 1.4;
    const sy = window.innerHeight * (0.6 + Math.random() * 0.5);
    return `<img class="rettung-stern" src="${BILD.stern}" alt="" style="--sx:${sx}px;--sy:${sy}px;--zx:${zx}px;--zy:${zy}px;animation-delay:${0.15 * i}s, ${0.15 * i + 1.4}s">`;
  }).join("");
  const flocken = Array.from({ length: 26 }, () =>
    `<img class="rettung-flocke" src="${BILD.flocke}" alt="" style="left:${Math.random() * 100}%;width:${14 + Math.random() * 22}px;animation-delay:${Math.random() * 6}s;animation-duration:${6 + Math.random() * 6}s">`).join("");
  const retter = BADGES.find((b) => b.id === "retter");
  hg.innerHTML = `
    ${flocken}
    <div class="rettung-kreis" aria-hidden="true">${sterne}</div>
    <div class="rettung-mitte" role="dialog" aria-modal="true" aria-labelledby="rettung-titel">
      ${retter ? badgeBild(retter, "rettung-badge") : ""}
      <h2 id="rettung-titel">Noelville ist gerettet!</h2>
      <p>Alle 24 goldenen Sterne leuchten wieder. Das Dorffest kann beginnen – frohe Weihnachten!</p>
      <button type="button" class="knopf haupt">Weiter</button>
    </div>`;
  document.body.appendChild(hg);
  const knopf = hg.querySelector("button");
  knopf.focus();
  knopf.addEventListener("click", () => hg.remove());
}

/* ---------- Themenbereiche der Wissensdatenbank ---------- */
const WISSEN_BEREICHE = [
  { id: "rechengesetze",      titel: "Allgemeine Rechengesetze",   text: "Rechnen mit negativen Zahlen, Brüchen, Potenzen und Wurzeln, Prozente, Zuordnungen, Terme und Gleichungen." },
  { id: "funktionen",         titel: "Funktionen",                 text: "Graphen lesen, lineare, quadratische und exponentielle Funktionen." },
  { id: "trigonometrie",      titel: "Trigonometrie",              text: "Rechtwinklige Dreiecke, Pythagoras, Sinus, Kosinus, Tangens, Strahlensätze und Winkel." },
  { id: "koerper",            titel: "Körperberechnung",           text: "Flächen, Volumen und Oberflächen von Körpern, Dichte." },
  { id: "wahrscheinlichkeit", titel: "Wahrscheinlichkeitsrechnung", text: "Wahrscheinlichkeiten, Baumdiagramme, Zählprinzip und Statistik (Mittelwert, Median)." },
];

/* ---------- Wissensdatenbank-Links ----------
   In Aufgaben, Tipps und Lösungen: [[pythagoras|Satz des Pythagoras]]
   wird zu einem Link auf wissen.html#pythagoras */
function wissenLinks(html) {
  return String(html).replace(/\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g,
    (_, id, text) => `<a class="wissen-link" href="wissen.html#${id}">${text}</a>`);
}

/* ---------- Antwortprüfung ---------- */
// Versteht z. B. "3,5"  "3.5"  "3,50 €"  "7/2"  "3 1/2"  "1.000"  "1 000"  "12 m2"  "-4"

function dezimal(s) {
  if (!/^-?[\d.,]+$/.test(s)) return null;
  const komma = (s.match(/,/g) || []).length;
  const punkt = (s.match(/\./g) || []).length;
  if (komma && punkt) {
    // Das hintere Zeichen ist das Dezimaltrennzeichen: 1.234,5 bzw. 1,234.5
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (komma > 1) {
    return null;
  } else if (komma === 1) {
    s = s.replace(",", ".");
  } else if (punkt > 1) {
    if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ""); // 1.000.000
    else return null;
  }
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

function parseZahl(eingabe) {
  if (eingabe == null) return null;
  let s = String(eingabe).trim().toLowerCase().replace(/[−–]/g, "-");
  s = s.replace(/[a-zäöüß]+\d*/g, " ");          // Einheiten wie "cm", "m2", "x="
  s = s.replace(/[^0-9,.\-\/ ]/g, " ");          // alles andere (€, %, ², =) weg
  s = s.replace(/(?<![\d.,]\s*)\/|\/(?!\s*-?[\d.,])/g, " "); // Schrägstrich aus "km/h"
  s = s.replace(/-(?!\s*[\d.,])/g, " ").trim();  // Bindestrich aus "-mal"
  let m = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/); // gemischter Bruch
  if (m) {
    if (+m[4] === 0) return null;
    const v = +m[2] + +m[3] / +m[4];
    return m[1] ? -v : v;
  }
  m = s.match(/^(-?[\d.,]+)\s*\/\s*(-?[\d.,]+)$/); // Bruch
  if (m) {
    const a = dezimal(m[1]);
    const b = dezimal(m[2]);
    if (a === null || b === null || b === 0) return null;
    return a / b;
  }
  return dezimal(s.replace(/\s+/g, ""));
}

// true = richtig, false = falsch, null = keine Zahl erkannt
function pruefeAntwort(aufgabe, eingabe) {
  const v = parseZahl(eingabe);
  if (v === null) return null;
  const kandidaten = [v];
  if (eingabe.includes("%") && aufgabe.einheit !== "%") kandidaten.push(v / 100);
  // "1.000" kann 1 oder 1000 (Tausenderpunkt) heißen – beides gelten lassen
  if (!eingabe.includes(",") && /\d\.\d{3}(?!\d)/.test(eingabe)) {
    const t = parseZahl(eingabe.replace(/\./g, ""));
    if (t !== null) kandidaten.push(t);
  }
  const tol = aufgabe.toleranz ?? 0.0001;
  const ziele = [].concat(aufgabe.antwort);
  return kandidaten.some((k) => ziele.some((z) => Math.abs(k - z) <= tol + 1e-9));
}

function formatZahl(z) {
  return Number(z).toLocaleString("de-DE", { maximumFractionDigits: 4 });
}

/* ---------- Kleinkram ---------- */

function toast(text, ms = 2800) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.classList.add("sichtbar");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("sichtbar"), ms);
}

function renderMathe(el) {
  if (window.renderMathInElement) {
    window.renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
    });
  }
}

// Anzeige oben rechts: Sterne und Schneeflocken (HTML mit Bildern)
function zeigeSterneAnzeige(stand) {
  const el = document.getElementById("sterne");
  if (!el) return;
  const sterne = sterneGesamt(stand);
  const flocken = schneeflockenGesamt(stand);
  el.innerHTML = `${ico("stern")} ${sterne} / ${MAX_STERNE}` + (flocken ? ` <span class="trenner"></span>${ico("flocke")} ${flocken}` : "");
  el.setAttribute("aria-label", `${sterne} von ${MAX_STERNE} goldenen Sternen` + (flocken ? `, ${flocken} Schneeflocken` : ""));
}
