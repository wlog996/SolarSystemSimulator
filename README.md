# 🌌 Interactive 3D Solar System Simulation

An interactive **3D simulation** of our solar system in the browser — built with **Three.js (r140)**, featuring real orbital mechanics, procedural textures, true orbital inclinations and axial tilts.

![Three.js](https://img.shields.io/badge/Three.js-r140-green)
![Dark / Light](https://img.shields.io/badge/theme-dark%20%2F%20light-blue)
![No Build](https://img.shields.io/badge/build-none-lightgrey)

---

## Overview

The project simulates all planets and dwarf planets of the solar system with their real orbits, velocities, orbital inclinations and axial tilts in a fully interactive 3D environment. The camera can be freely rotated, zoomed and panned. All celestial bodies feature procedural textures — no external image files required.

---

## Features

### 🔭 Simulation & Physics
- **Kepler Solver** — Solves Kepler's equation $E - e \sin E = M$ via Newton iteration (max 15 steps, tolerance $10^{-12}$) to compute the true anomaly $\nu$
- **J2000 Epoch** — Starting positions based on astronomical reference data: mean longitude ($L_0$), perihelion longitude ($\varpi$)
- **3D Orbital Planes** — Each planet has its real orbital inclination ($i$) and longitude of ascending node ($\Omega$) for correct 3D positions
- **Axial Tilt** — All planets are rendered with real axial tilts (e.g. Earth 23.44°, Uranus 97.77°)
- **Elliptical Orbits** — Each planet's eccentricity is taken into account (from Venus $e=0.007$ to Pluto $e=0.250$)
- **Vis-viva Velocity** — Computes real orbital velocity for each planet via $v = \sqrt{\mu\left(\frac{2}{r} - \frac{1}{a}\right)}$
- **Axial Rotation** — Each planet rotates at its real day length (including retrograde rotation for Venus & Uranus)
- **Time Controls** — Play/Pause, speed slider (0.001–100,000 days/s), ×0.1 / ×10 buttons, numeric input
- **Speed Presets** — Quick buttons: 1 day/s, 1 week/s, 1 month/s, 1 year/s (sp1d, sp1w, sp1m, sp1y)
- **Jump to Date** — Jump directly to a specific date
- **Auto-Pause** — Simulation pauses automatically on tab switch (`visibilitychange`)

### Heliocentric 3D Coordinate Transformation

A planet's position is computed from its orbital elements:

$$
\begin{aligned}
x &= \cos\Omega \cdot x' - \sin\Omega \cdot \cos i \cdot y' \\
y &= \sin i \cdot y' \\
z &= \sin\Omega \cdot x' + \cos\Omega \cdot \cos i \cdot y'
\end{aligned}
$$

where $x' = r \cos(\nu + \omega)$ and $y' = r \sin(\nu + \omega)$, with $r$ being the radial distance, $\nu$ the true anomaly, and $\omega$ the argument of perihelion.

---

### 🪐 Celestial Bodies

#### Planets

| Planet | Semi-major axis (AU) | Period (days) | Ecc. ($e$) | Incl. ($i$) | Radius (km) | Tilt (°) | Rotation (h) |
|--------|:--------------------:|:-------------:|:----------:|:-----------:|:-----------:|:--------:|:------------:|
| Mercury | 0.387 | 88.0 | 0.206 | 7.005° | 2,440 | 0.03 | 1,407.5 |
| Venus | 0.723 | 224.7 | 0.007 | 3.395° | 6,052 | 177.4 | 5,832.5 |
| Earth | 1.000 | 365.3 | 0.017 | 0.000° | 6,378 | 23.44 | 23.9 |
| Mars | 1.524 | 687.0 | 0.093 | 1.850° | 3,390 | 25.19 | 24.6 |
| Jupiter | 5.203 | 4,332.6 | 0.049 | 1.303° | 71,492 | 3.13 | 9.9 |
| Saturn | 9.537 | 10,759.2 | 0.054 | 2.489° | 60,268 | 26.73 | 10.7 |
| Uranus | 19.191 | 30,685.4 | 0.047 | 0.773° | 25,559 | 97.77 | 17.2 |
| Neptune | 30.070 | 60,190.0 | 0.009 | 1.770° | 24,764 | 28.32 | 16.1 |
| Pluto | 39.480 | 90,560.0 | 0.250 | 17.16° | 1,188 | 122.53 | 153.3 |

#### Dwarf Planets

| Name | Semi-major axis (AU) | Period (days) | Ecc. ($e$) | Incl. ($i$) | Radius (km) | Tilt (°) | Rotation (h) | Discovery |
|------|:--------------------:|:-------------:|:----------:|:-----------:|:-----------:|:--------:|:------------:|:---------:|
| Ceres | 2.767 | 1,681.6 | 0.076 | 10.59° | 472 | 4 | 9.07 | 1801 (Piazzi) |
| Eris | 67.670 | 203,830.0 | 0.441 | 44.04° | 1,161 | 78 | 25.9 | 2005 (Brown) |
| Haumea | 43.130 | 103,410.0 | 0.195 | 28.22° | 829 | 126 | 3.92 | 2004 (Brown) |
| Makemake | 45.790 | 113,190.0 | 0.159 | 29.00° | 702 | 29 | 22.48 | 2005 (Brown) |

Dwarf planets can be toggled via the **"Dwarf planets"** checkbox. When hidden, they also disappear from the Follow dropdown.

#### Moons (21 major moons)

| Parent Planet | Moons |
|--------------|-------|
| Earth | Moon |
| Mars | Phobos, Deimos |
| Jupiter | Io, Europa, Ganymede, Callisto |
| Saturn | Mimas, Enceladus, Tethys, Dione, Rhea, Titan, Iapetus |
| Uranus | Miranda, Ariel, Umbriel, Titania, Oberon |
| Neptune | Triton |
| Pluto | Charon |

#### Moon Parameters

| Moon | Parent | Period (d) | Ecc. ($e$) | Radius (km) | Distance ($R_p$) |
|------|--------|:----------:|:----------:|:-----------:|:----------------:|
| Moon | Earth | 27.32 | 0.055 | 1,741 | 60.3 |
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
| Triton | Neptune | −5.88 | 0.000 | 1,352 | 14.3 |
| Charon | Pluto | 6.39 | 0.000 | 606 | 16.5 |

All moons have real orbital periods, eccentricities and **real orbital distances** (in planet radii). Moons orbit in the **equatorial plane of their parent planet** — tilted by the planet's axial tilt. They are shown via tooltip with name, parent planet, orbital period and radius. Negative period indicates retrograde orbit (Triton).

Visual orbit radii use **linear scaling** of real distances with a minimum offset:
$$r_{visual} = \max\big(s \times (3.0 + d \times 0.35),\; s + r_{moon} + 0.4\big)$$
where $d$ is the real distance in planet radii, $s$ is the planet mesh size and $r_{moon}$ is the visual moon size.

#### Asteroid Belt
~600 procedurally generated objects between 2.1–3.3 AU with slightly inclined orbits, computed using Kepler's third law.

---

### 🎨 Procedural Textures

All planet surfaces are generated **purely procedurally** via Canvas 2D — no external image files required:

| Planet | Texture Details |
|--------|----------------|
| **Mercury** | Grey surface with ~300 random craters |
| **Venus** | Yellowish cloud bands + diffuse swirls |
| **Earth** | Blue oceans, green/brown continents, white polar caps, cloud cover |
| **Mars** | Red-orange with dark surface features + polar caps |
| **Jupiter** | Horizontal color bands (10 shades) + **Great Red Spot** |
| **Saturn** | Golden band structure (6 bands) |
| **Uranus** | Pale blue-cyan with subtle bands |
| **Neptune** | Deep blue with bands + dark spot |
| **Pluto** | Beige with **Tombaugh Regio** (bright heart-shaped region) |
| **Ceres** | Grey craters + bright **Occator Crater** |
| **Eris** | Grey-beige with ~80 random craters |
| **Haumea** | Grey-beige with ~80 random craters |
| **Makemake** | Brown-grey with ~80 random craters |
| **Sun** | Orange-yellow gradient with sunspots and bright points |

Textures use a **seeded pseudo-random generator** (`(seed * 16807) % 2^31-1`), so they look identical on every load.

---

### 🪐 Saturn Rings

Saturn features a procedurally textured ring (128 segments) with:
- **UV Remapping** — Radial UV coordinates for correct texture mapping (inner → outer)
- **C Ring** — Faint inner ring (α 25–35%)
- **B Ring** — Brightest ring (α 75–80%)
- **Cassini Division** — Prominent gap between B and A rings (α 5%)
- **A Ring** — Medium-strength outer ring (α 60–65%)
- **Encke Gap** — Fine gap in the A ring (α 8%)
- **F Ring** — Thin outermost ring (α 20%)
- **MeshStandardMaterial** with `receiveShadow: true` for moon transit shadows
- Subtle `emissive` value so the unlit side remains visible

---

### 🌌 Atmosphere Glow

7 planets feature atmospheric BackSide-Sphere glows:

| Planet | Color | Opacity | Scale |
|--------|-------|---------|-------|
| **Earth** | `#4488ff` (Blue) | 12% | 1.15 |
| **Venus** | `#ffaa44` (Orange) | 12% | 1.15 |
| **Mars** | `#ff6633` (Red) | 6% | 1.08 |
| **Jupiter** | `#ffcc88` (Gold) | 8% | 1.06 |
| **Saturn** | `#ffe8aa` (Warm yellow) | 7% | 1.06 |
| **Uranus** | `#66ddee` (Cyan) | 10% | 1.10 |
| **Neptune** | `#4466ff` (Deep blue) | 10% | 1.10 |

---

### 🎨 Theme

Dark/Light toggle with **smooth CSS transitions** (0.5s) across all UI elements (body, sidebar, buttons, inputs, tooltip, info panel, minimap).

---

### 🔭 3D View & Navigation (Three.js OrbitControls)

| Action | Control |
|--------|---------|
| **Rotate camera** | Left-click + drag |
| **Zoom** | Mouse wheel scroll |
| **Pan** | Right-click + drag |
| **Zoom (slider)** | Slider in View section (3–250 units camera distance) |
| **Zoom (+/−)** | Buttons next to the zoom slider |
| **Follow planet** | Dropdown under *View → Follow* or click on planet |
| **Planet size** | Slider *Planet scale* (0.1–3.0) |

The camera uses **damping** (inertia, factor 0.08) for smooth movement. Minimum camera distance: 3 units, maximum: 400 units.

**Follow Mode:** When following a planet, the camera offset (distance + viewing direction) is preserved — zoom stays stable. Selecting "None" smoothly scrolls the camera back to the Sun. Follow can also be activated by **clicking on a planet**; clicking the same planet again deactivates follow. A short mouse drag (>4px) is not counted as a click.

**LOD (Level of Detail):** Planets automatically use different geometry resolutions based on camera distance:
- **< 20 units:** 32×32 segments (Hi)
- **< 60 units:** 24×24 segments (Med)
- **> 60 units:** 12×12 segments (Lo)

### ❓ Help Overlay

Help button `?` in the top right or keyboard shortcut `?` shows an overlay with all keyboard shortcuts and controls.

### ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play / Pause |
| **+** / **−** | Zoom In / Out |
| **[** / **]** | Speed ×0.1 / ×10 |
| **Esc** | Unfollow planet / close help |
| **?** | Toggle help overlay |

---

### 📊 Info Panel

Select a planet in the Follow dropdown → an **info panel** appears at the bottom of the screen with:

- **Type** (Terrestrial / Gas giant / Ice giant / Dwarf planet)
- **Mass** (in kg, scientific notation)
- **Diameter** (in km)
- **Surface gravity** (in m/s²)
- **Day length**
- **Orbital period** (in days)
- **Known moons** (total count)
- **Discovery** (year and discoverer)
- **Atmosphere** (composition, if applicable)
- **Inclination** and **Eccentricity**

---

### 🗺️ Minimap

Bottom right: A circular **2D top-down view** (180×180 px, Retina-capable) showing:
- All planets as colored dots (dwarf planets smaller)
- Orbits as circle lines
- Sun at the center
- Adapts to Light/Dark theme

---

### 🎛️ Controls

#### Simulation
| Element | Function |
|---------|----------|
| **Play / Pause** | Stop/resume simulation |
| **Reset** | Back to day 0, clear trails, camera to Sun |
| **Days / sec** | Speed slider + numeric input (0.001–100,000) |
| **×0.1 / ×10** | Change speed by factor of 10 |
| **1 d/s** | Preset: 1 day per second (near real-time) |
| **1 w/s** | Preset: 7 days per second |
| **1 mo/s** | Preset: 30 days per second |
| **1 yr/s** | Preset: 365.25 days per second |
| **Jump to date** | Jump directly to a date |

#### Display
| Element | Function |
|---------|----------|
| **Orbit paths** | 3D orbit lines on/off |
| **Rotation axis** | Show axial rotation axis |
| **Ecliptic grid** | Ecliptic plane grid on/off |
| **Moons** | Show/hide moons |
| **Asteroid belt** | Asteroid belt on/off |
| **Dwarf planets** | Dwarf planets + their orbits on/off |
| **Trails** | Trail lines behind planets |
| **Trail length** | 1–36,500 days or ∞ (unlimited, max 20,000 points) |

#### Actions
| Element | Function |
|---------|----------|
| **📷 Screenshot** | Download canvas as PNG |
| **🌙 / ☀️** | Toggle Dark/Light theme |
| **☰** | Toggle sidebar |

---

### 💡 Tooltip

**Hover over a planet:**
- Name, radius (km, based on equatorial radius 6,378 km × $R$), distance (AU), orbital velocity (km/s), period (days), inclination, eccentricity

**Hover over a moon:**
- Name, parent planet, orbital period (days), radius (km), eccentricity

Tooltip position is computed via 3D→NDC projection: the nearest celestial body to the cursor is detected within a threshold (moons have priority when closer).

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main page: sidebar controls, canvas, overlays, help button |
| `js/data.js` | Constants, orbital elements (PDATA), planet info database, shared state |
| `js/physics.js` | CircularBuffer, Kepler solver, orbital mechanics helpers |
| `js/textures.js` | Procedural planet/sun textures (resolution scales by planet size) |
| `js/scene.js` | Three.js setup, sun, starfield, planet/moon/asteroid creation, Saturn rings |
| `js/ui.js` | DOM references, event handlers, tooltip, info panel, keyboard shortcuts |
| `js/main.js` | Animation loop, planet updates, minimap, follow mode |
| `styles.css` | Layout, sidebar, Dark/Light theme with transitions, tooltip, minimap, info panel |
| `README.md` | This file (English) |
| `README_DE.md` | Documentation (German) |

---

## Getting Started

1. Open `index.html` in a browser (double-click or right-click → *Open with*)
2. Three.js (r140) and OrbitControls are included locally in the `js/` folder — no internet connection required
3. Done — no build step, no local server needed

### External Dependencies

| Library | Version | Source | Purpose |
|---------|---------|--------|---------|
| Three.js | r140 (0.140.0) | `js/three.min.js` (local) | WebGL 3D rendering |
| OrbitControls | r140 | `js/OrbitControls.js` (local) | Camera controls (rotate, zoom, pan) |

---

## Technical Details

### Moon Orbital Mechanics
- Moons orbit in the **equatorial plane** of their parent planet (tilted by axial tilt)
- Orbital distances are based on **real data** (semi-major axis in planet radii), linearly scaled with minimum offset
- 21 major moons with real orbital periods, eccentricities and distances
- Triton has a negative period (retrograde orbit)

### Per-Planet Materials
- Individual `roughness` and `metalness` per planet (MeshStandardMaterial)
- Texture resolution scales by planet size: gas giants 1024×512, dwarfs 256×128, others 512×256

| Planet | Roughness | Metalness |
|--------|---------:|---------:|
| Mercury | 0.90 | 0.05 |
| Venus | 0.60 | 0.01 |
| Earth | 0.50 | 0.03 |
| Mars | 0.85 | 0.02 |
| Jupiter | 0.40 | 0.00 |
| Saturn | 0.45 | 0.00 |
| Uranus | 0.35 | 0.01 |
| Neptune | 0.35 | 0.01 |
| Pluto | 0.80 | 0.02 |
| Ceres | 0.90 | 0.04 |
| Eris | 0.70 | 0.01 |
| Haumea | 0.65 | 0.01 |
| Makemake | 0.70 | 0.02 |

### Rendering Pipeline
- **WebGLRenderer** with antialiasing + `preserveDrawingBuffer` (for screenshots)
- **PCFSoftShadowMap** — Soft shadows, 2048×2048 shadow map
- **PointLight** at the Sun (intensity 2.5, range 500) casts shadows
- **AmbientLight** (0.15) for minimal fill lighting on night sides
- All planets and moons: `castShadow = true`, `receiveShadow = true`
- HiDPI: `devicePixelRatio` capped at 2× for crisp rendering

### Orbit Scaling
Logarithmic scaling prevents inner planets from colliding and outer planets from being invisible:

$$
r_{world} = 2 + \frac{\ln(1 + r_{AU})}{\ln(41)} \times 55
$$

### Planet Sizes
Normalized to Jupiter radius with clamping:

$$
size = \text{clamp}(0.12 + \frac{R_{earth}}{11.21} \times 0.85,\; 0.12,\; 1.2) \times \text{planetScale}
$$

### Trail System
- Trails store **3D world-space coordinates** (Vector3) — not pixels
- **O(1) CircularBuffer** — Max 20,000 points per trail (`Float32Array` BufferGeometry)
- `frustumCulled = false` prevents premature clipping
- Trail pruning by timestamp; at ∞ only point limit applies
- `needsUpdate = true` per frame for dynamic BufferAttributes
- **Moon trail sub-steps:** At simulation speed < moon orbital period, up to 36 intermediate positions are computed per frame for smooth helix trails
- **Interpolated planet center:** Moon sub-steps interpolate the planet's position across the frame, so the helix correctly follows the planet's path
- At high speed (frame dt > moon period), only one point per frame is recorded to avoid visual clutter

### Starfield
2,500 points randomly distributed on a spherical shell (radius 350–450) via:
$$
\theta = \text{random} \times 2\pi, \quad \phi = \arccos(2 \times \text{random} - 1)
$$

### Sun Glow
Canvas-based radial gradient (256×256) as `THREE.Sprite` with:
- AdditiveBlending for glow effect
- `depthWrite: false` to avoid Z-fighting
- 5-stop gradient (white → gold → transparent)

### Minimap
- Separate 2D canvas (180×180, 2× for Retina)
- Circular clipping via `arc() + clip()`
- Scaling: `(radius - 8) / auToWorld(50)` for fit
- Updated every frame in the animation loop

---

## Notes & Limitations

### Scale
- Distances are **logarithmically compressed** — not to true scale
- Planet sizes are **greatly exaggerated** for visibility (real planets would be invisibly small)
- Moon orbits are scaled **relative to the planet mesh** (logarithmic), not AU-based
- Saturn's moons (Mimas–Titan) orbit within/near the ring representation, as in reality

### Speed & Realism
- **Outer planets appear barely moving** — this is correct! Orbital periods differ enormously:

| Planet | Orbital Period | At 10 d/s, 1 orbit takes... |
|--------|---------------|------------------------------|
| Mercury | 88 days | ~9 seconds |
| Earth | 365 days | ~37 seconds |
| Jupiter | 4,333 days | ~7 minutes |
| Saturn | 10,759 days | ~18 minutes |
| Pluto | 90,560 days (~248 years) | ~2.5 hours |
| Eris | 203,830 days (~558 years) | ~5.7 hours |

To see the outer planets move: use the **"10 yr/s"** speed preset or click the ×10 button repeatedly.

### Astronomical Accuracy
- Orbital elements are based on the **J2000 epoch** (January 1, 2000, 12:00 UTC)
- Secular perturbations (precession, planetary resonance) are **not** taken into account
- Moon orbits are simplified (elliptical in the parent planet's equatorial plane)
- Pluto's last perihelion was in 1989 → it is currently far beyond Neptune's orbit
- Moon distances are real but logarithmically scaled for visibility
- Planet radius multiplier: 6,378 km (Earth's equatorial radius)

### Security
- Canvas with `role="img"` and `aria-label` for screen reader accessibility
- **WebGL context loss handling** — overlay on GPU loss
- Sidebar buttons with ARIA labels

### Browser Compatibility
- Requires WebGL and `<script>` CDN access (no `type="module"`, works from `file://`)
- Tested in: Chrome, Edge, Firefox (current)
- No support for IE11

---

## Architecture

```
index.html
├── Three.js r140 (CDN, SRI-secured)
├── OrbitControls r140 (CDN, SRI-secured)
├── styles.css
│   ├── Sidebar layout
│   ├── Dark / Light theme (smooth CSS transitions)
│   ├── Loading spinner
│   ├── Help overlay
│   ├── Minimap styling
│   └── Info panel / Tooltip
└── js/
    ├── data.js — Constants, PDATA[], PLANET_INFO{}, State
    ├── physics.js — CircularBuffer, Kepler solver, pos3D()
    ├── textures.js — Procedural textures (size-dependent resolution)
    ├── scene.js — Three.js setup, lights, planets, moons, Saturn rings, LOD
    ├── ui.js — DOM, events, tooltip, info panel, shortcuts, click-to-follow
    └── main.js — animate() loop, trails, minimap, follow mode, auto-pause
```

---

## License

Private project — not intended for redistribution.
