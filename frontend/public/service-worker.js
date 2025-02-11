const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/index.html", "/styles.css", "/script.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activate service worker immediately
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Redirect deep links to /loyality when opened from the home screen
  // if (
  //   url.pathname.startsWith("/loyality/") &&
  //   !url.pathname.endsWith("/loyality")
  // ) {
  //   event.respondWith(Response.redirect("/loyality"));
  //   return;
  // }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim(); // Take control of open clients
});
