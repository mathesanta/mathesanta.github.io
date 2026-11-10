/* =========================================================
   INHALTE DES ADVENTSKALENDERS
   Hier änderst du Aufgaben, Türchen-Positionen und Badges,
   ohne den restlichen Code anzufassen.

   Wichtig beim Schreiben:
   - Formeln stehen zwischen $...$ (z. B. "$\\frac{3}{4}$").
     In dieser Datei muss jeder Backslash doppelt geschrieben werden: \\cdot, \\frac, \\sqrt
   - Dezimalkomma in Formeln: 0{,}15  (sonst setzt KaTeX ein Leerzeichen nach dem Komma)
   - In den Texten ist HTML erlaubt: <p>, <b>, <br>, <table> …
   - Link in die Wissensdatenbank: [[pythagoras|Satz des Pythagoras]]
     (die Kennungen stehen in js/wissen.js, Feld id)
   ========================================================= */

const KALENDER = {
  jahr: 2026,                                  // Türchen n öffnet am n. Dezember dieses Jahres
  bild: "bilder/wimmelbild.webp",
  bildBreite: 1672,                            // Größe des Bildes in Pixeln
  bildHoehe: 941,
  tuerGroesse: 64,                             // Kantenlänge eines Türchens in Bild-Pixeln
  sternenhuus: { x: 9.7, y: 91.2, r: 50 },     // Hütte mit den Sternen am Tor (unten links)
};

// Position jedes Türchens in Prozent: x = von links, y = von oben (Mittelpunkt der Tür).
// Im Testmodus hilft der „Positions-Helfer“: Klick ins Bild zeigt die Werte an.
const TUEREN = [
  { tag: 1,  x: 83.7, y: 30.8 },            // Lkw an der Straße – Anreise
  { tag: 2,  x: 66.7, y: 49.9 },            // Schneepflug – Schneeschippen
  { tag: 3,  x: 12.3, y: 8.5 },            // Dach des großen Chalets
  { tag: 4,  x: 4.5, y: 40.9 },            // Eiszapfen am Haus links
  { tag: 5,  x: 54.1, y: 46.8 },            // Skifahrer am Hang – Skiverleih
  { tag: 6,  x: 20.0, y: 55.3 },            // großer Weihnachtsbaum – Christbaumkugeln
  { tag: 7,  x: 38.3, y: 35.1 },            // Rodelhang
  { tag: 8,  x: 55.6, y: 67.0 },            // Kakao-Stand
  { tag: 9,  x: 75.7, y: 77.0 },            // Iglu
  { tag: 10, x: 83.3, y: 91.2 },            // Schneemann – Schneetagebuch
  { tag: 11, x: 96.4, y: 24.2 },            // Schneeflocke an der Fabrik
  { tag: 12, x: 24.2, y: 73.3 },            // Marktbude – Tombola
  { tag: 13, x: 84.8, y: 82.4 },            // Schneekanone
  { tag: 14, x: 63.4, y: 34.0 },            // Tannen am Felsen
  { tag: 15, x: 87.3, y: 52.1 },            // Tribüne an der Eisfläche
  { tag: 16, x: 31.1, y: 21.3 },            // oberer Hang – Sprunghügel
  { tag: 17, x: 59.8, y: 78.1 },            // Kerzen im Kakao-Stand
  { tag: 18, x: 59.2, y: 55.8 },            // Hütte mit rauchendem Kamin
  { tag: 19, x: 70.9, y: 15.9 },            // Aussichtsturm am See
  { tag: 20, x: 17.9, y: 15.9 },            // Chalet mit vielen Fenstern – Adventskalender
  { tag: 21, x: 89.7, y: 21.8 },            // Frosti-Fabrik
  { tag: 22, x: 33.5, y: 65.9 },            // Weihnachtsbasar
  { tag: 23, x: 31.1, y: 80.8 },            // Musikanten – Playlist
  { tag: 24, x: 42.8, y: 77.6, groesse: 1.3 },// Litfaßsäule
];

/* ---------------------------------------------------------
   AUFGABEN
   Geschichte: „Noelville braucht deine Hilfe“ – die goldenen Sterne des Dorffests
   sind verschwunden. Jeder Tag: Aufgabe 1 (Rätsel, bringt den goldenen Stern) und
   Aufgabe 2 (schwieriger, bringt eine Bonus-Schneeflocke).
   Aufgabe 2 erscheint erst, wenn Aufgabe 1 erledigt ist.

   Felder eines Tages:
     titel, thema, einleitung (HTML)
     wissen:     Themenbereiche der Wissensdatenbank, die zum Tag passen
                 ("rechengesetze", "funktionen", "trigonometrie", "koerper", "wahrscheinlichkeit")
     fund:       wo der goldene Stern versteckt war (erscheint, wenn Aufgabe 1 gelöst ist)
     grafiken:   Skizzen/Tabellen aus js/grafiken.js, z. B. ["dach"] oder ["T:schnee"]
     aufgaben:   Liste mit (meist) zwei Aufgaben

   Felder einer Aufgabe:
     typ:        "zahl" (Standard) oder "auswahl" (Multiple Choice)
     text:       Aufgabentext
     antwort:    Zahl – oder Liste mehrerer richtiger Zahlen, z. B. [0.2, 0.25]
                 bei "auswahl": Nummer der richtigen Option (0 = erste)
     toleranz:   erlaubte Abweichung, z. B. 0.01 (Standard: 0.0001)
     einheit:    wird neben dem Eingabefeld angezeigt (Eingaben mit Einheit sind trotzdem okay)
     antwortText:so wird die richtige Antwort angezeigt (optional, z. B. "≈ 17,6")
     optionen:   bei "auswahl": Liste der Antwortmöglichkeiten
     tastatur:   "text", wenn Schüler Brüche (/) oder % tippen sollen (Handy-Tastatur)
     tipp:       Hinweis – oder eine Liste mehrerer Tipps, die nacheinander aufgedeckt werden.
                 Beim Rätsel (Aufgabe 1) erscheint der Tipp nach dem ersten falschen Versuch,
                 beim Bonus-Rätsel kann man ihn jederzeit aufklappen.
     loesung:    Musterlösung in ganzen Sätzen – erscheint nach einigen Fehlversuchen (kostet dann den Stern)
     maxVersuche:Fehlversuche bis der Lösungsweg angeboten wird (Standard 3, bei Auswahl 2)
     grafiken:   wie oben, aber nur bei dieser Aufgabe
     felder:     für MEHRERE Antworten in einer Aufgabe: Liste von Feldern
                 (typ, antwort, toleranz, einheit, optionen, label) – alle müssen stimmen
   --------------------------------------------------------- */

const QUELLE = "Frei nach den Zentralen Abschlussarbeiten MSA Mathematik Schleswig-Holstein 2022–2026, übertragen in die Geschichte „Noelville braucht deine Hilfe“";

