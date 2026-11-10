/* =========================================================
   AUFGABENSEITE: aufgabe.html?tag=5
   ========================================================= */
"use strict";

initTestmodusAusUrl();
const stand = ladeStand();
const tag = parseInt(new URLSearchParams(location.search).get("tag"), 10);
const daten = AUFGABEN[tag];
const main = document.getElementById("inhalt");

const key = (i) => `${tag}-${i}`;
// Eine Aufgabe hat entweder ein Eingabefeld (Felder direkt in der Aufgabe) oder mehrere (felder: [...])
const felderVon = (a) => a.felder || [a];
// tipp kann ein Text oder eine Liste mehrerer Tipps sein
const tippsVon = (a) => (a.tipp ? [].concat(a.tipp) : []);

function hinweisKarte(icon, titel, text) {
  return `
    <div class="karte hinweis-karte">
      <p class="gross">${icon}</p>
      <h1>${titel}</h1>
      <p>${text}</p>
      <a class="knopf haupt" href="index.html">Zurück zum Kalender</a>
    </div>`;
}

function grafikenHtml(liste) {
  return liste && liste.length ? `<div class="grafiken">${liste.map(grafikHtml).join("")}</div>` : "";
}

// Aufgabe 1 bringt den goldenen Stern, die Bonus-Aufgabe eine Schneeflocke
const BELOHNUNG = {
  stern: { bild: "stern", name: "goldenen Stern" },
  schneeflocke: { bild: "flocke", name: "Bonus-Schneeflocke" },
};

function sternHtml(ergebnis, i) {
  const b = BELOHNUNG[belohnung(i)];
  if (ergebnis === "stern") return `<span class="teil-stern" title="${b.name} verdient">${ico(b.bild, "", b.name)}</span>`;
  if (ergebnis === "ersatz") return `<span class="teil-stern" title="Im Sternenhuus neu hergestellt">${ico(b.bild, "", "Neu hergestellter Stern")}</span>`;
  const titel = ergebnis === "loesung" ? "Mit Lösungsweg erledigt" : "Noch offen";
  return `<span class="teil-stern leer" title="${titel}">${ico(b.bild)}</span>`;
}

function feldHtml(f, id, mitKnopf) {
  if (f.typ === "auswahl") {
    return `
      <fieldset class="optionen" data-feld style="border:0;padding:0;margin:0">
        <legend class="${f.label ? "feld-label" : "sr-only"}">${f.label || "Wähle eine Antwort"}</legend>
        ${f.optionen.map((o, j) => `
          <label class="option"><input type="radio" name="${id}" value="${j}"><span>${o}</span></label>`).join("")}
      </fieldset>`;
  }
  return `
    <div class="eingabe-zeile" data-feld>
      ${f.label ? `<label class="feld-label" for="${id}">${f.label}</label>` : `<label class="sr-only" for="${id}">Deine Antwort</label>`}
      <input id="${id}" type="text" inputmode="${f.tastatur === "text" ? "text" : "decimal"}"
             autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Deine Antwort">
      ${f.einheit ? `<span class="einheit">${f.einheit}</span>` : ""}
      ${mitKnopf ? '<button class="knopf haupt" type="submit">Prüfen</button>' : ""}
    </div>`;
}

function formularHtml(a, i) {
  const felder = felderVon(a);
  // Bei genau einem Zahlenfeld steht der Prüfen-Knopf direkt daneben
  const knopfImFeld = felder.length === 1 && felder[0].typ !== "auswahl";
  return `
    <div class="felder">${felder.map((f, j) => feldHtml(f, `feld-${i}-${j}`, knopfImFeld)).join("")}</div>
    ${knopfImFeld ? "" : '<button class="knopf haupt" type="submit">Prüfen</button>'}`;
}

