/* =========================================================
   PROFILSEITE: Spitzname, Statistik, Badges, Fortschritts-Code
   (Code erzeugen und lesen: siehe app.js)
   ========================================================= */
"use strict";

initTestmodusAusUrl();
let stand = ladeStand();

function tuerenGeschafft(s) {
  let n = 0;
  for (let tag = 1; tag <= 24; tag++) {
    const anzahl = AUFGABEN[tag] ? AUFGABEN[tag].aufgaben.length : 0;
    if (anzahl && Array.from({ length: anzahl }, (_, i) => s.ergebnis[`${tag}-${i}`]).every(Boolean)) n++;
  }
  return n;
}

function render() {
  const sterne = sterneGesamt(stand);
  const erreicht = erreichteBadges(stand);
  zeigeSterneAnzeige(stand);
  document.getElementById("stat-sterne").textContent = `${sterne}/${MAX_STERNE}`;
  document.getElementById("stat-flocken").textContent = `${schneeflockenGesamt(stand)}/${MAX_SCHNEEFLOCKEN}`;
  document.getElementById("stat-tueren").textContent = tuerenGeschafft(stand);
  document.getElementById("stat-badges").textContent = `${erreicht.length}/${BADGES.length}`;

  // Fortschritt der Rettung: wie viele goldene Sterne fehlen noch?
  const fehlen = MAX_STERNE - sterne;
  const prozent = (sterne / MAX_STERNE) * 100;
  const verloren = verloreneSterne(stand).length;
  document.getElementById("naechstes").innerHTML = `
    <p class="klein" style="margin:16px 0 0">${fehlen === 0
      ? "<b>Alle 24 Sterne sind zurück – du hast das Weihnachtsfest in Noelville gerettet!</b>"
      : `Rettung des Weihnachtsfests: noch <b>${fehlen} ${fehlen === 1 ? "goldener Stern" : "goldene Sterne"}</b>`}</p>
    <div class="fortschritt" role="progressbar" aria-valuemin="0" aria-valuemax="${MAX_STERNE}" aria-valuenow="${sterne}"><div style="width:${prozent}%"></div></div>
    ${verloren ? `<p class="klein">${verloren === 1 ? "Ein Stern ist" : `${verloren} Sterne sind`} verloren gegangen. Im <a href="sternenhuus.html">Sternenhuus</a> kann der Sterngiek neue herstellen.</p>` : ""}`;

  document.getElementById("badges").innerHTML = BADGES.map((b) => {
    const hat = badgeWert(b, stand) >= b.anzahl;
    const einheit = b.art === "schneeflocken"
      ? (b.anzahl === 1 ? "Schneeflocke" : "Schneeflocken")
      : (b.anzahl === 1 ? "Stern" : "Sternen");
    return `
      <div class="badge${hat ? "" : " gesperrt"}">
        ${badgeBild(b)}
        <h3>${b.name}</h3>
        <p>${hat ? b.text : `Ab ${b.anzahl} ${einheit}`}</p>
      </div>`;
  }).join("");

  document.getElementById("code-export").value = erzeugeCode(stand);
}

const nameFeld = document.getElementById("name");
nameFeld.value = stand.name;
nameFeld.addEventListener("input", () => {
  stand.name = nameFeld.value.trim();
  speichereStand(stand);
  document.getElementById("code-export").value = erzeugeCode(stand);
});

document.getElementById("kopieren").addEventListener("click", () => {
  const feld = document.getElementById("code-export");
  kopiereText(feld.value, () => {
    schreibeJSON(UNGESICHERT_KEY, false);
    toast("Code kopiert! Speichere ihn z. B. in deinen Notizen. 📋", 4000);
  }, () => {
    feld.select();
    try { document.execCommand("copy"); } catch (e) { /* ignorieren */ }
    schreibeJSON(UNGESICHERT_KEY, false);
    toast("Bitte den markierten Code kopieren und speichern.");
  });
});

let importBestaetigt = false;
document.getElementById("laden").addEventListener("click", (e) => {
  const daten = leseCode(document.getElementById("code-import").value);
  if (!daten) {
    toast("Dieser Code ist ungültig. Bitte prüfe, ob du ihn vollständig kopiert hast.");
    return;
  }
  if (!importBestaetigt && Object.keys(stand.ergebnis).length) {
    importBestaetigt = true;
    e.target.textContent = "Sicher? Dein aktueller Stand wird ersetzt.";
    return;
  }
  stand = Object.assign(neuerStand(), daten);
  stand.badges = erreichteBadges(stand).map((b) => b.id);
  stand.gerettet = sterneGesamt(stand) === MAX_STERNE;
  speichereStand(stand);
  schreibeJSON(UNGESICHERT_KEY, false); // der geladene Stand steckt ja schon in einem Code
  nameFeld.value = stand.name;
  document.getElementById("code-import").value = "";
  e.target.textContent = "Fortschritt laden";
  importBestaetigt = false;
  render();
  toast(`Fortschritt geladen: ${sterneGesamt(stand)} Sterne, ${schneeflockenGesamt(stand)} Schneeflocken`);
});

let resetBestaetigt = false;
document.getElementById("zuruecksetzen").addEventListener("click", (e) => {
  if (!resetBestaetigt) {
    resetBestaetigt = true;
    e.target.textContent = "Wirklich alles löschen? Nochmal klicken.";
    return;
  }
  stand = neuerStand();
  speichereStand(stand);
  schreibeJSON(UNGESICHERT_KEY, false);
  nameFeld.value = "";
  resetBestaetigt = false;
  e.target.textContent = "Alles zurücksetzen";
  render();
  toast("Alles zurückgesetzt.");
});

render();
zeigeTestPanel();
