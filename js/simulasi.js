(function () {
  const T = window.THREE;
  if (!T) return;

  const darken = (c, t) => new T.Color(c).multiplyScalar(1 - (t == null ? 0.25 : t));
  const toLinear = c => new T.Color(c).convertSRGBToLinear();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = n => String(Math.round(n * 100) / 100).replace('.', ',');
  const V = (x, y, z) => new T.Vector3(x, y, z);

  const makeMat = (c, o) =>
    new T.MeshStandardMaterial(
      Object.assign({ color: toLinear(c), roughness: 0.8, metalness: 0, envMapIntensity: 0.5 }, o)
    );

  const group = (parent, x, y, z) => {
    const q = new T.Group();
    q.position.set(x || 0, y || 0, z || 0);
    parent.add(q);
    return q;
  };

  const seededRandom = () => {
    let seed = 11;
    return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  };

  const DIM_COLOR = '#1273EA';
  const AREA_COLOR = '#0E9F6E';
  const WOOD = '#9C8670';

  function roundedGeo(w, h, d, r) {
    const a = w - 2 * r;
    const b = h - 2 * r;
    const shape = new T.Shape();
    shape.moveTo(-a / 2, -b / 2);
    shape.lineTo(a / 2, -b / 2);
    shape.lineTo(a / 2, b / 2);
    shape.lineTo(-a / 2, b / 2);
    shape.closePath();
    const g = new T.ExtrudeGeometry(shape, {
      depth: d - 2 * r,
      bevelEnabled: true,
      bevelThickness: r,
      bevelSize: r,
      bevelSegments: 3,
      curveSegments: 1
    });
    g.translate(0, 0, -(d - 2 * r) / 2);
    return g;
  }

  function box(g, w, h, d, c, x, y, z, o) {
    const min = Math.min(w, h, d);
    const radius =
      o && o.r != null ? o.r : (o && o.map) || min < 0.12 ? 0 : Math.min(0.035, min * 0.2);
    const matOpts = Object.assign({}, o);
    delete matOpts.r;
    const m = new T.Mesh(
      radius ? roundedGeo(w, h, d, radius) : new T.BoxGeometry(w, h, d),
      makeMat(c, matOpts)
    );
    m.position.set(x, y + h / 2, z);
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    return m;
  }

  function cyl(g, rt, rb, h, c, x, y, z, o) {
    const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, 20), makeMat(c, o));
    m.position.set(x, y + h / 2, z);
    m.castShadow = true;
    g.add(m);
    return m;
  }

  function ball(g, r, c, x, y, z) {
    const m = new T.Mesh(new T.SphereGeometry(r, 16, 12), makeMat(c));
    m.position.set(x, y, z);
    m.castShadow = true;
    g.add(m);
  }

  function addSun(g, intensity, x, y, z, size) {
    const d = new T.DirectionalLight(0xffffff, intensity);
    d.position.set(x, y, z);
    d.castShadow = true;
    const map = size > 22 ? 2048 : 1024;
    d.shadow.mapSize.set(map, map);
    d.shadow.bias = -0.0006;
    d.shadow.normalBias = 0.03;
    const cam = d.shadow.camera;
    const q = size || 22;
    cam.left = cam.bottom = -q;
    cam.right = cam.top = q;
    cam.far = size ? 140 : 80;
    g.add(d);
  }

  function makeTexture(kind, base, rx, ry) {
    const rnd = seededRandom();
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d');
    const col = new T.Color(base);
    const shade = t => '#' + col.clone().multiplyScalar(1 - t).getHexString();
    const light = t => '#' + col.clone().lerp(new T.Color('#fff'), t).getHexString();

    x.fillStyle = base;
    x.fillRect(0, 0, 256, 256);

    if (kind == 'plank') {
      for (let y = 0, q = 0; y < 256; y += 32, q++) {
        const off = (q * 97) % 256;
        const pw = 128 + (q % 3) * 32;
        for (let xx = -off; xx < 256; xx += pw) {
          x.fillStyle = rnd() < 0.5 ? shade(0.07 * rnd()) : light(0.06 * rnd());
          x.fillRect(xx, y, pw, 32);
          x.fillStyle = shade(0.3);
          x.fillRect(xx, y, 2, 32);
        }
        x.fillStyle = shade(0.35);
        x.fillRect(0, y, 256, 2);
      }
      for (let i = 0; i < 260; i++) {
        x.fillStyle = 'rgba(60,35,15,' + (0.05 + rnd() * 0.08) + ')';
        x.fillRect(rnd() * 256, rnd() * 256, 20 + rnd() * 80, 1);
      }
    } else if (kind == 'grain') {
      for (let i = 0; i < 340; i++) {
        x.fillStyle =
          rnd() < 0.5 ? 'rgba(40,22,8,' + (0.05 + rnd() * 0.1) + ')' : 'rgba(255,235,200,.05)';
        x.fillRect(rnd() * 256, rnd() * 256, 40 + rnd() * 160, 1 + (rnd() < 0.1 ? 1 : 0));
      }
    } else if (kind == 'tile' || kind == 'subway') {
      const tw = kind == 'tile' ? 128 : 64;
      const th = kind == 'tile' ? 128 : 32;
      for (let y = 0, q = 0; y < 256; y += th, q++) {
        for (let xx = kind == 'subway' && q % 2 ? -tw / 2 : 0; xx < 256; xx += tw) {
          x.fillStyle = rnd() < 0.5 ? light(0.04 * rnd()) : shade(0.04 * rnd());
          x.fillRect(xx, y, tw, th);
          x.strokeStyle = shade(0.22);
          x.lineWidth = 3;
          x.strokeRect(xx, y, tw, th);
        }
      }
    } else if (kind == 'marble') {
      x.fillStyle = light(0.25);
      x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 9; i++) {
        x.strokeStyle = 'rgba(90,100,112,' + (0.12 + rnd() * 0.22) + ')';
        x.lineWidth = 0.6 + rnd() * 1.6;
        x.beginPath();
        let px = rnd() * 256;
        let py = 0;
        x.moveTo(px, py);
        for (let j = 0; j < 8; j++) {
          px += (rnd() - 0.5) * 70;
          py += 34;
          x.lineTo(px, py);
        }
        x.stroke();
      }
    } else if (kind == 'granite') {
      for (let i = 0; i < 1800; i++) {
        x.fillStyle =
          rnd() < 0.5 ? 'rgba(255,255,255,' + rnd() * 0.25 + ')' : 'rgba(0,0,0,' + rnd() * 0.3 + ')';
        x.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 2, 1 + rnd() * 2);
      }
    } else if (kind == 'concrete') {
      for (let i = 0; i < 1400; i++) {
        x.fillStyle = 'rgba(' + (rnd() < 0.5 ? '0,0,0,' : '255,255,255,') + rnd() * 0.07 + ')';
        x.fillRect(rnd() * 256, rnd() * 256, 2 + rnd() * 5, 2 + rnd() * 5);
      }
      x.strokeStyle = shade(0.25);
      x.lineWidth = 2;
      x.strokeRect(0, 0, 256, 256);
    } else if (kind == 'grass') {
      for (let i = 0; i < 2600; i++) {
        x.fillStyle = rnd() < 0.5 ? shade(0.12 * rnd()) : light(0.1 * rnd());
        x.fillRect(rnd() * 256, rnd() * 256, 1, 2 + rnd() * 3);
      }
    } else {
      for (let i = 0; i < 900; i++) {
        x.fillStyle = 'rgba(' + (rnd() < 0.5 ? '0,0,0,' : '255,255,255,') + rnd() * 0.035 + ')';
        x.fillRect(rnd() * 256, rnd() * 256, 3 + rnd() * 6, 3 + rnd() * 6);
      }
    }

    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = 8;
    return t;
  }

  function panelTexture(kind, base, rx, ry) {
    const rnd = seededRandom();
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d');
    const col = new T.Color(base);
    const shade = t => '#' + col.clone().multiplyScalar(1 - t).getHexString();

    x.fillStyle = base;
    x.fillRect(0, 0, 128, 128);

    if (kind == 'Kayu') {
      for (let y = 0; y < 128; y += 16) {
        x.fillStyle = shade(0.16);
        x.fillRect(0, y, 128, 2);
      }
      for (let i = 0; i < 80; i++) {
        x.fillStyle = 'rgba(70,40,15,.14)';
        x.fillRect(rnd() * 128, rnd() * 128, 24 + rnd() * 70, 1);
      }
    } else if (kind == 'Batu Alam') {
      for (let y = 0, q = 0; y < 128; y += 16, q++) {
        for (let xx = (q % 2) * 16; xx < 128; xx += 32) {
          x.fillStyle = rnd() < 0.5 ? shade(0.12) : base;
          x.fillRect(xx + 1, y + 1, 30, 14);
        }
      }
    } else if (kind == 'Beton Ekspos') {
      for (let i = 0; i < 600; i++) {
        x.fillStyle = 'rgba(0,0,0,' + rnd() * 0.09 + ')';
        x.fillRect(rnd() * 128, rnd() * 128, 2, 2);
      }
      x.fillStyle = 'rgba(0,0,0,.2)';
      x.fillRect(0, 0, 128, 1);
      x.fillRect(0, 0, 1, 128);
    } else {
      for (let xx = 0; xx < 128; xx += 8) {
        x.fillStyle = shade(0.35);
        x.fillRect(xx, 0, 3, 128);
      }
    }

    const t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(rx, ry);
    return t;
  }

  let AO_TEXTURE;
  function addAO(g, w, d, x, z, alpha) {
    if (!AO_TEXTURE) {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const q = c.getContext('2d');
      const gr = q.createRadialGradient(32, 32, 6, 32, 32, 32);
      gr.addColorStop(0, 'rgba(0,0,0,.6)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      q.fillStyle = gr;
      q.fillRect(0, 0, 64, 64);
      AO_TEXTURE = new T.CanvasTexture(c);
    }
    const m = new T.Mesh(
      new T.PlaneGeometry(w * 1.3, d * 1.3),
      new T.MeshBasicMaterial({ map: AO_TEXTURE, transparent: true, opacity: alpha || 0.6, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.008, z);
    g.add(m);
  }

  function makeEnvMap(renderer) {
    const pm = new T.PMREMGenerator(renderer);
    const scene = new T.Scene();
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 128;
    const x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, '#9CC4EE');
    gr.addColorStop(0.5, '#F4F7FA');
    gr.addColorStop(1, '#B9B2A6');
    x.fillStyle = gr;
    x.fillRect(0, 0, 4, 128);

    const tx = new T.CanvasTexture(c);
    tx.encoding = T.sRGBEncoding;
    scene.add(new T.Mesh(new T.SphereGeometry(50, 24, 16), new T.MeshBasicMaterial({ map: tx, side: T.BackSide })));

    [
      [0, 30, 0, 5],
      [-30, 12, 10, 3.5],
      [25, 10, -20, 2.5]
    ].forEach(a => {
      const p = new T.Mesh(
        new T.PlaneGeometry(22, 12),
        new T.MeshBasicMaterial({ color: new T.Color(a[3], a[3], a[3]), side: T.DoubleSide })
      );
      p.position.set(a[0], a[1], a[2]);
      p.lookAt(0, 0, 0);
      scene.add(p);
    });

    const tex = pm.fromScene(scene, 0.02).texture;
    pm.dispose();
    return tex;
  }

  function makeLabel(text, k, col) {
    const c = document.createElement('canvas');
    c.width = 384;
    c.height = 96;
    const x = c.getContext('2d');
    const r = 40;
    x.fillStyle = col || 'rgba(18,115,234,.95)';
    x.beginPath();
    x.moveTo(r, 6);
    x.lineTo(384 - r, 6);
    x.arc(384 - r, 48, 42, -Math.PI / 2, Math.PI / 2);
    x.lineTo(r, 90);
    x.arc(r, 48, 42, Math.PI / 2, (3 * Math.PI) / 2);
    x.closePath();
    x.fill();
    x.fillStyle = '#fff';
    x.font = 'bold 44px "Segoe UI",system-ui,sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(text, 192, 50);

    const tx = new T.CanvasTexture(c);
    tx.encoding = T.sRGBEncoding;
    const sp = new T.Sprite(new T.SpriteMaterial({ map: tx, transparent: true, depthTest: false, toneMapped: false }));
    sp.scale.set(5 * (k || 1), 1.25 * (k || 1), 1);
    sp.renderOrder = 10;
    return sp;
  }

  let SKY;
  function getSky() {
    if (SKY) return SKY;
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 256;
    const x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, '#7FB6EE');
    gr.addColorStop(0.6, '#CFE3F5');
    gr.addColorStop(1, '#EEF5FB');
    x.fillStyle = gr;
    x.fillRect(0, 0, 4, 256);
    SKY = new T.CanvasTexture(c);
    SKY.encoding = T.sRGBEncoding;
    return SKY;
  }

  function segment(g, a, b, rad, col) {
    const v = b.clone().sub(a);
    const len = v.length();
    const m = new T.Mesh(
      new T.CylinderGeometry(rad, rad, len, 8),
      new T.MeshBasicMaterial({ color: toLinear(col), toneMapped: false })
    );
    m.position.copy(a).addScaledVector(v, 0.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), v.normalize());
    g.add(m);
  }

  function dimLine(g, a, b, off, text, k, col, frac, labelColor) {
    const n = off.clone().normalize();
    const A = a.clone().add(off);
    const B = b.clone().add(off);
    const u = B.clone().sub(A).normalize();
    const s = 0.12 * k;

    segment(g, a.clone().addScaledVector(n, 0.08 * k), A.clone().addScaledVector(n, 0.22 * k), s * 0.25, col);
    segment(g, b.clone().addScaledVector(n, 0.08 * k), B.clone().addScaledVector(n, 0.22 * k), s * 0.25, col);
    segment(g, A, B, s * 0.4, col);

    [
      [A, u.clone().negate()],
      [B, u]
    ].forEach(q => {
      const cone = new T.Mesh(
        new T.ConeGeometry(s * 0.9, s * 2.6, 12),
        new T.MeshBasicMaterial({ color: toLinear(col), toneMapped: false })
      );
      cone.position.copy(q[0]).addScaledVector(q[1], -s * 1.3);
      cone.quaternion.setFromUnitVectors(V(0, 1, 0), q[1]);
      g.add(cone);
    });

    const label = makeLabel(text, k, labelColor);
    const mid = A.clone().add(B).multiplyScalar(0.5);
    label.position.copy(A).lerp(B, frac || 0.5).addScaledVector(n, 0.9 * k);
    label.position.y += 0.3 * k;
    g.add(label);
    label.userData.B = B.clone();
    label.userData.M = mid.clone();
    return label;
  }

  function addHandle(g, p, dir, k, id, col) {
    const h = group(g, p.x, p.y + 0.04, p.z);
    h.userData.hid = id;

    const mat = c => new T.MeshBasicMaterial({ color: toLinear(c), toneMapped: false, depthTest: false });
    const add = (m, order) => {
      m.renderOrder = order;
      h.add(m);
      return m;
    };

    add(new T.Mesh(new T.CylinderGeometry(0.5 * k, 0.5 * k, 0.03, 32), mat('#ffffff')), 11);
    const ring = add(new T.Mesh(new T.TorusGeometry(0.5 * k, 0.04 * k, 8, 32), mat(col || DIM_COLOR)), 12);
    ring.rotation.x = Math.PI / 2;

    [1, -1].forEach(sign => {
      const d = dir.clone().multiplyScalar(sign);
      const c = add(new T.Mesh(new T.ConeGeometry(0.2 * k, 0.46 * k, 3), mat(col || DIM_COLOR)), 12);
      c.position.copy(d).multiplyScalar(0.31 * k);
      c.position.y = 0.03;
      c.quaternion.setFromUnitVectors(V(0, 1, 0), d);
    });

    h.add(new T.Mesh(new T.SphereGeometry(0.95 * k, 8, 6), new T.MeshBasicMaterial({ visible: false })));
  }

  function addHuman(g, x, z) {
    const h = group(g, x, 0, z);
    const mat = c => makeMat(c, { roughness: 0.7 });
    const part = (geo, c, px, py) => {
      const o = new T.Mesh(geo, mat(c));
      o.position.set(px, py, 0);
      o.castShadow = true;
      h.add(o);
    };
    [-1, 1].forEach(k => {
      part(new T.CylinderGeometry(0.055, 0.045, 0.85, 10), '#5B6B8C', k * 0.09, 0.43);
      part(new T.CylinderGeometry(0.04, 0.035, 0.6, 8), '#7C8FB8', k * 0.22, 1.15);
    });
    part(new T.CylinderGeometry(0.17, 0.14, 0.62, 12), '#7C8FB8', 0, 1.18);
    part(new T.SphereGeometry(0.11, 16, 12), '#E8EAEE', 0, 1.62);
    addAO(g, 0.5, 0.5, x, z, 0.5);
  }

  function addDims(g, o) {
    const q = group(g);
    const k = o.k;
    const gp = o.gp;
    const x0 = o.cx - o.W / 2;
    const x1 = o.cx + o.W / 2;
    const z0 = o.cz - o.D / 2;
    const z1 = o.cz + o.D / 2;
    const y = o.y;
    const hs = k * (o.hs || 1);
    const frac = o.drag ? 0.2 : 0.5;

    const l1 = dimLine(q, V(x0, y, z1), V(x1, y, z1), V(0, 0, gp),
      (o.lw || 'Lebar') + ' ' + fmt(o.vw != null ? o.vw : o.W) + ' m', k, DIM_COLOR, frac);
    const l2 = dimLine(q, V(x1, y, z0), V(x1, y, z1), V(gp, 0, 0),
      (o.ld || 'Panjang') + ' ' + fmt(o.vd != null ? o.vd : o.D) + ' m', k, DIM_COLOR, frac);
    dimLine(q, V(x0, y, z1), V(x0, y + o.H, z1), V(-gp * 0.8, 0, gp * 0.8),
      'Tinggi ' + fmt(o.H) + ' m', k, DIM_COLOR);
    const l3 = dimLine(q, V(x0, y, z0), V(x0, y, z1), V(-gp * 1.1, 0, 0),
      'Luas ' + fmt(o.va != null ? o.va : o.W * o.D) + ' m\u00b2', k, AREA_COLOR, frac, 'rgba(14,159,110,.95)');

    if (o.drag && o.drag.w) addHandle(q, l1.userData.M, V(1, 0, 0), hs, 'w');
    if (o.drag && o.drag.d) addHandle(q, l2.userData.M, V(0, 0, 1), hs, 'd');
    if (o.drag && o.drag.a) addHandle(q, l3.userData.M, V(0, 0, 1), hs, 'a', AREA_COLOR);
    return q;
  }

  let UID = 0;
  const uid = () => 'o' + ++UID;

  const addLegs = (g, w, d, h, c) =>
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(a =>
      box(g, 0.05, h, 0.05, darken(c, 0.3), a[0] * (w / 2 - 0.06), 0, a[1] * (d / 2 - 0.06), { r: 0 })
    );

  const addTable = (g, w, d, c, h) => {
    box(g, w, 0.05, d, c, 0, h - 0.05, 0);
    addLegs(g, w, d, h - 0.05, c);
  };

  const CAT = {
    wall: {
      n: 'Dinding', w: 2, d: 0.12, c: '#EEEAE2', min: 0.3, max: 20, nd: 1,
      f: (g, w, d, c) => box(g, w, 1.5, d, c, 0, 0, 0, { r: 0 })
    },
    sofa: {
      n: 'Sofa', w: 2.1, d: 0.9, c: '#8C9AA8',
      f: (g, w, d, c) => {
        box(g, w, 0.42, d, c, 0, 0, 0);
        box(g, w, 0.5, 0.22, darken(c, 0.12), 0, 0.4, -d / 2 + 0.11);
        [-1, 1].forEach(k => {
          box(g, 0.2, 0.3, d, darken(c, 0.15), k * (w / 2 - 0.1), 0.4, 0);
          box(g, w / 2 - 0.2, 0.12, d - 0.35, darken(c, -0.06), (k * w) / 4, 0.42, 0.12);
        });
      }
    },
    bed: {
      n: 'Tempat Tidur', w: 1.6, d: 2, c: '#D8CFC0',
      f: (g, w, d, c) => {
        box(g, w, 0.3, d, c, 0, 0, 0);
        box(g, w - 0.1, 0.16, d - 0.1, '#fff', 0, 0.3, 0.05);
        box(g, w, 0.8, 0.08, WOOD, 0, 0, -d / 2 + 0.04);
        [-1, 1].forEach(k => box(g, w / 2 - 0.15, 0.1, 0.4, '#F4F2EE', k * w * 0.26, 0.46, -d / 2 + 0.4));
        box(g, w - 0.04, 0.06, d * 0.55, darken(c, 0.08), 0, 0.46, d * 0.18);
      }
    },
    nakas: {
      n: 'Nakas', w: 0.45, d: 0.4, c: '#9C8670',
      f: (g, w, d, c) => {
        box(g, w, 0.5, d, c, 0, 0, 0);
        box(g, w - 0.1, 0.015, 0.01, darken(c, 0.4), 0, 0.28, d / 2 + 0.005, { r: 0 });
      }
    },
    wardrobe: {
      n: 'Lemari', w: 1.6, d: 0.55, c: '#B7A58F',
      f: (g, w, d, c) => {
        box(g, w, 2, d, c, 0, 0, 0);
        box(g, 0.015, 1.9, 0.01, darken(c, 0.45), 0, 0.05, d / 2 + 0.005, { r: 0 });
        [-1, 1].forEach(k => box(g, 0.02, 0.3, 0.02, '#B8BCC2', k * 0.07, 0.9, d / 2 + 0.015, { r: 0 }));
      }
    },
    table: { n: 'Meja Makan', w: 1.3, d: 0.85, c: '#C9A877', f: (g, w, d, c) => addTable(g, w, d, c, 0.74) },
    coffee: { n: 'Meja Kopi', w: 1, d: 0.5, c: '#C9A877', f: (g, w, d, c) => addTable(g, w, d, c, 0.4) },
    chair: {
      n: 'Kursi', w: 0.45, d: 0.45, c: '#2F3540',
      f: (g, w, d, c) => {
        box(g, w, 0.06, d, c, 0, 0.42, 0);
        box(g, w, 0.45, 0.05, c, 0, 0.48, -d / 2 + 0.03);
        addLegs(g, w * 0.9, d * 0.9, 0.42, c);
      }
    },
    desk: {
      n: 'Meja Kerja', w: 1.3, d: 0.6, c: '#D8B67D',
      f: (g, w, d, c) => {
        addTable(g, w, d, c, 0.74);
        box(g, 0.5, 0.3, 0.03, '#2B2F36', 0, 0.74, -d / 2 + 0.12, { r: 0 });
        box(g, 0.35, 0.01, 0.12, '#444', 0, 0.74, 0.08, { r: 0 });
      }
    },
    tv: {
      n: 'TV + Rak', w: 1.6, d: 0.4, c: '#2B2F36',
      f: (g, w, d, c) => {
        box(g, w, 0.45, d, c, 0, 0, 0);
        box(g, w * 0.7, 0.5, 0.04, '#14161A', 0, 0.45, 0, { r: 0 });
      }
    },
    kitchen: {
      n: 'Kitchen Set', w: 2.4, d: 0.6, c: '#F4F5F7',
      f: (g, w, d, c) => {
        box(g, w, 0.8, d, c, 0, 0, 0, { roughness: 0.4 });
        box(g, w + 0.02, 0.04, d + 0.03, '#23262B', 0, 0.8, 0, { r: 0 });
        box(g, Math.min(0.55, w * 0.3), 0.01, d * 0.55, '#B8BCC2', -w * 0.25, 0.84, 0, { r: 0, metalness: 0.8, roughness: 0.3 });
        cyl(g, 0.012, 0.012, 0.25, '#CDD2D7', -w * 0.25, 0.84, -d * 0.3);
        box(g, Math.min(0.6, w * 0.3), 0.01, d * 0.7, '#14161A', w * 0.22, 0.84, 0, { r: 0 });
        [-1, 1].forEach(a =>
          [-1, 1].forEach(b =>
            cyl(g, 0.07, 0.07, 0.012, '#3A3F46', w * 0.22 + a * Math.min(0.14, w * 0.08), 0.845, b * d * 0.17)
          )
        );
      }
    },
    fridge: {
      n: 'Kulkas', w: 0.7, d: 0.7, c: '#D5D9DE',
      f: (g, w, d, c) => {
        box(g, w, 1.8, d, c, 0, 0, 0, { metalness: 0.5, roughness: 0.35 });
        box(g, w - 0.04, 0.012, 0.01, '#9AA0A6', 0, 1.2, d / 2 + 0.005, { r: 0 });
        box(g, 0.025, 0.5, 0.03, '#9AA0A6', w / 2 - 0.08, 1.3, d / 2 + 0.02, { r: 0 });
      }
    },
    toilet: {
      n: 'Kloset', w: 0.4, d: 0.7, c: '#FFFFFF',
      f: (g, w, d, c) => {
        box(g, w * 0.9, 0.5, d * 0.3, c, 0, 0, -d / 2 + d * 0.15);
        const m = cyl(g, 0.5, 0.5, 0.4, c, 0, 0, d * 0.12);
        m.scale.set(w, 1, d * 0.62);
      }
    },
    sink: {
      n: 'Wastafel', w: 0.6, d: 0.45, c: '#CBD3DA',
      f: (g, w, d, c) => {
        box(g, w, 0.8, d, c, 0, 0, 0);
        box(g, w * 0.7, 0.01, d * 0.65, '#fff', 0, 0.81, 0, { r: 0 });
        cyl(g, 0.012, 0.012, 0.15, '#CDD2D7', 0, 0.81, -d * 0.3);
      }
    },
    shower: {
      n: 'Shower', w: 0.9, d: 0.9, c: '#CBD3DA',
      f: (g, w, d, c) => {
        box(g, w, 0.04, d, c, 0, 0, 0, { r: 0 });
        cyl(g, 0.01, 0.01, 2, '#B8BCC2', -w / 2 + 0.1, 0, -d / 2 + 0.1);
        cyl(g, 0.1, 0.1, 0.02, '#B8BCC2', -w / 2 + 0.18, 2, -d / 2 + 0.1);
      }
    },
    plant: {
      n: 'Tanaman', w: 0.5, d: 0.5, c: '#C98B5E',
      f: (g, w, d, c) => {
        const k = w / 0.5;
        cyl(g, 0.2 * k, 0.15 * k, 0.35, c, 0, 0, 0);
        ball(g, 0.38 * k, '#3E8A4F', 0, 0.85, 0);
        ball(g, 0.26 * k, '#4FA362', 0.1, 1.1, 0.05);
      }
    },
    rug: {
      n: 'Karpet', w: 2, d: 1.4, c: '#D8C9B2',
      f: (g, w, d, c) => box(g, w, 0.012, d, c, 0, 0, 0, { r: 0, roughness: 1 })
    },
    stairs: {
      n: 'Tangga', w: 1, d: 3, c: '#C9A877',
      f: (g, w, d, c) => {
        for (let i = 0; i < 12; i++) {
          box(g, w, (i + 1) * 0.17, d / 12 - 0.005, c, 0, 0, -d / 2 + ((i + 0.5) * d) / 12, { r: 0 });
        }
      }
    },
    door: {
      n: 'Pintu', w: 0.9, d: 0.12, c: '#B7A58F', min: 0.7, max: 1.6, nd: 1,
      f: (g, w, d, c) => {
        box(g, w, 2.05, 0.05, c, 0, 0, 0, { r: 0 });
        [-1, 1].forEach(k => box(g, 0.06, 2.1, d, darken(c, 0.3), k * (w / 2), 0, 0, { r: 0 }));
        box(g, w + 0.06, 0.06, d, darken(c, 0.3), 0, 2.05, 0, { r: 0 });
        box(g, 0.03, 0.12, 0.05, '#B8BCC2', w / 2 - 0.12, 0.95, 0.04, { r: 0 });
      }
    },
    window: {
      n: 'Jendela', w: 1.2, d: 0.12, c: '#F1F1EF', min: 0.6, max: 3, nd: 1,
      f: (g, w, d, c) => {
        box(g, w, 1.1, 0.03, '#CFE4EE', 0, 0.9, 0, { r: 0, transparent: true, opacity: 0.45, roughness: 0.1 });
        [0.9, 2.0].forEach(y => box(g, w, 0.06, d, c, 0, y, 0, { r: 0 }));
        [-1, 1].forEach(k => box(g, 0.06, 1.16, d, c, k * (w / 2), 0.9, 0, { r: 0 }));
        box(g, 0.04, 1.1, 0.05, c, 0, 0.9, 0, { r: 0 });
      }
    },
    armchair: {
      n: 'Kursi Santai', w: 0.85, d: 0.85, c: '#C96F4A',
      f: (g, w, d, c) => {
        box(g, w, 0.38, d, c, 0, 0.1, 0);
        box(g, w, 0.5, 0.2, darken(c, 0.12), 0, 0.45, -d / 2 + 0.1);
        [-1, 1].forEach(k => box(g, 0.16, 0.3, d, darken(c, 0.15), k * (w / 2 - 0.08), 0.4, 0));
        addLegs(g, w * 0.9, d * 0.9, 0.1, '#3A3D42');
      }
    },
    bookcase: {
      n: 'Rak Buku', w: 1, d: 0.35, c: '#9C8670',
      f: (g, w, d, c) => {
        [-1, 1].forEach(k => box(g, 0.03, 1.9, d, c, k * (w / 2 - 0.015), 0, 0, { r: 0 }));
        for (let i = 0; i <= 5; i++) box(g, w, 0.03, d, c, 0, i * 0.37, 0, { r: 0 });
        box(g, w - 0.06, 1.9, 0.01, darken(c, 0.25), 0, 0, -d / 2 + 0.005, { r: 0 });
      }
    },
    dresser: {
      n: 'Meja Rias', w: 1.1, d: 0.45, c: '#E8DFD0',
      f: (g, w, d, c) => {
        addTable(g, w, d, c, 0.75);
        box(g, 0.6, 0.7, 0.03, '#CFE4EE', 0, 1.0, -d / 2 + 0.03, { r: 0, metalness: 0.6, roughness: 0.1 });
        box(g, w * 0.35, 0.2, d - 0.06, darken(c, 0.12), w * 0.28, 0.5, 0, { r: 0 });
      }
    },
    island: {
      n: 'Island Dapur', w: 1.8, d: 0.9, c: '#F4F5F7',
      f: (g, w, d, c) => {
        box(g, w, 0.85, d, c, 0, 0, 0);
        box(g, w + 0.06, 0.04, d + 0.06, '#23262B', 0, 0.85, 0, { roughness: 0.25 });
      }
    },
    stove: {
      n: 'Kompor', w: 0.6, d: 0.6, c: '#2B2F36',
      f: (g, w, d, c) => {
        box(g, w, 0.85, d, '#C7CDD3', 0, 0, 0, { metalness: 0.6, roughness: 0.3 });
        box(g, w, 0.02, d, c, 0, 0.85, 0, { r: 0, roughness: 0.15 });
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(a => cyl(g, 0.07, 0.07, 0.01, '#4A4E54', a[0] * w * 0.22, 0.87, a[1] * d * 0.22));
      }
    },
    round: {
      n: 'Meja Bulat', w: 1, d: 1, c: '#E8DFD0', nd: 1,
      f: (g, w, d, c) => {
        cyl(g, w / 2, w / 2, 0.04, c, 0, 0.71, 0);
        cyl(g, 0.05, 0.05, 0.71, darken(c, 0.3), 0, 0, 0);
        cyl(g, 0.28, 0.28, 0.03, darken(c, 0.3), 0, 0, 0);
      }
    },
    stool: {
      n: 'Bangku', w: 0.4, d: 0.4, c: '#2B2F36', nd: 1,
      f: (g, w, d, c) => {
        cyl(g, w / 2, w / 2, 0.06, c, 0, 0.62, 0);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(a => cyl(g, 0.015, 0.015, 0.62, '#9AA0A6', a[0] * w * 0.28, 0, a[1] * w * 0.28));
      }
    },
    bathtub: {
      n: 'Bak Mandi', w: 1.7, d: 0.75, c: '#FFFFFF',
      f: (g, w, d, c) => {
        box(g, w, 0.55, d, c, 0, 0, 0);
        box(g, w - 0.2, 0.02, d - 0.2, darken(c, 0.12), 0, 0.55, 0, { r: 0 });
        cyl(g, 0.012, 0.012, 0.15, '#CDD2D7', -w / 2 + 0.12, 0.55, 0);
      }
    },
    lamp: {
      n: 'Lampu Lantai', w: 0.4, d: 0.4, c: '#FFE3A8', nd: 1,
      f: (g, w, d, c) => {
        cyl(g, 0.15, 0.15, 0.03, '#2B2F36', 0, 0, 0);
        cyl(g, 0.012, 0.012, 1.45, '#2B2F36', 0, 0.03, 0);
        cyl(g, 0.12, 0.2, 0.3, c, 0, 1.35, 0, { emissive: new T.Color(c), emissiveIntensity: 0.35, side: T.DoubleSide });
      }
    },
    label: { n: 'Label', w: 1.4, d: 0.5, c: '#334155', label: 1 }
  };

  const KINDS = [
    'wall', 'sofa', 'bed', 'nakas', 'wardrobe', 'table', 'coffee', 'chair', 'desk', 'tv',
    'kitchen', 'fridge', 'toilet', 'sink', 'shower', 'plant', 'rug', 'stairs', 'label',
    'door', 'window', 'armchair', 'bookcase', 'dresser', 'island', 'stove', 'round', 'stool', 'bathtub', 'lamp'
  ];

  function makeItem(it) {
    const g = new T.Group();
    g.userData.item = it;

    if (it.t == 'label') {
      const l = makeLabel(it.text || 'Label', 0.55, 'rgba(51,65,85,.92)');
      l.position.y = 0.7;
      g.add(l);
    } else {
      CAT[it.t].f(g, it.w, it.d, it.c);
    }

    const hit = new T.Mesh(
      new T.BoxGeometry(Math.max(it.w, 0.5), 0.9, Math.max(it.d, it.t == 'wall' ? 0.35 : 0.5)),
      new T.MeshBasicMaterial({ visible: false })
    );
    hit.position.y = 0.45;
    g.add(hit);

    g.position.set(it.x, 0.02, it.z);
    g.rotation.y = (it.rot * Math.PI) / 180;
    return g;
  }

  function defaultItems(w, D, floorIndex) {
    const out = [];
    const sx = -w / 2 + w * 0.56;
    const cL = (-w / 2 + sx) / 2;
    const cR = (sx + w / 2) / 2;
    const zr = D * 0.05;
    const zk = zr + 2.2;
    const front = D / 2 - zk > 1.4;

    const A = (t, x, z, o) => {
      const c = CAT[t];
      out.push(Object.assign({ id: uid(), t, x, z, rot: 0, w: c.w, d: c.d, c: c.c }, o));
    };
    const wall = (x0, z0, x1, z1) =>
      A('wall', (x0 + x1) / 2, (z0 + z1) / 2, { rot: x1 != x0 ? 0 : 90, w: Math.hypot(x1 - x0, z1 - z0) });
    const doorWall = (x0, z0, x1, z1, t) => {
      const L = Math.hypot(x1 - x0, z1 - z0);
      const d = 0.45 / L;
      const p = u => [x0 + (x1 - x0) * u, z0 + (z1 - z0) * u];
      wall(x0, z0, ...p(t - d));
      wall(...p(t + d), x1, z1);
    };
    const label = (t, x, z) => A('label', x, z, { text: t });
    const bed = (x, z, bw) => A('bed', x, z, { w: bw });
    const bath = x => {
      A('toilet', x + 0.3, zr + 1.55);
      A('sink', x - 0.5, zr + 1.45);
      label('WC', x, zr + 0.65);
    };

    doorWall(sx, -D / 2, sx, 0, 0.5);
    doorWall(sx, 0, sx, D / 2, 0.5);
    doorWall(sx, zr, w / 2, zr, 0.5);
    if (front || floorIndex) doorWall(sx, zk, w / 2, zk, 0.5);
    if (floorIndex) doorWall(-w / 2, 0, sx, 0, 0.5);

    const wd = Math.min(1.8, w * 0.35);

    if (!floorIndex) {
      A('sofa', cL, D / 2 - 0.9, { w: Math.min(2.2, sx + w / 2 - 1), rot: 180 });
      A('coffee', cL, D / 2 - 2);
      A('rug', cL, D / 2 - 1.7, { w: 2.2, d: 1.5 });
      A('kitchen', cL, -D / 2 + 0.4, { w: Math.min(3, w * 0.5) });
      A('fridge', cL - Math.min(3, w * 0.5) / 2 - 0.45, -D / 2 + 0.45);
      A('table', cL, -D / 4 + 0.5);
      label('Living', cL, D * 0.22);
      label('Kitchen', cL, -D * 0.12);

      bed(cR, -D / 2 + 1.5, 1.6);
      A('nakas', cR - 1.2, -D / 2 + 0.4);
      A('wardrobe', cR, zr - 0.4, { w: wd, rot: 180 });
      label('Bedroom', cR, -D * 0.18);
      bath(cR);

      if (front) {
        A('desk', cR, D / 2 - 0.5, { rot: 180 });
        A('chair', cR, D / 2 - 1.1);
        label('Study', cR, zk + (D / 2 - zk) / 2 - 0.2);
      }
    } else {
      bed(cL, -D / 2 + 1.5, 1.4);
      A('wardrobe', cL, -0.5, { w: 1.5, rot: 180 });
      bed(cL, D / 2 - 1.5, 1.4);
      label('Bedroom 2', cL, -D * 0.22);
      label('Bedroom 3', cL, D * 0.22);

      bed(cR, -D / 2 + 1.5, 1.8);
      A('nakas', cR - 1.3, -D / 2 + 0.4);
      A('wardrobe', cR, zr - 0.4, { w: wd, rot: 180 });
      label('Master', cR, -D * 0.18);
      bath(cR);

      A('sofa', cR, D / 2 - 1, { w: 1.8, rot: 180 });
      label('Family', cR, zk + (D / 2 - zk) / 2 - 0.5);
    }
    return out;
  }

  function ensurePlan(s, i, w, D, gen) {
    const P = s.plan || (s.plan = {});
    const cur = P[i];
    if (!cur) return (P[i] = { dim: [w, D], items: gen ? gen(w, D) : defaultItems(w, D, i) });

    const kx = w / cur.dim[0];
    const kz = D / cur.dim[1];
    if ((kx != 1 || kz != 1) && gen && !s.pe) {
      cur.items = gen(w, D);
      cur.dim = [w, D];
    } else if (kx != 1 || kz != 1) {
      cur.items.forEach(o => {
        o.x *= kx;
        o.z *= kz;
        if (o.t == 'wall') o.w *= o.rot % 180 == 0 ? kx : kz;
      });
      cur.dim = [w, D];
    }
    return cur;
  }

  function buildPlan(parent, w, D, i, s, noFloor, gen) {
    const q = group(parent);
    const P = ensurePlan(s, i, w, D, gen);
    const objs = {};

    if (!noFloor) {
      box(q, w - 0.1, 0.02, D - 0.1, '#fff', 0, 0.005, 0, {
        r: 0, roughness: 0.5, map: makeTexture('plank', '#B58B5E', w / 2, D / 2)
      });
    }

    const add = it => {
      const o = makeItem(it);
      q.add(o);
      objs[it.id] = o;
      return o;
    };
    P.items.forEach(add);

    q.userData = {
      P, w, D, i, add,
      drop(it) {
        const o = objs[it.id];
        if (!o) return;
        q.remove(o);
        o.traverse(m => {
          if (m.geometry) m.geometry.dispose();
          if (m.material && m.material.map) m.material.map.dispose();
        });
        delete objs[it.id];
      },
      sync(it) {
        const o = objs[it.id];
        if (o) {
          o.position.set(it.x, 0.02, it.z);
          o.rotation.y = (it.rot * Math.PI) / 180;
        }
      }
    };
    q.visible = false;
    return q;
  }

  function fadeIn(tl, g, at, dur) {
    const mats = new Set();
    g.traverse(o => { if (o.material) mats.add(o.material); });
    mats.forEach(m => {
      if (m.userData.o0 === undefined) {
        m.userData.o0 = m.opacity;
        m.userData.t0 = m.transparent;
      }
      m.opacity = m.userData.o0;
      m.transparent = m.userData.t0;
    });
    g.visible = false;

    const px = { v: 0 };
    tl.fromTo(px, { v: 0 }, {
      v: 1, duration: dur, ease: 'power1.out',
      onStart() {
        g.visible = true;
        mats.forEach(m => { m.transparent = true; m.opacity = 0; });
      },
      onUpdate() { mats.forEach(m => { m.opacity = m.userData.o0 * px.v; }); },
      onComplete() { mats.forEach(m => { m.opacity = m.userData.o0; m.transparent = m.userData.t0; }); }
    }, at);
  }

  function fitItems(out, w, D) {
    out.forEach(it => {
      const r = (it.rot * Math.PI) / 180;
      const cs = Math.abs(Math.cos(r));
      const sn = Math.abs(Math.sin(r));
      const hw = Math.min((cs * it.w + sn * it.d) / 2, w / 2);
      const hd = Math.min((sn * it.w + cs * it.d) / 2, D / 2);
      it.x = clamp(it.x, -w / 2 + hw, w / 2 - hw);
      it.z = clamp(it.z, -D / 2 + hd, D / 2 - hd);
    });
    return out;
  }

  const makeAdder = (out, ox, oz) => (t, x, z, o) => {
    const k = CAT[t];
    out.push(Object.assign({ id: uid(), t, x: ox + x, z: oz + z, rot: 0, w: k.w, d: k.d, c: k.c }, o));
  };

  function roomItems(s, W, D) {
    const out = [];
    const room = s.room;
    const A = makeAdder(out, 0, 0);

    if (room == 'Living Room') {
      const sx = -W * 0.12;
      A('rug', sx, -D / 2 + 1.9, { w: Math.min(2.6, W - 0.6), d: 1.6 });
      A('sofa', sx, -D / 2 + 0.55, { w: Math.min(2.2, W - 0.8) });
      A('coffee', sx, -D / 2 + 1.9);
      if (W >= 4.5) {
        A('nakas', sx - 1.45, -D / 2 + 0.3);
        A('nakas', sx + 1.45, -D / 2 + 0.3);
      }
      A('tv', sx, D / 2 - 0.3, { rot: 180, w: Math.min(1.8, W - 1) });
    } else {
      const kos = room == 'Kamar Kos';
      const master = room == 'Master Suite';
      const bw = kos ? 1.2 : master ? 2 : 1.6;
      const bxp = -W * 0.1;

      A('rug', bxp, -D / 2 + 2.4, { w: bw + 1, d: 1.6 });
      A('bed', bxp, -D / 2 + 1, { w: bw });
      (kos ? [-1] : [-1, 1]).forEach(k => A('nakas', bxp + k * (bw / 2 + 0.3), -D / 2 + 0.25));
      if (master || kos) {
        A('wardrobe', -W / 2 + 0.3, D * 0.15, { rot: 90, w: kos ? 1.2 : Math.min(1.8, D * 0.45) });
      }
      if (kos) {
        A('desk', W * 0.22, -D / 2 + 0.3, { w: 1.2, d: 0.55 });
        A('chair', W * 0.22, -D / 2 + 0.95, { rot: 180 });
      }
    }
    A('plant', W / 2 - 0.45, -D / 2 + 0.45);
    return fitItems(out, W, D);
  }

  function kitchenItems(s, w, D, o) {
    const out = [];
    const A = makeAdder(out, -w / 2, -D / 2);
    const { lay, c } = o;

    A('kitchen', o.Lb / 2, 0.3, { w: o.Lb, c });
    if (o.Ls && lay != 'Island') A('kitchen', 0.3, 0.6 + o.Ls / 2, { w: o.Ls, rot: 90, c });
    if (lay == 'U-Shape') A('kitchen', o.Lb - 0.3, 0.6 + o.Ls / 2, { w: o.Ls, rot: 270, c });
    if (lay == 'Island') {
      A('kitchen', o.Lb / 2, 2.2, { w: o.Li, rot: 180, c });
      [-1, 0, 1].forEach(k => A('chair', o.Lb / 2 + k * 0.62, 2.95));
    }
    if (lay != 'U-Shape') A('fridge', o.Lb + 0.5, 0.38);
    if (lay != 'Island' && D > 3.2) {
      A('table', w / 2, D - 0.7);
      [-1, 1].forEach(k => A('chair', w / 2 + k * 0.35, D - 1.5));
    }
    return fitItems(out, w, D);
  }

  function buildInterior(g, s, C) {
    const p = C.IP[s.style];
    const l = C.IL[s.light];
    const room = s.room;
    const W = +s.lebar || 4;
    const D = +s.panjang || 4;
    const industrial = s.style == 'Industrial';

    g.add(new T.HemisphereLight(0xffffff, 0x8a8f98, 0.55 - l.glow * 0.3));
    const pl = new T.PointLight(l.gc, 0.6 + l.glow * 1.2, 14);
    pl.position.set(0, 2.5, 0);
    g.add(pl);

    const floorKind = industrial ? 'concrete' : s.style == 'Minimalist' ? 'tile' : 'plank';
    const wallKind = industrial ? 'concrete' : 'plaster';
    box(g, W, 0.1, D, '#fff', 0, -0.1, 0, { roughness: 0.38, map: makeTexture(floorKind, p.floor, W / 2, D / 2) });
    box(g, W, 2.8, 0.12, '#fff', 0, 0, -D / 2 - 0.06, { map: makeTexture(wallKind, p.wall, W / 2, 1.2), roughness: 0.92 });
    box(g, 0.12, 2.8, D, '#fff', -W / 2 - 0.06, 0, 0, { map: makeTexture(wallKind, p.wall, D / 2, 1.2), roughness: 0.92 });
    box(g, W, 0.12, 0.03, '#F3F0EA', 0, 0, -D / 2 + 0.015, { roughness: 0.5 });
    box(g, 0.03, 0.12, D, '#F3F0EA', -W / 2 + 0.015, 0, 0, { roughness: 0.5 });

    const ww = Math.min(2.2, W * 0.35);
    const wx = W * 0.22;
    const frame = industrial ? '#14161A' : p.acc;
    const win = new T.Mesh(new T.PlaneGeometry(ww, 1.4), new T.MeshBasicMaterial({ color: l.win }));
    win.position.set(wx, 1.6, -D / 2 + 0.012);
    g.add(win);
    [
      [ww + 0.1, 0.06, 0, 2.3],
      [ww + 0.1, 0.06, 0, 0.84],
      [0.06, 1.52, -ww / 2, 0.84],
      [0.06, 1.52, ww / 2, 0.84],
      [0.04, 1.4, 0, 0.9],
      [ww, 0.04, 0, 1.58]
    ].forEach(a => box(g, a[0], a[1], 0.04, frame, wx + a[2], a[3], -D / 2 + 0.02));

    if (s.style == 'Japandi Zen') {
      [-1, 1].forEach(k => box(g, 0.35, 2.5, 0.08, p.soft, wx + k * (ww / 2 + 0.25), 0.2, -D / 2 + 0.08));
    }

    const furniture = new T.Group();
    g.add(furniture);
    let lampX, lampZ;

    if (room == 'Living Room') {
      const sx = -W * 0.12;
      const sz = -D / 2 + 0.6;
      box(furniture, W * 0.6 > 3 ? 3 : 2.4, 0.1, 1.9, p.soft, sx, 0, sz + 1.3);
      box(furniture, 2.2, 0.42, 0.9, p.fur, sx, 0.08, sz);
      box(furniture, 2.2, 0.5, 0.2, darken(p.fur, 0.12), sx, 0.4, sz - 0.38);
      [-1, 1].forEach(k => box(furniture, 0.2, 0.3, 0.9, darken(p.fur, 0.15), sx + k * 1.1, 0.4, sz));
      box(furniture, 0.45, 0.35, 0.15, p.acc, sx - 0.6, 0.5, sz - 0.1);
      box(furniture, 0.45, 0.35, 0.15, p.acc, sx + 0.6, 0.5, sz - 0.1);
      box(furniture, 1.1, 0.05, 0.6, darken(p.floor, 0.3), sx, 0.38, sz + 1.2);
      [[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]].forEach(a =>
        box(furniture, 0.05, 0.38, 0.05, '#222', sx + a[0], 0, sz + 1.2 + a[1])
      );
      box(furniture, 0.4, 1.3, Math.min(2, D * 0.5), p.fur, -W / 2 + 0.2, 0, 0);
      lampX = sx + 1.55;
      lampZ = sz - 0.1;
    } else {
      const kos = room == 'Kamar Kos';
      const master = room == 'Master Suite';
      const bw = kos ? 1.2 : master ? 2.0 : 1.6;
      const bxp = -W * 0.1;
      const bz = -D / 2 + 1.05;

      box(furniture, bw + 1, 0.02, 1.6, p.soft, bxp, 0, bz + 1.6);
      box(furniture, bw, 0.35, 2, p.fur, bxp, 0, bz);
      box(furniture, bw - 0.08, 0.2, 1.92, '#F4F2EE', bxp, 0.35, bz);
      box(furniture, bw + 0.2, 1.1, 0.1, p.acc, bxp, 0, -D / 2 + 0.08);
      box(furniture, bw - 0.04, 0.24, 1.15, p.acc, bxp, 0.45, bz + 0.4);
      (kos ? [0] : [-1, 1]).forEach(k => box(furniture, bw / 2 - 0.1, 0.14, 0.4, '#fff', bxp + k * bw * 0.25, 0.55, bz - 0.7));
      [-1, 1].forEach(k => {
        if (!(kos && k > 0)) box(furniture, 0.45, 0.5, 0.4, p.fur, bxp + k * (bw / 2 + 0.35), 0, -D / 2 + 0.3);
      });
      if (master || kos) box(furniture, 0.6, 2.2, Math.min(1.8, D * 0.45), p.fur, -W / 2 + 0.3, 0, D * 0.15);
      if (kos) {
        box(furniture, 1.2, 0.04, 0.55, darken(p.fur, 0.1), W * 0.22, 0.72, -D / 2 + 0.3);
        [-1, 1].forEach(k => box(furniture, 0.04, 0.72, 0.5, '#222', W * 0.22 + k * 0.55, 0, -D / 2 + 0.3));
        box(furniture, 0.4, 0.25, 0.03, '#2b2f36', W * 0.22, 0.78, -D / 2 + 0.25);
      }
      lampX = bxp - bw / 2 - 0.75;
      lampZ = -D / 2 + 0.35;
    }

    cyl(furniture, 0.015, 0.015, 1.5, darken(p.fur, 0.3), lampX, 0, lampZ);
    cyl(furniture, 0.18, 0.28, 0.3, l.gc, lampX, 1.4, lampZ, {
      emissive: new T.Color(l.gc), emissiveIntensity: 0.6 * (0.3 + l.glow)
    });
    const lp = new T.PointLight(l.gc, 0.5 + l.glow, 6);
    lp.position.set(lampX, 1.5, lampZ);
    g.add(lp);

    cyl(furniture, 0.2, 0.15, 0.35, darken(p.fur, 0.1), W / 2 - 0.45, 0, -D / 2 + 0.45);
    ball(furniture, 0.38, '#3E8A4F', W / 2 - 0.45, 0.85, -D / 2 + 0.45);
    ball(furniture, 0.26, '#4FA362', W / 2 - 0.6, 1.1, -D / 2 + 0.5);

    const sp = new T.SpotLight(0xfff4e0, 0.75 + l.glow * 0.3, 30, 1.0, 1, 1);
    sp.position.set(wx, 2.3, -D / 2 + 0.2);
    sp.target.position.set(wx - 0.6, 0, D * 0.15);
    sp.castShadow = true;
    sp.shadow.mapSize.set(1024, 1024);
    sp.shadow.bias = -0.0005;
    sp.shadow.normalBias = 0.03;
    g.add(sp, sp.target);

    const aw = Math.min(1.2, W * 0.3);
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 176;
    const q = cv.getContext('2d');
    q.fillStyle = p.soft;
    q.fillRect(0, 0, 256, 176);
    q.fillStyle = p.acc;
    q.beginPath();
    q.arc(100, 90, 50, 0, 7);
    q.fill();
    q.fillStyle = p.fur;
    q.fillRect(150, 50, 70, 90);
    const art = new T.CanvasTexture(cv);
    art.encoding = T.sRGBEncoding;
    const ay = room == 'Living Room' ? 1.5 : 1.75;
    const pic = new T.Mesh(new T.PlaneGeometry(aw, aw * 0.69), new T.MeshStandardMaterial({ map: art, roughness: 0.6 }));
    pic.position.set(-W * 0.12, ay, -D / 2 + 0.03);
    g.add(pic);
    box(g, aw + 0.08, aw * 0.69 + 0.08, 0.02, darken(p.fur, 0.4), -W * 0.12, ay - aw * 0.345 - 0.04, -D / 2 + 0.015);

    if (room == 'Living Room') addAO(furniture, 2.6, 1.4, -W * 0.12, -D / 2 + 1.1, 0.55);
    else addAO(furniture, 2.6, 2.6, -W * 0.1, -D / 2 + 1.15, 0.55);
    addAO(furniture, 1.2, 1.2, W / 2 - 0.45, -D / 2 + 0.45, 0.5);

    const DR = {
      w: { key: 'lebar', min: 3, max: 8, step: 0.5 },
      d: { key: 'panjang', min: 3, max: 10, step: 0.5 }
    };
    DR.a = {
      set: (st, D1, ratio) => {
        const D2 = clamp(Math.round(D1 / 0.5) * 0.5, 3, 10);
        const W2 = clamp(Math.round((D2 * ratio) / 0.5) * 0.5, 3, 8);
        if (D2 === +st.panjang && W2 === +st.lebar) return false;
        st.panjang = D2;
        st.lebar = W2;
        return true;
      }
    };

    addHuman(g, W / 2 - 0.75, D / 2 - 0.9);
    addDims(g, { W, D, H: 2.8, cx: 0, cz: 0, y: 0, k: 0.36, gp: 0.55, hs: 1.8, drag: DR });

    if (s.plan && s.psig !== room && !s.pe) delete s.plan;
    s.psig = room;

    const inner = buildPlan(g, W, D, 0, s, true, (w, d) => roomItems(s, w, d));
    const setVis = on => {
      const showPlan = !!(on || s.pe);
      furniture.visible = !showPlan;
      inner.visible = showPlan;
    };
    setVis(false);

    g.userData = {
      t: [0, 1, 0],
      d: Math.max(W, D) * 1.3 + 5.5,
      az: 0.55,
      el: 0.5,
      drag: DR,
      WD: [W, D],
      org: [-W / 2, -D / 2],
      set2D: on => setVis(on),
      afterEdit: setVis,
      floors: 1,
      edit: { floors: [inner], fy: () => 0 }
    };
  }

  function buildKitchen(g, s, C) {
    const cabColor = C.KC[s.cab];
    const topColor = C.KT[s.top];
    const len = +s.len;
    const lay = s.layout;
    const wood = s.cab == 'Walnut Wood';
    const topTex = { 'Marmer Putih': 'marble', 'Granit Hitam': 'granite', 'Kayu Butcher': 'grain' }[s.top];

    let Lb = len;
    let Ls = 0;
    let Li = 0;
    if (lay == 'L-Shape') {
      Lb = len * 0.6;
      Ls = Math.max(0.6, len * 0.4);
    } else if (lay == 'U-Shape') {
      Lb = Math.max(1.8, len * 0.4);
      Ls = Math.max(0.6, (len - Lb) / 2);
    } else if (lay == 'Island') {
      Lb = len * 0.65;
      Li = Math.max(0.8, len * 0.35);
    }
    Lb = Math.max(1.2, Lb);

    const fw = lay == 'U-Shape' ? Lb : Lb + 0.9;
    const fd = (+s.lebar || 3.5) + (lay == 'Island' ? 0.8 : 0);

    g.add(new T.HemisphereLight(0xffffff, 0x8a8f98, 0.5));
    addSun(g, 0.75, fw, 7, fd);
    const pl = new T.PointLight(0xfff0d8, 0.5, 14);
    pl.position.set(fw / 2, 2.4, 2);
    g.add(pl);

    box(g, fw, 0.1, fd, '#fff', fw / 2, -0.1, fd / 2, { roughness: 0.3, map: makeTexture('tile', '#C9C5BB', fw / 1.2, fd / 1.2) });
    box(g, fw, 2.7, 0.12, '#fff', fw / 2, 0, -0.06, { map: makeTexture('plaster', '#ECE9E3', fw / 2, 1), roughness: 0.92 });
    box(g, 0.12, 2.7, fd, '#fff', -0.06, 0, fd / 2, { map: makeTexture('plaster', '#E3E0DA', fd / 2, 1), roughness: 0.92 });
    box(g, Lb, 0.65, 0.02, '#fff', Lb / 2, 0.89, 0.01, { roughness: 0.2, map: makeTexture('subway', '#EEF0F1', Lb / 1.1, 0.9) });

    const furniture = new T.Group();
    g.add(furniture);

    const run = (L, upper, x, z, ry) => {
      const r = new T.Group();
      r.position.set(x, 0, z);
      r.rotation.y = ry;
      furniture.add(r);

      const n = Math.max(1, Math.round(L / 0.6));
      const px = i => -L / 2 + ((i + 0.5) * L) / n;
      const cabMat = { roughness: 0.35, map: wood ? makeTexture('grain', cabColor, L, 1) : null };

      box(r, L - 0.02, 0.1, 0.5, '#222', 0, 0, -0.02);
      box(r, L, 0.75, 0.6, wood ? '#fff' : cabColor, 0, 0.1, 0, cabMat);
      box(r, L + 0.02, 0.04, 0.64, topTex ? '#fff' : topColor, 0, 0.85, 0.02, {
        roughness: 0.22, envMapIntensity: 1,
        map: topTex ? makeTexture(topTex, topColor, L / 1.2, 1) : null
      });
      for (let i = 0; i < n; i++) {
        if (i) box(r, 0.012, 0.7, 0.01, '#1c1c1c', -L / 2 + (i * L) / n, 0.12, 0.305);
        box(r, 0.14, 0.02, 0.02, '#B8BCC2', px(i), 0.75, 0.32, { metalness: 0.8, roughness: 0.3 });
      }

      if (upper) {
        box(r, L, 0.7, 0.35, wood ? '#fff' : cabColor, 0, 1.55, -0.125, {
          roughness: 0.35, map: wood ? makeTexture('grain', cabColor, L, 0.6) : null
        });
        for (let i = 0; i < n; i++) {
          if (i) box(r, 0.012, 0.66, 0.01, '#1c1c1c', -L / 2 + (i * L) / n, 1.57, 0.055);
          box(r, 0.14, 0.02, 0.02, '#B8BCC2', px(i), 1.6, 0.07, { metalness: 0.8, roughness: 0.3 });
        }
      }
    };

    run(Lb, 1, Lb / 2, 0.3, 0);
    if (Ls && lay != 'Island') run(Ls, 1, 0.3, 0.6 + Ls / 2, Math.PI / 2);
    if (lay == 'U-Shape') run(Ls, 1, Lb - 0.3, 0.6 + Ls / 2, -Math.PI / 2);
    if (lay == 'Island') run(Li, 0, Lb / 2, 2.2, Math.PI);

    const steel = { metalness: 0.9, roughness: 0.25, envMapIntensity: 1.2 };
    if (Lb >= 1.8) {
      const sinkX = Lb * 0.28;
      const stoveX = Lb * 0.74;
      box(furniture, 0.7, 0.012, 0.42, '#9AA3AC', sinkX, 0.89, 0.3, steel);
      box(furniture, 0.6, 0.012, 0.34, '#6F7882', sinkX, 0.895, 0.3, steel);
      cyl(furniture, 0.014, 0.014, 0.3, '#CDD2D7', sinkX, 0.89, 0.08, steel);
      box(furniture, 0.02, 0.02, 0.16, '#CDD2D7', sinkX, 1.17, 0.16, steel);
      box(furniture, 0.62, 0.012, 0.52, '#15171A', stoveX, 0.89, 0.3, { roughness: 0.12, metalness: 0.3 });
      [[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.12], [0.15, 0.12]].forEach(a =>
        cyl(furniture, 0.07, 0.07, 0.008, '#3B3E43', stoveX + a[0], 0.9, 0.3 + a[1], steel)
      );
      box(furniture, 0.9, 0.1, 0.5, '#A8AFB6', stoveX, 1.45, 0.25, steel);
    }
    if (lay != 'U-Shape') {
      box(furniture, 0.7, 1.8, 0.65, '#C7CDD3', Lb + 0.5, 0, 0.38, steel);
      box(furniture, 0.02, 0.6, 0.03, '#555A60', Lb + 0.2, 0.9, 0.72, steel);
      box(furniture, 0.01, 0.01, 0.6, '#3A3E43', Lb + 0.5, 1.15, 0.705);
      addAO(furniture, 0.9, 0.9, Lb + 0.5, 0.38, 0.5);
    }
    if (lay == 'Island') {
      [-1, 0, 1].forEach(k => {
        const x = Lb / 2 + k * 0.62;
        cyl(furniture, 0.17, 0.17, 0.06, '#2B2F36', x, 0.62, 2.95);
        cyl(furniture, 0.02, 0.02, 0.62, '#9AA3AC', x, 0, 2.95, steel);
        addAO(furniture, 0.4, 0.4, x, 2.95, 0.5);
      });
    }
    addAO(furniture, Lb, 0.8, Lb / 2, 0.35, 0.45);

    const baseLen = n =>
      Math.max(1.2, lay == 'L-Shape' ? n * 0.6 : lay == 'U-Shape' ? Math.max(1.8, n * 0.4) : lay == 'Island' ? n * 0.65 : n);
    const floorW = n => (lay == 'U-Shape' ? baseLen(n) : baseLen(n) + 0.9);
    const islandOff = lay == 'Island' ? 0.8 : 0;

    const DR = {
      w: {
        key: 'len', min: 2, max: 10, step: 0.5,
        to: e => {
          let best = 2;
          let bestDiff = 99;
          for (let n = 2; n <= 10; n += 0.5) {
            const diff = Math.abs(floorW(n) - e);
            if (diff < bestDiff) { bestDiff = diff; best = n; }
          }
          return best;
        }
      }
    };
    DR.d = { key: 'lebar', min: 3, max: 6, step: 0.5, to: e => e - islandOff };
    DR.a = {
      set: (st, D1, ratio) => {
        const v = DR.w.to(D1 * ratio);
        const l2 = clamp(Math.round((D1 - islandOff) / 0.5) * 0.5, 3, 6);
        if (v === +st.len && l2 === +st.lebar) return false;
        st.len = v;
        st.lebar = l2;
        return true;
      }
    };

    addHuman(g, fw / 2, fd - 0.75);
    addDims(g, {
      W: fw, D: fd, H: 2.7, cx: fw / 2, cz: fd / 2, y: 0, k: 0.36, gp: 0.55, hs: 1.8, drag: DR,
      lw: 'Panjang', ld: 'Lebar', vw: len, vd: +s.lebar || 3.5, va: len * (+s.lebar || 3.5)
    });

    if (s.plan && s.psig !== lay && !s.pe) delete s.plan;
    s.psig = lay;

    const inner = buildPlan(g, fw, fd, 0, s, true, (w, d) => kitchenItems(s, w, d, { lay, Lb, Ls, Li, c: cabColor }));
    inner.position.set(fw / 2, 0, fd / 2);
    const setVis = on => {
      const showPlan = !!(on || s.pe);
      furniture.visible = !showPlan;
      inner.visible = showPlan;
    };
    setVis(false);

    g.userData = {
      t: [fw / 2, 1, 1.8],
      t2: [fw / 2, 1, fd / 2],
      d: Math.max(fw, fd) * 1.3 + 5.5,
      az: 0.5,
      el: 0.45,
      drag: DR,
      WD: [fw, fd],
      org: [0, 0],
      set2D: on => setVis(on),
      afterEdit: setVis,
      floors: 1,
      edit: { floors: [inner], fy: () => 0 }
    };
  }

  function buildFacade(g, s, C) {
    const w = +s.w;
    const D = +s.d || 12;
    const floors = parseInt(s.floors);
    const floorH = 3.2;
    const baseH = 0.35;
    const H = baseH + floors * floorH;
    const style = s.style;

    const wallColor = C.FW[s.wall];
    const accColor = C.FA[s.acc];
    const roofColor = C.FROOF[style];
    const panelW = w * 0.26;
    const glassColor = style == 'Minimalis Modern' ? '#5E7C9A' : '#A9CBE8';
    const frame =
      style == 'Industrial' ? '#14161A' : style == 'Klasik Modern' ? '#FFFFFF' : style == 'Tropis' ? '#7A5230' : '#2B2F36';

    const glass = (parent, ww, hh, dd, x, y, z) => {
      const m = new T.Mesh(
        new T.BoxGeometry(ww, hh, dd),
        new T.MeshStandardMaterial({
          color: toLinear(glassColor), metalness: 0.85, roughness: 0.06,
          envMapIntensity: 1.6, transparent: true, opacity: 0.88
        })
      );
      m.position.set(x, y + hh / 2, z);
      parent.add(m);
      return m;
    };

    g.add(new T.HemisphereLight(0xdcecff, 0x6f7a68, 0.45));
    addSun(g, 1.5, 16, 26, 20, 34);

    const frontZ = D / 2 + 11.5;
    const fenceX = w / 2 + 7;
    const backZ = -D / 2 - 4;
    const siteLen = frontZ - backZ;
    const site = group(g);
    const fenceColor = '#E4E2DC';

    box(site, 240, 0.1, 240, '#A8B2A0', 0, -0.22, 0);
    box(site, fenceX * 2 + 0.4, 0.12, siteLen + 0.4, '#fff', 0, -0.12, (frontZ + backZ) / 2, {
      roughness: 1, map: makeTexture('grass', '#7E9C72', fenceX, siteLen / 2)
    });
    box(site, 140, 0.06, 7, '#4A4D52', 0, -0.04, frontZ + 5.5);
    for (let x = -60; x < 60; x += 6) box(site, 3, 0.01, 0.18, '#E8E6DF', x, 0.02, frontZ + 5.5);
    box(site, 140, 0.12, 1.4, '#BDBBB3', 0, 0, frontZ + 1.1);
    box(site, 4.2, 0.04, frontZ - D / 2 - 0.45, '#6C6F72', 0, 0, (frontZ + D / 2 + 0.45) / 2);

    [-1, 1].forEach(k => {
      const L = fenceX - 2.4;
      box(site, L, 1.1, 0.18, fenceColor, k * (2.4 + L / 2), 0, frontZ);
      box(site, L + 0.1, 0.08, 0.26, '#B9B6AE', k * (2.4 + L / 2), 1.1, frontZ);
      box(site, 0.4, 1.6, 0.4, '#CFCCC4', k * 2.5, 0, frontZ);
      box(site, 0.18, 1.1, siteLen, fenceColor, k * fenceX, 0, (frontZ + backZ) / 2);
    });
    box(site, fenceX * 2, 1.1, 0.18, fenceColor, 0, 0, backZ);

    const x0 = -w / 2 + panelW + 0.6;
    const x1 = w / 2 - 0.6;
    const cols = w > 12 ? 3 : 2;
    const gap = 0.5;
    const winW = (x1 - x0 - gap * (cols - 1)) / cols;
    const doorW = Math.min(winW, 1.2);
    const doorX = x0 + winW / 2;
    const foundation = group(g);

    box(foundation, w + 0.9, baseH, D + 0.9, '#8D8B85', 0, 0, 0, { roughness: 0.95 });
    box(foundation, w + 1, 0.07, D + 1, '#6F6D68', 0, baseH - 0.06, 0);
    box(foundation, w + 1.2, 0.12, 3.6, '#BDBBB3', 0, 0, D / 2 + 2.25);
    box(foundation, doorW + 1, 0.2, 0.6, '#B5B3AC', doorX, 0, D / 2 + 0.75);

    const F = [];
    const sideWindows = Math.max(1, Math.floor(D / 4.5));
    const sideStep = D / sideWindows;

    for (let i = 0; i < floors; i++) {
      const f = group(g, 0, baseH + i * floorH, 0);
      const slab = group(f, 0, -0.2, 0);
      const walls = group(f);
      const details = group(f);

      const setback = style == 'Minimalis Modern' && i > 0;
      const w2 = setback ? w * 0.92 : w;
      const wx = setback ? w * 0.04 : 0;
      const xr = wx + w2 / 2;
      const xl = wx - w2 / 2;

      if (i) box(slab, w + 0.3, 0.18, D + 0.3, darken(wallColor, 0.2), 0, 0, 0);
      box(walls, w2, floorH, D, '#fff', wx, 0, 0, {
        roughness: 0.9, map: makeTexture('plaster', wallColor, w2 / 2.5, floorH / 2.5)
      });

      const pn = new T.Mesh(
        new T.BoxGeometry(panelW, floorH, 0.25),
        makeMat(accColor, {
          roughness: 0.9, map: panelTexture(s.acc, accColor, Math.max(1, panelW / 2.4), floorH / 2.4)
        })
      );
      pn.position.set(-w / 2 + panelW / 2, floorH / 2, D / 2 + 0.12);
      pn.castShadow = pn.receiveShadow = true;
      details.add(pn);

      for (let j = 0; j < cols; j++) {
        const cx = x0 + j * (winW + gap) + winW / 2;
        if (!i && !j) {
          box(details, doorW, 2.3, 0.12, darken(accColor, 0.3), cx, 0, D / 2 + 0.06);
          box(details, 0.06, 0.3, 0.04, '#E8D9A8', cx + doorW / 2 - 0.2, 1, D / 2 + 0.14);
          if (style == 'Industrial') box(details, doorW + 0.6, 0.12, 1, '#14161A', cx, 2.5, D / 2 + 0.5);
          if (style == 'Klasik Modern') {
            [-1, 1].forEach(k => cyl(details, 0.12, 0.12, 2.7, '#fff', cx + k * (doorW / 2 + 0.45), 0, D / 2 + 0.7));
          }
          continue;
        }
        box(details, winW + 0.2, 1.75, 0.08, frame, cx, 0.9, D / 2 + 0.04);
        glass(details, winW, 1.55, 0.08, cx, 1, D / 2 + 0.08);
      }

      if (i) {
        const bw = x1 - x0 + 0.6;
        const bc = (x0 + x1) / 2;
        box(slab, bw, 0.2, 1.3, darken(wallColor, 0.15), bc, 0, D / 2 + 0.65);
        glass(details, bw, 1, 0.04, bc, 0, D / 2 + 1.25);
        box(details, bw + 0.06, 0.05, 0.07, '#2B2F36', bc, 1, D / 2 + 1.25);
        [-1, 1].forEach(k => box(details, 0.06, 1.05, 0.06, '#2B2F36', bc + (k * bw) / 2, 0, D / 2 + 1.25));
      }

      if (style == 'Tropis' && floors > 1 && !i) {
        box(details, w + 1.2, 0.15, 1.6, roofColor, 0, floorH - 0.12, D / 2 + 0.7);
      }

      for (let q = 0; q < sideWindows; q++) {
        const z = -D / 2 + sideStep * (q + 0.5);
        [[xr, 1], [xl, -1]].forEach(a => {
          box(details, 0.06, 1.3, 1.3, frame, a[0] + a[1] * 0.03, 0.9, z);
          glass(details, 0.05, 1.1, 1.1, a[0] + a[1] * 0.06, 1, z);
        });
      }

      [-1, 1].forEach(k => {
        const cx = wx + k * w2 * 0.22;
        box(details, 1.4, 1.3, 0.06, frame, cx, 0.9, -D / 2 - 0.03);
        glass(details, 1.2, 1.1, 0.05, cx, 1, -D / 2 - 0.06);
      });

      const inner = buildPlan(f, w2, D, i, s);
      inner.position.x = wx;
      F.push({ f, sl: i ? slab : null, wl: walls, dt: details, inn: inner });
    }

    const roof = group(g, 0, H, 0);
    const roofType = s.roof;

    if (roofType == 'Dak Datar') {
      box(roof, w + 0.6, 0.3, D + 0.6, darken(wallColor, 0.45), 0, 0, 0);
      box(roof, w + 0.6, 0.12, D + 0.6, darken(wallColor, 0.6), 0, 0.3, 0);
      cyl(roof, 0.8, 0.8, 1.3, '#8A8D91', -w / 4, 0.42, -D / 4);
      cyl(roof, 0.85, 0.85, 0.08, '#6C6F72', -w / 4, 1.72, -D / 4);
    } else if (roofType == 'Pelana') {
      const shape = new T.Shape();
      shape.moveTo(-D / 2 - 0.7, 0);
      shape.lineTo(D / 2 + 0.7, 0);
      shape.lineTo(0, 2.6);
      shape.lineTo(-D / 2 - 0.7, 0);
      const m = new T.Mesh(
        new T.ExtrudeGeometry(shape, { depth: w + 0.9, bevelEnabled: false }),
        makeMat(roofColor, { roughness: 0.6 })
      );
      m.rotation.y = Math.PI / 2;
      m.position.set(-(w + 0.9) / 2, 0, 0);
      m.castShadow = true;
      roof.add(m);
    } else {
      const ge = new T.ConeGeometry(1, 2.4, 4);
      ge.rotateY(Math.PI / 4);
      const m = new T.Mesh(ge, makeMat(roofColor, { roughness: 0.6 }));
      m.scale.set((w + 0.9) / 1.414, 1, (D + 0.9) / 1.414);
      m.position.y = 1.2;
      m.castShadow = true;
      roof.add(m);
      box(roof, w + 0.9, 0.2, D + 0.9, darken(roofColor, 0.3), 0, -0.05, 0);
    }

    const land = group(g);
    const pops = [];
    const tree = (x, z, k) => {
      const t = group(land, x, 0, z);
      cyl(t, 0.15 * k, 0.2 * k, 1.6 * k, '#6B4A32', 0, 0, 0);
      ball(t, 1.3 * k, '#3E8A4F', 0, 2.4 * k, 0);
      ball(t, 0.9 * k, '#4FA362', 0.4 * k, 3.3 * k, 0);
      pops.push(t.scale);
    };
    [-1, 1].forEach(k => {
      tree(k * (w / 2 + 4.2), D / 2 - 1, 1);
      tree(k * (w / 2 + 3.6), -D / 2 - 1.5, 0.85);
    });
    [-0.28, 0, 0.28].forEach(k => {
      const b = group(land, k * w, 0, D / 2 + 3.7);
      ball(b, 0.45, '#5E9B62', 0, 0.3, 0);
      pops.push(b.scale);
    });

    const set2D = (on, sel) => {
      F.forEach((o, i) => {
        const target = on && i == sel;
        o.f.visible = !on || i <= sel;
        o.inn.visible = target;
        [o.wl, o.dt].forEach(gr =>
          gr.traverse(m => {
            if (!m.isMesh || !m.material) return;
            const c0 = m.userData.c0 || (m.userData.c0 = [m.castShadow, m.material.transparent, m.material.opacity, m.material.depthWrite]);
            m.castShadow = target ? false : c0[0];
            m.material.transparent = target || c0[1];
            m.material.opacity = target ? Math.min(0.16, c0[2]) : c0[2];
            m.material.depthWrite = target ? false : c0[3];
          })
        );
      });
      roof.visible = !on;
      land.visible = !on;
    };

    const DR = {
      w: { key: 'w', min: 6, max: 20, step: 1 },
      d: { key: 'd', min: 6, max: 20, step: 1 }
    };
    DR.a = {
      set: (st, D1, ratio) => {
        const D2 = clamp(Math.round(D1), 6, 20);
        const W2 = clamp(Math.round(D2 * ratio), 6, 20);
        if (D2 === +st.d && W2 === +st.w) return false;
        st.d = D2;
        st.w = W2;
        return true;
      }
    };
    const dim = addDims(g, { W: w, D, H, cx: 0, cz: 0, y: 0.1, k: 0.75, gp: 3.4, hs: 1.9, drag: DR });

    const anim = () => {
      const tl = gsap.timeline();
      const rise = (o, dur, at) => {
        o.visible = false;
        tl.fromTo(o.scale, { y: 0.001 }, { y: 1, duration: dur, ease: 'power2.out', onStart() { o.visible = true; } }, at);
      };

      roof.visible = false;
      rise(foundation, 0.9);
      F.forEach(o => {
        if (o.sl) rise(o.sl, 0.3);
        rise(o.wl, 0.85);
        rise(o.dt, 0.85, '<');
      });
      tl.fromTo(roof.position, { y: H + 16 }, { y: H, duration: 1, ease: 'power3.out', onStart() { roof.visible = true; } }, '>-.1');
      tl.fromTo(pops, { x: 0.001, y: 0.001, z: 0.001 }, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.08 }, '>-.3');
      dim.visible = false;
      tl.call(() => { dim.visible = true; }, null, '>');
      return tl;
    };

    g.userData = {
      t: [0, H * 0.4, 3],
      d: Math.max(w, D, H * 1.5) * 1.8 + 9,
      az: 0.38,
      el: 0.2,
      anim,
      set2D,
      floors,
      drag: DR,
      WD: [w, D],
      org: [-w / 2, -D / 2],
      edit: { floors: F.map(o => o.inn), fy: i => baseH + i * floorH }
    };
  }

  const BUILDERS = { interior: buildInterior, kitchen: buildKitchen, facade: buildFacade };

  function build(st) {
    if (st.tl) {
      st.tl.kill();
      st.tl = null;
    }
    if (st.g) {
      st.sc.remove(st.g);
      st.g.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material && o.material.map) o.material.map.dispose();
      });
    }

    const g = new T.Group();
    BUILDERS[st.k0](g, st.s, st.C);
    st.sc.add(g);
    st.g = g;

    const u = g.userData;
    if (st.k0 == 'kitchen') {
      const ground = new T.Mesh(new T.PlaneGeometry(80, 80), new T.ShadowMaterial({ opacity: 0.12 }));
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(u.t[0], -0.105, u.t[2]);
      ground.receiveShadow = true;
      g.add(ground);
    }
    if (st.m2 && u.set2D) u.set2D(true, Math.min(st.sel || 0, u.floors - 1));
    if (st.sync) st.sync();
    return u;
  }

  function mount(el) {
    const renderer = new T.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;

    const st = {
      el,
      r: renderer,
      sc: new T.Scene(),
      cam: new T.PerspectiveCamera(36, 1 / 0.65, 0.1, 200),
      az: 0,
      el_: 0.4,
      d: 10,
      t: [0, 1, 0],
      sw: 0.22,
      w: 0
    };

    const cv = renderer.domElement;
    cv.style.cssText = 'width:100%;height:auto;display:block;touch-action:pan-y;cursor:grab;border-radius:inherit';

    let drag = null;
    const raycaster = new T.Raycaster();
    const groundPlane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    const ndc = new T.Vector2();
    const ED = { sel: null, n: 0 };

    const cast = e => {
      const b = cv.getBoundingClientRect();
      ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      raycaster.setFromCamera(ndc, st.cam);
      return raycaster;
    };

    const hitHandle = e => {
      if (!st.g) return null;
      const hs = [];
      st.g.traverse(o => { if (o.userData && o.userData.hid) hs.push(o); });
      const r = cast(e).intersectObjects(hs, true)[0];
      if (!r) return null;
      let o = r.object;
      while (o && !o.userData.hid) o = o.parent;
      return o;
    };

    const currentPlan = () => {
      const u = st.g && st.g.userData;
      if (!st.m2 || !u || !u.edit) return null;
      return u.edit.floors[Math.min(st.sel || 0, u.edit.floors.length - 1)];
    };

    const pickItem = e => {
      const inn = currentPlan();
      if (!inn) return null;
      for (const r of cast(e).intersectObject(inn, true)) {
        let o = r.object;
        while (o && o !== inn) {
          if (o.userData && o.userData.item) return o;
          o = o.parent;
        }
      }
      return null;
    };

    const snap = v => Math.round(v * 10) / 10;

    cv.addEventListener(
      'touchstart',
      e => {
        const t = e.touches[0];
        if (t && (hitHandle(t) || pickItem(t))) e.preventDefault();
      },
      { passive: false }
    );

    cv.onpointerdown = e => {
      const h = hitHandle(e);
      st.sw = 0;
      try { cv.setPointerCapture(e.pointerId); } catch (x) {}

      if (h) {
        const P = new T.Vector3();
        const hp = new T.Vector3();
        const id = h.userData.hid;
        const u = st.g.userData;
        cast(e).ray.intersectPlane(groundPlane, P);
        h.getWorldPosition(hp);
        drag = {
          hid: id,
          off: id == 'w' ? hp.x - P.x : hp.z - P.z,
          r: u.WD ? u.WD[0] / u.WD[1] : 1
        };
        cv.style.cursor = 'grabbing';
        return;
      }

      const o = pickItem(e);
      if (o) {
        const inn = currentPlan();
        const it = o.userData.item;
        const P = new T.Vector3();
        const u = st.g.userData.edit;
        const plane = new T.Plane(V(0, 1, 0), -(u.fy(inn.userData.i) + 0.02));
        if (cast(e).ray.intersectPlane(plane, P)) {
          inn.worldToLocal(P);
          drag = { item: it, pl: plane, off: [it.x - P.x, it.z - P.z] };
          selectItem(it.id);
          cv.style.cursor = 'move';
          return;
        }
      }

      drag = { x: e.clientX, y: e.clientY, a: st.az, e: st.el_ };
    };

    cv.onpointermove = e => {
      if (!drag) {
        cv.style.cursor = hitHandle(e) ? 'pointer' : pickItem(e) ? 'move' : 'grab';
        return;
      }

      if (drag.item) {
        const inn = currentPlan();
        const P = new T.Vector3();
        const it = drag.item;
        if (!inn || !cast(e).ray.intersectPlane(drag.pl, P)) return;
        inn.worldToLocal(P);
        it.x = snap(P.x + drag.off[0]);
        it.z = snap(P.z + drag.off[1]);
        clampItem(it, inn);
        inn.userData.sync(it);
        if (highlight) highlight.position.set(it.x, 0.06, it.z);
        drag.moved = true;
        return;
      }

      if (drag.hid) {
        const P = new T.Vector3();
        const u = st.g.userData;
        const c = u.drag && u.drag[drag.hid];
        if (!c || !cast(e).ray.intersectPlane(groundPlane, P)) return;
        if (!drag.anc) drag.anc = [st.g.position.x + u.org[0], st.g.position.z + u.org[1]];

        let key;
        let val;
        if (drag.hid == 'a') {
          if (!c.set(st.s, 2 * (P.z + drag.off - drag.anc[1]), drag.r)) return;
          key = 'luas';
        } else {
          const edge = 2 * (drag.hid == 'w' ? P.x + drag.off - drag.anc[0] : P.z + drag.off - drag.anc[1]);
          let v = c.to ? c.to(edge) : edge;
          v = Math.max(c.min, Math.min(c.max, Math.round(v / c.step) * c.step));
          if (v === +st.s[c.key]) return;
          st.s[c.key] = v;
          key = c.key;
          val = v;
        }

        const nu = build(st);
        st.g.position.set(drag.anc[0] - nu.org[0], 0, drag.anc[1] - nu.org[1]);
        if (st.cb) st.cb(key, val);
        return;
      }

      drag.mv = Math.max(drag.mv || 0, Math.hypot(e.clientX - drag.x, e.clientY - drag.y));
      st.az = drag.a - (e.clientX - drag.x) * 0.008;
      st.el_ = Math.max(0.08, Math.min(1.52, drag.e + (e.clientY - drag.y) * 0.006));
    };

    cv.onpointerup = cv.onpointercancel = () => {
      if (drag && drag.item) {
        if (drag.moved) changed();
      } else if (drag && drag.hid && drag.anc) {
        const g = st.g;
        const dx = g.position.x;
        const dz = g.position.z;
        g.position.set(0, 0, 0);
        st.t = [st.t[0] - dx, st.t[1], st.t[2] - dz];
        const u = g.userData;
        if (window.gsap) {
          gsap.to(st.t, { 0: u.t[0], 1: u.t[1], 2: st.m2 ? (u.t2 ? u.t2[2] : 0) : u.t[2], duration: 0.6, ease: 'power2.out' });
          gsap.to(st, { d: u.d, duration: 0.6, ease: 'power2.out' });
        } else {
          st.t = st.m2 ? (u.t2 || [u.t[0], u.t[1], 0]).slice() : u.t.slice();
          st.d = u.d;
        }
      } else if (drag && drag.a !== undefined && (drag.mv || 0) < 4 && ED.sel) {
        selectItem(null);
      }
      drag = null;
      cv.style.cursor = 'grab';
    };

    st.sc.environment = makeEnvMap(renderer);
    el.innerHTML = '';
    el.appendChild(cv);

    const tools = document.createElement('div');
    tools.className = 'sim-tools';
    const addButton = (html, title, fn) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = html;
      b.title = b.ariaLabel = title;
      b.onclick = fn;
      tools.appendChild(b);
      return b;
    };

    st.rp = addButton('▶<span class="lg"> Bangun ulang</span>', 'Bangun ulang animasi', () => SIM3D.replay(el));

    const target2D = u => (u.t2 ? u.t2.slice() : [u.t[0], u.t[1], 0]);
    const to3D = () => {
      st.m2 = false;
      const u = st.g && st.g.userData;
      if (u) st.t = u.t.slice();
      if (u && u.set2D) u.set2D(false);
      st.sync();
    };

    st.sync = () => {
      tools.querySelectorAll('.fbtn').forEach(b => b.remove());
      const u = st.g && st.g.userData;
      if (st.m2 && u && u.floors > 1) {
        for (let i = 0; i < u.floors; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'fbtn';
          b.textContent = 'Lt ' + (i + 1);
          b.style.opacity = i == (st.sel || 0) ? 1 : 0.6;
          b.onclick = () => {
            st.sel = i;
            st.g.userData.set2D(true, i);
            st.sync();
          };
          tools.appendChild(b);
        }
      }
      drawHighlight();
      refreshPanel();
    };

    addButton('<span class="lg">Tampak </span>Depan', 'Tampak depan', () => {
      to3D();
      st.az = 0;
      st.el_ = 0.14;
      st.sw = 0;
    });
    addButton('2D', 'Tampak atas (denah tembus pandang)', () => {
      if (st.tl && st.tl.progress() < 1) st.tl.progress(1);
      st.m2 = true;
      st.az = 0;
      st.el_ = 1.5;
      st.sw = 0;
      const u = st.g && st.g.userData;
      if (u) st.t = target2D(u);
      if (u && u.set2D) {
        st.sel = Math.min(st.sel || 0, u.floors - 1);
        u.set2D(true, st.sel);
      }
      st.sync();
    });
    addButton('3D', 'Tampilan 3D', () => {
      to3D();
      const u = st.g && st.g.userData;
      if (u) {
        st.az = u.az;
        st.el_ = u.el;
        st.sw = 0.22;
      }
    });
    el.appendChild(tools);

    if (!document.getElementById('sim-edit-css')) {
      const cs = document.createElement('style');
      cs.id = 'sim-edit-css';
      cs.textContent =
        '.sim-edit{padding:10px 12px;border-top:1px solid var(--bd);background:var(--card);color:var(--tx);font-size:.78rem;display:flex;flex-direction:column;gap:9px;text-align:left}' +
        '.sim-edit .se-r{display:flex;flex-wrap:wrap;gap:6px;align-items:center}' +
        '.sim-edit button{border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:99px;padding:4px 11px;font:inherit;font-weight:600;cursor:pointer;min-height:28px;line-height:1.2}' +
        '.sim-edit button:hover{border-color:var(--ac)}.sim-edit .se-x{color:#D93B3B}' +
        '.sim-edit label{display:flex;align-items:center;gap:6px}.sim-edit input[type=range]{width:110px}' +
        '.sim-edit .se-t{border:1px solid var(--bd);border-radius:8px;padding:4px 8px;font:inherit;background:var(--card);color:var(--tx);min-width:150px}' +
        '.sim-edit .se-sw{width:22px;height:22px;min-height:0;padding:0;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px var(--bd)}' +
        '.sim-edit .se-sw.on{box-shadow:0 0 0 2px var(--ac)}' +
        '.sim-edit .se-p{padding:8px 10px;border:1px dashed var(--ac);border-radius:12px}' +
        '.sim-edit .se-add{display:contents}' +
        '@media (max-width:700px){' +
        '.sim-edit{padding:8px;gap:7px;font-size:.64rem}' +
        '.sim-edit .se-r{gap:4px}' +
        '.sim-edit .se-top{flex-direction:column;align-items:stretch;gap:5px}' +
        '.sim-edit .se-add{display:flex;flex-wrap:wrap;gap:3px}' +
        '.sim-edit button{padding:2px 7px;min-height:22px;font-size:.6rem;white-space:nowrap}' +
        '.sim-edit .se-p{padding:6px 7px;border-radius:10px}' +
        '.sim-edit label{width:100%;justify-content:space-between;gap:4px}' +
        '.sim-edit input[type=range]{width:auto;flex:1;min-width:0}' +
        '.sim-edit .se-t{min-width:0;width:100%;box-sizing:border-box}' +
        '.sim-edit .se-sw{width:18px;height:18px;min-height:0;padding:0}' +
        '}';
      document.head.appendChild(cs);
    }

    const panel = document.createElement('div');
    panel.className = 'sim-edit';
    panel.style.display = 'none';
    el.appendChild(panel);
 
    const mq = window.matchMedia ? window.matchMedia('(max-width:700px)') : null;
    const placePanel = () => {
      if (!el.isConnected) return;
      const slot = el.parentNode && el.parentNode.querySelector('#simo');
      if (mq && mq.matches && slot) slot.appendChild(panel); else el.appendChild(panel);
    };
    placePanel();
    if (mq) (mq.addEventListener ? mq.addEventListener('change', placePanel) : mq.addListener(placePanel));

    const escapeHtml = s =>
      String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const SWATCHES = ['#FFFFFF', '#E8DFD0', '#C9A877', '#9C8670', '#8C9AA8', '#6B7F6B', '#3E5C8A', '#2B2F36', '#D9822B'];

    let highlight = null;
    let changeTimer = 0;
    let lastSig = null;

    const findSelected = () => {
      const inn = currentPlan();
      return inn && ED.sel ? inn.userData.P.items.find(o => o.id == ED.sel) : null;
    };

    const changed = noPlanEdit => {
      clearTimeout(changeTimer);
      changeTimer = setTimeout(() => {
        const u = st.g && st.g.userData;
        if (noPlanEdit !== true) st.s.pe = 1;
        if (u && u.afterEdit) u.afterEdit(st.m2);
        if (st.cb) st.cb('plan');
      }, 120);
    };

    function clampItem(it, inn) {
      const u = inn.userData;
      const r = (it.rot * Math.PI) / 180;
      const cs = Math.abs(Math.cos(r));
      const sn = Math.abs(Math.sin(r));
      const hw = Math.min((cs * it.w + sn * it.d) / 2, u.w / 2);
      const hd = Math.min((sn * it.w + cs * it.d) / 2, u.D / 2);
      it.x = clamp(it.x, -u.w / 2 + hw, u.w / 2 - hw);
      it.z = clamp(it.z, -u.D / 2 + hd, u.D / 2 - hd);
    }

    function drawHighlight() {
      if (highlight && highlight.parent) highlight.parent.remove(highlight);
      highlight = null;

      const it = findSelected();
      const inn = currentPlan();
      if (!it || !inn) {
        if (ED.sel && !it) ED.sel = null;
        return;
      }

      const w = it.w + 0.14;
      const d = Math.max(it.d, it.t == 'wall' ? 0.3 : 0) + 0.14;
      const blue = toLinear('#1273EA');

      highlight = new T.Group();
      const plane = new T.Mesh(
        new T.PlaneGeometry(w, d),
        new T.MeshBasicMaterial({ color: blue, transparent: true, opacity: 0.2, depthTest: false, toneMapped: false })
      );
      plane.rotation.x = -Math.PI / 2;
      plane.renderOrder = 9;
      highlight.add(plane);

      const line = new T.LineLoop(
        new T.BufferGeometry().setFromPoints([V(-w / 2, 0, -d / 2), V(w / 2, 0, -d / 2), V(w / 2, 0, d / 2), V(-w / 2, 0, d / 2)]),
        new T.LineBasicMaterial({ color: blue, depthTest: false, toneMapped: false })
      );
      line.renderOrder = 9;
      highlight.add(line);

      highlight.position.set(it.x, 0.06, it.z);
      highlight.rotation.y = (it.rot * Math.PI) / 180;
      inn.add(highlight);
    }

    const panelSignature = () => {
      const inn = currentPlan();
      return inn ? inn.userData.i + '|' + ED.sel + '|' + inn.userData.P.items.length : '';
    };

    function refreshPanel(force) {
      const inn = currentPlan();
      panel.style.display = inn ? '' : 'none';
      if (!inn) {
        lastSig = null;
        return;
      }
      const sig = panelSignature();
      if (!force && sig === lastSig) return;
      lastSig = sig;

      const it = findSelected();
      const c = it && CAT[it.t];
      const GRP = [
        ['Struktur', ['wall', 'door', 'window', 'stairs']],
        ['Ruang tamu', ['sofa', 'armchair', 'coffee', 'tv', 'bookcase', 'rug']],
        ['Kamar tidur', ['bed', 'nakas', 'wardrobe', 'dresser']],
        ['Dapur & makan', ['kitchen', 'island', 'stove', 'fridge', 'table', 'round', 'chair', 'stool']],
        ['Kamar mandi', ['toilet', 'sink', 'shower', 'bathtub']],
        ['Dekor & kerja', ['desk', 'lamp', 'plant', 'label']]
      ];
      const seenK = {};
      GRP.forEach(g => g[1].forEach(k => { seenK[k] = 1; }));
      const extraK = KINDS.filter(k => !seenK[k]);
      const addButtons = GRP.concat(extraK.length ? [['Lainnya', extraK]] : []).map(g =>
        '<span class="se-grp"><em>' + g[0] + '</em>' +
        g[1].filter(k => CAT[k]).map(k => '<button type="button" data-add="' + k + '">+ ' + CAT[k].n + '</button>').join('') +
        '</span>'
      ).join('');

      let props = '';
      if (it) {
        const range = (p, lab, mn, mx, step, v, unit) =>
          '<label>' + lab + ' <input type="range" data-p="' + p + '" min="' + mn + '" max="' + mx + '" step="' + step + '" value="' + v + '">' +
          '<b data-v="' + p + '">' + fmt(v) + unit + '</b></label>';

        props =
          '<div class="se-r se-p"><b>' + c.n + '</b>' +
          (it.t == 'label'
            ? '<input class="se-t" data-p="text" maxlength="24" aria-label="Teks label" value="' + escapeHtml(it.text || '') + '">'
            : range('w', it.t == 'wall' ? 'Panjang' : 'Lebar', c.min || 0.3, c.max || 6, 0.1, it.w, ' m') +
              (c.nd ? '' : range('d', 'Kedalaman', 0.3, 4, 0.1, it.d, ' m')) +
              (it.t == 'wall' ? '' : range('rot', 'Sudut', 0, 345, 15, it.rot, '°')) +
              '<span class="se-r">' +
              SWATCHES.map(k =>
                '<button type="button" class="se-sw' + (k.toLowerCase() == String(it.c).toLowerCase() ? ' on' : '') +
                '" data-c="' + k + '" style="background:' + k + '" aria-label="Warna ' + k + '"></button>'
              ).join('') +
              '</span>') +
          '<button type="button" data-act="rot">⟳ Putar 90°</button>' +
          '<button type="button" data-act="dup">Duplikat</button>' +
          '<button type="button" class="se-x" data-act="del">Hapus</button></div>';
      }

      panel.innerHTML =
        '<div class="se-r se-top"><b>Tambah objek</b><span class="se-add">' + addButtons + '</span></div>' +
        props +
        '<div class="se-r"><button type="button" data-act="reset">Reset denah lantai ini</button></div>';
    }

    function selectItem(id) {
      ED.sel = id;
      drawHighlight();
      refreshPanel();
    }

    const rebuildItem = it => {
      const inn = currentPlan();
      if (!inn) return;
      inn.userData.drop(it);
      inn.userData.add(it);
      clampItem(it, inn);
      inn.userData.sync(it);
      drawHighlight();
    };

    const addItem = (kind, overrides) => {
      const inn = currentPlan();
      if (!inn) return;
      const c = CAT[kind];
      const n = ED.n++ % 5;
      const it = Object.assign(
        { id: uid(), t: kind, x: snap(-0.8 + n * 0.4), z: snap(-0.6 + n * 0.4), rot: 0, w: c.w, d: c.d, c: c.c },
        kind == 'label' ? { text: 'Label' } : {},
        overrides || {}
      );
      clampItem(it, inn);
      inn.userData.P.items.push(it);
      inn.userData.add(it);
      selectItem(it.id);
      changed();
    };

    const deleteItem = () => {
      const it = findSelected();
      const inn = currentPlan();
      if (!it) return;
      const P = inn.userData.P;
      P.items = P.items.filter(o => o !== it);
      inn.userData.drop(it);
      selectItem(null);
      changed();
    };

    const rotateItem = () => {
      const it = findSelected();
      const inn = currentPlan();
      if (!it || it.t == 'label') return;
      it.rot = (it.rot + 90) % 360;
      clampItem(it, inn);
      inn.userData.sync(it);
      drawHighlight();
      refreshPanel(true);
      changed();
    };

    panel.onclick = e => {
      const b = e.target.closest('button');
      if (!b) return;
      const it = findSelected();

      if (b.dataset.add) return addItem(b.dataset.add);
      if (b.dataset.c && it) {
        it.c = b.dataset.c;
        rebuildItem(it);
        refreshPanel(true);
        return changed();
      }

      const act = b.dataset.act;
      if (act == 'rot') rotateItem();
      else if (act == 'del') deleteItem();
      else if (act == 'dup' && it) {
        addItem(it.t, { x: snap(it.x + 0.4), z: snap(it.z + 0.4), rot: it.rot, w: it.w, d: it.d, c: it.c, text: it.text });
      } else if (act == 'reset') {
        const u = st.g.userData.edit;
        const i = Math.min(st.sel || 0, u.floors.length - 1);
        if (st.s.plan) delete st.s.plan[i];
        st.s.pe = 0;
        ED.sel = null;
        build(st);
        changed(true);
      }
    };

    panel.oninput = e => {
      const t = e.target;
      const p = t.dataset.p;
      const it = findSelected();
      if (!p || !it) return;

      if (p == 'text') {
        it.text = t.value;
      } else {
        it[p] = +t.value;
        const v = panel.querySelector('[data-v="' + p + '"]');
        if (v) v.textContent = fmt(it[p]) + (p == 'rot' ? '°' : ' m');
      }
      rebuildItem(it);
      changed();
    };

    document.addEventListener('keydown', function onKey(e) {
      if (!el.isConnected) {
        document.removeEventListener('keydown', onKey);
        return;
      }
      if (!ED.sel || !currentPlan() || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
      if (e.key == 'Delete') {
        deleteItem();
        e.preventDefault();
      } else if (e.key == 'r' || e.key == 'R') {
        rotateItem();
      }
    });

    const loop = () => {
      if (!el.isConnected) {
        renderer.dispose();
        return;
      }
      requestAnimationFrame(loop);

      const cw = el.clientWidth || 400;
      if (cw != st.w) {
        st.w = cw;
        renderer.setSize(cw, Math.round(cw * 0.65), false);
      }

      const a = st.az + Math.sin((performance.now() / 1000) * 0.5) * st.sw;
      const e = st.el_;
      const d = st.d;
      const t = st.t;
      st.cam.position.set(
        t[0] + d * Math.sin(a) * Math.cos(e),
        t[1] + d * Math.sin(e),
        t[2] + d * Math.cos(a) * Math.cos(e)
      );
      st.cam.lookAt(t[0], t[1], t[2]);
      renderer.render(st.sc, st.cam);
    };
    loop();

    return st;
  }

  window.SIM3D = {
    summary(s) {
      const P = s && s.plan;
      const rows = [];
      if (!P) return rows;

      const single = s.floors === undefined;
      if (single && !s.pe) return rows;
      const nf = parseInt(s.floors) || 1;

      Object.keys(P).sort().forEach(i => {
        if (+i >= nf) return;
        const count = {};
        P[i].items.forEach(o => {
          if (o.t != 'wall' && o.t != 'label') count[o.t] = (count[o.t] || 0) + 1;
        });
        const txt = Object.keys(count).map(k => CAT[k].n + ' ×' + count[k]).join(', ');
        if (txt) rows.push([single ? 'Isi denah' : 'Denah Lt ' + (+i + 1), txt]);
      });
      return rows;
    },

    show(kind, s, el, C, cb) {
      try {
        let st = el._s;
        if (!st || !el.contains(st.r.domElement)) st = el._s = mount(el);

        st.k0 = kind;
        st.s = s;
        st.C = C;
        st.cb = cb;

        const first = st.k != kind;
        if (first) st.m2 = false;

        const u = build(st);
        st.sc.background = kind == 'facade' ? getSky() : new T.Color('#DCE3EC');
        st.sc.fog = kind == 'facade' ? new T.Fog(toLinear('#dcebf7'), 80, 170) : null;

        if (first) {
          st.k = kind;
          st.az = u.az;
          st.el_ = u.el;
          st.sw = 0.22;
        }
        st.t = st.m2 ? u.t2 || [u.t[0], u.t[1], 0] : u.t;
        st.d = u.d;
        st.rp.style.display = u.anim ? '' : 'none';

        const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (u.anim && first && window.gsap && !calm) st.tl = u.anim();
        return true;
      } catch (e) {
        return false;
      }
    },

    replay(el) {
      const st = el._s;
      const u = st && st.g && st.g.userData;
      if (!u || !u.anim || !window.gsap) return;
      if (st.tl) st.tl.kill();
      st.az = u.az;
      st.el_ = u.el;
      st.sw = 0.22;
      st.tl = u.anim();
    }
  };
})();