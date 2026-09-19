// 一毛修仙 · Service Worker（极简版）
// 策略：不缓存任何东西，只让浏览器识别这是 PWA
// 好处：永远不会因为缓存坏响应而报错

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // 清掉旧版本留下的所有缓存
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 什么都不拦截，所有请求正常走网络