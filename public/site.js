/* Theme colours + optional Google Sheet data. Loaded before app.js */
const Site = (() => {
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const PRESETS = {
    'Glow Rose':     { dark: '#8b2c52', accent: '#b4577a', gold: '#a1655b', bg: '#fdf3f1' },
    'Soft Lavender': { dark: '#4a3366', accent: '#8c64c8', gold: '#946a14', bg: '#fbf9ff' },
    'Blush Pink':    { dark: '#7a2f52', accent: '#cf3f78', gold: '#946a14', bg: '#fff8fb' },
    'Mint Sage':     { dark: '#1f4d40', accent: '#2b8a69', gold: '#946a14', bg: '#f5fbf8' },
    'Sky Blue':      { dark: '#1f3f66', accent: '#3b78c4', gold: '#946a14', bg: '#f5f9ff' },
    'Peach':         { dark: '#7a3b22', accent: '#c95f31', gold: '#946a14', bg: '#fff8f3' }
  };
  function applyTheme(t) {
    const r = document.documentElement.style, d = t.dark, a = t.accent;
    r.setProperty('--plum', d); r.setProperty('--plum2', mix(d, a, .07)); r.setProperty('--plum3', mix(d, a, .14));
    r.setProperty('--pink', a); r.setProperty('--pink2', mix(a, '#ffffff', .45)); r.setProperty('--gold', t.gold);
    r.setProperty('--cream', t.bg); r.setProperty('--tint', mix(a, '#ffffff', .90)); r.setProperty('--tint2', mix(a, '#ffffff', .80)); r.setProperty('--line', mix(a, '#ffffff', .82));
    const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t.bg;
  }
  const wa = n => { n = String(n || '').replace(/\D/g, ''); return n.startsWith('0') ? '92' + n.slice(1) : n; };
  function merge(d) {
    PRODUCTS.length = 0;
    PRODUCTS.push(...d.products.map(p => { const o = +p.price, s = +p.salePrice, sale = s > 0 && s < o; return { id: p.id, name: p.name, cat: p.category, price: sale ? s : o, oldPrice: sale ? o : 0, isNew: !!p.isNew, color: p.color || ['#f6a5c0', '#c2185b'], img: p.image || '', desc: p.description || '' }; }));
    if (d.theme) { Object.assign(THEME, d.theme); applyTheme(THEME); }
    const c = d.contact || {}, so = d.social || {};
    if (c.email) SITE.email = c.email; if (c.phone) SITE.phone = c.phone;
    SITE.address = c.address || ''; SITE.whatsapp = wa(so.whatsapp || c.phone) || SITE.whatsapp; SITE.waMessage = so.waMessage || '';
    SITE.social = so; SITE.nav = d.nav; SITE.pay = (d.payments || []).filter(m => m.on); SITE.hero = d.heroCfg || {}; SITE.heroImg = d.hero || ''; SITE.sheet = (d.sheet || {}).url || '';
    if (d.reviews) { REVIEWS.length = 0; REVIEWS.push(...d.reviews.filter(r => r.show)); }
  }
  async function boot() {
    applyTheme(THEME);
    let d = null;
    try { if (/preview=1/.test(location.search)) d = JSON.parse(localStorage.getItem('binimran_data')); } catch (e) {}
    if (!d) try { const r = await fetch('data.json?' + Date.now()); if (r.ok) d = await r.json(); } catch (e) {}
    if (d && d.products) merge(d);
  }
  applyTheme(THEME);
  return { PRESETS, applyTheme, boot };
})();
