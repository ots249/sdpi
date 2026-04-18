const CACHE_NAME = 'dpi-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',        // ঠিক করা হয়েছে (styles.css ছিল)
  '/script.js',
  '/manifest.json',
  '/about.html',
  '/privacy.html',
  '/404.html'
];

// ইনস্টলেশনে ক্যাশে সংরক্ষণ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache addAll error:', err);
      })
  );
});

// রিকোয়েস্ট হ্যান্ডলিং - Network First strategy for better updates
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Update cache with new response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If network fails, serve from cache
        return caches.match(event.request);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
