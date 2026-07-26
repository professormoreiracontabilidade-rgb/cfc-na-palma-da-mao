'use strict';

const CACHE_NAME = 'cfc-na-palma-v12';
const APP_SHELL = [
  './login.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(nomes => Promise.all(
      nomes.filter(nome => nome !== CACHE_NAME).map(nome => caches.delete(nome))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Não interfere nas requisições do Firebase ou de outros domínios.
  if (url.origin !== self.location.origin) return;

  // Arquivos de autenticação e páginas HTML devem vir sempre atualizados da internet.
  const sempreAtualizar =
    request.mode === 'navigate' ||
    /\.(?:html|js)$/i.test(url.pathname) ||
    url.pathname.endsWith('/');

  if (sempreAtualizar) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response && response.ok) {
            const copia = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copia));
          }
          return response;
        })
        .catch(() => caches.match(request).then(resposta => resposta || caches.match('./login.html')))
    );
    return;
  }

  // Imagens, ícones e outros arquivos estáticos: cache primeiro.
  event.respondWith(
    caches.match(request).then(respostaCache => {
      if (respostaCache) return respostaCache;

      return fetch(request).then(response => {
        if (response && response.ok) {
          const copia = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copia));
        }
        return response;
      });
    })
  );
});
