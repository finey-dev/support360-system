// Service worker for PWA functionality

// Cache version identifiers
const STATIC_CACHE_NAME = 'helpdesk-static-v1';
const DYNAMIC_CACHE_NAME = 'helpdesk-dynamic-v1';
const IMAGES_CACHE_NAME = 'helpdesk-images-v1';

// Resources to pre-cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Pre-cache error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGES_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => !currentCaches.includes(cacheName))
            .map(cacheName => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Now ready to handle fetches');
        return self.clients.claim();
      })
  );
});

// Helper to determine if a request is for an image
const isImageRequest = (request) => {
  return request.destination === 'image' || 
         (request.url && (request.url.endsWith('.png') || 
                         request.url.endsWith('.jpg') || 
                         request.url.endsWith('.jpeg') || 
                         request.url.endsWith('.svg') || 
                         request.url.endsWith('.gif')));
};

// Helper to determine if a request is for an API
const isApiRequest = (request) => {
  return request.url.includes('/api/');
};

// Helper to determine if a request is for HTML navigation
const isHtmlRequest = (request) => {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && 
          request.headers.get('accept') && 
          request.headers.get('accept').includes('text/html'));
};

// Fetch event - custom caching strategy based on request type
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Skip cross-origin requests and non-GET requests
  if (!request.url.startsWith(self.location.origin) || request.method !== 'GET') {
    return;
  }
  
  // Strategy for HTML pages - Network first, fallback to cache
  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the latest version
          const clonedResponse = response.clone();
          caches.open(STATIC_CACHE_NAME)
            .then(cache => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Serving HTML from cache');
          return caches.match(request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/');
            });
        })
    );
    return;
  }
  
  // Strategy for images - Cache first, fallback to network
  if (isImageRequest(request)) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Clone the response
              const responseToCache = response.clone();
              caches.open(IMAGES_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
                
              return response;
            });
        })
    );
    return;
  }
  
  // Default strategy - Stale-while-revalidate
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached response immediately
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Update cache with fresh response
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });
              
            return networkResponse;
          })
          .catch(error => {
            console.log('[Service Worker] Network request failed:', error);
          });
          
        return cachedResponse || fetchPromise;
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skip waiting message received');
    self.skipWaiting();
  }
});

// Push notification handler
self.addEventListener('push', event => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'HelpDesk Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: data.url || '/'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a window client already exists, focus it
        for (const client of clientList) {
          if (client.url === event.notification.data && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data);
        }
      })
  );
});

// Periodic background sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    console.log('[Service Worker] Periodic sync: update content');
    event.waitUntil(
      // Here you would update content, clear old caches, etc.
      caches.open(DYNAMIC_CACHE_NAME)
        .then(cache => {
          // Update critical resources
        })
    );
  }
});

console.log('[Service Worker] Script loaded');
