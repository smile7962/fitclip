const CACHE_NAME='fitclip-v6';
const ASSETS=['./','./index.html','./style.css','./app.js','./videos.js','./records.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/muscles/chest.png','./icons/muscles/back.png','./icons/muscles/shoulders.png','./icons/muscles/biceps.png','./icons/muscles/legs.png','./icons/muscles/core.png','./icons/muscles/full-body.png','./icons/muscles/stretch.png','./icons/movements/push.png','./icons/movements/pull.png','./icons/movements/squat.png','./icons/movements/hinge.png','./icons/movements/lunge.png','./icons/movements/brace.png','./icons/movements/rotate.png','./icons/movements/locomotion.png'];
// 새 버전 즉시 설치·활성화 (앱을 완전히 닫지 않아도 갱신되도록)
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  const sameOrigin=url.origin===self.location.origin;
  // 앱 셸(HTML·JS·CSS·루트)은 network-first → 배포 즉시 최신 반영, 오프라인이면 캐시로 대체
  const isShell=sameOrigin&&(e.request.mode==='navigate'||/\.(html|js|css)$/.test(url.pathname)||url.pathname.endsWith('/'));
  if(isShell){
    e.respondWith(fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  // 이미지 등 정적 자산은 cache-first (용량 크고 잘 안 바뀜)
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
