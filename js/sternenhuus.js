/* =========================================================
   STERNENHUUS: Kopfrechnen für Sternenstaub
   Für STAUB_PRO_STERN (15) richtige Aufgaben stellt der Sterngiek
   einen neuen Stern her. Er ersetzt den ersten verlorenen Stern.
   ========================================================= */
"use strict";

initTestmodusAusUrl();
const stand = ladeStand();
if (typeof stand.staub !== "number") stand.staub = 0;

const zufall = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const auswahl = (liste) => liste[Math.floor(Math.random() * liste.length)];
const ggT = (a, b) => (b === 0 ? Math.abs(a) : ggT(b, a % b));
// Negative Zahlen in Klammern, Minuszeichen typografisch
const z = (n) => (n < 0 ? `(-${Math.abs(n)})` : String(n));
const zahlText = (n) => String(n).replace("-", "−").replace(".", ",");

function bruch(zaehler, nenner) {
  const g = ggT(zaehler, nenner) || 1;
  let a = zaehler / g, b = nenner / g;
  if (b < 0) { a = -a; b = -b; }
  return { a, b };
}
const bruchTex = ({ a, b }) => (b === 1 ? String(a) : `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{${b}}`);
const bruchText = ({ a, b }) => (b === 1 ? zahlText(a) : `${zahlText(a)}/${b}`);

/* ---------- Aufgaben-Generatoren ----------
   Jede Aufgabe: { tex: Rechnung (KaTeX), wert: richtige Zahl, text: Lösung zum Anzeigen } */
const THEMEN = [
  {
    id: "plusminus", titel: "Plus und Minus", text: "auch mit negativen Zahlen",
    wissen: [["plus-minus", "Plus und Minus am Zahlenstrahl"]],
    neu() {
      const a = zufall(-20, 20) || 7;
      const b = zufall(-20, 20) || -5;
      const plus = Math.random() < 0.5;
      const wert = plus ? a + b : a - b;
      return { tex: `${a} ${plus ? "+" : "-"} ${z(b)}`, wert, text: zahlText(wert) };
    },
  },
  {
    id: "maldurch", titel: "Mal und Geteilt", text: "mit Vorzeichenregeln",
    wissen: [["vorzeichen", "Mal und Geteilt mit negativen Zahlen"]],
    neu() {
      let a = zufall(2, 12) * auswahl([1, -1]);
      let b = zufall(2, 12) * auswahl([1, -1]);
      if (Math.random() < 0.5) return { tex: `${a} \\cdot ${z(b)}`, wert: a * b, text: zahlText(a * b) };
      return { tex: `${a * b} : ${z(b)}`, wert: a, text: zahlText(a) };
    },
  },
  {
    id: "brueche", titel: "Bruchrechnung", text: "plus, minus, mal, geteilt",
    wissen: [["brueche", "Bruchrechnung"]],
    neu() {
      const nenner = [2, 3, 4, 5, 6, 8, 10];
      const x = bruch(zufall(1, 7), auswahl(nenner));
      const y = bruch(zufall(1, 7), auswahl(nenner));
      const art = auswahl(["+", "-", "·", ":"]);
      let e;
      if (art === "+") e = bruch(x.a * y.b + y.a * x.b, x.b * y.b);
      if (art === "-") e = bruch(x.a * y.b - y.a * x.b, x.b * y.b);
      if (art === "·") e = bruch(x.a * y.a, x.b * y.b);
      if (art === ":") e = bruch(x.a * y.b, x.b * y.a);
      const op = { "+": "+", "-": "-", "·": "\\cdot", ":": ":" }[art];
      return { tex: `${bruchTex(x)} ${op} ${bruchTex(y)}`, wert: e.a / e.b, text: bruchText(e), bruch: true };
    },
  },
  {
    id: "potenzen", titel: "Wurzeln und Potenzen", text: "Quadratzahlen, Hochzahlen, Wurzeln",
    wissen: [["potenzen", "Potenzen"], ["wurzeln", "Wurzeln"]],
    neu() {
      const art = zufall(1, 8);
      if (art === 1) { const a = zufall(2, 15); return { tex: `${a}^2`, wert: a * a, text: String(a * a) }; }
      if (art === 2) { const a = zufall(2, 15); return { tex: `\\sqrt{${a * a}}`, wert: a, text: String(a) }; }
      if (art === 3) { const a = zufall(2, 5); return { tex: `${a}^3`, wert: a ** 3, text: String(a ** 3) }; }
      if (art === 4) { const n = zufall(2, 10); return { tex: `2^{${n}}`, wert: 2 ** n, text: String(2 ** n) }; }
      if (art === 5) { const a = zufall(2, 99); return { tex: `${a}^0`, wert: 1, text: "1" }; }
      if (art === 6) { const a = zufall(2, 9); return Math.random() < 0.5
        ? { tex: `(-${a})^2`, wert: a * a, text: String(a * a) }
        : { tex: `-${a}^2`, wert: -a * a, text: zahlText(-a * a) }; }
      if (art === 7) { const n = zufall(1, 3); return { tex: `10^{-${n}}`, wert: 10 ** -n, text: zahlText(10 ** -n) }; }
      // √p · √q mit ganzem Ergebnis
      const paare = [[2, 8], [2, 18], [3, 12], [3, 27], [5, 20], [2, 32]];
      const [p, q] = auswahl(paare);
      const w = Math.round(Math.sqrt(p * q));
      return { tex: `\\sqrt{${p}} \\cdot \\sqrt{${q}}`, wert: w, text: String(w) };
    },
  },
];

