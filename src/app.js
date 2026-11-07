(function () {
  'use strict';

  // ================= helpers =================
  const $ = id => document.getElementById(id);
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => [...(root || document).querySelectorAll(sel)];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = p => (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const round2 = v => Math.round(v * 100) / 100;
  const raf2 = fn => requestAnimationFrame(() => requestAnimationFrame(fn));
  const BUILD = window.ROVNO_BUILD || null;
  // Telegram Mini App: present only when the bot opened the page
  const TG = (() => { const w = window.Telegram && window.Telegram.WebApp; return w && w.initData ? w : null; })();
  const tgAtLeast = v => !!(TG && TG.isVersionAtLeast && TG.isVersionAtLeast(v));

  // ================= icons =================
  const P = {
    food: '<path d="M7 3v8a3 3 0 0 0 6 0V3M10 3v18M17 3c-1.5 1.5-2 4-2 6s1 3 2 3v9"/>',
    coffee: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3"/>',
    car: '<path d="M5 16h14M6 16l1.5-5h9L18 16M7 16v3M17 16v3"/>',
    home: '<path d="M4 11l8-7 8 7M6 10v10h12V10M10 20v-5h4v5"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8zM9 8a3 3 0 0 1 6 0"/>',
    fun: '<path d="M4 7h16v10H4zM9 7v10M15 7v10"/>',
    health: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    sub: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 17h2"/>',
    edu: '<path d="M3 9l9-5 9 5-9 5zM7 11v5c3 2 7 2 10 0v-5"/>',
    gift: '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3-2-5 1"/>',
    misc: '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
    salary: '<path d="M3 7h18v10H3zM12 9.5v5M10 10.5h3a1 1 0 0 1 0 2h-2a1 1 0 0 0 0 2h3"/>',
    laptop: '<path d="M5 6h14v9H5zM3 18h18"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    plane: '<path d="M2 16l20-7-4-2-6 3-6-3-2 1 5 4-4 2-2-1z"/>',
    pet: '<circle cx="7" cy="9" r="1.6"/><circle cx="12" cy="6.5" r="1.6"/><circle cx="17" cy="9" r="1.6"/><path d="M12 12c-3 0-5 3-5 5s2 2 5 1 5 1 5-1-2-5-5-5z"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h6"/>',
    game: '<rect x="3" y="8" width="18" height="10" rx="4"/><path d="M8 11v4M6 13h4M15 12h.01M17 14h.01"/>',
    sport: '<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
    kid: '<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    star: '<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L3.3 9.2l6.1-.6z"/>',
    bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>',
    // ui
    chevR: '<path d="M9 5l7 7-7 7"/>',
    chevL: '<path d="M15 5l-7 7 7 7"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.1 4M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    wallet: '<path d="M4 7a2 2 0 0 1 2-2h12v4M4 7v10a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2zM16 14h.01"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3 14a1.5 1.5 0 0 1 2.5-1.7L8 15"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    trendUp: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    trendDown: '<path d="M3 7l6 6 4-4 8 8M15 17h6v-6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    alert: '<path d="M12 3l10 18H2zM12 10v4M12 17.5h.01"/>',
    piggy: '<path d="M19 9a7 7 0 0 0-13 0H4a2 2 0 0 0 0 4h1a7 7 0 0 0 3 4v3h3v-2h2v2h3v-3a7 7 0 0 0 3-5h2v-3z"/><circle cx="15" cy="11" r=".6" fill="currentColor"/>',
    cloud: '<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
    phoneOff: '<path d="M2 6h20M5 6v13h14V6"/>'
  };
  const icon = (name, w) => '<svg viewBox="0 0 24 24"' + (w ? ' width="' + w + '" height="' + w + '"' : '') + ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || P.misc) + '</svg>';
  const ICON_CHOICES = ['food', 'coffee', 'car', 'home', 'bag', 'fun', 'health', 'sub', 'phone', 'edu', 'gift', 'plane', 'pet', 'book', 'game', 'sport', 'kid', 'star', 'bolt', 'card', 'salary', 'laptop', 'piggy', 'misc'];
  const COLORS = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#30b0c7', '#007aff', '#5856d6', '#af52de', '#ff2d55', '#a2845e', '#8e8e93'];
  const LOGO = '<svg class="logo" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="lgL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f8cff"/><stop offset="1" stop-color="#22c995"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(#lgL)"/><rect x="20" y="36" width="60" height="11" rx="5.5" fill="#fff"/><rect x="20" y="55" width="42" height="11" rx="5.5" fill="#fff" opacity=".8"/></svg>';

  // ================= categories =================
  const BASE = {
    expense: [
      { id: 'food', name: 'Продукты', color: '#ff9500', icon: 'food' },
      { id: 'coffee', name: 'Кафе', color: '#a2845e', icon: 'coffee' },
      { id: 'car', name: 'Транспорт', color: '#007aff', icon: 'car' },
      { id: 'home', name: 'Дом и ЖКХ', color: '#5856d6', icon: 'home' },
      { id: 'bag', name: 'Покупки', color: '#ff2d55', icon: 'bag' },
      { id: 'fun', name: 'Развлечения', color: '#af52de', icon: 'fun' },
      { id: 'health', name: 'Здоровье', color: '#ff3b30', icon: 'health' },
      { id: 'sub', name: 'Подписки', color: '#30b0c7', icon: 'sub' },
      { id: 'phone', name: 'Связь', color: '#34c759', icon: 'phone' },
      { id: 'edu', name: 'Образование', color: '#00c7be', icon: 'edu' },
      { id: 'gift', name: 'Подарки', color: '#ffcc00', icon: 'gift' },
      { id: 'misc', name: 'Другое', color: '#8e8e93', icon: 'misc' }
    ],
    income: [
      { id: 'salary', name: 'Зарплата', color: '#34c759', icon: 'salary' },
      { id: 'laptop', name: 'Подработка', color: '#30b0c7', icon: 'laptop' },
      { id: 'card', name: 'Кешбэк', color: '#5856d6', icon: 'card' },
      { id: 'gift', name: 'Подарки', color: '#ff9500', icon: 'gift' },
      { id: 'up', name: 'Другое', color: '#8e8e93', icon: 'up' }
    ]
  };
  function cats(type) { return BASE[type].slice(0, -1).concat(state.cats.filter(c => c.type === type), BASE[type].slice(-1)); }
  function catOf(type, id) {
    const t = type === 'income' ? 'income' : 'expense';
    return cats(t).find(c => c.id === id) || { id, name: 'Без категории', color: '#8e8e93', icon: 'misc' };
  }

  // ================= state =================
  const KEY = 'rovno.state.v2', OLD_KEY = 'rovno.tx.v1';
  function defaults() {
    return { v: 2, tx: [], budgets: { total: 0, cats: {} }, goals: [], recurring: [], cats: [], settings: { currency: 'RUB', theme: 'system', hide: false, haptics: true, pin: '' } };
  }
  function validTx(t) { return t && (t.type === 'income' || t.type === 'expense') && typeof t.amount === 'number' && isFinite(t.amount) && t.amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(t.date || ''); }
  function normalize(raw) {
    const d = defaults();
    if (Array.isArray(raw)) raw = { tx: raw };
    if (!raw || typeof raw !== 'object') return d;
    const s = Object.assign(d, raw);
    s.v = 2;
    s.tx = (Array.isArray(s.tx) ? s.tx : []).filter(validTx).map(t => Object.assign({ id: uid('t'), note: '', createdAt: Date.parse(t.date) || Date.now() }, t));
    s.budgets = Object.assign({ total: 0, cats: {} }, s.budgets || {});
    if (!s.budgets.cats || typeof s.budgets.cats !== 'object') s.budgets.cats = {};
    s.goals = Array.isArray(s.goals) ? s.goals.filter(g => g && g.name && g.target > 0) : [];
    s.recurring = Array.isArray(s.recurring) ? s.recurring.filter(r => r && r.amount > 0 && r.day >= 1) : [];
    s.cats = Array.isArray(s.cats) ? s.cats.filter(c => c && c.id && c.name && (c.type === 'income' || c.type === 'expense')) : [];
    s.settings = Object.assign(defaults().settings, s.settings || {});
    return s;
  }
  let state = defaults();
  let backend = null;
  let ready = false;

  // ---------- storage backends ----------
  function nativePrefs() {
    const cap = window.Capacitor;
    return cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins && cap.Plugins.Preferences ? cap.Plugins.Preferences : null;
  }
  function makeBrowser() {
    return {
      kind: 'browser',
      async load() {
        try {
          const v2 = localStorage.getItem(KEY); if (v2) return JSON.parse(v2);
          const v1 = localStorage.getItem(OLD_KEY); if (v1) return JSON.parse(v1);
        } catch (e) {}
        return null;
      },
      async save(str) { try { localStorage.setItem(KEY, str); } catch (e) { throw e; } }
    };
  }
  function makeNative(Pref) {
    return {
      kind: 'native',
      async load() {
        const a = await Pref.get({ key: KEY });
        if (a && a.value) return JSON.parse(a.value);
        const b = await Pref.get({ key: OLD_KEY });
        if (b && b.value) return JSON.parse(b.value);
        return null;
      },
      async save(str) { await Pref.set({ key: KEY, value: str }); }
    };
  }
  // Telegram CloudStorage: values up to 4096 chars, so the state is split into chunks.
  // A local copy keeps the app instant and working offline; the newer copy wins on load.
  function makeTelegram(T) {
    const CS = T.CloudStorage;
    const call = (fn, ...args) => new Promise((res, rej) => { try { CS[fn](...args, (err, v) => err ? rej(err) : res(v)); } catch (e) { rej(e); } });
    const local = makeBrowser();
    const SIZE = 3800;
    let lastN = 0, timer = null, warned = false;
    async function upload(str) {
      const parts = [];
      for (let i = 0; i < str.length; i += SIZE) parts.push(str.slice(i, i + SIZE));
      for (let i = 0; i < parts.length; i++) await call('setItem', 'rovno_' + i, parts[i]);
      await call('setItem', 'rovno_n', String(parts.length));
      if (lastN > parts.length) { const stale = []; for (let i = parts.length; i < lastN; i++) stale.push('rovno_' + i); await call('removeItems', stale).catch(() => {}); }
      lastN = parts.length;
    }
    return {
      kind: 'telegram',
      async load() {
        let cloud = null;
        try {
          const n = Number(await Promise.race([call('getItem', 'rovno_n'), new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 5000))])) || 0;
          if (n) {
            const keys = Array.from({ length: n }, (_, i) => 'rovno_' + i);
            const got = await call('getItems', keys);
            cloud = JSON.parse(keys.map(k => got[k] || '').join(''));
            lastN = n;
          }
        } catch (e) {}
        const loc = await local.load();
        if (!cloud) return loc;
        return loc && (loc.savedAt || 0) > (cloud.savedAt || 0) ? loc : cloud;
      },
      async save(str, now) {
        await local.save(str);
        clearTimeout(timer);
        const run = () => upload(str).then(() => { warned = false; }).catch(() => {
          if (!warned) toast('Нет связи с облаком Telegram. Данные сохранены на устройстве.', 'alert');
          warned = true;
        });
        if (now) run(); else timer = setTimeout(run, 900);
      }
    };
  }

  async function makeClaude() {
    if (!window.claude || !window.claude.use) return null;
    const timeout = new Promise(r => setTimeout(() => r(null), 8000));
    const got = await Promise.race([Promise.all([claude.use('db'), claude.use('user')]), timeout]);
    if (!got) return null;
    const [db, user] = got;
    const id = user ? await user.id() : null;
    if (!db || !id) return null;
    const col = db.collection('data/users/' + id);
    const doc = col.doc('state');
    return {
      kind: 'claude',
      async load() {
        const snap = await doc.get();
        if (snap.exists && snap.data() && snap.data().json) return JSON.parse(snap.data().json);
        // first run after the update: gather the old one-document-per-operation rows
        const all = await col.get();
        const tx = all.docs.filter(d => d.id !== 'state').map(d => Object.assign({ id: d.id }, d.data())).filter(validTx);
        return tx.length ? { tx } : null;
      },
      async save(str) { await doc.set({ json: str, savedAt: Date.now() }); }
    };
  }

  let saveTimer = null, saveFailed = false;
  function persist(now) {
    clearTimeout(saveTimer);
    const run = () => {
      if (!backend) return;
      state.savedAt = Date.now();
      backend.save(JSON.stringify(state), now).then(() => { saveFailed = false; }).catch(() => {
        if (!saveFailed) toast('Не получилось сохранить. Данные останутся, пока приложение открыто.', 'alert');
        saveFailed = true;
      });
    };
    if (now) run(); else saveTimer = setTimeout(run, 250);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) persist(true); });
  window.addEventListener('pagehide', () => persist(true));

  function commit() { persist(); renderAll(); }

  // ================= formatting =================
  const CURRENCIES = [
    ['RUB', 'Российский рубль'], ['USD', 'Доллар США'], ['EUR', 'Евро'], ['KZT', 'Казахстанский тенге'],
    ['UAH', 'Украинская гривна'], ['BYN', 'Белорусский рубль'], ['UZS', 'Узбекский сум'], ['KGS', 'Киргизский сом'],
    ['AZN', 'Азербайджанский манат'], ['AMD', 'Армянский драм'], ['GEL', 'Грузинский лари'], ['TRY', 'Турецкая лира'],
    ['GBP', 'Фунт стерлингов'], ['CNY', 'Китайский юань'], ['AED', 'Дирхам ОАЭ']
  ];
  const fmtCache = {};
  function nf(cur, frac) {
    const k = cur + frac;
    if (!fmtCache[k]) {
      try { fmtCache[k] = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol', minimumFractionDigits: frac, maximumFractionDigits: frac }); }
      catch (e) { fmtCache[k] = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: cur, minimumFractionDigits: frac, maximumFractionDigits: frac }); }
    }
    return fmtCache[k];
  }
  const plainNf = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const compactNf = new Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 });
  function sym() {
    const p = nf(state.settings.currency, 0).formatToParts(0).find(x => x.type === 'currency');
    return p ? p.value : state.settings.currency;
  }
  // money(v): "1 234 ₽"; kopecks only when present
  function money(v, o) {
    o = o || {};
    if (state.settings.hide && !o.show) return '••• ' + sym();
    const a = Math.abs(v), r = round2(a);
    const frac = o.whole || Number.isInteger(r) ? 0 : 2;
    const s = nf(state.settings.currency, frac).format(o.whole ? Math.round(a) : r).replace(/ /g, ' ');
    const sign = v < 0 ? '−' : (o.plus && v > 0 ? '+' : '');
    return sign + s;
  }
  const compact = v => state.settings.hide ? '•••' : compactNf.format(v).replace(/ /g, ' ');
  const pct = v => Math.round(v) + '%';
  const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
  const monthNameY = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });
  const monthShort = new Intl.DateTimeFormat('ru-RU', { month: 'short' });
  const dayFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });
  const dayShort = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
  const dayLong = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const todayIso = () => iso(new Date());
  const ymOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1);
  const parseIso = s => { const [Y, M, D] = s.split('-').map(Number); return new Date(Y, M - 1, D); };
  const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
  const addMonths = (key, n) => { const [y, m] = key.split('-').map(Number); return ymOf(new Date(y, m - 1 + n, 1)); };
  const monthGen = key => { const n = monthName.format(parseIso(key + '-01')); return n.replace(/ь$/, 'я').replace(/й$/, 'я').replace(/т$/, 'та'); };
  const monthDat = key => { const n = monthName.format(parseIso(key + '-01')); return n.replace(/ь$/, 'ю').replace(/й$/, 'ю').replace(/т$/, 'ту'); };
  const plural = (n, a, b, c) => { n = Math.abs(n); const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; };
  function dayLabel(s) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (s === todayIso()) return 'сегодня';
    if (s === iso(y)) return 'вчера';
    const d = parseIso(s);
    return d.getFullYear() === new Date().getFullYear() ? dayFmt.format(d) : dayLong.format(d) + ' ' + d.getFullYear();
  }

  // ================= haptics =================
  function haptic(kind) {
    if (!state.settings.haptics) return;
    try {
      if (TG && TG.HapticFeedback && tgAtLeast('6.1')) {
        const T = TG.HapticFeedback;
        if (kind === 'success' || kind === 'warn' || kind === 'error') T.notificationOccurred(kind === 'warn' ? 'warning' : kind);
        else if (kind === 'select') T.selectionChanged();
        else T.impactOccurred(kind === 'medium' ? 'medium' : kind === 'heavy' ? 'heavy' : 'light');
        return;
      }
      const H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (!H) return;
      if (kind === 'success') H.notification({ type: 'SUCCESS' });
      else if (kind === 'warn') H.notification({ type: 'WARNING' });
      else if (kind === 'error') H.notification({ type: 'ERROR' });
      else if (kind === 'select') H.selectionChanged ? H.selectionChanged() : H.impact({ style: 'LIGHT' });
      else H.impact({ style: kind === 'medium' ? 'MEDIUM' : kind === 'heavy' ? 'HEAVY' : 'LIGHT' });
    } catch (e) {}
  }

  // ================= numbers =================
  const sums = list => list.reduce((s, t) => { if (t.type === 'income') s.i += t.amount; else s.e += t.amount; return s; }, { i: 0, e: 0 });
  const ofMonth = key => state.tx.filter(t => t.date.slice(0, 7) === key);
  const ofYear = y => state.tx.filter(t => t.date.slice(0, 4) === String(y));
  const byCat = list => list.filter(t => t.type === 'expense').reduce((m, t) => { m[t.category] = (m[t.category] || 0) + t.amount; return m; }, {});
  function monthProgress(key) {
    const now = new Date(), cur = ymOf(now);
    const [y, m] = key.split('-').map(Number);
    const D = daysIn(y, m - 1);
    if (key < cur) return { d: D, D, done: true };
    if (key > cur) return { d: 0, D, future: true };
    return { d: now.getDate(), D };
  }

  // forecast for the month: regular payments and one big one-off count once,
  // only everyday spending is extrapolated over the days left
  function forecast(key, m) {
    const prog = monthProgress(key);
    const ex = m.filter(t => t.type === 'expense');
    const e = ex.reduce((s, t) => s + t.amount, 0);
    if (prog.done) return e;
    if (!prog.d) return e;
    let fixed = ex.filter(t => t.recurringId).reduce((s, t) => s + t.amount, 0);
    const rest = ex.filter(t => !t.recurringId).sort((a, b) => b.amount - a.amount);
    const restSum = rest.reduce((s, t) => s + t.amount, 0);
    if (rest.length > 2 && rest[0].amount > restSum * .35) fixed += rest[0].amount;
    const daily = (e - fixed) / prog.d;
    return e + daily * (prog.D - prog.d);
  }

  // ================= UI state =================
  const ui = { tab: 'overview', cursor: ymOf(new Date()), filter: 'all', query: '', catFilter: null, period: 'month', donutSel: null, barSel: null, heatSel: null, entered: {} };
  const TABS = { overview: 'Обзор', operations: 'Операции', analytics: 'Аналитика', more: 'Ещё' };

  // ================= small components =================
  function seg(root, value) {
    const btns = qsa('button', root);
    const i = Math.max(0, btns.findIndex(b => b.dataset.v === value));
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === value)));
    const th = qs('.thumb', root);
    th.style.width = 'calc((100% - 4px) / ' + btns.length + ')';
    th.style.transform = 'translate3d(' + (i * 100) + '%,0,0)';
  }
  function segHtml(id, opts, value, label) {
    return '<div class="seg" id="' + id + '" role="group" aria-label="' + esc(label) + '"><span class="thumb" aria-hidden="true"></span>' +
      opts.map(([v, t]) => '<button type="button" data-v="' + v + '" aria-pressed="' + (v === value) + '">' + esc(t) + '</button>').join('') + '</div>';
  }
  function switchHtml(id, on, label) {
    return '<span class="switch"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + ' aria-label="' + esc(label) + '"><span></span></span>';
  }

  // count-up for plain numbers
  const shown = new WeakMap();
  function countTo(el, target, fmt) {
    const from = shown.has(el) ? shown.get(el) : 0;
    shown.set(el, target);
    if (reduced() || from === target || state.settings.hide) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 750;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(from + (target - from) * e);
      if (k < 1 && shown.get(el) === target) requestAnimationFrame(step);
    })(t0);
  }
  // rolling digits
  function odometer(el, text) {
    const chars = [...text];
    const mask = chars.map(c => /\d/.test(c) ? 'd' : c).join('');
    if (el.dataset.mask !== mask) {
      el.dataset.mask = mask;
      el.innerHTML = chars.map(c => /\d/.test(c)
        ? '<span class="od" aria-hidden="true"><span class="od-col">' + '0123456789'.split('').map(n => '<span>' + n + '</span>').join('') + '</span></span>'
        : '<span class="od-s" aria-hidden="true">' + esc(c) + '</span>').join('');
    }
    el.setAttribute('aria-label', text);
    const cols = qsa('.od-col', el);
    const digits = chars.filter(c => /\d/.test(c));
    requestAnimationFrame(() => cols.forEach((col, i) => {
      col.style.transitionDelay = ((cols.length - i) * 40) + 'ms';
      col.style.transform = 'translate3d(0,' + (-Number(digits[i])) + 'em,0)';
    }));
  }

  // ---------- toast ----------
  let toastTimer;
  function toast(msg, kind, undo) {
    const t = $('toast');
    const ic = kind === 'trash' ? icon('trash') : kind === 'alert' ? icon('alert') : kind === 'ok' ? icon('check') : '';
    t.className = 'toast blur' + (undo ? ' has-undo' : '');
    t.innerHTML = (ic ? '<span class="t-ic" style="color:var(' + (kind === 'ok' ? '--income' : kind === 'trash' || kind === 'alert' ? '--expense' : '--fg') + ')">' + ic + '</span>' : '') +
      '<span class="msg"></span>' + (undo ? '<button type="button" class="undo">Отменить</button><span class="cd"></span>' : '');
    qs('.msg', t).textContent = msg;
    const dur = undo ? 4500 : 2400;
    if (undo) {
      qs('.undo', t).onclick = () => { clearTimeout(toastTimer); t.classList.remove('on'); haptic('light'); undo(); };
      const cd = qs('.cd', t);
      if (cd.animate && !reduced()) cd.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: dur, easing: 'linear', fill: 'forwards' });
    }
    raf2(() => t.classList.add('on'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), dur);
  }

  // ---------- sheets ----------
  let zTop = 40;
  function makeSheet(el) {
    const scrim = document.createElement('div');
    scrim.className = 'scrim'; scrim.hidden = true;
    el.parentNode.insertBefore(scrim, el);
    const api = {
      el, isOpen: false, onClose: null,
      open() {
        zTop += 2; scrim.style.zIndex = zTop; el.style.zIndex = zTop + 1;
        el.style.setProperty('--drag', '0px');
        scrim.hidden = false; el.hidden = false; api.isOpen = true;
        el.scrollTop = 0;
        raf2(() => { scrim.classList.add('on'); el.classList.add('on'); });
        syncBack();
      },
      close() {
        if (!api.isOpen) return;
        api.isOpen = false;
        scrim.classList.remove('on'); el.classList.remove('on');
        el.style.setProperty('--drag', '0px');
        if (document.activeElement && el.contains(document.activeElement)) document.activeElement.blur();
        setTimeout(() => { if (!api.isOpen) { scrim.hidden = true; el.hidden = true; } }, 480);
        if (api.onClose) api.onClose();
        syncBack();
      }
    };
    scrim.addEventListener('click', () => api.close());
    qsa('[data-close]', el).forEach(b => b.addEventListener('click', () => api.close()));
    // drag down to dismiss
    const zone = qs('.grab-zone', el);
    let y0 = null, dy = 0, t0 = 0;
    zone.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      y0 = e.clientY; dy = 0; t0 = performance.now();
      el.classList.add('dragging');
      try { zone.setPointerCapture(e.pointerId); } catch (err) {}
    });
    zone.addEventListener('pointermove', e => {
      if (y0 === null) return;
      dy = e.clientY - y0;
      el.style.setProperty('--drag', (dy > 0 ? dy : dy * .15) + 'px');
      scrim.style.opacity = String(clamp(1 - dy / 450, 0, 1));
    });
    const end = () => {
      if (y0 === null) return;
      el.classList.remove('dragging'); scrim.style.opacity = '';
      const fast = dy / Math.max(1, performance.now() - t0) > .55;
      if (dy > 130 || (fast && dy > 36)) api.close(); else el.style.setProperty('--drag', '0px');
      y0 = null;
    };
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
    return api;
  }

  // ---------- action sheet (confirm) ----------
  function confirmAction(o) {
    return new Promise(resolve => {
      const a = $('action');
      let scrim = $('actionScrim');
      if (!scrim) { scrim = document.createElement('div'); scrim.id = 'actionScrim'; scrim.className = 'scrim'; scrim.style.zIndex = 70; a.parentNode.insertBefore(scrim, a); }
      a.style.zIndex = 71;
      a.innerHTML = '<div class="box blur">' + (o.title || o.message ? '<div class="msg">' + (o.title ? '<b>' + esc(o.title) + '</b>' : '') + (o.message ? '<p>' + esc(o.message) + '</p>' : '') + '</div>' : '') +
        '<button type="button" class="' + (o.destructive ? 'destr' : '') + '" data-r="1">' + esc(o.confirm || 'OK') + '</button></div>' +
        '<button type="button" class="cancel" data-r="0">Отмена</button>';
      const done = r => {
        a.classList.remove('on'); scrim.classList.remove('on');
        setTimeout(() => { a.hidden = true; scrim.hidden = true; }, 420);
        document.removeEventListener('keydown', onKey);
        resolve(r);
      };
      const onKey = e => { if (e.key === 'Escape') done(false); };
      document.addEventListener('keydown', onKey);
      qsa('[data-r]', a).forEach(b => b.onclick = () => { haptic(b.dataset.r === '1' && o.destructive ? 'medium' : 'light'); done(b.dataset.r === '1'); });
      scrim.onclick = () => done(false);
      a.hidden = false; scrim.hidden = false;
      if (o.destructive) haptic('warn');
      raf2(() => { a.classList.add('on'); scrim.classList.add('on'); qs('[data-r="0"]', a).focus({ preventScroll: true }); });
    });
  }

  // ---------- pushed pages ----------
  const pageStack = [];
  function pushPage(title, render, opts) {
    opts = opts || {};
    const pg = document.createElement('section');
    pg.className = 'page';
    pg.setAttribute('aria-label', title);
    const backLabel = pageStack.length ? pageStack[pageStack.length - 1].title : 'Ещё';
    pg.innerHTML = '<div class="page-nav"><div class="in"><button type="button" class="back">' + icon('chevL') + '<span>' + esc(backLabel) + '</span></button><h2>' + esc(title) + '</h2><div class="act"></div></div></div><div class="page-body fresh"></div>';
    $('pages').appendChild(pg);
    const entry = { el: pg, title, body: qs('.page-body', pg), act: qs('.act', pg), render };
    entry.refresh = () => { entry.body.classList.remove('fresh'); render(entry); };
    pageStack.push(entry);
    qs('.back', pg).onclick = () => popPage();
    render(entry);
    pg.style.zIndex = 30 + pageStack.length;
    const under = pageStack[pageStack.length - 2];
    raf2(() => { pg.classList.add('on'); if (under) under.el.classList.add('under'); });
    haptic('light');
    syncBack();
    // swipe from the left edge to go back
    let x0 = null, dx = 0;
    pg.addEventListener('pointerdown', e => { if (e.clientX < 28 && e.pointerType !== 'mouse') { x0 = e.clientX; dx = 0; pg.classList.add('dragging'); } });
    pg.addEventListener('pointermove', e => { if (x0 === null) return; dx = Math.max(0, e.clientX - x0); pg.style.transform = 'translate3d(' + dx + 'px,0,0)'; });
    const end = () => { if (x0 === null) return; pg.classList.remove('dragging'); pg.style.transform = ''; if (dx > 90) popPage(); x0 = null; };
    pg.addEventListener('pointerup', end); pg.addEventListener('pointercancel', end);
    return entry;
  }
  function popPage() {
    const top = pageStack.pop();
    if (!top) return;
    top.el.classList.remove('on');
    const under = pageStack[pageStack.length - 1];
    if (under) { under.el.classList.remove('under'); under.refresh(); }
    setTimeout(() => top.el.remove(), 480);
    syncBack();
  }
  function refreshPages() { pageStack.forEach(p => p.refresh()); }

  // Telegram shows its own Back button; keep it in step with pages and sheets
  function syncBack() {
    if (!TG || !TG.BackButton || !tgAtLeast('6.1')) return;
    const need = pageStack.length || (txSheet && txSheet.isOpen) || (formSheet && formSheet.isOpen);
    if (need) TG.BackButton.show(); else TG.BackButton.hide();
  }
  function tgBack() {
    if (formSheet && formSheet.isOpen) formSheet.close();
    else if (txSheet && txSheet.isOpen) txSheet.close();
    else popPage();
  }

  // ---------- generic form sheet ----------
  let formSheet;
  function openForm(o) {
    const f = $('formSheet');
    $('formTitle').textContent = o.title;
    $('formOk').textContent = o.ok || 'Готово';
    $('formErr').textContent = '';
    const vals = {};
    const body = $('formBody');
    const groups = [];
    let cur = [];
    o.fields.forEach(fd => { if (fd.type === 'color' || fd.type === 'icon' || fd.type === 'seg' || fd.type === 'note') { if (cur.length) groups.push(cur); groups.push([fd]); cur = []; } else cur.push(fd); });
    if (cur.length) groups.push(cur);
    body.innerHTML = groups.map(g => {
      if (g[0].type === 'note') return '<div class="hint">' + esc(g[0].text) + '</div>';
      return '<div class="fields">' + g.map(fd => {
        const id = 'f_' + fd.id;
        vals[fd.id] = fd.value;
        if (fd.type === 'color') return '<div class="field block"><label>' + esc(fd.label) + '</label><div class="swatches" data-f="' + fd.id + '">' + COLORS.map(c => '<button type="button" style="background:' + c + ';color:' + c + '" data-v="' + c + '" aria-pressed="' + (c === fd.value) + '" aria-label="Цвет"></button>').join('') + '</div></div>';
        if (fd.type === 'icon') return '<div class="field block"><label>' + esc(fd.label) + '</label><div class="icons" data-f="' + fd.id + '">' + ICON_CHOICES.map(n => '<button type="button" data-v="' + n + '" aria-pressed="' + (n === fd.value) + '" aria-label="Значок">' + icon(n) + '</button>').join('') + '</div></div>';
        if (fd.type === 'seg') return '<div class="field block"><div class="fseg">' + segHtml(id, fd.options, fd.value, fd.label) + '</div></div>';
        if (fd.type === 'toggle') return '<div class="field"><label for="' + id + '">' + esc(fd.label) + '</label>' + switchHtml(id, fd.value, fd.label) + '</div>';
        const im = fd.type === 'money' ? ' inputmode="decimal"' : fd.type === 'int' ? ' inputmode="numeric"' : '';
        const val = fd.value == null || fd.value === '' ? '' : (fd.type === 'money' ? String(fd.value).replace('.', ',') : fd.value);
        return '<div class="field"><label for="' + id + '">' + esc(fd.label) + '</label><input id="' + id + '"' + im + ' type="' + (fd.type === 'date' ? 'date' : 'text') + '" value="' + esc(val) + '" placeholder="' + esc(fd.placeholder || '') + '" autocomplete="off" maxlength="' + (fd.max || 40) + '"></div>';
      }).join('') + '</div>';
    }).join('');
    qsa('.swatches, .icons', body).forEach(box => qsa('button', box).forEach(b => b.onclick = () => {
      haptic('select');
      vals[box.dataset.f] = b.dataset.v;
      qsa('button', box).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      if (o.onChange) o.onChange(vals, body);
    }));
    o.fields.filter(fd => fd.type === 'seg').forEach(fd => {
      const root = $('f_' + fd.id);
      seg(root, fd.value);
      qsa('button', root).forEach(b => b.onclick = () => { haptic('select'); vals[fd.id] = b.dataset.v; seg(root, b.dataset.v); if (o.onChange) o.onChange(vals, body); });
    });
    const extra = $('formExtra');
    extra.innerHTML = (o.extra || []).map((x, i) => '<button type="button" class="btn ' + (x.danger ? 'danger' : 'soft') + ' wide" data-x="' + i + '">' + (x.icon ? icon(x.icon) : '') + esc(x.text) + '</button>').join('');
    qsa('[data-x]', extra).forEach(b => b.onclick = async () => {
      const x = o.extra[Number(b.dataset.x)];
      if (x.danger) { const ok = await confirmAction({ title: x.confirmTitle || x.text, message: x.confirmText, confirm: x.text, destructive: true }); if (!ok) return; }
      x.onClick(); formSheet.close();
    });
    f.onsubmit = e => {
      e.preventDefault();
      o.fields.forEach(fd => {
        const el = $('f_' + fd.id);
        if (!el) return;
        if (fd.type === 'toggle') vals[fd.id] = el.checked;
        else if (fd.type === 'money') vals[fd.id] = parseMoney(el.value);
        else if (fd.type === 'int') vals[fd.id] = parseInt(el.value, 10);
        else if (fd.type !== 'seg') vals[fd.id] = el.value.trim();
      });
      const err = o.onSubmit(vals);
      if (err) { $('formErr').textContent = err; haptic('error'); return; }
      haptic('success');
      formSheet.close();
    };
    formSheet.open();
    const first = qs('input[type="text"]', body);
    if (first && o.focus !== false) setTimeout(() => first.focus({ preventScroll: true }), 420);
  }
  function parseMoney(s) {
    const v = parseFloat(String(s || '').replace(/\s/g, '').replace(',', '.'));
    return isFinite(v) ? round2(v) : NaN;
  }

  // ================= OVERVIEW =================
  function renderOverview() {
    const v = $('v-overview');
    const key = ui.cursor;
    const m = ofMonth(key);
    const { i, e } = sums(m);
    const prog = monthProgress(key);
    const prevKey = addMonths(key, -1);
    const pe = sums(ofMonth(prevKey)).e;
    const hideIc = state.settings.hide ? 'eyeOff' : 'eye';

    // skeleton of the overview is built once; parts are refreshed in place so numbers can roll
    if (!qs('#ovHero', v)) {
      v.innerHTML =
        '<div class="card hero" id="ovHero"><div class="hero-top"><div style="min-width:0"><div class="label"><span id="balLabel"></span><button type="button" class="eye" id="eyeBtn" aria-label="Скрыть суммы"></button></div><div class="balance num" id="balance"></div></div>' +
        '<div class="ring" aria-label="Доля отложенного"><svg viewBox="0 0 64 64"><circle class="track" cx="32" cy="32" r="27"/><circle class="val" id="ringVal" cx="32" cy="32" r="27" style="stroke-dasharray:0 170"/></svg><b class="num" id="ringPct">0%</b><small>отложено</small></div></div>' +
        '<div class="split"><div class="mini"><div class="tag" style="color:var(--fg-2)">' + icon('trendUp') + 'Доходы</div><div class="v num" id="inc"></div></div><div class="mini"><div class="tag">' + icon('trendDown') + 'Расходы</div><div class="v num" id="exp"></div></div></div>' +
        '<div class="chips" id="facts"></div></div>' +
        '<div id="ovBudget"></div><div id="ovInsights"></div><div id="ovGoals"></div><div id="ovRecent"></div><div id="ovUpcoming"></div>';
      qsa('.mini .tag svg', v)[0].style.color = 'var(--income)';
      qsa('.mini .tag svg', v)[1].style.color = 'var(--expense)';
      $('eyeBtn').onclick = () => { state.settings.hide = !state.settings.hide; haptic('light'); commit(); };
    }
    $('eyeBtn').innerHTML = icon(hideIc);
    $('eyeBtn').setAttribute('aria-label', state.settings.hide ? 'Показать суммы' : 'Скрыть суммы');
    $('balLabel').textContent = 'Остаток за ' + monthName.format(parseIso(key + '-01'));
    odometer($('balance'), money(i - e));
    $('balance').classList.toggle('neg', i - e < 0 && !state.settings.hide);
    countTo($('inc'), i, x => money(x));
    countTo($('exp'), e, x => money(x));
    const rate = i ? clamp(Math.round((i - e) / i * 100), 0, 100) : 0;
    const C = 2 * Math.PI * 27;
    raf2(() => { $('ringVal').style.strokeDasharray = (C * rate / 100) + ' ' + C; });
    countTo($('ringPct'), rate, x => Math.round(x) + '%');

    const facts = [];
    if (e && prog.d) facts.push('<span class="chip">' + icon('calendar') + 'В день <b class="num">' + money(e / prog.d, { whole: true }) + '</b></span>');
    if (e && !prog.done && !prog.future && prog.d >= 3) facts.push('<span class="chip">' + icon('sparkle') + 'Прогноз <b class="num">' + money(forecast(key, m), { whole: true }) + '</b></span>');
    if (pe && e) {
      const d = Math.round((e - pe) / pe * 100);
      facts.push('<span class="chip">К ' + monthDat(prevKey) + ' <b class="num" style="color:var(' + (d > 0 ? '--expense' : '--income') + ')">' + (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + '%</b></span>');
    }
    $('facts').innerHTML = facts.join('');
    $('facts').hidden = !facts.length;

    renderOvBudget(key, m, e, prog);
    renderOvInsights(key, m);
    renderOvGoals();
    renderOvRecent();
    renderOvUpcoming();
  }

  function renderOvBudget(key, m, e, prog) {
    const box = $('ovBudget');
    const total = state.budgets.total;
    const bc = byCat(m);
    const catLimits = Object.entries(state.budgets.cats).filter(([, v]) => v > 0);
    if (!total && !catLimits.length) {
      box.innerHTML = state.tx.length ? '<button type="button" class="card pad press" id="setBudget" style="width:100%;border:0;text-align:left;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center"><span class="ic" style="background:var(--accent)">' + icon('wallet') + '</span><span><b style="display:block;font-weight:600">Задайте бюджет на месяц</b><span class="muted" style="font-size:14px">Покажу, сколько можно тратить в день</span></span><span class="muted">' + icon('chevR', 16) + '</span></button>' : '';
      const b = $('setBudget'); if (b) b.onclick = openBudgets;
      return;
    }
    let html = '<div class="sec"><div class="sec-h"><h2>Бюджет</h2><button type="button" class="link press" id="budEdit">Изменить</button></div><div class="card pad">';
    if (total) {
      const left = total - e;
      const ratio = e / total;
      const color = ratio >= 1 ? 'var(--expense)' : ratio >= .85 ? 'var(--warn)' : 'var(--income)';
      const daysLeft = prog.future ? prog.D : prog.done ? 0 : prog.D - prog.d + 1;
      html += '<div class="budget-main"><div class="row1"><span class="big num" style="color:' + (left < 0 ? 'var(--expense)' : 'var(--fg)') + '">' + (left < 0 ? 'Перерасход ' + money(-left) : 'Осталось ' + money(left)) + '</span><span class="muted num" style="font-size:14px">из ' + money(total) + '</span></div>' +
        '<div class="bar"><i style="--c:' + color + '" data-w="' + clamp(ratio * 100, 0, 100) + '"></i></div>' +
        '<div class="muted" style="font-size:14px">' + (left > 0 && daysLeft > 0 ? 'Можно тратить <b style="color:var(--fg)" class="num">' + money(left / daysLeft, { whole: true }) + '</b> в день, ' + daysLeft + ' ' + plural(daysLeft, 'день', 'дня', 'дней') + ' до конца месяца' : left <= 0 ? 'Лимит на ' + monthName.format(parseIso(key + '-01')) + ' исчерпан' : 'Месяц закрыт: сэкономлено ' + money(left)) + '</div></div>';
    }
    if (catLimits.length) {
      const rows = catLimits.map(([id, lim]) => ({ id, lim, sp: bc[id] || 0 })).sort((a, b) => b.sp / b.lim - a.sp / a.lim).slice(0, total ? 3 : 5);
      html += '<div class="budget-cats"' + (total ? '' : ' style="margin-top:0;padding-top:0;border-top:0"') + '>' + rows.map(r => {
        const c = catOf('expense', r.id), ratio = r.sp / r.lim;
        const col = ratio >= 1 ? 'var(--expense)' : ratio >= .85 ? 'var(--warn)' : c.color;
        return '<div class="bc"><div class="h"><span><span class="ic sm" style="background:' + c.color + '">' + icon(c.icon) + '</span>' + esc(c.name) + '</span><span class="num muted">' + money(r.sp, { whole: true }) + ' / ' + money(r.lim, { whole: true }) + '</span></div><div class="bar sm"><i style="--c:' + col + '" data-w="' + clamp(ratio * 100, 0, 100) + '"></i></div></div>';
      }).join('') + '</div>';
    }
    html += '</div></div>';
    box.innerHTML = html;
    $('budEdit').onclick = openBudgets;
    growBars(box);
  }
  function growBars(root) {
    raf2(() => {
      qsa('[data-w]', root).forEach(b => { b.style.width = b.dataset.w + '%'; });
      qsa('[data-h]', root).forEach(b => { b.style.height = b.dataset.h + '%'; });
    });
  }

  function insights(key, m) {
    const out = [];
    const { i, e } = sums(m);
    if (!m.length) return out;
    const prog = monthProgress(key);
    const bc = byCat(m), prev = byCat(ofMonth(addMonths(key, -1)));
    const top = Object.entries(bc).sort((a, b) => b[1] - a[1])[0];
    if (top && e) {
      const c = catOf('expense', top[0]);
      out.push({ ic: c.icon, color: c.color, t: 'Больше всего на «' + c.name + '»', p: money(top[1]) + ' — ' + pct(top[1] / e * 100) + ' всех расходов за месяц.' });
    }
    let jump = null;
    Object.entries(bc).forEach(([id, v]) => { const pv = prev[id] || 0; if (pv > 0 && v > pv * 1.2 && v - pv > 500 && (!jump || v - pv > jump.d)) jump = { id, d: v - pv, r: (v - pv) / pv }; });
    if (jump) { const c = catOf('expense', jump.id); out.push({ ic: 'trendUp', color: '#ff9500', t: '«' + c.name + '» растут', p: 'На ' + money(jump.d) + ' больше, чем в ' + monthName.format(parseIso(addMonths(key, -1) + '-01')).replace(/ь$/, 'е').replace(/й$/, 'е').replace(/т$/, 'те') + ' (+' + pct(jump.r * 100) + ').' }); }
    if (state.budgets.total && !prog.done && !prog.future && prog.d >= 3) {
      const fc = forecast(key, m);
      if (fc > state.budgets.total * 1.03) out.push({ ic: 'alert', color: '#ff3b30', t: 'Темп выше бюджета', p: 'Если тратить так же, к концу месяца выйдет ' + money(fc, { whole: true }) + ' — на ' + money(fc - state.budgets.total, { whole: true }) + ' больше лимита.' });
      else out.push({ ic: 'check', color: '#34c759', t: 'Укладываетесь в бюджет', p: 'Прогноз на конец месяца — ' + money(fc, { whole: true }) + ' из ' + money(state.budgets.total, { whole: true }) + '.' });
    }
    if (i > 0) {
      const r = (i - e) / i;
      if (r >= .2) out.push({ ic: 'piggy', color: '#30b0c7', t: 'Отложено ' + pct(r * 100) + ' дохода', p: 'Финансисты советуют откладывать от 10–20%. Вы в норме.' });
      else if (r < 0) out.push({ ic: 'alert', color: '#ff9500', t: 'Расходы больше доходов', p: 'В этом месяце минус ' + money(e - i) + '. Посмотрите крупные траты в «Аналитике».' });
    }
    if (prog.d >= 5) {
      const spentDays = new Set(m.filter(t => t.type === 'expense').map(t => t.date));
      const free = prog.d - spentDays.size;
      if (free >= 2) out.push({ ic: 'sparkle', color: '#af52de', t: free + ' ' + plural(free, 'день', 'дня', 'дней') + ' без трат', p: 'Из ' + prog.d + ' ' + plural(prog.d, 'дня', 'дней', 'дней') + ' этого месяца.' });
    }
    return out.slice(0, 4);
  }
  function renderOvInsights(key, m) {
    const box = $('ovInsights');
    const list = insights(key, m);
    if (!list.length) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="sec"><div class="sec-h"><h2>Подсказки</h2></div><div class="hscroll">' + list.map(x =>
      '<div class="card insight"><span class="ic" style="background:' + x.color + '">' + icon(x.ic) + '</span><b>' + esc(x.t) + '</b><p>' + esc(x.p) + '</p></div>').join('') + '</div></div>';
  }

  function goalRing(g, size) {
    const r = 24, C = 2 * Math.PI * r, p = clamp(g.saved / g.target, 0, 1);
    return '<div class="gring"><svg viewBox="0 0 56 56"><circle class="t" cx="28" cy="28" r="' + r + '"/><circle class="v" cx="28" cy="28" r="' + r + '" style="stroke:' + g.color + ';stroke-dasharray:0 ' + C + '" data-len="' + (C * p) + ' ' + C + '"/></svg><span class="num">' + pct(p * 100) + '</span></div>';
  }
  function drawRings(root) { raf2(() => qsa('circle[data-len]', root).forEach(c => { c.style.strokeDasharray = c.dataset.len; })); }
  function renderOvGoals() {
    const box = $('ovGoals');
    if (!state.goals.length) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="sec"><div class="sec-h"><h2>Цели</h2><button type="button" class="link press" id="goalsAll">Все</button></div><div class="hscroll">' +
      state.goals.map(g => '<button type="button" class="card goal press" data-g="' + esc(g.id) + '">' + goalRing(g) + '<span class="n">' + esc(g.name) + '</span><span class="s num">' + money(g.saved, { whole: true }) + ' из ' + money(g.target, { whole: true }) + '</span></button>').join('') +
      '<button type="button" class="card goal add press" id="goalAdd">' + icon('plus') + 'Новая цель</button></div></div>';
    qsa('[data-g]', box).forEach(b => b.onclick = () => openGoalAction(state.goals.find(g => g.id === b.dataset.g)));
    $('goalAdd').onclick = () => editGoal(null);
    $('goalsAll').onclick = () => { go('more', true); openGoals(); };
    drawRings(box);
  }

  function rowHtml(t, k, opts) {
    const c = catOf(t.type, t.category);
    const sub = opts.date ? c.name + ' · ' + dayLabel(t.date).replace(/^[а-я]+, /, '') : c.name;
    return '<div class="swipe' + (opts.anim ? ' row-anim' : '') + '" style="animation-delay:' + Math.min(k * 30, 420) + 'ms" data-id="' + esc(t.id) + '">' +
      (opts.swipe ? '<button type="button" class="kill" tabindex="-1">Удалить</button>' : '') +
      '<button type="button" class="row"><span class="ic" style="background:' + c.color + '">' + icon(c.icon) + '</span>' +
      '<span class="t"><b>' + esc(t.note || c.name) + (t.recurringId ? '<span class="tag-rep">повтор</span>' : '') + (t.demo ? '<span class="tag-demo">пример</span>' : '') + '</b><span>' + esc(sub) + '</span></span>' +
      '<span class="a num' + (t.type === 'income' ? ' in' : '') + '">' + (t.type === 'income' ? '+' : '−') + money(t.amount) + '</span></button></div>';
  }
  const newest = (a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0);
  function renderOvRecent() {
    const box = $('ovRecent');
    if (!ready) { box.innerHTML = '<div class="skel"></div>'; return; }
    if (!state.tx.length) { box.innerHTML = emptyState(); bindEmpty(box); return; }
    const last = state.tx.slice().sort(newest).slice(0, 5);
    box.innerHTML = '<div class="sec"><div class="sec-h"><h2>Последние операции</h2><button type="button" class="link press" data-go="operations">Все</button></div><div class="card group">' + last.map((t, k) => rowHtml(t, k, { date: true, anim: true })).join('') + '</div></div>';
    bindRows(box);
    bindGo(box);
  }
  function renderOvUpcoming() {
    const box = $('ovUpcoming');
    if (!state.recurring.length) { box.innerHTML = ''; return; }
    const list = state.recurring.map(r => ({ r, next: nextDue(r) })).sort((a, b) => a.next.localeCompare(b.next)).slice(0, 3);
    box.innerHTML = '<div class="sec"><div class="sec-h"><h2>Скоро</h2><button type="button" class="link press" id="recAll">Все</button></div><div class="card list">' + list.map(({ r, next }) => {
      const c = catOf(r.type, r.category);
      return '<div class="li"><span class="ic sm" style="background:' + c.color + '">' + icon(c.icon) + '</span><span class="t"><b>' + esc(r.note || c.name) + '</b><span>' + dayLabel(next).replace(/^[а-я]+, /, '') + '</span></span><span class="r num" style="color:var(' + (r.type === 'income' ? '--income' : '--fg') + ')">' + (r.type === 'income' ? '+' : '−') + money(r.amount) + '</span></div>';
    }).join('') + '</div></div>';
    $('recAll').onclick = () => { go('more', true); openRecurring(); };
  }
  function emptyState() {
    return '<div class="card empty">' + LOGO + '<h3>Начнём?</h3><p>Нажмите «+» внизу и запишите первый доход или расход. Или посмотрите, как всё выглядит на примере.</p>' +
      '<button class="btn press" type="button" data-act="add">' + icon('plus') + 'Добавить операцию</button><button class="btn soft press" type="button" data-act="demo">Заполнить примерами</button></div>';
  }
  function bindEmpty(root) {
    qsa('[data-act="add"]', root).forEach(b => b.onclick = () => openTx(null));
    qsa('[data-act="demo"]', root).forEach(b => b.onclick = fillDemo);
  }
  function bindGo(root) { qsa('[data-go]', root).forEach(b => b.onclick = () => go(b.dataset.go, true)); }

  // ================= OPERATIONS =================
  function renderOperations() {
    const el = $('opsList');
    seg($('filter'), ui.filter);
    // category chips for the categories that appear this month
    const m = ofMonth(ui.cursor);
    const used = [];
    m.forEach(t => { const k = t.type + ':' + t.category; if (!used.includes(k) && (ui.filter === 'all' || ui.filter === t.type)) used.push(k); });
    if (ui.catFilter && !used.includes(ui.catFilter)) ui.catFilter = null;
    $('catFilter').innerHTML = used.length > 1 ? used.map(k => { const [ty, id] = k.split(':'); const c = catOf(ty, id); return '<button type="button" class="catchip" data-c="' + esc(k) + '" aria-pressed="' + (ui.catFilter === k) + '"><i style="background:' + c.color + '"></i>' + esc(c.name) + '</button>'; }).join('') : '';
    $('catFilter').hidden = used.length <= 1;
    qsa('[data-c]', $('catFilter')).forEach(b => b.onclick = () => { haptic('select'); ui.catFilter = ui.catFilter === b.dataset.c ? null : b.dataset.c; renderOperations(); });

    if (!ready) { el.innerHTML = '<div class="skel"></div>'; return; }
    if (!state.tx.length) { el.innerHTML = emptyState(); bindEmpty(el); return; }
    const q = ui.query.trim().toLowerCase();
    const list = m.filter(t =>
      (ui.filter === 'all' || t.type === ui.filter) &&
      (!ui.catFilter || ui.catFilter === t.type + ':' + t.category) &&
      (!q || (t.note || '').toLowerCase().includes(q) || catOf(t.type, t.category).name.toLowerCase().includes(q) || String(t.amount).includes(q.replace(',', '.'))));
    if (!list.length) {
      el.innerHTML = '<div class="card empty"><p>' + (q || ui.filter !== 'all' || ui.catFilter ? 'Ничего не нашлось. Попробуйте другой запрос или фильтр.' : 'В ' + monthName.format(parseIso(ui.cursor + '-01')).replace(/ь$/, 'е').replace(/й$/, 'е').replace(/т$/, 'те') + ' операций нет.') + '</p></div>';
      return;
    }
    const days = {};
    list.sort(newest).forEach(t => { (days[t.date] = days[t.date] || []).push(t); });
    const tot = sums(list);
    let n = 0;
    el.innerHTML = '<div class="days">' +
      (q || ui.filter !== 'all' || ui.catFilter ? '<div class="chips"><span class="chip">Найдено <b class="num">' + list.length + '</b></span>' + (tot.e ? '<span class="chip">Расходы <b class="num">' + money(tot.e) + '</b></span>' : '') + (tot.i ? '<span class="chip">Доходы <b class="num">' + money(tot.i) + '</b></span>' : '') + '</div>' : '') +
      Object.keys(days).sort().reverse().map(d => {
        const net = days[d].reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
        return '<div><div class="day-h"><span>' + dayLabel(d) + '</span><span class="num">' + money(net, { plus: true }) + '</span></div><div class="card group">' + days[d].map(t => rowHtml(t, n++, { swipe: true, anim: true })).join('') + '</div></div>';
      }).join('') + '</div>' +
      (state.tx.some(t => t.demo) ? '<div style="text-align:center;margin-top:18px"><button class="btn soft press" type="button" id="clearDemo">Убрать примеры</button></div>' : '') +
      '<p class="hint" style="margin-top:14px">Смахните операцию влево, чтобы удалить</p>';
    bindRows(el);
    const cd = $('clearDemo'); if (cd) cd.onclick = clearDemo;
  }

  function bindRows(root) {
    qsa('.swipe', root).forEach(sw => {
      const row = qs('.row', sw), kill = qs('.kill', sw), id = sw.dataset.id;
      let x0 = null, y0 = 0, dx = 0, drag = false, moved = false, base = 0;
      row.addEventListener('click', e => {
        if (moved) { e.preventDefault(); moved = false; return; }
        if (sw.classList.contains('open')) { closeSwipe(sw); return; }
        const t = state.tx.find(x => x.id === id);
        if (t) { haptic('light'); openTx(t); }
      });
      if (!kill) return;
      kill.onclick = () => {
        sw.style.transition = 'height .32s var(--ease), opacity .25s';
        sw.style.height = sw.offsetHeight + 'px';
        raf2(() => { sw.style.height = '0px'; sw.style.opacity = '0'; });
        setTimeout(() => removeTx(id), 300);
      };
      row.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        x0 = e.clientX; y0 = e.clientY; dx = 0; drag = false; moved = false;
        base = sw.classList.contains('open') ? -88 : 0;
      });
      row.addEventListener('pointermove', e => {
        if (x0 === null) return;
        if (e.pointerType === 'mouse' && e.buttons === 0) return;
        const mx = e.clientX - x0, my = e.clientY - y0;
        if (!drag && Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my) * 1.2) {
          drag = true; moved = true; sw.classList.add('dragging');
          qsa('.swipe.open', document).forEach(o => { if (o !== sw) closeSwipe(o); });
          try { row.setPointerCapture(e.pointerId); } catch (err) {}
        }
        if (!drag) return;
        dx = Math.min(0, Math.max(-150, base + mx));
        if (dx < -88) dx = -88 + (dx + 88) * .3;
        row.style.transform = 'translate3d(' + dx + 'px,0,0)';
        // a full swipe deletes, like Mail
        if (dx < -140 && !sw.dataset.armed) { sw.dataset.armed = '1'; haptic('medium'); }
      });
      const end = () => {
        if (!drag) { x0 = null; return; }
        sw.classList.remove('dragging');
        if (dx <= -140) { closeSwipe(sw); kill.click(); }
        else if (dx < -44) { sw.classList.add('open'); row.style.transform = 'translate3d(-88px,0,0)'; haptic('light'); }
        else closeSwipe(sw);
        delete sw.dataset.armed;
        drag = false; x0 = null;
        setTimeout(() => { moved = false; }, 60);
      };
      row.addEventListener('pointerup', end);
      row.addEventListener('pointercancel', end);
    });
  }
  function closeSwipe(sw) { sw.classList.remove('open'); const r = qs('.row', sw); if (r) r.style.transform = ''; }

  function removeTx(id) {
    const idx = state.tx.findIndex(t => t.id === id);
    if (idx < 0) return;
    const [gone] = state.tx.splice(idx, 1);
    haptic('medium');
    commit();
    toast('Операция удалена', 'trash', () => { state.tx.push(gone); commit(); });
  }

  // ================= ANALYTICS =================
  function renderAnalytics() {
    const v = $('v-analytics');
    const year = ui.period === 'year';
    const key = ui.cursor, y = Number(key.slice(0, 4));
    const list = year ? ofYear(y) : ofMonth(key);
    const prevList = year ? ofYear(y - 1) : ofMonth(addMonths(key, -1));
    const t = sums(list);
    v.innerHTML =
      segHtml('periodSeg', [['month', 'Месяц'], ['year', 'Год']], ui.period, 'Период') +
      '<div class="totals"><div class="mini"><div class="tag">Доходы</div><div class="v num" style="color:var(--income)">' + money(t.i, { whole: true }) + '</div></div><div class="mini"><div class="tag">Расходы</div><div class="v num">' + money(t.e, { whole: true }) + '</div></div><div class="mini"><div class="tag">Итог</div><div class="v num" style="color:var(' + (t.i - t.e < 0 ? '--expense' : '--fg') + ')">' + money(t.i - t.e, { whole: true, plus: true }) + '</div></div></div>' +
      '<div class="card pad" id="donutCard"></div>' +
      (year ? '' : '<div class="card pad" id="paceCard"></div><div class="card pad" id="heatCard"></div>') +
      '<div class="card pad" id="barsCard"></div>' +
      '<div class="card pad" id="rankCard"></div>' +
      '<div class="stats" id="statsBox"></div>';
    seg($('periodSeg'), ui.period);
    qsa('#periodSeg button').forEach(b => b.onclick = () => { if (ui.period === b.dataset.v) return; haptic('select'); ui.period = b.dataset.v; ui.donutSel = null; ui.barSel = null; renderNav(); renderAnalytics(); });
    renderDonut(list, t.e);
    if (!year) { renderPace(key, list); renderHeat(key, list); }
    renderBars(year, key);
    renderRank(list, prevList, t.e, year);
    renderStats(list, year, key);
  }

  function emptyChart(text) { return '<p class="muted" style="margin:0;text-align:center;padding:16px 0">' + esc(text) + '</p>'; }

  function renderDonut(list, total) {
    const box = $('donutCard');
    const by = byCat(list);
    const parts = Object.entries(by).sort((a, b) => b[1] - a[1]);
    let html = '<div class="card-h"><h3>Куда уходят деньги</h3><span class="sub">' + (parts.length ? parts.length + ' ' + plural(parts.length, 'категория', 'категории', 'категорий') : '') + '</span></div>';
    if (!parts.length) { box.innerHTML = html + emptyChart('Расходов за этот период нет.'); return; }
    if (ui.donutSel && !by[ui.donutSel]) ui.donutSel = null;
    const R = 64, C = 2 * Math.PI * R, gap = parts.length > 1 ? 3 : 0;
    let acc = 0;
    const segs = parts.map(([id, v]) => { const s = { id, v, c: catOf('expense', id), len: Math.max(.5, v / total * C - gap), off: -acc, delay: acc / C }; acc += v / total * C; return s; });
    const center = s => s ? '<b class="num">' + money(s.v, { whole: true }) + '</b><span>' + esc(s.c.name) + ' · ' + pct(s.v / total * 100) + '</span>' : '<b class="num">' + money(total, { whole: true }) + '</b><span>все расходы</span>';
    const sel = segs.find(s => s.id === ui.donutSel);
    html += '<div class="donut-wrap"><div class="donut' + (sel ? ' has-sel' : '') + '"><svg viewBox="0 0 172 172"><circle class="track" cx="86" cy="86" r="' + R + '"/>' +
      segs.map(s => '<circle class="seg-c' + (s.id === ui.donutSel ? ' sel' : '') + '" data-cat="' + esc(s.id) + '" cx="86" cy="86" r="' + R + '" style="stroke:' + s.c.color + ';stroke-dasharray:0 ' + C + ';stroke-dashoffset:' + s.off + ';transition-delay:' + (s.delay * .6).toFixed(2) + 's,0s,0s" data-len="' + s.len + '"><title>' + esc(s.c.name) + '</title></circle>').join('') +
      '</svg><div class="c">' + center(sel) + '</div></div><div class="legend">' +
      segs.slice(0, 7).map(s => '<button type="button" data-cat="' + esc(s.id) + '" aria-pressed="' + (s.id === ui.donutSel) + '"><i class="dot" style="background:' + s.c.color + '"></i><span class="n">' + esc(s.c.name) + '</span><span class="p num">' + pct(s.v / total * 100) + '</span></button>').join('') +
      '</div></div>';
    box.innerHTML = html;
    raf2(() => qsa('circle[data-len]', box).forEach(c => { c.style.strokeDasharray = c.dataset.len + ' ' + C; }));
    qsa('[data-cat]', box).forEach(el => el.addEventListener('click', () => {
      haptic('select');
      ui.donutSel = ui.donutSel === el.dataset.cat ? null : el.dataset.cat;
      const d = qs('.donut', box);
      d.classList.toggle('has-sel', !!ui.donutSel);
      qsa('circle.seg-c', box).forEach(c => { c.style.transitionDelay = '0s'; c.classList.toggle('sel', c.dataset.cat === ui.donutSel); });
      qsa('.legend button', box).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === ui.donutSel)));
      qs('.c', d).innerHTML = center(segs.find(x => x.id === ui.donutSel));
    }));
  }

  function smoothPath(pts) {
    if (!pts.length) return '';
    let d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 2] || pts[i - 1], p1 = pts[i - 1], p2 = pts[i], p3 = pts[i + 1] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1[0].toFixed(1) + ',' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ',' + c2[1].toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }
  function drawLine(path, dur, delay) {
    try {
      const L = path.getTotalLength() + 2;
      path.style.strokeDasharray = path.classList.contains('l-prev') ? '' : L;
      if (path.classList.contains('l-prev')) { path.style.opacity = 0; path.style.transition = 'opacity .8s ' + (delay || 0) + 's'; raf2(() => { path.style.opacity = 1; }); return; }
      path.style.strokeDashoffset = L;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset ' + dur + 's ' + (delay || 0) + 's var(--ease)';
      raf2(() => { path.style.strokeDashoffset = 0; });
    } catch (e) {}
  }

  // cumulative spending this month vs last month, with the budget as a line
  function renderPace(key, list) {
    const box = $('paceCard');
    const [y, mo] = key.split('-').map(Number);
    const D = daysIn(y, mo - 1);
    const prog = monthProgress(key);
    const lastDay = prog.future ? 0 : prog.d;
    const cum = (lst, n) => { const per = Array(n).fill(0); lst.filter(t => t.type === 'expense').forEach(t => { const d = Number(t.date.slice(8, 10)); if (d >= 1 && d <= n) per[d - 1] += t.amount; }); let s = 0; return { per, cum: per.map(v => (s += v)) }; };
    const now = cum(list, D);
    const pk = addMonths(key, -1), [py, pm] = pk.split('-').map(Number);
    const prev = cum(ofMonth(pk), daysIn(py, pm - 1));
    const budget = state.budgets.total;
    const nowVals = now.cum.slice(0, lastDay);
    const max = Math.max(1, ...nowVals, ...prev.cum, budget || 0);
    let html = '<div class="card-h"><h3>Темп трат</h3><span class="sub">' + (lastDay ? 'к ' + lastDay + ' числу ' + money(nowVals[lastDay - 1] || 0, { whole: true }) : '') + '</span></div>';
    if (!nowVals.some(v => v > 0) && !prev.cum.some(v => v > 0)) { box.innerHTML = html + emptyChart('Здесь появится график, когда будут расходы.'); return; }
    const W = 340, H = 170, top = 14, bottom = 20, left = 2, right = 2;
    const x = i => left + i / (D - 1) * (W - left - right);
    const yv = v => top + (1 - v / max) * (H - top - bottom);
    const ptsNow = nowVals.map((v, i) => [x(i), yv(v)]);
    const ptsPrev = prev.cum.slice(0, D).map((v, i) => [x(i), yv(v)]);
    const dNow = smoothPath(ptsNow);
    const area = ptsNow.length > 1 ? dNow + ' L' + ptsNow[ptsNow.length - 1][0].toFixed(1) + ',' + (H - bottom) + ' L' + ptsNow[0][0].toFixed(1) + ',' + (H - bottom) + ' Z' : '';
    const ticks = [1, 10, 20, D];
    html += '<div class="chart" id="paceChart"><div class="tip" id="paceTip"></div><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Накопленные расходы по дням">' +
      '<defs><linearGradient id="paceG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>' +
      [0, .5, 1].map(f => '<line class="grid" x1="0" x2="' + W + '" y1="' + yv(max * f).toFixed(1) + '" y2="' + yv(max * f).toFixed(1) + '"' + (f ? ' stroke-dasharray="2 4"' : '') + '/>').join('') +
      (budget ? '<line class="l-budget" x1="0" x2="' + W + '" y1="' + yv(budget).toFixed(1) + '" y2="' + yv(budget).toFixed(1) + '"/>' : '') +
      (ptsPrev.length > 1 ? '<path class="l-prev" d="' + smoothPath(ptsPrev) + '"/>' : '') +
      (area ? '<path d="' + area + '" fill="url(#paceG)" class="pace-area" style="opacity:0;transition:opacity 1s .5s"/>' : '') +
      (ptsNow.length > 1 ? '<path class="l-now" d="' + dNow + '"/>' : '') +
      '<line class="cross" id="paceX" x1="0" x2="0" y1="' + top + '" y2="' + (H - bottom) + '" style="opacity:0"/>' +
      (ptsNow.length ? '<circle class="dotp" id="paceDot" r="5" cx="' + ptsNow[ptsNow.length - 1][0].toFixed(1) + '" cy="' + ptsNow[ptsNow.length - 1][1].toFixed(1) + '" style="opacity:0;transition:opacity .3s 1.2s"/>' : '') +
      ticks.map(t => '<text x="' + x(t - 1).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="' + (t === 1 ? 'start' : t === D ? 'end' : 'middle') + '">' + t + '</text>').join('') +
      '<text x="' + (W - 2) + '" y="' + (top - 4) + '" text-anchor="end">' + compact(max) + '</text>' +
      '</svg></div><div class="legend-line"><span><i></i>' + esc(monthName.format(parseIso(key + '-01'))) + '</span><span><i class="prev"></i>' + esc(monthName.format(parseIso(pk + '-01'))) + '</span>' + (budget ? '<span><i class="budget"></i>бюджет</span>' : '') + '</div>';
    box.innerHTML = html;
    qsa('path.l-now, path.l-prev', box).forEach((p, i) => drawLine(p, 1.4, p.classList.contains('l-prev') ? .2 : 0));
    raf2(() => { const a = qs('.pace-area', box); if (a) a.style.opacity = 1; const d = $('paceDot'); if (d) d.style.opacity = 1; });
    // scrub to read any day
    const chart = $('paceChart'), svg = qs('svg', chart), tip = $('paceTip'), cross = $('paceX'), dot = $('paceDot');
    if (!dot || !ptsNow.length) return;
    const show = e => {
      const r = svg.getBoundingClientRect();
      const fx = clamp((e.clientX - r.left) / r.width * W, 0, W);
      const i = clamp(Math.round((fx - left) / (W - left - right) * (D - 1)), 0, ptsNow.length - 1);
      const [px, py2] = ptsNow[i];
      dot.style.transition = 'none'; dot.setAttribute('cx', px); dot.setAttribute('cy', py2); dot.style.opacity = 1;
      cross.setAttribute('x1', px); cross.setAttribute('x2', px); cross.style.opacity = 1;
      tip.innerHTML = (i + 1) + ' ' + esc(monthGen(key)) + ': ' + money(nowVals[i], { whole: true }) + (now.per[i] ? ' · за день ' + money(now.per[i], { whole: true }) : '');
      tip.style.left = clamp(px / W * r.width, 70, r.width - 70) + 'px';
      tip.classList.add('on');
      if (chart.dataset.i !== String(i)) { chart.dataset.i = i; haptic('select'); }
    };
    const hide = () => { tip.classList.remove('on'); cross.style.opacity = 0; const L = ptsNow[ptsNow.length - 1]; dot.setAttribute('cx', L[0]); dot.setAttribute('cy', L[1]); };
    chart.addEventListener('pointerdown', show);
    chart.addEventListener('pointermove', show);
    chart.addEventListener('pointerleave', hide);
    chart.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') setTimeout(hide, 1200); });
  }

  function renderHeat(key, list) {
    const box = $('heatCard');
    const [y, mo] = key.split('-').map(Number);
    const D = daysIn(y, mo - 1);
    const first = (new Date(y, mo - 1, 1).getDay() + 6) % 7;
    const per = Array(D).fill(0), cnt = Array(D).fill(0);
    list.filter(t => t.type === 'expense').forEach(t => { const d = Number(t.date.slice(8, 10)) - 1; if (d >= 0 && d < D) { per[d] += t.amount; cnt[d]++; } });
    const max = Math.max(...per);
    const tIso = todayIso();
    if (ui.heatSel && ui.heatSel.slice(0, 7) !== key) ui.heatSel = null;
    let html = '<div class="card-h"><h3>Календарь трат</h3><span class="sub">чем ярче, тем больше</span></div><div class="heat">' +
      ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => '<div class="wd">' + d + '</div>').join('') + '<div></div>'.repeat(first);
    for (let d = 1; d <= D; d++) {
      const ds = key + '-' + pad(d), v = per[d - 1];
      const a = max ? .22 + .78 * Math.sqrt(v / max) : 0;
      html += '<button type="button" data-d="' + ds + '" class="' + (v ? 'has' : '') + (ds === tIso ? ' today' : '') + (ds > tIso ? ' future' : '') + '" style="animation-delay:' + (d * 12) + 'ms' + (v ? ';background:rgba(10,132,255,' + a.toFixed(2) + ')' : '') + '" aria-pressed="' + (ui.heatSel === ds) + '" aria-label="' + d + ': ' + money(v) + '">' + d + '</button>';
    }
    html += '</div><div class="heat-read" id="heatRead"></div>';
    box.innerHTML = html;
    const read = ds => {
      const r = $('heatRead');
      if (!ds) { const free = per.slice(0, monthProgress(key).d).filter(v => !v).length; r.innerHTML = '<span class="muted">Нажмите на день</span><span class="muted">' + (free ? 'без трат: ' + free + ' ' + plural(free, 'день', 'дня', 'дней') : '') + '</span>'; return; }
      const d = Number(ds.slice(8)) - 1;
      r.innerHTML = '<span>' + esc(dayLabel(ds)) + '</span><span class="num"><b>' + money(per[d]) + '</b> · ' + cnt[d] + ' ' + plural(cnt[d], 'трата', 'траты', 'трат') + '</span>';
    };
    read(ui.heatSel);
    qsa('[data-d]', box).forEach(b => b.onclick = () => {
      haptic('select');
      ui.heatSel = ui.heatSel === b.dataset.d ? null : b.dataset.d;
      qsa('[data-d]', box).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.d === ui.heatSel)));
      read(ui.heatSel);
    });
  }

  function renderBars(year, key) {
    const box = $('barsCard');
    const cols = [];
    if (year) {
      const y = Number(key.slice(0, 4));
      for (let m = 0; m < 12; m++) { const k = y + '-' + pad(m + 1); cols.push({ k, label: monthShort.format(new Date(y, m, 1)).replace('.', ''), name: monthNameY.format(new Date(y, m, 1)), ...sums(ofMonth(k)) }); }
    } else {
      for (let n = 5; n >= 0; n--) { const k = addMonths(key, -n); const d = parseIso(k + '-01'); cols.push({ k, label: monthShort.format(d).replace('.', ''), name: monthNameY.format(d), ...sums(ofMonth(k)) }); }
    }
    if (ui.barSel == null || ui.barSel >= cols.length) ui.barSel = year ? Number(key.slice(5)) - 1 : cols.length - 1;
    const max = Math.max(1, ...cols.map(c => Math.max(c.i, c.e)));
    box.innerHTML = '<div class="card-h"><h3>' + (year ? 'По месяцам' : 'Полгода') + '</h3><span class="sub">нажмите на столбик</span></div><div class="bar-read" id="barRead"></div>' +
      '<div class="bars" style="grid-template-columns:repeat(' + cols.length + ',1fr)">' + cols.map((c, k) =>
        '<button type="button" class="bar-col" data-k="' + k + '" aria-pressed="' + (k === ui.barSel) + '" aria-label="' + esc(c.name) + ': доходы ' + money(c.i) + ', расходы ' + money(c.e) + '"><span class="bar-pair"><i style="background:var(--income);transition-delay:' + k * 45 + 'ms" data-h="' + (c.i / max * 100) + '"></i><i style="background:var(--expense);transition-delay:' + (k * 45 + 25) + 'ms" data-h="' + (c.e / max * 100) + '"></i></span><span>' + esc(c.label) + '</span></button>').join('') +
      '</div><div class="legend-line"><span><i style="border-color:var(--income)"></i>доходы</span><span><i style="border-color:var(--expense)"></i>расходы</span></div>';
    const read = k => { const c = cols[k]; $('barRead').innerHTML = '<b>' + esc(c.name) + '</b><span class="num"><span style="color:var(--income)">' + money(c.i, { whole: true, plus: true }) + '</span> · <span style="color:var(--expense)">−' + money(c.e, { whole: true }) + '</span></span>'; };
    read(ui.barSel);
    qsa('.bar-col', box).forEach(b => b.onclick = () => { haptic('select'); ui.barSel = Number(b.dataset.k); qsa('.bar-col', box).forEach(x => x.setAttribute('aria-pressed', String(x === b))); read(ui.barSel); });
    growBars(box);
  }

  function renderRank(list, prevList, total, year) {
    const box = $('rankCard');
    const by = byCat(list), pb = byCat(prevList);
    const rows = Object.entries(by).sort((a, b) => b[1] - a[1]);
    let html = '<div class="card-h"><h3>Категории</h3><span class="sub">к прошлому ' + (year ? 'году' : 'месяцу') + '</span></div>';
    if (!rows.length) { box.innerHTML = html + emptyChart('Нет расходов.'); return; }
    const top = rows[0][1];
    html += '<div class="rank">' + rows.map(([id, v]) => {
      const c = catOf('expense', id), pv = pb[id] || 0;
      const d = pv ? Math.round((v - pv) / pv * 100) : null;
      return '<div class="rk"><span class="ic sm" style="background:' + c.color + '">' + icon(c.icon) + '</span><div class="b"><div class="h"><b>' + esc(c.name) + '</b><span class="num">' + money(v, { whole: true }) + '</span></div><div class="bar sm"><i style="--c:' + c.color + '" data-w="' + (v / top * 100) + '"></i></div><div class="d"><span>' + pct(v / total * 100) + ' расходов</span>' +
        (d === null ? '<span>новое</span>' : '<span class="delta ' + (d > 0 ? 'up' : d < 0 ? 'down' : '') + '">' + (d > 0 ? '▲ ' : d < 0 ? '▼ ' : '') + Math.abs(d) + '%</span>') + '</div></div></div>';
    }).join('') + '</div>';
    box.innerHTML = html;
    growBars(box);
  }

  function renderStats(list, year, key) {
    const box = $('statsBox');
    const ex = list.filter(t => t.type === 'expense');
    const e = ex.reduce((s, t) => s + t.amount, 0);
    const biggest = ex.slice().sort((a, b) => b.amount - a.amount)[0];
    let days;
    if (year) { const y = Number(key.slice(0, 4)), now = new Date(); days = y < now.getFullYear() ? 365 : y > now.getFullYear() ? 0 : Math.ceil((now - new Date(y, 0, 1)) / 864e5); }
    else days = monthProgress(key).d;
    const cards = [
      ['В среднем в день', days && e ? money(e / days, { whole: true }) : '—', days ? 'за ' + days + ' ' + plural(days, 'день', 'дня', 'дней') : ''],
      ['Средний расход', ex.length ? money(e / ex.length, { whole: true }) : '—', ex.length ? ex.length + ' ' + plural(ex.length, 'трата', 'траты', 'трат') : ''],
      ['Самая крупная', biggest ? money(biggest.amount, { whole: true }) : '—', biggest ? (biggest.note || catOf('expense', biggest.category).name) : '']
    ];
    if (year) {
      const y = Number(key.slice(0, 4));
      let plus = 0, cnt = 0;
      for (let m = 1; m <= 12; m++) { const s = sums(ofMonth(y + '-' + pad(m))); if (s.i || s.e) { cnt++; if (s.i >= s.e) plus++; } }
      cards.push(['Месяцев в плюсе', cnt ? plus + ' из ' + cnt : '—', '']);
    } else {
      const spent = new Set(ex.map(t => t.date)).size;
      cards.push(['Дней без трат', days ? String(Math.max(0, days - spent)) : '—', days ? 'из ' + days : '']);
    }
    box.innerHTML = cards.map(c => '<div class="card stat"><span>' + esc(c[0]) + '</span><b class="num">' + esc(c[1]) + '</b><small>' + esc(c[2]) + '</small></div>').join('');
  }

  // ================= MORE =================
  function li(o) {
    const tag = o.onClick || o.btn ? 'button type="button"' : 'div';
    return '<' + tag + ' class="li' + (o.icon ? '' : ' noicon') + (o.cls ? ' ' + o.cls : '') + '"' + (o.id ? ' id="' + o.id + '"' : '') + (o.data ? ' data-k="' + esc(o.data) + '"' : '') + '>' +
      (o.icon ? '<span class="ic sm" style="background:' + o.color + '">' + icon(o.icon) + '</span>' : '') +
      '<span class="t"><b>' + esc(o.title) + '</b>' + (o.sub ? '<span>' + esc(o.sub) + '</span>' : '') + '</span>' +
      '<span class="r">' + (o.right || '') + (o.chev ? icon('chevR') : '') + '</span></' + (tag === 'div' ? 'div' : 'button') + '>';
  }
  function modeName() {
    if (TG) return 'Telegram';
    const cap = window.Capacitor;
    if (cap && cap.isNativePlatform && cap.isNativePlatform()) return location.protocol === 'https:' ? 'Онлайн-версия' : 'Офлайн-версия';
    if (window.claude) return 'Версия в Claude';
    return 'Веб-версия';
  }
  function storeName() {
    return !backend ? '…' : backend.kind === 'native' ? 'на этом iPhone' : backend.kind === 'telegram' ? 'в облаке Telegram' : backend.kind === 'claude' ? 'в аккаунте Claude' : 'в этом браузере';
  }
  function renderMore() {
    const v = $('v-more');
    const s = state.settings;
    const cur = CURRENCIES.find(c => c[0] === s.currency);
    const themeName = { system: 'Как в системе', light: 'Светлая', dark: 'Тёмная' }[s.theme] || 'Как в системе';
    const budgetSub = state.budgets.total ? money(state.budgets.total, { whole: true, show: true }) + ' в месяц' : 'Не задан';
    v.innerHTML =
      '<div class="grp"><div class="list-head">Планирование</div><div class="card list">' +
      li({ icon: 'wallet', color: '#34c759', title: 'Бюджет', sub: budgetSub, chev: true, id: 'mBudget', btn: true }) +
      li({ icon: 'target', color: '#ff9500', title: 'Цели и копилки', sub: state.goals.length ? state.goals.length + ' ' + plural(state.goals.length, 'цель', 'цели', 'целей') : 'Копите на что-то важное', chev: true, id: 'mGoals', btn: true }) +
      li({ icon: 'sub', color: '#5856d6', title: 'Регулярные платежи', sub: state.recurring.length ? state.recurring.length + ' ' + plural(state.recurring.length, 'платёж', 'платежа', 'платежей') : 'Аренда, подписки, зарплата', chev: true, id: 'mRec', btn: true }) +
      li({ icon: 'tag', color: '#ff2d55', title: 'Категории', sub: state.cats.length ? 'своих: ' + state.cats.length : 'Добавьте свои', chev: true, id: 'mCats', btn: true }) +
      '</div></div>' +
      '<div class="grp"><div class="list-head">Настройки</div><div class="card list">' +
      li({ icon: 'globe', color: '#007aff', title: 'Валюта', right: esc(cur ? cur[0] : s.currency), chev: true, id: 'mCur', btn: true }) +
      li({ icon: 'moon', color: '#5856d6', title: 'Оформление', right: esc(themeName), chev: true, id: 'mTheme', btn: true }) +
      '<label class="li" for="sHide"><span class="ic sm" style="background:#8e8e93">' + icon('eyeOff') + '</span><span class="t"><b>Скрывать суммы</b><span>Цифры заменятся точками</span></span><span class="r">' + switchHtml('sHide', s.hide, 'Скрывать суммы') + '</span></label>' +
      '<label class="li" for="sPin"><span class="ic sm" style="background:#ff3b30">' + icon('lock') + '</span><span class="t"><b>Код-пароль</b><span>Спрашивать код при входе</span></span><span class="r">' + switchHtml('sPin', !!s.pin, 'Код-пароль') + '</span></label>' +
      '<label class="li" for="sHap"><span class="ic sm" style="background:#30b0c7">' + icon('hand') + '</span><span class="t"><b>Вибрация</b><span>Отклик при нажатиях</span></span><span class="r">' + switchHtml('sHap', s.haptics, 'Вибрация') + '</span></label>' +
      '</div></div>' +
      '<div class="grp"><div class="list-head">Данные</div><div class="card list">' +
      li({ icon: 'download', color: '#34c759', title: 'Экспорт в CSV', sub: 'Для Excel и Numbers', id: 'mCsv', btn: true }) +
      li({ icon: 'archive', color: '#007aff', title: 'Резервная копия', sub: 'Сохранить все данные в файл', id: 'mBackup', btn: true }) +
      li({ icon: 'upload', color: '#ff9500', title: 'Восстановить из копии', sub: 'Заменит текущие данные', id: 'mRestore', btn: true }) +
      (state.tx.some(t => t.demo) ? li({ icon: 'sparkle', color: '#af52de', title: 'Убрать примеры', id: 'mDemoOff', btn: true }) : li({ icon: 'sparkle', color: '#af52de', title: 'Заполнить примерами', sub: 'Помеченные операции, можно убрать', id: 'mDemo', btn: true })) +
      li({ icon: 'trash', color: '#ff3b30', title: 'Удалить все данные', cls: 'danger', id: 'mWipe', btn: true }) +
      '</div><div class="list-foot">Данные хранятся ' + esc(storeName()) + ' и никуда не отправляются. Делайте резервную копию перед переустановкой приложения.</div></div>' +
      '<div class="grp"><div class="list-head">О приложении</div><div class="card list">' +
      li({ title: 'Ровно', right: esc(BUILD ? 'v' + BUILD.version : 'web') }) +
      li({ title: 'Режим', right: esc(modeName()) }) +
      (BUILD ? li({ title: 'Сборка', right: esc(BUILD.sha + ' · ' + BUILD.date) }) : '') +
      li({ title: 'Операций', right: String(state.tx.length) }) +
      '</div></div>';
    $('mBudget').onclick = openBudgets;
    $('mGoals').onclick = openGoals;
    $('mRec').onclick = openRecurring;
    $('mCats').onclick = openCategories;
    $('mCur').onclick = openCurrency;
    $('mTheme').onclick = openTheme;
    $('sHide').onchange = e => { s.hide = e.target.checked; haptic('select'); commit(); };
    $('sHap').onchange = e => { s.haptics = e.target.checked; haptic('select'); persist(); };
    $('sPin').onchange = e => {
      if (e.target.checked) { e.target.checked = false; setPin(); }
      else { e.target.checked = true; askPin('Введите код, чтобы выключить', () => { s.pin = ''; commit(); toast('Код-пароль выключен', 'ok'); }); }
    };
    $('mCsv').onclick = exportCsv;
    $('mBackup').onclick = exportBackup;
    $('mRestore').onclick = () => $('importFile').click();
    if ($('mDemo')) $('mDemo').onclick = fillDemo;
    if ($('mDemoOff')) $('mDemoOff').onclick = clearDemo;
    $('mWipe').onclick = async () => {
      const ok = await confirmAction({ title: 'Удалить все данные?', message: 'Операции, бюджеты, цели и настройки будут удалены без возможности восстановления.', confirm: 'Удалить всё', destructive: true });
      if (!ok) return;
      state = defaults(); applyTheme(); commit(); toast('Все данные удалены', 'trash');
    };
  }

  // ---------- budgets ----------
  function openBudgets() {
    pushPage('Бюджет', pg => {
      const m = ofMonth(ymOf(new Date()));
      const bc = byCat(m), e = sums(m).e;
      const t = state.budgets.total;
      pg.body.innerHTML =
        '<div class="grp"><div class="list-head">На месяц</div><div class="card list">' +
        li({ icon: 'wallet', color: '#34c759', title: 'Общий лимит', sub: t ? 'потрачено ' + money(e, { whole: true }) + ' в этом месяце' : 'Сколько готовы тратить в месяц', right: t ? money(t, { whole: true }) : 'Задать', chev: true, id: 'bTotal', btn: true }) +
        '</div><div class="list-foot">На «Обзоре» появится полоса бюджета и сумма, которую можно тратить в день.</div></div>' +
        '<div class="grp"><div class="list-head">По категориям</div><div class="card list">' +
        cats('expense').map(c => {
          const lim = state.budgets.cats[c.id] || 0, sp = bc[c.id] || 0;
          return li({ icon: c.icon, color: c.color, title: c.name, sub: lim ? money(sp, { whole: true }) + ' из ' + money(lim, { whole: true }) + (sp > lim ? ' · перерасход' : '') : sp ? 'потрачено ' + money(sp, { whole: true }) : '', right: lim ? '' : 'Нет', chev: true, data: c.id, btn: true });
        }).join('') + '</div></div>';
      $('bTotal').onclick = () => openForm({
        title: 'Бюджет на месяц', fields: [{ id: 'v', label: 'Сумма', type: 'money', value: t || '', placeholder: '0' }],
        extra: t ? [{ text: 'Убрать лимит', danger: true, onClick: () => { state.budgets.total = 0; commit(); } }] : [],
        onSubmit: v => { if (!(v.v > 0)) return 'Введите сумму больше нуля'; state.budgets.total = v.v; commit(); }
      });
      qsa('[data-k]', pg.body).forEach(b => b.onclick = () => {
        const c = catOf('expense', b.dataset.k), lim = state.budgets.cats[c.id] || 0;
        openForm({
          title: c.name, fields: [{ id: 'v', label: 'Лимит в месяц', type: 'money', value: lim || '', placeholder: '0' }],
          extra: lim ? [{ text: 'Убрать лимит', danger: true, onClick: () => { delete state.budgets.cats[c.id]; commit(); } }] : [],
          onSubmit: v => { if (!(v.v > 0)) return 'Введите сумму больше нуля'; state.budgets.cats[c.id] = v.v; commit(); }
        });
      });
    });
  }

  // ---------- goals ----------
  function openGoals() {
    pushPage('Цели', pg => {
      pg.act.innerHTML = '<button type="button" class="link" id="gAdd" aria-label="Новая цель">' + icon('plus', 24) + '</button>';
      $('gAdd').onclick = () => editGoal(null);
      if (!state.goals.length) {
        pg.body.innerHTML = '<div class="card empty"><span class="ic" style="background:#ff9500;width:56px;height:56px;border-radius:16px">' + icon('target') + '</span><h3>Копите на мечту</h3><p>Отпуск, телефон, подушка безопасности. Задайте сумму и пополняйте копилку, а я покажу прогресс.</p><button class="btn press" type="button" id="gFirst">' + icon('plus') + 'Создать цель</button></div>';
        $('gFirst').onclick = () => editGoal(null);
        return;
      }
      pg.body.innerHTML = '<div class="card list">' + state.goals.map(g => {
        const p = clamp(g.saved / g.target, 0, 1);
        return '<button type="button" class="li" data-k="' + esc(g.id) + '" style="grid-template-columns:56px 1fr auto;padding:12px 16px"><span class="goal" style="padding:0;width:56px">' + goalRing(g) + '</span><span class="t"><b style="font-weight:600">' + esc(g.name) + '</b><span class="num">' + money(g.saved, { whole: true }) + ' из ' + money(g.target, { whole: true }) + (p >= 1 ? ' · готово!' : ' · осталось ' + money(g.target - g.saved, { whole: true })) + '</span></span><span class="r">' + icon('chevR') + '</span></button>';
      }).join('') + '</div><p class="hint">Нажмите на цель, чтобы пополнить или изменить</p>';
      qsa('[data-k]', pg.body).forEach(b => b.onclick = () => openGoalAction(state.goals.find(g => g.id === b.dataset.k)));
      drawRings(pg.body);
    });
  }
  function openGoalAction(g) {
    if (!g) return;
    openForm({
      title: g.name, ok: 'Внести',
      fields: [{ id: 'v', label: 'Пополнить на', type: 'money', value: '', placeholder: '0' }, { type: 'note', text: 'Накоплено ' + money(g.saved) + ' из ' + money(g.target) + '. Чтобы снять деньги, введите сумму с минусом.' }],
      extra: [{ text: 'Изменить цель', icon: 'tag', onClick: () => setTimeout(() => editGoal(g), 500) }, { text: 'Удалить цель', danger: true, confirmText: 'Накопления по цели тоже удалятся.', onClick: () => { state.goals = state.goals.filter(x => x.id !== g.id); commit(); toast('Цель удалена', 'trash'); } }],
      onSubmit: v => {
        if (!isFinite(v.v) || v.v === 0) return 'Введите сумму';
        const before = g.saved;
        g.saved = Math.max(0, round2(g.saved + v.v));
        commit();
        if (before < g.target && g.saved >= g.target) { setTimeout(() => { confetti(); toast('Цель «' + g.name + '» достигнута!', 'ok'); }, 450); }
        else toast(v.v > 0 ? 'Пополнено на ' + money(v.v) : 'Снято ' + money(-v.v), 'ok');
      }
    });
  }
  function editGoal(g) {
    const isNew = !g;
    openForm({
      title: isNew ? 'Новая цель' : 'Цель',
      fields: [
        { id: 'name', label: 'Название', type: 'text', value: g ? g.name : '', placeholder: 'Отпуск', max: 30 },
        { id: 'target', label: 'Нужно', type: 'money', value: g ? g.target : '', placeholder: '0' },
        { id: 'saved', label: 'Уже есть', type: 'money', value: g ? g.saved : '', placeholder: '0' },
        { id: 'color', label: 'Цвет', type: 'color', value: g ? g.color : '#ff9500' }
      ],
      onSubmit: v => {
        if (!v.name) return 'Введите название';
        if (!(v.target > 0)) return 'Введите сумму цели';
        const saved = v.saved > 0 ? v.saved : 0;
        if (isNew) state.goals.push({ id: uid('g'), name: v.name, target: v.target, saved, color: v.color || '#ff9500', createdAt: Date.now() });
        else Object.assign(g, { name: v.name, target: v.target, saved, color: v.color || g.color });
        commit();
      }
    });
  }

  // ---------- recurring ----------
  function nextDue(r) {
    const now = new Date(), cur = ymOf(now);
    let k = r.lastMonth ? addMonths(r.lastMonth, 1) : cur;
    if (k < cur) k = cur;
    const [y, m] = k.split('-').map(Number);
    return k + '-' + pad(Math.min(r.day, daysIn(y, m - 1)));
  }
  function processRecurring() {
    const now = new Date(), cur = ymOf(now), today = now.getDate();
    let added = 0;
    state.recurring.forEach(r => {
      let k = r.lastMonth ? addMonths(r.lastMonth, 1) : cur;
      let guard = 0;
      while (k <= cur && guard++ < 24) {
        const [y, m] = k.split('-').map(Number);
        const day = Math.min(r.day, daysIn(y, m - 1));
        if (k === cur && day > today) break;
        state.tx.push({ id: uid('t'), type: r.type, category: r.category, amount: r.amount, note: r.note || '', date: k + '-' + pad(day), createdAt: Date.now(), recurringId: r.id });
        r.lastMonth = k; added++;
        k = addMonths(k, 1);
      }
    });
    if (added) { persist(); setTimeout(() => toast('Добавлено регулярных платежей: ' + added, 'ok'), 1400); }
    return added;
  }
  function openRecurring() {
    pushPage('Регулярные', pg => {
      pg.act.innerHTML = '<button type="button" class="link" id="rAdd" aria-label="Новый платёж">' + icon('plus', 24) + '</button>';
      $('rAdd').onclick = () => editRecurring(null);
      if (!state.recurring.length) {
        pg.body.innerHTML = '<div class="card empty"><span class="ic" style="background:#5856d6;width:56px;height:56px;border-radius:16px">' + icon('sub') + '</span><h3>Платите регулярно?</h3><p>Аренда, интернет, подписки, зарплата. Добавьте их один раз, и они будут записываться сами в нужный день.</p><button class="btn press" type="button" id="rFirst">' + icon('plus') + 'Добавить платёж</button></div>';
        $('rFirst').onclick = () => editRecurring(null);
        return;
      }
      const mTot = state.recurring.reduce((s, r) => s + (r.type === 'expense' ? r.amount : 0), 0);
      pg.body.innerHTML = '<div class="grp"><div class="card list">' + state.recurring.map(r => {
        const c = catOf(r.type, r.category);
        return li({ icon: c.icon, color: c.color, title: r.note || c.name, sub: 'каждое ' + r.day + ' число · следующий ' + dayLabel(nextDue(r)).replace(/^[а-я]+, /, ''), right: '<span class="num" style="color:var(' + (r.type === 'income' ? '--income' : '--fg') + ')">' + (r.type === 'income' ? '+' : '−') + money(r.amount) + '</span>', data: r.id, btn: true });
      }).join('') + '</div><div class="list-foot">Обязательные расходы: ' + money(mTot) + ' в месяц. Платёж записывается автоматически, когда вы открываете приложение в нужный день или позже.</div></div>';
      qsa('[data-k]', pg.body).forEach(b => b.onclick = () => editRecurring(state.recurring.find(r => r.id === b.dataset.k)));
    });
  }
  function editRecurring(r, preset) {
    const isNew = !r;
    const base = r || preset || { type: 'expense', category: 'home', amount: '', note: '', day: new Date().getDate() };
    const fields = [
      { id: 'type', type: 'seg', label: 'Тип', value: base.type, options: [['expense', 'Расход'], ['income', 'Доход']] },
      { id: 'note', label: 'Название', type: 'text', value: base.note, placeholder: 'Аренда', max: 40 },
      { id: 'amount', label: 'Сумма', type: 'money', value: base.amount, placeholder: '0' },
      { id: 'day', label: 'День месяца', type: 'int', value: base.day, placeholder: '1–31', max: 2 },
      { id: 'cat', label: 'Категория', type: 'icon', value: catOf(base.type, base.category).icon }
    ];
    openForm({
      title: isNew ? 'Регулярный платёж' : 'Платёж', fields, focus: isNew,
      onChange: (vals, body) => { /* keep the category list in sync with the type */ if (vals.type !== base.type) { base.type = vals.type; renderCatPicker(body, vals); } },
      extra: isNew ? [] : [{ text: 'Удалить платёж', danger: true, confirmText: 'Уже записанные операции останутся.', onClick: () => { state.recurring = state.recurring.filter(x => x.id !== r.id); commit(); toast('Платёж удалён', 'trash'); } }],
      onSubmit: v => {
        if (!(v.amount > 0)) return 'Введите сумму';
        if (!(v.day >= 1 && v.day <= 31)) return 'День месяца — от 1 до 31';
        const pick = formVals.catId && cats(v.type).some(c => c.id === formVals.catId) ? formVals.catId : null;
        const catId = pick || (v.type === 'income' ? 'salary' : 'misc');
        const now = new Date(), cur = ymOf(now);
        if (isNew) {
          // start from this month if the day is still ahead, otherwise next month
          const last = v.day > now.getDate() ? addMonths(cur, -1) : cur;
          state.recurring.push({ id: uid('r'), type: v.type, category: catId, amount: v.amount, note: v.note, day: v.day, lastMonth: last });
        } else Object.assign(r, { type: v.type, category: catId, amount: v.amount, note: v.note, day: v.day });
        commit();
      }
    });
    renderCatPicker($('formBody'), { type: base.type, catId: base.category });
  }
  // swap the generic icon grid for a real category picker
  function renderCatPicker(body, vals) {
    const box = qs('.icons[data-f="cat"]', body);
    if (!box) return;
    const list = cats(vals.type || 'expense');
    if (!vals.catId || !list.some(c => c.id === vals.catId)) vals.catId = list[0].id;
    box.parentNode.querySelector('label').textContent = 'Категория';
    box.innerHTML = list.map(c => '<button type="button" data-c="' + esc(c.id) + '" aria-pressed="' + (c.id === vals.catId) + '" aria-label="' + esc(c.name) + '" title="' + esc(c.name) + '" style="' + (c.id === vals.catId ? 'background:' + c.color + ';color:#fff' : '') + '">' + icon(c.icon) + '</button>').join('');
    qsa('button', box).forEach(b => b.onclick = () => {
      haptic('select');
      vals.catId = b.dataset.c;
      formVals.catId = b.dataset.c;
      renderCatPicker(body, vals);
    });
    formVals = vals;
  }
  let formVals = {};

  // ---------- categories ----------
  function openCategories() {
    pushPage('Категории', pg => {
      pg.act.innerHTML = '<button type="button" class="link" id="cAdd" aria-label="Новая категория">' + icon('plus', 24) + '</button>';
      $('cAdd').onclick = () => editCategory(null);
      const block = (type, title) => '<div class="grp"><div class="list-head">' + title + '</div><div class="card list">' + cats(type).map(c => {
        const custom = state.cats.some(x => x.id === c.id);
        return li({ icon: c.icon, color: c.color, title: c.name, sub: custom ? 'своя' : '', chev: custom, data: custom ? c.id : '', btn: custom });
      }).join('') + '</div></div>';
      pg.body.innerHTML = block('expense', 'Расходы') + block('income', 'Доходы') + '<p class="hint">Свои категории можно изменить или удалить</p>';
      qsa('[data-k]', pg.body).forEach(b => { if (b.dataset.k) b.onclick = () => editCategory(state.cats.find(c => c.id === b.dataset.k)); });
    });
  }
  function editCategory(c, onDone) {
    const isNew = !c;
    openForm({
      title: isNew ? 'Новая категория' : 'Категория',
      fields: [
        { id: 'type', type: 'seg', label: 'Тип', value: c ? c.type : (onDone && onDone.type) || 'expense', options: [['expense', 'Расход'], ['income', 'Доход']] },
        { id: 'name', label: 'Название', type: 'text', value: c ? c.name : '', placeholder: 'Например, Спорт', max: 24 },
        { id: 'color', label: 'Цвет', type: 'color', value: c ? c.color : '#007aff' },
        { id: 'icon', label: 'Значок', type: 'icon', value: c ? c.icon : 'star' }
      ],
      extra: isNew ? [] : [{ text: 'Удалить категорию', danger: true, confirmText: 'Операции из неё останутся, но будут без категории.', onClick: () => { state.cats = state.cats.filter(x => x.id !== c.id); delete state.budgets.cats[c.id]; commit(); } }],
      onSubmit: v => {
        if (!v.name) return 'Введите название';
        if (cats(v.type).some(x => x.name.toLowerCase() === v.name.toLowerCase() && (!c || x.id !== c.id))) return 'Такая категория уже есть';
        if (isNew) {
          const nc = { id: uid('c_'), type: v.type, name: v.name, color: v.color || '#007aff', icon: v.icon || 'star' };
          state.cats.push(nc);
          if (onDone && onDone.cb) onDone.cb(nc);
        } else Object.assign(c, { type: v.type, name: v.name, color: v.color, icon: v.icon });
        commit();
      }
    });
  }

  // ---------- currency & theme ----------
  function openCurrency() {
    pushPage('Валюта', pg => {
      pg.body.innerHTML = '<div class="card list">' + CURRENCIES.map(([code, name]) => {
        let s = code; try { s = nf(code, 0).formatToParts(0).find(x => x.type === 'currency').value; } catch (e) {}
        return li({ title: name, sub: code + ' · ' + s, right: code === state.settings.currency ? '<span class="check">' + icon('check') + '</span>' : '', data: code, btn: true });
      }).join('') + '</div><div class="list-foot">Меняется только значок валюты. Суммы не пересчитываются по курсу.</div>';
      qsa('[data-k]', pg.body).forEach(b => b.onclick = () => { state.settings.currency = b.dataset.k; haptic('select'); commit(); });
    });
  }
  function applyTheme() {
    const t = state.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else if (TG && TG.colorScheme) document.documentElement.dataset.theme = TG.colorScheme;
    else if (!window.claude) delete document.documentElement.dataset.theme;
    if (TG && tgAtLeast('6.1')) {
      // paint Telegram's header and background in the app's own background
      const rgb = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
      if (rgb) { const hex = '#' + rgb.slice(0, 3).map(x => Number(x).toString(16).padStart(2, '0')).join(''); try { TG.setHeaderColor(hex); TG.setBackgroundColor(hex); if (TG.setBottomBarColor) TG.setBottomBarColor(hex); } catch (e) {} }
    }
  }
  function openTheme() {
    pushPage('Оформление', pg => {
      pg.body.innerHTML = '<div class="card list">' + [['system', 'Как в системе'], ['light', 'Светлая'], ['dark', 'Тёмная']].map(([k, n]) =>
        li({ title: n, right: k === state.settings.theme ? '<span class="check">' + icon('check') + '</span>' : '', data: k, btn: true })).join('') + '</div>';
      qsa('[data-k]', pg.body).forEach(b => b.onclick = () => { state.settings.theme = b.dataset.k; haptic('select'); applyTheme(); commit(); });
    });
  }

  // ================= transaction sheet =================
  let txSheet;
  const tx = { editing: null, type: 'expense', cat: 'food', expr: '', delArmed: false };
  function evalExpr(s) {
    if (!s) return NaN;
    const parts = s.replace(/,/g, '.').match(/[+-]?[^+-]+/g);
    if (!parts) return NaN;
    let sum = 0;
    for (const p of parts) { const v = parseFloat(p); if (!isFinite(v)) return NaN; sum += v; }
    return round2(sum);
  }
  const hasOp = s => /[+-]/.test(s.replace(/^-/, ''));
  function drawCats() {
    const list = cats(tx.type);
    if (!list.some(c => c.id === tx.cat)) tx.cat = list[0].id;
    $('cats').innerHTML = list.map(c =>
      '<button type="button" class="cat" aria-pressed="' + (c.id === tx.cat) + '" data-id="' + esc(c.id) + '" style="--c:' + c.color + '"><span class="ic" style="background:' + c.color + '">' + icon(c.icon) + '</span><span>' + esc(c.name) + '</span></button>').join('') +
      '<button type="button" class="cat add" id="catNew"><span class="ic">' + icon('plus') + '</span><span>Своя</span></button>';
    qsa('.cat[data-id]', $('cats')).forEach(b => b.onclick = () => {
      haptic('select'); tx.cat = b.dataset.id;
      qsa('.cat[data-id]', $('cats')).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    });
    $('catNew').onclick = () => editCategory(null, { type: tx.type, cb: nc => { tx.type = nc.type; tx.cat = nc.id; setType(nc.type); } });
  }
  function drawQuick() {
    // the most frequent note+category+amount for this type, to add in one tap
    const freq = {};
    state.tx.filter(t => t.type === tx.type && t.note).forEach(t => { const k = t.note + '|' + t.category + '|' + t.amount; freq[k] = (freq[k] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k.split('|'));
    $('quick').innerHTML = top.map(([note, c, a]) => { const cc = catOf(tx.type, c); return '<button type="button" class="press" data-q="' + esc(note + '|' + c + '|' + a) + '"><i style="background:' + cc.color + '"></i>' + esc(note) + ' <b class="num">' + money(Number(a), { show: true }) + '</b></button>'; }).join('');
    $('quick').hidden = !top.length || !!tx.editing;
    qsa('[data-q]', $('quick')).forEach(b => b.onclick = () => {
      const [note, c, a] = b.dataset.q.split('|');
      haptic('light');
      tx.cat = c; tx.expr = String(a).replace('.', ','); $('txNote').value = note;
      drawCats(); drawAmount(true);
      const sel = qs('.cat[aria-pressed="true"]', $('cats')); if (sel) sel.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }
  function setType(v) { tx.type = v; seg($('typeSeg'), v); drawCats(); drawQuick(); }
  function fmtExpr(s) {
    // show grouped thousands inside each number, keep operators
    return s.replace(/\d+/g, (m, off, str) => str[off - 1] === ',' ? m : plainNf.format(Number(m)).replace(/ /g, ' '));
  }
  function drawAmount(animLast) {
    const big = $('amountBig');
    const shownTxt = tx.expr ? fmtExpr(tx.expr) : '0';
    const chars = [...shownTxt];
    $('digits').innerHTML = chars.map((c, i) => '<span class="' + (/[+-]/.test(c) ? 'op' : '') + (animLast && i === chars.length - 1 ? ' new' : '') + '">' + esc(c === '-' ? '−' : c) + '</span>').join('');
    big.classList.toggle('zero', !tx.expr);
    const len = shownTxt.length;
    big.style.fontSize = len > 13 ? '30px' : len > 10 ? '38px' : len > 8 ? '46px' : '';
    $('curSign').textContent = sym();
    const r = evalExpr(tx.expr);
    $('amountRes').textContent = hasOp(tx.expr) && isFinite(r) ? '= ' + money(r, { show: true }) : '';
    big.setAttribute('aria-label', 'Сумма ' + (isFinite(r) ? r : 0));
  }
  function bump() { haptic('warn'); const v = $('amountView'); v.classList.remove('shake'); void v.offsetWidth; v.classList.add('shake'); }
  function press(k) {
    let s = tx.expr;
    const last = s.slice(-1);
    const curNum = s.split(/[+-]/).pop();
    if (k === 'back') { tx.expr = s.slice(0, -1); haptic('light'); drawAmount(false); return; }
    if (k === '=') { const r = evalExpr(s); if (!isFinite(r) || r <= 0) return bump(); tx.expr = String(r).replace('.', ','); haptic('medium'); drawAmount(true); return; }
    if (k === '+' || k === '-') {
      if (!s || /[+-]$/.test(s)) return bump();
      if (last === ',') s = s.slice(0, -1);
      tx.expr = s + k;
    } else if (k === ',') {
      if (curNum.includes(',')) return bump();
      tx.expr = s + (curNum === '' ? '0,' : ',');
    } else {
      const [ip, fp] = curNum.split(',');
      if (fp !== undefined && fp.length + k.length > 2) return bump();
      if (fp === undefined && (ip + k).replace(/^0+/, '').length > 9) return bump();
      if (curNum === '0') s = s.slice(0, -1);
      if (k === '00' && (curNum === '' || curNum === '0')) return bump();
      tx.expr = s + k;
    }
    haptic('light');
    drawAmount(true);
  }
  function openTx(t, preset) {
    tx.editing = t || null; tx.delArmed = false;
    $('txTitle').textContent = t ? 'Операция' : 'Новая операция';
    $('txEditActions').hidden = !t;
    $('txDel').classList.remove('arm'); $('txDel').lastChild.textContent = 'Удалить';
    $('repeatRow').hidden = !!(t && t.recurringId);
    $('txRepeat').checked = false;
    const save = $('txSave'); save.classList.remove('done'); save.disabled = false; save.textContent = t ? 'Сохранить изменения' : 'Сохранить';
    const src = t || preset;
    tx.type = src ? src.type : tx.type;
    tx.cat = src ? src.category : (tx.type === 'income' ? 'salary' : 'food');
    tx.expr = src ? String(src.amount).replace('.', ',') : '';
    $('txNote').value = src ? src.note || '' : '';
    $('txDate').value = t ? t.date : todayIso();
    setType(tx.type); drawAmount(false);
    txSheet.open();
    setTimeout(() => { const sel = qs('.cat[aria-pressed="true"]', $('cats')); if (sel) sel.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); }, 380);
  }
  function sparkle(from) {
    if (reduced() || !document.body.animate) return;
    const r = from.getBoundingClientRect();
    const colors = ['#ffd60a', '#34c759', '#5ac8fa', '#ff9500', '#007aff'];
    for (let i = 0; i < 20; i++) {
      const s = document.createElement('i'); s.className = 'spark';
      s.style.background = colors[i % colors.length];
      s.style.left = (r.left + r.width / 2) + 'px'; s.style.top = (r.top + r.height / 2) + 'px';
      document.body.appendChild(s);
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 100;
      s.animate([{ transform: 'translate(-50%,-50%) rotate(0) scale(1)', opacity: 1 }, { transform: 'translate(calc(-50% + ' + (Math.cos(a) * d).toFixed(0) + 'px), calc(-50% + ' + (Math.sin(a) * d - 50).toFixed(0) + 'px)) rotate(' + (Math.random() * 360).toFixed(0) + 'deg) scale(.3)', opacity: 0 }], { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => s.remove();
    }
  }
  function confetti() {
    if (reduced() || !document.body.animate) return;
    const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de'];
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('i'); s.className = 'spark';
      s.style.background = colors[i % colors.length];
      s.style.left = (Math.random() * 100) + 'vw'; s.style.top = '-10px';
      s.style.width = (6 + Math.random() * 6) + 'px'; s.style.height = (8 + Math.random() * 8) + 'px';
      document.body.appendChild(s);
      s.animate([{ transform: 'translate3d(0,0,0) rotate(0)' }, { transform: 'translate3d(' + (Math.random() * 120 - 60).toFixed(0) + 'px,' + (innerHeight + 40) + 'px,0) rotate(' + (Math.random() * 720).toFixed(0) + 'deg)' }], { duration: 1800 + Math.random() * 1400, delay: Math.random() * 400, easing: 'cubic-bezier(.25,.6,.4,1)' }).onfinish = () => s.remove();
    }
    haptic('success');
  }

  // ================= lock (passcode) =================
  function hashPin(p) { let h = 5381; const s = 'rovno:' + p; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function lockUi(o) {
    const L = $('lock');
    let code = '';
    L.innerHTML = LOGO + '<h2 id="lockTitle"></h2><div class="sub" id="lockSub"></div><div class="pins" id="pins">' + '<i></i>'.repeat(4) + '</div>' +
      '<div class="pinpad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => '<button type="button" data-p="' + n + '">' + n + '</button>').join('') +
      (o.cancel ? '<button type="button" class="txt" data-p="x">Отмена</button>' : '<span class="blank"></span>') + '<button type="button" data-p="0">0</button><button type="button" class="txt" data-p="b" aria-label="Стереть">' + icon('chevL') + '</button></div>' +
      (o.forgot ? '<button type="button" class="forgot" id="forgot">Забыли код?</button>' : '');
    const title = $('lockTitle'), sub = $('lockSub'), pins = $('pins');
    const setT = (t, s) => { title.textContent = t; sub.textContent = s || ''; };
    setT(o.title, o.sub);
    const dots = () => qsa('i', pins).forEach((d, i) => d.classList.toggle('on', i < code.length));
    const fail = msg => { haptic('error'); pins.classList.remove('shake'); void pins.offsetWidth; pins.classList.add('shake'); code = ''; setTimeout(dots, 250); if (msg) sub.textContent = msg; };
    const api = { setT, fail, reset: () => { code = ''; dots(); } };
    qsa('[data-p]', L).forEach(b => b.onclick = () => {
      const k = b.dataset.p;
      if (k === 'x') { hideLock(); if (o.onCancel) o.onCancel(); return; }
      if (k === 'b') { code = code.slice(0, -1); dots(); return; }
      if (code.length >= 4) return;
      code += k; haptic('light'); dots();
      // check at once so fast typing never loses a digit
      if (code.length === 4) { const c = code; o.onCode(c, api); }
    });
    if (o.forgot) $('forgot').onclick = async () => {
      const ok = await confirmAction({ title: 'Сбросить код?', message: 'Код восстановить нельзя. Можно сбросить его вместе со всеми данными.', confirm: 'Удалить данные и код', destructive: true });
      if (ok) { state = defaults(); commit(); hideLock(); toast('Данные и код удалены', 'trash'); }
    };
    L.classList.remove('out');
    const keyH = e => { if (L.classList.contains('out')) return document.removeEventListener('keydown', keyH); if (/^\d$/.test(e.key)) { const b = qs('[data-p="' + e.key + '"]', L); if (b) b.click(); } else if (e.key === 'Backspace') qs('[data-p="b"]', L).click(); };
    document.addEventListener('keydown', keyH);
  }
  function hideLock() { $('lock').classList.add('out'); }
  function showLock() {
    if (!state.settings.pin) return;
    lockUi({ title: 'Введите код', forgot: true, onCode: (c, api) => { if (hashPin(c) === state.settings.pin) { haptic('success'); hideLock(); } else api.fail('Неверный код'); } });
  }
  function askPin(title, ok) {
    lockUi({ title, cancel: true, onCode: (c, api) => { if (hashPin(c) === state.settings.pin) { hideLock(); ok(); } else api.fail('Неверный код'); } });
  }
  function setPin() {
    let first = null;
    lockUi({ title: 'Придумайте код', sub: '4 цифры', cancel: true, onCode: (c, api) => {
      if (!first) { first = c; api.reset(); api.setT('Повторите код'); return; }
      if (c !== first) { first = null; api.fail(); api.setT('Придумайте код', 'Коды не совпали, попробуйте ещё раз'); return; }
      state.settings.pin = hashPin(c); haptic('success'); hideLock(); commit(); toast('Код-пароль включён', 'ok');
    } });
  }
  let hiddenAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hiddenAt = Date.now();
    else {
      if (ready && state.settings.pin && Date.now() - hiddenAt > 60000) showLock();
      if (ready && processRecurring()) renderAll();
    }
  });

  // ================= files =================
  async function saveFile(name, text, mime) {
    const cap = window.Capacitor;
    const native = cap && cap.isNativePlatform && cap.isNativePlatform();
    if (TG) {
      try {
        const file = new File([text], name, { type: mime });
        if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return true; }
      } catch (e) { if (e && e.name === 'AbortError') throw new Error('cancel'); }
      throw new Error('telegram');
    }
    // iPhone: the system share sheet saves the file to Files or sends it anywhere
    if (native || /iPhone|iPad/.test(navigator.userAgent)) {
      try {
        const file = new File([text], name, { type: mime });
        if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); return true; }
      } catch (e) { if (e && e.name === 'AbortError') throw new Error('cancel'); }
      const SH = cap && cap.Plugins && cap.Plugins.Share;
      if (native && SH) { await SH.share({ title: name, text, dialogTitle: name }); return true; }
    }
    if (window.claude && window.claude.use) {
      const dl = await claude.use('downloads');
      if (dl) { await dl.save({ filename: name, data: new Blob([text], { type: mime }) }); return true; }
    }
    const url = URL.createObjectURL(new Blob([text], { type: mime }));
    const a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  }
  const stamp = () => todayIso();
  function fileError(e) {
    const m = String(e && e.message);
    if (/cancel/i.test(m)) return;
    if (m === 'telegram') toast('Telegram не умеет сохранять файлы. Откройте сайт в Safari, данные там свои.', 'alert');
    else toast('Не получилось сохранить файл', 'alert');
  }
  async function exportCsv() {
    if (!state.tx.length) return toast('Пока нечего выгружать');
    const q = s => '"' + String(s).replace(/"/g, '""') + '"';
    const rows = [['Дата', 'Тип', 'Категория', 'Сумма', 'Валюта', 'Заметка'].join(';')].concat(
      state.tx.slice().sort((a, b) => a.date.localeCompare(b.date)).map(t => [t.date, t.type === 'income' ? 'Доход' : 'Расход', q(catOf(t.type, t.category).name), String(t.type === 'income' ? t.amount : -t.amount).replace('.', ','), state.settings.currency, q(t.note || '')].join(';')));
    try { await saveFile('rovno-' + stamp() + '.csv', '﻿' + rows.join('\r\n'), 'text/csv'); toast('Файл готов', 'ok'); }
    catch (e) { fileError(e); }
  }
  async function exportBackup() {
    const data = JSON.stringify({ app: 'rovno', exportedAt: new Date().toISOString(), state: Object.assign({}, state, { settings: Object.assign({}, state.settings, { pin: '' }) }) }, null, 1);
    try { await saveFile('rovno-backup-' + stamp() + '.json', data, 'application/json'); toast('Резервная копия сохранена', 'ok'); }
    catch (e) { fileError(e); }
  }
  $('importFile').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    const rd = new FileReader();
    rd.onload = async () => {
      let parsed;
      try { parsed = JSON.parse(String(rd.result)); } catch (err) { return toast('Это не файл резервной копии', 'alert'); }
      const src = parsed && parsed.app === 'rovno' ? parsed.state : parsed;
      const next = normalize(src);
      if (!next.tx.length && !next.goals.length) return toast('В файле нет данных Ровно', 'alert');
      const ok = await confirmAction({ title: 'Восстановить из копии?', message: 'Операций в копии: ' + next.tx.length + '. Текущие данные будут заменены.', confirm: 'Восстановить', destructive: true });
      if (!ok) return;
      next.settings.pin = state.settings.pin;
      state = next; applyTheme(); commit(); toast('Данные восстановлены', 'ok');
    };
    rd.readAsText(f);
  });

  // ================= demo =================
  function fillDemo() {
    const now = new Date(), rows = [];
    const plan = [
      ['income', 'salary', 95000, 'Зарплата', 5], ['income', 'laptop', 18000, 'Логотип для кофейни', 18],
      ['expense', 'home', 32000, 'Аренда', 3], ['expense', 'food', 2340, 'Пятёрочка', 1], ['expense', 'coffee', 460, 'Кофе', 0],
      ['expense', 'car', 1450, 'Такси', 2], ['expense', 'sub', 399, 'Музыка', 7], ['expense', 'fun', 2600, 'Кино', 9],
      ['expense', 'bag', 5490, 'Кроссовки', 12], ['expense', 'health', 1800, 'Аптека', 14], ['expense', 'food', 3120, 'Продукты', 6],
      ['expense', 'phone', 650, 'Мобильная связь', 10], ['expense', 'coffee', 1250, 'Обед', 4], ['expense', 'food', 1870, 'Продукты', 11]
    ];
    for (let k = 0; k < 6; k++) {
      plan.forEach(([ty, c, a, note, back], j) => {
        const last = k === 0 ? now.getDate() : 28;
        if (k === 0 && back >= last) return;
        if (k > 0 && j === 1 && k % 2) return;
        const d = new Date(now.getFullYear(), now.getMonth() - k, Math.max(1, last - back));
        const amt = k === 0 || ty === 'income' && j === 0 ? a : Math.round(a * (0.75 + ((j * 7 + k * 3) % 6) / 10));
        rows.push({ id: uid('t'), type: ty, category: c, amount: amt, note, date: iso(d), createdAt: Date.now() - k * 1e8 - j * 1000, demo: true });
      });
    }
    state.tx.push(...rows);
    haptic('success'); commit();
    toast('Добавлены примеры. Убрать: «Ещё» → «Убрать примеры»', 'ok');
  }
  function clearDemo() {
    const before = state.tx;
    state.tx = state.tx.filter(t => !t.demo);
    haptic('medium'); commit();
    toast('Примеры убраны', 'trash', () => { state.tx = before; commit(); });
  }

  // ================= navigation =================
  function renderNav() {
    const year = ui.tab === 'analytics' && ui.period === 'year';
    const now = new Date(), cur = ymOf(now);
    const d = parseIso(ui.cursor + '-01');
    const ms = $('monthSwitch');
    ms.hidden = ui.tab === 'more';
    const latest = state.tx.reduce((m, t) => t.date.slice(0, 7) > m ? t.date.slice(0, 7) : m, cur);
    if (year) {
      $('monthLabel').textContent = String(d.getFullYear());
      $('nextM').disabled = d.getFullYear() >= Number(latest.slice(0, 4));
    } else {
      $('monthLabel').textContent = monthName.format(d) + (d.getFullYear() !== now.getFullYear() ? ' ' + String(d.getFullYear()).slice(2) : '');
      $('nextM').disabled = ui.cursor >= latest;
    }
    $('prevM').setAttribute('aria-label', year ? 'Предыдущий год' : 'Предыдущий месяц');
    $('nextM').setAttribute('aria-label', year ? 'Следующий год' : 'Следующий месяц');
    $('navTitle').textContent = TABS[ui.tab];
    $('pageTitle').textContent = TABS[ui.tab];
  }
  function shiftCursor(n) {
    const year = ui.tab === 'analytics' && ui.period === 'year';
    ui.cursor = addMonths(ui.cursor, year ? n * 12 : n);
    ui.donutSel = null; ui.barSel = null; ui.heatSel = null; ui.catFilter = null;
    haptic('select');
    renderNav(); renderView(ui.tab);
  }
  $('prevM').onclick = () => shiftCursor(-1);
  $('nextM').onclick = () => shiftCursor(1);

  function renderView(name) {
    if (name === 'overview') renderOverview();
    else if (name === 'operations') renderOperations();
    else if (name === 'analytics') renderAnalytics();
    else if (name === 'more') renderMore();
  }
  function renderAll() { renderNav(); renderView(ui.tab); refreshPages(); }

  function moveBlob(animate) {
    const btn = qs('[data-tab="' + ui.tab + '"]', $('tabbar'));
    const blob = $('tabBlob');
    if (!btn || !btn.offsetWidth) return;
    const x1 = btn.offsetLeft, w1 = btn.offsetWidth;
    const prev = blob.dataset.x ? { x: Number(blob.dataset.x), w: Number(blob.dataset.w) } : null;
    blob.dataset.x = x1; blob.dataset.w = w1;
    blob.style.width = w1 + 'px';
    blob.style.transform = 'translate3d(' + x1 + 'px,0,0)';
    if (!animate || !prev || prev.x === x1 || reduced() || !blob.animate) return;
    const lo = Math.min(prev.x, x1), hi = Math.max(prev.x + prev.w, x1 + w1);
    const t = (x, sx, sy) => 'translate3d(' + x + 'px,0,0) scale(' + sx + ',' + sy + ')';
    if (blob.anim) blob.anim.cancel();
    blob.anim = blob.animate([
      { transform: t(prev.x, prev.w / w1, 1) },
      { transform: t(lo, (hi - lo) / w1, .88), offset: .4 },
      { transform: t(x1, 1, 1.05), offset: .78 },
      { transform: t(x1, 1, 1) }
    ], { duration: 460, easing: 'cubic-bezier(.3,.7,.2,1)' });
  }
  function go(name, fromUser) {
    if (!TABS[name]) name = 'overview';
    const prev = ui.tab;
    ui.tab = name;
    qsa('[data-tab]', $('tabbar')).forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    moveBlob(fromUser);
    while (pageStack.length) { const p = pageStack.pop(); p.el.remove(); }
    renderNav();
    const out = $('v-' + prev), inn = $('v-' + name);
    qsa('.view').forEach(v => { if (v !== inn) { v.hidden = true; v.classList.remove('enter', 'back'); } });
    inn.hidden = false;
    renderView(name);
    if (fromUser && prev !== name) {
      haptic('select');
      const order = Object.keys(TABS);
      inn.classList.remove('enter', 'back'); void inn.offsetWidth;
      inn.classList.add('enter');
      if (order.indexOf(name) < order.indexOf(prev)) inn.classList.add('back');
      window.scrollTo(0, 0);
    } else if (fromUser && prev === name) {
      window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    }
    try { if (location.hash.slice(1) !== name) history.replaceState(null, '', '#' + name); } catch (e) {}
  }
  qsa('[data-tab]', $('tabbar')).forEach(b => b.onclick = () => go(b.dataset.tab, true));
  window.addEventListener('resize', () => moveBlob(false));
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h && h !== ui.tab && TABS[h]) go(h, true); });

  // collapse the large title into the bar when scrolled
  let scrollQueued = false;
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; document.body.classList.toggle('scrolled', window.scrollY > 36); });
  }, { passive: true });

  qsa('#filter button').forEach(b => b.onclick = () => { haptic('select'); ui.filter = b.dataset.v; ui.catFilter = null; renderOperations(); });
  let qTimer;
  $('q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { ui.query = e.target.value; renderOperations(); }, 120); });

  // ================= tx sheet wiring =================
  txSheet = makeSheet($('txSheet'));
  formSheet = makeSheet($('formSheet'));
  $('fab').onclick = () => { haptic('medium'); openTx(null); };
  qsa('#typeSeg button').forEach(b => b.onclick = () => { if (tx.type === b.dataset.v) return; haptic('select'); setType(b.dataset.v); });
  qsa('#keypad .key').forEach(b => {
    b.addEventListener('pointerdown', e => {
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) / 2;
      const rip = document.createElement('span'); rip.className = 'ripple';
      rip.style.width = rip.style.height = s + 'px';
      rip.style.left = (e.clientX - r.left - s / 2) + 'px'; rip.style.top = (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(rip); setTimeout(() => rip.remove(), 550);
    });
    b.onclick = () => press(b.dataset.k);
  });
  document.addEventListener('keydown', e => {
    if (!txSheet.isOpen || formSheet.isOpen || e.target.tagName === 'INPUT') return;
    if (e.key === 'Escape') return txSheet.close();
    if (/^\d$/.test(e.key)) press(e.key);
    else if (e.key === ',' || e.key === '.') press(',');
    else if (e.key === '+' || e.key === '-') press(e.key);
    else if (e.key === 'Backspace') press('back');
    else if (e.key === 'Enter') { e.preventDefault(); $('txSheet').requestSubmit(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && formSheet.isOpen) formSheet.close(); });
  $('txSheet').addEventListener('submit', e => {
    e.preventDefault();
    const amount = evalExpr(tx.expr);
    if (!(amount > 0)) { bump(); toast(tx.expr ? 'Сумма должна быть больше нуля' : 'Введите сумму'); return; }
    const date = $('txDate').value || todayIso();
    const data = { type: tx.type, category: tx.cat, amount, note: $('txNote').value.trim().slice(0, 60), date };
    const btn = $('txSave');
    btn.disabled = true;
    if (tx.editing) {
      Object.assign(tx.editing, data);
    } else {
      const t = Object.assign({ id: uid('t'), createdAt: Date.now() }, data);
      if ($('txRepeat').checked) {
        const r = { id: uid('r'), type: data.type, category: data.category, amount, note: data.note, day: Number(date.slice(8)), lastMonth: date.slice(0, 7) };
        state.recurring.push(r); t.recurringId = r.id;
      }
      state.tx.push(t);
    }
    haptic('success');
    btn.classList.add('done');
    btn.innerHTML = '<svg class="chk" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Сохранено';
    if (tx.type === 'income' && !tx.editing) sparkle(btn);
    const k = date.slice(0, 7);
    if (k !== ui.cursor && !tx.editing) ui.cursor = k;
    commit();
    if (!tx.editing) checkBudgetAlert(data);
    setTimeout(() => txSheet.close(), 620);
  });
  function checkBudgetAlert(t) {
    if (t.type !== 'expense') return;
    const k = t.date.slice(0, 7);
    if (k !== ymOf(new Date())) return;
    const m = ofMonth(k), e = sums(m).e, lim = state.budgets.cats[t.category], cs = byCat(m)[t.category] || 0;
    if (lim && cs > lim && cs - t.amount <= lim) setTimeout(() => toast('Лимит на «' + catOf('expense', t.category).name + '» превышен', 'alert'), 700);
    else if (state.budgets.total && e > state.budgets.total && e - t.amount <= state.budgets.total) setTimeout(() => toast('Бюджет на месяц превышен', 'alert'), 700);
    else if (state.budgets.total && e > state.budgets.total * .85 && e - t.amount <= state.budgets.total * .85) setTimeout(() => toast('Потрачено 85% бюджета', 'alert'), 700);
  }
  $('txDup').onclick = () => {
    const t = tx.editing; if (!t) return;
    const copy = Object.assign({}, t, { id: uid('t'), date: todayIso(), createdAt: Date.now() });
    delete copy.recurringId; delete copy.demo;
    state.tx.push(copy); haptic('success'); commit(); txSheet.close();
    ui.cursor = ymOf(new Date()); renderAll();
    toast('Добавлено на сегодня', 'ok');
  };
  $('txDel').onclick = () => {
    if (!tx.delArmed) { tx.delArmed = true; haptic('warn'); $('txDel').classList.add('arm'); $('txDel').lastChild.textContent = 'Точно?'; return; }
    const id = tx.editing.id; txSheet.close(); setTimeout(() => removeTx(id), 250);
  };

  // ================= boot =================
  async function boot() {
    renderNav();
    go((location.hash || '').slice(1) || 'overview', false);
    requestAnimationFrame(() => moveBlob(false));
    if (TG) {
      try {
        TG.ready(); TG.expand();
        if (tgAtLeast('7.7')) TG.disableVerticalSwipes();
        if (tgAtLeast('6.1')) TG.BackButton.onClick(tgBack);
        TG.onEvent('themeChanged', () => { applyTheme(); renderAll(); });
      } catch (e) {}
    }
    try {
      const Pref = nativePrefs();
      if (Pref) backend = makeNative(Pref);
      else if (TG && tgAtLeast('6.9') && TG.CloudStorage) backend = makeTelegram(TG);
      else backend = (await makeClaude().catch(() => null)) || makeBrowser();
      state = normalize(await backend.load().catch(() => null));
    } catch (e) {
      backend = makeBrowser();
      state = normalize(await backend.load());
    }
    ready = true;
    applyTheme();
    const migrated = processRecurring();
    persist(migrated > 0);
    renderAll();
    requestAnimationFrame(() => moveBlob(false));
    if (state.settings.pin) showLock();
    setTimeout(() => $('splash').classList.add('out'), reduced() ? 0 : 750);
    // web version only: keep working offline
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.claude && !(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) && /github\.io$/.test(location.hostname)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }
  boot();
})();