// Prüft ein einzelnes Feld: true / false / null (= nichts oder keine Zahl eingegeben)
function pruefeFeld(f, el) {
  if (f.typ === "auswahl") {
    const gewaehlt = el.querySelector("input:checked");
    return gewaehlt ? Number(gewaehlt.value) === f.antwort : null;
  }
  return pruefeAntwort(f, el.querySelector("input").value);
}

// Hinweis des Sterngieks, wenn der Stern des Tages verloren ist (oder schon ersetzt wurde)
function sterngiekHtml() {
  const wert = stand.ergebnis[key(0)];
  if (wert === "ersatz") {
    return `<div class="sterngiek ersatz">${ico("stern")}<div><p>Dieser Stern ist zwar verschwunden geblieben, aber der Sterngiek hat im Sternenhuus einen neuen für dich hergestellt. Er leuchtet jetzt an seiner Stelle.</p></div></div>`;
  }
  if (wert !== "loesung") return "";
  return `
    <div class="sterngiek">${ico("stern")}
      <div>
        <p><b>Der Sterngiek seufzt:</b> „Dieser goldene Stern bleibt wohl für immer verschwunden. Aber keine Sorge – im Sternenhuus können wir einen neuen herstellen. Dafür brauchst du Sternenstaub, den du mit Kopfrechenaufgaben sammelst.“</p>
        <a class="knopf zweitrangig" href="sternenhuus.html">Zum Sternenhuus</a>
      </div>
    </div>`;
}