let thema = null;
let aufgabe = null;
let beantwortet = false;

function verloren() {
  return verloreneSterne(stand);
}

function zeigeStatus() {
  zeigeSterneAnzeige(stand);
  const fehlend = verloren();
  const box = document.getElementById("status");
  const giek = `<p><b>Der Sterngiek:</b> „Willkommen im Sternenhuus! Aus Sternenstaub forme ich neue goldene Sterne. Für ${STAUB_PRO_STERN} richtige Rechenaufgaben hast du genug Sternenstaub gesammelt, um einen Stern herzustellen.“</p>`;
  if (!fehlend.length) {
    box.innerHTML = `${giek}<p class="klein">Gerade fehlt dir kein Stern, den ich ersetzen müsste. Du kannst hier trotzdem üben. Sternenstaub sammelst du, sobald ein Stern verloren gegangen ist.</p>`;
    return;
  }
  const prozent = (stand.staub / STAUB_PRO_STERN) * 100;
  box.innerHTML = `${giek}
    <p class="klein">${fehlend.length === 1 ? "Ein Stern ist" : `${fehlend.length} Sterne sind`} verloren gegangen (Türchen ${fehlend.join(", ")}). Der nächste neue Stern ersetzt den von Türchen ${fehlend[0]}.</p>
    <div class="staub-anzeige">${ico("stern", "")}
      <div class="staub-balken" role="progressbar" aria-valuemin="0" aria-valuemax="${STAUB_PRO_STERN}" aria-valuenow="${stand.staub}" aria-label="Sternenstaub"><div style="width:${prozent}%"></div></div>
      <b>${stand.staub} / ${STAUB_PRO_STERN}</b>
    </div>`;
}

