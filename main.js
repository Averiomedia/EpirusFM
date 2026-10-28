/* ============================================================
   EPIRUS FM — main.js (Hell-Variante)
   Red particles, light theme interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Section-Title Word Reveals (CSS + IntersectionObserver) ── */
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-title').forEach(el => titleObserver.observe(el));

  /* ── Preloader ──────────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  const preBar    = document.getElementById('preBar');
  const prePct    = document.getElementById('prePct');
  const preLogo   = document.querySelector('.pre-logo');

  if (!preloader || !preBar || !prePct) {
    /* Seiten ohne Preloader (z. B. datenschutz.html): direkt initialisieren */
    initAnimations();
  } else {
    let progress = 0;
    gsap.to(preLogo, { clipPath:'inset(0 0% 0 0)', opacity:1, duration:.6, ease:'power3.out' });

    const ticker = setInterval(() => {
      progress += Math.random() * 20 + 10;
      if (progress >= 100) { progress = 100; clearInterval(ticker); hidePreloader(); }
      preBar.style.width = progress + '%';
      prePct.textContent  = Math.round(progress) + '%';
    }, 40);

    var hidePreloader = function () {
      gsap.to(preloader, {
        yPercent: -100, duration: .7, ease: 'power4.inOut',
        onComplete: () => { preloader.style.display = 'none'; initAnimations(); }
      });
    };
  }

  /* ── Custom Cursor ──────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorDot  = cursor?.querySelector('.cursor-dot');
  const cursorRing = cursor?.querySelector('.cursor-ring');

  if (cursor && window.innerWidth > 768) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorDot.style.left  = mx + 'px';
      cursorDot.style.top   = my + 'px';
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
    });
    document.querySelectorAll('a, button, .service-card, .why-point, .benefit-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Magnetic Buttons ───────────────────────────────────── */
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.28;
        const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.28;
        gsap.to(el, { x: dx, y: dy, duration: .35, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' });
      });
    });
  }

  /* ── Lenis Smooth Scroll ────────────────────────────────── */
  let lenis;
  function initLenis() {
    lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ── Nav ────────────────────────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
      start: 80,
      onEnter:     () => nav.classList.add('scrolled'),
      onLeaveBack: () => nav.classList.remove('scrolled')
    });
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const hrefVal = a.getAttribute('href');
        const target = (hrefVal && hrefVal.length > 1) ? document.querySelector(hrefVal) : null;
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      });
    });
  }

  /* ── Three.js Hero (Variante 2: ruhig — wenige Partikel am Rand, Mitte frei) ── */
  function initHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.z = 280;

    /* Particles — Rot + Blau, bewusst nur am Rand (Textmitte bleibt frei) */
    const COUNT     = 70;
    const positions = new Float32Array(COUNT * 3);
    const pts       = [];
    const colors    = new Float32Array(COUNT * 3);
    const cRed  = new THREE.Color(0xD4151A);
    const cBlue = new THREE.Color(0x2E7CD6);

    for (let i = 0; i < COUNT; i++) {
      const side = Math.random() < .5 ? -1 : 1;
      const x = side * (115 + Math.random() * 95);
      const y = (Math.random() - .5) * 220;
      const z = (Math.random() - .5) * 140;
      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
      const c = Math.random() < .55 ? cRed : cBlue;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 1.3, transparent: true, opacity: .38, sizeAttenuation: true, vertexColors: true
    });
    scene.add(new THREE.Points(geo, mat));

    /* Lines — sehr dezent */
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2E7CD6, transparent: true, opacity: .05
    });
    const linePos = [];
    const maxDist = 60;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          linePos.push(pts[i].x, pts[i].y, pts[i].z);
          linePos.push(pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    /* Accent orbs — weit außen, dezent (Rot + Blau) */
    const redOrb = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xD4151A, transparent: true, opacity: .28 })
    );
    redOrb.position.set(150, -60, 10);
    scene.add(redOrb);

    const dimOrb = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x2E7CD6, transparent: true, opacity: .28 })
    );
    dimOrb.position.set(-150, 70, -10);
    scene.add(dimOrb);

    /* Mouse parallax — sanft */
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
      targetX = (e.clientX / window.innerWidth  - .5) * .18;
      targetY = (e.clientY / window.innerHeight - .5) * -.12;
    });

    const mesh = scene.children[0];
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += .003;
      mesh.rotation.y += .0007;
      mesh.rotation.x += .0002;
      camera.position.x += (targetX * 12 - camera.position.x) * .02;
      camera.position.y += (targetY * 8 - camera.position.y) * .02;
      redOrb.position.y = -60 + Math.sin(t) * 5;
      dimOrb.position.y =  70 + Math.cos(t * .7) * 4;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  /* ── Counter Animation ──────────────────────────────────── */
  function initCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      if (!el.dataset.target) return;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '+';
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].val) + suffix; }
          });
        }
      });
    });
  }

  /* ── Sticky Split Scroll (Services) ────────────────────── */
  function initStickyScroll() {
    const section = document.querySelector('#services.ss-section');
    const cards   = document.querySelectorAll('.ss-card');
    const bar     = document.querySelector('.ss-progress-bar');
    const cur     = document.querySelector('.ss-counter-cur');
    if (!section || !cards.length) return;

    // Progress bar + counter driven by section scroll position
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        if (bar) bar.style.width = (self.progress * 100) + '%';
        if (cur) {
          const idx = Math.min(Math.ceil(self.progress * 5), 5);
          cur.textContent = (idx || 1).toString().padStart(2, '0');
        }
      }
    });

    // Card entrance animations
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true
        }
      });
    });
  }

  /* ── Parallax ───────────────────────────────────────────── */
  function initParallax() {
    gsap.utils.toArray('.parallax-el').forEach(el => {
      gsap.to(el, {
        y: '-12%', ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.parallax-wrap'),
          start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });
  }

  /* ── Scroll Animations ──────────────────────────────────── */
  function initScrollAnimations() {
    const ease = 'power3.out';

    /* Hero entrance */
    gsap.utils.toArray('.hero-title .line span').forEach((span, i) => {
      gsap.to(span, { y: 0, duration: 1.1, ease, delay: 1.8 + i * .14 });
    });
    gsap.to('.hero-tag',   { opacity: 1, y: 0, duration: .8, ease, delay: 1.5 });
    gsap.to('.hero-sub',   { opacity: 1, y: 0, duration: .8, ease, delay: 2.2 });
    gsap.to('.hero-ctas',  { opacity: 1, y: 0, duration: .8, ease, delay: 2.5 });
    gsap.to('#heroScroll', { opacity: 1,        duration: .8, ease, delay: 3.0 });

    /* Section tags */
    gsap.utils.toArray('.section-tag').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: .7, ease,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Dividers */
    gsap.utils.toArray('.divider').forEach(el => {
      gsap.to(el, { opacity: 1, scaleX: 1, duration: .8, ease,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Section subs */
    gsap.utils.toArray('.section-sub').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: .8, ease, delay: .15,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Word reveals — handled by CSS + IntersectionObserver (see top of file) */

    /* Stat items — Einflug von links */
    gsap.utils.toArray('.stat-item').forEach((el, i) => {
      gsap.to(el, { opacity: 1, x: 0, duration: .8, ease, delay: i * .1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* hs-panel content fade-in on mobile (desktop handled by horizontal scroll) */
    if (window.innerWidth <= 768) {
      gsap.utils.toArray('.hs-panel').forEach((el, i) => {
        gsap.from(el, { opacity: 0, y: 30, duration: .8, ease, delay: i * .08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
    }

    /* Why points */
    gsap.utils.toArray('.why-point').forEach((el, i) => {
      gsap.to(el, { opacity: 1, x: 0, duration: .8, ease, delay: i * .12,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Process steps */
    gsap.utils.toArray('.process-step').forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: .8, ease, delay: i * .13,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Testi cards */
    gsap.utils.toArray('.testi-card').forEach((el, i) => {
      gsap.to(el, { opacity: 1, x: 0, duration: .85, ease, delay: i * .1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* CTA boxes */
    gsap.utils.toArray('.cta-box').forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: .8, ease, delay: i * .15,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Benefit cards on LP */
    gsap.utils.toArray('.benefit-card').forEach((el, i) => {
      gsap.from(el, { opacity: 0, y: 40, duration: .8, ease, delay: (i % 3) * .12,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  /* ── Nav Dropdown ───────────────────────────────────────── */
  function initNavDropdown() {
    const wrap = document.querySelector('.nav-dropdown-wrap');
    if (!wrap) return;

    // Click-toggle (für Touch & Tastatur)
    const trigger = wrap.querySelector('.nav-dropdown-trigger');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    const setAria = open => trigger.setAttribute('aria-expanded', open ? 'true' : 'false');

    trigger.addEventListener('click', e => {
      // Wenn Klick auf "Leistungen" selbst (kein Dropdown-Link) → nur auf Desktop scrollen
      if (window.innerWidth > 768) {
        e.preventDefault();
        wrap.classList.toggle('is-open');
        setAria(wrap.classList.contains('is-open'));
      }
    });

    // Hover-Sync für aria-expanded
    wrap.addEventListener('mouseenter', () => setAria(true));
    wrap.addEventListener('mouseleave', () => {
      if (!wrap.classList.contains('is-open')) setAria(false);
    });

    // Schließen bei Klick außerhalb
    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) { wrap.classList.remove('is-open'); setAria(false); }
    });

    // Schließen bei Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { wrap.classList.remove('is-open'); setAria(false); }
    });
  }

  /* ── Mobile Menu ────────────────────────────────────────── */
  function initMobileMenu() {
    const burger = document.getElementById('navBurger');
    const links  = document.querySelector('.nav-links');
    if (!burger || !links) return;
    let open = false;
    burger.setAttribute('aria-expanded', 'false');

    /* Variante A: Vollbild-Overlay (#mobile-menu) – z.B. index.html */
    const overlay = document.getElementById('mobile-menu');
    if (overlay) {
      const setOpen = state => {
        open = state;
        overlay.classList.toggle('open', open);
        overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.classList.toggle('is-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        burger.children[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
        burger.children[1].style.opacity   = open ? '0' : '1';
        burger.children[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
      };
      burger.addEventListener('click', () => setOpen(!open));
      overlay.querySelector('.mm-close').addEventListener('click', () => setOpen(false));
      // Accordion: Leistungen
      const acc = overlay.querySelector('.mm-acc');
      if (acc) {
        const accBtn = acc.querySelector('.mm-acc-btn');
        accBtn.addEventListener('click', () => {
          const state = !acc.classList.contains('open');
          acc.classList.toggle('open', state);
          accBtn.setAttribute('aria-expanded', state ? 'true' : 'false');
        });
      }
      // Sprach-Toggle spiegeln (gleiche Logik wie nav-lang-btn)
      const mmLang = overlay.querySelector('.mm-lang');
      const navLang = document.getElementById('lang-toggle');
      if (mmLang && navLang) {
        mmLang.addEventListener('click', () => navLang.click());
        const syncLang = () => {
          const flag = document.getElementById('lang-flag');
          const label = document.getElementById('lang-label');
          if (flag)  mmLang.querySelector('.mm-lang-flag').textContent = flag.textContent;
          if (label) mmLang.querySelector('.mm-lang-label').textContent = label.textContent;
        };
        navLang.addEventListener('click', () => setTimeout(syncLang, 50));
        if (window.MutationObserver) {
          new MutationObserver(syncLang).observe(navLang, { childList: true, subtree: true });
        }
      }
      // Links schließen das Menü
      overlay.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', () => setOpen(false)));
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) setOpen(false); });
      window.addEventListener('resize', () => { if (window.innerWidth > 768 && open) setOpen(false); });
      return;
    }

    /* Variante B: altes Verhalten (andere Seiten) */
    burger.addEventListener('click', () => {
      open = !open;
      links.style.cssText = open
        ? 'display:flex;flex-direction:column;position:fixed;top:0;left:0;right:0;bottom:0;transform:none;min-height:100dvh;justify-content:flex-start;align-items:center;gap:22px;padding:calc(92px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(40px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));overflow-y:auto;overscroll-behavior:contain;z-index:999;background:#0E1A2B;'
        : '';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.children[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
      burger.children[1].style.opacity   = open ? '0' : '1';
      burger.children[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
      if (open) {
        links.querySelectorAll(':scope > li > a').forEach(a => {
          a.style.cssText = 'font-size:1.35rem;letter-spacing:.08em;color:#fff';
          a.addEventListener('click', () => burger.click(), { once: true });
        });
      } else {
        links.querySelectorAll(':scope > li > a').forEach(a => { a.style.cssText = ''; });
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && open) burger.click();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && open) burger.click();
    });
  }

  /* ── Skyline KRASS: funkelnde Fenster + sanfte Parallax-Ebenen ── */
  function initSkyline() {
    const NS = 'http://www.w3.org/2000/svg';
    const group = document.getElementById('skyWindows');
    const back  = document.querySelector('.hero-skyline.back');
    const front = document.querySelector('.hero-skyline.front');
    const fog   = document.querySelector('.hero-fog');
    const calm  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Fenster in echten Gebäude-Zonen (x, oben, breite, unten) */
    const zones = [
      [52,180,28],[90,240,44],[252,200,34],[298,80,44],[352,160,36],
      [398,190,32],[490,130,46],[586,150,38],[634,200,34],[728,170,36],
      [876,175,38],[924,195,34],[1024,210,32],[1066,210,32]
    ];
    if (group && !calm) {
      for (let i = 0; i < 42; i++) {
        const z = zones[Math.floor(Math.random() * zones.length)];
        const cols = Math.max(1, Math.floor(z[2] / 9));
        const col = Math.floor(Math.random() * cols);
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', z[0] + 5 + col * 9);
        r.setAttribute('y', z[1] + 14 + Math.random() * (400 - z[1] - 24));
        r.setAttribute('width', 3.4);
        r.setAttribute('height', 5);
        r.setAttribute('rx', 1);
        r.setAttribute('fill', Math.random() < .6 ? '#FFD98A' : '#9CC4F5');
        r.setAttribute('class', 'win');
        r.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
        r.style.animationDuration = (3.5 + Math.random() * 4).toFixed(2) + 's';
        group.appendChild(r);
      }
    }

    /* Parallax: Ebenen driften gegenläufig (rAF-gedrosselt, transform-only) */
    if (calm || !window.matchMedia('(pointer: fine)').matches) return;
    if (!back || !front) return;
    let tx = 0, cx = 0, ticking = false;
    document.getElementById('hero').addEventListener('mousemove', e => {
      tx = e.clientX / window.innerWidth - .5;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          cx += (tx - cx) * .06;
          back.style.transform  = 'translate3d(' + (cx * -14).toFixed(1) + 'px,0,0)';
          front.style.transform = 'translate3d(' + (cx * 10).toFixed(1) + 'px,0,0)';
          if (fog) fog.style.transform = 'translate3d(' + (cx * 22).toFixed(1) + 'px,0,0)';
          ticking = false;
        });
      }
    });
  }

  /* ── Init All ───────────────────────────────────────────── */
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    initLenis();
    initNav();
    initHero();
    initSkyline();
    initScrollAnimations();
    initCounters();
    initStickyScroll();
    initParallax();
    initMagnetic();
    initNavDropdown();
    initMobileMenu();

    /* Floating Google Badge — always visible */
    const floatingBadge = document.getElementById('floatingBadge');
    if (floatingBadge) floatingBadge.classList.add('visible');
  }

})();

/* -- Sprachumschalter (Google Translate) ----------------------------------
   Die Logik liegt zentral in botprotect.js, das auf allen Inhaltsseiten laeuft
   (index.html laedt main.js, die uebrigen Seiten mobile-nav.js). Hier bewusst
   kein zweiter Handler, sonst waere der Button doppelt belegt. */