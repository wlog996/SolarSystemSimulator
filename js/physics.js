/* Solar System — Physics Module
   Orbital mechanics, CircularBuffer, and helper functions. */
(function(SS) {
  const DEG = SS.DEG, TWO_PI = SS.TWO_PI;
  const WORLD_SCALE = SS.WORLD_SCALE, MIN_OFFSET = SS.MIN_OFFSET, LOG_41 = SS.LOG_41;
  const daysSinceJ2000 = SS.daysSinceJ2000;

  /* ══════ circular buffer for O(1) trail management ══════ */
  SS.MAX_TRAIL = 20000;

  SS.CircularBuffer = class CircularBuffer {
    constructor(capacity) {
      this._cap = capacity;
      this._buf = new Array(capacity);
      this._head = 0;
      this._size = 0;
    }
    get length() { return this._size; }
    push(item) {
      const idx = (this._head + this._size) % this._cap;
      this._buf[idx] = item;
      if (this._size < this._cap) this._size++;
      else this._head = (this._head + 1) % this._cap;
    }
    peekOldest() {
      return this._size > 0 ? this._buf[this._head] : undefined;
    }
    dequeue() {
      if (this._size === 0) return undefined;
      const item = this._buf[this._head];
      this._buf[this._head] = undefined;
      this._head = (this._head + 1) % this._cap;
      this._size--;
      return item;
    }
    get(i) {
      return this._buf[(this._head + i) % this._cap];
    }
    peekNewest() {
      return this._size > 0 ? this._buf[(this._head + this._size - 1) % this._cap] : undefined;
    }
    clear() { this._head = 0; this._size = 0; }
    copyToFloat32(buf) {
      for (let i = 0; i < this._size; i++) {
        const p = this._buf[(this._head + i) % this._cap].pos;
        buf[i * 3]     = p.x;
        buf[i * 3 + 1] = p.y;
        buf[i * 3 + 2] = p.z;
      }
    }
  };

  /* ══════ helpers ══════ */
  SS.auToWorld = function(au) { return MIN_OFFSET + Math.log(1 + au) / LOG_41 * WORLD_SCALE; };

  SS.SUN_R = 109.2; // Sun radius in Earth radii

  SS.pSize = function(Rearth) {
    // Sqrt scaling: preserves size ratios far better than the old linear clamp
    return Math.max(0.03, 0.4 * Math.sqrt(Rearth)) * SS.state.planetScale;
  };

  SS.sunSize = function() {
    // Softer scaling so the Sun stays dominant but doesn't engulf inner orbits
    return Math.min(SS.pSize(SS.SUN_R) * 0.55, 2.5);
  };

  SS.clamp = function(v, a, b) { return Math.max(a, Math.min(b, v)); };

  SS.trueAnomaly = function(M, e) {
    let E = M;
    for (let i = 0; i < 15; i++) {
      const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-12) break;
    }
    return 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  };

  /* 3D heliocentric position from orbital elements */
  SS.pos3D = function(days, d) {
    const M0 = (d.L0 - d.w) * DEG;
    let M = ((M0 + (TWO_PI / d.T) * (daysSinceJ2000 + days)) % TWO_PI + TWO_PI) % TWO_PI;
    const nu = SS.trueAnomaly(M, d.e);
    const r_au = d.a * (1 - d.e * d.e) / (1 + d.e * Math.cos(nu));
    const r = SS.auToWorld(r_au);
    const omega = (d.w - d.Om) * DEG, inc = d.i * DEG, Om = d.Om * DEG;
    const ang = nu + omega;
    const xp = r * Math.cos(ang), yp = r * Math.sin(ang);
    const cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(inc), sI = Math.sin(inc);
    return {
      v: new THREE.Vector3(cO * xp - sO * cI * yp, sI * yp, -(sO * xp + cO * cI * yp)),
      r_au, nu
    };
  };
})(window.SS);