function zeigeTeil(i, animiert) {
  if (document.getElementById(`teil-${i}`)) return;
  const a = daten.aufgaben[i];
  const felder = felderVon(a);
  const tipps = tippsVon(a);
  // Beim Rätsel (Aufgabe 1) erscheint der Tipp erst nach dem ersten falschen Versuch
  const tippSofort = i > 0 || (stand.versuche[key(i)] || 0) > 0;
  const sec = document.createElement("section");
  sec.className = "karte teil" + (animiert ? " neu" : "");
  sec.id = `teil-${i}`;
  sec.innerHTML = `
    <h2><span>${i === 0 ? "Das Rätsel" : "Bonus-Rätsel"}</span>${sternHtml(stand.ergebnis[key(i)], i)}</h2>
    <div class="aufgabe-text">${wissenLinks(a.text)}</div>
    ${grafikenHtml(a.grafiken)}
    <form class="antwort-form" novalidate>${formularHtml(a, i)}</form>
    <p class="rueckmeldung" aria-live="polite"></p>
    <div class="hilfe-knoepfe">${tipps.length ? `<button type="button" class="knopf zweitrangig tipp-knopf"${tippSofort ? "" : " hidden"}>💡 Tipp</button>` : ""}${a.loesung ? '<button type="button" class="knopf zweitrangig loesung-knopf" hidden>📖 Lösungsweg</button>' : ""}</div>
    <div class="tipps"></div>
    ${a.loesung ? `<div class="loesung-box" hidden><strong>📖 Lösungsweg</strong><p>${wissenLinks(a.loesung)}</p></div>` : ""}
    <div class="giek-platz"></div>`;
  document.getElementById("teile").appendChild(sec);

  const form = sec.querySelector("form");
  const feldEls = [...form.querySelectorAll("[data-feld]")];
  const rueck = sec.querySelector(".rueckmeldung");
  const tippKnopf = sec.querySelector(".tipp-knopf");
  const loesungKnopf = sec.querySelector(".loesung-knopf");
  const meldung = (text, art) => {
    rueck.textContent = text;
    rueck.className = `rueckmeldung ${art}`;
  };

  // Tipps nacheinander aufdecken
  let gezeigt = 0;
  if (tippKnopf) {
    tippKnopf.addEventListener("click", () => {
      const box = document.createElement("div");
      box.className = "tipp-box";
      box.innerHTML = `<strong>💡 ${tipps.length > 1 ? `Tipp ${gezeigt + 1}:` : "Tipp:"}</strong> ${wissenLinks(tipps[gezeigt])}`;
      sec.querySelector(".tipps").appendChild(box);
      renderMathe(box);
      gezeigt++;
      if (gezeigt >= tipps.length) tippKnopf.hidden = true;
      else tippKnopf.textContent = "💡 Noch ein Tipp";
    });
  }

  if (loesungKnopf) {
    let nachgefragt = false;
    loesungKnopf.addEventListener("click", () => {
      const box = sec.querySelector(".loesung-box");
      if (stand.ergebnis[key(i)]) {
        box.hidden = !box.hidden; // nach dem Lösen: einfach ein-/ausklappen
        loesungKnopf.textContent = box.hidden ? "📖 Lösungsweg" : "📖 Lösungsweg ausblenden";
        return;
      }
      if (!nachgefragt) {
        nachgefragt = true;
        loesungKnopf.textContent = i === 0
          ? "Wirklich ansehen? Dann bleibt der Stern verschwunden."
          : "Wirklich ansehen? Dann gibt es keine Schneeflocke.";
        loesungKnopf.classList.add("warnung");
        return;
      }
      box.hidden = false;
      loesungKnopf.classList.remove("warnung");
      loesungKnopf.textContent = "📖 Lösungsweg ausblenden";
      stand.ergebnis[key(i)] = "loesung";
      speichereStand(stand);
      erledigt(sec, i, false, true);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (stand.ergebnis[key(i)]) return;

    const ergebnisse = felder.map((f, j) => pruefeFeld(f, feldEls[j]));
    if (ergebnisse.some((r) => r === null)) {
      const zahlFehlt = felder.some((f, j) => ergebnisse[j] === null && f.typ !== "auswahl");
      return meldung(
        felder.length > 1 ? "Bitte fülle alle Felder aus." :
        zahlFehlt ? "Bitte gib eine Zahl ein, z. B. 3,5 oder 7/2." : "Bitte wähle zuerst eine Antwort aus.",
        "info");
    }

    if (ergebnisse.every(Boolean)) {
      stand.ergebnis[key(i)] = "stern";
      speichereStand(stand);
      fliegenderStern(form.querySelector("button[type=submit]"), BELOHNUNG[belohnung(i)].bild);
      erledigt(sec, i, true, true);
      return;
    }

    // Bei mehreren Feldern zeigen, welche schon stimmen
    if (felder.length > 1) {
      feldEls.forEach((el, j) => {
        el.classList.toggle("feld-richtig", ergebnisse[j]);
        el.classList.toggle("feld-falsch", !ergebnisse[j]);
      });
    }

    stand.versuche[key(i)] = (stand.versuche[key(i)] || 0) + 1;
    speichereStand(stand);
    const n = stand.versuche[key(i)];
    const max = a.maxVersuche ?? (felder.every((f) => f.typ === "auswahl") ? 2 : 3);
    // Nach dem ersten Fehlversuch wird der Tipp freigeschaltet
    const tippNeu = tippKnopf && tippKnopf.hidden && gezeigt === 0;
    if (tippNeu) tippKnopf.hidden = false;
    const tippOffen = tippKnopf && !tippKnopf.hidden;
    const teilweise = felder.length > 1 && ergebnisse.some(Boolean) ? "Teilweise richtig – die rot markierte Antwort stimmt noch nicht. " : "Leider noch nicht richtig. ";
    if (n >= max && loesungKnopf) {
      loesungKnopf.hidden = false;
      meldung(`${teilweise}Du kannst es weiter versuchen oder dir den Lösungsweg ansehen.`, "falsch");
    } else {
      meldung(`${teilweise}${tippNeu ? "Schau dir den Tipp an!" : tippOffen ? "Vielleicht hilft dir der Tipp?" : "Versuch es noch einmal!"}`, "falsch");
    }
    form.classList.remove("schuetteln");
    void form.offsetWidth; // Animation neu starten
    form.classList.add("schuetteln");
  });

  if (stand.ergebnis[key(i)]) erledigt(sec, i, hatBelohnung(stand.ergebnis[key(i)]), false);
  renderMathe(sec);
}

// Aufgabe als erledigt darstellen und ggf. die Folgeaufgabe aufklappen
function erledigt(sec, i, mitStern, animiert) {
  const wert = stand.ergebnis[key(i)];
  const felder = felderVon(daten.aufgaben[i]);
  const form = sec.querySelector("form");
  const feldEls = [...form.querySelectorAll("[data-feld]")];
  const rueck = sec.querySelector(".rueckmeldung");
  form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));

  const antworten = [];
  felder.forEach((f, j) => {
    const el = feldEls[j];
    el.classList.remove("feld-falsch", "feld-richtig");
    if (f.typ === "auswahl") {
      el.querySelectorAll(".option")[f.antwort].classList.add("korrekt");
      return;
    }
    const text = f.antwortText ?? formatZahl([].concat(f.antwort)[0]);
    const input = el.querySelector("input");
    if (!mitStern || !input.value) input.value = text;
    antworten.push(`${f.label ? f.label.replace(/:?\s*=?$/, "") + ": " : ""}${text}${f.einheit ? " " + f.einheit : ""}`);
  });

  const richtigeAntwort = antworten.length ? ` Richtige Antwort: ${antworten.join(", ")}.` : "";
  if (wert === "ersatz") {
    rueck.textContent = `Mit Lösungsweg erledigt.${richtigeAntwort}`;
  } else if (mitStern) {
    const jubel = i === 0
      ? `Richtig! ${daten.fund || "Du hast den goldenen Stern des Tages gefunden!"}`
      : "Stark gerechnet! Dafür bekommst du die Bonus-Schneeflocke.";
    rueck.textContent = animiert ? jubel : `Gelöst!${richtigeAntwort}`;
  } else {
    rueck.textContent = `Mit Lösungsweg erledigt.${richtigeAntwort}`;
  }
  rueck.className = `rueckmeldung ${wert === "stern" ? "richtig" : "info"}`;

  const sternEl = sec.querySelector(".teil-stern");
  sternEl.outerHTML = sternHtml(wert, i);
  if (wert === "stern" && animiert) sec.querySelector(".teil-stern").classList.add("pop");

  const tippKnopf = sec.querySelector(".tipp-knopf");
  if (tippKnopf) tippKnopf.hidden = true;
  const loesungKnopf = sec.querySelector(".loesung-knopf");
  if (loesungKnopf) loesungKnopf.hidden = false;

  // Stern verloren? Dann schickt uns der Sterngiek ins Sternenhuus
  if (i === 0) sec.querySelector(".giek-platz").innerHTML = sterngiekHtml();

  if (animiert) {
    zeigeSterneAnzeige(stand);
    const neueBadges = wert === "stern" ? pruefeNeueBadges(stand) : [];
    setTimeout(() => {
      if (i + 1 < daten.aufgaben.length) {
        zeigeTeil(i + 1, true);
        document.getElementById(`teil-${i + 1}`).scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        zeigeAbschluss(true);
      }
      zeigeBadgeFeier(neueBadges, () => pruefeRettung(stand));
    }, 900);
  }
}

