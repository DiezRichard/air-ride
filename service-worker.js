const version = "115212092025";
const CACHE_NAME = `v${version}`;
const versionParam = `?v=${version}`;

// Array base de recursos a cachear
const baseUrlsToCache = [
  
'/',
'/index.html',
'/actions.js',
'/main.js',
'/movement.js',
'/objects.js',
'/perlin.js',
'/shaders.js',
'/terrain.js',
'/utilities.js',
'/variables.js',
'/webgl.js',
'/style.css',
'/frame-192.png',
'/frame-512.png',
'/obj/ardilla.json',
'/obj/autumnpine1.json',
'/obj/autumnpine2.json',
'/obj/autumntree.json',
'/obj/bomberAnim.json',
'/obj/bomberAnimPink.json',
'/obj/cubo.json',
'/obj/deadtree.json',
'/obj/greenSprout.json',
'/obj/roses.json',
'/obj/pine1.json',
'/obj/pine2.json',
'/obj/snowpine1.json',
'/obj/snowpine2.json',
'/obj/snowtree.json',
'/obj/tree.json',
'/mp3/pixelate-pixelated-dreams-313358.mp3',
'/mp3/short-beep-tone-47916.mp3'

];

// Se agrega el parámetro de versión a cada URL
const urlsToCache = baseUrlsToCache;

// Instalación del Service Worker
self.addEventListener("install", (event) => {
console.log("Instalando Service Worker y cacheando recursos...");
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
console.log("Cacheando recursos durante la instalación.");
return cache.addAll(urlsToCache);
})
);
// Fuerza al SW a pasar a la fase de waiting inmediatamente
self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
console.log("Activando Service Worker y limpiando cachés antiguos...");
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cache) => {
if (cache !== CACHE_NAME) {
console.log("Eliminando caché antigua:", cache);
return caches.delete(cache);
}
})
);
}).then(() => {
// Hace que el nuevo SW tome el control de todas las páginas de inmediato
return self.clients.claim();
})
);
});

// Interceptar solicitudes
self.addEventListener("fetch", (event) => {
event.respondWith(
caches.match(event.request).then((response) => {
return response || fetch(event.request).then((response) => {
// Actualiza el caché con la nueva respuesta
return caches.open(CACHE_NAME).then((cache) => {
cache.put(event.request, response.clone());
return response;
});
});
}).catch(() => {
console.error("La solicitud falló y no hay red disponible.");
return new Response("No hay conexión a Internet");
})
);
});

// Escucha mensajes para forzar actualizaciones si se requiere
self.addEventListener("message", (event) => {
if (event.data && event.data.type === "SKIP_WAITING") {
self.skipWaiting();
}
});

