const CACHE_NAME = "cfc-na-palma-v11";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./contabilidade-geral.html",
  "./manifest.json",
  "./auditoria.png",
  "./pericia_contabil.png",
  "./contabilidade_publica.png",
  "./contabilidade_de_custos.png",
  "./etica_contabil.png",
  "./contabilidade_geral.png",
  "./direito.png",
  "./icon-192.png",
  "./icon-512.png"
];

// Instala o novo cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Apaga caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// Busca primeiro a versão mais nova na internet
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
