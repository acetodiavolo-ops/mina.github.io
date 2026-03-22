'use strict';

var CACHE = 'iglisi-v5';

var PRECACHE = [
  '/en/',
  '/sq/',
  '/it/',
  '/en/blog/',
  '/it/blog/',
  '/sq/blog/',
  '/en/blog/watch-battery-guide.html',
  '/en/blog/watch-service-signs.html',
  '/it/blog/guida-batteria-orologio.html',
  '/it/blog/segni-revisione-orologio.html',
  '/sq/blog/guide-bateria-ores.html',
  '/sq/blog/shenjat-riparimit-ores.html',
  '/shared.css?v=14',
  '/shared.js?v=5',
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

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'error') return response;
        var clone = response.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        return response;
      }).catch(function() {
        /* Offline fallback: return cached homepage for navigation requests */
        if (e.request.mode === 'navigate') return caches.match('/en/');
      });
    })
  );
});
