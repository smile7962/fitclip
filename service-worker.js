const CACHE_NAME='fitclip-v4';
const ASSETS=['./','./index.html','./style.css','./app.js','./videos.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/muscles/chest.png','./icons/muscles/back.png','./icons/muscles/shoulders.png','./icons/muscles/biceps.png','./icons/muscles/legs.png','./icons/muscles/core.png','./icons/muscles/full-body.png','./icons/muscles/stretch.png','./icons/movements/push.png','./icons/movements/pull.png','./icons/movements/squat.png','./icons/movements/hinge.png','./icons/movements/lunge.png','./icons/movements/brace.png','./icons/movements/rotate.png','./icons/movements/locomotion.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
