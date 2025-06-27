// service-worker.js
const CACHE_NAME = 'ponto-digital-v1';
const urlsToCache = [
    './', // Caches the root HTML file
    './index.html', // Explicitamente cache index.html
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
    // Adicione quaisquer outros assets estáticos se eles fossem arquivos externos (ex: CSS customizado, imagens)
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando arquivos estáticos');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Intercepta requisições e serve do cache se disponível, caso contrário busca da rede
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - retorna a resposta
                if (response) {
                    return response;
                }
                // Sem cache - busca da rede
                return fetch(event.request).catch(() => {
                    // Se a rede também falhar, você poderia retornar uma página de fallback
                    // Por exemplo, se for uma requisição HTML, retornar uma página offline genérica
                    // if (event.request.mode === 'navigate') {
                    //     return caches.match('/offline.html'); // Você precisaria criar esta página
                    // }
                    console.log('Service Worker: Falha ao buscar da rede e não encontrado no cache:', event.request.url);
                    // Para requisições não-HTML (como SDKs do Firebase), apenas deixa falhar se offline
                    throw new Error('Network request failed and no cache available.');
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
