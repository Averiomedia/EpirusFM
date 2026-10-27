'use strict';
/* ============================================================
   Epirus FM – Schutz + Einwilligung (All-Inkl, Consent Mode v2)
   - Bot-Schutz: Honeypot + Mindestverweildauer (alle Formulare)
   - Sonstiges-Feld: Zusatz-Input bei Auswahl "Sonstiges"
   - Erfolgs-/Fehlerbanner nach PHP-Redirect (?anfrage=ok|fehler)
   - Consent Mode v2: Standard = alles abgelehnt; GTM + Translate
     werden erst nach Einwilligung geladen (Event: epirus-consent)
   HINWEIS: GTM_ID unten eintragen, sobald der Container existiert.
   ============================================================ */
(function () {
  var GTM_ID = 'GTM-XXXXXXX'; // <-- hier einfügen, z. B. 'GTM-ABC1234'
  var STORAGE_KEY = 'epirus_fm_consent';

  /* ---------- gtag-Stub + Standard: alles abgelehnt ---------- */
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'denied',
    personalization_storage: 'denied', security_storage: 'denied'
  });

  /* ---------- GTM erst nach Einwilligung laden ---------- */
  var gtmGeladen = false;
  function loadGtm() {
    if (gtmGeladen || !GTM_ID || GTM_ID === 'GTM-XXXXXXX') return;
    gtmGeladen = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  /* ---------- Google Translate erst nach Einwilligung laden ---------- */
  var translateGeladen = false;
  window.googleTranslateElementInit = function () {
    try {
      new google.translate.TranslateElement({
        pageLanguage: 'de', includedLanguages: 'en', autoDisplay: false
      }, 'google_translate_element');
      window.__translateReady = true;
    } catch (e) { /* still */ }
  };
  function loadTranslate() {
    if (translateGeladen) return;
    translateGeladen = true;
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(s);
  }

  /* ---------- Einwilligung anwenden ---------- */
  function applyAll(gtm, marketing) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: marketing ? 'granted' : 'denied',
        ad_user_data: marketing ? 'granted' : 'denied',
        ad_personalization: marketing ? 'granted' : 'denied',
        analytics_storage: marketing ? 'granted' : 'denied'
      });
      window.gtag('consent', 'update', {
        functionality_storage: marketing ? 'granted' : 'denied',
        personalization_storage: marketing ? 'granted' : 'denied'
      });
    }
    if (gtm) loadGtm();
    if (marketing) loadTranslate();
  }
  document.addEventListener('epirus-consent', function (e) {
    var d = (e && e.detail) || {};
    applyAll(!!d.gtm, !!d.marketing);
  });
  window.EpirusConsent = {
    applyAll: applyAll, loadGtm: loadGtm, loadTranslate: loadTranslate,
    get GTM_ID() { return GTM_ID; }
  };

  /* ---------- Bot-Schutz je Formular ---------- */
  function protect(form) {
    // 1. Honeypot — hidden field bots fill, humans don't
    var honey = document.createElement('input');
    honey.type = 'text';
    honey.name = 'website';
    honey.setAttribute('autocomplete', 'off');
    honey.setAttribute('tabindex', '-1');
    honey.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none';
    form.appendChild(honey);

    // 2. Timestamp — set when form first becomes visible
    var ts = document.createElement('input');
    ts.type = 'hidden';
    ts.name = '_loaded';
    ts.value = Date.now();
    form.appendChild(ts);

    form.addEventListener('submit', function (e) {
      // Honeypot check
      if (honey.value !== '') {
        e.preventDefault();
        return false;
      }
      // Timestamp check — block if submitted in under 3 seconds
      var elapsed = Date.now() - parseInt(ts.value, 10);
      if (elapsed < 3000) {
        e.preventDefault();
        return false;
      }
    }, true);
  }

  /* ---------- Sonstiges-Feld ---------- */
  function initSonstiges() {
    document.querySelectorAll('.sonstiges-feld').forEach(function (inp) {
      var sel = inp.previousElementSibling;
      if (!sel || sel.tagName !== 'SELECT') return;
      function sync() {
        var show = (sel.value || '').indexOf('Sonstiges') === 0;
        inp.classList.toggle('an', show);
        inp.required = show;
        if (!show) inp.value = '';
      }
      sel.addEventListener('change', sync);
      sync();
    });
  }

  /* ---------- Erfolgs-/Fehlerbanner nach Redirect ---------- */
  function initStatusBanner() {
    var m = /[?&]anfrage=(ok|fehler)/.exec(window.location.search);
    if (!m) return;
    var ok = m[1] === 'ok';
    var bar = document.createElement('div');
    bar.setAttribute('role', 'status');
    bar.textContent = ok
      ? 'Vielen Dank für Ihre Anfrage! Wir melden uns schnellstmöglich bei Ihnen.'
      : 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an: +49 174 7192 840.';
    bar.style.cssText = 'position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:99999;'
      + 'max-width:min(560px,92vw);padding:14px 22px;border-radius:12px;font-size:.9rem;text-align:center;'
      + 'box-shadow:0 12px 40px rgba(0,0,0,.25);'
      + (ok ? 'background:#0E7A4F;color:#fff;' : 'background:#A80E12;color:#fff;');
    document.body.appendChild(bar);
    try {
      var u = new URL(window.location.href);
      u.searchParams.delete('anfrage');
      window.history.replaceState(null, '', u.toString());
    } catch (e) { /* still */ }
    setTimeout(function () { bar.remove(); }, 7000);
  }

  /* ---------- Init ---------- */
  function init() {
    document.querySelectorAll('form').forEach(protect);
    initSonstiges();
    initStatusBanner();
    // Gespeicherte Einwilligung still anwenden (Banner-Anzeige regelt das Banner-Skript)
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (!(data.expires && Date.now() > data.expires)) {
          applyAll(!!data.gtm, !!data.marketing);
        }
      }
    } catch (e) { /* still */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* -- Sprachumschalter (Google Translate) ----------------------------------
   Eigene IIFE in botprotect.js, weil diese Datei auf allen Inhaltsseiten
   laeuft (index.html laedt main.js, die uebrigen Seiten mobile-nav.js).
   Umschalten ueber googtrans-Cookie plus Neuladen, denn Googles Combo-Select
   reagiert nicht auf Programm-Events und bietet keine Rueckschalt-Option.
   Ohne Marketing-Einwilligung wird das Label NICHT umgeschaltet, sondern die
   Cookie-Einstellungen geoeffnet. */
(function () {
  var btn = document.getElementById('lang-toggle');
  if (!btn) return;
  var STORAGE_KEY = 'epirus_fm_consent';
  var flag = document.getElementById('lang-flag');
  var label = document.getElementById('lang-label');

  function applyUI(en) {
    if (flag) flag.textContent = en ? '\uD83C\uDDE9\uD83C\uDDEA' : '\uD83C\uDDEC\uD83C\uDDE7';
    if (label) label.textContent = en ? 'DE' : 'EN';
    btn.title = en ? 'Zur\u00fcck zu Deutsch' : 'Switch to English';
    btn.classList.toggle('active', en);
  }
  function cookieEN() {
    var m = /(?:^|;\s*)googtrans=\/de\/([A-Za-z-]+)/.exec(document.cookie);
    return !!(m && m[1] && m[1].indexOf('en') === 0);
  }
  function combo() { return document.querySelector('.goog-te-combo'); }
  function enNow() {
    var sel = combo();
    return sel ? ((sel.value || '').indexOf('en') === 0 || cookieEN()) : cookieEN();
  }
  function sync() { applyUI(enNow()); }

  function hasMarketingConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      return !!(d.marketing && !(d.expires && Date.now() > d.expires));
    } catch (e) { return false; }
  }

  btn.addEventListener('click', function () {
    if (!hasMarketingConsent()) {
      var link = document.getElementById('cookie-settings');
      if (link) { link.click(); return; }
      btn.title = 'Please allow cookies first (cookie settings)';
      return;
    }
    if (enNow()) {
      document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } else {
      document.cookie = 'googtrans=/de/en;path=/';
    }
    location.reload();
  });

  document.addEventListener('epirus-consent', function () { setTimeout(sync, 800); });
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    if (combo() || tries > 120) { sync(); clearInterval(iv); }
  }, 500);
  sync();
})();
