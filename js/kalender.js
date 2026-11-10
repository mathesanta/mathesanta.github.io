/* =========================================================
   STARTSEITE: Wimmelbild mit 24 Türchen
   ========================================================= */
"use strict";

initTestmodusAusUrl();
const stand = ladeStand();
const SVGNS = "http://www.w3.org/2000/svg";
const B = KALENDER.bildBreite;
const H = KALENDER.bildHoehe;
let positionsHelferAn = false;

function svgEl(name, attrs = {}, text) {
  const e = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}

function tuerZustand(tag) {
  if (!istOffen(tag)) return { klasse: "gesperrt", ergebnisse: [] };
  const anzahl = AUFGABEN[tag] ? AUFGABEN[tag].aufgaben.length : 2;
  const ergebnisse = Array.from({ length: anzahl }, (_, i) => stand.ergebnis[`${tag}-${i}`]);
  const fertig = ergebnisse.every(Boolean);
  return { klasse: fertig ? "fertig" : "offen", ergebnisse };
}

function baueTuer(t) {
  const { klasse, ergebnisse } = tuerZustand(t.tag);
  const s = (KALENDER.tuerGroesse || 60) * (t.groesse || 1);
  const x = (t.x / 100) * B;
  const y = (t.y / 100) * H;
  const hatStern = hatBelohnung(ergebnisse[0]);
  const hatFlocke = ergebnisse.slice(1).some((e) => e === "stern");

  let label = `Türchen ${t.tag}`;
  if (klasse === "gesperrt") label += `, öffnet am ${t.tag}. Dezember`;
  else if (ergebnisse.some(Boolean)) label += hatStern ? ", goldener Stern gefunden" : ", ohne goldenen Stern";
  if (hatFlocke) label += ", mit Bonus-Schneeflocke";

  const g = svgEl("g", {
    class: `tuer ${klasse}${istHeute(t.tag) ? " heute" : ""}`,
    transform: `translate(${x} ${y})`,
    tabindex: 0,
    role: "link",
    "aria-label": label,
  });
  // Türchen = nur eine Rahmenlinie mit kleiner Zahl oben links – innen bleibt das Bild sichtbar
  const innen = svgEl("g", { class: "tuer-innen" });
  const r = { x: -s / 2, y: -s / 2, width: s, height: s, rx: 6 };
  innen.appendChild(svgEl("rect", { class: "flaeche", ...r }));  // unsichtbar, damit die ganze Fläche klickbar ist
  innen.appendChild(svgEl("rect", { class: "halo", ...r }));     // heller Rand: Linie bleibt auch auf dunklen Stellen sichtbar
  innen.appendChild(svgEl("rect", { class: "rahmen", ...r }));
  innen.appendChild(svgEl("text", { class: "nummer", x: -s / 2 + 7, y: -s / 2 + 13 }, t.tag));
  if (ergebnisse.some(Boolean)) {
    // goldener Stern für Aufgabe 1 (grau, wenn verloren), Schneeflocke für die Bonus-Aufgabe
    const g2 = 26;
    const bilder = [{ href: BILD.stern, class: hatStern ? "tuer-symbol" : "tuer-symbol verloren" }];
    if (hatFlocke) bilder.push({ href: BILD.flocke, class: "tuer-symbol" });
    bilder.forEach((b, k) => {
      const x0 = -(bilder.length * g2) / 2 + k * g2;
      innen.appendChild(svgEl("image", { ...b, x: x0, y: s / 2 + 3, width: g2, height: g2 }));
    });
  }
  g.appendChild(innen);

  const oeffnen = () => {
    if (positionsHelferAn) return;
    if (klasse === "gesperrt") {
      toast(`Geduld! Türchen ${t.tag} öffnet am ${t.tag}. Dezember.`);
      return;
    }
    geheZu(`aufgabe.html?tag=${t.tag}`);
  };
  g.addEventListener("click", oeffnen);
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      oeffnen();
    }
  });
  return g;
}

// Sternenhuus: Hütte mit den Sternen am Tor – dort stellt der Sterngiek neue Sterne her
function baueSternenhuus() {
  const h = KALENDER.sternenhuus;
  const x = (h.x / 100) * B, y = (h.y / 100) * H, r = h.r;
  const g = svgEl("g", { class: "huus", transform: `translate(${x} ${y})`, tabindex: 0, role: "link", "aria-label": "Sternenhuus: Hier stellt der Sterngiek neue Sterne her" });
  g.appendChild(svgEl("circle", { class: "flaeche", r }));
  g.appendChild(svgEl("circle", { class: "huus-halo", r }));
  g.appendChild(svgEl("circle", { class: "huus-ring", r }));
  g.appendChild(svgEl("rect", { class: "huus-schild", x: -64, y: -r - 30, width: 128, height: 28, rx: 14 }));
  g.appendChild(svgEl("text", { class: "huus-text", x: 0, y: -r - 16 }, "Sternenhuus"));
  const oeffnen = () => { if (!positionsHelferAn) geheZu("sternenhuus.html"); };
  g.addEventListener("click", oeffnen);
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      oeffnen();
    }
  });
  return g;
}

