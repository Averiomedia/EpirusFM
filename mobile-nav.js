/* ============================================================
   EPIRUS FM - mobile-nav.js
   Burger-Menue fuer Unterseiten (LP, FAQ, Impressum, 404, ...)
   Wird nicht geladen, wenn main.js bereits die Navigation steuert.
   ============================================================ */
(function () {
  'use strict';

  // main.js uebernimmt auf index.html / datenschutz.html
  if (document.querySelector('script[src$="main.js"]')) return;

  var burger = document.getElementById('navBurger');
  var links = document.querySelector('.nav-links');
  if (!burger || !links) return;

  var open = false;

  function setAria() {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function toggleBurgerIcon() {
    burger.classList.toggle('is-open', open);
    if (burger.children.length >= 3) {
      burger.children[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
      burger.children[1].style.opacity   = open ? '0' : '1';
      burger.children[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
    }
  }

  /* Variante A: Vollbild-Overlay (#mobile-menu) */
  var overlay = document.getElementById('mobile-menu');
  if (overlay) {
    var setOpen = function (state) {
      open = state;
      overlay.classList.toggle('open', open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
      setAria();
      toggleBurgerIcon();
    };
    burger.addEventListener('click', function (e) {
      e.preventDefault();
      setOpen(!open);
    });
    var closeBtn = overlay.querySelector('.mm-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
    var acc = overlay.querySelector('.mm-acc');
    if (acc) {
      var accBtn = acc.querySelector('.mm-acc-btn');
      accBtn.addEventListener('click', function () {
        var state = !acc.classList.contains('open');
        acc.classList.toggle('open', state);
        accBtn.setAttribute('aria-expanded', state ? 'true' : 'false');
      });
    }
    var mmLang = overlay.querySelector('.mm-lang');
    var navLang = document.getElementById('lang-toggle');
    if (mmLang && navLang) {
      mmLang.addEventListener('click', function () { navLang.click(); });
      var syncLang = function () {
        var flag = document.getElementById('lang-flag');
        var label = document.getElementById('lang-label');
        if (flag)  mmLang.querySelector('.mm-lang-flag').textContent = flag.textContent;
        if (label) mmLang.querySelector('.mm-lang-label').textContent = label.textContent;
      };
      navLang.addEventListener('click', function () { setTimeout(syncLang, 50); });
      if (window.MutationObserver) {
        new MutationObserver(syncLang).observe(navLang, { childList: true, subtree: true });
      }
    }
    overlay.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && open) setOpen(false);
    });
    setAria();
    return;
  }

  /* Variante B: altes Verhalten (falls kein Overlay-Markup vorhanden) */

  var OPEN_STYLE = 'display:flex;flex-direction:column;position:fixed;top:0;left:0;right:0;bottom:0;'
    + 'transform:none;min-height:100dvh;justify-content:flex-start;align-items:center;gap:22px;'
    + 'padding:calc(92px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) '
    + 'calc(40px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));'
    + 'overflow-y:auto;overscroll-behavior:contain;z-index:999;background:#0E1A2B;';

  function reflect() {
    links.style.cssText = open ? OPEN_STYLE : '';
    burger.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    setAria();

    if (open) {
      links.querySelectorAll(':scope > li > a').forEach(function (a) {
        a.style.cssText = 'font-size:1.3rem;letter-spacing:.08em;color:#fff';
        a.addEventListener('click', function () {
          if (open) burger.click();
        }, { once: true });
      });
    } else {
      links.querySelectorAll(':scope > li > a').forEach(function (a) {
        a.style.cssText = '';
      });
    }
  }

  burger.setAttribute('aria-expanded', 'false');
  burger.addEventListener('click', function (e) {
    e.preventDefault();
    open = !open;
    reflect();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) burger.click();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && open) {
      open = false;
      reflect();
    }
  });
})();