function fliegenderStern(knopf, bild) {
  const r = knopf.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "plus-stern";
  s.innerHTML = `+1 ${ico(bild, "")}`;
  s.style.left = `${r.left + r.width / 2 - 40}px`;
  s.style.top = `${r.top - 16}px`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1200);
}

function zeigeAbschluss(animiert) {
  const ergebnisse = daten.aufgaben.map((_, i) => stand.ergebnis[key(i)]);
  if (!ergebnisse.every(Boolean)) return;
  const stern = hatBelohnung(ergebnisse[0]);
  const flocke = ergebnisse.slice(1).some((e) => e === "stern");
  const alle = ergebnisse.every((e) => e === "stern");
  const fehlen = MAX_STERNE - sterneGesamt(stand);
  const box = document.getElementById("abschluss");
  box.innerHTML = `
    <div class="karte abschluss${animiert ? " teil neu" : ""}">
      <p class="gross">${alle ? "🎉" : stern ? ico("sternGross", "") : "👍"}</p>
      <h2>Türchen ${tag} geschafft!</h2>
      <p>${stern ? "Der goldene Stern leuchtet wieder über Noelville" : "Den Stern hast du heute nicht gefunden – aber du weißt jetzt, wie es geht"}${flocke ? " – und die Bonus-Schneeflocke hast du auch!" : "."}</p>
      <p>${fehlen === 0 ? "<b>Alle 24 Sterne sind zurück. Du hast das Weihnachtsfest gerettet!</b>" : `Noch ${fehlen} ${fehlen === 1 ? "Stern fehlt" : "Sterne fehlen"}, um das Fest zu retten.`}</p>
      <a class="knopf haupt" href="index.html">Zurück zum Kalender</a>
      <div class="code-erinnerung">
        <p>Dein Fortschritt bleibt nur in diesem Browser gespeichert. Kopiere deinen Fortschritts-Code und speichere ihn irgendwo ab, damit du ihn beim nächsten Mal oder auf einem anderen Gerät wieder einfügen kannst.</p>
        <button type="button" class="knopf zweitrangig" id="code-kopieren">📋 Fortschritts-Code kopieren</button>
      </div>
    </div>`;
  box.querySelector("#code-kopieren").addEventListener("click", () => kopiereFortschrittsCode(stand));
  if (animiert) box.scrollIntoView({ behavior: "smooth", block: "start" });
}

