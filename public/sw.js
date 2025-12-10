const CACHE_VERSION = 'v1.2.0'; // Updated to exclude CDN resources from service worker
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const CACHE_ALLOWLIST = [STATIC_CACHE, IMAGE_CACHE];

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/android-icon-192x192.png',
  '/apple-icon-180x180.png',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('[Service Worker] Failed to cache static assets:', err);
      });
    }).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!CACHE_ALLOWLIST.includes(cache)) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Claim clients only after activation is complete
      console.log('[Service Worker] Claiming clients...');
      return self.clients.claim().catch((err) => {
        console.warn('[Service Worker] Could not claim clients:', err);
      });
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Skip Google Fonts and other cross-origin font requests - let browser handle them
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(woff|woff2|ttf|eot|otf)$/)
  ) {
    // Let browser handle fonts with its own cache (faster and CORS-safe)
    return;
  }

  // Skip CDN resources (Bootstrap, etc.) - let browser handle them directly
  // This avoids CORS issues, integrity hash problems, and service worker conflicts
  if (
    url.hostname === 'cdn.jsdelivr.net' ||
    url.hostname === 'cdnjs.cloudflare.com' ||
    url.hostname === 'unpkg.com' ||
    url.hostname === 'cdn.jsdelivr.com'
  ) {
    // Let browser handle CDN resources directly (no service worker interference)
    return;
  }

  // HTML pages - always fetch network for latest content
  if (
    request.headers.get('accept')?.includes('text/html') ||
    request.destination === 'document'
  ) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          `<!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Offline - CUMI</title>
                  <style>
                    body { 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      min-height: 100vh; 
                      margin: 0;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      text-align: center;
                    }
                    .container { max-width: 500px; padding: 2rem; }
                    h1 { font-size: 2.5rem; margin-bottom: 1rem; }
                    p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
                    button {
                      padding: 12px 32px;
                      font-size: 1rem;
                      background: white;
                      color: #667eea;
                      border: none;
                      border-radius: 24px;
                      cursor: pointer;
                      font-weight: 600;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>📡 You're Offline</h1>
                    <p>No internet connection. Please check your network and try again.</p>
                    <button onclick="window.location.reload()">Retry Connection</button>
                  </div>
                </body>
              </html>`,
          {
            headers: { 'Content-Type': 'text/html' },
          }
        )
      )
    );
    return;
  }

  // Static assets (_next/static) and essential assets - cache-first
  if (url.pathname.startsWith('/_next/static/') || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // Images - network-first with tiny cache fallback
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(IMAGE_CACHE).then(async (cache) => {
            await cache.put(request, cloned);
            limitCacheEntries(cache, 40);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Other requests - network only for latest content
  event.respondWith(
    fetch(request)
      .catch(() => {
        // If fetch fails, try cache, but always return a Response
        return caches.match(request).then((cachedResponse) => {
          // If no cache match, return a minimal error response instead of undefined
          if (!cachedResponse) {
            return new Response('Resource not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          }
          return cachedResponse;
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[Service Worker] Syncing data...');
  // Implement sync logic here
}

async function limitCacheEntries(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    return limitCacheEntries(cache, maxItems);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'CUMI Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/android-icon-192x192.png',
    badge: '/android-icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

