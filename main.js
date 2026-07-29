/* ============================================================
   EPIRUS FM — main.js (Hell-Variante)
   Red particles, light theme interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Preloader ──────────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  const preBar    = document.getElementById('preBar');
  const prePct    = document.getElementById('prePct');
  const preLogo   = document.querySelector('.pre-logo');

  let progress = 0;
  gsap.to(preLogo, { clipPath:'inset(0 0% 0 0)', opacity:1, duration:1, ease:'power3.out' });

  const ticker = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) { progress = 100; clearInterval(ticker); hidePreloader(); }
    preBar.style.width = progress + '%';
    prePct.textContent  = Math.round(progress) + '%';
  }, 80);

  function hidePreloader() {
    setTimeout(() => {
      gsap.to(preloader, {
        yPercent: -100, duration: 1, ease: 'power4.inOut',
        onComplete: () => { preloader.style.display = 'none'; initAnimations(); }
      });
    }, 300);
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
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      });
    });
  }

  /* ── Three.js Hero (Red Particles) ─────────────────────── */
  function initHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

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

    /* Particles — warm red/orange palette */
    const COUNT     = 180;
    const positions = new Float32Array(COUNT * 3);
    const pts       = [];
    const spread    = 320;

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - .5) * spread;
      const y = (Math.random() - .5) * spread * .65;
      const z = (Math.random() - .5) * 140;
      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xD4151A, size: 1.6, transparent: true, opacity: .65, sizeAttenuation: true
    });
    scene.add(new THREE.Points(geo, mat));

    /* Lines */
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xD4151A, transparent: true, opacity: .1
    });
    const linePos = [];
    const maxDist = 68;
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

    /* Accent orbs */
    const redOrb = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xF03A3F, transparent: true, opacity: .55 })
    );
    redOrb.position.set(90, -20, 10);
    scene.add(redOrb);

    const dimOrb = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFF7070, transparent: true, opacity: .45 })
    );
    dimOrb.position.set(-80, 55, -10);
    scene.add(dimOrb);

    /* Mouse parallax */
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
      targetX = (e.clientX / window.innerWidth  - .5) * .4;
      targetY = (e.clientY / window.innerHeight - .5) * -.25;
    });

    const mesh = scene.children[0];
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += .006;
      mesh.rotation.y += .0018;
      mesh.rotation.x += .0005;
      camera.position.x += (targetX * 30 - camera.position.x) * .04;
      camera.position.y += (targetY * 20 - camera.position.y) * .04;
      redOrb.position.y = -20 + Math.sin(t) * 12;
      dimOrb.position.y =  55 + Math.cos(t * .7) * 8;
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

    /* Word reveals */
    gsap.utils.toArray('.section-title .word span').forEach((span, i) => {
      gsap.to(span, { y: 0, duration: .9, ease, delay: i * .07,
        scrollTrigger: { trigger: span.closest('.section-title'), start: 'top 90%', once: true } });
    });

    /* Stat items */
    gsap.utils.toArray('.stat-item').forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: .8, ease, delay: i * .1,
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
    trigger.addEventListener('click', e => {
      // Wenn Klick auf "Leistungen" selbst (kein Dropdown-Link) → nur auf Desktop scrollen
      if (window.innerWidth > 768) {
        e.preventDefault();
        wrap.classList.toggle('is-open');
      }
    });

    // Schließen bei Klick außerhalb
    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) wrap.classList.remove('is-open');
    });

    // Schließen bei Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') wrap.classList.remove('is-open');
    });
  }

  /* ── Mobile Menu ────────────────────────────────────────── */
  function initMobileMenu() {
    const burger = document.getElementById('navBurger');
    const links  = document.querySelector('.nav-links');
    if (!burger || !links) return;
    let open = false;
    burger.addEventListener('click', () => {
      open = !open;
      links.style.cssText = open
        ? 'display:flex;flex-direction:column;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,.98);backdrop-filter:blur(20px);justify-content:center;align-items:center;gap:36px;z-index:800;'
        : '';
      burger.children[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
      burger.children[1].style.opacity   = open ? '0' : '1';
      burger.children[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
      if (open) {
        links.querySelectorAll('a').forEach(a => {
          a.style.cssText = 'font-size:1.5rem;letter-spacing:.08em;color:#0E1A2B';
          a.addEventListener('click', () => burger.click(), { once: true });
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
    initScrollAnimations();
    initCounters();
    initStickyScroll();
    initParallax();
    initMagnetic();
    initNavDropdown();
    initMobileMenu();
  }

})();
