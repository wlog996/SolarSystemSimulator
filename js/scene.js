/* Solar System — Scene Module
   Three.js setup, lights, sun, starfield, planet/moon/asteroid creation. */
(function(SS) {
  const DEG = SS.DEG, TWO_PI = SS.TWO_PI;
  const PDATA = SS.PDATA;
  const makeTex = SS.makeTex, makeSunTex = SS.makeSunTex;
  const auToWorld = SS.auToWorld, pSize = SS.pSize, trueAnomaly = SS.trueAnomaly;
  const CircularBuffer = SS.CircularBuffer, MAX_TRAIL = SS.MAX_TRAIL;

  const CAMERA_MIN_DISTANCE = 3;
  const CAMERA_MAX_DISTANCE = 400;
  const CAMERA_FAR_PLANE = 800;
  const STARFIELD_COUNT = 2500;
  const STARFIELD_MIN_RADIUS = 350;
  const STARFIELD_RADIUS_SPREAD = 100;
  const ORBIT_SAMPLES = 360;
  const PLANET_GEOMETRY_HI = 32;
  const PLANET_GEOMETRY_MED = 24;
  const PLANET_GEOMETRY_LO = 12;
  const SATURN_RING_SEGMENTS = 128;
  const SATURN_RING_DETAIL = 3;

  /* ══════ Three.js setup ══════ */
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, preserveDrawingBuffer: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020c14);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, CAMERA_FAR_PLANE);
  camera.position.set(0, 40, 70);

  const ctrl = new THREE.OrbitControls(camera, canvas);
  ctrl.enableDamping = true;
  ctrl.dampingFactor = 0.08;
  ctrl.minDistance = CAMERA_MIN_DISTANCE;
  ctrl.maxDistance = CAMERA_MAX_DISTANCE;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio, 2);
    if (canvas.width === Math.floor(w * dpr) && canvas.height === Math.floor(h * dpr)) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* ══════ lights ══════ */
  scene.add(new THREE.AmbientLight(0x404060, 0.15));
  const sunLight = new THREE.PointLight(0xffffff, 2.5, 500);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 500;
  scene.add(sunLight);

  /* ══════ Sun + glow ══════ */
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({map: makeSunTex()})
  );
  scene.add(sunMesh);

  let sunGlow;
  {
    const s = 256, c2 = document.createElement('canvas');
    c2.width = s; c2.height = s;
    const g = c2.getContext('2d');
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, 'rgba(255,255,200,0.7)');
    gr.addColorStop(0.15, 'rgba(255,220,80,0.4)');
    gr.addColorStop(0.4, 'rgba(255,180,40,0.1)');
    gr.addColorStop(0.7, 'rgba(255,150,20,0.02)');
    gr.addColorStop(1, 'rgba(255,150,20,0)');
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(c2);
    sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false}));
    sunGlow.scale.setScalar(5);
    scene.add(sunGlow);
  }

  /* ══════ starfield ══════ */
  let starfield;
  {
    const N = STARFIELD_COUNT, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const θ = Math.random() * TWO_PI, φ = Math.acos(2 * Math.random() - 1), r = STARFIELD_MIN_RADIUS + Math.random() * STARFIELD_RADIUS_SPREAD;
      pos[i * 3] = r * Math.sin(φ) * Math.cos(θ);
      pos[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ);
      pos[i * 3 + 2] = r * Math.cos(φ);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starfield = new THREE.Points(g, new THREE.PointsMaterial({color: 0xffffff, size: 0.5, sizeAttenuation: false}));
    scene.add(starfield);
  }

  /* ══════ ecliptic grid ══════ */
  const eclipticGrid = new THREE.GridHelper(140, 30, 0x334466, 0x1a2a3a);
  eclipticGrid.material.opacity = 0.12;
  eclipticGrid.material.transparent = true;
  scene.add(eclipticGrid);

  /* ══════ per-planet material properties ══════ */
  const MATERIAL_PROPS = {
    Mercury: {roughness:0.9, metalness:0.05},
    Venus:   {roughness:0.6, metalness:0.01},
    Earth:   {roughness:0.5, metalness:0.03},
    Mars:    {roughness:0.85,metalness:0.02},
    Jupiter: {roughness:0.4, metalness:0.0},
    Saturn:  {roughness:0.45,metalness:0.0},
    Uranus:  {roughness:0.35,metalness:0.01},
    Neptune: {roughness:0.35,metalness:0.01},
    Pluto:   {roughness:0.8, metalness:0.02},
    Ceres:   {roughness:0.9, metalness:0.04},
    Eris:    {roughness:0.7, metalness:0.01},
    Haumea:  {roughness:0.65,metalness:0.01},
    Makemake:{roughness:0.7, metalness:0.02}
  };

  /* ══════ atmosphere glow config ══════ */
  const GLOW_CONFIG = {
    Earth:   {col:0x4488ff, opacity:0.12, scale:1.15},
    Venus:   {col:0xffaa44, opacity:0.12, scale:1.15},
    Mars:    {col:0xff6633, opacity:0.06, scale:1.08},
    Jupiter: {col:0xffcc88, opacity:0.08, scale:1.06},
    Saturn:  {col:0xffe8aa, opacity:0.07, scale:1.06},
    Uranus:  {col:0x66ddee, opacity:0.10, scale:1.10},
    Neptune: {col:0x4466ff, opacity:0.10, scale:1.10}
  };

  /* ══════ shared LOD geometries ══════ */
  const geoHi  = new THREE.SphereGeometry(1, PLANET_GEOMETRY_HI, PLANET_GEOMETRY_HI);
  const geoMed = new THREE.SphereGeometry(1, PLANET_GEOMETRY_MED, PLANET_GEOMETRY_MED);
  const geoLo  = new THREE.SphereGeometry(1, PLANET_GEOMETRY_LO, PLANET_GEOMETRY_LO);

  /* ══════ create planets ══════ */
  const planets = PDATA.map(d => {
    const tex = makeTex(d.name, d.col);
    const matProps = MATERIAL_PROPS[d.name] || {roughness:0.7, metalness:0.02};
    const mesh = new THREE.Mesh(
      geoMed,
      new THREE.MeshStandardMaterial({map: tex, roughness: matProps.roughness, metalness: matProps.metalness})
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    if (GLOW_CONFIG[d.name]) {
      const gc = GLOW_CONFIG[d.name];
      const glowMesh = new THREE.Mesh(
        new THREE.SphereGeometry(gc.scale, 24, 24),
        new THREE.MeshBasicMaterial({color: gc.col, transparent: true, opacity: gc.opacity, side: THREE.BackSide, depthWrite: false})
      );
      mesh.add(glowMesh);
    }

    const axPts = [new THREE.Vector3(0, -1.4, 0), new THREE.Vector3(0, 1.4, 0)];
    const axGeo = new THREE.BufferGeometry().setFromPoints(axPts);
    const axLine = new THREE.Line(axGeo, new THREE.LineBasicMaterial({color: 0xffffff, opacity: 0.6, transparent: true}));
    mesh.add(axLine);
    axLine.visible = false;

    if (d.name === 'Saturn') {
      const innerR = 1.3, outerR = 2.5;
      const rg = new THREE.RingGeometry(innerR, outerR, SATURN_RING_SEGMENTS, SATURN_RING_DETAIL);
      // Remap UVs radially (default RingGeometry maps as flat plane)
      const uvs = rg.attributes.uv;
      const positions = rg.attributes.position;
      for (let i = 0; i < uvs.count; i++) {
        const x = positions.getX(i), y = positions.getY(i);
        const t = (Math.sqrt(x * x + y * y) - innerR) / (outerR - innerR);
        uvs.setXY(i, t, 0.5);
      }
      rg.rotateX(-Math.PI / 2);
      const rc = document.createElement('canvas'); rc.width = 1024; rc.height = 1;
      const rx = rc.getContext('2d');
      const grad = rx.createLinearGradient(0, 0, 1024, 0);
      // C ring — faint inner
      grad.addColorStop(0.00, 'rgba(180,170,150,0.25)');
      grad.addColorStop(0.12, 'rgba(195,185,165,0.35)');
      // B ring — brightest
      grad.addColorStop(0.15, 'rgba(225,215,185,0.75)');
      grad.addColorStop(0.42, 'rgba(235,220,190,0.80)');
      // Cassini Division
      grad.addColorStop(0.44, 'rgba(40,35,30,0.05)');
      grad.addColorStop(0.48, 'rgba(40,35,30,0.05)');
      // A ring
      grad.addColorStop(0.50, 'rgba(215,205,178,0.65)');
      grad.addColorStop(0.72, 'rgba(210,200,172,0.60)');
      // Encke Gap
      grad.addColorStop(0.74, 'rgba(60,50,40,0.08)');
      grad.addColorStop(0.76, 'rgba(60,50,40,0.08)');
      // Outer A ring
      grad.addColorStop(0.78, 'rgba(200,190,165,0.50)');
      // F ring — thin outer
      grad.addColorStop(0.92, 'rgba(190,180,160,0.20)');
      grad.addColorStop(1.00, 'rgba(170,160,140,0.0)');
      rx.fillStyle = grad;
      rx.fillRect(0, 0, 1024, 1);
      const ringTex = new THREE.CanvasTexture(rc);
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex, side: THREE.DoubleSide, transparent: true, depthWrite: false,
        roughness: 1.0, metalness: 0.0,
        emissive: 0x3a3228, emissiveIntensity: 0.15
      });
      const ringMesh = new THREE.Mesh(rg, ringMat);
      ringMesh.receiveShadow = true;
      mesh.add(ringMesh);
    }

    const omega = (d.w - d.Om) * DEG, inc = d.i * DEG, Om2 = d.Om * DEG;
    const cO = Math.cos(Om2), sO = Math.sin(Om2), cI = Math.cos(inc), sI = Math.sin(inc);
    const pts = [];
    for (let j = 0; j <= ORBIT_SAMPLES; j++) {
      const M = (j / ORBIT_SAMPLES) * TWO_PI, nu = trueAnomaly(M, d.e);
      const r_au = d.a * (1 - d.e * d.e) / (1 + d.e * Math.cos(nu));
      const r = auToWorld(r_au), a2 = nu + omega;
      const xp = r * Math.cos(a2), yp = r * Math.sin(a2);
      pts.push(new THREE.Vector3(cO * xp - sO * cI * yp, sI * yp, -(sO * xp + cO * cI * yp)));
    }
    const oGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const oLine = new THREE.Line(oGeo, new THREE.LineBasicMaterial({color: 0xffffff, opacity: 0.18, transparent: true}));
    scene.add(oLine);

    const tBuf = new Float32Array(MAX_TRAIL * 3);
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.BufferAttribute(tBuf, 3));
    tGeo.setDrawRange(0, 0);
    const tLine = new THREE.Line(tGeo, new THREE.LineBasicMaterial({color: d.col, opacity: 0.5, transparent: true}));
    tLine.frustumCulled = false;
    scene.add(tLine);
    tLine.visible = false;

    const moons = (d.moons || []).map((md, mi) => {
      const mMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 12, 12),
        new THREE.MeshStandardMaterial({color: md.col, roughness: 0.8})
      );
      mMesh.castShadow = true;
      mMesh.receiveShadow = true;
      scene.add(mMesh);
      mMesh.visible = false;
      const mtBuf = new Float32Array(MAX_TRAIL * 3);
      const mtGeo = new THREE.BufferGeometry();
      mtGeo.setAttribute('position', new THREE.BufferAttribute(mtBuf, 3));
      mtGeo.setDrawRange(0, 0);
      const mtLine = new THREE.Line(mtGeo, new THREE.LineBasicMaterial({color: md.col, opacity: 0.3, transparent: true}));
      mtLine.frustumCulled = false;
      scene.add(mtLine);
      mtLine.visible = false;
      return {data: md, mesh: mMesh, idx: mi, trail: new CircularBuffer(MAX_TRAIL), trailBuf: mtBuf, trailGeo: mtGeo, trailLine: mtLine};
    });

    return {data: d, mesh, axLine, orbitLine: oLine, trail: new CircularBuffer(MAX_TRAIL), trailBuf: tBuf, trailGeo: tGeo, trailLine: tLine, moons};
  });

  /* ══════ asteroid belt ══════ */
  const N_AST = 600;
  const astData = Array.from({length: N_AST}, () => {
    const au = 2.1 + Math.random() * 1.2, a0 = Math.random() * TWO_PI;
    const T = 365.256 * Math.pow(au, 1.5), incR = (Math.random() - 0.5) * 15 * DEG;
    return {au, a0, T, incR};
  });
  const astBuf = new Float32Array(N_AST * 3);
  const astGeo = new THREE.BufferGeometry();
  astGeo.setAttribute('position', new THREE.BufferAttribute(astBuf, 3));
  const astPts = new THREE.Points(astGeo, new THREE.PointsMaterial({color: 0xaaaaaa, size: 0.12, sizeAttenuation: true, opacity: 0.35, transparent: true}));
  scene.add(astPts);

  /* ══════ export to namespace ══════ */
  SS.canvas = canvas;
  SS.renderer = renderer;
  SS.scene = scene;
  SS.camera = camera;
  SS.ctrl = ctrl;
  SS.resize = resize;
  SS.eclipticGrid = eclipticGrid;
  SS.starfield = starfield;
  SS.planets = planets;
  SS.geoHi = geoHi;
  SS.geoMed = geoMed;
  SS.geoLo = geoLo;
  SS.N_AST = N_AST;
  SS.astData = astData;
  SS.astBuf = astBuf;
  SS.astGeo = astGeo;
  SS.astPts = astPts;
  SS.sunMesh = sunMesh;
  SS.sunGlow = sunGlow;
})(window.SS);
