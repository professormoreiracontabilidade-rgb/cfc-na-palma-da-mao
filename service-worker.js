'use strict';
const CACHE_NAME = 'cfc-na-palma-v19-pl-quizzes-20260809';
const STATIC_FILES = ['./manifest.json','./auditoria.png','./pericia_contabil.png','./contabilidade_publica.png','./contabilidade_de_custos.png','./etica_contabil.png','./contabilidade_geral.png','./direito.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET') return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  if(request.mode==='navigate' || /\.(?:html|js|json)$/i.test(url.pathname)) {
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match(request)));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached || fetch(request).then(response=>{ const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)); return response; })));
});
