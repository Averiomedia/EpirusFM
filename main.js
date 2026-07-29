/* ============================================================
   EPIRUS FM — main.js
   GSAP + Lenis + Three.js + Cursor + Animations
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

    document.querySelectorAll('a, button, .service-card, .why-point').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── Magnetic Buttons ───────────────────────────────────── */
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect   = el.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) * 0.28;
        const dy     = (e.clientY - cy) * 0.28;
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

  /* ── Nav Scroll Behaviour ───────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    ScrollTrigger.create({
      start: 80,
      onEnter:  () => nav.classList.add('scrolled'),
      onLeaveBack: () => nav.classList.remove('scrolled')
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      });
    });
  }

  /* ── Three.js Hero Particles ────────────────────────────── */
  function initHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = canvas.clientWidth  = window.innerWidth;
    const H = canvas.clientHeight = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
    camera.position.z = 280;

    /* Particles */
    const COUNT    = 160;
    const positions = new Float32Array(COUNT * 3);
    const spread    = 300;
    const pts       = [];

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - .5) * spread;
      const y = (Math.random() - .5) * spread * .7;
      const z = (Math.random() - .5) * 120;
      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xC8A462, size: 1.8, transparent: true, opacity: .75, sizeAttenuation: true
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    /* Connecting lines */
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xC8A462, transparent: true, opacity: .12
    });
    const lineGeo  = new THREE.BufferGeometry();
    const linePos  = [];
    const maxDist  = 65;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          linePos.push(pts[i].x, pts[i].y, pts[i].z);
          linePos.push(pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    /* Mouse parallax */
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', e => {
      targetX = (e.clientX / window.innerWidth  - .5) * .4;
      targetY = (e.clientY / window.innerHeight - .5) * -.25;
    });

    /* Teal accent sphere */
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x00C8A8, transparent: true, opacity: .6 })
    );
    sphere.position.set(80, -30, 0);
    scene.add(sphere);

    const goldSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xC8A462, transparent: true, opacity: .8 })
    );
    goldSphere.position.set(-90, 50, 20);
    scene.add(goldSphere);

    /* Animate */
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.006;
      mesh.rotation.y += 0.0018;
      mesh.rotation.x += 0.0006;
      camera.position.x += (targetX * 30 - camera.position.x) * 0.04;
      camera.position.y += (targetY * 20 - camera.position.y) * 0.04;
      sphere.position.y     = -30 + Math.sin(t) * 12;
      goldSphere.position.y =  50 + Math.cos(t * .7) * 8;
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
      const target = +el.dataset.target;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].val) + (target === 99 ? '' : '+'); }
          });
        }
      });
    });
  }

  /* ── 3D Card Tilt ───────────────────────────────────────── */
  function initTilt() {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left) / rect.width  - .5;
        const y    = (e.clientY - rect.top)  / rect.height - .5;
        gsap.to(card, {
          rotateY: x * 8, rotateX: -y * 8,
          transformPerspective: 800,
          duration: .4, ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .7, ease: 'elastic.out(1,.5)' });
      });
    });
  }

  /* ── Parallax Sections ──────────────────────────────────── */
  function initParallax() {
    gsap.utils.toArray('.parallax-el').forEach(el => {
      gsap.to(el, {
        y: '-12%',
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.parallax-wrap'),
          start:   'top bottom',
          end:     'bottom top',
          scrub:   true
        }
      });
    });
  }

  /* ── Scroll Animations ──────────────────────────────────── */
  function initScrollAnimations() {
    const ease = 'power3.out';

    /* Section tags */
    gsap.utils.toArray('.section-tag').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .8, ease,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Section subs */
    gsap.utils.toArray('.section-sub').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .9, ease, delay: .2,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Dividers */
    gsap.utils.toArray('.divider').forEach(el => {
      gsap.to(el, {
        opacity: 1, scaleX: 1, duration: .8, ease,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Word reveals */
    gsap.utils.toArray('.section-title .word span').forEach((span, i) => {
      const word = span.parentElement;
      gsap.to(span, {
        y: 0, duration: .9, ease,
        delay: i * 0.07,
        scrollTrigger: { trigger: word, start: 'top 90%', once: true }
      });
    });

    /* Hero title lines */
    gsap.utils.toArray('.hero-title .line span').forEach((span, i) => {
      gsap.to(span, { y: 0, duration: 1.1, ease, delay: 1.8 + i * .14 });
    });
    gsap.to('.hero-tag',  { opacity: 1, y: 0, duration: .8, ease, delay: 1.5 });
    gsap.to('.hero-sub',  { opacity: 1, y: 0, duration: .8, ease, delay: 2.2 });
    gsap.to('.hero-ctas', { opacity: 1, y: 0, duration: .8, ease, delay: 2.5 });
    gsap.to('#heroScroll',{ opacity: 1, duration: .8, ease, delay: 3 });

    /* Stat items */
    gsap.utils.toArray('.stat-item').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .8, ease, delay: i * .1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Service cards stagger */
    gsap.utils.toArray('.service-card').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .85, ease, delay: (i % 3) * .12,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Why points */
    gsap.utils.toArray('.why-point').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, x: 0, duration: .8, ease, delay: i * .12,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Process steps */
    gsap.utils.toArray('.process-step').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .8, ease, delay: i * .13,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Testimonial cards */
    gsap.utils.toArray('.testi-card').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, x: 0, duration: .85, ease, delay: i * .1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* CTA boxes */
    gsap.utils.toArray('.cta-box').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .8, ease, delay: i * .15,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
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
        ? 'display:flex;flex-direction:column;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(7,11,18,.97);backdrop-filter:blur(20px);justify-content:center;align-items:center;gap:36px;z-index:800;'
        : '';
      burger.children[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
      burger.children[1].style.opacity   = open ? '0' : '1';
      burger.children[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
      if (open) {
        links.querySelectorAll('a').forEach(a => {
          a.style.cssText = 'font-size:1.5rem;letter-spacing:.08em';
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
    initTilt();
    initParallax();
    initMagnetic();
    initMobileMenu();
  }

})();
