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
  '/test/sw.html',
];

self.addEventListener('install', () => {
  console.log('sw.js install');
  // 新 sw 立即激活, 不用等旧 sw 失效
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('sw.js activate');
});


self.addEventListener('fetch', (event) => {
  const { request } = event;
  console.log('fetch', request.url);

  // 只处理主文档
  if (cacheUrls.some(i => request.url.includes(i))) {
    event.respondWith(
      caches.match(request).then((cacheRes) => {
        console.log('match response', cacheRes);

        // 找到缓存
        if (cacheRes) {
          return cacheRes;
        }

        // 没有缓存, 去请求
        return fetch(request).then((res) => {
          addRequest(request, res.clone());
          return res;
        });
      }),
    );

    fetch(request)
      .then((res) => {
        addRequest(request, res.clone());
        return res.text();
      })
      .then((text) => {
        caches.match(request)
          .then((res) => res.text())
          .then((cacheText) => {
            console.log('主文档内容对比', text, cacheText);
            // 请求内容 与 缓存内容对比
            if (text !== cacheText) {
              console.log('主文档内容变化, sw.reload');
              postMessage('sw.reload');
            }
          });
      });
  }
});

function addRequest(request, res) {
  if (!res) {
    return;
  }
  caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, res);
  });
}

function postMessage(data) {
  self.clients.matchAll()
    .then((clients) => {
      clients?.forEach(function (client) {
        client.postMessage(data);
      });
    });
}
