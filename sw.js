'use strict';

var CACHE = 'iglisi-v56';

var PRECACHE = [
  '/offline.html',
  '/shared.css?v=37',
  '/shared.js?v=20',
  '/cookie.js',
  '/webfonts/inter.woff2?v=2',
  '/webfonts/cormorant-garamond.woff2?v=2',
  '/webfonts/fa-solid-900.woff2?v=2',
  '/webfonts/fa-brands-400.woff2?v=2',
  'https://watch.al/favicon.png',
  'https://watch.al/favicon.webp'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      /* Cache each item individually so one failure can't break the whole install */
      return Promise.all(
        PRECACHE.map(function(url) {
          return c.add(url).catch(function() {});
        })
      );
    }).then(function() { return self.skipWaiting(); })
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

  if (isNav) {
    /* Navigation: always network — never cache HTML so deploys take effect immediately */
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match('/offline.html');
      })
    );
    return;
  }

  /* Assets: cache-first, fetch only if missing — no fallback for CSS so the
     browser handles the error natively rather than receiving a blank stylesheet */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        if (response && response.status === 200 && response.type !== 'error') {
          var clone = response.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); }).catch(function() {});
        }
        return response;
      });
    })
  );
});
