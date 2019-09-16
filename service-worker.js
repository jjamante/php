const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  'index.html',
  'logo.png',
  'manifest.json',
  'service-worker.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://code.jquery.com/jquery-3.3.1.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js'
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
  
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          console.log('Found ', event.request.url, ' in cache');
          return cachedResponse;
        }
        console.log('Networ request for ', event.request.url);
        return fetch(event.request);
    
        .then(cachedResponse => { 
          if(cachedResponse.status === 404) {
            return caches.match('404.html'); 
          }
          return caches.open(cacheName)
          
          .then(cache => {
            cache.put(event.request.url, response.clone());
            return cachedResponse;
          });
        });
      }).catch(error=> {
        //TODO 6 - RESPOND WITH CUSTOM OFFLINE MESSAGE
        console.log('Error, ', error);
        return caches.match('offline.html');
      })
    );
});
