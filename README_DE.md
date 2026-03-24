# 🌌 Interactive 3D Solar System Simulation

Eine interaktive **3D-Simulation** unseres Sonnensystems im Browser — basierend auf **Three.js (r140)** mit realer Orbitalmechanik, prozeduralen Texturen, echten Bahninklinationen und axialer Neigung.

![Three.js](https://img.shields.io/badge/Three.js-r140-green)
![Dark / Light](https://img.shields.io/badge/theme-dark%20%2F%20light-blue)
![No Build](https://img.shields.io/badge/build-none-lightgrey)

---

## Überblick

Das Projekt simuliert alle Planeten und Zwergplaneten des Sonnensystems mit ihren realen Umlaufbahnen, Geschwindigkeiten, Orbitalinklinationen und axialen Neigungen in einer vollständig interaktiven 3D-Umgebung. Die Kamera kann frei gedreht, gezoomt und geschwenkt werden. Alle Himmelskörper besitzen prozedurale Texturen — keine externen Bilddateien nötig.

---

## Features

### 🔭 Simulation & Physik
- **Kepler-Solver** — Löst die Kepler-Gleichung $E - e \sin E = M$ per Newton-Iteration (max. 15 Schritte, Toleranz $10^{-12}$) zur Berechnung der wahren Anomalie $\nu$
- **J2000-Epoche** — Startpositionen basieren auf astronomischen Referenzdaten: mittlere Länge ($L_0$), Perihelionslänge ($\varpi$)
- **3D-Orbitalebenen** — Jeder Planet hat seine reale Bahninklination ($i$) und Knotenlänge ($\Omega$) für korrekte 3D-Positionen
- **Axiale Neigung** — Alle Planeten sind mit realer Achsneigung (Tilt) dargestellt (z.B. Erde 23.44°, Uranus 97.77°)
- **Elliptische Bahnen** — Exzentrizität jedes Planeten berücksichtigt (von Venus $e=0.007$ bis Pluto $e=0.250$)
- **Vis-viva-Geschwindigkeit** — Berechnet die reale Orbitalgeschwindigkeit jedes Planeten via $v = \sqrt{\mu\left(\frac{2}{r} - \frac{1}{a}\right)}$
- **Axiale Rotation** — Jeder Planet rotiert mit seiner realen Tageslänge (inkl. retrograde Rotation bei Venus & Uranus)
- **Zeitsteuerung** — Play/Pause, Speed-Slider (0.001–100.000 Tage/s), ×0.1 / ×10 Buttons, numerische Eingabe
- **Speed-Presets** — Direkt-Buttons: 1 Tag/s, 1 Woche/s, 1 Monat/s, 1 Jahr/s
- **Datum-Sprung** — Direkt zu einem bestimmten Datum springen
- **Auto-Pause** — Simulation pausiert automatisch beim Tab-Wechsel (`visibilitychange`)

### Heliozentrische 3D-Koordinatentransformation

Die Position eines Planeten wird aus seinen Orbitalelementen berechnet:

$$
\begin{aligned}
x &= \cos\Omega \cdot x' - \sin\Omega \cdot \cos i \cdot y' \\
y &= \sin i \cdot y' \\
z &= \sin\Omega \cdot x' + \cos\Omega \cdot \cos i \cdot y'
\end{aligned}
$$

mit $x' = r \cos(\nu + \omega)$ und $y' = r \sin(\nu + \omega)$, wobei $r$ die radiale Entfernung, $\nu$ die wahre Anomalie und $\omega$ das Argument des Perihels ist.

---

### 🪐 Himmelskörper

#### Planeten

| Planet | Halbachse (AU) | Periode (Tage) | Exz. ($e$) | Inkl. ($i$) | Radius (km) | Neigung (°) | Rotation (h) |
|--------|:--------------:|:--------------:|:----------:|:-----------:|:-----------:|:----------:|:------------:|
| Merkur | 0.387 | 88.0 | 0.206 | 7.005° | 2,440 | 0.03 | 1,407.5 |
| Venus | 0.723 | 224.7 | 0.007 | 3.395° | 6,052 | 177.4 | 5,832.5 |
| Erde | 1.000 | 365.3 | 0.017 | 0.000° | 6,378 | 23.44 | 23.9 |
| Mars | 1.524 | 687.0 | 0.093 | 1.850° | 3,390 | 25.19 | 24.6 |
| Jupiter | 5.203 | 4,332.6 | 0.049 | 1.303° | 71,492 | 3.13 | 9.9 |
| Saturn | 9.537 | 10,759.2 | 0.054 | 2.489° | 60,268 | 26.73 | 10.7 |
| Uranus | 19.191 | 30,685.4 | 0.047 | 0.773° | 25,559 | 97.77 | 17.2 |
| Neptun | 30.070 | 60,190.0 | 0.009 | 1.770° | 24,764 | 28.32 | 16.1 |
| Pluto | 39.480 | 90,560.0 | 0.250 | 17.16° | 1,188 | 122.53 | 153.3 |

#### Zwergplaneten

| Name | Halbachse (AU) | Periode (Tage) | Exz. ($e$) | Inkl. ($i$) | Radius (km) | Neigung (°) | Rotation (h) | Entdeckung |
|------|:--------------:|:--------------:|:----------:|:-----------:|:-----------:|:----------:|:------------:|:----------:|
| Ceres | 2.767 | 1,681.6 | 0.076 | 10.59° | 472 | 4 | 9.07 | 1801 (Piazzi) |
| Eris | 67.670 | 203,830.0 | 0.441 | 44.04° | 1,161 | 78 | 25.9 | 2005 (Brown) |
| Haumea | 43.130 | 103,410.0 | 0.195 | 28.22° | 829 | 126 | 3.92 | 2004 (Brown) |
| Makemake | 45.790 | 113,190.0 | 0.159 | 29.00° | 702 | 29 | 22.48 | 2005 (Brown) |

Zwergplaneten können über die Checkbox **"Dwarf planets"** ein-/ausgeblendet werden. Beim Ausblenden verschwinden sie auch aus dem Follow-Dropdown.

#### Monde (21 bedeutende Monde)

| Mutterplanet | Monde |
|-------------|-------|
| Erde | Moon |
| Mars | Phobos, Deimos |
| Jupiter | Io, Europa, Ganymede, Callisto |
| Saturn | Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Iapetus |
| Uranus | Miranda, Ariel, Umbriel, Titania, Oberon |
| Neptun | Triton |
| Pluto | Charon |

#### Mond-Parameter

| Mond | Mutterplanet | Periode (d) | Exz. ($e$) | Radius (km) | Abstand ($R_p$) |
|------|-------------|:----------:|:----------:|:-----------:|:---------------:|
| Moon | Erde | 27.32 | 0.055 | 1,741 | 60.3 |
| Phobos | Mars | 0.32 | 0.015 | 11 | 2.76 |
| Deimos | Mars | 1.26 | 0.000 | 6 | 6.91 |
| Io | Jupiter | 1.77 | 0.004 | 1,824 | 5.9 |
| Europa | Jupiter | 3.55 | 0.009 | 1,563 | 9.4 |
| Ganymede | Jupiter | 7.15 | 0.001 | 2,634 | 15.0 |
| Callisto | Jupiter | 16.69 | 0.007 | 2,411 | 26.3 |
| Mimas | Saturn | 0.94 | 0.020 | 198 | 3.08 |
| Enceladus | Saturn | 1.37 | 0.005 | 255 | 3.95 |
| Tethys | Saturn | 1.89 | 0.000 | 529 | 4.89 |
| Dione | Saturn | 2.74 | 0.002 | 561 | 6.26 |
| Rhea | Saturn | 4.52 | 0.001 | 765 | 8.74 |
| Titan | Saturn | 15.95 | 0.029 | 2,577 | 20.3 |
| Iapetus | Saturn | 79.32 | 0.029 | 733 | 59.1 |
| Miranda | Uranus | 1.41 | 0.001 | 236 | 5.08 |
| Ariel | Uranus | 2.52 | 0.001 | 580 | 7.47 |
| Umbriel | Uranus | 4.14 | 0.004 | 587 | 10.4 |
| Titania | Uranus | 8.71 | 0.001 | 791 | 17.1 |
| Oberon | Uranus | 13.46 | 0.001 | 759 | 22.8 |
| Triton | Neptun | −5.88 | 0.000 | 1,352 | 14.3 |
| Charon | Pluto | 6.39 | 0.000 | 606 | 16.5 |

Alle Monde besitzen reale Umlaufzeiten, Exzentrizitäten und **reale Orbitalabstände** (in Planetenradien). Die Monde kreisen in der **Äquatorebene ihres Mutterplaneten** — geneigt um die axiale Neigung des Planeten. Sie werden per Tooltip mit Name, Mutterplanet, Orbitalperiode und Radius angezeigt. Negative Periode bedeutet retrograde Umlaufbahn (Triton).

Die visuelle Darstellung nutzt eine **lineare Skalierung** der realen Abstände mit einem Mindestabstand:
$$r_{visual} = \max\big(s \times (3.0 + d \times 0.35),\; s + r_{moon} + 0.4\big)$$
wobei $d$ der reale Abstand in Planetenradien, $s$ die Planet-Meshgröße und $r_{moon}$ die visuelle Mondgröße ist.

#### Asteroidengürtel
~600 prozedural generierte Objekte zwischen 2.1–3.3 AU mit leicht geneigten Bahnen, berechnet nach dem 3. Kepler'schen Gesetz.

---

### 🎨 Prozedurale Texturen

Alle Planetenoberflächen werden **rein prozedural** per Canvas-2D generiert — keine externen Bilddateien nötig:

| Planet | Texturdetails |
|--------|--------------|
| **Merkur** | Graue Oberfläche mit ~300 zufälligen Kratern |
| **Venus** | Gelbliche Wolkenbänder + diffuse Wirbel |
| **Erde** | Blaue Ozeane, grüne/braune Kontinente, weiße Polkappen, Wolkenschleier |
| **Mars** | Rot-orange mit dunklen Oberflächenmerkmalen + Polkappen |
| **Jupiter** | Horizontale Farbstreifen (10 Töne) + **Großer Roter Fleck** |
| **Saturn** | Goldene Bandstruktur (6 Bänder) |
| **Uranus** | Blasses Blau-Cyan mit subtilen Bändern |
| **Neptun** | Tiefblau mit Bändern + dunkler Fleck |
| **Pluto** | Beige mit **Tombaugh Regio** (helle Herzregion) |
| **Ceres** | Graue Krater + heller **Occator-Krater** |
| **Eris** | Grau-beige mit ~80 zufälligen Kratern |
| **Haumea** | Grau-beige mit ~80 zufälligen Kratern |
| **Makemake** | Braun-grau mit ~80 zufälligen Kratern |
| **Sonne** | Orange-gelber Gradient mit Sonnenflecken und hellen Punkten |

Die Texturen nutzen einen **seeded Pseudo-Random-Generator** (`(seed * 16807) % 2^31-1`), sodass sie bei jedem Laden identisch aussehen.

---

### 🪐 Saturn-Ringe

Saturn besitzt einen prozedural texturierten Ring (128 Segmente) mit:
- **UV-Remapping** — Radiale UV-Koordinaten für korrekte Texturdarstellung (inner → außen)
- **C-Ring** — Schwacher innerer Ring (α 25–35%)
- **B-Ring** — Hellster Ring (α 75–80%)
- **Cassini-Teilung** — Deutliche Lücke zwischen B- und A-Ring (α 5%)
- **A-Ring** — Mittelstarker äußerer Ring (α 60–65%)
- **Encke-Gap** — Feine Lücke im A-Ring (α 8%)
- **F-Ring** — Dünner äußerster Ring (α 20%)
- **MeshStandardMaterial** mit `receiveShadow: true` für Mond-Transitschatten
- Subtiler `emissive`-Wert damit die unbeleuchtete Seite sichtbar bleibt

---

### 🌌 Atmosphären-Glow

7 Planeten besitzen atmosphärische BackSide-Sphere-Glows:

| Planet | Farbe | Opacity | Scale |
|--------|-------|---------|-------|
| **Erde** | `#4488ff` (Blau) | 12% | 1.15 |
| **Venus** | `#ffaa44` (Orange) | 12% | 1.15 |
| **Mars** | `#ff6633` (Rot) | 6% | 1.08 |
| **Jupiter** | `#ffcc88` (Gold) | 8% | 1.06 |
| **Saturn** | `#ffe8aa` (Warmgelb) | 7% | 1.06 |
| **Uranus** | `#66ddee` (Cyan) | 10% | 1.10 |
| **Neptun** | `#4466ff` (Tiefblau) | 10% | 1.10 |

---

### 🎨 Theme\n\nDark/Light-Wechsel mit **sanften CSS-Transitions** (0.5s) auf allen UI-Elementen (Body, Sidebar, Buttons, Inputs, Tooltip, Info-Panel, Minimap).\n\n---\n\n### 🔭 3D-Ansicht & Navigation (Three.js OrbitControls)

| Aktion | Steuerung |
|--------|-----------|
| **Kamera drehen** | Linke Maustaste + Ziehen |
| **Zoomen** | Mausrad scrollen |
| **Pan (Verschieben)** | Rechte Maustaste + Ziehen |
| **Zoom (Slider)** | Slider im View-Bereich (3–250 Einheiten Kamera-Abstand) |
| **Zoom (+/−)** | Buttons neben dem Zoom-Slider |
| **Planet verfolgen** | Dropdown unter *View → Follow* oder Klick auf Planet |
| **Planeten-Größe** | Slider *Planet scale* (0.1–3.0) |

Die Kamera nutzt **Damping** (Trägheit, Faktor 0.08) für flüssige Bewegungen. Minimaler Kameraabstand: 3 Einheiten, Maximum: 400 Einheiten.

**Follow-Modus:** Beim Verfolgen eines Planeten wird der Kamera-Offset (Abstand + Blickrichtung) beibehalten — Zoom bleibt stabil. Bei Auswahl von "None" scrollt die Kamera sanft zurück zur Sonne. Der Follow kann auch per **Klick auf den Planeten** aktiviert werden; erneuter Klick auf denselben Planeten deaktiviert den Follow. Ein kurzer Maus-Drag (>4px) wird nicht als Klick gewertet.

**LOD (Level of Detail):** Planeten nutzen automatisch verschiedene Geometrie-Auflösungen je nach Kamera-Abstand:
- **< 20 Einheiten:** 32×32 Segmente (Hi)
- **< 60 Einheiten:** 24×24 Segmente (Med)
- **> 60 Einheiten:** 12×12 Segmente (Lo)

### ❓ Hilfe-Overlay

Hilfe-Button `?` oben rechts oder Tastenkürzel `?` zeigt ein Overlay mit allen Keyboard-Shortcuts und Bedienhilfen.

### ⌨️ Tastenkürzel

| Taste | Aktion |
|-------|--------|
| **Leertaste** | Play / Pause |
| **+** / **−** | Zoom rein / raus |
| **[** / **]** | Speed ×0.1 / ×10 |
| **Esc** | Follow beenden / Hilfe schließen |
| **?** | Hilfe-Overlay ein/aus |

---

### 📊 Info-Panel

Wähle einen Planeten im Follow-Dropdown → am unteren Bildschirmrand erscheint ein **Info-Panel** mit:

- **Typ** (Terrestrisch / Gasriese / Eisriese / Zwergplanet)
- **Masse** (in kg, wissenschaftliche Notation)
- **Durchmesser** (in km)
- **Oberflächengravitation** (in m/s²)
- **Tageslänge**
- **Orbitalperiode** (in Tagen)
- **Bekannte Monde** (Gesamtanzahl)
- **Entdeckung** (Jahr und Entdecker)
- **Atmosphäre** (falls vorhanden: Zusammensetzung)
- **Inklination** und **Exzentrizität**

---

### 🗺️ Minimap

Unten rechts: Eine runde **2D-Draufsicht** (180×180 px, Retina-fähig) zeigt:
- Alle Planeten als farbige Punkte (Zwergplaneten kleiner)
- Orbits als Kreislinien
- Sonne in der Mitte
- Anpassung an Light/Dark Theme

---

### 🎛️ Steuerung

#### Simulation
| Element | Funktion |
|---------|----------|
| **Play / Pause** | Simulation anhalten/fortsetzen |
| **Reset** | Zurück auf Tag 0, Trails löschen, Kamera zur Sonne |
| **Days / sec** | Speed-Slider + numerische Eingabe (0.001–100.000) |
| **×0.1 / ×10** | Geschwindigkeit um Faktor 10 ändern |
| **1 d/s** | Preset: 1 Tag pro Sekunde (Echtzeit-nah) |
| **1 w/s** | Preset: 7 Tage pro Sekunde |
| **1 mo/s** | Preset: 30 Tage pro Sekunde |
| **1 yr/s** | Preset: 365.25 Tage pro Sekunde |
| **Jump to date** | Direkt zu einem Datum springen |

#### Display
| Element | Funktion |
|---------|----------|
| **Orbit paths** | 3D-Orbitlinien ein/aus |
| **Rotation axis** | Axiale Rotationsachse anzeigen |
| **Ecliptic grid** | Ekliptikebene-Gitter ein/aus |
| **Moons** | Monde anzeigen/verbergen |
| **Asteroid belt** | Asteroidengürtel ein/aus |
| **Dwarf planets** | Zwergplaneten + deren Orbits ein/aus |
| **Trails** | Schweiflinien hinter Planeten |
| **Trail length** | 1–36.500 Tage oder ∞ (unbegrenzt, max 20.000 Punkte) |

#### Actions
| Element | Funktion |
|---------|----------|
| **📷 Screenshot** | Canvas als PNG herunterladen |
| **🌙 / ☀️** | Dark/Light Theme umschalten |
| **☰** | Sidebar ein-/ausblenden |

---

### 💡 Tooltip

**Hover über einen Planeten:**
- Name, Radius (km, basierend auf Äquatorradius 6378 km × $R$), Entfernung (AU), Orbitalgeschwindigkeit (km/s), Periode (Tage), Inklination, Exzentrizität

**Hover über einen Mond:**
- Name, Mutterplanet, Orbitalperiode (Tage), Radius (km), Exzentrizität

Die Tooltip-Position wird per 3D→NDC-Projektion berechnet: der nächstliegende Himmelskörper zum Cursor wird innerhalb eines Schwellwerts erkannt (Monde haben Priorität wenn näher).

---

## Dateien

| Datei | Beschreibung |
|-------|-------------|
| `index.html` | Hauptseite: Sidebar-Controls, Canvas, Overlays, Help-Button |
| `js/data.js` | Konstanten, Orbitalelemente (PDATA), Planeteninfo-Datenbank, geteilter State |
| `js/physics.js` | CircularBuffer, Kepler-Solver, Orbitalmechanik-Helfer |
| `js/textures.js` | Prozedurale Planet-/Sonnentexturen (Auflösung nach Planetengröße) |
| `js/scene.js` | Three.js-Setup, Sonne, Sternenfeld, Planet/Mond/Asteroiden-Erstellung, Saturn-Ringe |
| `js/ui.js` | DOM-Referenzen, Event-Handler, Tooltip, Info-Panel, Keyboard-Shortcuts |
| `js/main.js` | Animationsloop, Planeten-Updates, Minimap, Follow-Modus |
| `styles.css` | Layout, Sidebar, Dark/Light Theme mit Transitions, Tooltip, Minimap, Info-Panel |
| `README.md` | Dokumentation (Englisch) |
| `README_DE.md` | Diese Datei (Deutsch) |

---

## Starten

1. `index.html` im Browser öffnen (Doppelklick oder Rechtsklick → *Öffnen mit*)
2. Three.js (r140) und OrbitControls sind lokal im `js/`-Ordner enthalten — keine Internetverbindung erforderlich
3. Fertig — kein Build-Step, kein lokaler Server nötig

### Externe Abhängigkeiten

| Bibliothek | Version | Quelle | Zweck |
|-----------|---------|--------|-------|
| Three.js | r140 (0.140.0) | `js/three.min.js` (lokal) | WebGL 3D-Rendering |
| OrbitControls | r140 | `js/OrbitControls.js` (lokal) | Kamera-Steuerung (Drehen, Zoomen, Pan) |

---

## Technische Details

### Mond-Orbitalmechanik
- Monde kreisen in der **Äquatorebene** ihres Mutterplaneten (geneigt um axiale Neigung)
- Orbitalabstände basieren auf **realen Daten** (Halbachse in Planetenradien), linear skaliert mit Mindestabstand
- 21 bedeutende Monde mit realen Umlaufzeiten, Exzentrizitäten und Abständen
- Triton hat eine negative Periode (retrograde Umlaufbahn)

### Per-Planet-Materialien
- Individuelle `roughness` und `metalness` pro Planet (MeshStandardMaterial)
- Textur-Auflösung skaliert nach Planetengröße: Gas-Riesen 1024×512, Zwerge 256×128, Rest 512×256

| Planet | Roughness | Metalness |
|--------|---------:|---------:|
| Merkur | 0.90 | 0.05 |
| Venus | 0.60 | 0.01 |
| Erde | 0.50 | 0.03 |
| Mars | 0.85 | 0.02 |
| Jupiter | 0.40 | 0.00 |
| Saturn | 0.45 | 0.00 |
| Uranus | 0.35 | 0.01 |
| Neptun | 0.35 | 0.01 |
| Pluto | 0.80 | 0.02 |
| Ceres | 0.90 | 0.04 |
| Eris | 0.70 | 0.01 |
| Haumea | 0.65 | 0.01 |
| Makemake | 0.70 | 0.02 |

### Rendering-Pipeline
- **WebGLRenderer** mit Antialiasing + `preserveDrawingBuffer` (für Screenshots)
- **PCFSoftShadowMap** — Weiche Schatten, 2048×2048 Shadow Map
- **PointLight** an der Sonne (Intensität 2.5, Range 500) castet Schatten
- **AmbientLight** (0.15) für minimale Grundbeleuchtung der Nachtseiten
- Alle Planeten und Monde: `castShadow = true`, `receiveShadow = true`
- HiDPI: `devicePixelRatio` bis max 2× für scharfes Rendering

### Orbit-Skalierung
Logarithmische Skalierung verhindert, dass innere Planeten kollidieren und äußere unsichtbar werden:

$$
r_{world} = 2 + \frac{\ln(1 + r_{AU})}{\ln(41)} \times 55
$$

### Planeten-Größen
Normiert auf Jupiter-Radius mit Clamp:

$$
size = \text{clamp}(0.12 + \frac{R_{earth}}{11.21} \times 0.85,\; 0.12,\; 1.2) \times \text{planetScale}
$$

### Trail-System
- Trails speichern **3D-Weltraumkoordinaten** (Vector3) — keine Pixel
- **O(1) CircularBuffer** — Maximal 20.000 Punkte pro Trail (`Float32Array` BufferGeometry)
- `frustumCulled = false` verhindert vorzeitiges Clipping
- Trail-Pruning per Zeitstempel; bei ∞ nur Punkt-Limit
- `needsUpdate = true` pro Frame für dynamische BufferAttribute
- **Mond-Trail-Substeps:** Bei Simulationsgeschwindigkeit < Mond-Orbitalperiode werden bis zu 36 Zwischenpositionen pro Frame berechnet für glatte Helix-Trails
- **Interpoliertes Planetenzentrum:** Moon-Substeps interpolieren die Planeten-Position über den Frame hinweg, damit die Helix dem Planeten-Pfad korrekt folgt
- Bei hoher Geschwindigkeit (Frame-dt > Mondperiode) wird nur ein Punkt pro Frame aufgezeichnet, um visuelle Überladung zu vermeiden

### Sternenfeld
2.500 zufällig auf einer Kugelschale (Radius 350–450) verteilte Punkte via:
$$
\theta = \text{random} \times 2\pi, \quad \phi = \arccos(2 \times \text{random} - 1)
$$

### Sonnen-Glow
Canvas-basierter Radial-Gradient (256×256) als `THREE.Sprite` mit:
- AdditiveBlending für Leuchteffekt
- `depthWrite: false` um Z-Fighting zu vermeiden
- 5-stufiger Gradient (Weiß → Gold → Transparent)

### Minimap
- Separater 2D-Canvas (180×180, 2× für Retina)
- Kreisförmig geclippt per `arc() + clip()`
- Skalierung: `(radius - 8) / auToWorld(50)` für Passform
- Aktualisiert jeden Frame im Animation-Loop

---

## Hinweise & Limitierungen

### Maßstab
- Abstände sind **logarithmisch komprimiert** — keine echte Maßstabstreue
- Planetengrößen sind **stark vergrößert** für Sichtbarkeit (reale Planeten wären unsichtbar klein)
### Hinweise
- Planetengrößen sind **stark vergrößert** für Sichtbarkeit (reale Planeten wären unsichtbar klein)
- Mond-Orbits sind **relativ zum Planeten-Mesh** skaliert (linear), nicht AU-basiert
- Saturn-Monde (Mimas–Titan) orbitieren innerhalb/nahe der Ring-Darstellung, wie in der Realität

### Geschwindigkeit & Realismus
- **Äußere Planeten bewegen sich scheinbar kaum** — das ist korrekt! Die Umlaufzeiten unterscheiden sich enorm:

| Planet | Umlaufzeit | Bei 10 d/s dauert 1 Orbit... |
|--------|-----------|-------------------------------|
| Merkur | 88 Tage | ~9 Sekunden |
| Erde | 365 Tage | ~37 Sekunden |
| Jupiter | 4,333 Tage | ~7 Minuten |
| Saturn | 10,759 Tage | ~18 Minuten |
| Pluto | 90,560 Tage (~248 Jahre) | ~2,5 Stunden |
| Eris | 203,830 Tage (~558 Jahre) | ~5,7 Stunden |

Um die äußeren Planeten in Bewegung zu sehen: Speed-Preset **"10 yr/s"** oder ×10-Button mehrfach klicken.

### Astronomische Genauigkeit
- Orbitale Elemente basieren auf **J2000-Epoche** (1. Januar 2000, 12:00 UTC)
- Säkulare Störungen (Präzession, Planetenresonanz) werden **nicht** berücksichtigt
- Mond-Orbits sind vereinfacht (elliptisch in der Äquatorebene des Mutterplaneten)
- Plutos letztes Perihel war 1989 → er ist aktuell weit außerhalb von Neptuns Bahn
- Mondabstände sind real, aber logarithmisch skaliert für Sichtbarkeit
- Planetenradius-Multiplikator: 6378 km (Äquatorradius der Erde)

### Sicherheit
- Canvas mit `role="img"` und `aria-label` für Screenreader-Zugänglichkeit
- **WebGL-Context-Loss-Handling** — Overlay bei GPU-Verlust
- Sidebar-Buttons mit ARIA-Labels

### Browser-Kompatibilität
- Benötigt WebGL und `<script>` CDN-Zugriff (kein `type="module"`, funktioniert von `file://`)
- Getestet in: Chrome, Edge, Firefox (aktuell)
- Keine Unterstützung für IE11

---

## Architektur

```
index.html
├── Three.js r140 (CDN, SRI-gesichert)
├── OrbitControls r140 (CDN, SRI-gesichert)
├── styles.css
│   ├── Sidebar-Layout
│   ├── Dark / Light Theme (sanfte CSS-Transitions)
│   ├── Loading-Spinner
│   ├── Help-Overlay
│   ├── Minimap-Styling
│   └── Info-Panel / Tooltip
└── js/
    ├── data.js — Konstanten, PDATA[], PLANET_INFO{}, State
    ├── physics.js — CircularBuffer, Kepler-Solver, pos3D()
    ├── textures.js — Prozedurale Texturen (größenabhängige Auflösung)
    ├── scene.js — Three.js-Setup, Lichter, Planeten, Monde, Saturn-Ringe, LOD
    ├── ui.js — DOM, Events, Tooltip, Info-Panel, Shortcuts, Click-to-follow
    └── main.js — animate()-Loop, Trails, Minimap, Follow-Modus, Auto-Pause
```

---

## Lizenz

Privates Projekt — nicht für Weiterverteilung vorgesehen.