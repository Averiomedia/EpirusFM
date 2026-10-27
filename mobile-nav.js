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

  var OPEN_STYLE = 'display:flex;flex-direction:column;position:fixed;top:0;left:0;right:0;bottom:0;'
    + 'transform:none;min-height:100dvh;justify-content:flex-start;align-items:center;gap:22px;'
    + 'padding:calc(92px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) '
    + 'calc(40px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));'
    + 'overflow-y:auto;overscroll-behavior:contain;z-index:999;background:#0E1A2B;';

  function setAria() {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

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