function themenLinksHtml() {
  const bereiche = (daten.wissen || []).map((id) => WISSEN_BEREICHE.find((b) => b.id === id)).filter(Boolean);
  if (!bereiche.length) return "";
  return `<div class="themen-links">${bereiche.map((b) =>
    `<a href="wissen.html#bereich-${b.id}">${ico("dohle", "")}Wissen: ${b.titel}</a>`).join("")}</div>`;
}

function start() {
  zeigeSterneAnzeige(stand);
  zeigeTestPanel();

  if (!(tag >= 1 && tag <= 24)) {
    main.innerHTML = hinweisKarte("🤔", "Dieses Türchen gibt es nicht", "Der Kalender hat die Türchen 1 bis 24.");
    return;
  }
  if (!istOffen(tag)) {
    main.innerHTML = hinweisKarte("🔒", `Türchen ${tag} ist noch zu`, `Es öffnet sich am ${tag}. Dezember. Bis dahin: Geduld!`);
    return;
  }
  if (!daten) {
    main.innerHTML = hinweisKarte("🎁", "Hier wird noch gewichtelt …", "Die Aufgabe für dieses Türchen ist noch nicht fertig. Schau bald wieder vorbei!");
    return;
  }

  document.title = `Türchen ${tag}: ${daten.titel} – Noelville braucht deine Hilfe`;
  const hatEinleitung = daten.einleitung || (daten.grafiken && daten.grafiken.length);
  main.innerHTML = `
    <div class="aufgabe-kopf">
      <span class="tag-nr">Türchen ${tag}</span>
      <h1>${daten.titel}</h1>
      ${daten.thema ? `<span class="thema">${daten.thema}</span>` : ""}
      ${themenLinksHtml()}
    </div>
    ${hatEinleitung ? `<div class="karte einleitung">${wissenLinks(daten.einleitung || "")}${grafikenHtml(daten.grafiken)}</div>` : ""}
    <div id="teile"></div>
    <div id="abschluss"></div>
    ${daten.quelle ? `<p class="quelle">Quelle: ${daten.quelle}</p>` : ""}`;
  renderMathe(main.querySelector(".einleitung") || main);

  daten.aufgaben.forEach((_, i) => {
    if (i === 0 || stand.ergebnis[key(i - 1)]) zeigeTeil(i, false);
  });
  zeigeAbschluss(false);
}

start();
