'use strict';
(function () {
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

  function init() {
    document.querySelectorAll('form').forEach(protect);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
