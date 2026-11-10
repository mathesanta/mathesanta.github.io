/* =========================================================
   WISSENSDATENBANK – kleine Artikel zu den MSA-Themen
   Orientiert an den Inhalten der MSA-Formelsammlung Mathematik.

   Felder eines Artikels:
     id:         Kennung für Links, z. B. wissen.html#pythagoras
                 (in daten.js: [[pythagoras|Satz des Pythagoras]])
     bereich:    "rechengesetze", "funktionen", "trigonometrie", "koerper", "wahrscheinlichkeit"
                 (die Bereiche stehen in js/app.js unter WISSEN_BEREICHE)
     titel:      Überschrift
     stichworte: zusätzliche Suchbegriffe
     inhalt:     HTML mit Formeln zwischen $...$ (Backslashes doppelt: \\frac)
                 <div class="formel"> für Formeln, <div class="beispiel"> für Beispiele
   ========================================================= */

const WISSEN = [
  /* ===================== ALLGEMEINE RECHENGESETZE ===================== */
  {
    id: "plus-minus", bereich: "rechengesetze",
    titel: "Plus und Minus am Zahlenstrahl",
    stichworte: "addieren subtrahieren negative Zahlen ganze Zahlen Zahlenstrahl Vorzeichen",
    inhalt: `
      <p>Auf dem Zahlenstrahl liegen die negativen Zahlen links von der 0, die positiven rechts davon.</p>
      <ul>
        <li><b>Plus</b> einer positiven Zahl: Du gehst nach <b>rechts</b>.</li>
        <li><b>Minus</b> einer positiven Zahl: Du gehst nach <b>links</b>.</li>
      </ul>
      <svg viewBox="0 0 420 132" role="img" aria-label="Zahlenstrahl von minus 5 bis 5. Von minus 2 aus geht ein Pfeil 5 Schritte nach rechts zu 3, darunter ein Pfeil von 1 aus 4 Schritte nach links zu minus 3.">
        <line x1="10" y1="50" x2="410" y2="50" stroke="#15233a" stroke-width="2"/>
        <polygon points="410,50 400,45 400,55" fill="#15233a"/>
        ${[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((z) => `<line x1="${210 + z * 36}" y1="44" x2="${210 + z * 36}" y2="56" stroke="#15233a" stroke-width="${z === 0 ? 3 : 1.5}"/><text x="${210 + z * 36}" y="74" text-anchor="middle" font-size="13" fill="#15233a">${z}</text>`).join("")}
        <path d="M138,40 Q228,4 318,40" fill="none" stroke="#1e7a46" stroke-width="2.5"/><polygon points="318,40 307,36 312,46" fill="#1e7a46"/>
        <text x="228" y="16" text-anchor="middle" font-size="12" fill="#1e7a46">−2 + 5 = 3</text>
        <path d="M246,84 Q174,116 102,84" fill="none" stroke="#c8372d" stroke-width="2.5"/><polygon points="102,84 113,86 108,77" fill="#c8372d"/>
        <text x="174" y="126" text-anchor="middle" font-size="12" fill="#c8372d">1 − 4 = −3</text>
      </svg>
      <p>Eine negative Zahl abzuziehen ist dasselbe, wie die positive Zahl zu addieren. Eine negative Zahl zu addieren ist dasselbe, wie sie abzuziehen:</p>
      <div class="formel">$a - (-b) = a + b \\qquad a + (-b) = a - b$</div>
      <div class="beispiel"><b>Beispiele:</b> $-7 + 3 = -4$<br>$4 - 9 = -5$<br>$-2 - (-6) = -2 + 6 = 4$</div>`,
  },
  {
    id: "vorzeichen", bereich: "rechengesetze",
    titel: "Mal und Geteilt mit negativen Zahlen",
    stichworte: "multiplizieren dividieren Vorzeichenregel minus mal minus",
    inhalt: `
      <p>Beim Multiplizieren und Dividieren rechnest du erst mit den Zahlen ohne Vorzeichen und bestimmst danach das Vorzeichen:</p>
      <table>
        <tr><th>Vorzeichen</th><th>Ergebnis</th><th>Beispiel</th></tr>
        <tr><td>plus · plus</td><td>plus</td><td>$3 \\cdot 4 = 12$</td></tr>
        <tr><td>minus · minus</td><td>plus</td><td>$(-3) \\cdot (-4) = 12$</td></tr>
        <tr><td>plus · minus</td><td>minus</td><td>$3 \\cdot (-4) = -12$</td></tr>
        <tr><td>minus · plus</td><td>minus</td><td>$(-12) : 4 = -3$</td></tr>
      </table>
      <p>Merkregel: <b>Gleiche Vorzeichen ergeben plus, verschiedene Vorzeichen ergeben minus.</b> Bei mehreren Faktoren zählst du die Minuszeichen: Ist ihre Anzahl gerade, ist das Ergebnis positiv.</p>
      <div class="beispiel"><b>Beispiel:</b> $(-2) \\cdot (-5) \\cdot (-1) = -10$, denn es sind drei Minuszeichen.</div>`,
  },
  {
    id: "rechenreihenfolge", bereich: "rechengesetze",
    titel: "Rechenreihenfolge: Klammer, Potenz, Punkt vor Strich",
    stichworte: "Punktrechnung Strichrechnung Klammern Reihenfolge KlaPoPuStri",
    inhalt: `
      <p>Gerechnet wird in dieser Reihenfolge:</p>
      <ol><li>Klammern</li><li>Potenzen und Wurzeln</li><li>Punktrechnung (· und :)</li><li>Strichrechnung (+ und −)</li></ol>
      <p>Bei gleichrangigen Rechenarten rechnest du von links nach rechts.</p>
      <div class="beispiel"><b>Beispiel:</b> $2 + 3 \\cdot 4^2 = 2 + 3 \\cdot 16 = 2 + 48 = 50$, aber $(2 + 3) \\cdot 4^2 = 5 \\cdot 16 = 80$.</div>`,
  },
  {
    id: "brueche", bereich: "rechengesetze",
    titel: "Bruchrechnung",
    stichworte: "Bruch Zähler Nenner kürzen erweitern Hauptnenner Kehrwert",
    inhalt: `
      <p>Ein Bruch $\\frac{a}{b}$ hat den Zähler $a$ (oben) und den Nenner $b$ (unten).</p>
      <p><b>Kürzen und Erweitern:</b> Zähler und Nenner werden durch dieselbe Zahl geteilt bzw. mit derselben Zahl multipliziert. Der Wert bleibt gleich: $\\frac{6}{8} = \\frac{3}{4}$.</p>
      <p><b>Addieren und Subtrahieren:</b> Erst auf einen gemeinsamen Nenner bringen, dann die Zähler verrechnen.</p>
      <div class="formel">$\\frac{1}{4} + \\frac{2}{3} = \\frac{3}{12} + \\frac{8}{12} = \\frac{11}{12}$</div>
      <p><b>Multiplizieren:</b> Zähler mal Zähler, Nenner mal Nenner.</p>
      <div class="formel">$\\frac{2}{3} \\cdot \\frac{4}{5} = \\frac{8}{15}$</div>
      <p><b>Dividieren:</b> Mit dem Kehrwert des zweiten Bruchs multiplizieren.</p>
      <div class="formel">$\\frac{2}{3} : \\frac{4}{5} = \\frac{2}{3} \\cdot \\frac{5}{4} = \\frac{10}{12} = \\frac{5}{6}$</div>
      <div class="beispiel"><b>Tipp:</b> Ein Bruch ist auch eine Division: $\\frac{3}{4} = 3 : 4 = 0{,}75$.</div>`,
  },
  {
    id: "potenzen", bereich: "rechengesetze",
    titel: "Potenzen",
    stichworte: "hoch Exponent Basis Quadratzahl Zehnerpotenz Potenzgesetze",
    inhalt: `
      <p>Eine Potenz ist eine Kurzschreibweise für ein Produkt aus gleichen Faktoren: $a^n = a \\cdot a \\cdot \\ldots \\cdot a$ (n Faktoren). $a$ heißt Basis, $n$ Exponent.</p>
      <div class="beispiel"><b>Beispiele:</b> $2^5 = 32$<br>$10^3 = 1000$<br>$(-3)^2 = 9$, aber $-3^2 = -9$</div>
      <p><b>Besondere Potenzen:</b> $a^1 = a$, $a^0 = 1$ und $a^{-n} = \\frac{1}{a^n}$, z. B. $10^{-2} = 0{,}01$.</p>
      <p><b>Potenzgesetze</b> (gleiche Basis bzw. gleicher Exponent):</p>
      <div class="formel">$a^m \\cdot a^n = a^{m+n} \\qquad a^m : a^n = a^{m-n} \\qquad (a^m)^n = a^{m \\cdot n} \\qquad a^n \\cdot b^n = (a \\cdot b)^n$</div>`,
  },
  {
    id: "wurzeln", bereich: "rechengesetze",
    titel: "Wurzeln",
    stichworte: "Quadratwurzel Wurzel ziehen Kubikwurzel radizieren",
    inhalt: `
      <p>Die Quadratwurzel $\\sqrt{a}$ ist die nicht-negative Zahl, die mit sich selbst multipliziert $a$ ergibt. Wurzelziehen ist die Umkehrung des Quadrierens.</p>
      <div class="beispiel"><b>Beispiele:</b> $\\sqrt{49} = 7$, denn $7 \\cdot 7 = 49$<br>$\\sqrt{2{,}25} = 1{,}5$<br>$\\sqrt[3]{64} = 4$, denn $4^3 = 64$</div>
      <p>Aus negativen Zahlen kann man keine Quadratwurzel ziehen. Die Gleichung $x^2 = 25$ hat aber zwei Lösungen: $x = 5$ und $x = -5$.</p>
      <p><b>Rechenregeln:</b></p>
      <div class="formel">$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{a \\cdot b} \\qquad \\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}} \\qquad \\sqrt{a^2} = a \\;(a \\ge 0)$</div>
      <p>Achtung: $\\sqrt{a + b}$ ist <b>nicht</b> $\\sqrt{a} + \\sqrt{b}$. Beispiel: $\\sqrt{9 + 16} = 5$, aber $3 + 4 = 7$.</p>
      <p>Die wichtigsten Quadratzahlen: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.</p>`,
  },
  {
    id: "prozent", bereich: "rechengesetze",
    titel: "Prozentrechnung",
    stichworte: "Prozent Grundwert Prozentwert Prozentsatz Hundertstel Rabatt",
    inhalt: `
      <p>Prozent heißt „von Hundert“: $1\\,\\% = \\frac{1}{100} = 0{,}01$.</p>
      <ul>
        <li><b>Grundwert G:</b> das Ganze (100 %)</li>
        <li><b>Prozentwert W:</b> der Anteil</li>
        <li><b>Prozentsatz p %:</b> der Anteil in Prozent</li>
      </ul>
      <div class="formel">$W = G \\cdot \\frac{p}{100} \\qquad G = \\frac{W \\cdot 100}{p} \\qquad p = \\frac{W}{G} \\cdot 100$</div>
      <div class="beispiel"><b>Beispiel:</b> 15 % von 80 € sind $80 \\cdot 0{,}15 = 12$ €. 12 von 48 Schülern sind $\\frac{12}{48} = 0{,}25 = 25\\,\\%$.</div>
      <p class="siehe">Siehe auch: [[prozent-faktor|Wachstumsfaktor]]</p>`,
  },
  {
    id: "prozent-faktor", bereich: "rechengesetze",
    titel: "Wachstumsfaktor: Prozente nacheinander",
    stichworte: "Zunahme Abnahme Erhöhung Rabatt Faktor Zinsen Zinseszins",
    inhalt: `
      <p>Eine Änderung um p % lässt sich mit einem Faktor rechnen:</p>
      <ul>
        <li>Zunahme um p %: mal $\\left(1 + \\frac{p}{100}\\right)$, z. B. +15 % → · 1,15</li>
        <li>Abnahme um p %: mal $\\left(1 - \\frac{p}{100}\\right)$, z. B. −10 % → · 0,90</li>
      </ul>
      <p>Mehrere Änderungen nacheinander werden <b>multipliziert</b>, nicht addiert.</p>
      <div class="beispiel"><b>Beispiel:</b> Ein Preis steigt um 15 % und sinkt dann um 10 %: $1{,}15 \\cdot 0{,}9 = 1{,}035$. Insgesamt ist das eine Erhöhung um 3,5 %, nicht um 5 %.</div>
      <p><b>Zinseszins:</b> Ein Kapital $K_0$ wächst bei p % Zinsen in n Jahren auf $K_n = K_0 \\cdot \\left(1 + \\frac{p}{100}\\right)^n$.</p>`,
  },
  {
    id: "proportional", bereich: "rechengesetze",
    titel: "Proportionale Zuordnung und Dreisatz",
    stichworte: "proportional je mehr desto mehr Dreisatz Quotientengleichheit Ursprungsgerade",
    inhalt: `
      <p>Bei einer proportionalen Zuordnung gilt: <b>Das Doppelte</b> der einen Größe gehört zum <b>Doppelten</b> der anderen. Der Quotient $\\frac{y}{x}$ ist immer gleich. Der Graph ist eine Gerade durch den Ursprung.</p>
      <p><b>Dreisatz:</b> Erst auf eine Einheit zurückrechnen, dann auf die gesuchte Menge.</p>
      <div class="beispiel"><b>Beispiel:</b> 12 Paar Skier kosten 144 €. 1 Paar kostet $144 : 12 = 12$ €. 7 Paar kosten $7 \\cdot 12 = 84$ €.</div>`,
  },
  {
    id: "antiproportional", bereich: "rechengesetze",
    titel: "Antiproportionale Zuordnung",
    stichworte: "antiproportional umgekehrt proportional je mehr desto weniger Produktgleichheit Arbeiter",
    inhalt: `
      <p>Bei einer antiproportionalen Zuordnung gilt: Zum <b>Doppelten</b> der einen Größe gehört die <b>Hälfte</b> der anderen. Das Produkt $x \\cdot y$ ist immer gleich.</p>
      <p>Typisch: Mehr Helfer brauchen weniger Zeit, mehr Personen bekommen kleinere Anteile.</p>
      <div class="beispiel"><b>Beispiel:</b> 15 Helfer brauchen 100 min. Die gesamte Arbeit ist $15 \\cdot 100 = 1500$ Helfer-Minuten. 60 Helfer brauchen $1500 : 60 = 25$ min.</div>`,
  },
  {
    id: "terme", bereich: "rechengesetze",
    titel: "Terme aufstellen und vereinfachen",
    stichworte: "Term Variable Muster Folge zusammenfassen ausmultiplizieren ausklammern binomische Formeln",
    inhalt: `
      <p>Ein Term ist ein Rechenausdruck mit Zahlen und Variablen, z. B. $6 + 2n$. Setzt man für die Variable eine Zahl ein, erhält man einen Wert.</p>
      <p><b>Muster beschreiben:</b> Schau, was von Schritt zu Schritt dazukommt. Kommen immer 2 dazu, steht $2n$ im Term. Prüfe den Term mit n = 1.</p>
      <div class="beispiel"><b>Beispiel:</b> 8, 10, 12, … → $6 + 2n$, denn $6 + 2 \\cdot 1 = 8$, $6 + 2 \\cdot 2 = 10$.</div>
      <p><b>Ausmultiplizieren:</b> $a \\cdot (b + c) = ab + ac$. <b>Ausklammern</b> ist der umgekehrte Weg.</p>
      <p><b>Binomische Formeln:</b></p>
      <div class="formel">$(a + b)^2 = a^2 + 2ab + b^2 \\qquad (a - b)^2 = a^2 - 2ab + b^2 \\qquad (a + b)(a - b) = a^2 - b^2$</div>`,
  },
  {
    id: "gleichungen", bereich: "rechengesetze",
    titel: "Gleichungen lösen",
    stichworte: "Gleichung umformen Äquivalenzumformung nach x auflösen Probe",
    inhalt: `
      <p>Eine Gleichung bleibt richtig, wenn du auf <b>beiden Seiten dasselbe</b> tust: dieselbe Zahl addieren oder subtrahieren, mit derselben Zahl (nicht 0) multiplizieren oder dividieren.</p>
      <p>Ziel: Die Variable steht allein auf einer Seite.</p>
      <div class="beispiel"><b>Beispiel:</b> $3n + 7 = 40 \\;\\; | -7$ → $3n = 33 \\;\\; | :3$ → $n = 11$. Probe: $3 \\cdot 11 + 7 = 40$ ✓</div>
      <p><b>Mit Quadrat:</b> $5t^2 = 11{,}25 \\;\\; | :5$ → $t^2 = 2{,}25 \\;\\; | \\sqrt{\\;}$ → $t = 1{,}5$ (die negative Lösung $-1{,}5$ passt bei einer Zeit nicht).</p>
      <p class="siehe">Siehe auch: [[nullstellen|Quadratische Gleichungen]] · [[logarithmus|Exponentialgleichungen]]</p>`,
  },
  {
    id: "einheiten", bereich: "rechengesetze",
    titel: "Einheiten umrechnen",
    stichworte: "Längen Flächen Volumen Liter Masse Gramm Kilogramm Tonne Zeit Umrechnungszahl",
    inhalt: `
      <table>
        <tr><th>Größe</th><th>Umrechnung</th><th>Umrechnungszahl</th></tr>
        <tr><td>Länge</td><td>km – m – dm – cm – mm</td><td>1000 – 10 – 10 – 10</td></tr>
        <tr><td>Fläche</td><td>km² – ha – a – m² – dm² – cm² – mm²</td><td>100</td></tr>
        <tr><td>Volumen</td><td>m³ – dm³ – cm³ – mm³</td><td>1000</td></tr>
        <tr><td>Masse</td><td>t – kg – g – mg</td><td>1000</td></tr>
        <tr><td>Zeit</td><td>h – min – s</td><td>60</td></tr>
      </table>
      <p><b>Liter:</b> $1\\,\\text{l} = 1\\,\\text{dm}^3$ und $1\\,\\text{ml} = 1\\,\\text{cm}^3$.</p>
      <div class="beispiel"><b>Beispiele:</b> 40 cm = 4 dm<br>120 m² = 1,2 a<br>64 000 cm³ = 64 dm³ = 64 l<br>0,5 h = 30 min</div>`,
  },
  {
    id: "tabellenkalkulation", bereich: "rechengesetze",
    titel: "Tabellenkalkulation",
    stichworte: "Excel Zelle Formel Spalte Zeile Summe Bezug",
    inhalt: `
      <p>Jede Zelle hat eine Adresse aus Spalte (Buchstabe) und Zeile (Zahl), z. B. C2. Eine Formel beginnt immer mit <b>=</b>.</p>
      <table>
        <tr><th>Zeichen</th><th>Bedeutung</th></tr>
        <tr><td>+ und −</td><td>plus und minus</td></tr>
        <tr><td>*</td><td>mal</td></tr>
        <tr><td>/</td><td>geteilt</td></tr>
        <tr><td>^</td><td>hoch, z. B. =C1^2</td></tr>
        <tr><td>=SUMME(B2:F2)</td><td>Summe der Zellen von B2 bis F2</td></tr>
        <tr><td>=MITTELWERT(B2:F2)</td><td>arithmetisches Mittel</td></tr>
      </table>
      <div class="beispiel"><b>Beispiel:</b> In C1 steht die Fallzeit. Die Fallstrecke „Fallzeit zum Quadrat mal 5“ berechnet in C2 die Formel =C1*C1*5 oder =5*C1^2.</div>`,
  },

  /* ===================== FUNKTIONEN ===================== */
  {
    id: "graph-ablesen", bereich: "funktionen",
    titel: "Graphen ablesen",
    stichworte: "Diagramm Zuordnung Weg-Zeit Strecke Geschwindigkeit Durchschnittsgeschwindigkeit Achse Pause",
    inhalt: `
      <p>Ein Graph zeigt, wie eine Größe von einer anderen abhängt. Auf der <b>x-Achse</b> (waagerecht) steht meist die Zeit, auf der <b>y-Achse</b> (senkrecht) die abhängige Größe.</p>
      <p><b>Ablesen:</b> Gehe auf der x-Achse zum gewünschten Wert, dann senkrecht nach oben bis zum Graphen und von dort waagerecht zur y-Achse.</p>
      <p><b>Weg-Zeit-Diagramm:</b></p>
      <ul>
        <li>Steigt der Graph steil, ist die Geschwindigkeit hoch.</li>
        <li>Verläuft er <b>waagerecht</b>, ändert sich die Strecke nicht: Es ist eine Pause.</li>
      </ul>
      <div class="formel">$\\text{Durchschnittsgeschwindigkeit} = \\frac{\\text{gesamte Strecke}}{\\text{gesamte Zeit}}$</div>
      <div class="beispiel"><b>Beispiel:</b> 280 km in 4 h (mit Pause): $280 : 4 = 70$ km/h.</div>`,
  },
  {
    id: "lineare-funktion", bereich: "funktionen",
    titel: "Lineare Funktionen",
    stichworte: "Gerade Steigung y-Achsenabschnitt Startwert Steigungsdreieck mx+b",
    inhalt: `
      <div class="formel">$f(x) = m \\cdot x + b$</div>
      <ul>
        <li><b>m</b> ist die Steigung: So viel kommt pro Schritt nach rechts dazu (bei negativem m geht es bergab).</li>
        <li><b>b</b> ist der y-Achsenabschnitt: der Startwert bei x = 0.</li>
      </ul>
      <p>Der Graph ist eine Gerade. Die Steigung berechnest du aus zwei Punkten:</p>
      <div class="formel">$m = \\frac{y_2 - y_1}{x_2 - x_1}$</div>
      <div class="beispiel"><b>Beispiel:</b> Startwert 600 m², pro Stunde 250 m² mehr: $f(x) = 250x + 600$. Wann sind es 3500 m²? $250x + 600 = 3500$ → $x = 11{,}6$ h.</div>`,
  },
  {
    id: "quadratische-funktion", bereich: "funktionen",
    titel: "Quadratische Funktionen (Parabeln)",
    stichworte: "Parabel Normalparabel Normalform gestreckt gestaucht nach unten geöffnet",
    inhalt: `
      <p>Der Graph einer quadratischen Funktion ist eine Parabel.</p>
      <div class="formel">Normalform: $f(x) = ax^2 + bx + c \\qquad$ Scheitelpunktform: $f(x) = a(x - d)^2 + e$</div>
      <ul>
        <li>$a > 0$: nach oben geöffnet, $a < 0$: nach unten geöffnet.</li>
        <li>$|a| > 1$: schmaler (gestreckt), $|a| < 1$: breiter (gestaucht).</li>
        <li>c ist der Schnittpunkt mit der y-Achse.</li>
      </ul>
      <p class="siehe">Siehe auch: [[scheitelpunkt|Scheitelpunkt]] · [[nullstellen|Nullstellen]]</p>`,
  },
  {
    id: "scheitelpunkt", bereich: "funktionen",
    titel: "Scheitelpunkt berechnen",
    stichworte: "Scheitel Scheitelpunktform höchster Punkt tiefster Punkt Maximum Minimum quadratische Ergänzung",
    inhalt: `
      <p>Der Scheitelpunkt S ist der höchste bzw. tiefste Punkt der Parabel.</p>
      <p><b>Aus der Scheitelpunktform</b> $f(x) = a(x - d)^2 + e$ liest du ihn direkt ab: $S(d \\mid e)$. Achtung beim Vorzeichen: $(x + 3)^2$ bedeutet $d = -3$.</p>
      <p><b>Aus der Normalform</b> $f(x) = ax^2 + bx + c$:</p>
      <div class="formel">$x_S = -\\frac{b}{2a}$, danach $y_S = f(x_S)$ ausrechnen.</div>
      <div class="beispiel"><b>Beispiel:</b> $g(x) = -0{,}1x^2 + 320x - 60\\,000$: $x_S = -\\frac{320}{2 \\cdot (-0{,}1)} = 1600$, $g(1600) = 196\\,000$.</div>
      <p><b>Quadratische Ergänzung:</b> $x^2 + 6x + 10 = (x^2 + 6x + 9) + 1 = (x + 3)^2 + 1$, also $S(-3 \\mid 1)$.</p>
      <p>Hat die Parabel zwei Nullstellen, liegt der Scheitel genau in der Mitte zwischen ihnen.</p>`,
  },
  {
    id: "nullstellen", bereich: "funktionen",
    titel: "Nullstellen und quadratische Gleichungen",
    stichworte: "Nullstelle pq-Formel abc-Formel Mitternachtsformel ausklammern Satz vom Nullprodukt Schnittpunkt x-Achse",
    inhalt: `
      <p>Nullstellen sind die x-Werte, bei denen der Graph die x-Achse schneidet, also $f(x) = 0$.</p>
      <p><b>Ausklammern</b> (wenn c = 0): Ein Produkt ist null, wenn ein Faktor null ist.</p>
      <div class="beispiel"><b>Beispiel:</b> $-0{,}05x^2 + 0{,}8x = 0$ → $x(-0{,}05x + 0{,}8) = 0$ → $x_1 = 0$, $x_2 = 16$</div>
      <p><b>pq-Formel</b> für $x^2 + px + q = 0$ (vorher durch a teilen):</p>
      <div class="formel">$x_{1,2} = -\\frac{p}{2} \\pm \\sqrt{\\left(\\frac{p}{2}\\right)^2 - q}$</div>
      <p>Ist der Wert unter der Wurzel negativ, gibt es keine Nullstelle. Ist er null, gibt es genau eine.</p>`,
  },
  {
    id: "exponentialfunktion", bereich: "funktionen",
    titel: "Exponentielles Wachstum und exponentielle Abnahme",
    stichworte: "Exponentialfunktion Wachstumsfaktor Zerfall Abkühlung Halbwertszeit Verdopplungszeit",
    inhalt: `
      <div class="formel">$f(x) = a \\cdot b^x$</div>
      <ul>
        <li><b>a</b> ist der Anfangswert (bei x = 0).</li>
        <li><b>b</b> ist der Wachstumsfaktor: $b > 1$ Wachstum, $0 < b < 1$ Abnahme.</li>
      </ul>
      <p>Pro Schritt wird immer mit demselben Faktor multipliziert. Bei einer Abnahme um 10 % ist $b = 0{,}9$.</p>
      <div class="beispiel"><b>Beispiel:</b> Kakao mit 80 °C kühlt pro Minute um 10 % ab: $t(x) = 80 \\cdot 0{,}9^x$. Nach 3 Minuten: $80 \\cdot 0{,}9^3 \\approx 58{,}3$ °C.</div>
      <p><b>Halbwertszeit:</b> Zeit, bis nur noch die Hälfte des Anfangswerts übrig ist.</p>
      <p class="siehe">Siehe auch: [[logarithmus|Exponentialgleichungen lösen]] · [[prozent-faktor|Wachstumsfaktor]]</p>`,
  },
  {
    id: "logarithmus", bereich: "funktionen",
    titel: "Exponentialgleichungen lösen",
    stichworte: "Logarithmus log Exponent gesucht systematisches Probieren Halbwertszeit",
    inhalt: `
      <p>Steht die Unbekannte im Exponenten, hilft der Logarithmus:</p>
      <div class="formel">$b^x = c \\quad \\Rightarrow \\quad x = \\frac{\\log(c)}{\\log(b)}$</div>
      <div class="beispiel"><b>Beispiel:</b> $80 \\cdot 0{,}9^x = 40 \\;\\; | :80$ → $0{,}9^x = 0{,}5$ → $x = \\frac{\\log(0{,}5)}{\\log(0{,}9)} \\approx 6{,}6$</div>
      <p><b>Ohne Logarithmus:</b> Systematisch probieren, z. B. mit einer Wertetabelle: $0{,}9^6 \\approx 0{,}53$, $0{,}9^7 \\approx 0{,}48$ – die Lösung liegt also zwischen 6 und 7.</p>`,
  },
  {
    id: "kosten-erloes-gewinn", bereich: "funktionen",
    titel: "Kosten, Erlös und Gewinn",
    stichworte: "Kostenfunktion Erlösfunktion Gewinnfunktion Fixkosten Gewinnzone maximaler Gewinn",
    inhalt: `
      <ul>
        <li><b>Kosten k(x):</b> was die Herstellung von x Stück kostet (Fixkosten + Kosten pro Stück).</li>
        <li><b>Erlös e(x):</b> was der Verkauf einbringt.</li>
        <li><b>Gewinn g(x):</b> Erlös minus Kosten.</li>
      </ul>
      <div class="formel">$g(x) = e(x) - k(x)$</div>
      <p>Wichtig: Die Kostenfunktion in Klammern setzen, weil alle Kosten abgezogen werden.</p>
      <div class="beispiel"><b>Beispiel:</b> $g(x) = 0{,}1x(4000 - x) - (80x + 60\\,000) = -0{,}1x^2 + 320x - 60\\,000$. Der größte Gewinn liegt am [[scheitelpunkt|Scheitelpunkt]].</div>
      <p>Gewinn gibt es dort, wo der Graph von e über dem Graph von k liegt (Gewinnzone).</p>`,
  },

  /* ===================== TRIGONOMETRIE ===================== */
  {
    id: "rechtwinkliges-dreieck", bereich: "trigonometrie",
    titel: "Seiten im rechtwinkligen Dreieck",
    stichworte: "Hypotenuse Kathete Ankathete Gegenkathete rechter Winkel",
    inhalt: `
      <svg viewBox="0 0 320 180" role="img" aria-label="Rechtwinkliges Dreieck mit Winkel alpha links, rechter Winkel rechts unten. Die Hypotenuse liegt gegenüber dem rechten Winkel, die Ankathete liegt an alpha, die Gegenkathete gegenüber von alpha.">
        <polygon points="30,150 280,150 280,40" fill="#d9e9f6" stroke="#15233a" stroke-width="2"/>
        <polyline points="266,150 266,136 280,136" fill="none" stroke="#15233a"/>
        <path d="M80,150 A50,50 0 0 0 76,130" fill="none" stroke="#c8372d" stroke-width="2"/>
        <text x="86" y="142" font-size="15" fill="#c8372d" font-weight="700">α</text>
        <text x="155" y="170" text-anchor="middle" font-size="13" fill="#15233a">Ankathete von α</text>
        <text x="288" y="100" font-size="13" fill="#15233a">Gegen-</text><text x="288" y="115" font-size="13" fill="#15233a">kathete</text>
        <text x="140" y="82" font-size="13" fill="#15233a" transform="rotate(-23.7 140 82)">Hypotenuse</text>
      </svg>
      <ul>
        <li>Die <b>Hypotenuse</b> liegt dem rechten Winkel gegenüber. Sie ist die längste Seite.</li>
        <li>Die beiden anderen Seiten heißen <b>Katheten</b>.</li>
        <li>Vom Winkel α aus gesehen liegt die <b>Ankathete</b> an α an, die <b>Gegenkathete</b> liegt α gegenüber.</li>
      </ul>
      <p>Welche Kathete An- oder Gegenkathete ist, hängt vom Winkel ab, den du betrachtest.</p>`,
  },
  {
    id: "pythagoras", bereich: "trigonometrie",
    titel: "Satz des Pythagoras",
    stichworte: "Pythagoras a²+b²=c² Hypotenuse Kathete Diagonale Länge berechnen",
    inhalt: `
      <p>In jedem <b>rechtwinkligen</b> Dreieck gilt: Die Summe der Quadrate der Katheten ist gleich dem Quadrat der Hypotenuse.</p>
      <div class="formel">$a^2 + b^2 = c^2 \\qquad$ (c ist die Hypotenuse)</div>
      <ul>
        <li>Hypotenuse gesucht: $c = \\sqrt{a^2 + b^2}$</li>
        <li>Kathete gesucht: $a = \\sqrt{c^2 - b^2}$</li>
      </ul>
      <div class="beispiel"><b>Beispiel:</b> Dachschräge mit halber Breite 4 m und Höhe 3 m: $s = \\sqrt{4^2 + 3^2} = \\sqrt{25} = 5$ m.</div>
      <p>Tipp: Suche zuerst den rechten Winkel. Oft entsteht er durch eine Höhe, die senkrecht auf einer Seite steht.</p>`,
  },
  {
    id: "sin-cos-tan", bereich: "trigonometrie",
    titel: "Sinus, Kosinus und Tangens",
    stichworte: "Winkelfunktionen sin cos tan Gegenkathete Ankathete Hypotenuse GAGA Höhenwinkel",
    inhalt: `
      <p>Im rechtwinkligen Dreieck verbinden die Winkelfunktionen einen Winkel mit zwei Seiten:</p>
      <div class="formel">$\\sin \\alpha = \\frac{\\text{Gegenkathete}}{\\text{Hypotenuse}} \\qquad \\cos \\alpha = \\frac{\\text{Ankathete}}{\\text{Hypotenuse}} \\qquad \\tan \\alpha = \\frac{\\text{Gegenkathete}}{\\text{Ankathete}}$</div>
      <p><b>So gehst du vor:</b></p>
      <ol>
        <li>Rechten Winkel und den betrachteten Winkel markieren.</li>
        <li>Welche zwei Seiten kennst du oder suchst du? (Gegenkathete, Ankathete, Hypotenuse)</li>
        <li>Die Funktion wählen, die genau diese zwei Seiten enthält.</li>
        <li>Gleichung aufstellen und umstellen.</li>
      </ol>
      <div class="beispiel"><b>Beispiel:</b> Turm 20 m hoch, Höhenwinkel 32°, Abstand d gesucht: $\\tan 32° = \\frac{20}{d}$ → $d = \\frac{20}{\\tan 32°} \\approx 32{,}0$ m.</div>
      <p>Taschenrechner auf <b>DEG</b> (Grad) stellen!</p>`,
  },
  {
    id: "winkel-berechnen", bereich: "trigonometrie",
    titel: "Winkel berechnen mit sin⁻¹, cos⁻¹, tan⁻¹",
    stichworte: "Umkehrfunktion arcsin arctan shift tan Neigungswinkel Steigungswinkel",
    inhalt: `
      <p>Kennst du zwei Seiten und suchst den <b>Winkel</b>, brauchst du die Umkehrfunktion. Sie macht aus dem Seitenverhältnis wieder einen Winkel.</p>
      <div class="formel">$\\tan \\alpha = 0{,}75 \\quad \\Rightarrow \\quad \\alpha = \\tan^{-1}(0{,}75) \\approx 36{,}9°$</div>
      <p>Auf dem Taschenrechner meist: <b>shift</b> (oder 2nd) und dann <b>tan</b>, danach den Wert eingeben.</p>
      <div class="beispiel"><b>Beispiel:</b> Ein Hang ist 160 m lang (waagerecht) und 30 m hoch. $\\tan \\alpha = \\frac{30}{160} = 0{,}1875$ → $\\alpha = \\tan^{-1}(0{,}1875) \\approx 10{,}6°$.</div>
      <p>Genauso: $\\sin^{-1}$ wenn Gegenkathete und Hypotenuse bekannt sind, $\\cos^{-1}$ bei Ankathete und Hypotenuse.</p>`,
  },
  {
    id: "sinussatz", bereich: "trigonometrie",
    titel: "Sinussatz",
    stichworte: "allgemeines Dreieck nicht rechtwinklig Sinussatz Seite gegenüber Winkel",
    inhalt: `
      <p>Der Sinussatz gilt in <b>jedem</b> Dreieck. Jede Seite steht ihrem gegenüberliegenden Winkel gegenüber:</p>
      <div class="formel">$\\frac{a}{\\sin \\alpha} = \\frac{b}{\\sin \\beta} = \\frac{c}{\\sin \\gamma}$</div>
      <p>Du brauchst ihn, wenn du eine Seite und ihren gegenüberliegenden Winkel kennst und dazu noch eine weitere Seite oder einen weiteren Winkel.</p>
      <div class="beispiel"><b>Beispiel:</b> $a = 8$ cm, $\\alpha = 50°$, $\\beta = 70°$: $b = \\frac{8 \\cdot \\sin 70°}{\\sin 50°} \\approx 9{,}8$ cm.</div>`,
  },
  {
    id: "kosinussatz", bereich: "trigonometrie",
    titel: "Kosinussatz",
    stichworte: "allgemeines Dreieck nicht rechtwinklig zwei Seiten eingeschlossener Winkel",
    inhalt: `
      <p>Der Kosinussatz gilt in <b>jedem</b> Dreieck. Du brauchst ihn, wenn du zwei Seiten und den Winkel <b>zwischen</b> ihnen kennst – oder alle drei Seiten.</p>
      <div class="formel">$c^2 = a^2 + b^2 - 2ab \\cdot \\cos \\gamma$</div>
      <p>Ist der Winkel 90°, wird $\\cos 90° = 0$ und es bleibt der Satz des Pythagoras übrig.</p>
      <div class="beispiel"><b>Beispiel:</b> AB = 120 m, BC = 90 m, Winkel bei B = 130°: $AC^2 = 120^2 + 90^2 - 2 \\cdot 120 \\cdot 90 \\cdot \\cos 130° \\approx 36\\,384$ → $AC \\approx 190{,}7$ m.</div>`,
  },
  {
    id: "strahlensatz", bereich: "trigonometrie",
    titel: "Strahlensätze und ähnliche Dreiecke",
    stichworte: "Strahlensatz parallel Schatten ähnlich Verhältnis zentrische Streckung",
    inhalt: `
      <p>Werden zwei Strahlen mit gemeinsamem Startpunkt von zwei <b>parallelen</b> Geraden geschnitten, stehen die Strecken im gleichen Verhältnis.</p>
      <div class="formel">$\\frac{\\text{kurze Strecke}_1}{\\text{lange Strecke}_1} = \\frac{\\text{kurze Strecke}_2}{\\text{lange Strecke}_2}$</div>
      <p>Typisch sind Schattenaufgaben: Sonnenstrahlen sind parallel, Personen und Bäume stehen senkrecht. So entstehen ähnliche Dreiecke.</p>
      <div class="beispiel"><b>Beispiel:</b> Tanne 3 m, Schatten 4 m. Lutz ist 1,80 m groß: $\\frac{x}{4} = \\frac{1{,}8}{3}$ → $x = 2{,}4$ m.</div>`,
  },
  {
    id: "winkelsumme", bereich: "trigonometrie",
    titel: "Winkelsumme in Dreiecken und Vielecken",
    stichworte: "Innenwinkel Innenwinkelsumme Dreieck Viereck Sechseck n-Eck 180 Grad",
    inhalt: `
      <p>Im <b>Dreieck</b> ist die Summe der Innenwinkel immer 180°, im <b>Viereck</b> 360°.</p>
      <p>Ein n-Eck lässt sich von einer Ecke aus in $n - 2$ Dreiecke zerlegen:</p>
      <div class="formel">Innenwinkelsumme $= (n - 2) \\cdot 180°$</div>
      <p>In einem <b>regelmäßigen</b> n-Eck sind alle Innenwinkel gleich groß: $\\frac{(n - 2) \\cdot 180°}{n}$.</p>
      <div class="beispiel"><b>Beispiel:</b> Sechseck: $(6 - 2) \\cdot 180° = 720°$. Jeder Innenwinkel im regelmäßigen Sechseck: $720° : 6 = 120°$.</div>`,
  },

  /* ===================== KÖRPERBERECHNUNG ===================== */
  {
    id: "flaechen", bereich: "koerper",
    titel: "Flächen: Rechteck, Dreieck, Trapez, Kreis",
    stichworte: "Flächeninhalt Umfang Rechteck Quadrat Dreieck Parallelogramm Trapez Kreis pi",
    inhalt: `
      <table>
        <tr><th>Figur</th><th>Flächeninhalt</th><th>Umfang</th></tr>
        <tr><td>Rechteck</td><td>$A = a \\cdot b$</td><td>$u = 2a + 2b$</td></tr>
        <tr><td>Quadrat</td><td>$A = a^2$</td><td>$u = 4a$</td></tr>
        <tr><td>Dreieck</td><td>$A = \\frac{1}{2} \\cdot g \\cdot h$</td><td>$u = a + b + c$</td></tr>
        <tr><td>Parallelogramm</td><td>$A = g \\cdot h$</td><td>$u = 2a + 2b$</td></tr>
        <tr><td>Trapez</td><td>$A = \\frac{1}{2}(a + c) \\cdot h$</td><td>$u = a + b + c + d$</td></tr>
        <tr><td>Kreis</td><td>$A = \\pi r^2$</td><td>$u = 2\\pi r = \\pi d$</td></tr>
      </table>
      <p>Die Höhe h steht immer <b>senkrecht</b> auf der Grundseite g.</p>`,
  },
  {
    id: "vieleck-flaeche", bereich: "koerper",
    titel: "Regelmäßiges Sechseck",
    stichworte: "Sechseck gleichseitiges Dreieck Höhe Fläche regelmäßig Vieleck",
    inhalt: `
      <p>Ein regelmäßiges Sechseck mit der Seitenlänge a besteht aus <b>6 gleichseitigen Dreiecken</b> mit der Seitenlänge a.</p>
      <p>Höhe eines gleichseitigen Dreiecks (mit dem Satz des Pythagoras):</p>
      <div class="formel">$h = \\frac{a}{2}\\sqrt{3} \\qquad A_{\\text{Dreieck}} = \\frac{1}{2} \\cdot a \\cdot h \\qquad A_{\\text{Sechseck}} = 6 \\cdot A_{\\text{Dreieck}} = \\frac{3}{2}\\sqrt{3} \\, a^2$</div>
      <div class="beispiel"><b>Beispiel:</b> $a = 10$ cm: $h \\approx 8{,}66$ cm, ein Dreieck $\\approx 43{,}3$ cm², das Sechseck $\\approx 259{,}8$ cm².</div>`,
  },
  {
    id: "quader-wuerfel", bereich: "koerper",
    titel: "Würfel, Quader und Prisma",
    stichworte: "Würfel Quader Prisma Volumen Oberfläche Grundfläche Kantenlänge",
    inhalt: `
      <table>
        <tr><th>Körper</th><th>Volumen</th><th>Oberfläche</th></tr>
        <tr><td>Würfel</td><td>$V = a^3$</td><td>$O = 6a^2$</td></tr>
        <tr><td>Quader</td><td>$V = a \\cdot b \\cdot c$</td><td>$O = 2(ab + ac + bc)$</td></tr>
        <tr><td>Prisma</td><td>$V = G \\cdot h$</td><td>$O = 2G + M$</td></tr>
      </table>
      <p>G ist die Grundfläche, M die Mantelfläche (alle Seitenflächen zusammen).</p>
      <div class="beispiel"><b>Beispiel:</b> Eiswürfel mit $a = 4$ dm: $V = 4^3 = 64$ dm³ = 64 Liter.</div>`,
  },
  {
    id: "zylinder", bereich: "koerper",
    titel: "Zylinder",
    stichworte: "Zylinder Volumen Mantelfläche Oberfläche Säule Dose Radius Durchmesser",
    inhalt: `
      <div class="formel">$V = \\pi r^2 \\cdot h \\qquad M = 2\\pi r \\cdot h = \\pi d \\cdot h \\qquad O = 2\\pi r^2 + 2\\pi r h$</div>
      <p>Der Mantel ist abgerollt ein Rechteck: Seiten sind der Kreisumfang und die Höhe.</p>
      <div class="beispiel"><b>Beispiel:</b> Kerze mit $r = 3$ cm und $h = 8$ cm: $V = \\pi \\cdot 9 \\cdot 8 \\approx 226{,}2$ cm³.</div>
      <p>Achtung: Ist der Durchmesser gegeben, halbieren für den Radius.</p>`,
  },
  {
    id: "kegel", bereich: "koerper",
    titel: "Kegel",
    stichworte: "Kegel Volumen Mantelfläche Mantellinie Oberfläche Spitze",
    inhalt: `
      <div class="formel">$V = \\frac{1}{3} \\pi r^2 \\cdot h \\qquad M = \\pi r s \\qquad O = \\pi r^2 + \\pi r s$</div>
      <p>s ist die Mantellinie (von der Spitze zum Rand). Radius, Höhe und Mantellinie bilden ein rechtwinkliges Dreieck:</p>
      <div class="formel">$s = \\sqrt{r^2 + h^2}$</div>
      <div class="beispiel"><b>Beispiel:</b> $r = 3$ cm, $h = 4$ cm: $s = 5$ cm, $V = 12\\pi \\approx 37{,}7$ cm³, $M = 15\\pi \\approx 47{,}1$ cm².</div>`,
  },
  {
    id: "pyramide", bereich: "koerper",
    titel: "Pyramide",
    stichworte: "Pyramide quadratische Grundfläche Volumen Höhe Seitenhöhe",
    inhalt: `
      <div class="formel">$V = \\frac{1}{3} \\cdot G \\cdot h \\qquad O = G + M$</div>
      <p>Bei einer quadratischen Pyramide ist $G = a^2$. Die Mantelfläche besteht aus 4 Dreiecken mit der Seitenhöhe $h_s$: $M = 4 \\cdot \\frac{1}{2} a h_s = 2a h_s$.</p>
      <p>Die Seitenhöhe erhältst du mit Pythagoras: $h_s = \\sqrt{h^2 + \\left(\\frac{a}{2}\\right)^2}$.</p>`,
  },
  {
    id: "kugel", bereich: "koerper",
    titel: "Kugel",
    stichworte: "Kugel Volumen Oberfläche Radius Halbkugel",
    inhalt: `
      <div class="formel">$V = \\frac{4}{3} \\pi r^3 \\qquad O = 4\\pi r^2$</div>
      <div class="beispiel"><b>Beispiel:</b> Kugel mit $r = 2$ cm: $V = \\frac{4}{3}\\pi \\cdot 8 \\approx 33{,}5$ cm³.</div>
      <p>Eine Halbkugel hat das halbe Volumen.</p>`,
  },
  {
    id: "dichte", bereich: "koerper",
    titel: "Masse, Volumen und Dichte",
    stichworte: "Dichte Masse Gewicht g/cm³ kg/m³ wiegen",
    inhalt: `
      <p>Die Dichte gibt an, wie schwer 1 cm³ (oder 1 m³) eines Stoffes ist.</p>
      <div class="formel">$\\text{Masse} = \\text{Volumen} \\cdot \\text{Dichte} \\qquad m = V \\cdot \\rho$</div>
      <p>Achte darauf, dass die Einheiten zusammenpassen: g/cm³ mit cm³, kg/m³ mit m³.</p>
      <div class="beispiel"><b>Beispiel:</b> Eis hat 0,92 g/cm³. Ein Würfel mit 64 000 cm³ wiegt $64\\,000 \\cdot 0{,}92 = 58\\,880$ g ≈ 58,9 kg.</div>`,
  },

  /* ===================== WAHRSCHEINLICHKEITSRECHNUNG ===================== */
  {
    id: "laplace", bereich: "wahrscheinlichkeit",
    titel: "Laplace-Wahrscheinlichkeit",
    stichworte: "Wahrscheinlichkeit günstige mögliche Ergebnisse Zufallsexperiment Würfel Los",
    inhalt: `
      <p>Haben alle Ergebnisse dieselbe Chance (Laplace-Experiment), gilt:</p>
      <div class="formel">$P(E) = \\frac{\\text{Anzahl der günstigen Ergebnisse}}{\\text{Anzahl aller möglichen Ergebnisse}}$</div>
      <p>Wahrscheinlichkeiten liegen zwischen 0 (unmöglich) und 1 (sicher). Man kann sie als Bruch, Dezimalzahl oder in Prozent angeben.</p>
      <div class="beispiel"><b>Beispiel:</b> 20 Gewinne unter 200 Losen: $P = \\frac{20}{200} = 0{,}1 = 10\\,\\%$.</div>`,
  },
  {
    id: "gegenereignis", bereich: "wahrscheinlichkeit",
    titel: "Gegenereignis",
    stichworte: "Gegenereignis mindestens einmal nicht 1 minus",
    inhalt: `
      <p>Das Gegenereignis $\\overline{E}$ tritt genau dann ein, wenn E nicht eintritt.</p>
      <div class="formel">$P(\\overline{E}) = 1 - P(E)$</div>
      <p>Besonders praktisch bei „mindestens einmal“: Rechne die Wahrscheinlichkeit für „keinmal“ aus und ziehe sie von 1 ab.</p>
      <div class="beispiel"><b>Beispiel:</b> Mindestens eine Sechs bei zwei Würfen: $1 - \\left(\\frac{5}{6}\\right)^2 = 1 - \\frac{25}{36} = \\frac{11}{36} \\approx 30{,}6\\,\\%$.</div>`,
  },
  {
    id: "baumdiagramm", bereich: "wahrscheinlichkeit",
    titel: "Baumdiagramm und Pfadregeln",
    stichworte: "Baumdiagramm Pfad Pfadmultiplikationsregel Pfadadditionsregel mehrstufig nacheinander",
    inhalt: `
      <p>Bei mehrstufigen Zufallsexperimenten zeichnest du ein Baumdiagramm. An jede Verzweigung schreibst du die Wahrscheinlichkeit.</p>
      <p><b>Pfadmultiplikationsregel:</b> Die Wahrscheinlichkeit eines Pfads ist das <b>Produkt</b> der Wahrscheinlichkeiten entlang des Pfads.</p>
      <p><b>Pfadadditionsregel:</b> Gehören mehrere Pfade zu einem Ereignis, werden ihre Wahrscheinlichkeiten <b>addiert</b>.</p>
      <div class="beispiel"><b>Beispiel:</b> Zweimal würfeln, zwei Sechsen: $\\frac{1}{6} \\cdot \\frac{1}{6} = \\frac{1}{36}$. Genau eine Sechs: $\\frac{1}{6} \\cdot \\frac{5}{6} + \\frac{5}{6} \\cdot \\frac{1}{6} = \\frac{10}{36}$.</div>
      <p>Die Wahrscheinlichkeiten an den Ästen einer Verzweigung ergeben zusammen immer 1.</p>`,
  },
  {
    id: "ohne-zuruecklegen", bereich: "wahrscheinlichkeit",
    titel: "Ziehen mit und ohne Zurücklegen",
    stichworte: "Urne ohne Zurücklegen mit Zurücklegen Kugeln ziehen Lose",
    inhalt: `
      <p><b>Mit Zurücklegen:</b> Die Wahrscheinlichkeiten bleiben bei jedem Zug gleich.</p>
      <p><b>Ohne Zurücklegen:</b> Nach jedem Zug ist ein Gegenstand weniger da. Zähler und Nenner ändern sich.</p>
      <div class="beispiel"><b>Beispiel:</b> 3 rote und 5 andere Kugeln, zwei rote ohne Zurücklegen: $\\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56}$. Mit Zurücklegen wären es $\\frac{3}{8} \\cdot \\frac{3}{8} = \\frac{9}{64}$.</div>
      <p>Auch bei Losen gilt: Wurden schon Nieten gezogen, steigt die Chance auf einen Gewinn, weil weniger Lose übrig sind.</p>`,
  },
  {
    id: "relative-haeufigkeit", bereich: "wahrscheinlichkeit",
    titel: "Absolute und relative Häufigkeit",
    stichworte: "absolute Häufigkeit relative Häufigkeit Versuch Schätzwert Gesetz der großen Zahlen",
    inhalt: `
      <ul>
        <li><b>Absolute Häufigkeit:</b> wie oft ein Ergebnis vorkam, z. B. 55-mal.</li>
        <li><b>Relative Häufigkeit:</b> der Anteil an allen Versuchen.</li>
      </ul>
      <div class="formel">$\\text{relative Häufigkeit} = \\frac{\\text{absolute Häufigkeit}}{\\text{Anzahl aller Versuche}}$</div>
      <div class="beispiel"><b>Beispiel:</b> Bei 500 Würfen fiel die Eins 55-mal: $\\frac{55}{500} = 0{,}11 = 11\\,\\%$.</div>
      <p>Bei vielen Versuchen ist die relative Häufigkeit ein guter Schätzwert für die Wahrscheinlichkeit.</p>`,
  },
  {
    id: "kombinatorik", bereich: "wahrscheinlichkeit",
    titel: "Zählprinzip (Kombinatorik)",
    stichworte: "Kombinatorik Zählprinzip Möglichkeiten Reihenfolge Anordnungen Fakultät Code",
    inhalt: `
      <p>Hat man nacheinander mehrere Entscheidungen, werden die Anzahlen der Möglichkeiten <b>multipliziert</b>.</p>
      <ul>
        <li><b>Mit Wiederholung:</b> n Möglichkeiten bei k Stellen ergeben $n^k$, z. B. ein vierstelliger Zahlencode: $10^4 = 10\\,000$.</li>
        <li><b>Ohne Wiederholung:</b> Bei jeder Stelle eine Möglichkeit weniger, z. B. $12 \\cdot 11 \\cdot 10 \\cdot 9$.</li>
        <li><b>Alle anordnen:</b> n Dinge lassen sich auf $n! = n \\cdot (n - 1) \\cdot \\ldots \\cdot 1$ Arten anordnen.</li>
      </ul>
      <div class="beispiel"><b>Beispiel:</b> 4 Lieder aus 12, keins doppelt: $\\frac{12 \\cdot 11 \\cdot 10 \\cdot 9}{12^4} = \\frac{11\\,880}{20\\,736} \\approx 57{,}3\\,\\%$.</div>`,
  },
  {
    id: "mittelwert", bereich: "wahrscheinlichkeit",
    titel: "Arithmetisches Mittel (Mittelwert)",
    stichworte: "Mittelwert Durchschnitt arithmetisches Mittel Statistik Summe",
    inhalt: `
      <div class="formel">$\\bar{x} = \\frac{\\text{Summe aller Werte}}{\\text{Anzahl der Werte}}$</div>
      <div class="beispiel"><b>Beispiel:</b> 5, 20, 15, 10, 12, 15, 21: Summe 98, Anzahl 7, Mittelwert $98 : 7 = 14$.</div>
      <p>Umgekehrt: Mittelwert mal Anzahl ergibt die Summe. Damit kannst du einen fehlenden Wert berechnen.</p>
      <p>Der Mittelwert reagiert stark auf Ausreißer (sehr große oder sehr kleine Werte). Dann beschreibt der [[median|Median]] die Daten oft besser.</p>`,
  },
  {
    id: "median", bereich: "wahrscheinlichkeit",
    titel: "Median (Zentralwert)",
    stichworte: "Median Zentralwert sortieren Mitte Statistik",
    inhalt: `
      <p>Der Median ist der Wert, der in der <b>Mitte</b> steht, wenn man alle Werte der Größe nach sortiert.</p>
      <ul>
        <li><b>Ungerade Anzahl:</b> Der mittlere Wert ist der Median.</li>
        <li><b>Gerade Anzahl:</b> Der Median ist der Mittelwert der beiden mittleren Werte.</li>
      </ul>
      <div class="beispiel"><b>Beispiel:</b> Sortiert: 5, 10, 12, <b>15</b>, 15, 20, 21 → Median 15. Bei 4, 6, 9, 13 ist der Median $(6 + 9) : 2 = 7{,}5$.</div>
      <p>Wichtig: Vorher sortieren! Mindestens die Hälfte der Werte ist kleiner oder gleich dem Median.</p>`,
  },
  {
    id: "boxplot", bereich: "wahrscheinlichkeit",
    titel: "Spannweite, Quartile und Boxplot",
    stichworte: "Spannweite Minimum Maximum Quartil unteres oberes Boxplot Streuung",
    inhalt: `
      <ul>
        <li><b>Spannweite:</b> größter Wert minus kleinster Wert.</li>
        <li><b>Unteres Quartil:</b> Median der unteren Hälfte der sortierten Werte.</li>
        <li><b>Oberes Quartil:</b> Median der oberen Hälfte.</li>
      </ul>
      <p>Ein <b>Boxplot</b> zeigt fünf Kennwerte: Minimum, unteres Quartil, Median, oberes Quartil und Maximum. In der Box liegt die mittlere Hälfte der Werte.</p>
      <div class="beispiel"><b>Beispiel:</b> 5, 10, 12, 15, 15, 20, 21: Spannweite $21 - 5 = 16$, unteres Quartil 10, Median 15, oberes Quartil 20.</div>`,
  },
];
