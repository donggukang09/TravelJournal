const CACHE_NAME = 'travel-journal-v3';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME && k.startsWith('travel-')).map(k => caches.delete(k))
  )));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  // Only handle travel-journal related requests
  const url = e.request.url;
  if (url.includes('cat-journal') || url.includes('cat-sw') || url.includes('cat-manifest') || url.includes('cat-icon')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
