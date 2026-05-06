const CACHE_NAME = 'travel-journal-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 항상 네트워크 우선 → 실패 시 캐시
  e.respondWith(
    fetch(e.request).then(r => {
      // 성공하면 캐시에도 저장
      if (r.ok) {
        const clone = r.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
