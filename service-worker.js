'use strict';

const CACHE_NAME = 'cfc-na-palma-v13';
const STATIC_FILES = [
  './manifest.json',
  './auditoria.png',
  './pericia_contabil.png',
  './contabilidade_publica.png',
  './contabilidade_de_custos.png',
  './etica_contabil.png',
  './contabilidade_geral.png',
  './direito.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Nunca intercepta Firebase, Google APIs nem arquivos de autenticação.
  if (
    url.origin !== self.location.origin ||
    /(?:login\.html|index\.html|firebase-config\.js|login\.js|auth-guard\.js|logout\.js)$/.test(url.pathname)
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