function baueSzene() {
  const svg = document.getElementById("szene");
  svg.setAttribute("viewBox", `0 0 ${B} ${H}`);
  svg.appendChild(svgEl("image", { href: KALENDER.bild, x: 0, y: 0, width: B, height: H, preserveAspectRatio: "xMidYMid slice" }));
  svg.appendChild(baueSternenhuus());
  TUEREN.forEach((t) => svg.appendChild(baueTuer(t)));

  // Positions-Helfer (nur im Testmodus): Klick ins Bild zeigt die Prozentwerte
  svg.addEventListener("click", (e) => {
    if (!positionsHelferAn) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const px = Math.round((p.x / B) * 1000) / 10;
    const py = Math.round((p.y / H) * 1000) / 10;
    svg.querySelectorAll(".pos-markierung").forEach((m) => m.remove());
    svg.appendChild(svgEl("circle", { class: "pos-markierung", cx: p.x, cy: p.y, r: 20 }));
    const text = `x: ${px}, y: ${py}`;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    toast(`📍 ${text} (kopiert)`, 5000);
  });
}

function infoText() {
  if (vorschauAktiv() && !testEinstellungen().aktiv) return "Alle Türchen sind zur Ansicht geöffnet. Klicke auf ein Türchen, um die Aufgaben zu sehen.";
  const h = heute();
  const start = oeffnungsDatum(1);
  if (h < start) {
    const tage = Math.ceil((start - h) / 86400000);
    return `Noch ${tage} ${tage === 1 ? "Tag" : "Tage"}, dann beginnt die Suche nach den Sternen!`;
  }
  const fehlen = MAX_STERNE - sterneGesamt(stand);
  if (fehlen === 0) return "Alle 24 Sterne leuchten wieder – Noelville kann Weihnachten feiern!";
  if (h.getFullYear() === KALENDER.jahr && h.getMonth() === 11 && h.getDate() <= 24) {
    return `Heute wartet Türchen ${h.getDate()} – finde den goldenen Stern! Noch ${fehlen} ${fehlen === 1 ? "Stern fehlt" : "Sterne fehlen"}.`;
  }
  return `Alle Türchen sind offen. Noch ${fehlen} ${fehlen === 1 ? "Stern fehlt" : "Sterne fehlen"} für das Fest.`;
}

function zeigeHeutigeTuerImSichtfeld() {
  const rahmen = document.getElementById("szene-rahmen");
  if (rahmen.scrollWidth <= rahmen.clientWidth) return;
  const h = heute();
  const t = TUEREN.find((t) => istHeute(t.tag)) || TUEREN.find((t) => t.tag === 1);
  if (!t || h.getMonth() !== 11) {
    rahmen.scrollLeft = (rahmen.scrollWidth - rahmen.clientWidth) / 2;
    return;
  }
  rahmen.scrollLeft = (t.x / 100) * rahmen.scrollWidth - rahmen.clientWidth / 2;
}

// Versteckter Zugang zum Testmodus: 5× schnell aufs Logo tippen
function geheimerTestZugang() {
  let klicks = 0;
  let timer;
  document.getElementById("logo").addEventListener("click", () => {
    klicks++;
    clearTimeout(timer);
    timer = setTimeout(() => (klicks = 0), 1500);
    if (klicks >= 5) {
      const t = testEinstellungen();
      schreibeJSON(TEST_KEY, { aktiv: !t.aktiv, datum: t.aktiv ? null : t.datum });
      neuLaden();
    }
  });
}

zeigeSterneAnzeige(stand);
if (stand.name) document.getElementById("profil-name").textContent = stand.name;
document.getElementById("info").textContent = infoText();
if (sterneGesamt(stand) === MAX_STERNE) {
  const k = document.createElement("button");
  k.type = "button";
  k.className = "knopf zweitrangig feier-knopf";
  k.textContent = "Feier noch einmal ansehen";
  k.addEventListener("click", zeigeRettungsFeier);
  document.getElementById("info").append(" ", k);
}

// Geschichte: zugeklappt lassen, wenn man sie schon einmal zugeklappt hat
const story = document.getElementById("story");
if (leseJSON("matheAdvent.storyZu", false)) story.open = false;
story.addEventListener("toggle", () => schreibeJSON("matheAdvent.storyZu", !story.open));
baueSzene();
zeigeHeutigeTuerImSichtfeld();
geheimerTestZugang();
zeigeTestPanel({ positionsHelfer: true, feier: true });

const helfer = document.getElementById("pos-helfer");
if (helfer) {
  helfer.addEventListener("change", () => {
    positionsHelferAn = helfer.checked;
    if (positionsHelferAn) toast("Klicke ins Bild, um die Position eines Türchens zu ermitteln.", 4000);
  });
}

// Neue Badges auch hier feiern (z. B. nach Import eines Fortschritts-Codes)
zeigeBadgeFeier(pruefeNeueBadges(stand), () => pruefeRettung(stand));
