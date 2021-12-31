const CACHE_NAME = 'Budget-Tracker';
const VERSION = 'data-cache-v1';

const FILES_TO_CACHE = [
    './',
    './index.html',
    './css/styles.css',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './js/index.js'
];

// Install the service worker
self.addEventListener('install', function (evt) {
  evt.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE)
      })
  )
});

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function (evt) {
  evt.waitUntil(
      caches.keys().then(function (keyList) {
          let cacheKeepList = keyList.filter(function (key) {
              return key.indexOf(APP_PREFIX);
          })
          cacheKeepList.push(CACHE_NAME);
          return Promise.all(
              keyList.map(function(key, i) {
                  if (cacheKeepList.indexOf(key) === -1) {
                      console.log('deleting cache : ' + keyList[i]);
                      return caches.delete(keyList[i]);
                  }
              })
          );
      })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', function (evt) {
  console.log('fetch request : ' + evt.request.url)
  evt.respondWith(
      caches.match(evt.request).then(function (request) {
          if (request) { // if cache is available, respond with cache 
              console.log('responding with cache : ' + evt.request.url)
              return request
          } else { // if there is no cache, try fetching request
              console.log('file is not cached, fetching : ' + evt.request.url)
              return fetch(evt.request)
          }
      })
  )
});