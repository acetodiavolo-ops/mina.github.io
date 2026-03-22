'use strict';

var CACHE = 'iglisi-v17';

var PRECACHE = [
  '/en/',
  '/sq/',
  '/it/',
  '/en/blog/',
  '/it/blog/',
  '/sq/blog/',
  '/en/blog/watch-battery-guide.html',
  '/en/blog/watch-service-signs.html',
  '/en/blog/watch-strap-care.html',
  '/en/blog/key-duplication-guide.html',
  '/it/blog/guida-batteria-orologio.html',
  '/it/blog/segni-revisione-orologio.html',
  '/it/blog/cura-cinturino-orologio.html',
  '/it/blog/guida-duplicato-chiavi.html',
  '/sq/blog/guide-bateria-ores.html',
  '/sq/blog/shenjat-riparimit-ores.html',
  '/sq/blog/kujdesi-brezit-ores.html',
  '/sq/blog/guide-kopjim-celesi.html',
  '/shared.css?v=23',
  '/shared.js?v=6',
  '/cookie.js',
  '/webfonts/inter.woff2?v=2',
  '/webfonts/cormorant-garamond.woff2?v=2',
  '/webfonts/fa-solid-900.woff2?v=2',
  '/webfonts/fa-brands-400.woff2?v=2',
  'https://watch.al/favicon.png',
  'https://watch.al/favicon.webp',
  'https://watch.al/0.raw.githubusercontent.com.webp'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c) { return c.addAll(PRECACHE); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  /* Skip cross-origin requests that aren't our preloaded assets */
  var url = e.request.url;
  var isOurs = url.startsWith(self.location.origin) || url.startsWith('https://watch.al/');
  if (!isOurs) return;

  var isNav = e.request.mode === 'navigate';

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var networkFetch = fetch(e.request).then(function(response) {
        if (response && response.status === 200 && response.type !== 'error') {
          var clone = response.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); }).catch(function() {});
        }
        return response;
      }).catch(function() {
        /* Offline fallback: return cached homepage for navigation requests */
        if (isNav) return caches.match('/en/');
      });

      /* Navigation: serve cached immediately, revalidate in background (stale-while-revalidate) */
      if (cached && isNav) {
        e.waitUntil(networkFetch);
        return cached;
      }

      /* Assets: cache-first, fetch only if missing */
      return cached || networkFetch;
    })
  );
});
