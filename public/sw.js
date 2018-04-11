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

this.addEventListener('fetch', (event) => {

    // если интернет-коннект есть
	if (navigator.onLine) {
        // добавить в кэш
        caches.open(CACHE_NAME).then((cache) =>
            fetch(event.request).then((response) =>
                cache.put(event.request, response)
            )
        );
        
		return fetch(event.request);
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
				return fetch(event.request);
			})
			.catch((err) => {
				console.error('smth went wrong with caches.match: ', err);
			})
	);
});