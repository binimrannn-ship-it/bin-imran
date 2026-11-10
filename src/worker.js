// Bin Imran - products + orders API.
// Public: GET /api/products, POST /api/orders, GET /api/orders/:id?phone=...
// Admin only (needs ADMIN_PASSWORD secret in Cloudflare): POST /api/products, GET /api/orders, PATCH /api/orders/:id
const CATS = ['Lawn', 'Cotton', 'Embroidered', 'Formal', 'Winter'];
const HEX = /^#[0-9a-f]{6}$/i;
const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const ORDER_ID = /^[A-Z0-9]{6,24}$/;
const out = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const num = v => (Number.isFinite(+v) && +v >= 0 ? Math.round(+v) : null);
const digits = v => String(v || '').replace(/\D/g, '');
const genId = () => 'BI' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
const checkAdmin = (req, env) => env.ADMIN_PASSWORD && req.headers.get('x-admin-password') === env.ADMIN_PASSWORD;

function clean(list) {
  if (!Array.isArray(list) || list.length > 500) return null;
  const res = [];
  for (const p of list) {
    const price = num(p.price), oldPrice = num(p.oldPrice || 0);
    if (!p || !Number.isInteger(p.id) || typeof p.name !== 'string' || !p.name.trim() || !CATS.includes(p.cat) || price === null || oldPrice === null) return null;
    const item = {
      id: p.id, name: p.name.trim().slice(0, 120), cat: p.cat, price, oldPrice, isNew: !!p.isNew,
      color: Array.isArray(p.color) && p.color.length === 2 && p.color.every(c => HEX.test(c)) ? p.color : ['#f6a5c0', '#c2185b'],
      desc: String(p.desc || '').slice(0, 500)
    };
    if (p.img && /^(https?:\/\/|images\/)/.test(p.img)) item.img = String(p.img).slice(0, 300);
    res.push(item);
  }
  return res;
}

function cleanOrder(o) {
  if (!o || typeof o !== 'object') return null;
  const name = String(o.name || '').trim().slice(0, 80);
  const phone = digits(o.phone).slice(0, 15);
  const address = String(o.address || '').trim().slice(0, 300);
  const city = String(o.city || '').trim().slice(0, 60);
  const payment = String(o.payment || '').trim().slice(0, 40);
  if (!name || phone.length < 7 || !address) return null;
  const items = Array.isArray(o.items) ? o.items.slice(0, 50).map(i => ({
    name: String((i && i.name) || '').slice(0, 120),
    size: String((i && i.size) || '').slice(0, 10),
    qty: Math.max(1, Math.min(99, Math.round(+(i && i.qty)) || 1)),
    price: num(i && i.price) || 0
  })).filter(i => i.name) : [];
  if (!items.length) return null;
  const total = num(o.total);
  if (total === null) return null;
  const id = typeof o.id === 'string' && ORDER_ID.test(o.id) ? o.id : genId();
  return { id, name, phone, address, city, payment, items, total };
}

async function pushIndex(env, id) {
  let idx = [];
  try { idx = JSON.parse(await env.STORE.get('orders_index')) || []; } catch {}
  if (!Array.isArray(idx)) idx = [];
  idx.unshift(id);
  if (idx.length > 300) idx = idx.slice(0, 300);
  await env.STORE.put('orders_index', JSON.stringify(idx));
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === '/api/products') {
      if (req.method === 'GET') {
        return new Response((await env.STORE.get('products')) || 'null', { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
      }
      if (req.method !== 'POST') return out({ error: 'Method not allowed' }, 405);
      if (!env.ADMIN_PASSWORD) return out({ error: 'ADMIN_PASSWORD is not set in Cloudflare' }, 500);
      if (!checkAdmin(req, env)) return out({ error: 'Wrong password' }, 401);
      let data; try { data = await req.json(); } catch { return out({ error: 'Bad data' }, 400); }
      const list = clean(data);
      if (!list) return out({ error: 'Product data is not valid' }, 400);
      await env.STORE.put('products', JSON.stringify(list));
      return out({ ok: true, count: list.length });
    }

    if (path === '/api/login') {
      if (req.method !== 'POST') return out({ error: 'Method not allowed' }, 405);
      if (!env.ADMIN_PASSWORD) return out({ error: 'ADMIN_PASSWORD is not set in Cloudflare' }, 500);
      if (!checkAdmin(req, env)) return out({ error: 'Wrong password' }, 401);
      return out({ ok: true });
    }

    if (path === '/api/orders') {
      if (req.method === 'POST') {
        const body = await req.json().catch(() => null);
        const order = cleanOrder(body);
        if (!order) return out({ error: 'Order data is not valid' }, 400);
        const rec = { date: new Date().toISOString(), status: 'Pending', ...order };
        await env.STORE.put('order:' + rec.id, JSON.stringify(rec));
        await pushIndex(env, rec.id);
        return out({ ok: true, id: rec.id });
      }
      if (req.method === 'GET') {
        if (!env.ADMIN_PASSWORD) return out({ error: 'ADMIN_PASSWORD is not set in Cloudflare' }, 500);
        if (!checkAdmin(req, env)) return out({ error: 'Wrong password' }, 401);
        let idx = []; try { idx = JSON.parse(await env.STORE.get('orders_index')) || []; } catch {}
        if (!Array.isArray(idx)) idx = [];
        const raw = await Promise.all(idx.slice(0, 200).map(id => env.STORE.get('order:' + id)));
        const list = raw.map(s => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
        return out({ orders: list });
      }
      return out({ error: 'Method not allowed' }, 405);
    }

    if (path.startsWith('/api/orders/')) {
      const id = decodeURIComponent(path.slice('/api/orders/'.length)).slice(0, 40);
      if (!id) return out({ error: 'Not found' }, 404);
      if (req.method === 'GET') {
        const raw = await env.STORE.get('order:' + id);
        if (!raw) return out({ error: 'Order not found' }, 404);
        let o; try { o = JSON.parse(raw); } catch { return out({ error: 'Order not found' }, 404); }
        const phoneQ = digits(url.searchParams.get('phone'));
        if (!phoneQ || phoneQ.length < 4 || o.phone.slice(-4) !== phoneQ.slice(-4)) return out({ error: 'Order not found' }, 404);
        return out({ id: o.id, date: o.date, status: o.status, total: o.total, city: o.city, items: o.items.map(i => ({ name: i.name, size: i.size, qty: i.qty })) });
      }
      if (req.method === 'PATCH') {
        if (!env.ADMIN_PASSWORD) return out({ error: 'ADMIN_PASSWORD is not set in Cloudflare' }, 500);
        if (!checkAdmin(req, env)) return out({ error: 'Wrong password' }, 401);
        const raw = await env.STORE.get('order:' + id);
        if (!raw) return out({ error: 'Order not found' }, 404);
        const body = await req.json().catch(() => null);
        if (!body || !STATUSES.includes(body.status)) return out({ error: 'Invalid status' }, 400);
        let o; try { o = JSON.parse(raw); } catch { return out({ error: 'Order not found' }, 404); }
        o.status = body.status; o.statusAt = new Date().toISOString();
        await env.STORE.put('order:' + id, JSON.stringify(o));
        return out({ ok: true });
      }
      return out({ error: 'Method not allowed' }, 405);
    }

    return env.ASSETS.fetch(req);
  }
};
