self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('flip-clock-cache-v1').then((cache) => {
      return cache.addAll([
        'index.html',
        'style.css',
        'main.js',
        'jscolor.js',
        'static/android-chrome-192x192.png',
        'static/android-chrome-512x512.png',
        'static/apple-touch-icon.png',
        'static/favicon-16x16.png',
        'static/favicon-32x32.png',
        'static/favicon.ico',
        'static/icon.png',
        'site.webmanifest'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
