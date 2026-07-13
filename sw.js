// Service Worker — "immer frisch, wenn online; Cache als Offline-Reserve".
//
// Strategie:
//  - Navigation (die Seite selbst): NETWORK-FIRST → bei Offline aus dem Cache.
//    So bekommst du beim Öffnen mit Internet immer die neueste Version.
//  - Code (js/css/json/html): NETWORK-FIRST → online immer die neueste Version;
//    der Cache dient nur als Offline-Reserve. So erscheinen Updates sofort.
//  - Bilder/Medien (webp/png/…): CACHE-FIRST + Hintergrund-Refresh → schnell,
//    da sie sich selten ändern; neue Bilder werden nachgezogen.
//  - Offline: es wird die zuletzt gecachte Version ausgeliefert.
//
// Beim Ausbauen der App muss hier nichts geändert werden — geänderte Dateien
// werden automatisch nachgezogen. (CACHE-Version nur bumpen, wenn man alle
// Caches hart leeren will.)

const CACHE = 'gezellig-v69';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './srs.js',
  './speech.js',
  './progress.js',
  './vocab-bank.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './illustrations/hero.webp',
  './illustrations/ladescreen.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === location.origin;

  // 1) Navigationen: Netzwerk zuerst, damit die App aktuell ist; offline aus dem Cache.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          caches.open(CACHE).then(c => c.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // 2) Eigene Dateien.
  if (sameOrigin) {
    const isMedia = /\.(webp|png|jpe?g|gif|svg|woff2?|ttf|mp3|ico)$/i.test(new URL(req.url).pathname);
    if (isMedia) {
      // Bilder/Medien: cache-first + Hintergrund-Refresh (schnell, offline-fest).
      e.respondWith(
        caches.match(req).then(cached => {
          const network = fetch(req)
            .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
            .catch(() => cached);
          return cached || network;
        })
      );
    } else {
      // Code (js/css/json/html): network-first, Cache nur als Offline-Reserve.
      e.respondWith(
        fetch(req)
          .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
          .catch(() => caches.match(req))
      );
    }
    return;
  }

  // 3) Fremde Hosts (z. B. der KI-Proxy): einfach durchreichen, nicht cachen.
});
