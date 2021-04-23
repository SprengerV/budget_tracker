// install
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open('static').then( cache => {
            return cache.addAll([
                './',
                './index.html',
                './index.js',
                './styles.css',
                './db.js',
                './icons/icon-192x192.png',
                './icons/icon-512x512.png'
            ]);
        })
    );
    self.skipWaiting();
});
// retrieve from cache
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then( res => {
            return res || fetch(evt.request);
        })
    );
});