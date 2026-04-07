'use strict';

var CACHE = 'iglisi-v58';

var PRECACHE = [
  '/offline.html',
  '/shared.css?v=40',
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

  var url = e.request.url;
  var isOurs = url.startsWith(self.location.origin) || url.startsWith('https://watch.al/');
  if (!isOurs) return;

  var isNav = e.request.mode === 'navigate';

  /* Images and fonts: cache-first (content never changes, only new files added) */
  var isStatic = /\.(woff2?|ttf|eot|png|webp|jpg|jpeg|gif|svg|ico)(\?|$)/i.test(url);

  if (isStatic && !isNav) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE).then(function(c) { c.put(e.request, clone); }).catch(function() {});
          }
          return response;
        });
      })
    );
    return;
  }

  /* HTML, JS, CSS: network-first — always serve latest, cache as fallback */
  e.respondWith(
    fetch(e.request).then(function(response) {
      if (!isNav && response && response.status === 200) {
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
});
