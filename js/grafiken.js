/* =========================================================
   GRAFIKEN UND TABELLEN zu den Aufgaben
   (übernommen aus dem Übungsheft „Winterwoche auf der Frostberg-Hütte“)
   In daten.js: grafiken: ["fahrt"] oder für Tabellen grafiken: ["T:schnee"]
   ========================================================= */
"use strict";

function plot(o) {
  const W = o.w || 400, H = o.h || 270, L = o.padL || 58, B = 44, T = 32, R = 18;
  const pw = W - L - R, ph = H - T - B;
  const X = (x) => L + (x - o.xmin) / (o.xmax - o.xmin) * pw;
  const Y = (y) => T + ph - (y - o.ymin) / (o.ymax - o.ymin) * ph;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria || "Diagramm"}">`;
  if (o.ticks !== false) {
    for (let x = o.xmin; x <= o.xmax + 1e-9; x += o.xstep) s += `<line class="grid" x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${T + ph}"/><text class="ts" x="${X(x)}" y="${T + ph + 15}" text-anchor="middle">${(o.xfmt || String)(x)}</text>`;
    for (let y = o.ymin; y <= o.ymax + 1e-9; y += o.ystep) s += `<line class="grid" x1="${L}" y1="${Y(y)}" x2="${L + pw}" y2="${Y(y)}"/><text class="ts" x="${L - 6}" y="${Y(y) + 4}" text-anchor="end">${(o.yfmt || String)(y)}</text>`;
  }
  s += `<line class="ln" x1="${L}" y1="${T + ph}" x2="${L + pw + 8}" y2="${T + ph}"/><line class="ln" x1="${L}" y1="${T + ph}" x2="${L}" y2="${T - 6}"/>`;
  // Achsenbeschriftung neben die Achsen: x unter die Zahlen, y über die Pfeilspitze
  s += `<text class="t" x="${L + pw + 8}" y="${T + ph + 34}" text-anchor="end">${o.xlabel}</text><text class="t" x="${Math.max(4, L - 30)}" y="${T - 14}">${o.ylabel}</text>`;
  (o.curves || []).forEach((c) => {
    let pts = c.pts;
    if (c.fn) {
      pts = [];
      const a = c.from ?? o.xmin, b = c.to ?? o.xmax;
      for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; pts.push([x, c.fn(x)]); }
    }
    s += `<polyline class="${c.cls || "acc"}" points="${pts.map((p) => X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join(" ")}"/>`;
    if (c.label) { const p = c.labelAt; s += `<text class="${c.labelCls || "ta"}" x="${X(p[0])}" y="${Y(p[1])}">${c.label}</text>`; }
  });
  (o.extra || []).forEach((e) => (s += e(X, Y)));
  return s + `</svg>`;
}

