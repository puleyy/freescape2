(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var onHome = /^#?\/?$/.test(location.hash);
  var seen = false;
  try { seen = sessionStorage.getItem('fs-intro') === '1'; } catch (e) {}
  if (reduce || !onHome || seen || !window.gsap) { root.classList.remove('intro-on'); return; }

  var DX = 440, DW = 120, DT = 350, DB = 540;  
  var CX = 500, CY = 445, CAM = 520;            

  function P(u, v, th) {
    var x = DX + u * Math.cos(th), z = u * Math.sin(th); 
    var s = CAM / (CAM - z);
    return (CX + (x - CX) * s).toFixed(1) + ' ' + (CY + (v - CY) * s).toFixed(1);
  }
  function quad(a, b, c, d, th) {
    return 'M' + P(a, b, th) + 'L' + P(c, b, th) + 'L' + P(c, d, th) + 'L' + P(a, d, th) + 'Z';
  }
  function leafOutline(th) { return quad(0, DT, DW, DB, th); }
  function leafDetail(th) {
    return quad(14, DT + 14, 92, DT + 90, th) +        
           quad(14, DT + 104, 92, DB - 14, th) +       
           'M' + P(104, 448, th) + 'L' + P(104, 470, th);
  }

  var el = document.createElement('div');
  el.id = 'intro';
  el.innerHTML =
    '<div class="panel p1"></div><div class="panel p2"></div><div class="panel p3"></div>' +
    '<svg class="house" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<defs><radialGradient id="fsGlow" cx="50%" cy="55%" r="70%">' +
        '<stop offset="0" stop-color="#d6e8ff"/><stop offset=".55" stop-color="#6fa3dc"/><stop offset="1" stop-color="#1557A6"/>' +
      '</radialGradient></defs>' +
      '<g id="hg">' +
        '<path class="in" d="M440 350H560V540H440Z"/>' +
        '<path class="room" d="M440 350L478 410M560 350L522 410M440 540L478 480M560 540L522 480M478 410H522V480H478Z"/>' +
        '<path d="M30 540H970"/>' +
        '<path class="scaf" d="M40 540V330M100 540V330M40 330H100M40 400H100M40 470H100M40 400L100 330M40 470L100 400"/>' +
        '<path d="M170 540V260M830 540V260"/>' +
        '<path d="M110 275L500 70L890 275"/>' +
        '<path d="M690 170V90H745V199"/>' +
        '<path d="M440 540V350H560V540"/>' +                    
        '<path class="leaf" d="' + leafOutline(0) + '"/>' +        
        '<path class="leafd" d="' + leafDetail(0) + '"/>' +        
        '<path d="M230 340H370V450H230ZM300 340V450M230 395H370"/>' +
        '<path d="M630 340H770V450H630ZM700 340V450M630 395H770"/>' +
        '<path class="crane" d="M925 540V110M830 110H985M985 110V124M860 110V200M850 200H870V222H850Z"/>' +
        '<path class="dim" d="M170 572H830M170 564V580M830 564V580"/>' +
      '</g></svg>';
  document.body.appendChild(el);

  var panels = el.querySelectorAll('.panel');
  var svg = el.querySelector('svg');
  var paths = el.querySelectorAll('.house path:not(.in):not(.room)');
  var leaf = el.querySelector('.leaf');
  var leafd = el.querySelector('.leafd');
  var inner = el.querySelector('.in');
  var room = el.querySelector('.room');
  var finished = false;

  var sc = svg.getScreenCTM() ? svg.getScreenCTM().a : 1;
  paths.forEach(function (p) {
    var len = p.getTotalLength() * sc;
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
  });

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); boost(); }
  }
  function finish() {
    if (finished) return; finished = true;
    try { sessionStorage.setItem('fs-intro', '1'); } catch (e) {}
    document.removeEventListener('keydown', onKey);
    root.classList.remove('intro-on');
    el.remove();
    scrollTo(0, 0);
  }

  gsap.set([inner, room], { opacity: 0 });
  gsap.set(el, { force3D: true });

  var swing = { a: 0 };
  function setSwing() {
    var th = swing.a * Math.PI / 180;
    leaf.setAttribute('d', leafOutline(th));
    leafd.setAttribute('d', leafDetail(th));
  }

  gsap.ticker.lagSmoothing(1000, 16); 

  var tl = gsap.timeline({ onComplete: finish, defaults: { ease: 'power2.out' } });

  tl.to(panels, { scaleX: 1, duration: 1, stagger: { each: .1, from: 'end' }, ease: 'expo.inOut' }, 0)
    .to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: .13, ease: 'sine.inOut' }, .5)
    .to(leaf, { fillOpacity: 1, duration: .6, ease: 'sine.out' }, 2.7)
    .set(paths, { strokeDasharray: 'none' }, 3.5)
    .to(inner, { opacity: 1, duration: .5, ease: 'sine.out' }, 3.2)
    .to(room, { opacity: 1, strokeOpacity: .75, duration: 1.2, ease: 'sine.out' }, 3.4)
    .to(swing, { a: 100, duration: 1.8, ease: 'power3.inOut', onUpdate: setSwing }, 3.4)
    .to('#hg', { scale: 20, svgOrigin: CX + ' ' + CY, duration: 2.1, ease: 'power2.inOut' }, 4.7)
    .call(function () { root.classList.remove('intro-on'); }, null, 6.3)
    .to(el, { opacity: 0, duration: 1, ease: 'sine.inOut' }, 6.3)
    .set(el, { pointerEvents: 'none' }, 6.6);

  var speed = 1;
  function boost() {
    speed = speed < 2 ? 3.5 : 7;
    gsap.to(tl, { timeScale: speed, duration: .35, ease: 'power2.out', overwrite: true });
  }
  el.addEventListener('pointerdown', boost);
  document.addEventListener('keydown', onKey);
})();
