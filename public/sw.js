// наименование для нашего хранилища кэша
const CACHE_NAME = 'color-it-cache';
// ссылки на кэшируемые файлы
const cacheUrls = [
];

let cacheRegExp = new RegExp('(' + [
  '.(css|js|woff2?|ttf|png|jpe?g)'
].join('(/?)|\\') + ')$');

this.addEventListener('install', (event) => {
    // задержим обработку события
    // если произойдёт ошибка, serviceWorker не установится
    event.waitUntil(
        // находим в глобальном хранилище Cache-объект с нашим именем
        // если такого не существует, то он будет создан
        caches.open(CACHE_NAME)
            .then((cache) => {
                // загружаем в наш cache необходимые файлы
                return cache.addAll(cacheUrls);
            })
            .catch((err) => {
                console.error('smth went wrong with caches.open: ', err);
            })
    );
});

/*self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});*/

/*this.addEventListener('fetch', (event) => {

	const options = {
		method: event.request.method,
		mode: 'cors'
	};
    // если интернет-коннект есть
    if (navigator.onLine) {
        // добавить в кэш
        caches.open(CACHE_NAME).then((cache) =>
            fetch(event.request,options).then((response) =>
                cache.put(event.request, response)
            )
        );
        
        return fetch(event.request,options);
    }

    event.respondWith(
        // ищем запрашиваемый ресурс в хранилище кэша
        caches
        .match(event.request)
        .then((cachedResponse) => {
            // выдаём кэш, если он есть
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request,options);
        })
        .catch((err) => {
            console.error('smth went wrong with caches.match: ', err);
        })
    );
});*/

this.addEventListener('fetch', function(event) {
    if (event.request.method != 'GET') {
        return;
    }
    if (!cacheRegExp.test(event.request.url)) {

        // request will be networked
        return;
    }
    /* if (navigator.onLine) { 
        fetch(event.request).then(function(response) {
            return caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, response.clone());
                return response;
            });
        });
     } else { */
        event.respondWith(
            caches.match(event.request).then(function(resp) {
                return resp || fetch(event.request).then(function(response) {
                    return caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            }).catch(function() {
                return caches.match('/');
        })
    );
    // }
});
