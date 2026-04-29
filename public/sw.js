const CACHE_NAME = 'habit-tracker-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Instantly activate!
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache the core routes
      return cache.addAll(['/', '/login', '/signup', '/dashboard']);
    }).catch(err => console.log('Cache error', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Take control of the page immediately
});

self.addEventListener('fetch', (event) => {
  // Only intercept normal page navigations
  if (event.request.mode === 'navigate' || event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});