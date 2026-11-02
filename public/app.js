/* ===== Bin Imran - website logic ===== */
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const rs = n => 'Rs. ' + Number(n).toLocaleString('en-PK');

/* ---------- Saved data (cart + wishlist) ---------- */
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
let cart = store.get('bi_cart');   // [{id,size,qty}]
let wish = store.get('bi_wish');   // [id,id,...]

/* ---------- Helpers ---------- */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2000);
}
function pic(p) {
  if (p.img) return `<img src="${p.img}" alt="${p.name}" loading="lazy">`;
  const [a, b] = p.color;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500' preserveAspectRatio='xMidYMid slice'>
    <defs><linearGradient id='g${p.id}' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>
    <rect width='400' height='500' fill='url(#g${p.id})'/>
    <g fill='#ffffff' fill-opacity='.18'><circle cx='60' cy='70' r='50'/><circle cx='350' cy='430' r='80'/><circle cx='330' cy='90' r='26'/></g>
    <g fill='#ffffff' fill-opacity='.92'>
      <path d='M165 120 L200 150 L235 120 L270 150 L250 210 L245 400 L155 400 L150 210 L130 150 Z'/>
    </g>
    <path d='M200 150 L200 400' stroke='${b}' stroke-opacity='.25' stroke-width='3'/>
    <text x='200' y='455' text-anchor='middle' font-family='Georgia,serif' font-size='22' fill='#fff' fill-opacity='.9'>Bin Imran</text>
  </svg>`;
  return svg;
}
function isSale(p) { return p.oldPrice && p.oldPrice > p.price; }
function save() { store.set('bi_cart', cart); store.set('bi_wish', wish); updateCounts(); }
function updateCounts() {
  const c = cart.reduce((n, i) => n + i.qty, 0);
  const cc = $('#cartCount'), wc = $('#wishCount');
  cc.textContent = c; cc.hidden = !c;
  wc.textContent = wish.length; wc.hidden = !wish.length;
}
function addToCart(id, size = 'M', qty = 1) {
  const f = cart.find(i => i.id === id && i.size === size);
  if (f) f.qty += qty; else cart.push({ id, size, qty });
  save(); toast('Added to cart 🛍');
}
function toggleWish(id) {
  const i = wish.indexOf(id);
  if (i > -1) { wish.splice(i, 1); toast('Removed from wishlist'); }
  else { wish.push(id); toast('Added to wishlist ♡'); }
  save();
}

/* ---------- Card ---------- */
function card(p) {
  const liked = wish.includes(p.id);
  return `<article class="card">
    ${isSale(p) ? `<span class="badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : p.isNew ? '<span class="badge new">New</span>' : ''}
    <button class="heart" data-wish="${p.id}" aria-label="Wishlist">${liked ? '♥' : '♡'}</button>
    <a class="pic" href="#/product/${p.id}">${pic(p)}</a>
    <div class="info">
      <small>${p.cat}</small>
      <h3><a href="#/product/${p.id}">${p.name}</a></h3>
      <div class="price">${rs(p.price)}${isSale(p) ? `<s>${rs(p.oldPrice)}</s>` : ''}</div>
      <button class="add" data-add="${p.id}">Add to Cart</button>
    </div>
  </article>`;
}
const grid = list => list.length
  ? `<div class="products">${list.map(card).join('')}</div>`
  : `<div class="empty"><h3>No suits found</h3><p>Try another category or search.</p><a class="btn" href="#/shop">View All Suits</a></div>`;

/* ---------- Pages ---------- */
const H = () => SITE.hero || {};
const hc = k => H()[k] ? ` style="color:${H()[k]}"` : '';
function heroStyle() { if (!SITE.heroImg) return ''; const a = Math.max(0, 1 - (H().brightness || 78) / 100).toFixed(2); return ` style="background:linear-gradient(rgba(0,0,0,${a}),rgba(0,0,0,${a})),url('${SITE.heroImg}') ${H().position ?? 50}% center/cover"`; }
const payList = () => SITE.pay && SITE.pay.length ? SITE.pay : [{ name: 'Cash on Delivery', details: '' }];
const paySel = () => `<select id="cPay">${payList().map(m => `<option>${m.name}</option>`).join('')}</select>`;
const payNote = () => `<p class="note">${payList().map(m => (m.name === 'Cash on Delivery' ? '💵 ' : '💳 ') + m.name + (m.details ? ': ' + m.details : '')).join('<br>')}<br>We will confirm your order on WhatsApp.</p>`;
function home() {
  const nw = PRODUCTS.filter(p => p.isNew).slice(0, 4);
  const sale = PRODUCTS.filter(isSale).slice(0, 4);
  return `
  <section class="hero"${heroStyle()}>${SITE.heroImg ? '' : '<div class="hero-photo" aria-hidden="true"></div>'}<div class="wrap">
    <div class="hero-copy">
      <span class="eyebrow">YOUR STYLE, YOUR RULES</span>
      <h1${hc('titleColor')}>${H().line2 || 'Find your elegance.'}<i${hc('accentColor')}>${H().line1 || 'Own your style.'}</i></h1>
      <p${hc('subColor')}>${H().sub || 'Discover your new favourite suits, from everyday lawn to festive embroidery.'}</p>
      <a class="btn" href="${H().btnLink || '#/shop'}"${H().btnColor ? ` style="background:${H().btnColor}"` : ''}>${H().btnText || 'Shop Now ↗'}</a>
    </div>
    <div class="hero-art" aria-hidden="true">
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="hk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fbe6ee" stop-opacity=".9"/></linearGradient></defs>
        <path d="M105 52c14 14 76 14 90 0l34 22 20 78-32 12-10-38-6 120 28 144H71l28-144-6-120-10 38-32-12 20-78z" fill="url(#hk)"/>
        <path d="M122 52c10 22 46 22 56 0" fill="none" stroke="#b4577a" stroke-opacity=".5" stroke-width="2"/>
        <path d="M150 74v270" stroke="#b4577a" stroke-opacity=".18" stroke-width="2"/>
        <path d="M82 350c40 10 96 10 136 0" fill="none" stroke="#a1655b" stroke-opacity=".6" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
        <g fill="#a1655b" fill-opacity=".7"><circle cx="130" cy="110" r="3"/><circle cx="170" cy="110" r="3"/><circle cx="150" cy="130" r="3"/></g>
      </svg>
      <span class="chip c1">✦ New Season</span><span class="chip c2">Free Delivery</span>
    </div>
    <div class="perks">
      <div><i><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="m9 12 2 2 4-4"/></svg></i><b>Premium Quality</b><small>Soft &amp; breathable fabrics</small></div>
      <div><i><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7.500" cy="17.500" r="1.800"/><circle cx="17.500" cy="17.500" r="1.800"/></svg></i><b>Free Delivery</b><small>Over ${rs(SITE.freeDeliveryOver)}</small></div>
      <div><i><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14l-3-3M20 16H6l3 3"/></svg></i><b>Easy Exchange</b><small>Hassle-free</small></div>
      <div><i><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6.500" width="18" height="11" rx="2.500"/><circle cx="12" cy="12" r="2.500"/></svg></i><b>Cash on Delivery</b><small>Pay at your door</small></div>
    </div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><h2>New Arrivals</h2><p>Fresh suits for every day</p></div><a class="link" href="#/shop/new">View All →</a></div>
    ${grid(nw)}
  </div></section>

  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><h2>Hot Deals</h2><p>Limited time offers</p></div><a class="link" href="#/shop/sale">View All →</a></div>
    ${grid(sale)}
  </div></section>

  <section class="section" style="padding-top:0"><div class="wrap promos">
    <div class="promo"><small>Wedding &amp; Eid</small><h3>Eid &amp; Festive Collection</h3><p>Elegant embroidered suits<br>for your special days.</p><a class="btn" href="#/shop/Embroidered">Shop Festive →</a></div>
    <div class="promo two"><small>Season Special</small><h3>Up To 30% Off</h3><p>On selected suits</p><a class="btn" href="#/shop/sale">Shop the Sale →</a></div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><div><h2>Order in 3 Easy Steps</h2><p>Simple, safe and from the comfort of your home</p></div></div>
    <div class="steps">
      <div><i>1</i><b>Choose your suit</b><p>Browse lawn, cotton, embroidered, formal and winter collections.</p></div>
      <div><i>2</i><b>Add to cart or WhatsApp</b><p>Pick your size and place the order on the site or on WhatsApp.</p></div>
      <div><i>3</i><b>Pay on delivery</b><p>We confirm on WhatsApp and deliver to your door. Easy exchange.</p></div>
    </div>
  </div></section>

  <section class="section" style="padding-top:0"><div class="wrap">
    <div class="cta"><div><h3>Need help choosing a suit?</h3><p>Message us on WhatsApp and we will help you with sizes, fabric and styling.</p></div>
    <a class="btn" target="_blank" rel="noopener" href="https://wa.me/${SITE.whatsapp}${SITE.waMessage ? '?text=' + encodeURIComponent(SITE.waMessage) : ''}">Chat on WhatsApp ↗</a></div>
  </div></section>

  ${REVIEWS.length ? `<section class="section" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><h2>What Our Customers Say</h2></div>
    <div class="reviews">${REVIEWS.map(r => `<div class="review"><div class="stars">${'★'.repeat(r.stars || 5)}</div><p>“${r.text}”</p><b>${r.name}</b></div>`).join('')}</div>
  </div></section>` : ''}`;
}

function shop(key, query) {
  let list = PRODUCTS, title = 'All Suits', sub = 'Beautiful suits for every occasion';
  if (query) { const q = query.toLowerCase(); list = PRODUCTS.filter(p => (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(q)); title = 'Search: ' + query; sub = list.length + ' result(s)'; }
  else if (key === 'new') { list = PRODUCTS.filter(p => p.isNew); title = 'New In'; sub = 'Fresh arrivals'; }
  else if (key === 'sale') { list = PRODUCTS.filter(isSale); title = 'Sale'; sub = 'Limited time offers'; }
  else if (key) { list = PRODUCTS.filter(p => p.cat === key); title = key + ' Suits'; sub = list.length + ' product(s)'; }
  return `<div class="page-title"><h1>${title}</h1><p>${sub}</p></div>
  <div class="wrap section" style="padding-top:34px">
    <div class="toolbar"><span>${list.length} items</span>
      <select id="sort"><option value="">Sort by</option><option value="lo">Price: Low to High</option><option value="hi">Price: High to Low</option></select></div>
    <div id="shopGrid">${grid(list)}</div>
  </div>`;
}
let shopList = [];

function product(id) {
  const p = PRODUCTS.find(x => x.id === +id);
  if (!p) return `<div class="empty"><h3>Product not found</h3><a class="btn" href="#/shop">Back to shop</a></div>`;
  const more = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  return `<div class="wrap">
    <div class="detail">
      <div class="pic">${isSale(p) ? '<span class="badge">SALE</span>' : ''}${pic(p)}</div>
      <div>
        <small style="color:var(--muted);text-transform:uppercase;letter-spacing:2px">${p.cat}</small>
        <h1>${p.name}</h1>
        <div class="price">${rs(p.price)}${isSale(p) ? `<s>${rs(p.oldPrice)}</s>` : ''}</div>
        <p>${p.desc}</p>
        <b style="font-size:14px">Size</b>
        <div class="sizes" id="sizes">${['S', 'M', 'L', 'XL'].map(s => `<button class="${s === 'M' ? 'on' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
        <div class="btn-row">
          <button class="btn" id="addDetail" data-id="${p.id}">Add to Cart</button>
          <button class="btn ghost" data-wish="${p.id}">${wish.includes(p.id) ? '♥ Saved' : '♡ Wishlist'}</button>
          <a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hello Bin Imran, I want to order: ' + p.name + ' (' + rs(p.price) + ')')}">Order on WhatsApp</a>
        </div>
        <ul class="points"><li>💵 Cash on Delivery</li><li>🔁 Easy Exchange</li><li>🚚 Free delivery over ${rs(SITE.freeDeliveryOver)}</li></ul>
      </div>
    </div>
    ${more.length ? `<div class="sec-head"><h2>You may also like</h2></div>${grid(more)}<div style="height:50px"></div>` : ''}
  </div>`;
}

function calc() {
  const items = cart.map(i => ({ ...i, p: PRODUCTS.find(x => x.id === i.id) })).filter(i => i.p);
  const sub = items.reduce((n, i) => n + i.p.price * i.qty, 0);
  const ship = !sub || sub >= SITE.freeDeliveryOver ? 0 : SITE.deliveryFee;
  return { items, sub, ship, total: sub + ship };
}
function cartPage() {
  const { items, sub, ship, total } = calc();
  if (!items.length) return `<div class="empty"><h2 style="font-family:var(--serif)">Your cart is empty 🛍</h2><p>Add some beautiful suits to get started.</p><a class="btn" href="#/shop">Start Shopping</a></div>`;
  return `<div class="page-title"><h1>Your Cart</h1></div>
  <div class="wrap cart">
    <div>${items.map((i, n) => `<div class="row">
      <div class="thumb">${pic(i.p)}</div>
      <div class="grow"><h4>${i.p.name}</h4><small>Size: ${i.size} · ${rs(i.p.price)}</small><br>
        <div class="qty"><button data-q="${n}" data-d="-1">−</button><span>${i.qty}</span><button data-q="${n}" data-d="1">+</button></div></div>
      <div style="text-align:right"><b>${rs(i.p.price * i.qty)}</b><br><button class="remove" data-rm="${n}">Remove</button></div>
    </div>`).join('')}</div>
    <aside class="summary">
      <h3>Order Summary</h3>
      <div class="sum-row"><span>Subtotal</span><span>${rs(sub)}</span></div>
      <div class="sum-row"><span>Delivery</span><span>${ship ? rs(ship) : 'Free'}</span></div>
      <div class="sum-row total"><span>Total</span><span>${rs(total)}</span></div>
      <input id="cName" placeholder="Your name">
      <input id="cPhone" placeholder="Phone number" inputmode="tel">
      <textarea id="cAddr" rows="3" placeholder="Full delivery address"></textarea>
      ${paySel()}<button class="btn wa block" id="checkout">Order on WhatsApp</button>
      ${payNote()}
    </aside>
  </div>`;
}
function checkout() {
  const name = $('#cName').value.trim(), phone = $('#cPhone').value.trim(), addr = $('#cAddr').value.trim();
  if (!name || !phone || !addr) { toast('Please fill name, phone and address'); return; }
  const { items, sub, ship, total } = calc();
  const pay = ($('#cPay') || {}).value || 'Cash on Delivery';
  if (SITE.sheet) fetch(SITE.sheet, { method: 'POST', mode: 'no-cors', keepalive: true, body: JSON.stringify({ id: 'BI' + Date.now().toString(36).toUpperCase(), date: new Date().toLocaleString('en-GB'), name, phone, city: '', address: addr, notes: '', payment: pay, items: items.map(i => `${i.p.name} (${i.size}) x${i.qty}`).join('; '), subtotal: sub, delivery: ship ? ship : 'Free', total }) }).catch(() => {});
  let msg = `Hello Bin Imran! I want to place an order:\n\n`;
  items.forEach((i, n) => { msg += `${n + 1}. ${i.p.name} (Size ${i.size}) x${i.qty} = ${rs(i.p.price * i.qty)}\n`; });
  msg += `\nSubtotal: ${rs(sub)}\nDelivery: ${ship ? rs(ship) : 'Free'}\nTotal: ${rs(total)}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${addr}\nPayment: ${pay}`;
  window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}

function wishPage() {
  const list = PRODUCTS.filter(p => wish.includes(p.id));
  return `<div class="page-title"><h1>My Wishlist</h1><p>${list.length} saved</p></div>
  <div class="wrap section">${list.length ? grid(list) : `<div class="empty"><h3>No saved suits yet ♡</h3><p>Tap the heart on any suit to save it here.</p><a class="btn" href="#/shop">Browse Suits</a></div>`}</div>`;
}

function account() {
  return `<div class="wrap"><div class="box form">
    <h2>My Account</h2>
    <p style="color:var(--muted);font-size:14px;margin-bottom:12px">Save your details to order faster next time.</p>
    <input id="aName" placeholder="Your name" value="${(localStorage.getItem('bi_name') || '').replace(/"/g, '')}">
    <input id="aPhone" placeholder="Phone number" value="${(localStorage.getItem('bi_phone') || '').replace(/"/g, '')}">
    <textarea id="aAddr" rows="3" placeholder="Address">${(localStorage.getItem('bi_addr') || '').replace(/</g, '')}</textarea>
    <button class="btn block" id="saveAcc" style="margin-top:8px">Save Details</button>
  </div></div>`;
}

function help() {
  const faqs = [
    ['How do I place an order?', 'Add suits to your cart and tap "Order on WhatsApp". We will confirm your order and delivery time on WhatsApp.'],
    ['Do you have Cash on Delivery?', 'Yes. You pay in PKR when the parcel reaches your door.'],
    ['How much is delivery?', `Delivery is free on orders over ${rs(SITE.freeDeliveryOver)}. Below that it is ${rs(SITE.deliveryFee)}.`],
    ['What is the exchange policy?', 'If the size or fit is not right, message us on WhatsApp within 7 days. The suit must be unused and in its original packing.'],
    ['How can I track my order?', 'Send us your name or order details on WhatsApp and we will tell you where your parcel is.']
  ];
  return `<div class="page-title"><h1>Help Center</h1><p>We are happy to help you</p></div>
  <div class="wrap section" style="max-width:820px">
    <div class="sec-head"><h2>FAQs</h2></div>
    <div class="faq">${faqs.map(f => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div>
    <div class="sec-head" style="margin-top:40px"><h2>Size Guide (inches)</h2></div>
    <table class="size"><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Hip</th><th>Length</th></tr>
      <tr><td>S</td><td>34</td><td>28</td><td>36</td><td>38</td></tr>
      <tr><td>M</td><td>36</td><td>30</td><td>38</td><td>40</td></tr>
      <tr><td>L</td><td>38</td><td>32</td><td>40</td><td>42</td></tr>
      <tr><td>XL</td><td>40</td><td>34</td><td>42</td><td>43</td></tr></table>
    <div class="sec-head" style="margin-top:40px"><h2>Contact Us</h2></div>
    <p>✉ ${SITE.email}<br>📞 ${SITE.phone}</p>
    <p style="margin-top:16px"><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/${SITE.whatsapp}">Chat on WhatsApp</a></p>
  </div>`;
}

/* ---------- Router ---------- */
function route() {
  const h = decodeURIComponent(location.hash.slice(1) || '/');
  const parts = h.split('/').filter(Boolean);
  let html;
  if (!parts.length) html = home();
  else if (parts[0] === 'shop') html = shop(parts[1]);
  else if (parts[0] === 'search') html = shop(null, parts.slice(1).join('/'));
  else if (parts[0] === 'product') html = product(parts[1]);
  else if (parts[0] === 'cart') html = cartPage();
  else if (parts[0] === 'wishlist') html = wishPage();
  else if (parts[0] === 'account') html = account();
  else if (parts[0] === 'help') html = help();
  else html = home();
  app.innerHTML = html;
  window.scrollTo({ top: 0 });
  document.querySelectorAll('#menu a, #catbar a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + h));
  // remember list for sorting
  if (parts[0] === 'shop' || parts[0] === 'search') {
    const key = parts[1];
    shopList = parts[0] === 'search' ? PRODUCTS.filter(p => (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(parts.slice(1).join('/').toLowerCase()))
      : key === 'new' ? PRODUCTS.filter(p => p.isNew) : key === 'sale' ? PRODUCTS.filter(isSale) : key ? PRODUCTS.filter(p => p.cat === key) : PRODUCTS;
  }
}
window.addEventListener('hashchange', route);

/* ---------- Clicks ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.add) addToCart(+t.dataset.add);
  else if (t.dataset.wish) { toggleWish(+t.dataset.wish); if (location.hash.startsWith('#/wishlist') || location.hash.startsWith('#/product')) route(); else document.querySelectorAll(`[data-wish="${t.dataset.wish}"]`).forEach(b => { if (b.classList.contains('heart')) b.textContent = wish.includes(+t.dataset.wish) ? '♥' : '♡'; }); }
  else if (t.dataset.size) { document.querySelectorAll('#sizes button').forEach(b => b.classList.remove('on')); t.classList.add('on'); }
  else if (t.id === 'addDetail') { const s = $('#sizes .on'); addToCart(+t.dataset.id, s ? s.dataset.size : 'M'); }
  else if (t.dataset.q) { const i = cart[+t.dataset.q]; i.qty += +t.dataset.d; if (i.qty < 1) cart.splice(+t.dataset.q, 1); save(); route(); }
  else if (t.dataset.rm) { cart.splice(+t.dataset.rm, 1); save(); route(); }
  else if (t.id === 'checkout') checkout();
  else if (t.id === 'saveAcc') { localStorage.setItem('bi_name', $('#aName').value); localStorage.setItem('bi_phone', $('#aPhone').value); localStorage.setItem('bi_addr', $('#aAddr').value); toast('Details saved ✓'); }
});
document.addEventListener('change', e => {
  if (e.target.id !== 'sort') return;
  const l = [...shopList];
  if (e.target.value === 'lo') l.sort((a, b) => a.price - b.price);
  if (e.target.value === 'hi') l.sort((a, b) => b.price - a.price);
  $('#shopGrid').innerHTML = grid(l);
});
$('#searchForm').addEventListener('submit', e => {
  e.preventDefault();
  const q = $('#searchInput').value.trim();
  if (q) location.hash = '#/search/' + encodeURIComponent(q);
});

/* ---------- Start ---------- */
(function init() {
  $('#fEmail').textContent = '✉ ' + SITE.email;
  $('#fPhone').textContent = '📞 ' + SITE.phone;
  $('#fYear').textContent = SITE.year;
  $('#waFloat').href = 'https://wa.me/' + SITE.whatsapp + (SITE.waMessage ? '?text=' + encodeURIComponent(SITE.waMessage) : '');
  if (SITE.nav) $('#menu').innerHTML = SITE.nav.map(n => `<a href="${n.url}"${n.label === 'Sale' ? ' class="hot"' : ''}>${n.label}</a>`).join('');
  $('#catbar').innerHTML = $('#menu').innerHTML;
  if (SITE.address) $('#fAddress').textContent = '📍 ' + SITE.address;
  const so = SITE.social || {};
  $('#fSocial').innerHTML = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube']].filter(([k]) => so[k]).map(([k, l]) => `<a href="${so[k]}" target="_blank" rel="noopener">${l}</a>`).join('');
  if (SITE.pay && SITE.pay.length) $('#fPay').innerHTML = SITE.pay.map(m => '💳 ' + m.name).join('<br>');
  updateCounts();
  route();
})();

/* ---------- Header: menu drawer + search bar ---------- */
(function () {
  const drawer = $('#drawer'), bg = $('#drawerBg'), sf = $('#searchForm');
  const open = o => { drawer.classList.toggle('open', o); bg.classList.toggle('open', o); $('#menuBtn').setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; };
  $('#menuBtn').addEventListener('click', () => open(true));
  $('#drawerClose').addEventListener('click', () => open(false));
  bg.addEventListener('click', () => open(false));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) open(false); });
  $('#searchBtn').addEventListener('click', () => { sf.classList.toggle('open'); if (sf.classList.contains('open')) $('#searchInput').focus(); });
  sf.addEventListener('submit', () => sf.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { open(false); sf.classList.remove('open'); } });
})();