const GRAFIKEN = {
fahrt: () => plot({aria:"Weg-Zeit-Diagramm der Fahrt des Lieferwagens",xmin:0,xmax:4,xstep:.5,ymin:0,ymax:280,ystep:40,
  xfmt:(x)=>String(x).replace(".",","),xlabel:"Zeit in h",ylabel:"Strecke in km",
  curves:[{pts:[[0,0],[2,160],[2.5,160],[4,280]]}],
  extra:[(X,Y)=>`<circle class="dot" cx="${X(2)}" cy="${Y(160)}" r="3"/><circle class="dot" cx="${X(2.5)}" cy="${Y(160)}" r="3"/><circle class="dot" cx="${X(4)}" cy="${Y(280)}" r="3"/><text class="ts" x="${X(2.25)}" y="${Y(160)-8}" text-anchor="middle">Pause</text>`]}),

dach: () => `<svg viewBox="0 0 360 210" role="img" aria-label="Querschnitt des Chalets mit Satteldach">
  <rect class="ice" x="60" y="120" width="240" height="70"/>
  <rect class="paper" x="160" y="140" width="40" height="50"/>
  <polygon class="ice2" points="60,120 180,30 300,120"/>
  <path d="M54,118 L180,22 L306,118" stroke="var(--paper)" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M60,120 L180,30 L300,120" class="ln"/>
  <path d="M60,120 L180,30" class="acc" style="stroke-width:4"/>
  <line class="dash" x1="180" y1="30" x2="180" y2="120"/>
  <line class="dash" x1="60" y1="120" x2="300" y2="120"/>
  <polyline class="lt" points="168,120 168,108 180,108"/>
  <text class="t" x="188" y="82">3 m</text>
  <text class="t" x="230" y="114">8 m</text>
  <text class="ta" x="104" y="68">s</text>
  <text class="ts" x="180" y="205" text-anchor="middle">Querschnitt (vorne)</text></svg>`,

baum: () => {
  const n = (x,y,c,l) => `<circle class="${c}" cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y+4.5}" text-anchor="middle" style="fill:#15233a;font:700 13px var(--f-body)">${l}</text>`;
  const e = (x1,y1,x2,y2) => `<line class="lt" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  let s = `<svg viewBox="0 0 420 350" role="img" aria-label="Baumdiagramm Christbaumkugeln">`;
  const L1 = [[50,"gold","G"],[165,"redc","R"],[280,"silver","S"]];
  const kids = {G:[["redc","R"],["silver","S"]],R:[["gold","G"],["redc","R"],["silver","S"]],S:[["gold","G"],["redc","R"],["silver","S"]]};
  const lt = {G:"1/8",R:"3/8",S:"4/8"};
  s += `<circle class="dot" cx="24" cy="165" r="4"/>`;
  L1.forEach(([y,c,l]) => {
    s += e(28,165,147,y);
    s += `<text class="ta" x="${(28+147)/2}" y="${(165+y)/2-6}" text-anchor="middle">${lt[l]}</text>`;
    const ks = kids[l], gap = 36, start = y - gap*(ks.length-1)/2;
    ks.forEach(([kc,kl],i) => { const ky = start + i*gap; s += e(173,y,322,ky) + n(335,ky,kc,kl); });
    s += n(160,y,c,l);
  });
  s += `<text class="ts" x="160" y="345" text-anchor="middle">1. Zug</text><text class="ts" x="335" y="345" text-anchor="middle">2. Zug</text></svg>`;
  return s;
},

rodelA: () => `<svg viewBox="0 0 360 180" role="img" aria-label="Rodelhang als rechtwinkliges Dreieck">
  <polygon class="ice" points="30,140 320,140 320,86"/>
  <path d="M30,140 L320,86" stroke="var(--paper)" stroke-width="5" fill="none"/>
  <path d="M30,140 L320,86" class="ln"/>
  <polyline class="lt" points="308,140 308,128 320,128"/>
  <path d="M80,140 A50,50 0 0 0 79,131" class="acc"/>
  <text class="ta" x="88" y="136">α</text>
  <text class="t" x="175" y="160" text-anchor="middle">160 m (waagerecht)</text>
  <text class="t" x="326" y="118">30 m</text>
  <text class="ts" x="150" y="98" transform="rotate(-10.5 150 98)">Rodelbahn</text>
  <text class="ts" x="180" y="176" text-anchor="middle">Aufgabe 1 · nicht maßstabsgetreu</text></svg>`,

rodelB: () => `<svg viewBox="0 0 360 190" role="img" aria-label="Rodelbahn mit Kurve, Dreieck ABC">
  <polyline class="acc2" points="30,40 170,150 330,60"/>
  <line class="dash" x1="30" y1="40" x2="330" y2="60"/>
  <circle class="dot" cx="30" cy="40" r="4"/><circle class="dot" cx="170" cy="150" r="4"/><circle class="dot" cx="330" cy="60" r="4"/>
  <text class="t" x="20" y="30">A Start</text><text class="t" x="163" y="172">B Kurve</text><text class="t" x="300" y="50">C Ziel</text>
  <text class="t" x="70" y="110">120 m</text><text class="t" x="262" y="118">90 m</text>
  <path d="M153,137 A22,22 0 0 0 189,139" class="acc"/>
  <text class="ta" x="156" y="128">130°</text>
  <text class="ts" x="180" y="186" text-anchor="middle">Aufgabe 2 · nicht maßstabsgetreu</text></svg>`,

eis: () => `<svg viewBox="0 0 260 215" role="img" aria-label="Eiswürfel mit Schnittfläche">
  <polygon class="ice2" points="40,60 90,20 210,20 160,60"/>
  <polygon class="ice2" points="160,60 210,20 210,140 160,180"/>
  <rect class="ice" x="40" y="60" width="120" height="120"/>
  <line class="acc" x1="100" y1="60" x2="100" y2="180" stroke-dasharray="6 4"/>
  <line class="acc" x1="100" y1="60" x2="150" y2="20" stroke-dasharray="6 4"/>
  <text class="t" x="100" y="200" text-anchor="middle">40 cm</text>
  <text class="t" x="196" y="174">40 cm</text>
  <text class="ta" x="104" y="122">Schnitt</text></svg>`,

flocke: () => {
  const c = [130,118], R = 90; let p = [], s = `<svg viewBox="0 0 320 235" role="img" aria-label="Regelmäßiges Sechseck mit Schneeflocke, ein Innenwinkel ist markiert">`;
  for (let i = 0; i < 6; i++) { const a = Math.PI/3*i; p.push([c[0]+R*Math.cos(a), c[1]-R*Math.sin(a)]); }
  s += `<polygon class="ice" points="${p.map((q)=>q.map((v)=>v.toFixed(1)).join(",")).join(" ")}"/>`;
  for (let i = 0; i < 6; i++) {
    const a = Math.PI/3*i + Math.PI/6, ex = c[0]+66*Math.cos(a), ey = c[1]-66*Math.sin(a);
    s += `<line class="acc" x1="${c[0]}" y1="${c[1]}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>`;
    [0.45,0.7].forEach((t) => {
      const bx = c[0]+66*t*Math.cos(a), by = c[1]-66*t*Math.sin(a);
      [-1,1].forEach((sg) => { const b = a+sg*0.7; s += `<line class="acc" x1="${bx.toFixed(1)}" y1="${by.toFixed(1)}" x2="${(bx+16*Math.cos(b)).toFixed(1)}" y2="${(by-16*Math.sin(b)).toFixed(1)}"/>`; });
    });
  }
  // Innenwinkel an der rechten Ecke p[0]: zwischen den Richtungen zu p[1] und p[5]
  const ex = p[0][0], ey = p[0][1], rw = 30;
  const a1 = Math.atan2(p[1][1] - ey, p[1][0] - ex), a2 = Math.atan2(p[5][1] - ey, p[5][0] - ex);
  s += `<path d="M${ex},${ey} L${(ex + rw * Math.cos(a1)).toFixed(1)},${(ey + rw * Math.sin(a1)).toFixed(1)} A${rw},${rw} 0 0 0 ${(ex + rw * Math.cos(a2)).toFixed(1)},${(ey + rw * Math.sin(a2)).toFixed(1)} Z" class="acc2" style="fill:var(--accent-soft)"/>`;
  s += `<text class="ta" x="${ex + 8}" y="${ey + 5}" style="fill:var(--pine)">Innenwinkel</text>`;
  s += `<text class="t" x="130" y="228" text-anchor="middle">a = 10 cm</text></svg>`;
  return s;
},

