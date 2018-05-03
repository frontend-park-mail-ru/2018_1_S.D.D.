// наименование для нашего хранилища кэша
const CACHE_NAME = 'color-it-cache';
// ссылки на кэшируемые файлы
const cacheUrls = [
];

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
  });