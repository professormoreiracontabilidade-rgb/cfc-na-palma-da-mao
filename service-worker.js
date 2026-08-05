'use strict';

const CACHE_NAME = 'cfc-na-palma-v14-imobilizado-20260805';
const STATIC_FILES = [
  './manifest.json', './auditoria.png', './pericia_contabil.png',
  './contabilidade_publica.png', './contabilidade_de_custos.png',
  './etica_contabil.png', './contabilidade_geral.png', './direito.png',
  './icon-192.png', './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (/\.(?:html|js|json)$/i.test(url.pathname)) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
