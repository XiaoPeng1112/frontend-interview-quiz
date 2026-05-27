/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'interview-quiz-v1';

// 需要预缓存的核心资源（在 install 时缓存）
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
];

// Install: 预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      // 立即激活，不等待旧 SW 结束
      return self.skipWaiting();
    })
  );
});

// Activate: 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // 立即控制所有页面
      return self.clients.claim();
    })
  );
});

// Fetch: Network First + Cache Fallback 策略
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 跳过非 GET 请求
  if (request.method !== 'GET') return;

  // 跳过 chrome-extension 等非 http 请求
  if (!request.url.startsWith('http')) return;

  // API 请求不缓存（如 GitHub API）
  if (request.url.includes('api.github.com') || request.url.includes('workers.dev')) {
    return;
  }

  event.respondWith(
    // 先尝试网络
    fetch(request)
      .then((response) => {
        // 成功则更新缓存并返回
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，尝试从缓存返回
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 如果是导航请求，返回 index.html（SPA fallback）
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
