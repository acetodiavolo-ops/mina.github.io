'use strict';

var CACHE = 'iglisi-v33';

var PRECACHE = [
  '/offline.html',
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
  '/en/blog/watch-water-resistance.html',
  '/en/blog/watch-cleaning-guide.html',
  '/it/blog/guida-batteria-orologio.html',
  '/it/blog/segni-revisione-orologio.html',
  '/it/blog/cura-cinturino-orologio.html',
  '/it/blog/guida-duplicato-chiavi.html',
  '/it/blog/impermeabilita-orologio.html',
  '/it/blog/guida-pulizia-orologio.html',
  '/sq/blog/guide-bateria-ores.html',
  '/sq/blog/shenjat-riparimit-ores.html',
  '/sq/blog/kujdesi-brezit-ores.html',
  '/sq/blog/guide-kopjim-celesi.html',
  '/sq/blog/rezistenca-ujes-ores.html',
  '/sq/blog/guide-pastrimit-ores.html',
  '/shared.css?v=26',
  '/shared.js?v=12',
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
    /* Navigation: network-first so users always get fresh HTML after a deploy */
    e.respondWith(
      fetch(e.request).then(function(response) {
        if (response && response.status === 200 && response.type !== 'error') {
          var clone = response.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); }).catch(function() {});
        }
        return response;
      }).catch(function() {
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('/offline.html');
        });
      })
    );
    return;
  }

  /* Assets: cache-first, fetch only if missing */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        if (response && response.status === 200 && response.type !== 'error') {
          var clone = response.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); }).catch(function() {});
        }
        return response;
      }).catch(function() {
        var dest = e.request.destination;
        if (dest === 'style') return new Response('', {headers:{'Content-Type':'text/css','Cache-Control':'no-store'}});
      });
    })
  );
});
