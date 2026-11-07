// Собирает web/index.html для iOS-приложения из src/app.html.
// src/app.html — только содержимое страницы (так его публикует Claude как артефакт),
// здесь добавляется <head> с настройками для iPhone.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const page = readFileSync(new URL('../src/app.html', import.meta.url), 'utf8');
const head = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#eef1f8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#05060a" media="(prefers-color-scheme: dark)">
<style>
html { padding-top: env(safe-area-inset-top, 0px); }
body { margin: 0; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; overscroll-behavior-y: none; }
input { -webkit-user-select: text; user-select: text; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>
</head>
<body>
`;
mkdirSync(new URL('../web/', import.meta.url), { recursive: true });
writeFileSync(new URL('../web/index.html', import.meta.url), head + page + '\n</body>\n</html>\n');
console.log('web/index.html готов');
