// sw.js - Service Worker Proxy
const CACHE_NAME = 'gh-proxy-v1';

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    // اگر درخواست مربوط به خود دامنه github.io بود، مستقیم بگذر
    if (url.hostname.includes('github.io')) {
        return;
    }
    // هدایت درخواست‌ها به سمت AllOrigins
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(event.request.url)}`;
    event.respondWith(
        fetch(proxyUrl).then(res => res.json()).then(data => {
            return new Response(data.contents, {
                status: 200,
                headers: { 'Content-Type': 'text/html' }
            });
        }).catch(err => new Response(`Proxy Error: ${err.message}`, { status: 502 }))
    );
});
