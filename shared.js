/**
 * Iglisi Watch & Key — shared.js
 * Fixes applied:
 *  - initCounters: scroll-triggered animated counters for trust badges
 *  - initProgressBar: requestAnimationFrame throttle for smooth mobile rendering
 *  - geoDetect: api.country.is (cookie-free, no tracking)
 *  - initLazyMaps: deferred Google Maps iframe load
 */
(function () {
  'use strict';

  var CONFIG = {
    langs: ['en', 'sq', 'it'],
    startYear: 2002,
    geoTimeout: 3000,
  };

  // ── LANGUAGE ──────────────────────────────────────────────────────────────

  function currentLang() {
    var match = window.location.pathname.match(/\/(en|sq|it)(\/|$)/);
    return match ? match[1] : null;
  }

  function nextLang() {
    var lang = currentLang() || 'en';
    var idx = CONFIG.langs.indexOf(lang);
    return CONFIG.langs[(idx + 1) % CONFIG.langs.length];
  }

  function navigateTo(lang) {
    if (CONFIG.langs.indexOf(lang) === -1) return;
    try { localStorage.setItem('preferredLang', lang); } catch (e) {}
    var current = currentLang();
    var path;
    if (current) {
      path = window.location.pathname.replace(
        new RegExp('/' + current + '(/|$)'),
        '/' + lang + '/'
      );
    } else {
      path = '/' + lang + '/';
    }
    window.location.href = path + (window.location.search || '') + (window.location.hash || '');
  }

  function cycleLanguage() { navigateTo(nextLang()); }

  // ── GEO DETECT ────────────────────────────────────────────────────────────
  // api.country.is — completely cookie-free, returns only {ip, country}

  function geoDetect() {
    if (currentLang()) return;
    var saved;
    try { saved = localStorage.getItem('preferredLang'); } catch (e) {}
    if (saved && CONFIG.langs.indexOf(saved) !== -1) { navigateTo(saved); return; }

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (controller) controller.abort();
      navigateTo('en');
    }, CONFIG.geoTimeout);

    var opts = controller ? { signal: controller.signal } : {};
    fetch('https://api.country.is/', opts)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        clearTimeout(timer);
        var cc = data.country;
        if (cc === 'IT') navigateTo('it');
        else if (cc === 'AL' || cc === 'XK') navigateTo('sq');
        else navigateTo('en');
      })
      .catch(function () {
        clearTimeout(timer);
        navigateTo('en');
      });
  }

  // ── YEAR / EXPERIENCE ─────────────────────────────────────────────────────

  function fillYear() {
    var yr = new Date().getFullYear();
    var yearEls = document.querySelectorAll('[data-year]');
    for (var i = 0; i < yearEls.length; i++) yearEls[i].textContent = yr;

    var sinceEls = document.querySelectorAll('[data-years-since]');
    for (var j = 0; j < sinceEls.length; j++) {
      var since = parseInt(sinceEls[j].getAttribute('data-years-since'), 10) || CONFIG.startYear;
      var diff = yr - since;
      sinceEls[j].textContent = diff > 0 ? diff + '+' : '1+';
    }
  }

  // ── LANG BUTTON LABEL ─────────────────────────────────────────────────────

  function updateLangLabel() {
    var current = (currentLang() || 'en').toUpperCase();
    var els = document.querySelectorAll('[data-lang-label]');
    for (var i = 0; i < els.length; i++) els[i].textContent = current;
  }

  // ── SCROLL PROGRESS BAR ───────────────────────────────────────────────────
  // FIX: requestAnimationFrame throttle prevents layout thrash on mobile.
  // The bar uses transform:scaleX() which runs on the GPU compositor thread
  // with will-change:transform — zero paint cost on scroll.

  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    // Cache total once — reading scrollHeight inside RAF forces a synchronous
    // layout recalculation on every scroll tick (65 ms forced reflow on desktop).
    // Recalculate only on resize when the page height actually changes.
    var total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    window.addEventListener('resize', function () {
      total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    }, { passive: true });
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (total > 0) bar.style.transform = 'scaleX(' + (window.scrollY / total) + ')';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── BACK TO TOP ───────────────────────────────────────────────────────────

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── SCROLL ANIMATIONS ─────────────────────────────────────────────────────

  function initScrollAnimations() {
    var els = document.querySelectorAll('[data-animate]');
    if (!els.length || typeof IntersectionObserver === 'undefined') {
      for (var k = 0; k < els.length; k++) {
        els[k].style.opacity = '1';
        els[k].style.transform = 'none';
      }
      return;
    }
      var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    for (var i = 0; i < els.length; i++) {
      var rect = els[i].getBoundingClientRect();
      // Skip elements in viewport or already scrolled past — avoid hiding then re-showing
      if (rect.bottom <= 0 || (rect.top < window.innerHeight && rect.bottom > 0)) continue;
      els[i].style.opacity = '0';
      els[i].style.transform = 'translateY(24px)';
      els[i].style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      if (els[i].dataset.animateDelay) els[i].style.transitionDelay = els[i].dataset.animateDelay;
      observer.observe(els[i]);
    }
  }

  // ── ANIMATED COUNTERS ─────────────────────────────────────────────────────
  // Fires when the trust badges section scrolls into view (30% visible).
  // Targets: <p class="counter" data-target="350000" data-suffix="K+">
  // Counts 0 → target with cubic ease-out over 2 seconds.
  // Runs once per page load — IntersectionObserver disconnects after trigger.

  function initCounters() {
    if (typeof IntersectionObserver === 'undefined') return;

    var counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    // Observe the containing section so all three counters fire together
    var section = counters[0].closest('section') || counters[0].parentElement;
    if (!section) return;

    var animated = false;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animateCounter(el) {
      var target  = parseInt(el.getAttribute('data-target'), 10);
      var suffix  = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var startTime = performance.now();

      // Format: raw target value (e.g. 350000) → display "350K+"
      function format(val) {
        return Math.round(val / 1000) + suffix;
      }

      function tick(now) {
        var elapsed  = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        el.textContent = format(easeOut(progress) * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          // Snap to exact value — no floating-point drift
          el.textContent = Math.round(target / 1000) + suffix;
        }
      }

      requestAnimationFrame(tick);
    }

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        for (var i = 0; i < counters.length; i++) {
          animateCounter(counters[i]);
        }
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  // ── CAROUSEL ──────────────────────────────────────────────────────────────

  var _carousels = {};

  function updateCarouselUI(id) {
    var track = document.getElementById('carousel-track-' + id);
    var dotsContainer = document.getElementById('carousel-dots-' + id);
    var live = document.getElementById('carousel-live-' + id);
    if (!track) return;
    var state = _carousels[id];
    var count = track.children.length;
    if (count === 0) return;
    var idx = ((state.index % count) + count) % count;
    state.index = idx;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    if (live) live.textContent = (idx + 1) + ' / ' + count;
    if (dotsContainer) {
      var dots = dotsContainer.children;
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === idx);
        dots[i].setAttribute('aria-current', i === idx ? 'true' : 'false');
      }
    }
    var slides = track.children;
    for (var j = 0; j < slides.length; j++) {
      slides[j].setAttribute('aria-hidden', j !== idx ? 'true' : 'false');
    }
  }

  function moveCarousel(id, dir) {
    if (!_carousels[id]) _carousels[id] = { index: 0, timer: null };
    _carousels[id].index += dir;
    updateCarouselUI(id);
    restartAutoPlay(id);
  }

  function startAutoPlay(id) {
    stopAutoPlay(id);
    _carousels[id].timer = setInterval(function () {
      var c = document.querySelector('[data-carousel="' + id + '"]');
      if (c && c.matches(':hover')) return;
      moveCarousel(id, 1);
    }, 5000);
  }

  function stopAutoPlay(id) {
    if (_carousels[id] && _carousels[id].timer) {
      clearInterval(_carousels[id].timer);
      _carousels[id].timer = null;
    }
  }

  function restartAutoPlay(id) { stopAutoPlay(id); startAutoPlay(id); }

  function initCarousels() {
    var containers = document.querySelectorAll('[data-carousel]');
    for (var c = 0; c < containers.length; c++) {
      (function (container) {
        var id = container.dataset.carousel;
        _carousels[id] = { index: 0, timer: null };
        var track = document.getElementById('carousel-track-' + id);
        var dotsContainer = document.getElementById('carousel-dots-' + id);
        if (track && dotsContainer) {
          var count = track.children.length;
          dotsContainer.innerHTML = '';
          for (var i = 0; i < count; i++) {
            var btn = document.createElement('button');
            btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', 'Slide ' + (i + 1));
            btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');
            btn.dataset.slide = i;
            btn.dataset.carouselTarget = id;
            dotsContainer.appendChild(btn);
          }
        }
        updateCarouselUI(id);
        startAutoPlay(id);
        container.addEventListener('mouseenter', function () { stopAutoPlay(id); });
        container.addEventListener('mouseleave', function () { startAutoPlay(id); });
        container.addEventListener('touchstart', function () { stopAutoPlay(id); }, { passive: true });
        container.addEventListener('touchend', function () { restartAutoPlay(id); }, { passive: true });
      })(containers[c]);
    }
  }

  // ── FAQ ───────────────────────────────────────────────────────────────────

  function toggleFaq(q) {
    var a = q.nextElementSibling;
    if (!a || !a.classList.contains('faq-answer')) return;
    var isOpen = a.classList.contains('open');
    var openAnswers = document.querySelectorAll('.faq-answer.open');
    for (var i = 0; i < openAnswers.length; i++) {
      openAnswers[i].style.maxHeight = '0';
      openAnswers[i].classList.remove('open');
      var prevQ = openAnswers[i].previousElementSibling;
      if (prevQ) { prevQ.classList.remove('open'); prevQ.setAttribute('aria-expanded', 'false'); }
    }
    if (!isOpen) {
      a.style.maxHeight = '600px';
      a.classList.add('open');
      q.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  }

  // ── LAZY MAPS IFRAME ──────────────────────────────────────────────────────
  // Defers the Google Maps iframe until the user clicks the placeholder
  // OR the section scrolls within 200px of the viewport.
  // Removes ~400ms of blocking network time from the critical path.

  function initLazyMaps() {
    var wrappers = document.querySelectorAll('.map-wrapper[data-src]');
    for (var i = 0; i < wrappers.length; i++) {
      (function (wrapper) {
        var placeholder = wrapper.querySelector('.map-placeholder');
        function loadMap() {
          var src = wrapper.getAttribute('data-src');
          if (!src) return;
          wrapper.removeAttribute('data-src');
          var iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
          iframe.title = wrapper.getAttribute('data-title') || 'Map';
          wrapper.appendChild(iframe);
          if (placeholder) placeholder.classList.add('hidden');
          wrapper.removeEventListener('click', loadMap);
        }
        wrapper.addEventListener('click', loadMap);

        if (typeof IntersectionObserver !== 'undefined') {
          var obs = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) { loadMap(); obs.disconnect(); }
          }, { rootMargin: '200px' });
          obs.observe(wrapper);
        }
      })(wrappers[i]);
    }
  }

  // ── EVENT DELEGATION ──────────────────────────────────────────────────────

  function initEvents() {
    document.addEventListener('click', function (e) {
      var langBtn = e.target.closest('[data-action="toggle-lang"]');
      if (langBtn) { e.preventDefault(); e.stopPropagation(); cycleLanguage(); return; }

      var prev = e.target.closest('[data-action="carousel-prev"]');
      if (prev) { moveCarousel(prev.dataset.carouselId, -1); return; }
      var next = e.target.closest('[data-action="carousel-next"]');
      if (next) { moveCarousel(next.dataset.carouselId, 1); return; }

      var dot = e.target.closest('[data-carousel-target]');
      if (dot && dot.dataset.slide !== undefined) {
        var id = dot.dataset.carouselTarget;
        if (_carousels[id]) {
          _carousels[id].index = parseInt(dot.dataset.slide, 10);
          updateCarouselUI(id);
          restartAutoPlay(id);
        }
        return;
      }

      var galleryLink = e.target.closest('.gallery-grid a');
      if (galleryLink) { e.preventDefault(); return; }

      var faqQ = e.target.closest('.faq-question');
      if (faqQ) { toggleFaq(faqQ); return; }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var faqQ = e.target.closest('.faq-question');
        if (faqQ) { e.preventDefault(); toggleFaq(faqQ); }
        var dot = e.target.closest('[data-carousel-target]');
        if (dot) { e.preventDefault(); dot.click(); }
        var langBtn = e.target.closest('[data-action="toggle-lang"]');
        if (langBtn) { e.preventDefault(); cycleLanguage(); }
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        var container = e.target.closest('[data-carousel]');
        if (container) {
          e.preventDefault();
          moveCarousel(container.dataset.carousel, e.key === 'ArrowLeft' ? -1 : 1);
        }
      }
    });
  }

  // ── BOOT ──────────────────────────────────────────────────────────────────

  function boot() {
    // Async CSS: replace the inline onload handler (blocked by strict CSP).
    // shared.css is fetched with media="print" so it doesn't block rendering;
    // once the script runs we switch it to media="all" to apply the styles.
    var asyncCss = document.getElementById('shared-css-async');
    if (asyncCss) {
      if (asyncCss.sheet) {
        asyncCss.media = 'all';
      } else {
        asyncCss.addEventListener('load', function () { asyncCss.media = 'all'; });
      }
    }

    // Phase 1 — critical path: runs immediately at DOMContentLoaded.
    // These functions affect first paint, user interaction, or geo redirect.
    geoDetect();
    fillYear();
    updateLangLabel();
    initProgressBar();
    initBackToTop();
    initLazyMaps();
    initEvents();

    // Phase 2 — deferred: visual enhancements that do not affect first paint.
    // Pushed to browser idle time to avoid extending the boot long task and
    // reduce TBT (the main cause of 6 long tasks on mobile Lighthouse).
    function deferred() {
      initScrollAnimations();
      initCounters();
      initCarousels();
    }
    if ('requestIdleCallback' in window) {
      requestIdleCallback(deferred, { timeout: 2000 });
    } else {
      setTimeout(deferred, 300); // Safari / older browser fallback
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