const AUFGABEN = {
  1: {
    titel: "Die Lichterketten kommen",
    thema: "Zuordnungen · Graphen",
    wissen: ["funktionen"],
    einleitung: "<p>Karls Lieferservice ist der einzige Lieferservice, der Noelville im Winter beliefert. Auch dieses Jahr liefert Karl die Lichterketten fürs Dorffest. Das Diagramm zeigt seine Fahrt aus der Stadt hinauf ins Dorf.</p><p>Löse das Rätsel und finde deinen ersten goldenen Stern.</p>",
    grafiken: ["fahrt"],
    fund: "Zwischen den Lichterketten auf der Ladefläche blitzt etwas – der erste goldene Stern!",
    aufgaben: [
      {
        text: "<p>Unterwegs legt Karl eine Pause ein. Wie viele Kilometer ist Karl schon gefahren, bis es in die Pause geht?</p>",
        antwort: 160, toleranz: 0.5, einheit: "km",
        tipp: "Das Diagramm stellt die Strecke in Abhängigkeit von der Zeit dar. Während der Pause bleibt die Strecke gleich, der Graph verläuft dort waagerecht. Die Pause beginnt nach 2 Stunden. [[graph-ablesen|Graphen ablesen]]",
        loesung: "Karl ist bis zur Pause 160 km gefahren. Die Pause erkennt man daran, dass der Graph waagerecht verläuft: Die Zeit läuft weiter, aber die Strecke bleibt gleich. Die Pause beginnt nach 2 Stunden. Geht man auf der x-Achse zu 2 Stunden und schaut, wo der Graph dort liegt, landet man bei <b>160 km</b>.",
      },
      {
        text: "<p>Berechne Karls Durchschnittsgeschwindigkeit über die gesamte Reisezeit, also mit Pause.</p>",
        antwort: 70, toleranz: 0.1, einheit: "km/h",
        tipp: "Durchschnittsgeschwindigkeit = gesamte Strecke : gesamte Zeit. Lies das Ende der Fahrt im Diagramm ab. [[graph-ablesen|Graphen ablesen]]",
        loesung: "Am Ende der Fahrt zeigt das Diagramm 280 km nach 4 Stunden. Die Pause gehört zur Reisezeit dazu. Die Durchschnittsgeschwindigkeit beträgt deshalb 280 km : 4 h = <b>70 km/h</b>.",
      },
    ],
  },

  2: {
    titel: "Der Festplatz versinkt im Schnee",
    thema: "Antiproportionale Zuordnung",
    wissen: ["rechengesetze"],
    einleitung: "<p>Über Nacht sind 50 cm Schnee gefallen. Bürgermeisterin Rosa ruft alle zusammen: Der Festplatz muss freigeschaufelt werden, sonst gibt es kein Dorffest. Alle Helferinnen und Helfer arbeiten gleich schnell.</p>",
    fund: "Unter dem letzten Schneehaufen glänzt ein goldener Stern!",
    aufgaben: [
      {
        text: "<p>15 Helfer brauchen für den ganzen Platz 100 Minuten. Wie lange brauchen 60 Helfer?</p>",
        antwort: 25, toleranz: 0.01, einheit: "min",
        tipp: "Je mehr Helfer, desto schneller geht es: Doppelt so viele Helfer brauchen nur halb so lange. Wie viel Mal so viele Helfer sind 60 im Vergleich zu 15? [[antiproportional|Antiproportionale Zuordnung]]",
        loesung: "60 Helfer sind viermal so viele wie 15 Helfer. Weil die Zuordnung antiproportional ist, brauchen sie nur ein Viertel der Zeit. Sie sind also nach 100 min : 4 = <b>25 min</b> fertig.",
      },
      {
        text: "<p>15 Helfer fangen an. Nach 20 Minuten kommen 10 weitere Helfer dazu. Wie viele Minuten dauert das Schippen insgesamt?</p>",
        antwort: 68, toleranz: 0.01, einheit: "min",
        tipp: "Rechne mit „Helfer-Minuten“: 15 Helfer · 100 min ist die gesamte Arbeit. [[antiproportional|Antiproportionale Zuordnung]]",
        loesung: "Die gesamte Arbeit beträgt 15 · 100 = 1500 Helfer-Minuten. In den ersten 20 Minuten schaffen 15 Helfer 15 · 20 = 300 Helfer-Minuten, also bleiben 1200 übrig. Diese Restarbeit teilen sich jetzt 25 Helfer: 1200 : 25 = 48 min. Insgesamt dauert das Schippen 20 + 48 = <b>68 min</b>.",
      },
    ],
  },

  3: {
    titel: "Schnee auf dem Chalet-Dach",
    thema: "Pythagoras · Körper",
    wissen: ["trigonometrie", "koerper"],
    einleitung: "<p>Auf dem Dach des großen Chalets soll die Festbeleuchtung angebracht werden. Ganz oben am First glitzert etwas – vermutlich liegt dort einer der verschwundenen Sterne! Das Chalet hat ein Satteldach. Es ist 8 m breit und 12 m lang, der Dachfirst liegt 3 m über der Dachkante.</p>",
    grafiken: ["dach"],
    fund: "Oben am Dachfirst hängt – halb eingeschneit – ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Berechne die Länge s einer Dachschräge (in der Skizze rot markiert).</p>",
        antwort: 5, toleranz: 0.01, einheit: "m",
        tipp: "Die Höhe vom First zur Dachkante steht senkrecht auf der Dachkante, dort ist ein rechter Winkel. So entsteht ein rechtwinkliges Dreieck mit den Katheten 4 m (halbe Breite) und 3 m. Die Dachschräge s ist die Hypotenuse – nutze den [[pythagoras|Satz des Pythagoras]].",
        loesung: "Die Höhe und die halbe Breite bilden mit der Dachschräge ein rechtwinkliges Dreieck. Die Dachschräge s liegt dem rechten Winkel gegenüber und ist deshalb die Hypotenuse. Mit dem Satz des Pythagoras gilt: s² = 4² + 3² = 16 + 9 = 25. Also ist s = √25 = <b>5 m</b>.",
      },
      {
        text: "<p>Bevor Zimmermann Theo aufs Dach steigt, will er wissen, wie schwer der Schnee ist. Auf beiden Dachflächen liegt eine 40 cm dicke Schicht Nassschnee. 1 m³ Nassschnee wiegt 300 kg. Wie viele Tonnen Schnee liegen auf dem Dach?</p>",
        antwort: 14.4, toleranz: 0.05, einheit: "t",
        tipp: "Eine Dachfläche ist ein Rechteck aus s und der Länge des Chalets. Das Volumen des Schnees ist Fläche · Dicke. Achte auf die Einheit: 40 cm = 0,4 m. [[flaechen|Flächen]] · [[dichte|Masse und Dichte]]",
        loesung: "Eine Dachfläche ist ein Rechteck mit 5 m · 12 m = 60 m². Beide Dachflächen zusammen sind 120 m² groß. Der Schnee ist 0,4 m dick, also liegen 120 · 0,4 = 48 m³ Schnee auf dem Dach. Diese wiegen 48 · 300 kg = 14 400 kg. Das sind <b>14,4 t</b>.",
      },
    ],
  },

  4: {
    titel: "Gefährliche Eiszapfen",
    thema: "Tabellenkalkulation · quadratisch",
    wissen: ["rechengesetze", "funktionen"],
    einleitung: "<p>An der Dachrinne von Bäckerin Mias Haus hängen riesige Eiszapfen – genau über dem Weg zum Festplatz! Bevor das Fest beginnen kann, müssen die Eiszapfen entfernt werden. Damit dabei niemand verletzt wird, muss Mia vorher ein paar Dinge berechnen.</p><p>Für einen fallenden Eiszapfen gilt näherungsweise: Quadriere die Fallzeit (in s) und multipliziere mit 5, dann erhältst du die Fallstrecke (in m). Mia rechnet mit einer Tabellenkalkulation.</p>",
    grafiken: ["T:eiszapfen"],
    fund: "In einem der Eiszapfen ist ein goldener Stern eingefroren!",
    aufgaben: [
      {
        text: "<p>a) Welcher Wert steht in Zelle E2?<br>b) Mit welcher Formel kann man C2 berechnen?</p>",
        felder: [
          { antwort: 20, toleranz: 0.01, einheit: "m", label: "a) E2 =" },
          { typ: "auswahl", label: "b) Formel für C2", optionen: ["=C1*C1*5", "=B2*5", "=C1*5*2"], antwort: 0 },
        ],
        tipp: "In Zeile 1 steht die Fallzeit, in Zeile 2 die Fallstrecke. Für E2 brauchst du die Fallzeit aus E1: quadrieren und mit 5 multiplizieren. In einer Formel der Tabellenkalkulation steht * für „mal“. [[tabellenkalkulation|Tabellenkalkulation]]",
        loesung: "In E1 steht die Fallzeit 2 s. Quadriert ergibt das 4, mal 5 sind das <b>20 m</b>. Für C2 wird der Wert aus C1 quadriert und mit 5 multipliziert. In der Tabellenkalkulation schreibt man das als <b>=C1*C1*5</b>.",
      },
      {
        text: "<p>Die Dachrinne hängt 11,25 m über dem Boden. Wie viele Sekunden braucht ein Eiszapfen bis zum Boden?</p>",
        antwort: 1.5, toleranz: 0.01, einheit: "s",
        tipp: "Löse 5 · t² = 11,25 nach t auf: Teile zuerst durch 5 und ziehe dann die Wurzel. [[gleichungen|Gleichungen lösen]] · [[wurzeln|Wurzeln]]",
        loesung: "Die Fallstrecke soll 11,25 m betragen, also gilt 5t² = 11,25. Teilt man durch 5, erhält man t² = 2,25. Die Wurzel aus 2,25 ist 1,5. Der Eiszapfen braucht also <b>1,5 s</b> bis zum Boden.",
      },
    ],
  },

  5: {
    titel: "Im Skiverleih",
    thema: "Proportionalität · Prozent",
    wissen: ["rechengesetze"],
    einleitung: "<p>Zum Dorffest gehört ein Skirennen. Toni vom Skiverleih gibt die Skier aus. Der Preis ist proportional zur Anzahl der Paare.</p>",
    fund: "In einem Skischuh steckt ein goldener Stern!",
    aufgaben: [
      {
        text: "<p>12 Paar Skier kosten zusammen 144 € pro Tag. Was kosten 7 Paar pro Tag?</p>",
        antwort: 84, toleranz: 0.01, einheit: "€",
        tipp: "Der Preis ist proportional zur Anzahl der Paare. Rechne zuerst aus, was ein Paar kostet. [[proportional|Proportionale Zuordnung und Dreisatz]]",
        loesung: "Ein Paar kostet 144 € : 12 = 12 € pro Tag. Sieben Paare kosten deshalb 7 · 12 € = <b>84 €</b> pro Tag.",
      },
      {
        text: "<p>Im nächsten Jahr steigt die Leihgebühr um 15 %. Gruppen erhalten auf den neuen Preis 10 % Rabatt. Was kosten dann 7 Paar pro Tag?</p>",
        antwort: 86.94, toleranz: 0.011, einheit: "€",
        tipp: "Prozentänderungen nacheinander rechnest du mit Faktoren: · 1,15 und · 0,90. [[prozent-faktor|Wachstumsfaktor]]",
        loesung: "Eine Erhöhung um 15 % bedeutet: mal 1,15. Aus 84 € werden 84 € · 1,15 = 96,60 €. 10 % Rabatt bedeutet: mal 0,9. Also kosten 7 Paar dann 96,60 € · 0,9 = <b>86,94 €</b>. Achtung: +15 % und −10 % ergeben zusammen nicht +5 %, sondern nur +3,5 %.",
      },
    ],
  },

  6: {
    titel: "Kugeln für den Dorfbaum",
    thema: "Baumdiagramm ohne Zurücklegen",
    wissen: ["wahrscheinlichkeit"],
    einleitung: "<p>Der große Weihnachtsbaum auf dem Dorfplatz soll geschmückt werden. In einer Schachtel liegen 1 goldene (G), 3 rote (R) und 4 silberne (S) Kugeln. Lena zieht ohne hinzusehen nacheinander zwei Kugeln und legt die erste nicht zurück.</p>",
    grafiken: ["baum"],
    fund: "Ganz unten in der Kugelschachtel liegt ein goldener Stern.",
    aufgaben: [
      {
        typ: "auswahl",
        text: "<p>Wie groß ist die Wahrscheinlichkeit, zuerst eine rote und dann eine silberne Kugel zu ziehen?</p>",
        optionen: ["$\\frac{3}{14}$", "$\\frac{3}{16}$", "$\\frac{1}{8}$"],
        antwort: 0,
        tipp: "Beim ersten Zug liegen 8 Kugeln in der Schachtel, beim zweiten nur noch 7. Multipliziere die Wahrscheinlichkeiten entlang des Pfads R → S. [[baumdiagramm|Pfadregeln im Baumdiagramm]]",
        loesung: "Zuerst sind 3 von 8 Kugeln rot, also ist P(R) = 3/8. Danach liegen nur noch 7 Kugeln in der Schachtel, davon 4 silberne, also ist P(S) = 4/7. Nach der Pfadmultiplikationsregel gilt $P(R,S) = \\frac{3}{8} \\cdot \\frac{4}{7} = \\frac{12}{56} = \\frac{3}{14}$.",
      },
      {
        text: "<p>Lena gewinnt, wenn beide Kugeln die gleiche Farbe haben. Berechne die Gewinnwahrscheinlichkeit in Prozent (auf eine Nachkommastelle).</p>",
        antwort: 32.1, toleranz: 0.15, einheit: "%",
        tipp: "Es gibt nur eine goldene Kugel. Addiere die Pfade R-R und S-S. [[ohne-zuruecklegen|Ziehen ohne Zurücklegen]]",
        loesung: "Zwei goldene Kugeln sind nicht möglich, weil es nur eine gibt. Für zwei rote gilt $P(R,R) = \\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56}$, für zwei silberne $P(S,S) = \\frac{4}{8} \\cdot \\frac{3}{7} = \\frac{12}{56}$. Nach der Pfadadditionsregel addiert man beide: $\\frac{18}{56} \\approx 0{,}321$. Lena gewinnt also mit einer Wahrscheinlichkeit von etwa <b>32,1 %</b>.",
      },
    ],
  },

  7: {
    titel: "Die Rodelbahn",
    thema: "Trigonometrie",
    wissen: ["trigonometrie"],
    einleitung: "<p>Finn und Ella sollen die Rodelbahn für das Fest testen. Vielleicht ist am Hang ja ein Stern gelandet?</p>",
    fund: "Am Ende der Rodelbahn steckt ein goldener Stern im Schnee.",
    aufgaben: [
      {
        text: "<p>Der Hang ist waagerecht gemessen 160 m lang und 30 m hoch. Wie groß ist der Neigungswinkel α (auf eine Nachkommastelle)?</p>",
        grafiken: ["rodelA"],
        antwort: 10.6, toleranz: 0.06, einheit: "°",
        tipp: "Du kennst die Höhe (Gegenkathete von α) und die waagerechte Länge (Ankathete). Welche Winkelfunktion verbindet diese beiden Seiten? [[sin-cos-tan|Sinus, Kosinus, Tangens]] · [[winkel-berechnen|Winkel berechnen]]",
        loesung: "Die Höhe 30 m liegt dem Winkel α gegenüber (Gegenkathete), die waagerechte Strecke 160 m liegt an α an (Ankathete). Deshalb nutzt man den Tangens: tan α = 30 : 160 = 0,1875. Mit der Taste tan⁻¹ erhält man α ≈ <b>10,6°</b>.",
      },
      {
        text: "<p>Eine zweite Bahn führt vom Start A 120 m bis zur Kurve B und dann 90 m bis zum Ziel C. In der Kurve beträgt der Winkel 130°. Wie weit liegen Start und Ziel in Luftlinie auseinander?</p>",
        grafiken: ["rodelB"],
        antwort: 190.7, toleranz: 0.3, einheit: "m",
        tipp: "Das Dreieck ABC ist nicht rechtwinklig. Du kennst zwei Seiten und den Winkel dazwischen – dafür gibt es den [[kosinussatz|Kosinussatz]]: AC² = AB² + BC² − 2 · AB · BC · cos(130°).",
        loesung: "Im Dreieck ABC kennt man die Seiten AB = 120 m und BC = 90 m und den Winkel dazwischen. Mit dem Kosinussatz gilt AC² = 120² + 90² − 2 · 120 · 90 · cos 130° ≈ 14 400 + 8 100 + 13 884 = 36 384. Daraus folgt AC = √36 384 ≈ <b>190,7 m</b>.",
      },
    ],
  },

  8: {
    titel: "Oma Friedas heißer Kakao",
    thema: "Exponentialfunktion",
    wissen: ["funktionen"],
    einleitung: "<p>Am Kakao-Stand schenkt Oma Frieda heißen Kakao aus. Die Temperatur beschreibt sie mit der Funktion t(x) = 80 · 0,9<sup>x</sup> (x: Zeit in Minuten, t(x): Temperatur in °C).</p>",
    fund: "Unter dem großen Kakaotopf klebt ein goldener Stern!",
    aufgaben: [
      {
        text: "<p>Welche Temperatur hat der Kakao nach 3 Minuten (auf eine Nachkommastelle)?</p>",
        antwort: 58.3, toleranz: 0.06, einheit: "°C",
        tipp: "Setze x = 3 in die Funktion ein: t(3) = 80 · 0,9³. [[exponentialfunktion|Exponentialfunktion]]",
        loesung: "Man setzt x = 3 in die Funktion ein: t(3) = 80 · 0,9³ = 80 · 0,729 = 58,32. Nach 3 Minuten ist der Kakao also noch etwa <b>58,3 °C</b> warm.",
      },
      {
        text: "<p>Zu Beginn (x = 0) ist der Kakao 80 °C heiß. Nach wie vielen Minuten ist er nur noch halb so heiß wie am Anfang, also 40 °C (auf eine Nachkommastelle)?</p>",
        antwort: 6.6, toleranz: 0.06, einheit: "min",
        tipp: "Löse 80 · 0,9<sup>x</sup> = 40. Teile zuerst durch 80 und nutze dann den Logarithmus – oder probiere systematisch. [[logarithmus|Exponentialgleichungen lösen]]",
        loesung: "Gesucht ist der Zeitpunkt, an dem t(x) = 40 ist, denn 40 °C ist die Hälfte der Anfangstemperatur von 80 °C. Aus 80 · 0,9<sup>x</sup> = 40 folgt 0,9<sup>x</sup> = 0,5. Mit dem Logarithmus erhält man x = log(0,5) : log(0,9) ≈ 6,58. Nach etwa <b>6,6 min</b> hat sich die Temperatur halbiert.",
      },
    ],
  },

  9: {
    titel: "Ein Iglu für die Kinder",
    thema: "Volumen · Dichte",
    wissen: ["koerper"],
    einleitung: "<p>Ida und Noah bauen für die Kinder von Noelville ein Iglu. Aus dem zugefrorenen See sägen sie einen würfelförmigen Eisblock mit der Kantenlänge 40 cm.</p>",
    grafiken: ["eis"],
    fund: "Mitten im Eisblock schimmert ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Der Würfel wird in zwei gleich große Quader zersägt. Wie groß ist das Volumen eines Quaders in Litern (dm³)?</p>",
        antwort: 32, toleranz: 0.01, einheit: "dm³",
        tipp: "Rechne die Kantenlänge zuerst in dm um: 40 cm = 4 dm. Ein Würfel hat das Volumen a · a · a. [[quader-wuerfel|Würfel und Quader]] · [[einheiten|Einheiten umrechnen]]",
        loesung: "40 cm sind 4 dm. Der ganze Würfel hat das Volumen 4 dm · 4 dm · 4 dm = 64 dm³. Beim Zersägen entstehen zwei gleich große Quader, also hat jeder Quader <b>32 dm³</b>. Das sind 32 Liter.",
      },
      {
        text: "<p>Eis hat die Dichte 0,92 g/cm³. Wie viele Kilogramm wiegt der ganze Eiswürfel (auf eine Nachkommastelle)?</p>",
        antwort: 58.9, toleranz: 0.06, einheit: "kg",
        tipp: "Masse = Volumen · Dichte. Rechne das Volumen in cm³. [[dichte|Masse und Dichte]]",
        loesung: "Das Volumen des Würfels beträgt 40³ = 64 000 cm³. Jeder Kubikzentimeter Eis wiegt 0,92 g, also wiegt der Würfel 64 000 · 0,92 g = 58 880 g. Das sind ungefähr <b>58,9 kg</b>.",
      },
    ],
  },

  10: {
    titel: "Nikkis Schneetagebuch",
    thema: "Statistik · Mittelwerte",
    wissen: ["wahrscheinlichkeit"],
    einleitung: "<p>Um die Größe seines Schneemanns im Auge zu behalten, misst Wetterwart Nikki jeden Morgen, wie viel Neuschnee gefallen ist, und trägt es in eine Tabelle ein. Die Tabelle zeigt die letzte Woche.</p>",
    grafiken: ["T:schnee"],
    fund: "Der Schneemann trägt einen goldenen Stern als Knopf!",
    aufgaben: [
      {
        text: "<p>Gib das arithmetische Mittel und den Median an.</p>",
        felder: [
          { antwort: 14, toleranz: 0.01, einheit: "cm", label: "Mittelwert" },
          { antwort: 15, toleranz: 0.01, einheit: "cm", label: "Median" },
        ],
        tipp: "Für das arithmetische Mittel addierst du alle Werte und teilst durch ihre Anzahl. Für den Median sortierst du die Werte der Größe nach: Der Median ist der Wert, der genau in der Mitte steht. [[mittelwert|Arithmetisches Mittel]] · [[median|Median]]",
        loesung: "Die Summe aller Werte ist 5 + 20 + 15 + 10 + 12 + 15 + 21 = 98 cm. Geteilt durch 7 Tage ergibt das einen Mittelwert von <b>14 cm</b>. Für den Median sortiert man die Werte: 5, 10, 12, 15, 15, 20, 21. Der mittlere, also der vierte Wert ist der Median: <b>15 cm</b>.",
      },
      {
        text: "<p>Am nächsten Montag misst Nikki noch einmal. Danach beträgt der Mittelwert aller 8 Tage genau 16 cm. Wie viel Neuschnee ist am achten Tag gefallen?</p>",
        antwort: 30, toleranz: 0.01, einheit: "cm",
        tipp: "Der Mittelwert mal die Anzahl der Werte ergibt die Summe aller Werte. [[mittelwert|Arithmetisches Mittel]]",
        loesung: "Wenn der Mittelwert von 8 Tagen 16 cm beträgt, ist die Summe aller 8 Werte 8 · 16 = 128 cm. Bisher waren es 98 cm. Am achten Tag sind also 128 − 98 = <b>30 cm</b> Neuschnee gefallen.",
      },
    ],
  },

  11: {
    titel: "Schneeflocken für die Fabrikfenster",
    thema: "Vielecke · Flächen",
    wissen: ["trigonometrie", "koerper"],
    einleitung: "<p>Die Kinder von Noelville basteln Schneeflocken für die großen Fenster der Frosti-Fabrik. Jede Flocke klebt auf einem regelmäßigen Sechseck aus Transparentpapier.</p>",
    grafiken: ["flocke"],
    fund: "Hinter dem großen Schneeflocken-Schild der Fabrik klemmt ein goldener Stern.",
    aufgaben: [
      {
        typ: "auswahl",
        text: "<p>Wie groß ist die Summe aller Innenwinkel eines Sechsecks? Ein Innenwinkel ist in der Skizze grün markiert.</p>",
        optionen: ["540°", "720°", "1080°"],
        antwort: 1,
        tipp: "Zerlege das Sechseck von einer Ecke aus in Dreiecke. Jedes Dreieck hat die Winkelsumme 180°. [[winkelsumme|Winkelsumme in Vielecken]]",
        loesung: "Von einer Ecke aus lässt sich ein Sechseck in 4 Dreiecke zerlegen. Jedes Dreieck hat die Winkelsumme 180°. Die Innenwinkelsumme ist also (6 − 2) · 180° = 4 · 180° = <b>720°</b>. Jeder einzelne Innenwinkel des regelmäßigen Sechsecks ist damit 720° : 6 = 120° groß.",
      },
      {
        text: "<p>Das Sechseck hat die Seitenlänge a = 10 cm. Berechne seinen Flächeninhalt (auf eine Nachkommastelle).</p>",
        antwort: 259.8, toleranz: 0.3, einheit: "cm²",
        tipp: "Ein regelmäßiges Sechseck besteht aus 6 gleichseitigen Dreiecken mit der Seitenlänge a. Höhe eines gleichseitigen Dreiecks: h = a/2 · √3. [[vieleck-flaeche|Regelmäßiges Sechseck]]",
        loesung: "Das Sechseck besteht aus 6 gleichseitigen Dreiecken mit der Seitenlänge 10 cm. Die Höhe eines Dreiecks ist h = 5 · √3 ≈ 8,66 cm. Ein Dreieck hat damit die Fläche ½ · 10 · 8,66 ≈ 43,3 cm². Das ganze Sechseck ist sechsmal so groß, also etwa <b>259,8 cm²</b>.",
      },
    ],
  },

  12: {
    titel: "Die Tombola",
    thema: "Wahrscheinlichkeit",
    wissen: ["wahrscheinlichkeit"],
    einleitung: "<p>An der Marktbude von Herrn Huber gibt es eine Tombola mit 200 Losen. 20 davon sind Gewinne, der Rest sind Nieten. Gezogene Lose werden nicht zurückgelegt.</p>",
    fund: "Zwischen den Losen im Lostopf liegt ein goldener Stern.",
    aufgaben: [
      {
        typ: "auswahl",
        text: "<p>Wie groß ist die Wahrscheinlichkeit, dass das erste Los ein Gewinn ist?</p>",
        optionen: ["1 %", "5 %", "10 %", "20 %"],
        antwort: 2,
        tipp: "Wahrscheinlichkeit = Anzahl der Gewinne : Anzahl aller Lose. [[laplace|Laplace-Wahrscheinlichkeit]]",
        loesung: "Von 200 Losen sind 20 Gewinne. Die Wahrscheinlichkeit für einen Gewinn ist deshalb 20 : 200 = 0,1 = <b>10 %</b>.",
      },
      {
        text: "<p>Es wurden schon 50 Nieten und kein Gewinn gezogen. Wie groß ist jetzt die Gewinnwahrscheinlichkeit für das nächste Los (in %, auf eine Nachkommastelle)?</p>",
        antwort: 13.3, toleranz: 0.06, einheit: "%",
        tipp: "Wie viele Lose sind noch im Topf, und wie viele davon sind Gewinne? [[ohne-zuruecklegen|Ziehen ohne Zurücklegen]]",
        loesung: "Nach 50 gezogenen Nieten liegen noch 150 Lose im Topf. Alle 20 Gewinne sind noch dabei. Die Wahrscheinlichkeit ist jetzt 20 : 150 ≈ 0,133, also etwa <b>13,3 %</b>. Die Chance ist größer geworden, weil nur Nieten herausgenommen wurden.",
      },
    ],
  },

  13: {
    titel: "Die Schneekanone",
    thema: "Lineare Funktionen",
    wissen: ["funktionen"],
    einleitung: "<p>Für das Skirennen am Festtag muss die Übungspiste weiß sein. Sie ist 3 500 m² groß, 600 m² sind bereits beschneit. Pistenwart Sepps Schneekanone beschneit pro Stunde weitere 250 m².</p>",
    fund: "Aus dem Rohr der Schneekanone purzelt ein goldener Stern!",
    aufgaben: [
      {
        typ: "auswahl",
        text: "<p>Welche Funktion beschreibt die beschneite Fläche f(x) nach x Stunden?</p>",
        optionen: ["f(x) = 600 + 250x", "f(x) = 3500 + 250x", "f(x) = 600 · 250x"],
        antwort: 0,
        tipp: "Eine lineare Funktion hat die Form f(x) = m · x + b. Der Startwert b ist die Fläche, die schon beschneit ist. Die Steigung m ist das, was pro Stunde dazukommt. [[lineare-funktion|Lineare Funktionen]]",
        loesung: "Zu Beginn sind schon 600 m² beschneit, das ist der Startwert. Pro Stunde kommen 250 m² dazu, das ist die Steigung. Die Funktion lautet daher <b>f(x) = 600 + 250x</b>.",
      },
      {
        text: "<p>Nach wie vielen Stunden ist die ganze Piste beschneit (auf eine Nachkommastelle)?</p>",
        antwort: 11.6, toleranz: 0.01, einheit: "h",
        tipp: "Setze f(x) = 3500 und löse nach x auf. [[gleichungen|Gleichungen lösen]]",
        loesung: "Die Piste ist ganz beschneit, wenn f(x) = 3500 ist. Aus 600 + 250x = 3500 folgt 250x = 2900 und damit x = 11,6. Nach <b>11,6 Stunden</b> ist die ganze Piste weiß.",
      },
    ],
  },

  14: {
    titel: "Der Schatten der Tanne",
    thema: "Strahlensatz · Trigonometrie",
    wissen: ["trigonometrie"],
    einleitung: "<p>Förster Lutz sucht am Waldrand nach Spuren der Sterne. Eine 3 m hohe Tanne wirft in der Mittagssonne einen 4 m langen Schatten. Lutz (1,80 m) stellt sich so in den Schatten, dass sein Schatten genau am Ende des Tannenschattens endet.</p>",
    grafiken: ["schatten"],
    fund: "In der Spitze der Tanne funkelt ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Wie lang ist der Schatten von Lutz?</p>",
        antwort: 2.4, toleranz: 0.01, einheit: "m",
        tipp: "Die Sonnenstrahlen bilden mit Tanne und Lutz zwei ähnliche Dreiecke. Lutz ist 1,80 m : 3 m = 0,6-mal so groß wie die Tanne – sein Schatten also auch. [[strahlensatz|Strahlensätze]]",
        loesung: "Die Tanne und Lutz stehen beide senkrecht, und die Sonnenstrahlen sind parallel. Deshalb gilt der Strahlensatz: Schatten von Lutz : 4 m = 1,80 m : 3 m. Lutz ist 0,6-mal so groß wie die Tanne, also ist sein Schatten 4 m · 0,6 = <b>2,4 m</b> lang.",
      },
      {
        text: "<p>Unter welchem Winkel α treffen die Sonnenstrahlen auf den Boden (auf eine Nachkommastelle)?</p>",
        antwort: 36.9, toleranz: 0.06, einheit: "°",
        tipp: [
          "Tanne, Schatten und Sonnenstrahl bilden ein rechtwinkliges Dreieck. Vom Winkel α aus gesehen liegt die Tanne gegenüber (Gegenkathete), der Schatten liegt an α an (Ankathete). [[rechtwinkliges-dreieck|Seiten im rechtwinkligen Dreieck]]",
          "Der Tangens verbindet genau diese beiden Seiten: tan α = Gegenkathete : Ankathete. Den Winkel selbst erhältst du mit der Umkehrfunktion tan⁻¹ (auf dem Taschenrechner meist „shift“ und dann „tan“). [[winkel-berechnen|Winkel mit tan⁻¹ berechnen]]",
        ],
        loesung: "Im rechtwinkligen Dreieck aus Tanne, Schatten und Sonnenstrahl ist die Tannenhöhe 3 m die Gegenkathete von α und der Schatten 4 m die Ankathete. Für den Tangens gilt: tan α = Gegenkathete : Ankathete = 3 : 4 = 0,75. Um aus dem Tangenswert den Winkel zu bekommen, nutzt man die Umkehrfunktion tan⁻¹ (auf dem Taschenrechner meist „shift“ und „tan“): α = tan⁻¹(0,75) ≈ <b>36,9°</b>. Die Sonnenstrahlen treffen also unter etwa 36,9° auf den Boden.",
      },
    ],
  },

  15: {
    titel: "Tribüne an der Eisbahn",
    thema: "Terme · Muster",
    wissen: ["rechengesetze"],
    einleitung: "<p>Zum Fest gibt es ein Eishockeyspiel: Noelville gegen das Nachbardorf. In der ersten Reihe der Tribüne gibt es 8 Plätze, in der zweiten 10, in der dritten 12. So geht es weiter.</p>",
    grafiken: ["tribuene"],
    fund: "Unter einem Sitz in der ersten Reihe liegt ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Wie viele Plätze hat Reihe 5? Welcher Term beschreibt die Anzahl in Reihe n?</p>",
        felder: [
          { antwort: 16, toleranz: 0.01, einheit: "Plätze", label: "Reihe 5:" },
          { typ: "auswahl", label: "Term für Reihe n", optionen: ["8 + 2n", "6 + 2n", "8n + 2"], antwort: 1 },
        ],
        tipp: "Von Reihe zu Reihe kommen immer 2 Plätze dazu. Prüfe die Terme, indem du n = 1 einsetzt: Es müssen 8 Plätze herauskommen. [[terme|Terme aufstellen]]",
        loesung: "Pro Reihe kommen 2 Plätze dazu: 8, 10, 12, 14, 16. Reihe 5 hat also <b>16 Plätze</b>. Der Term muss für n = 1 die Zahl 8 ergeben und pro Reihe um 2 wachsen. Das passt bei <b>6 + 2n</b>, denn 6 + 2 · 1 = 8 und 6 + 2 · 5 = 16.",
      },
      {
        text: "<p>Die Tribüne hat 10 Reihen. Wie viele Plätze gibt es insgesamt?</p>",
        antwort: 170, toleranz: 0.01, einheit: "Plätze",
        tipp: "Reihe 10 hat 6 + 2 · 10 Plätze. Fasse die Reihen paarweise zusammen: erste + letzte, zweite + vorletzte … [[terme|Terme aufstellen]]",
        loesung: "Reihe 10 hat 6 + 2 · 10 = 26 Plätze. Fasst man die Reihen paarweise zusammen (Reihe 1 und 10, Reihe 2 und 9 und so weiter), hat jedes Paar 8 + 26 = 34 Plätze. Es gibt 5 solche Paare, also hat die Tribüne 5 · 34 = <b>170 Plätze</b>.",
      },
    ],
  },

  16: {
    titel: "Der Sprunghügel",
    thema: "Quadratische Funktionen",
    wissen: ["funktionen"],
    einleitung: "<p>Für die Snowboard-Show am Festtag schaufeln die Jugendlichen von Noelville einen Sprunghügel. Sein Profil ist eine Parabel.</p>",
    fund: "Auf der Spitze des Hügels steckt ein goldener Stern.",
    aufgaben: [
      {
        typ: "auswahl",
        text: "<p>Welche Funktion ist dieselbe wie f(x) = x² + 6x + 10, aber in Scheitelpunktform?</p>",
        optionen: ["f(x) = (x + 3)² + 10", "f(x) = (x + 3)² + 1", "f(x) = (x − 3)² + 1"],
        antwort: 1,
        tipp: "Multipliziere die Antworten mit der binomischen Formel aus und vergleiche mit x² + 6x + 10. Es muss genau dasselbe herauskommen. [[scheitelpunkt|Scheitelpunktform]]",
        loesung: "Multipliziert man (x + 3)² mit der binomischen Formel aus, erhält man x² + 6x + 9. Damit am Ende + 10 dasteht, fehlt noch 1. Die Scheitelpunktform lautet also <b>f(x) = (x + 3)² + 1</b>. Der Scheitelpunkt liegt bei S(−3 | 1).",
      },
      {
        text: "<p>Das Hügelprofil ist h(x) = −0,05x² + 0,8x (alle Angaben in m). Wie hoch ist der Hügel an der höchsten Stelle und wie breit ist er am Boden?</p>",
        grafiken: ["huegel"],
        felder: [
          { antwort: 3.2, toleranz: 0.01, einheit: "m", label: "Höhe" },
          { antwort: 16, toleranz: 0.01, einheit: "m", label: "Breite" },
        ],
        tipp: "Nullstellen: x · (−0,05x + 0,8) = 0. Der Scheitel liegt genau in der Mitte zwischen den Nullstellen. [[nullstellen|Nullstellen]] · [[scheitelpunkt|Scheitelpunkt]]",
        loesung: "Die Nullstellen erhält man durch Ausklammern: x · (−0,05x + 0,8) = 0. Das gilt für x = 0 und für −0,05x + 0,8 = 0, also x = 16. Der Hügel ist am Boden deshalb <b>16 m</b> breit. Der Scheitel liegt genau in der Mitte bei x = 8. Dort ist h(8) = −0,05 · 64 + 0,8 · 8 = −3,2 + 6,4 = <b>3,2 m</b>. Das ist die höchste Stelle.",
      },
    ],
  },

  17: {
    titel: "Kerzen für die Festtafel",
    thema: "Zylinder · Kugel",
    wissen: ["koerper"],
    einleitung: "<p>Im Kakao-Stand gießt Greta Kerzen für die lange Festtafel. Jeder Wachszylinder hat r = 3 cm und h = 8 cm.</p>",
    grafiken: ["kerze"],
    fund: "In einem Wachsblock steckt ein goldener Stern!",
    aufgaben: [
      {
        text: "<p>Berechne das Volumen des Wachszylinders (auf eine Nachkommastelle).</p>",
        antwort: 226.2, toleranz: 0.25, einheit: "cm³",
        tipp: "Ein Zylinder hat das Volumen V = π · r² · h. [[zylinder|Zylinder]]",
        loesung: "Für einen Zylinder gilt V = π · r² · h. Mit r = 3 cm und h = 8 cm ergibt sich V = π · 9 · 8 = 72π ≈ <b>226,2 cm³</b>.",
      },
      {
        text: "<p>Aus einem Wachszylinder sollen Kugelkerzen mit r = 2 cm gegossen werden. Wie viele vollständige Kugeln kann man herstellen?</p>",
        antwort: 6, toleranz: 0.01, einheit: "Kugeln",
        tipp: "Kugelvolumen: V = 4/3 · π · r³. Teile das Wachs des Zylinders durch das Volumen einer Kugel. [[kugel|Kugel]]",
        loesung: "Eine Kugel mit r = 2 cm hat das Volumen V = 4/3 · π · 2³ ≈ 33,5 cm³. Der Zylinder enthält 226,2 cm³ Wachs. 226,2 : 33,5 ≈ 6,75. Es reicht also für <b>6 vollständige Kugeln</b>, für eine siebte ist nicht mehr genug Wachs übrig.",
      },
    ],
  },

  18: {
    titel: "Würfeln am Kamin",
    thema: "Relative Häufigkeit",
    wissen: ["wahrscheinlichkeit"],
    einleitung: "<p>In seiner Hütte am Kamin hat Wirt Emil einen Würfel aus Holz geschnitzt, der nicht ganz gleichmäßig ist. Für das Würfelspiel beim Fest testet er ihn und würfelt 500-mal.</p>",
    grafiken: ["T:wuerfel"],
    fund: "Im Korb mit dem Kaminholz liegt ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Wie oft fiel die Sechs?</p>",
        antwort: 114, toleranz: 0.01, einheit: "-mal",
        tipp: "Alle Häufigkeiten zusammen ergeben 500. Ziehe die bekannten Zahlen von 500 ab. [[relative-haeufigkeit|Absolute und relative Häufigkeit]]",
        loesung: "Insgesamt wurde 500-mal gewürfelt. Die Zahlen 1 bis 5 kamen zusammen 55 + 58 + 88 + 75 + 110 = 386-mal vor. Für die Sechs bleiben 500 − 386 = <b>114</b> Würfe.",
      },
      {
        text: "<p>Emil nimmt die relativen Häufigkeiten als Wahrscheinlichkeiten und würfelt zweimal. Wie groß ist die Wahrscheinlichkeit für einen Pasch, also zweimal dieselbe Zahl (in %, auf eine Nachkommastelle)?</p>",
        antwort: 17.9, toleranz: 0.06, einheit: "%",
        tipp: "P(Pasch) = P(1,1) + P(2,2) + … + P(6,6), dabei ist z. B. P(1,1) = 0,11². [[relative-haeufigkeit|Relative Häufigkeit]] · [[baumdiagramm|Pfadregeln]]",
        loesung: "Die relativen Häufigkeiten sind 55 : 500 = 0,11 sowie 0,116; 0,176; 0,15; 0,22 und 0,228. Für einen Pasch muss zweimal dieselbe Zahl fallen. Nach der Pfadmultiplikationsregel ist zum Beispiel P(1,1) = 0,11² = 0,0121. Addiert man alle sechs Quadrate, erhält man etwa 0,1794. Die Wahrscheinlichkeit für einen Pasch beträgt also etwa <b>17,9 %</b>.",
      },
    ],
  },

  19: {
    titel: "Ausblick vom Turm",
    thema: "Trigonometrie",
    wissen: ["trigonometrie"],
    einleitung: "<p>Von oben sieht man am besten, wo noch Sterne liegen könnten! Ben und Mira gehen zum 20 m hohen Aussichtsturm am zugefrorenen See. Ben steht am vorderen Ufer und sieht die Turmspitze unter einem Höhenwinkel von 32°. Mira steht genau gegenüber am anderen Ufer und misst 8°.</p>",
    grafiken: ["see"],
    fund: "Ganz oben auf der Turmspitze glänzt ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Wie weit steht Ben vom Fuß des Turms entfernt (auf eine Nachkommastelle)?</p>",
        antwort: 32, toleranz: 0.15, einheit: "m",
        tipp: [
          "Turm, Boden und Bens Blicklinie zur Turmspitze bilden ein rechtwinkliges Dreieck. Der rechte Winkel liegt am Fuß des Turms. [[rechtwinkliges-dreieck|Seiten im rechtwinkligen Dreieck]]",
          "Vom Winkel 32° aus gesehen ist die Turmhöhe (20 m) die Gegenkathete, Bens Abstand d ist die Ankathete. Also gilt tan 32° = 20 : d. Stelle nach d um: d = 20 : tan 32°. [[sin-cos-tan|Tangens]]",
        ],
        loesung: "Turm, Boden und Bens Blicklinie bilden ein rechtwinkliges Dreieck. Vom Höhenwinkel 32° aus ist die Turmhöhe die Gegenkathete und Bens Abstand d die Ankathete. Also gilt tan 32° = 20 : d. Stellt man nach d um, erhält man d = 20 : tan 32° ≈ 20 : 0,6249 ≈ <b>32,0 m</b>.",
      },
      {
        text: "<p>Wie breit ist der See (auf eine ganze Zahl gerundet)?</p>",
        antwort: 110, toleranz: 0.6, einheit: "m",
        tipp: [
          "Mira steht auf derselben Linie wie Ben, nur weiter weg. Berechne zuerst wie in Aufgabe 1 die Entfernung vom Turm zu Mira – diesmal mit dem Winkel 8°. [[sin-cos-tan|Tangens]]",
          "Die Seebreite ist der Abstand zwischen Ben und Mira: Entfernung Turm–Mira minus Entfernung Turm–Ben.",
        ],
        loesung: "Für Mira gilt genauso tan 8° = 20 : e, also e = 20 : tan 8° ≈ 142,3 m. Ben steht 32,0 m vom Turm entfernt. Die Breite des Sees ist der Abstand zwischen beiden: 142,3 m − 32,0 m ≈ 110,3 m. Gerundet ist der See etwa <b>110 m</b> breit.",
      },
    ],
  },

  20: {
    titel: "Der Gasthof-Adventskalender",
    thema: "Terme · Gleichungen",
    wissen: ["rechengesetze"],
    einleitung: "<p>Wirtin Hanna verwandelt die Fassade des Gasthofs „Zum Goldenen Stern“ in einen Adventskalender mit 24 Türchen in 6 Spalten. Eine Papierfigur deckt immer drei Türchen ab: ein Feld, das Feld rechts daneben und das Feld darunter. Die Figur darf nicht gedreht werden.</p>",
    grafiken: ["kalender"],
    fund: "Hinter Türchen 11 leuchtet ein goldener Stern!",
    aufgaben: [
      {
        text: "<p>Die Summe der drei abgedeckten Zahlen ist 40. Welche Zahl liegt im Feld oben links der Figur?</p>",
        antwort: 11, toleranz: 0.01,
        tipp: "Ist n das Feld oben links, dann deckt die Figur n, n + 1 (rechts daneben) und n + 6 (darunter, denn eine Zeile hat 6 Felder) ab. Stelle damit eine Gleichung auf. [[terme|Terme aufstellen]] · [[gleichungen|Gleichungen lösen]]",
        loesung: "Liegt die Figur oben links auf dem Feld n, deckt sie auch das Feld rechts daneben (n + 1) und das Feld darunter (n + 6) ab. Ihre Summe ist n + (n + 1) + (n + 6) = 3n + 7. Aus 3n + 7 = 40 folgt 3n = 33 und damit n = <b>11</b>.",
      },
      {
        text: "<p>Welche größte Summe kann die Figur abdecken?</p>",
        antwort: 58, toleranz: 0.01,
        tipp: "Das Feld n darf nicht in der letzten Spalte und nicht in der letzten Zeile liegen. [[terme|Terme aufstellen]]",
        loesung: "Das Feld n darf nicht in der letzten Spalte liegen, sonst fehlt das Feld rechts daneben, und nicht in der letzten Zeile, sonst fehlt das Feld darunter. Das größte erlaubte Feld ist deshalb 17. Die Figur deckt dann 17 + 18 + 23 = <b>58</b> ab. Mehr geht nicht, weil die Summe 3n + 7 mit n wächst.",
      },
    ],
  },

  21: {
    titel: "Die Jackenfirma Frosti",
    thema: "Quadratische Funktionen · Gewinn",
    wissen: ["funktionen"],
    einleitung: "<p>Die Jackenfirma Frosti will für das Fest warme Jacken spenden. Chefin Frau Frost rechnet nach, was sie sich leisten kann. Für x verkaufte Jacken gilt: Kosten k(x) = 80x + 60 000, Erlös e(x) = 0,1x · (4000 − x), beides in Euro.</p>",
    grafiken: ["frosti"],
    fund: "In der Tasche einer Musterjacke steckt ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Berechne den Erlös für 500 verkaufte Jacken.</p>",
        antwort: 175000, toleranz: 0.5, einheit: "€",
        tipp: [
          "Der Erlös ist das Geld, das Frosti durch den Verkauf einnimmt. Setze x = 500 in die Erlösfunktion e(x) = 0,1x · (4000 − x) ein. [[kosten-erloes-gewinn|Kosten, Erlös und Gewinn]]",
          "Rechne Schritt für Schritt: erst 0,1 · 500, dann die Klammer 4000 − 500, dann beide Ergebnisse multiplizieren.",
        ],
        loesung: "Man setzt x = 500 in die Erlösfunktion ein: e(500) = 0,1 · 500 · (4000 − 500) = 50 · 3500 = 175 000. Bei 500 verkauften Jacken beträgt der Erlös also <b>175 000 €</b>.",
      },
      {
        text: "<p>Der Gewinn ist Erlös minus Kosten. Bei welcher Stückzahl ist der Gewinn am größten, und wie hoch ist er dann?</p>",
        felder: [
          { antwort: 1600, toleranz: 0.5, einheit: "Jacken", label: "Stückzahl" },
          { antwort: 196000, toleranz: 0.5, einheit: "€", label: "Gewinn" },
        ],
        tipp: [
          "Stelle zuerst die Gewinnfunktion auf: g(x) = e(x) − k(x). Setze die Kosten in Klammern, denn sie werden komplett abgezogen. [[kosten-erloes-gewinn|Kosten, Erlös und Gewinn]]",
          "Multipliziere aus und fasse zusammen: g(x) = 0,1x · (4000 − x) − (80x + 60 000) = −0,1x² + 320x − 60 000. Das ist eine nach unten geöffnete Parabel.",
          "Der höchste Punkt einer nach unten geöffneten Parabel ist ihr Scheitel. Bei g(x) = ax² + bx + c liegt er bei x = −b : (2a). Setze diesen x-Wert danach in g(x) ein. [[scheitelpunkt|Scheitelpunkt berechnen]]",
        ],
        loesung: "Der Gewinn ist Erlös minus Kosten: g(x) = 0,1x · (4000 − x) − (80x + 60 000) = −0,1x² + 320x − 60 000. Das ist eine nach unten geöffnete Parabel, ihr höchster Punkt ist der Scheitel. Er liegt bei x = −320 : (2 · (−0,1)) = <b>1600</b>. Setzt man 1600 ein, erhält man g(1600) = −256 000 + 512 000 − 60 000 = <b>196 000 €</b>. Bei 1600 verkauften Jacken ist der Gewinn also am größten.",
      },
    ],
  },

  22: {
    titel: "Kreisel für den Weihnachtsbasar",
    thema: "Kegel",
    wissen: ["koerper"],
    einleitung: "<p>Für den Weihnachtsbasar drechseln die Kinder von Noelville Kreisel. Der untere Teil ist ein Kegel (d = 6 cm, h = 4 cm), der aus einem Holzquader 6 cm × 6 cm × 4 cm entsteht.</p>",
    grafiken: ["kreisel"],
    fund: "Zwischen den Holzspänen liegt ein goldener Stern.",
    aufgaben: [
      {
        text: "<p>Berechne das Volumen des Kegels (auf eine Nachkommastelle).</p>",
        antwort: 37.7, toleranz: 0.06, einheit: "cm³",
        tipp: "Ein Kegel hat das Volumen V = ⅓ · π · r² · h. Achtung: Gegeben ist der Durchmesser, der Radius ist halb so groß. [[kegel|Kegel]]",
        loesung: "Der Durchmesser ist 6 cm, der Radius also 3 cm. Für den Kegel gilt V = ⅓ · π · r² · h = ⅓ · π · 9 · 4 = 12π ≈ <b>37,7 cm³</b>.",
      },
      {
        text: "<p>Die Mantelfläche des Kegels wird rot lackiert. Wie groß ist sie (auf eine Nachkommastelle)?</p>",
        antwort: 47.1, toleranz: 0.06, einheit: "cm²",
        tipp: "Berechne zuerst die Mantellinie s mit dem Satz des Pythagoras. Die Mantelfläche ist dann M = π · r · s. [[kegel|Kegel]] · [[pythagoras|Satz des Pythagoras]]",
        loesung: "Radius, Höhe und Mantellinie s bilden ein rechtwinkliges Dreieck. Mit dem Satz des Pythagoras ist s = √(3² + 4²) = √25 = 5 cm. Die Mantelfläche ist M = π · r · s = π · 3 · 5 = 15π ≈ <b>47,1 cm²</b>.",
      },
    ],
  },

  23: {
    titel: "Die Playlist der Dorfkapelle",
    thema: "Kombinatorik",
    wissen: ["wahrscheinlichkeit"],
    einleitung: "<p>Die Dorfkapelle spielt beim Fest live. In den Pausen läuft eine Playlist mit 12 Weihnachtsliedern im Zufallsmodus. Jedes Lied kann jedes Mal neu gewählt werden, also auch zweimal hintereinander.</p>",
    fund: "Im Trichter der Tuba steckt ein goldener Stern!",
    aufgaben: [
      {
        typ: "auswahl",
        text: "<p>Wie groß ist die Wahrscheinlichkeit, dass das Lied „Schneeflockenwalzer“ als erstes und gleich danach noch einmal als zweites Lied läuft?</p>",
        optionen: ["$\\frac{1}{12}$", "$\\frac{1}{24}$", "$\\frac{1}{144}$"],
        antwort: 2,
        tipp: "Beim ersten Lied ist die Chance 1 von 12, beim zweiten wieder 1 von 12. Beides soll nacheinander passieren – dann wird multipliziert. [[baumdiagramm|Pfadmultiplikationsregel]]",
        loesung: "Die Wahrscheinlichkeit, dass der „Schneeflockenwalzer“ als erstes Lied läuft, ist $\\frac{1}{12}$. Weil jedes Lied neu gewählt wird, ist sie beim zweiten Lied wieder $\\frac{1}{12}$. Nach der Pfadmultiplikationsregel gilt $\\frac{1}{12} \\cdot \\frac{1}{12} = \\frac{1}{144}$.",
      },
      {
        text: "<p>Es laufen vier Lieder. Wie groß ist die Wahrscheinlichkeit, dass kein Lied doppelt vorkommt (in %, auf eine Nachkommastelle)?</p>",
        antwort: 57.3, toleranz: 0.06, einheit: "%",
        tipp: "Alle Möglichkeiten: 12⁴. Günstige Möglichkeiten: 12 · 11 · 10 · 9. [[kombinatorik|Zählprinzip]]",
        loesung: "Insgesamt gibt es 12 · 12 · 12 · 12 = 12⁴ = 20 736 mögliche Reihenfolgen. Damit kein Lied doppelt vorkommt, hat man für das erste Lied 12, für das zweite nur noch 11, dann 10 und 9 Möglichkeiten: 12 · 11 · 10 · 9 = 11 880. Die Wahrscheinlichkeit beträgt 11 880 : 20 736 ≈ <b>57,3 %</b>. In fast jeder zweiten Pause kommt also ein Lied doppelt vor.",
      },
    ],
  },

  24: {
    titel: "Heiligabend in Noelville",
    thema: "Zylinder · Modellieren",
    wissen: ["koerper"],
    einleitung: "<p>Heiligabend! An der Litfaßsäule auf dem Dorfplatz sollen die Plakate für das große Dorffest hängen. Die Säule hat einen Durchmesser von 1,20 m. Beklebt werden darf ein 2,60 m hoher Streifen.</p>",
    grafiken: ["saeule"],
    fund: "Oben auf der Litfaßsäule thront der letzte goldene Stern!",
    aufgaben: [
      {
        text: "<p>Wie groß ist die beklebbare Fläche (auf zwei Nachkommastellen)?</p>",
        antwort: 9.8, toleranz: 0.015, einheit: "m²",
        antwortText: "9,80",
        tipp: "Die beklebbare Fläche ist ein Teil des Mantels eines Zylinders: Umfang mal Höhe, also M = π · d · h. [[zylinder|Zylinder]]",
        loesung: "Die beklebbare Fläche ist der Mantel eines Zylinders mit d = 1,20 m und h = 2,60 m. Der Umfang beträgt π · 1,20 m ≈ 3,77 m. Mal die Höhe ergibt das π · 1,20 m · 2,60 m ≈ <b>9,80 m²</b>.",
      },
      {
        text: "<p>Die Plakate sind 84,1 cm breit und 118,9 cm hoch und werden alle hochkant ohne Überlappung geklebt. Wie viele passen höchstens auf die Säule?</p>",
        antwort: 8, toleranz: 0.01, einheit: "Plakate",
        tipp: "Wie viele passen nebeneinander auf den Umfang? Wie viele übereinander auf die Höhe? Es zählen nur ganze Plakate. [[zylinder|Zylinder]]",
        loesung: "Der Umfang der Säule beträgt π · 1,20 m ≈ 3,77 m. Nebeneinander passen 3,77 : 0,841 ≈ 4,48, also 4 ganze Plakate. Übereinander passen 2,60 : 1,189 ≈ 2,19, also 2 Plakate. Insgesamt passen höchstens 4 · 2 = <b>8 Plakate</b> auf die Säule.",
      },
    ],
  },
};

