/**
 * Iglisi Watch & Key — shared.js
 * Handles: language switching, carousel, FAQ, scroll progress,
 *          back-to-top, lightbox init, scroll animations, geo-detection.
 *
 * Architecture: Pure IIFE — zero global pollution except the two symbols
 * that Lightbox2 needs (lightbox) which is a third-party global.
 */
(function () {
  'use strict';

  // ─── CENTRALISED CONFIG ──────────────────────────────────────────────────
  const CONFIG = Object.freeze({
    phone: { primary: '+355676360510', secondary: '+355675716090' },
    email: 'iglisi@watch.al',
    social: {
      instagram: 'https://instagram.com/iglisiwk',
      facebook: 'https://www.facebook.com/share/14UY9nkU9EH/',
      whatsapp: 'https://wa.me/355676360510',
    },
    startYear: 2002,
    placeId: 'ChIJU3JyAljB0RMRdoAB2vYR5oo',
    mapCoords: '41.3201564,19.4453564',
    langs: ['en', 'sq', 'it'],
    geoTimeout: 3000,
  });

  // ─── LANGUAGE DETECTION & SWITCHING ─────────────────────────────────────
  /**
   * Returns the current language derived from the pathname.
   * /en/ → 'en', /sq/ → 'sq', /it/ → 'it', anything else → null
   */
  function currentLang() {
    const match = window.location.pathname.match(/^\/(en|sq|it)(\/|$)/);
    return match ? match[1] : null;
  }

  function navigateTo(lang) {
    if (!CONFIG.langs.includes(lang)) return;
    // Preserve any hash/anchor the user was on
    const hash = window.location.hash || '';
    // Replace the current lang segment if present, else go to root lang path
    const current = currentLang();
    let newPath;
    if (current) {
      newPath = window.location.pathname.replace('/' + current + '/', '/' + lang + '/');
    } else {
      newPath = '/' + lang + '/';
    }
    localStorage.setItem('preferredLang', lang);
    window.location.href = newPath + hash;
  }

  /** Cycle: en → sq → it → en */
  function cycleLanguage() {
    const lang = currentLang() || 'en';
    const idx = CONFIG.langs.indexOf(lang);
    const next = CONFIG.langs[(idx + 1) % CONFIG.langs.length];
    navigateTo(next);
  }

  /** Returns the current language code in uppercase (EN, SQ, IT) */
  function currentLangLabel() {
    const lang = currentLang() || 'en';
    return lang.toUpperCase();
  }

  // ─── GEO DETECTION (fetch + AbortController, no JSONP) ──────────────────
  function geoDetect() {
    // Only run on the root page (not inside a lang subfolder)
    if (currentLang()) return;

    const saved = localStorage.getItem('preferredLang');
    if (saved && CONFIG.langs.includes(saved)) {
      navigateTo(saved);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.geoTimeout);

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        clearTimeout(timer);
        const cc = data.country_code;
        let lang = 'en';
        if (cc === 'IT') lang = 'it';
        else if (cc === 'AL' || cc === 'XK') lang = 'sq';
        navigateTo(lang);
      })
      .catch(function () {
        clearTimeout(timer);
        navigateTo('en');
      });
  }

  // ─── DYNAMIC YEAR ────────────────────────────────────────────────────────
  function fillYear() {
    const yr = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = yr;
    });
    document.querySelectorAll('[data-years-since]').forEach(function (el) {
      const since = parseInt(el.dataset.yearsSince, 10) || CONFIG.startYear;
      el.textContent = yr - since + '+';
    });
  }

  // ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────────
  function initProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (total <= 0) return;
      bar.style.width = ((window.scrollY / total) * 100) + '%';
    }, { passive: true });
  }

  // ─── BACK TO TOP ─────────────────────────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── SCROLL ANIMATIONS (replaces AOS) ───────────────────────────────────
  function initScrollAnimations() {
    const els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;

    // Add base styles so elements start invisible
    els.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      const delay = el.dataset.animateDelay;
      if (delay) el.style.transitionDelay = delay;
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  // ─── CAROUSEL ────────────────────────────────────────────────────────────
  const _carousels = {}; // { id: { index, timer } }

  function getSlideCount(id) {
    const track = document.getElementById('carousel-track-' + id);
    return track ? track.children.length : 0;
  }

  function updateCarouselUI(id) {
    const track = document.getElementById('carousel-track-' + id);
    const dotsContainer = document.getElementById('carousel-dots-' + id);
    if (!track) return;

    const state = _carousels[id];
    const count = track.children.length;
    const idx = ((state.index % count) + count) % count;
    state.index = idx;

    track.style.transform = 'translateX(-' + (idx * 100) + '%)';

    // Update live region for screen readers
    const live = document.getElementById('carousel-live-' + id);
    if (live) live.textContent = 'Review ' + (idx + 1) + ' of ' + count;

    // Update dots
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach(function (dot, i) {
        const active = i === idx;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    // Update slide aria-hidden
    Array.from(track.children).forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', i !== idx ? 'true' : 'false');
    });
  }

  function moveCarousel(id, direction) {
    if (!_carousels[id]) _carousels[id] = { index: 0, timer: null };
    _carousels[id].index += direction;
    updateCarouselUI(id);
    restartAutoPlay(id);
  }

  function startAutoPlay(id) {
    stopAutoPlay(id);
    _carousels[id].timer = setInterval(function () {
      const container = document.querySelector('[data-carousel="' + id + '"]');
      // Pause if user is hovering
      if (container && container.matches(':hover')) return;
      moveCarousel(id, 1);
    }, 5000);
  }

  function stopAutoPlay(id) {
    if (_carousels[id] && _carousels[id].timer) {
      clearInterval(_carousels[id].timer);
      _carousels[id].timer = null;
    }
  }

  function restartAutoPlay(id) {
    stopAutoPlay(id);
    startAutoPlay(id);
  }

  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (container) {
      const id = container.dataset.carousel;
      _carousels[id] = { index: 0, timer: null };

      // Build dots from existing slides
      const track = document.getElementById('carousel-track-' + id);
      const dotsContainer = document.getElementById('carousel-dots-' + id);
      if (track && dotsContainer) {
        const count = track.children.length;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
          const btn = document.createElement('button');
          btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
          btn.setAttribute('aria-label', 'Go to review ' + (i + 1));
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
    });
  }

  // ─── FAQ ACCORDION ───────────────────────────────────────────────────────
  function toggleFaq(questionEl) {
    const answer = questionEl.nextElementSibling;
    if (!answer || !answer.classList.contains('faq-answer')) return;
    const isOpen = answer.classList.contains('open');

    // Close all others first (accordion behaviour)
    document.querySelectorAll('.faq-answer.open').forEach(function (a) {
      a.style.maxHeight = '0';
      a.classList.remove('open');
      if (a.previousElementSibling) {
        a.previousElementSibling.classList.remove('open');
        a.previousElementSibling.setAttribute('aria-expanded', 'false');
      }
    });

    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.classList.add('open');
      questionEl.classList.add('open');
      questionEl.setAttribute('aria-expanded', 'true');
    }
  }

  // ─── EVENT DELEGATION ────────────────────────────────────────────────────
  function initEventDelegation() {
    document.addEventListener('click', function (e) {
      // Language toggle
      if (e.target.closest('[data-action="toggle-lang"]')) {
        e.preventDefault();
        cycleLanguage();
        return;
      }

      // Carousel prev/next
      const prevBtn = e.target.closest('[data-action="carousel-prev"]');
      if (prevBtn) {
        const id = prevBtn.dataset.carouselId;
        moveCarousel(id, -1);
        return;
      }
      const nextBtn = e.target.closest('[data-action="carousel-next"]');
      if (nextBtn) {
        const id = nextBtn.dataset.carouselId;
        moveCarousel(id, 1);
        return;
      }

      // Carousel dot
      const dot = e.target.closest('[data-carousel-target]');
      if (dot && dot.dataset.slide !== undefined) {
        const id = dot.dataset.carouselTarget;
        if (_carousels[id]) {
          _carousels[id].index = parseInt(dot.dataset.slide, 10);
          updateCarouselUI(id);
          restartAutoPlay(id);
        }
        return;
      }

      // FAQ question
      const faqQ = e.target.closest('.faq-question');
      if (faqQ) {
        toggleFaq(faqQ);
        return;
      }
    });

    // Keyboard: FAQ and carousel dot
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const faqQ = e.target.closest('.faq-question');
        if (faqQ) {
          e.preventDefault();
          toggleFaq(faqQ);
        }
        const dot = e.target.closest('[data-carousel-target]');
        if (dot) {
          e.preventDefault();
          dot.click();
        }
      }
      // Arrow keys for carousel when focused inside
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const container = e.target.closest('[data-carousel]');
        if (container) {
          e.preventDefault();
          moveCarousel(container.dataset.carousel, e.key === 'ArrowLeft' ? -1 : 1);
        }
      }
    });
  }

  // ─── LIGHTBOX ────────────────────────────────────────────────────────────
  function initLightbox() {
    if (typeof lightbox !== 'undefined' && lightbox.option) {
      lightbox.option({
        resizeDuration: 200,
        wrapAround: true,
        alwaysShowNavOnTouchDevices: true,
        showImageNumberLabel: true,
        albumLabel: 'Image %1 of %2',
      });
    }
  }

  // ─── LANG BUTTON LABEL ──────────────────────────────────────────────────
  function updateLangLabel() {
    document.querySelectorAll('[data-lang-label]').forEach(function (el) {
      el.textContent = currentLangLabel();
    });
  }

  // ─── BOOT ────────────────────────────────────────────────────────────────
  function boot() {
    geoDetect();
    fillYear();
    updateLangLabel();
    initProgressBar();
    initBackToTop();
    initScrollAnimations();
    initCarousels();
    initEventDelegation();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
