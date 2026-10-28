// VELOLOG Signature Studio - Progressive Web App Service Worker
const CACHE_NAME = 'velolog-studio-v1';
const PRECACHE_URLS = [
  '/',
  '/signature-studio',
  '/about',
  '/team',
  '/services',
  '/contact',
  '/styles.css',
  '/common.js',
  '/data.js',
  '/generator.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.png',
  '/logo/file%20-03.png'
];

// Install: cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('PWA Precache partial fail (non-blocking):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for dynamic freshness with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses for local static files
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to home or signature studio if navigation request
          if (event.request.mode === 'navigate') {
            return caches.match('/signature-studio');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
