/* =========================================================
   WISSENSDATENBANK: Suche, Filter nach Themenbereich, Direktlinks
   wissen.html#pythagoras        → öffnet den Artikel
   wissen.html#bereich-koerper   → zeigt nur diesen Themenbereich
   ========================================================= */
"use strict";

const stand = ladeStand();
const liste = document.getElementById("artikel-liste");
const suchFeld = document.getElementById("suche");
const filterLeiste = document.getElementById("filter");
const trefferInfo = document.getElementById("treffer");
let aktiverBereich = "alle";

// Für die Suche: Kleinbuchstaben, Umlaute vereinheitlichen, Formel-Befehle entfernen
function normalisiere(text) {
  return String(text)
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/\\[a-z]+/g, " ")
    .replace(/[^a-z0-9²³]+/g, " ");
}

function reinerText(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent;
}

// Zurück-Link: kommt man von einer Aufgabe, geht es dorthin zurück
function richteZurueckEin() {
  const link = document.getElementById("zurueck");
  let herkunft = null;
  try {
    const r = new URL(document.referrer);
    if (r.origin === location.origin && !r.pathname.endsWith("wissen.html")) herkunft = r;
  } catch (e) { /* kein Referrer */ }
  if (!herkunft) return;
  if (herkunft.pathname.endsWith("aufgabe.html")) link.textContent = "← Zurück zur Aufgabe";
  else if (herkunft.pathname.endsWith("sternenhuus.html")) link.textContent = "← Zurück zum Sternenhuus";
  else if (herkunft.pathname.endsWith("profil.html")) link.textContent = "← Zurück zum Profil";
  link.href = herkunft.pathname.split("/").pop() + herkunft.search;
}

function baueListe() {
  liste.innerHTML = WISSEN_BEREICHE.map((b) => `
    <section class="bereich" data-bereich="${b.id}">
      <h2 class="bereich-titel" id="bereich-${b.id}">${b.titel}</h2>
      <p class="bereich-text">${b.text}</p>
      ${WISSEN.filter((a) => a.bereich === b.id).map((a) => `
        <details class="artikel" id="${a.id}">
          <summary>${a.titel}</summary>
          <div class="artikel-inhalt">${wissenLinks(a.inhalt)}</div>
        </details>`).join("")}
    </section>`).join("") + '<p class="keine-treffer" hidden>Dazu hat die Alpendohle leider nichts gefunden. Versuche ein anderes Wort.</p>';

  // Suchtext für jeden Artikel vorbereiten
  WISSEN.forEach((a) => {
    const el = document.getElementById(a.id);
    el.dataset.such = normalisiere(`${a.titel} ${a.stichworte || ""} ${reinerText(a.inhalt)}`);
    el.dataset.titel = normalisiere(a.titel);
  });
  renderMathe(liste);
}

function baueFilter() {
  const knoepfe = [{ id: "alle", titel: "Alle Themen" }, ...WISSEN_BEREICHE];
  filterLeiste.innerHTML = knoepfe.map((b) =>
    `<button type="button" data-bereich="${b.id}" aria-pressed="${b.id === aktiverBereich}">${b.titel}</button>`).join("");
  filterLeiste.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    setzeBereich(b.dataset.bereich);
    history.replaceState(null, "", b.dataset.bereich === "alle" ? "wissen.html" : `#bereich-${b.dataset.bereich}`);
  });
}

function setzeBereich(id) {
  aktiverBereich = id;
  filterLeiste.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.bereich === id));
  filtere();
}

function filtere() {
  const woerter = normalisiere(suchFeld.value).split(" ").filter(Boolean);
  let anzahl = 0;
  const treffer = [];
  liste.querySelectorAll(".bereich").forEach((sec) => {
    const bereichPasst = aktiverBereich === "alle" || sec.dataset.bereich === aktiverBereich;
    let sichtbarImBereich = 0;
    sec.querySelectorAll(".artikel").forEach((a) => {
      const passt = bereichPasst && woerter.every((w) => a.dataset.such.includes(w));
      a.hidden = !passt;
      if (passt) {
        sichtbarImBereich++;
        treffer.push(a);
      }
    });
    sec.hidden = sichtbarImBereich === 0;
    anzahl += sichtbarImBereich;
  });
  liste.querySelector(".keine-treffer").hidden = anzahl > 0;
  if (woerter.length) {
    trefferInfo.textContent = `${anzahl} ${anzahl === 1 ? "Artikel" : "Artikel"} gefunden`;
    // Bei wenigen Treffern gleich aufklappen
    if (anzahl <= 3) treffer.forEach((a) => (a.open = true));
  } else {
    trefferInfo.textContent = "";
  }
}

// Direktlink auf einen Artikel oder Themenbereich
function zeigeAnker() {
  const ziel = decodeURIComponent(location.hash.slice(1));
  if (!ziel) return;
  if (ziel.startsWith("bereich-")) {
    setzeBereich(ziel.slice(8));
    window.scrollTo({ top: 0 });
    return;
  }
  const artikel = document.getElementById(ziel);
  if (!artikel || !artikel.classList.contains("artikel")) return;
  suchFeld.value = "";
  setzeBereich("alle");
  liste.querySelectorAll(".artikel.markiert").forEach((a) => a.classList.remove("markiert"));
  artikel.open = true;
  artikel.classList.add("markiert");
  setTimeout(() => artikel.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

zeigeSterneAnzeige(stand);
richteZurueckEin();
baueListe();
baueFilter();
filtere();
zeigeAnker();
window.addEventListener("hashchange", zeigeAnker);
suchFeld.addEventListener("input", () => {
  liste.querySelectorAll(".artikel.markiert").forEach((a) => a.classList.remove("markiert"));
  filtere();
});
zeigeTestPanel();
