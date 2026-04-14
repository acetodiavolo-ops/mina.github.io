/* ── Cookie Consent + Meta Pixel ──────────────────────────────────────────
   Consent is required before the pixel fires.
   Preference is stored in localStorage under 'iglisi_cookie_consent':
     'granted'  → pixel fires, banner never shown again
     'denied'   → pixel suppressed, banner never shown again
     (absent)   → show banner, pixel does NOT fire until user accepts
   ──────────────────────────────────────────────────────────────────────── */

(function(){
  var STORAGE_KEY = 'iglisi_cookie_consent';

  /* ── i18n ──────────────────────────────────────────────────────────────── */
  var path = window.location.pathname;
  var lang = path.indexOf('/it/') > -1 ? 'it' : path.indexOf('/sq/') > -1 ? 'sq' : 'en';
  var copy = {
    en: {
      msg:     'We use cookies to improve your experience and measure how people use our site.',
      policy:  'Cookie policy',
      accept:  'Accept',
      decline: 'Decline'
    },
    it: {
      msg:     'Usiamo i cookie per migliorare la tua esperienza e misurare l\'utilizzo del sito.',
      policy:  'Cookie policy',
      accept:  'Accetta',
      decline: 'Rifiuta'
    },
    sq: {
      msg:     'Përdorim cookie për të përmirësuar eksperiencën tuaj dhe për të matur trafikun e faqes.',
      policy:  'Politika e cookies',
      accept:  'Prano',
      decline: 'Refuzo'
    }
  }[lang];

  var policyUrl = '/' + lang + '/legal/cookies.html';

  /* ── Pixel loader ──────────────────────────────────────────────────────── */
  function loadPixel(){
    if(window._fbPixelLoaded) return;
    window._fbPixelLoaded = true;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','818615647986085');
    fbq('track','PageView');
    /* Fire Contact event on any WhatsApp CTA click */
    document.addEventListener('click',function(e){
      var el=e.target.closest('[data-fb-contact]');
      if(el) fbq('track','Contact');
    });
  }

  /* ── Check stored preference ───────────────────────────────────────────── */
  var stored = localStorage.getItem(STORAGE_KEY);
  if(stored === 'granted'){
    /* Delay for returning visitors — push FB scripts past TTI so they
       don't block the main thread during the TBT measurement window.
       requestIdleCallback fires when the browser has nothing urgent to do.
       New visitors who click Accept (below) still fire immediately. */
    if('requestIdleCallback' in window){
      requestIdleCallback(loadPixel, {timeout: 4000});
    } else {
      setTimeout(loadPixel, 3500);
    }
    return;
  }
  if(stored === 'denied'){ return; }

  /* ── Build banner ──────────────────────────────────────────────────────── */
  var banner = document.createElement('div');
  banner.id = 'iglisi-consent';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Cookie consent');
  banner.innerHTML =
    '<p style="margin:0 0 .6rem;font-size:.82rem;line-height:1.55;color:rgba(255,255,255,.88)">' +
      copy.msg + ' <a href="' + policyUrl + '" style="color:#b4945c;text-underline-offset:2px">' + copy.policy + '</a>.' +
    '</p>' +
    '<div style="display:flex;gap:.6rem;flex-wrap:wrap">' +
      '<button id="iglisi-accept" style="flex:1 1 auto;min-width:80px;background:linear-gradient(145deg,#b4945c,#8c6d3f);color:#fff;border:none;padding:.5rem 1.1rem;border-radius:6px;font-size:.82rem;font-weight:700;cursor:pointer">' + copy.accept + '</button>' +
      '<button id="iglisi-decline" style="flex:1 1 auto;min-width:80px;background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.2);padding:.5rem 1.1rem;border-radius:6px;font-size:.82rem;cursor:pointer">' + copy.decline + '</button>' +
    '</div>';

  Object.assign(banner.style, {
    position:       'fixed',
    bottom:         '0',
    left:           '0',
    right:          '0',
    background:     '#06153b',
    borderTop:      '1px solid rgba(180,148,92,.3)',
    padding:        '.9rem 1.2rem',
    zIndex:         '99998',
    boxShadow:      '0 -4px 20px rgba(0,0,0,.35)',
    maxWidth:       '100%',
    boxSizing:      'border-box'
  });

  /* Offset the call bar on mobile (call bar sits at bottom on small screens) */
  var style = document.createElement('style');
  style.textContent =
    '@media(max-width:768px){#iglisi-consent{bottom:40px}}' +
    '#iglisi-accept:hover{opacity:.88}' +
    '#iglisi-decline:hover{color:rgba(255,255,255,.85);border-color:rgba(255,255,255,.45)}';
  document.head.appendChild(style);

  function dismiss(choice){
    localStorage.setItem(STORAGE_KEY, choice);
    banner.style.transition = 'transform .3s ease, opacity .3s ease';
    banner.style.transform  = 'translateY(100%)';
    banner.style.opacity    = '0';
    setTimeout(function(){ if(banner.parentNode) banner.parentNode.removeChild(banner); }, 320);
    if(choice === 'granted') loadPixel();
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.body.appendChild(banner);
    document.getElementById('iglisi-accept').addEventListener('click',  function(){ dismiss('granted'); });
    document.getElementById('iglisi-decline').addEventListener('click', function(){ dismiss('denied'); });
  });

  /* If DOM already ready (script loaded late) */
  if(document.readyState !== 'loading'){
    document.body.appendChild(banner);
    document.getElementById('iglisi-accept').addEventListener('click',  function(){ dismiss('granted'); });
    document.getElementById('iglisi-decline').addEventListener('click', function(){ dismiss('denied'); });
  }

})();
