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

// 安装事件
self.addEventListener('install', () => {
  console.log('sw.js install');
  // 新 sw 立即激活, 不用等旧 sw 失效
  self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', () => {
  console.log('sw.js activate');
});

// 资源请求事件
self.addEventListener('fetch', (event) => {
  const { request } = event;
  console.log('fetch', request.url);

  caches.match(request).then((cacheRes) => {
    console.log('match response', cacheRes);

    // 找到缓存
    if (cacheRes) {
      return cacheRes;
    }

    // 没有缓存, 去请求
    return fetch(request).then((res) => {
      putResponse(request, res.clone());
      return res;
    });
  });

  // 只处理主文档
  if (cacheUrls.some(i => request.url.includes(i))) {
    // 拦截响应
    event.respondWith(
      caches.match(request).then((cacheRes) => {
        console.log('match response', cacheRes);

        // 找到缓存
        if (cacheRes) {
          return cacheRes;
        }

        // 没有缓存, 去请求
        return fetch(request).then((res) => {
          putResponse(request, res.clone());
          return res;
        });
      }),
    );

    // 始终请求主文档
    fetch(request)
      .then((res) => {
        putResponse(request, res.clone());
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

// 保存请求响应
function putResponse(request, res) {
  if (!res) {
    return;
  }
  caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, res);
  });
}

// 向主文档发送消息
function postMessage(data) {
  self.clients.matchAll()
    .then((clients) => {
      clients?.forEach((client) => {
        client.postMessage(data);
      });
    });
}

// 接收来自主文档的消息
self.addEventListener('message', (event) => {
  console.log('sw onmessage', event.data);
});