schatten: () => `<svg viewBox="0 0 310 220" role="img" aria-label="Tanne und Lutz mit Schatten"><g transform="translate(22 0)">
  <line class="ln" x1="-22" y1="170" x2="288" y2="170"/>
  <rect x="36" y="150" width="8" height="20" class="red"/>
  <polygon class="pine" points="40,30 12,150 68,150"/>
  <line class="dash" x1="22" y1="16.5" x2="227" y2="170"/>
  <line class="acc" x1="40" y1="170" x2="227" y2="170"/>
  <circle cx="115" cy="93" r="7" class="paper"/>
  <path d="M115,100 L115,140 M115,140 L108,170 M115,140 L122,170 M115,112 L105,128 M115,112 L125,128" class="ln"/>
  <text class="t" x="-20" y="104">3 m</text>
  <text class="t" x="126" y="138">1,80 m</text>
  <line class="lt" x1="40" y1="190" x2="227" y2="190"/><line class="lt" x1="40" y1="184" x2="40" y2="196"/><line class="lt" x1="227" y1="184" x2="227" y2="196"/>
  <text class="t" x="133" y="207" text-anchor="middle">4 m (Schatten der Tanne)</text>
  <path d="M197,170 A30,30 0 0 1 203,152" class="acc"/>
  <text class="ta" x="180" y="162">α</text>
  <text class="ts" x="236" y="148">Sonnen-</text><text class="ts" x="236" y="160">strahl</text></g></svg>`,

tribuene: () => {
  let s = `<svg viewBox="0 0 360 215" role="img" aria-label="Sitzreihen der Tribüne an der Eisfläche">`;
  [[8,150,"Reihe 1"],[10,118,"Reihe 2"],[12,86,"Reihe 3"]].forEach(([n,y,l]) => {
    const x0 = 200-(n-1)*10;
    for (let i = 0; i < n; i++) s += `<circle class="${i%2?"redc":"ice2"}" cx="${x0+i*20}" cy="${y}" r="7"/>`;
    s += `<text class="ts" x="8" y="${y+4}">${l}</text>`;
  });
  s += `<text class="t" x="200" y="56" text-anchor="middle">⋮</text><text class="ts" x="8" y="56">usw.</text>`;
  s += `<rect class="ice" x="70" y="172" width="260" height="32" rx="14"/><text class="ts" x="200" y="192" text-anchor="middle">Eisfläche</text></svg>`;
  return s;
},

