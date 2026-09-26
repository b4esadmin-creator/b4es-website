// B4ES Ledger service worker. Caches the app shell only so the installed app
// opens quickly; ledger data (/api) is never cached and always comes live.
const CACHE = "ledger-shell-v1";
const SHELL = ["/", "/app.css", "/app.js", "/favicon.svg", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/cdn-cgi/")) return;
  // Network first, so updates and sign-in redirects always win; the cache is
  // only a fallback when offline.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.type === "basic" && SHELL.includes(url.pathname)) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("/")))
  );
});
