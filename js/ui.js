/* Solar System — UI Module
   DOM references, event handlers, tooltip, info panel, keyboard shortcuts. */
(function(SS) {
  const PDATA = SS.PDATA, PLANET_INFO = SS.PLANET_INFO;
  const planets = SS.planets, camera = SS.camera, ctrl = SS.ctrl;
  const scene = SS.scene, renderer = SS.renderer, canvas = SS.canvas;
  const clamp = SS.clamp, pos3D = SS.pos3D, auToWorld = SS.auToWorld, pSize = SS.pSize;
  const AU_KM = SS.AU_KM, TWO_PI = SS.TWO_PI, GM_SUN = SS.GM_SUN;
  const state = SS.state;

  const SPEED_PRESET_1_DAY = 1;
  const SPEED_PRESET_1_MONTH = 30;
  const SPEED_PRESET_1_YEAR = 365.25;
  const SPEED_PRESET_1_WEEK = 7;
  const SPEED_MULTIPLIER_DOWN = 0.1;
  const SPEED_MULTIPLIER_UP = 10;
  const ZOOM_MIN = 3;
  const ZOOM_MAX = 250;
  const ZOOM_STEP = 0.5;
  const ZOOM_DEFAULT = 80;
  const ZOOM_FALLBACK = 80;
  const ZOOM_BUTTON_SCALE_IN = 0.8;
  const ZOOM_BUTTON_SCALE_OUT = 1.25;
  const TRAIL_INFINITE_DAYS = 36501;
  const FOLLOW_CLICK_DRAG_THRESHOLD = 4;
  const TOOLTIP_OFFSET_X = 14;
  const TOOLTIP_OFFSET_Y = 14;
  const SCREENSHOT_PREFIX = 'solar_system_3d_';
  const LIGHT_THEME_BACKGROUND = 0xe8ecf0;
  const DARK_THEME_BACKGROUND = 0x020c14;

  /* ══════ DOM refs ══════ */
  const $ = id => document.getElementById(id);
  const playBtn = $('play'), resetBtn = $('reset'), speedInput = $('speed'), speedNum = $('speedNum');
  const speedDown = $('speedDown'), speedUp = $('speedUp'), dateEl = $('date');
  const showRotation = $('showRotation'), showVelocity = $('showVelocity');
  const showOrbits = $('showOrbits'), showTrails = $('showTrails'), trailLengthInput = $('trailLength');
  const trailValEl = $('trailVal'), showMoons = $('showMoons'), showBelt = $('showBelt'), showDwarfs = $('showDwarfs');
  const zoomEl = $('zoom'), zoomNum = $('zoomNum'), zoomInBtn = $('zoomIn'), zoomOutBtn = $('zoomOut');
  const pScaleInput = $('planetScale'), pScaleVal = $('planetScaleVal');
  const followSelect = $('follow'), seekDate = $('seekDate'), screenshotBtn = $('screenshot');
  const themeToggle = $('themeToggle'), toggleSidebar = $('toggleSidebar'), tooltip = $('tooltip');
  const infoPanel = $('infoPanel'), minimapCanvas = $('minimap');
  const minimapCtx = minimapCanvas.getContext('2d');

  // populate follow dropdown
  PDATA.forEach(d => { const o = document.createElement('option'); o.value = d.name; o.textContent = d.name; if (d.dwarf) o.classList.add('dwarf-opt'); followSelect.appendChild(o); });

  // sync dwarf planet visibility in dropdown
  showDwarfs.addEventListener('change', () => {
    const hide = !showDwarfs.checked;
    followSelect.querySelectorAll('.dwarf-opt').forEach(o => { o.hidden = hide; o.disabled = hide; });
    if (hide && PDATA.find(p => p.dwarf && p.name === state.followTarget)) { followSelect.value = ''; state.followTarget = ''; updateInfoPanel(''); }
  });

  /* ══════ event handlers ══════ */
  speedInput.addEventListener('input', e => { state.daysPerSecond = clamp(+e.target.value, +speedInput.min, +speedInput.max); speedNum.value = state.daysPerSecond; });
  speedNum.addEventListener('input', e => { state.daysPerSecond = clamp(+e.target.value || 0, +speedInput.min, +speedNum.max); speedInput.value = state.daysPerSecond; });
  speedDown.addEventListener('click', () => { state.daysPerSecond = clamp(state.daysPerSecond * SPEED_MULTIPLIER_DOWN, +speedInput.min, +speedNum.max); speedInput.value = state.daysPerSecond; speedNum.value = state.daysPerSecond; });
  speedUp.addEventListener('click', () => { state.daysPerSecond = clamp(state.daysPerSecond * SPEED_MULTIPLIER_UP, +speedInput.min, +speedNum.max); speedInput.value = state.daysPerSecond; speedNum.value = state.daysPerSecond; });
  playBtn.addEventListener('click', () => { state.running = !state.running; playBtn.textContent = state.running ? 'Pause' : 'Play'; playBtn.setAttribute('aria-label', state.running ? 'Pause simulation' : 'Resume simulation'); state.lastT = performance.now(); });
  resetBtn.addEventListener('click', () => {
    state.simDays = 0;
    planets.forEach(p => { p.trail.clear(); p.trailGeo.setDrawRange(0, 0); p.moons.forEach(m => { m.trail.clear(); m.trailGeo.setDrawRange(0, 0); }); });
    ctrl.target.set(0, 0, 0);
  });

  trailLengthInput.addEventListener('input', e => { trailValEl.textContent = +e.target.value >= 36501 ? '∞' : e.target.value; });
  pScaleInput.addEventListener('input', e => { state.planetScale = +e.target.value; pScaleVal.textContent = (+e.target.value).toFixed(2); });
  followSelect.addEventListener('change', e => {
    state.followTarget = e.target.value;
    updateInfoPanel(e.target.value);
  });

  // speed presets
  function setSpeed(v) { state.daysPerSecond = v; speedInput.value = v; speedNum.value = v; }
  $('sp1d').addEventListener('click', () => setSpeed(SPEED_PRESET_1_DAY));
  $('sp1m').addEventListener('click', () => setSpeed(SPEED_PRESET_1_MONTH));
  $('sp1y').addEventListener('click', () => setSpeed(SPEED_PRESET_1_YEAR));
  $('sp1w').addEventListener('click', () => setSpeed(SPEED_PRESET_1_WEEK));

  // info panel
  function updateInfoPanel(name) {
    if (!name || !PLANET_INFO[name]) { infoPanel.style.display = 'none'; return; }
    const info = PLANET_INFO[name], d = PDATA.find(p => p.name === name);
    let html = `<h3>${name}</h3><div class="info-grid">`;
    html += `<span class="lbl">Type</span><span>${info.type}</span>`;
    html += `<span class="lbl">Mass</span><span>${info.mass}</span>`;
    html += `<span class="lbl">Diameter</span><span>${info.diameter}</span>`;
    html += `<span class="lbl">Gravity</span><span>${info.gravity}</span>`;
    html += `<span class="lbl">Day length</span><span>${info.day}</span>`;
    html += `<span class="lbl">Orbital period</span><span>${d ? d.T.toFixed(1) + ' days' : '—'}</span>`;
    html += `<span class="lbl">Known moons</span><span>${info.moons}</span>`;
    html += `<span class="lbl">Discovered</span><span>${info.discovered}</span>`;
    if (info.atmo) html += `<span class="lbl">Atmosphere</span><span>${info.atmo}</span>`;
    if (d) html += `<span class="lbl">Inclination</span><span>${d.i.toFixed(2)}°</span>`;
    if (d) html += `<span class="lbl">Eccentricity</span><span>${d.e}</span>`;
    html += `</div>`;
    infoPanel.innerHTML = html;
    infoPanel.style.display = 'block';
  }

  // zoom slider ↔ camera distance
  zoomEl.min = ZOOM_MIN; zoomEl.max = ZOOM_MAX; zoomEl.step = ZOOM_STEP; zoomEl.value = ZOOM_DEFAULT;
  zoomNum.min = ZOOM_MIN; zoomNum.max = ZOOM_MAX; zoomNum.value = ZOOM_DEFAULT;

  function camDist() { return camera.position.distanceTo(ctrl.target); }
  function setCamDist(d) {
    const dir = camera.position.clone().sub(ctrl.target).normalize();
    camera.position.copy(ctrl.target).add(dir.multiplyScalar(d));
  }
  zoomEl.addEventListener('input', e => { setCamDist(+e.target.value); zoomNum.value = (+e.target.value).toFixed(1); });
  zoomNum.addEventListener('input', e => { const v = clamp(+e.target.value || ZOOM_FALLBACK, ZOOM_MIN, ZOOM_MAX); setCamDist(v); zoomEl.value = v; });
  zoomInBtn.addEventListener('click', () => { const d = camDist() * ZOOM_BUTTON_SCALE_IN; setCamDist(d); zoomEl.value = d; zoomNum.value = d.toFixed(1); });
  zoomOutBtn.addEventListener('click', () => { const d = camDist() * ZOOM_BUTTON_SCALE_OUT; setCamDist(d); zoomEl.value = d; zoomNum.value = d.toFixed(1); });
  ctrl.addEventListener('change', () => { const d = camDist(); zoomEl.value = clamp(d, ZOOM_MIN, ZOOM_MAX); zoomNum.value = d.toFixed(1); });

  seekDate.addEventListener('change', e => { const d = new Date(e.target.value); if (!isNaN(d)) state.simDays = (d - SS.startDate) / 86400000; });
  screenshotBtn.addEventListener('click', () => {
    renderer.render(scene, camera);
    const link = document.createElement('a');
    link.download = SCREENSHOT_PREFIX + new Date().toISOString().slice(0, 10) + '.png';
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
  });
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    scene.background.set(document.body.classList.contains('light') ? LIGHT_THEME_BACKGROUND : DARK_THEME_BACKGROUND);
  });
  toggleSidebar.addEventListener('click', () => $('sidebar').classList.toggle('collapsed'));

  /* ══════ shared picking helper (3D→screen projection) ══════ */
  const _proj = new THREE.Vector3();
  function findBodyAt(mx, my) {
    let best = null, bestD = 0.045, bestMoon = null;
    for (const p of planets) {
      _proj.copy(p.mesh.position).project(camera);
      const d = Math.hypot(_proj.x - mx, _proj.y - my);
      if (d < bestD) { bestD = d; best = p; bestMoon = null; }
    }
    for (const p of planets) {
      for (const m of p.moons) {
        if (!m.mesh.visible) continue;
        _proj.copy(m.mesh.position).project(camera);
        const d = Math.hypot(_proj.x - mx, _proj.y - my);
        if (d < bestD) { bestD = d; bestMoon = m; best = p; }
      }
    }
    return {planet: best, moon: bestMoon};
  }

  /* ══════ tooltip via 3D→screen projection ══════ */
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const {planet: best, moon: bestMoon} = findBodyAt(mx, my);

    if (bestMoon) {
      const md = bestMoon.data, pd = best.data;
      tooltip.innerHTML = `<b>${md.name}</b><br>Moon of ${pd.name}<br>Period: ${md.T.toFixed(2)} days<br>Radius: ${(md.R * 6378).toFixed(0)} km<br>Eccentricity: ${md.e}`;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + TOOLTIP_OFFSET_X) + 'px';
      tooltip.style.top = (e.clientY + TOOLTIP_OFFSET_Y) + 'px';
    } else if (best) {
      const d = best.data;
      const {r_au} = pos3D(state.simDays, d);
      const r_km = r_au * AU_KM, a_km = d.a * AU_KM;
      const v = Math.sqrt(GM_SUN * (2 / r_km - 1 / a_km)).toFixed(1);
      tooltip.innerHTML = `<b>${d.name}</b><br>Radius: ${(d.R * 6378).toFixed(0)} km<br>Distance: ${r_au.toFixed(3)} AU<br>Speed: ${v} km/s<br>Period: ${d.T.toFixed(1)} days<br>Inclination: ${d.i.toFixed(2)}°<br>Eccentricity: ${d.e}`;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + TOOLTIP_OFFSET_X) + 'px';
      tooltip.style.top = (e.clientY + TOOLTIP_OFFSET_Y) + 'px';
    } else tooltip.style.display = 'none';
  });
  canvas.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

  /* ══════ click to select/follow (ignore drags) ══════ */
  let _downX, _downY;
  canvas.addEventListener('mousedown', e => { _downX = e.clientX; _downY = e.clientY; });
  canvas.addEventListener('click', e => {
    if (Math.hypot(e.clientX - _downX, e.clientY - _downY) > FOLLOW_CLICK_DRAG_THRESHOLD) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const {planet: best} = findBodyAt(mx, my);
    if (best && best.data.name !== state.followTarget) {
      state.followTarget = best.data.name;
      followSelect.value = best.data.name;
      updateInfoPanel(best.data.name);
    } else if (!best) {
      state.followTarget = '';
      followSelect.value = '';
      updateInfoPanel('');
    }
  });

  /* ══════ WebGL context loss handling ══════ */
  const webglOverlay = document.getElementById('webglOverlay');
  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault();
    state.running = false;
    playBtn.textContent = 'Play';
    playBtn.setAttribute('aria-label', 'Resume simulation');
    webglOverlay.classList.add('active');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    webglOverlay.classList.remove('active');
    state.lastT = performance.now();
  });

  /* ══════ help overlay ══════ */
  const helpOverlay = document.getElementById('helpOverlay');
  const helpBtn = document.getElementById('helpBtn');
  const helpClose = document.getElementById('helpClose');
  function toggleHelp() { helpOverlay.classList.toggle('active'); }
  helpBtn.addEventListener('click', toggleHelp);
  helpClose.addEventListener('click', toggleHelp);
  helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) toggleHelp(); });

  /* ══════ keyboard shortcuts ══════ */
  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        playBtn.click();
        break;
      case 'Equal': case 'NumpadAdd':
        e.preventDefault();
        zoomInBtn.click();
        break;
      case 'Minus': case 'NumpadSubtract':
        e.preventDefault();
        zoomOutBtn.click();
        break;
      case 'BracketLeft':
        e.preventDefault();
        speedDown.click();
        break;
      case 'BracketRight':
        e.preventDefault();
        speedUp.click();
        break;
      case 'Escape':
        followSelect.value = '';
        state.followTarget = '';
        updateInfoPanel('');
        if (helpOverlay.classList.contains('active')) toggleHelp();
        break;
      case 'Slash':
        if (e.key === '?') { e.preventDefault(); toggleHelp(); }
        break;
    }
  });

  /* ══════ export to namespace ══════ */
  SS.dom = {
    showRotation, showVelocity, showOrbits, showTrails, trailLengthInput,
    showMoons, showBelt, showDwarfs, dateEl, minimapCanvas, minimapCtx
  };
  SS.updateInfoPanel = updateInfoPanel;
})(window.SS);