// Gemeinsame Quellenangabe für alle Tage ohne eigene
Object.values(AUFGABEN).forEach((t) => { if (!t.quelle) t.quelle = QUELLE; });

/* ---------------------------------------------------------
   BADGES (Abzeichen)
   anzahl: so viele goldene Sterne braucht man
   art: "schneeflocken" → zählt stattdessen die Bonus-Schneeflocken
   bild: Abzeichen-Bild im Ordner bilder/badges
   --------------------------------------------------------- */
const BADGES = [
  { id: "funke",          anzahl: 1,  bild: "bilder/badges/funke.webp",          name: "Erster Funke",           text: "Der erste goldene Stern leuchtet wieder über Noelville." },
  { id: "spuernase",      anzahl: 3,  bild: "bilder/badges/spuernase.webp",      name: "Sternen-Spürnase",       text: "Drei Sterne aufgespürt – die Bewohner schöpfen Hoffnung." },
  { id: "lichter",        anzahl: 7,  bild: "bilder/badges/lichter.webp",        name: "Lichterbringer",         text: "Eine Woche voller Sterne. Auf dem Dorfplatz wird es heller!" },
  { id: "halbzeit",       anzahl: 12, bild: "bilder/badges/halbzeit.webp",       name: "Halbzeit-Held",          text: "Die Hälfte der Sterne ist zurück. Der Dorfbaum strahlt schon." },
  { id: "dorfliebling",   anzahl: 18, bild: "bilder/badges/dorfliebling.webp",   name: "Liebling von Noelville", text: "18 Sterne! Ganz Noelville spricht von dir." },
  { id: "retter",         anzahl: 24, bild: "bilder/badges/retter.webp",         name: "Retter von Noelville",   text: "Alle 24 Sterne sind zurück – Weihnachten ist gerettet!" },
  { id: "eiskristall",    anzahl: 6,  art: "schneeflocken", bild: "bilder/badges/eiskristall.webp",    name: "Eiskristall-Kopf",      text: "Sechs Bonus-Rätsel geknackt. Respekt!" },
  { id: "flockenmeister", anzahl: 24, art: "schneeflocken", bild: "bilder/badges/flockenmeister.webp", name: "Schneeflocken-Meister", text: "Alle 24 Bonus-Rätsel gelöst. Du bist ein Mathe-Profi!" },
];
