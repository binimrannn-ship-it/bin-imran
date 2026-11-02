/* ============================================================
   BIN IMRAN - SETTINGS AND PRODUCTS
   Edit this file to change your details and your products.
   ============================================================ */

const SITE = {
  name: "Bin Imran",
  tagline: "Ladies Clothing",
  email: "harissheikh1817@gmail.com",
  phone: "0312-5632506",
  whatsapp: "923125632506",                  // WhatsApp number, with 92, no + and no 0
  freeDeliveryOver: 5000,                    // <-- free delivery amount (Rs.)
  deliveryFee: 250,                          // <-- delivery fee if below that amount
  year: 2026
};

/* Theme colours. Change them from the admin panel (#/admin). */
const THEME = { dark: "#8b2c52", accent: "#b4577a", gold: "#a1655b", bg: "#fdf3f1" };

/* Categories: Lawn, Cotton, Embroidered, Formal, Winter
   isNew: true  -> shows in "New In"
   oldPrice     -> if set, product shows in "Sale"
   img          -> optional picture, e.g. "images/suit1.jpg" (put pictures in the public/images folder)
*/
const PRODUCTS = [
  { id: 1,  name: "Rose Garden Printed Lawn",     cat: "Lawn",        price: 3200, oldPrice: 4000, isNew: true,  color: ["#f6a5c0","#c2185b"], desc: "Soft printed lawn 3-piece suit with a chiffon dupatta. Light and cool for daily wear." },
  { id: 2,  name: "Mint Breeze Lawn Suit",        cat: "Lawn",        price: 2900, oldPrice: 0,    isNew: true,  color: ["#a8e6cf","#2e7d6b"], desc: "Fresh mint color lawn suit with a neat floral print. Very comfortable in summer." },
  { id: 3,  name: "Sunshine Digital Lawn",        cat: "Lawn",        price: 3600, oldPrice: 4400, isNew: false, color: ["#ffe08a","#e6a100"], desc: "Bright digital print on soft lawn. Comes with a printed dupatta and plain trouser." },
  { id: 4,  name: "Classic Cotton Daily Suit",    cat: "Cotton",      price: 2500, oldPrice: 0,    isNew: false, color: ["#cfd8dc","#546e7a"], desc: "Pure cotton suit that is easy to wear and easy to wash. Good for office and home." },
  { id: 5,  name: "Lilac Dream Cotton Suit",      cat: "Cotton",      price: 2800, oldPrice: 3300, isNew: true,  color: ["#d1b3ff","#6a1b9a"], desc: "Soft lilac cotton with small block prints. Breathable and gentle on the skin." },
  { id: 6,  name: "Peach Blossom Cotton",         cat: "Cotton",      price: 2700, oldPrice: 0,    isNew: false, color: ["#ffcba4","#d9622b"], desc: "Warm peach cotton suit with a simple border. A nice choice for every day." },
  { id: 7,  name: "Royal Maroon Embroidered",     cat: "Embroidered", price: 6800, oldPrice: 8200, isNew: true,  color: ["#b23a5c","#4a0d22"], desc: "Rich maroon suit with fine thread embroidery on the front and sleeves. Perfect for parties." },
  { id: 8,  name: "Golden Pearl Embroidered",     cat: "Embroidered", price: 7500, oldPrice: 0,    isNew: true,  color: ["#f3d9a4","#a67c00"], desc: "Elegant suit with gold embroidery and pearl details. Comes with an embroidered dupatta." },
  { id: 9,  name: "Emerald Festive Suit",         cat: "Embroidered", price: 6200, oldPrice: 7400, isNew: false, color: ["#7fd1ae","#0b6e4f"], desc: "Deep green embroidered suit made for Eid and weddings." },
  { id: 10, name: "Midnight Black Formal",        cat: "Formal",      price: 8900, oldPrice: 0,    isNew: false, color: ["#5c5470","#150f1f"], desc: "Stylish black formal suit with silver work. Looks great at dinners and events." },
  { id: 11, name: "Blush Pink Formal Gown Suit",  cat: "Formal",      price: 9800, oldPrice: 11500,isNew: true,  color: ["#ffd1dc","#c2185b"], desc: "Long formal shirt with a flared design and net dupatta. A soft and graceful look." },
  { id: 12, name: "Ivory Bridal Guest Suit",      cat: "Formal",      price: 9200, oldPrice: 0,    isNew: false, color: ["#fff3e0","#b08968"], desc: "Ivory suit with light gold details. A lovely pick for wedding guests." },
  { id: 13, name: "Cozy Khaddar Winter Suit",     cat: "Winter",      price: 4200, oldPrice: 5000, isNew: true,  color: ["#c9a98a","#6d4c41"], desc: "Warm khaddar suit with a woolen shawl. Keeps you cozy all winter." },
  { id: 14, name: "Wine Velvet Shawl Suit",       cat: "Winter",      price: 6500, oldPrice: 0,    isNew: false, color: ["#a3294f","#3d0a1d"], desc: "Soft velvet shirt with a matching shawl. Warm, rich, and stylish." },
  { id: 15, name: "Grey Marina Winter Suit",      cat: "Winter",      price: 4800, oldPrice: 5600, isNew: false, color: ["#b0bec5","#37474f"], desc: "Smooth marina fabric with a printed shawl. Easy to style and very warm." },
  { id: 16, name: "Teal Garden Lawn Suit",        cat: "Lawn",        price: 3400, oldPrice: 0,    isNew: false, color: ["#80cbc4","#00695c"], desc: "Teal lawn suit with garden flowers. Light, soft, and pretty." }
];

const REVIEWS = [
  { name: "Ayesha R.",  text: "The fabric is soft and the fit was perfect. I got many compliments!" },
  { name: "Hina M.",    text: "Beautiful designs and the colors look just like the pictures." },
  { name: "Sara K.",    text: "Fast delivery and very good service. I will order again." }
];