huegel: () => plot({aria:"Profil des Schneehügels als Parabel",ticks:false,xmin:0,xmax:18,ymin:0,ymax:4,xlabel:"x in m",ylabel:"h(x) in m",
  curves:[{fn:(x)=>-0.05*x*x+0.8*x,from:0,to:16,cls:"acc"}],
  extra:[(X,Y)=>`<text class="ts" x="${X(9)}" y="${Y(1.2)}" text-anchor="middle">Schneehügel</text><text class="ts" x="${X(16)}" y="${Y(0)-6}" text-anchor="middle">?</text><text class="ts" x="${X(8)}" y="${Y(3.2)-8}" text-anchor="middle">?</text>`]}),

kerze: () => `<svg viewBox="0 0 330 210" role="img" aria-label="Wachszylinder und Kugelkerze">
  <path d="M35,40 L35,170 A45,12 0 0 0 125,170 L125,40" class="ice"/>
  <ellipse class="ice2" cx="80" cy="40" rx="45" ry="12"/>
  <line class="ln" x1="80" y1="40" x2="80" y2="22"/><path d="M80,22 q-5,-8 0,-14 q5,6 0,14" class="red"/>
  <line class="acc" x1="80" y1="40" x2="125" y2="40"/><text class="ta" x="46" y="70">r = 3 cm</text>
  <line class="lt" x1="140" y1="40" x2="140" y2="170"/><text class="t" x="146" y="110">h = 8 cm</text>
  <circle class="ice" cx="260" cy="120" r="30"/><ellipse class="dash" cx="260" cy="120" rx="30" ry="8"/>
  <line class="acc" x1="260" y1="120" x2="290" y2="120"/><text class="ta" x="240" y="174">r = 2 cm</text>
  <text class="ts" x="80" y="202" text-anchor="middle">Wachszylinder</text><text class="ts" x="260" y="202" text-anchor="middle">Kugelkerze</text></svg>`,

see: () => `<svg viewBox="0 0 400 210" role="img" aria-label="Aussichtsturm am zugefrorenen See mit Höhenwinkeln">
  <rect class="ice" x="150" y="170" width="220" height="14"/>
  <text class="ts" x="260" y="181" text-anchor="middle">zugefrorener See</text>
  <line class="ln" x1="0" y1="170" x2="400" y2="170"/>
  <rect class="paper" x="30" y="40" width="20" height="130"/>
  <polygon class="red" points="26,40 40,22 54,40"/>
  <line class="ln" x1="40" y1="40" x2="150" y2="170"/>
  <line class="ln" x1="40" y1="40" x2="370" y2="170"/>
  <path d="M120,170 A30,30 0 0 1 130.6,147.1" class="acc"/><text class="ta" x="96" y="165">32°</text>
  <path d="M320,170 A50,50 0 0 1 323.5,151.7" class="acc2"/><text class="t" x="298" y="165" style="fill:var(--pine);font-weight:700">8°</text>
  <text class="t" x="2" y="110">20 m</text>
  <circle class="dot" cx="150" cy="170" r="3.5"/><text class="t" x="150" y="202" text-anchor="middle">Ben</text>
  <circle class="dot" cx="370" cy="170" r="3.5"/><text class="t" x="370" y="202" text-anchor="middle">Mira</text></svg>`,

kalender: () => {
  let s = `<svg viewBox="0 0 300 210" role="img" aria-label="Adventskalender mit 24 Türchen und Figur">`;
  const hl = [2,3,8];
  for (let i = 0; i < 24; i++) {
    const c = i%6, r = Math.floor(i/6), x = 12+c*46, y = 12+r*46, n = i+1;
    s += `<rect class="${hl.includes(n)?"hl":"ice"}" x="${x}" y="${y}" width="42" height="42" rx="3"/><text class="t" x="${x+21}" y="${y+26}" text-anchor="middle" style="font-weight:700">${n}</text>`;
  }
  s += `<text class="ts" x="150" y="204" text-anchor="middle">Beispiel: Figur auf 2, 3 und 8 → Summe 13</text></svg>`;
  return s;
},

