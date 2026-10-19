// Visual Stock - service worker
// Ubah VERSION setiap kali file aplikasi diganti agar pengguna mendapat tombol "Muat ulang".
const VERSION = 'v1';
const CACHE = 'visual-stock-' + VERSION;
const ASSETS = ['index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const NAV_TIMEOUT = 3000; // ms: jaringan lambat -> pakai cache

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))
    )
  );
  // tidak skipWaiting otomatis: versi baru menunggu sampai pengguna menekan "Muat ulang"
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('visual-stock-') && k !== CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function fromCache(request) {
  return caches.match(request, { ignoreSearch: true });
}

function refresh(request) {
  return fetch(request).then((res) => {
    if (res && res.ok && res.type === 'basic') {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
    }
    return res;
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Halaman: jaringan dulu (agar update cepat), batas 3 detik, lalu cache
  if (req.mode === 'navigate') {
    event.respondWith(
      new Promise((resolve) => {
        let done = false;
        const fallback = () =>
          caches.match('index.html').then((r) => r || Response.error());
        const timer = setTimeout(() => {
          if (done) return;
          done = true;
          fallback().then(resolve);
        }, NAV_TIMEOUT);
        fetch(req)
          .then((res) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put('index.html', copy));
            }
            resolve(res);
          })
          .catch(() => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            fallback().then(resolve);
          });
      })
    );
    return;
  }

  // File lain: cache dulu, perbarui di latar belakang
  event.respondWith(
    fromCache(req).then((cached) => {
      const net = refresh(req).catch(() => null);
      if (cached) {
        event.waitUntil(net);
        return cached;
      }
      return net.then((res) => res || Response.error());
    })
  );
});
