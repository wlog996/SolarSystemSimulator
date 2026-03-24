/* Solar System — Textures Module
   Procedural planet and sun texture generation. */
(function(SS) {
  const TWO_PI = SS.TWO_PI;

  const TEXTURE_SIZE_LARGE = 1024;
  const TEXTURE_SIZE_DEFAULT = 512;
  const TEXTURE_SIZE_SMALL = 256;
  const TEXTURE_ASPECT = 0.5;
  const LARGE_BODY_RADIUS = 3;
  const SMALL_BODY_RADIUS = 0.2;
  const MERCURY_CRATER_COUNT = 300;
  const MERCURY_CRATER_RADIUS_MIN = 1;
  const MERCURY_CRATER_RADIUS_MAX = 5;
  const VENUS_BAND_OFFSET = 30;
  const VENUS_SWIRL_COUNT = 60;
  const VENUS_SWIRL_RADIUS_MIN = 8;
  const VENUS_SWIRL_RADIUS_MAX = 25;
  const EARTH_OCEAN_BLUE = '#1a5fa0';
  const EARTH_STRIPE_VARIATION = 0.04;
  const EARTH_CONTINENT_DETAIL = 12;
  const EARTH_CLOUD_COUNT = 40;
  const EARTH_POLAR_CAP_HEIGHT = 10;
  const MARS_BAND_VARIATION = 0.05;
  const MARS_CRATER_COUNT = 120;
  const MARS_CRATER_RADIUS_MIN = 3;
  const MARS_CRATER_RADIUS_MAX = 15;
  const MARS_POLE_HEIGHT = 6;
  const JUPITER_BAND_PALETTE = ['#c9a96e', '#e0c88e', '#a07848', '#d4b880', '#b89058', '#c8a468', '#987040', '#dcc090', '#a88050', '#caac70'];
  const JUPITER_BAND_MULTIPLIER = 1.8;
  const JUPITER_BAND_WAVE = 0.12;
  const JUPITER_TURBULENCE_FREQ_A = 0.15;
  const JUPITER_TURBULENCE_FREQ_B = 0.4;
  const JUPITER_SPOT_X = 0.62;
  const JUPITER_SPOT_Y = 0.58;
  const JUPITER_SPOT_RX = 22;
  const JUPITER_SPOT_RY = 12;
  const JUPITER_SPOT_INNER_RX = 18;
  const JUPITER_SPOT_INNER_RY = 9;
  const SATURN_BAND_PALETTE = ['#e8d8a8', '#d4c090', '#c8b480', '#dcc898', '#e4d4a4', '#cabc88'];
  const SATURN_BAND_MULTIPLIER = 2.2;
  const URANUS_WAVE_A = 0.02;
  const URANUS_WAVE_B = 0.03;
  const URANUS_WAVE_C = 0.025;
  const NEPTUNE_WAVE_A = 0.04;
  const NEPTUNE_WAVE_B = 0.06;
  const NEPTUNE_WAVE_C = 0.03;
  const NEPTUNE_SPOT_X = 0.4;
  const NEPTUNE_SPOT_Y = 0.45;
  const NEPTUNE_SPOT_RX = 12;
  const NEPTUNE_SPOT_RY = 6;
  const PLUTO_CRATER_COUNT = 100;
  const PLUTO_CRATER_RADIUS_MIN = 4;
  const PLUTO_CRATER_RADIUS_MAX = 12;
  const PLUTO_HEART_X = 0.35;
  const PLUTO_HEART_Y = 0.45;
  const PLUTO_HEART_RX = 30;
  const PLUTO_HEART_RY = 25;
  const CERES_CRATER_COUNT = 200;
  const CERES_CRATER_RADIUS_MIN = 1;
  const CERES_CRATER_RADIUS_MAX = 4;
  const CERES_BRIGHT_SPOT_X = 0.4;
  const CERES_BRIGHT_SPOT_Y = 0.4;
  const CERES_BRIGHT_SPOT_RADIUS = 4;
  const DWARF_CRATER_COUNT = 80;
  const DWARF_CRATER_RADIUS_MIN = 3;
  const DWARF_CRATER_RADIUS_MAX = 10;
  const SUN_TEXTURE_WIDTH = 512;
  const SUN_TEXTURE_HEIGHT = 256;
  const SUN_RNG_SEED = 42;
  const SUN_BIG_SPOT_COUNT = 200;
  const SUN_BIG_SPOT_RADIUS_MIN = 3;
  const SUN_BIG_SPOT_RADIUS_MAX = 12;
  const SUN_BIG_SPOT_ALPHA_MIN = 0.08;
  const SUN_BIG_SPOT_ALPHA_MAX = 0.12;
  const SUN_SMALL_SPOT_COUNT = 80;
  const SUN_SMALL_SPOT_RADIUS_MIN = 1;
  const SUN_SMALL_SPOT_RADIUS_MAX = 4;
  const SUN_SMALL_SPOT_ALPHA_MIN = 0.15;
  const SUN_SMALL_SPOT_ALPHA_MAX = 0.2;

  SS.makeTex = function(name, col) {
    // Scale resolution by planet size: gas giants get more detail, dwarfs less
    const pdata = SS.PDATA.find(p => p.name === name);
    const R = pdata ? pdata.R : 1;
    const W = R > LARGE_BODY_RADIUS ? TEXTURE_SIZE_LARGE : R < SMALL_BODY_RADIUS ? TEXTURE_SIZE_SMALL : TEXTURE_SIZE_DEFAULT;
    const H = W * TEXTURE_ASPECT;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    let s = 0; for (let i = 0; i < name.length; i++) s = s * 31 + name.charCodeAt(i);
    const rng = () => { s = (s * 16807) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff; };
    const hex = '#' + col.toString(16).padStart(6, '0');
    c.fillStyle = hex; c.fillRect(0, 0, W, H);

    if (name === 'Mercury') {
      for (let i = 0; i < MERCURY_CRATER_COUNT; i++) { const x = rng() * W, y = rng() * H, r = MERCURY_CRATER_RADIUS_MIN + rng() * (MERCURY_CRATER_RADIUS_MAX - MERCURY_CRATER_RADIUS_MIN);
        c.beginPath(); c.arc(x, y, r, 0, TWO_PI); c.fillStyle = `rgba(${50 + rng() * 60},${50 + rng() * 60},${55 + rng() * 55},${0.15 + rng() * 0.25})`; c.fill(); }
    } else if (name === 'Venus') {
      for (let y = 0; y < H; y++) { const off = Math.sin(y * 0.02 + rng() * 0.3) * VENUS_BAND_OFFSET;
        c.fillStyle = `rgba(240,${190 + rng() * 40},${100 + rng() * 50},0.08)`; c.fillRect(off, y, W, 1); }
      for (let i = 0; i < VENUS_SWIRL_COUNT; i++) { const x = rng() * W, y2 = rng() * H, r = VENUS_SWIRL_RADIUS_MIN + rng() * (VENUS_SWIRL_RADIUS_MAX - VENUS_SWIRL_RADIUS_MIN);
        c.beginPath(); c.arc(x, y2, r, 0, TWO_PI); c.fillStyle = `rgba(255,220,150,${0.03 + rng() * 0.06})`; c.fill(); }
    } else if (name === 'Earth') {
      c.fillStyle = EARTH_OCEAN_BLUE; c.fillRect(0, 0, W, H);
      c.fillStyle = '#1e6ab8'; for (let y = 0; y < H; y++) { c.fillStyle = `rgb(${30 + Math.sin(y * EARTH_STRIPE_VARIATION) * 10},${85 + Math.sin(y * 0.06) * 15},${160 + Math.sin(y * 0.03) * 20})`; c.fillRect(0, y, W, 1); }
      const continents = [[0.15, 0.3, 35], [0.3, 0.35, 25], [0.55, 0.4, 40], [0.7, 0.3, 30], [0.8, 0.55, 45], [0.2, 0.65, 20], [0.45, 0.7, 25]];
      continents.forEach(([cx, cy, sz]) => { for (let i = 0; i < EARTH_CONTINENT_DETAIL; i++) { const a = rng() * TWO_PI, r = sz * (0.3 + rng() * 0.7);
        c.beginPath(); c.arc(cx * W + Math.cos(a) * r, cy * H + Math.sin(a) * r, 5 + rng() * sz * 0.5, 0, TWO_PI);
        c.fillStyle = rng() > 0.4 ? `rgb(${40 + rng() * 30},${100 + rng() * 50},${40 + rng() * 20})` : `rgb(${120 + rng() * 40},${110 + rng() * 30},${60 + rng() * 20})`; c.fill(); } });
      c.fillStyle = 'rgba(235,245,255,0.65)'; c.fillRect(0, 0, W, EARTH_POLAR_CAP_HEIGHT); c.fillRect(0, H - EARTH_POLAR_CAP_HEIGHT, W, EARTH_POLAR_CAP_HEIGHT);
      for (let i = 0; i < EARTH_CLOUD_COUNT; i++) { const x = rng() * W, y2 = rng() * H, r = 10 + rng() * 30;
        c.beginPath(); c.arc(x, y2, r, 0, TWO_PI); c.fillStyle = `rgba(255,255,255,${0.02 + rng() * 0.05})`; c.fill(); }
    } else if (name === 'Mars') {
      for (let y = 0; y < H; y++) { c.fillStyle = `rgb(${190 + Math.sin(y * MARS_BAND_VARIATION) * 20},${85 + Math.sin(y * 0.07) * 15},${50 + Math.sin(y * 0.04) * 10})`; c.fillRect(0, y, W, 1); }
      for (let i = 0; i < MARS_CRATER_COUNT; i++) { const x = rng() * W, y2 = rng() * H, r = MARS_CRATER_RADIUS_MIN + rng() * (MARS_CRATER_RADIUS_MAX - MARS_CRATER_RADIUS_MIN);
        c.beginPath(); c.arc(x, y2, r, 0, TWO_PI); c.fillStyle = `rgba(${130 + rng() * 40},${50 + rng() * 25},${25 + rng() * 15},0.2)`; c.fill(); }
      c.fillStyle = 'rgba(230,220,200,0.4)'; c.fillRect(0, 0, W, MARS_POLE_HEIGHT); c.fillRect(0, H - MARS_POLE_HEIGHT, W, MARS_POLE_HEIGHT);
    } else if (name === 'Jupiter') {
      const bands = JUPITER_BAND_PALETTE;
      for (let y = 0; y < H; y++) { const bi = Math.floor((y / H) * bands.length * JUPITER_BAND_MULTIPLIER + Math.sin(y * JUPITER_BAND_WAVE) * 0.8);
        c.fillStyle = bands[((bi % bands.length) + bands.length) % bands.length]; c.fillRect(0, y, W, 1); }
      for (let y = 0; y < H; y++) { const turb = Math.sin(y * JUPITER_TURBULENCE_FREQ_A) * 3 + Math.sin(y * JUPITER_TURBULENCE_FREQ_B) * 1.5;
        c.fillStyle = `rgba(180,140,80,0.06)`; c.fillRect(turb, y, W, 1); }
      c.beginPath(); c.ellipse(W * JUPITER_SPOT_X, H * JUPITER_SPOT_Y, JUPITER_SPOT_RX, JUPITER_SPOT_RY, 0.1, 0, TWO_PI); c.fillStyle = '#c45828'; c.fill();
      c.beginPath(); c.ellipse(W * JUPITER_SPOT_X, H * JUPITER_SPOT_Y, JUPITER_SPOT_INNER_RX, JUPITER_SPOT_INNER_RY, 0.1, 0, TWO_PI); c.fillStyle = '#d06838'; c.fill();
    } else if (name === 'Saturn') {
      const bands = SATURN_BAND_PALETTE;
      for (let y = 0; y < H; y++) { const bi = Math.floor((y / H) * bands.length * SATURN_BAND_MULTIPLIER); c.fillStyle = bands[((bi % bands.length) + bands.length) % bands.length]; c.fillRect(0, y, W, 1); }
    } else if (name === 'Uranus') {
      for (let y = 0; y < H; y++) { c.fillStyle = `rgb(${145 + Math.sin(y * URANUS_WAVE_A) * 8},${215 + Math.sin(y * URANUS_WAVE_B) * 6},${230 + Math.sin(y * URANUS_WAVE_C) * 6})`; c.fillRect(0, y, W, 1); }
    } else if (name === 'Neptune') {
      for (let y = 0; y < H; y++) { c.fillStyle = `rgb(${45 + Math.sin(y * NEPTUNE_WAVE_A) * 12},${75 + Math.sin(y * NEPTUNE_WAVE_B) * 10},${195 + Math.sin(y * NEPTUNE_WAVE_C) * 18})`; c.fillRect(0, y, W, 1); }
      c.beginPath(); c.ellipse(W * NEPTUNE_SPOT_X, H * NEPTUNE_SPOT_Y, NEPTUNE_SPOT_RX, NEPTUNE_SPOT_RY, 0, 0, TWO_PI); c.fillStyle = 'rgba(80,120,255,0.3)'; c.fill();
    } else if (name === 'Pluto') {
      for (let i = 0; i < PLUTO_CRATER_COUNT; i++) { const x = rng() * W, y2 = rng() * H, r = PLUTO_CRATER_RADIUS_MIN + rng() * (PLUTO_CRATER_RADIUS_MAX - PLUTO_CRATER_RADIUS_MIN);
        c.beginPath(); c.arc(x, y2, r, 0, TWO_PI); c.fillStyle = `rgba(${175 + rng() * 35},${155 + rng() * 35},${135 + rng() * 30},0.15)`; c.fill(); }
      c.beginPath(); c.ellipse(W * PLUTO_HEART_X, H * PLUTO_HEART_Y, PLUTO_HEART_RX, PLUTO_HEART_RY, 0, 0, TWO_PI); c.fillStyle = 'rgba(210,200,180,0.2)'; c.fill();
    } else if (name === 'Ceres') {
      for (let i = 0; i < CERES_CRATER_COUNT; i++) { const x = rng() * W, y2 = rng() * H, r = CERES_CRATER_RADIUS_MIN + rng() * (CERES_CRATER_RADIUS_MAX - CERES_CRATER_RADIUS_MIN);
        c.beginPath(); c.arc(x, y2, r, 0, TWO_PI); c.fillStyle = `rgba(${100 + rng() * 40},${100 + rng() * 40},${85 + rng() * 35},${0.12 + rng() * 0.18})`; c.fill(); }
      c.beginPath(); c.arc(W * CERES_BRIGHT_SPOT_X, H * CERES_BRIGHT_SPOT_Y, CERES_BRIGHT_SPOT_RADIUS, 0, TWO_PI); c.fillStyle = 'rgba(240,240,250,0.5)'; c.fill();
    } else if (name === 'Eris' || name === 'Haumea' || name === 'Makemake') {
      for (let i = 0; i < DWARF_CRATER_COUNT; i++) { const x = rng() * W, y2 = rng() * H, r = DWARF_CRATER_RADIUS_MIN + rng() * (DWARF_CRATER_RADIUS_MAX - DWARF_CRATER_RADIUS_MIN);
        c.beginPath(); c.arc(x, y2, r, 0, TWO_PI); c.fillStyle = `rgba(${160 + rng() * 40},${150 + rng() * 40},${140 + rng() * 30},0.1)`; c.fill(); }
    }
    return new THREE.CanvasTexture(cv);
  };

  SS.makeSunTex = function() {
    const W = SUN_TEXTURE_WIDTH, H = SUN_TEXTURE_HEIGHT, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    const gr = c.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#ffe080'); gr.addColorStop(0.5, '#ffcc44'); gr.addColorStop(1, '#ffb820');
    c.fillStyle = gr; c.fillRect(0, 0, W, H);
    let s = SUN_RNG_SEED; const rng = () => { s = (s * 16807) % 2147483647; return (s & 0x7fffffff) / 0x7fffffff; };
    for (let i = 0; i < SUN_BIG_SPOT_COUNT; i++) { const x = rng() * W, y = rng() * H, r = SUN_BIG_SPOT_RADIUS_MIN + rng() * (SUN_BIG_SPOT_RADIUS_MAX - SUN_BIG_SPOT_RADIUS_MIN);
      c.beginPath(); c.arc(x, y, r, 0, TWO_PI); c.fillStyle = `rgba(255,${200 + rng() * 55},${rng() * 60},${SUN_BIG_SPOT_ALPHA_MIN + rng() * (SUN_BIG_SPOT_ALPHA_MAX - SUN_BIG_SPOT_ALPHA_MIN)})`; c.fill(); }
    for (let i = 0; i < SUN_SMALL_SPOT_COUNT; i++) { const x = rng() * W, y = rng() * H, r = SUN_SMALL_SPOT_RADIUS_MIN + rng() * (SUN_SMALL_SPOT_RADIUS_MAX - SUN_SMALL_SPOT_RADIUS_MIN);
      c.beginPath(); c.arc(x, y, r, 0, TWO_PI); c.fillStyle = `rgba(255,255,220,${SUN_SMALL_SPOT_ALPHA_MIN + rng() * (SUN_SMALL_SPOT_ALPHA_MAX - SUN_SMALL_SPOT_ALPHA_MIN)})`; c.fill(); }
    return new THREE.CanvasTexture(cv);
  };
})(window.SS);
