```js
const CACHE_NAME = "cfc-na-palma-v7";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./contabilidade-geral.html",
  "./manifest.json",

  "./auditoria.png",
  "./pericia_contabil.png",
  "./contabilidade_publica.png",
  "./contabilidade_de_custos.png",
  "./ética_contábil.png",
  "./contabilidade_geral.png",
  "./estatística.png",
  "./direito.png",
  "./matematica_financeira.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .catch(error => console.log("Erro ao salvar cache:", error))
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
      .then(response => response || fetch(event.request))
  );
});
```
