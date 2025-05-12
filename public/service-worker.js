
// Service worker for PWA functionality

const CACHE_NAME = 'HelpDesk-v1';
const RUNTIME = 'runtime';

// Resources to pre-cache
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => !currentCaches.includes(cacheName))
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - stale-while-revalidate strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // If we have a match in the cache, return it, but also update the cache in the background
            const fetchPromise = fetch(event.request)
              .then(response => {
                // Don't cache responses that aren't successful or aren't GET requests
                if (!response || response.status !== 200 || event.request.method !== 'GET') {
                  return response;
                }

                // Clone the response as it's a stream that can only be consumed once
                const responseToCache = response.clone();

                caches.open(RUNTIME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });

                return response;
              })
              .catch(err => {
                console.log('Fetch failed; returning cached response instead', err);
              });

            return cachedResponse;
          }

          // If not in cache, fetch from network
          return fetch(event.request)
            .then(response => {
              // Don't cache responses that aren't successful or aren't GET requests
              if (!response || response.status !== 200 || event.request.method !== 'GET') {
                return response;
              }

              // Clone the response as it's a stream that can only be consumed once
              const responseToCache = response.clone();

              caches.open(RUNTIME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            });
        })
    );
  }
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
