/* Solar System — Main / Animation Loop */
(function(SS) {
  const DEG = SS.DEG, TWO_PI = SS.TWO_PI;
  const pos3D = SS.pos3D, pSize = SS.pSize, trueAnomaly = SS.trueAnomaly, auToWorld = SS.auToWorld;
  const planets = SS.planets, camera = SS.camera, ctrl = SS.ctrl;
  const renderer = SS.renderer, scene = SS.scene, resize = SS.resize;
  const eclipticGrid = SS.eclipticGrid;
  const starfield = SS.starfield;
  const geoHi = SS.geoHi, geoMed = SS.geoMed, geoLo = SS.geoLo;
  const N_AST = SS.N_AST, astData = SS.astData, astBuf = SS.astBuf, astGeo = SS.astGeo, astPts = SS.astPts;
  const sunMesh = SS.sunMesh, sunGlow = SS.sunGlow;
  const startDate = SS.startDate, state = SS.state;
  const dom = SS.dom;

  const LOD_NEAR_DISTANCE = 20;
  const LOD_MID_DISTANCE = 60;
  const TRAIL_POINT_SPACING = 0.03;
  const MOON_TRAIL_POINT_SPACING = 0.01;
  const MOON_ORBIT_GAP = 0.3;
  const TRAIL_INFINITE_DAYS = 36501;
  const FOLLOW_LERP = 0.08;
  const MINIMAP_SIZE = 180;
  const MINIMAP_PADDING = 8;
  const MINIMAP_SUN_RADIUS = 3;

  const _tmpV = new THREE.Vector3();

  function animate() {
    requestAnimationFrame(animate);
    if (!SS._loaded) { document.body.classList.add('loaded'); SS._loaded = true; }
    const now = performance.now();
    const dtDays = state.running ? (now - state.lastT) / 1000 * state.daysPerSecond : 0;
    if (state.running) state.simDays += dtDays;
    state.lastT = now;
    resize();

    const trailRaw = +dom.trailLengthInput.value;
    const trailDays = trailRaw >= TRAIL_INFINITE_DAYS ? Infinity : trailRaw;
    const showRot = dom.showRotation.checked;

    /* scale sun dynamically */
    const sunS = SS.sunSize();
    sunMesh.scale.setScalar(sunS);
    sunGlow.scale.setScalar(sunS * 2.5);

    /* update planets */
    planets.forEach(p => {
      if (p.data.dwarf && !dom.showDwarfs.checked) {
        p.mesh.visible = false; p.orbitLine.visible = false; p.trailLine.visible = false;
        return;
      }
      const {v, r_au} = pos3D(state.simDays, p.data);
      const s = pSize(p.data.R);
      p.mesh.position.copy(v);
      p.mesh.scale.setScalar(s);
      p.mesh.visible = true;

      // axial tilt
      if (p.data.tilt != null) p.mesh.rotation.x = p.data.tilt * DEG;

      if (p.data.rotH) {
        const rd = Math.abs(p.data.rotH) / 24;
        p.mesh.rotation.y = (state.simDays % rd) / rd * TWO_PI * (p.data.rotH < 0 ? -1 : 1);
      }
      p.axLine.visible = showRot;
      p.orbitLine.visible = dom.showOrbits.checked;

      // LOD: swap geometry based on camera distance
      const camDist = camera.position.distanceTo(p.mesh.position);
      const targetGeo = camDist < LOD_NEAR_DISTANCE ? geoHi : camDist < LOD_MID_DISTANCE ? geoMed : geoLo;
      if (p.mesh.geometry !== targetGeo) p.mesh.geometry = targetGeo;

      // trails
      if (dom.showTrails.checked) {
        const last = p.trail.peekNewest();
        if (!last || _tmpV.copy(v).sub(last.pos).length() > TRAIL_POINT_SPACING) {
          p.trail.push({pos: v.clone(), t: state.simDays});
        }
        if (trailDays !== Infinity) while (p.trail.length > 0 && (state.simDays - p.trail.peekOldest().t) > trailDays) p.trail.dequeue();
        p.trail.copyToFloat32(p.trailBuf);
        p.trailGeo.attributes.position.needsUpdate = true;
        p.trailGeo.setDrawRange(0, p.trail.length);
        p.trailLine.visible = true;
      } else {
        p.trailLine.visible = false;
        if (p.trail.length) { p.trail.clear(); p.trailGeo.setDrawRange(0, 0); }
      }

      // moons
      p.moons.forEach(moon => {
        if (!dom.showMoons.checked) { moon.mesh.visible = false; moon.trailLine.visible = false; return; }
        const mT = moon.data.T, mE = moon.data.e || 0;
        const M = ((state.simDays % mT) / mT) * TWO_PI;
        const nu = trueAnomaly(M, mE);
        const ms = Math.max(0.02, pSize(moon.data.R) * 0.5);
        // s*2.8 clears Saturn rings (outerR=2.5), sqrt(dist) fans out moons
        const moonR = Math.max(
          s * 2.8 + Math.sqrt(moon.data.dist) * 0.2,
          s + ms + MOON_ORBIT_GAP + moon.idx * (ms + 0.15)
        );
        const dx = Math.cos(nu) * moonR, dz = -Math.sin(nu) * moonR;
        // Rotate moon offset into planet's equatorial plane (axial tilt)
        const tiltRad = (p.data.tilt || 0) * DEG;
        const cosT = Math.cos(tiltRad), sinT = Math.sin(tiltRad);
        const mx = v.x + dx;
        const my = v.y - dz * sinT;
        const mz = v.z + dz * cosT;
        moon.mesh.position.set(mx, my, mz);
        moon.mesh.scale.setScalar(ms);
        moon.mesh.visible = true;

        if (dom.showTrails.checked) {
          // At high speed (frame dt > moon period), sub-stepping just creates visual noise;
          // record one point per frame instead. At low/medium speed, sub-step for a smooth helix.
          const absT = Math.abs(mT);
          if (dtDays < absT) {
            const effectiveDt = dtDays;
            const nSteps = Math.max(1, Math.ceil((effectiveDt / absT) * 36));
            const prev = pos3D(state.simDays - effectiveDt, p.data).v;
            for (let si = 1; si <= nSteps; si++) {
              const frac = si / nSteps;
              const subDays = state.simDays - effectiveDt * (1 - frac);
              const subM = ((subDays % mT) / mT) * TWO_PI;
              const subNu = trueAnomaly(subM, mE);
              const sDx = Math.cos(subNu) * moonR, sDz = -Math.sin(subNu) * moonR;
              const cx = prev.x + (v.x - prev.x) * frac;
              const cy = prev.y + (v.y - prev.y) * frac;
              const cz = prev.z + (v.z - prev.z) * frac;
              const smx = cx + sDx, smy = cy - sDz * sinT, smz = cz + sDz * cosT;
              const mLast = moon.trail.peekNewest();
              if (!mLast || _tmpV.set(smx, smy, smz).sub(mLast.pos).length() > MOON_TRAIL_POINT_SPACING) {
                moon.trail.push({pos: new THREE.Vector3(smx, smy, smz), t: subDays});
              }
            }
          } else {
            // High speed: just record the current position (one point per frame)
            const mLast = moon.trail.peekNewest();
            if (!mLast || _tmpV.set(mx, my, mz).sub(mLast.pos).length() > TRAIL_POINT_SPACING) {
              moon.trail.push({pos: new THREE.Vector3(mx, my, mz), t: state.simDays});
            }
          }
          if (trailDays !== Infinity) while (moon.trail.length > 0 && (state.simDays - moon.trail.peekOldest().t) > trailDays) moon.trail.dequeue();
          moon.trail.copyToFloat32(moon.trailBuf);
          moon.trailGeo.attributes.position.needsUpdate = true;
          moon.trailGeo.setDrawRange(0, moon.trail.length);
          moon.trailLine.visible = true;
        } else {
          moon.trailLine.visible = false;
          if (moon.trail.length) { moon.trail.clear(); moon.trailGeo.setDrawRange(0, 0); }
        }
      });
    });

    /* asteroid belt */
    if (dom.showBelt.checked) {
      for (let i = 0; i < N_AST; i++) {
        const a = astData[i], ang = a.a0 + (state.simDays / a.T) * TWO_PI;
        const r = auToWorld(a.au);
        astBuf[i * 3]     = Math.cos(ang) * r;
        astBuf[i * 3 + 1] = Math.sin(a.incR) * r * 0.03;
        astBuf[i * 3 + 2] = -Math.sin(ang) * r;
      }
      astGeo.attributes.position.needsUpdate = true;
      astPts.visible = true;
    } else astPts.visible = false;

    /* ecliptic grid visibility */
    eclipticGrid.visible = dom.showVelocity.checked;

    /* starfield tracks camera */
    starfield.position.copy(camera.position);

    /* follow mode */
    if (state.followTarget) {
      const fp = planets.find(p => p.data.name === state.followTarget);
      if (fp) {
        const offset = camera.position.clone().sub(ctrl.target);
        ctrl.target.lerp(fp.mesh.position, FOLLOW_LERP);
        camera.position.copy(ctrl.target).add(offset);
      }
    } else {
      const origin = new THREE.Vector3(0, 0, 0);
      if (ctrl.target.lengthSq() > 0.01) {
        const offset = camera.position.clone().sub(ctrl.target);
        ctrl.target.lerp(origin, FOLLOW_LERP);
        camera.position.copy(ctrl.target).add(offset);
      }
    }

    /* date display */
    const sd = new Date(startDate.getTime() + state.simDays * 86400000);
    dom.dateEl.textContent = sd.toISOString().slice(0, 10) + ` (+${state.simDays.toFixed(1)}d)`;

    /* minimap */
    {
      const mw = MINIMAP_SIZE, mh = MINIMAP_SIZE;
      if (dom.minimapCanvas.width !== mw * 2) { dom.minimapCanvas.width = mw * 2; dom.minimapCanvas.height = mh * 2; }
      const mc = dom.minimapCtx;
      mc.setTransform(2, 0, 0, 2, 0, 0);
      mc.clearRect(0, 0, mw, mh);
      mc.save();
      mc.beginPath(); mc.arc(mw / 2, mh / 2, mw / 2 - 1, 0, TWO_PI); mc.clip();
      mc.fillStyle = document.body.classList.contains('light') ? 'rgba(230,235,240,0.8)' : 'rgba(2,12,20,0.85)';
      mc.fillRect(0, 0, mw, mh);
      mc.beginPath(); mc.arc(mw / 2, mh / 2, MINIMAP_SUN_RADIUS, 0, TWO_PI); mc.fillStyle = '#ffd76b'; mc.fill();
      const mmScale = (mw / 2 - MINIMAP_PADDING) / auToWorld(50);
      planets.forEach(p => {
        if (p.data.dwarf && !dom.showDwarfs.checked) return;
        const pos = p.mesh.position;
        const px = mw / 2 + pos.x * mmScale, py = mh / 2 + pos.z * mmScale;
        mc.beginPath(); mc.arc(mw / 2, mh / 2, auToWorld(p.data.a) * mmScale, 0, TWO_PI);
        mc.strokeStyle = `rgba(255,255,255,${p.data.dwarf ? 0.06 : 0.12})`; mc.lineWidth = 0.5; mc.stroke();
        const dotR = p.data.dwarf ? 1 : Math.max(1.5, pSize(p.data.R) * 1.8);
        mc.beginPath(); mc.arc(px, py, dotR, 0, TWO_PI); mc.fillStyle = '#' + p.data.col.toString(16).padStart(6, '0'); mc.fill();
      });
      mc.restore();
    }

    ctrl.update();
    renderer.render(scene, camera);
  }
  animate();

  /* ══════ pause when tab hidden ══════ */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.running) {
      state.running = false;
      SS._pausedByVisibility = true;
      document.getElementById('play').textContent = 'Play';
      document.getElementById('play').setAttribute('aria-label', 'Resume simulation');
    } else if (!document.hidden && SS._pausedByVisibility) {
      state.running = true;
      SS._pausedByVisibility = false;
      state.lastT = performance.now();
      document.getElementById('play').textContent = 'Pause';
      document.getElementById('play').setAttribute('aria-label', 'Pause simulation');
    }
  });
})(window.SS);
