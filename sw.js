// self.addEventListener('install', () => {
//   // Skip over the "waiting" lifecycle state, to ensure that our
//   // new service worker is activated immediately, even if there's
//   // another tab open controlled by our older service worker code.
//   // 不需要等待旧的 ServiceWorker
//   self.skipWaiting();
// });
//
// self.addEventListener('activate', () => {
//   // Optional: Get a list of all the current open windows/tabs under
//   // our service worker's control, and force them to reload.
//   // This can "unbreak" any open windows/tabs as soon as the new
//   // service worker activates, rather than users having to manually reload.
//   // 强制所有的客户端进行重定向
//   self.clients.matchAll({
//     type: 'window',
//   }).then(windowClients => {
//     windowClients.forEach((windowClient) => {
//       windowClient.navigate(windowClient.url);
//     });
//   });
// });

const CACHE_NAME = 'sw.html';
const cacheUrls = [
  '/github/test/sw.html',
];

self.addEventListener('install', (event) => {
  console.log('sw.js install');
  // 新 sw 立即激活, 不用等旧 sw 失效
  self.skipWaiting();

  // 预缓存资源
  event.waitUntil(async () => {
    const cache = await caches.open(CACHE_NAME);
    console.log('cache opened');
    return cache.addAll(cacheUrls);
  });
});

self.addEventListener('activate', () => {
  console.log('sw.js activate');
});


self.addEventListener('fetch', (event) => {
  console.log('fetch: ', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      console.log('match response: ', response);

      // 找到缓存
      if (response) {
        return response;
      }

      const request = event.request.clone();
      return fetch(request).then((res) => {
        if (!res) {
          return res;
        }

        const resCopy = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resCopy);
        });

        return res;
      });
    }),
  );
});
