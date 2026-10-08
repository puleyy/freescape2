(function () {
  const T = window.THREE;
  if (!T) return;
  const dk = (c, t) => new T.Color(c).multiplyScalar(1 - (t == null ? .25 : t));
  const M = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .8, metalness: 0 }, o));
  const bx = (g, w, h, d, c, x, y, z, o) => {
    const m = new T.Mesh(new T.BoxGeometry(w, h, d), M(c, o));
    m.position.set(x, y + h / 2, z); m.castShadow = m.receiveShadow = true; g.add(m); return m;
  };
  const cy = (g, rt, rb, h, c, x, y, z, o) => {
    const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, 20), M(c, o));
    m.position.set(x, y + h / 2, z); m.castShadow = true; g.add(m); return m;
  };
  const ball = (g, r, c, x, y, z) => {
    const m = new T.Mesh(new T.SphereGeometry(r, 16, 12), M(c)); m.position.set(x, y, z); m.castShadow = true; g.add(m);
  };
  const sun = (g, i, x, y, z) => {
    const d = new T.DirectionalLight(0xffffff, i); d.position.set(x, y, z); d.castShadow = true;
    d.shadow.mapSize.set(1024, 1024); d.shadow.bias = -.0006; d.shadow.normalBias = .03;
    const c = d.shadow.camera; c.left = c.bottom = -22; c.right = c.top = 22; c.far = 80;
    g.add(d);
  };

  function interior(g, s, C) {
    const p = C.IP[s.style], l = C.IL[s.light], area = +s.area, r = s.room;
    const W = Math.sqrt(area * 1.3), D = area / W, ind = s.style == 'Industrial';
    g.add(new T.HemisphereLight(0xffffff, 0x556070, .9 - l.glow * .7));
    sun(g, .25, W, 6, D);
    const pl = new T.PointLight(l.gc, .6 + l.glow * 1.2, 14); pl.position.set(0, 2.5, 0); g.add(pl);
    bx(g, W, .1, D, p.floor, 0, -.1, 0, { roughness: .5 });
    bx(g, W, 2.8, .12, p.wall, 0, 0, -D / 2 - .06);
    bx(g, .12, 2.8, D, p.wall, -W / 2 - .06, 0, 0);
    bx(g, W, .1, .03, dk(p.wall, .2), 0, 0, -D / 2 + .015);
    const ww = Math.min(2.2, W * .35), wx = W * .22, fr = ind ? '#14161A' : p.acc;
    const win = new T.Mesh(new T.PlaneGeometry(ww, 1.4), new T.MeshBasicMaterial({ color: l.win }));
    win.position.set(wx, 1.6, -D / 2 + .012); g.add(win);
    [[ww + .1, .06, 0, 2.3], [ww + .1, .06, 0, .84], [.06, 1.52, -ww / 2, .84], [.06, 1.52, ww / 2, .84], [.04, 1.4, 0, .9], [ww, .04, 0, 1.58]]
      .forEach(a => bx(g, a[0], a[1], a[2] == 0 && a[0] == .06 ? .04 : .04, fr, wx + a[2], a[3], -D / 2 + .02));
    if (s.style == 'Japandi Zen') [-1, 1].forEach(k => bx(g, .35, 2.5, .08, p.soft, wx + k * (ww / 2 + .25), .2, -D / 2 + .08));
    let lx, lz;
    if (r == 'Living Room') {
      const sx = -W * .12, sz = -D / 2 + .6;
      bx(g, W * .6 > 3 ? 3 : 2.4, .1, 1.9, p.soft, sx, 0, sz + 1.3);
      bx(g, 2.2, .42, .9, p.fur, sx, .08, sz); bx(g, 2.2, .5, .2, dk(p.fur, .12), sx, .4, sz - .38);
      [-1, 1].forEach(k => bx(g, .2, .3, .9, dk(p.fur, .15), sx + k * 1.1, .4, sz));
      bx(g, .45, .35, .15, p.acc, sx - .6, .5, sz - .1); bx(g, .45, .35, .15, p.acc, sx + .6, .5, sz - .1);
      bx(g, 1.1, .05, .6, dk(p.floor, .3), sx, .38, sz + 1.2);
      [[-.5, -.25], [.5, -.25], [-.5, .25], [.5, .25]].forEach(a => bx(g, .05, .38, .05, '#222', sx + a[0], 0, sz + 1.2 + a[1]));
      bx(g, .4, 1.3, Math.min(2, D * .5), p.fur, -W / 2 + .2, 0, 0);
      lx = sx + 1.55; lz = sz - .1;
    } else {
      const kos = r == 'Kamar Kos', ms = r == 'Master Suite', bw = kos ? 1.2 : ms ? 2.0 : 1.6, bxp = -W * .1, bz = -D / 2 + 1.05;
      bx(g, bw + 1, .02, 1.6, p.soft, bxp, 0, bz + 1.6);
      bx(g, bw, .35, 2, p.fur, bxp, 0, bz); bx(g, bw - .08, .2, 1.92, '#F4F2EE', bxp, .35, bz);
      bx(g, bw + .2, 1.1, .1, p.acc, bxp, 0, -D / 2 + .08);
      bx(g, bw - .04, .24, 1.15, p.acc, bxp, .45, bz + .4);
      (kos ? [0] : [-1, 1]).forEach(k => bx(g, bw / 2 - .1, .14, .4, '#fff', bxp + k * bw * .25, .55, bz - .7));
      [-1, 1].forEach(k => { if (!(kos && k > 0)) bx(g, .45, .5, .4, p.fur, bxp + k * (bw / 2 + .35), 0, -D / 2 + .3); });
      if (ms || kos) bx(g, .6, 2.2, Math.min(1.8, D * .45), p.fur, -W / 2 + .3, 0, D * .15);
      if (kos) { bx(g, 1.2, .04, .55, dk(p.fur, .1), W * .22, .72, -D / 2 + .3); [-1, 1].forEach(k => bx(g, .04, .72, .5, '#222', W * .22 + k * .55, 0, -D / 2 + .3)); bx(g, .4, .25, .03, '#2b2f36', W * .22, .78, -D / 2 + .25); }
      lx = bxp - bw / 2 - .75; lz = -D / 2 + .35;
    }
    cy(g, .015, .015, 1.5, dk(p.fur, .3), lx, 0, lz); cy(g, .18, .28, .3, l.gc, lx, 1.4, lz, { emissive: new T.Color(l.gc), emissiveIntensity: .6 * (.3 + l.glow) });
    const lp = new T.PointLight(l.gc, .5 + l.glow, 6); lp.position.set(lx, 1.5, lz); g.add(lp);
    cy(g, .2, .15, .35, dk(p.fur, .1), W / 2 - .45, 0, -D / 2 + .45); ball(g, .38, '#3E8A4F', W / 2 - .45, .85, -D / 2 + .45); ball(g, .26, '#4FA362', W / 2 - .6, 1.1, -D / 2 + .5);
    g.userData = { t: [0, 1, 0], d: Math.max(W, D) * 1.15 + 4, az: .55, el: .5 };
  }

  function kitchen(g, s, C) {
    const c = C.KC[s.cab], t = C.KT[s.top], len = +s.len, lay = s.layout;
    let Lb = len, Ls = 0, Li = 0;
    if (lay == 'L-Shape') { Lb = len * .6; Ls = Math.max(.6, len * .4); }
    else if (lay == 'U-Shape') { Lb = Math.max(1.8, len * .4); Ls = Math.max(.6, (len - Lb) / 2); }
    else if (lay == 'Island') { Lb = len * .65; Li = Math.max(.8, len * .35); }
    Lb = Math.max(1.2, Lb);
    const fw = lay == 'U-Shape' ? Lb : Lb + .9, fd = lay == 'Island' ? 4.4 : 3.6;
    g.add(new T.HemisphereLight(0xffffff, 0x667788, .85)); sun(g, .45, fw, 7, fd);
    const pl = new T.PointLight(0xfff0d8, .5, 14); pl.position.set(fw / 2, 2.4, 2); g.add(pl);
    bx(g, fw, .1, fd, '#B9B4AA', fw / 2, -.1, fd / 2, { roughness: .5 });
    bx(g, fw, 2.7, .12, '#ECE9E3', fw / 2, 0, -.06); bx(g, .12, 2.7, fd, '#E3E0DA', -.06, 0, fd / 2);
    bx(g, Lb, .5, .02, '#D8D5CE', Lb / 2, .9, .01);
    const run = (L, up, x, z, ry) => {
      const r = new T.Group(); r.position.set(x, 0, z); r.rotation.y = ry; g.add(r);
      const n = Math.max(1, Math.round(L / .6)), px = i => -L / 2 + (i + .5) * L / n;
      bx(r, L - .02, .1, .5, '#222', 0, 0, -.02);
      bx(r, L, .75, .6, c, 0, .1, 0, { roughness: .35 });
      bx(r, L + .02, .04, .64, t, 0, .85, .02, { roughness: .3 });
      for (let i = 0; i < n; i++) {
        if (i) bx(r, .012, .7, .01, '#1c1c1c', -L / 2 + i * L / n, .12, .305);
        bx(r, .14, .02, .02, '#B8BCC2', px(i), .75, .32, { metalness: .8, roughness: .3 });
      }
      if (up) {
        bx(r, L, .7, .35, c, 0, 1.55, -.125, { roughness: .35 });
        for (let i = 0; i < n; i++) {
          if (i) bx(r, .012, .66, .01, '#1c1c1c', -L / 2 + i * L / n, 1.57, .055);
          bx(r, .14, .02, .02, '#B8BCC2', px(i), 1.6, .07, { metalness: .8, roughness: .3 });
        }
      }
    };
    run(Lb, 1, Lb / 2, .3, 0);
    if (Ls && lay != 'Island') run(Ls, 1, .3, .6 + Ls / 2, Math.PI / 2);
    if (lay == 'U-Shape') run(Ls, 1, Lb - .3, .6 + Ls / 2, -Math.PI / 2);
    if (lay == 'Island') run(Li, 0, Lb / 2, 2.2, Math.PI);
    g.userData = { t: [fw / 2, 1, 1.8], d: Math.max(fw, fd) * 1.05 + 1.5, az: .5, el: .45 };
  }

  function facade(g, s, C) {
    const w = +s.w, fl = parseInt(s.floors), D = 9, fh = 3.2, H = fl * fh, st = s.style;
    const W = C.FW[s.wall], acc = C.FA[s.acc], roofC = C.FROOF[st], pw = w * .26;
    const glass = st == 'Minimalis Modern' ? '#5E7C9A' : '#A9CBE8';
    const frame = st == 'Industrial' ? '#14161A' : st == 'Klasik Modern' ? '#FFFFFF' : st == 'Tropis' ? '#7A5230' : '#2B2F36';
    g.add(new T.HemisphereLight(0xdcecff, 0x6f7a68, .75)); sun(g, .95, 14, 22, 16);
    bx(g, 60, .1, 50, '#7E8B78', 0, -.1, 4); bx(g, 5, .02, 18, '#6C6F72', 0, 0, D / 2 + 9);
    bx(g, w + 1.2, .12, 3.6, '#BDBBB3', 0, 0, D / 2 + 1.8);
    for (let i = 0; i < fl; i++) {
      const set = st == 'Minimalis Modern' && i > 0, ww = set ? w * .92 : w;
      bx(g, ww, fh, D, W, set ? w * .04 : 0, i * fh, 0);
      if (i) bx(g, w + .2, .16, D + .2, dk(W, .2), 0, i * fh - .08, 0);
    }
    bx(g, pw, H, .25, acc, -w / 2 + pw / 2, 0, D / 2 + .12, { roughness: .9 });
    const x0 = -w / 2 + pw + .6, x1 = w / 2 - .6, n = w > 12 ? 3 : 2, gap = .5, ww = (x1 - x0 - gap * (n - 1)) / n;
    for (let i = 0; i < fl; i++) for (let j = 0; j < n; j++) {
      const cx = x0 + j * (ww + gap) + ww / 2;
      if (!i && !j) {
        const dw = Math.min(ww, 1.2);
        bx(g, dw, 2.3, .12, dk(acc, .3), cx, 0, D / 2 + .06);
        if (st == 'Industrial') bx(g, dw + .6, .12, 1, '#14161A', cx, 2.5, D / 2 + .5);
        if (st == 'Klasik Modern') [-1, 1].forEach(k => cy(g, .12, .12, 2.7, '#fff', cx + k * (dw / 2 + .45), 0, D / 2 + .7));
        continue;
      }
      bx(g, ww + .2, 1.75, .08, frame, cx, i * fh + .9, D / 2 + .04);
      bx(g, ww, 1.55, .12, glass, cx, i * fh + 1, D / 2 + .06, { roughness: .1, metalness: .4 });
    }
    if (st == 'Tropis' && fl > 1) bx(g, w + 1.2, .15, 1.6, roofC, 0, fh - .12, D / 2 + .7);
    const rf = s.roof;
    if (rf == 'Dak Datar') { bx(g, w + .6, .3, D + .6, dk(W, .45), 0, H, 0); bx(g, w + .6, .12, D + .6, dk(W, .6), 0, H + .3, 0); }
    else if (rf == 'Pelana') {
      const sh = new T.Shape(); sh.moveTo(-D / 2 - .7, 0); sh.lineTo(D / 2 + .7, 0); sh.lineTo(0, 2.6); sh.lineTo(-D / 2 - .7, 0);
      const m = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: w + .9, bevelEnabled: false }), M(roofC, { roughness: .6 }));
      m.rotation.y = Math.PI / 2; m.position.set(-(w + .9) / 2, H, 0); m.castShadow = true; g.add(m);
    } else {
      const ge = new T.ConeGeometry(1, 2.4, 4); ge.rotateY(Math.PI / 4);
      const m = new T.Mesh(ge, M(roofC, { roughness: .6 })); m.scale.set((w + .9) / 1.414, 1, (D + .9) / 1.414);
      m.position.y = H + 1.2; m.castShadow = true; g.add(m);
      bx(g, w + .9, .2, D + .9, dk(roofC, .3), 0, H - .05, 0);
    }
    [-1, 1].forEach(k => { const x = k * (w / 2 + 4.5), z = D / 2 - 1; cy(g, .15, .2, 1.6, '#6B4A32', x, 0, z); ball(g, 1.3, '#3E8A4F', x, 2.4, z); ball(g, .9, '#4FA362', x + .4, 3.3, z); });
    [-.28, 0, .28].forEach(k => ball(g, .45, '#5E9B62', k * w, .3, D / 2 + 3.3));
    g.userData = { t: [0, H / 2, 0], d: Math.max(w, H) * 1.55 + 10, az: .6, el: .28 };
  }

  const B = { interior, kitchen, facade };

  function mount(el) {
    const r = new T.WebGLRenderer({ antialias: true });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
    const st = { el, r, sc: new T.Scene(), cam: new T.PerspectiveCamera(36, 1 / .65, .1, 200), az: 0, el_: .4, d: 10, t: [0, 1, 0], sw: .22, w: 0 };
    const cv = r.domElement; cv.style.cssText = 'width:100%;height:auto;display:block;touch-action:pan-y;cursor:grab;border-radius:inherit';
    let dn = null;
    cv.onpointerdown = e => { dn = { x: e.clientX, y: e.clientY, a: st.az, e: st.el_ }; st.sw = 0; try { cv.setPointerCapture(e.pointerId); } catch (x) {} };
    cv.onpointermove = e => { if (!dn) return; st.az = dn.a - (e.clientX - dn.x) * .008; st.el_ = Math.max(.08, Math.min(1.25, dn.e + (e.clientY - dn.y) * .006)); };
    cv.onpointerup = cv.onpointercancel = () => { dn = null; };
    el.innerHTML = ''; el.appendChild(cv);
    const loop = () => {
      if (!el.isConnected) { r.dispose(); return; }
      requestAnimationFrame(loop);
      const cw = el.clientWidth || 400;
      if (cw != st.w) { st.w = cw; r.setSize(cw, Math.round(cw * .65), false); }
      const a = st.az + Math.sin(performance.now() / 1000 * .5) * st.sw, e = st.el_, d = st.d, t = st.t;
      st.cam.position.set(t[0] + d * Math.sin(a) * Math.cos(e), t[1] + d * Math.sin(e), t[2] + d * Math.cos(a) * Math.cos(e));
      st.cam.lookAt(t[0], t[1], t[2]);
      r.render(st.sc, st.cam);
    };
    loop();
    return st;
  }

  window.SIM3D = {
    show(k, s, el, C) {
      try {
        let st = el._s;
        if (!st || !el.contains(st.r.domElement)) st = el._s = mount(el);
        if (st.g) { st.sc.remove(st.g); st.g.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
        const g = new T.Group(); B[k](g, s, C); st.sc.add(g); st.g = g;
        const u = g.userData;
        st.sc.background = new T.Color(k == 'facade' ? '#cfe3f5' : '#1b2331');
        if (st.k != k) { st.k = k; st.az = u.az; st.el_ = u.el; st.sw = .22; }
        st.t = u.t; st.d = u.d;
        return true;
      } catch (e) { return false; }
    }
  };
})();
