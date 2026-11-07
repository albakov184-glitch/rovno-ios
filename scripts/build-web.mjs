// Собирает приложение из src/: shell.html + styles.css + app.js.
//   dist/artifact.html — страница для Claude (без <head>, его добавляет Claude)
//   web/index.html     — то же самое с <head> для iPhone и сайта
//   web/sw.js, web/manifest.webmanifest, web/icon-*.png — сайт работает офлайн и ставится на экран «Домой»
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const pkg = JSON.parse(read('package.json'));

let sha = (process.env.GITHUB_SHA || '').slice(0, 7);
if (!sha) { try { sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(); } catch { sha = 'local'; } }
const date = new Date().toISOString().slice(0, 10).split('-').reverse().join('.');
const build = { version: pkg.version, sha, date };

const page = read('src/shell.html')
  .replace('/*@CSS*/', () => read('src/styles.css'))
  .replace('/*@JS*/', () => read('src/app.js'));

mkdirSync(new URL('dist/', root), { recursive: true });
writeFileSync(new URL('dist/artifact.html', root), page);

const head = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://telegram.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Ровно">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#f1f4fa" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#050c1a" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" href="icon-192.png">
<script>window.ROVNO_BUILD = ${JSON.stringify(build)};</script>
<script>
// Telegram's Mini App script, only when a Telegram bot opened the page
(function () {
  var tg = /tgWebApp/.test(location.hash + location.search) || !!window.TelegramWebviewProxy;
  try { tg = tg || !!sessionStorage.getItem('__telegram__initParams'); } catch (e) {}
  if (tg) document.write('<script src="https://telegram.org/js/telegram-web-app.js"><\\/script>');
})();
</script>
<style>
html { padding-top: var(--sat, env(safe-area-inset-top, 0px)); }
body { margin: 0; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; overscroll-behavior-y: none; }
input { -webkit-user-select: text; user-select: text; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>
</head>
<body>
`;
const web = new URL('web/', root);
mkdirSync(web, { recursive: true });
writeFileSync(new URL('index.html', web), head + page + '\n</body>\n</html>\n');

writeFileSync(new URL('manifest.webmanifest', web), JSON.stringify({
  name: 'Ровно', short_name: 'Ровно', lang: 'ru', start_url: './', scope: './', display: 'standalone',
  background_color: '#f1f4fa', theme_color: '#007aff',
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }]
}, null, 1));

// network first, cache as the fallback: online users always get the latest build
writeFileSync(new URL('sw.js', web), `const CACHE = 'rovno-${sha}';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
`);

for (const n of ['180', '192', '512']) {
  const src = new URL(`resources/icon-${n}.png`, root);
  if (existsSync(src)) copyFileSync(src, new URL(`icon-${n}.png`, web));
}
writeFileSync(new URL('.nojekyll', web), '');
console.log('Сборка готова:', build);
