const CACHE_NAME = "cfc-na-palma-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",

  "./auditoria.png",
  "./pericia.png",
  "./contabilidade-publica.png",
  "./contabilidade-custos.png",
  "./etica.png",
  "./contabilidade-geral.png",
  "./estatistica.png",
  "./direito.png",
  "./matematica-financeira.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});