function zeigeThemen() {
  const el = document.getElementById("themenfelder");
  el.innerHTML = THEMEN.map((t, i) => `
    <button type="button" class="themenfeld" data-i="${i}" aria-pressed="false">
      <b>${i + 1}. ${t.titel}</b><span>${t.text}</span>
    </button>`).join("");
  el.addEventListener("click", (e) => {
    const b = e.target.closest(".themenfeld");
    if (!b) return;
    el.querySelectorAll(".themenfeld").forEach((k) => k.setAttribute("aria-pressed", k === b));
    thema = THEMEN[Number(b.dataset.i)];
    neueAufgabe();
    document.getElementById("uebung").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function neueAufgabe() {
  aufgabe = thema.neu();
  beantwortet = false;
  const box = document.getElementById("uebung");
  box.hidden = false;
  box.innerHTML = `
    <h2 style="margin-top:0">${thema.titel}</h2>
    <p class="klein">Erklärung im Wissensbuch: ${thema.wissen.map(([id, t]) => `<a class="wissen-link" href="wissen.html#${id}">${t}</a>`).join(" · ")}</p>
    <div class="rechnung">$${aufgabe.tex} = \\;?$</div>
    <form class="antwort-form" novalidate>
      <div class="eingabe-zeile">
        <label class="sr-only" for="eingabe">Dein Ergebnis</label>
        <input id="eingabe" type="text" inputmode="${aufgabe.bruch ? "text" : "decimal"}" autocomplete="off" spellcheck="false" placeholder="${aufgabe.bruch ? "z. B. 5/6" : "Dein Ergebnis"}">
        <button class="knopf haupt" type="submit">Prüfen</button>
      </div>
    </form>
    <p class="rueckmeldung" aria-live="polite"></p>
    <div class="knopf-reihe"><button type="button" class="knopf zweitrangig" id="weiter" hidden>Nächste Aufgabe</button></div>`;
  renderMathe(box);
  const form = box.querySelector("form");
  const input = box.querySelector("#eingabe");
  const rueck = box.querySelector(".rueckmeldung");
  const weiter = box.querySelector("#weiter");
  input.focus({ preventScroll: true });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (beantwortet) { neueAufgabe(); return; }
    // Brüche dürfen auch als Dezimalzahl (gerundet) eingegeben werden
    const ok = pruefeAntwort({ antwort: aufgabe.wert, toleranz: aufgabe.bruch ? 0.006 : 0.0001 }, input.value);
    if (ok === null) {
      rueck.textContent = aufgabe.bruch ? "Bitte gib eine Zahl oder einen Bruch ein, z. B. 5/6." : "Bitte gib eine Zahl ein.";
      rueck.className = "rueckmeldung info";
      return;
    }
    beantwortet = true;
    input.disabled = true;
    weiter.hidden = false;
    if (ok) {
      rueck.textContent = "Richtig!";
      rueck.className = "rueckmeldung richtig";
      sammleStaub(form.querySelector("button"));
    } else {
      rueck.textContent = `Leider nicht. Richtig ist ${aufgabe.text}. Schau dir die Erklärung im Wissensbuch an.`;
      rueck.className = "rueckmeldung falsch";
    }
    form.querySelector("button").textContent = "Weiter";
    weiter.focus({ preventScroll: true });
  });
  weiter.addEventListener("click", neueAufgabe);
}

function sammleStaub(knopf) {
  if (!verloren().length) return; // Übungsmodus: kein Stern zu ersetzen
  stand.staub = Math.min(STAUB_PRO_STERN, (stand.staub || 0) + 1);
  const r = knopf.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "plus-stern";
  s.textContent = "+1 Sternenstaub";
  s.style.fontSize = "1.1rem";
  s.style.left = `${r.left}px`;
  s.style.top = `${r.top - 16}px`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1200);

  if (stand.staub >= STAUB_PRO_STERN) {
    const tag = verloren()[0];
    stand.ergebnis[`${tag}-0`] = "ersatz";
    stand.staub = 0;
    speichereStand(stand);
    zeigeStatus();
    zeigeNeuenStern(tag);
    return;
  }
  speichereStand(stand);
  zeigeStatus();
}

function zeigeNeuenStern(tag) {
  const hg = document.createElement("div");
  hg.className = "modal-hintergrund";
  hg.innerHTML = `
    ${konfettiHtml(18)}
    <div class="modal neuer-stern" role="dialog" aria-modal="true" aria-labelledby="neu-titel">
      <img src="${BILD.sternGross}" alt="">
      <p class="modal-ueber">Neuer Stern!</p>
      <h2 id="neu-titel">Der Sterngiek hat einen Stern hergestellt</h2>
      <p>Aus deinem Sternenstaub ist ein neuer goldener Stern entstanden. Er leuchtet jetzt für Türchen ${tag}.</p>
      <button type="button" class="knopf haupt">Wunderbar!</button>
    </div>`;
  document.body.appendChild(hg);
  const knopf = hg.querySelector("button");
  knopf.focus();
  knopf.addEventListener("click", () => {
    hg.remove();
    zeigeBadgeFeier(pruefeNeueBadges(stand), () => pruefeRettung(stand));
  });
}

zeigeStatus();
zeigeThemen();
zeigeTestPanel();
