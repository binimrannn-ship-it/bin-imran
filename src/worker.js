// Bin Imran - products API. Public: GET. Admin only: POST (needs ADMIN_PASSWORD secret).
const CATS = ['Lawn', 'Cotton', 'Embroidered', 'Formal', 'Winter'];
const HEX = /^#[0-9a-f]{6}$/i;
const out = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const num = v => (Number.isFinite(+v) && +v >= 0 ? Math.round(+v) : null);

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

export default {
  async fetch(req, env) {
    const path = new URL(req.url).pathname;
    if (path !== '/api/products' && path !== '/api/login') return env.ASSETS.fetch(req);
    if (path === '/api/products' && req.method === 'GET') {
      return new Response((await env.STORE.get('products')) || 'null', { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
    }
    if (req.method !== 'POST') return out({ error: 'Method not allowed' }, 405);
    if (!env.ADMIN_PASSWORD) return out({ error: 'ADMIN_PASSWORD is not set in Cloudflare' }, 500);
    if (req.headers.get('x-admin-password') !== env.ADMIN_PASSWORD) return out({ error: 'Wrong password' }, 401);
    if (path === '/api/login') return out({ ok: true });
    let data; try { data = await req.json(); } catch { return out({ error: 'Bad data' }, 400); }
    const list = clean(data);
    if (!list) return out({ error: 'Product data is not valid' }, 400);
    await env.STORE.put('products', JSON.stringify(list));
    return out({ ok: true, count: list.length });
  }
};
