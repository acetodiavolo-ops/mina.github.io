/* Cookie consent manager */
(function () {
  'use strict';
  var KEY = 'iglisi_consent', VER = '1';

  function getConsent() {
    try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); return d && d.v === VER ? d : null; } catch (e) { return null; }
  }
  function saveConsent(prefs) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VER, ts: Date.now(), analytics: prefs.analytics })); } catch (e) {}
  }
  function el(id) { return document.getElementById(id); }

  function showBanner() { var b = el('cookie-banner'); if (b) { b.hidden = false; b.removeAttribute('hidden'); } }
  function hideBanner() { var b = el('cookie-banner'); if (b) b.hidden = true; }
  function openModal() { var m = el('cookie-modal-overlay'); if (!m) return; m.hidden = false; m.removeAttribute('hidden'); var cb = el('cookie-toggle-analytics'); var consent = getConsent(); if (cb) cb.checked = !consent || consent.analytics !== false; }
  function closeModal() { var m = el('cookie-modal-overlay'); if (m) m.hidden = true; }

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