frosti: () => plot({aria:"Kosten- und Erlösfunktion",xmin:0,xmax:4000,xstep:500,ymin:0,ymax:400000,ystep:50000,padL:64,
  xfmt:(x)=>x?x.toLocaleString("de-DE"):"0",yfmt:(y)=>y?(y/1000)+" T":"0",xlabel:"Stückzahl x",ylabel:"Euro (T = Tausend)",
  curves:[{fn:(x)=>80*x+60000,cls:"acc2",label:"k",labelAt:[3550,370000],labelCls:"t"},{fn:(x)=>0.1*x*(4000-x),cls:"acc",label:"e",labelAt:[1250,300000]}]}),

kreisel: () => `<svg viewBox="0 0 330 200" role="img" aria-label="Holzquader und kegelförmiger Kreisel">
  <polygon class="ice2" points="30,80 70,50 170,50 130,80"/>
  <polygon class="ice2" points="130,80 170,50 170,120 130,150"/>
  <rect class="ice" x="30" y="80" width="100" height="70"/>
  <text class="t" x="80" y="170" text-anchor="middle">6 cm</text><text class="t" x="156" y="148">6 cm</text><text class="t" x="0" y="120">4 cm</text>
  <path d="M190,50 L240,150 L290,50" class="ice"/>
  <ellipse class="ice2" cx="240" cy="50" rx="50" ry="12"/>
  <line class="dash" x1="240" y1="50" x2="240" y2="150"/>
  <line class="lt" x1="190" y1="28" x2="290" y2="28"/><text class="t" x="240" y="22" text-anchor="middle">d = 6 cm</text>
  <text class="t" x="245" y="112">h</text>
  <text class="ta" x="271" y="96">s</text>
  <text class="ts" x="80" y="192" text-anchor="middle">Holzquader</text><text class="ts" x="240" y="192" text-anchor="middle">unterer Teil des Kreisels</text></svg>`,

saeule: () => `<svg viewBox="0 0 340 230" role="img" aria-label="Litfaßsäule und Plakat">
  <path d="M60,40 L60,190 A50,10 0 0 0 160,190 L160,40" class="ice"/>
  <polygon class="red" points="52,40 110,8 168,40"/>
  <ellipse class="ice2" cx="110" cy="40" rx="50" ry="8"/>
  <rect class="paper" x="70" y="72" width="26" height="40"/><rect class="paper" x="104" y="72" width="26" height="40"/>
  <rect class="paper" x="70" y="122" width="26" height="40"/><rect class="paper" x="104" y="122" width="26" height="40"/>
  <line class="lt" x1="172" y1="60" x2="172" y2="180"/><line class="lt" x1="166" y1="60" x2="178" y2="60"/><line class="lt" x1="166" y1="180" x2="178" y2="180"/>
  <text class="t" x="176" y="124">2,60 m</text>
  <line class="dash" x1="60" y1="60" x2="160" y2="60"/><line class="dash" x1="60" y1="180" x2="160" y2="180"/>
  <text class="t" x="110" y="218" text-anchor="middle">d = 1,20 m</text>
  <rect class="paper" x="245" y="60" width="60" height="85"/>
  <text class="ts" x="275" y="106" text-anchor="middle">Plakat</text>
  <text class="t" x="275" y="162" text-anchor="middle">84,1 cm</text>
  <text class="t" x="310" y="106" transform="rotate(90 310 106)" text-anchor="middle">118,9 cm</text></svg>`,
};

const TABELLEN = {
eiszapfen: `<table class="sheet"><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr>
<tr><th>1</th><td class="lab">Fallzeit in s</td><td>0,5</td><td>1</td><td>1,5</td><td>2</td></tr>
<tr><th>2</th><td class="lab">Fallstrecke in m</td><td>1,25</td><td class="q">?</td><td class="q">?</td><td class="q">?</td></tr></table>`,
wuerfel: `<table class="sheet"><tr><th>Augenzahl</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Summe</th></tr>
<tr><td class="lab">absolute Häufigkeit</td><td>55</td><td>58</td><td>88</td><td>75</td><td>110</td><td class="q">?</td><td>500</td></tr></table>`,
schnee: `<table class="sheet"><tr><th>Tag</th><th>Mo</th><th>Di</th><th>Mi</th><th>Do</th><th>Fr</th><th>Sa</th><th>So</th></tr>
<tr><td class="lab">Neuschnee in cm</td><td>5</td><td>20</td><td>15</td><td>10</td><td>12</td><td>15</td><td>21</td></tr></table>`,
};

function grafikHtml(schluessel) {
  if (schluessel.startsWith("T:")) return `<div class="tbl">${TABELLEN[schluessel.slice(2)] || ""}</div>`;
  return GRAFIKEN[schluessel] ? GRAFIKEN[schluessel]() : "";
}
