/**
 * Iglisi Watch & Key — shared.js
 * Fixed: lang toggle, years-since calculation, geo-redirect, carousel, FAQ.
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
      // Replace the lang segment in the current path
      path = window.location.pathname.replace(
        new RegExp('/' + current + '(/|$)'),
        '/' + lang + '/'
      );
    } else {
      path = '/' + lang + '/';
    }
    window.location.href = path + (window.location.search || '') + (window.location.hash || '');
  }

  function cycleLanguage() {
    navigateTo(nextLang());
  }

  // ── GEO DETECT ────────────────────────────────────────────────────────────

  function geoDetect() {
    if (currentLang()) return; // already on a lang page
    var saved;
    try { saved = localStorage.getItem('preferredLang'); } catch (e) {}
    if (saved && CONFIG.langs.indexOf(saved) !== -1) {
      navigateTo(saved);
      return;
    }
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (controller) controller.abort();
      navigateTo('en');
    }, CONFIG.geoTimeout);

    var opts = controller ? { signal: controller.signal } : {};
    fetch('https://ipapi.co/json/', opts)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        clearTimeout(timer);
        var cc = data.country_code;
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
  // FIX: was sometimes running before DOM ready — now always safe via DOMContentLoaded.

  function fillYear() {
    var yr = new Date().getFullYear();

    // Copyright year
    var yearEls = document.querySelectorAll('[data-year]');
    for (var i = 0; i < yearEls.length; i++) {
      yearEls[i].textContent = yr;
    }

    // "24+ years since 2002" badges
    var sinceEls = document.querySelectorAll('[data-years-since]');
    for (var j = 0; j < sinceEls.length; j++) {
      var since = parseInt(sinceEls[j].getAttribute('data-years-since'), 10) || CONFIG.startYear;
      var diff = yr - since;
      sinceEls[j].textContent = diff > 0 ? diff + '+' : '1+';
    }
  }

  // ── LANG BUTTON LABEL ─────────────────────────────────────────────────────
  // Shows the CURRENT language so the button acts as a language indicator.

  function updateLangLabel() {
    var current = (currentLang() || 'en').toUpperCase();
    var els = document.querySelectorAll('[data-lang-label]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = current;
    }
  }

  // ── SCROLL PROGRESS ───────────────────────────────────────────────────────

  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (total > 0) bar.style.width = ((window.scrollY / total) * 100) + '%';
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
      // Fallback: just show everything
      for (var k = 0; k < els.length; k++) {
        els[k].style.opacity = '1';
        els[k].style.transform = 'none';
      }
      return;
    }
    for (var i = 0; i < els.length; i++) {
      els[i].style.opacity = '0';
      els[i].style.transform = 'translateY(24px)';
      els[i].style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      if (els[i].dataset.animateDelay) {
        els[i].style.transitionDelay = els[i].dataset.animateDelay;
      }
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
    for (var j = 0; j < els.length; j++) observer.observe(els[j]);
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
    // Close all open answers first
    var openAnswers = document.querySelectorAll('.faq-answer.open');
    for (var i = 0; i < openAnswers.length; i++) {
      openAnswers[i].style.maxHeight = '0';
      openAnswers[i].classList.remove('open');
      var prevQ = openAnswers[i].previousElementSibling;
      if (prevQ) {
        prevQ.classList.remove('open');
        prevQ.setAttribute('aria-expanded', 'false');
      }
    }
    if (!isOpen) {
      a.style.maxHeight = a.scrollHeight + 'px';
      a.classList.add('open');
      q.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  }

  // ── EVENT DELEGATION ──────────────────────────────────────────────────────

  function initEvents() {
    document.addEventListener('click', function (e) {
      // Lang toggle — FIX: was not preventing default on button correctly
      var langBtn = e.target.closest('[data-action="toggle-lang"]');
      if (langBtn) {
        e.preventDefault();
        e.stopPropagation();
        cycleLanguage();
        return;
      }
      // Carousel prev/next
      var prev = e.target.closest('[data-action="carousel-prev"]');
      if (prev) { moveCarousel(prev.dataset.carouselId, -1); return; }
      var next = e.target.closest('[data-action="carousel-next"]');
      if (next) { moveCarousel(next.dataset.carouselId, 1); return; }
      // Carousel dot
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
      // Gallery — block all clicks, do nothing
      var galleryLink = e.target.closest('.gallery-grid a');
      if (galleryLink) { e.preventDefault(); return; }
      // FAQ
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
    geoDetect();
    fillYear();
    updateLangLabel();
    initProgressBar();
    initBackToTop();
    initScrollAnimations();
    initCarousels();
    initEvents();
  }

  // FIX: Always wait for DOMContentLoaded to ensure all [data-years-since]
  // and [data-lang-label] elements exist before trying to fill them.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
