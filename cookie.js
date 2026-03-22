/* Cookie consent manager */
(function () {
  'use strict';
  var KEY = 'iglisi_consent', VER = '1';
  var _prevFocus = null;

  function getConsent() {
    try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); return d && d.v === VER ? d : null; } catch (e) { return null; }
  }
  function saveConsent(prefs) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VER, ts: Date.now(), analytics: prefs.analytics })); } catch (e) {}
  }
  function el(id) { return document.getElementById(id); }

  function showBanner() { var b = el('cookie-banner'); if (b) { b.hidden = false; b.removeAttribute('hidden'); } }
  function hideBanner() { var b = el('cookie-banner'); if (b) b.hidden = true; }

  function openModal() {
    var m = el('cookie-modal-overlay');
    if (!m) return;
    _prevFocus = document.activeElement;
    m.hidden = false;
    m.removeAttribute('hidden');
    var cb = el('cookie-toggle-analytics');
    var consent = getConsent();
    if (cb) cb.checked = !consent || consent.analytics !== false;
    var focusable = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function closeModal() {
    var m = el('cookie-modal-overlay');
    if (m) m.hidden = true;
    if (_prevFocus && _prevFocus.focus) { _prevFocus.focus(); }
    _prevFocus = null;
  }

  function acceptAll() { saveConsent({ analytics: true }); hideBanner(); closeModal(); }
  function rejectAll() { saveConsent({ analytics: false }); hideBanner(); closeModal(); }
  function savePrefs() { var cb = el('cookie-toggle-analytics'); saveConsent({ analytics: cb ? cb.checked : false }); hideBanner(); closeModal(); }

  function init() {
    var b1 = el('cookie-accept-all'), b2 = el('cookie-reject-non-essential'), b3 = el('cookie-customize');
    var mc = el('cookie-modal-close'), ms = el('cookie-save-preferences');
    var ftrig = el('footer-cookie-settings');
    var overlay = el('cookie-modal-overlay');

    if (b1) b1.addEventListener('click', acceptAll);
    if (b2) b2.addEventListener('click', rejectAll);
    if (b3) b3.addEventListener('click', function () { hideBanner(); openModal(); });
    if (mc) mc.addEventListener('click', function () { closeModal(); if (!getConsent()) showBanner(); });
    if (ms) ms.addEventListener('click', savePrefs);
    if (ftrig) ftrig.addEventListener('click', showBanner);
    if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) { closeModal(); if (!getConsent()) showBanner(); } });

    /* Focus trap: keep Tab cycling within the modal while it is open */
    if (overlay) overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); if (!getConsent()) showBanner(); }
    });

    if (!getConsent()) showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
