const assets = [
  "/tkt/",
  "/tkt/index.html",
  "/tkt/backhome.png",
  "/tkt/checkandvalidation.png",
  "/tkt/clock.png",
  "/tkt/person.png",
  "/tkt/verif.png",
  "/tkt/waves.png"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCascheName).then(cache => {
      cache.addAll(assets);
      console.log("service worker installed -- assets cached");
    }).catch(err => console.log("issue caching assets on install - ", err))
  );
});
  
self.addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(keys => {
      console.log("service worker activated");
      return Promise.all(keys
        .filter(key => key !== staticCascheName)
        .map(key => caches.delete(key))
      )
    }).catch(err => console.log("issue getting cacheKeys on activate - ", err))
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.open(staticCascheName).then(cache => {
      console.log("fetching from service worker");
      return cache.match(fetchEvent.request).then(res => res || fetch(fetchEvent.request)
        .then(networkRes => {
          console.log("puting network response to cache");
          cache.put(fetchEvent.request, networkRes.clone());
          return networkRes;
        })
      ).catch(() => {
        if(fetchEvent.request.url.indexOf(".html") > -1 || fetchEvent.request.url === "https://github.com/tkt4bu5"){
          return caches.match("/tkt/404.html");
        }
      })
    }).catch(err => console.log("issue opening cache on fetch", err))
  );
});