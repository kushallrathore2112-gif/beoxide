/* ══ be.oxide | app.js ══ */

// ══ DATA ══════════════════════════════════════════════════════════════════════

const COLLECTIONS = [{
  id: 'oneton',
  name: 'OneTon Collection',
  tagline: 'One Who Rules — SS2026',
  badge: 'Pre-Order Open',
  productCount: 15,
  desc: 'Heavyweight varsity graphics, panel construction, and hockey-inspired cuts — 100% raw Indian cotton.'
}];

// Each product can carry a real "images" array (photo URLs/data-URIs).
// Until real photos are added, the generated SVG illustration is used as a fallback
// both on the product card and inside the detail / quick-view modal.
const PRODUCTS = [
  { id:'tee-001', collection:'oneton', category:'tee', name:'ONE TON 01 Hockey Tee', desc:'Oversized hockey-cut in jet black. Contrast varsity lettering, ribbed v-insert collar, number patch at hem.', longDesc:'Cut from heavyweight 240GSM raw Indian cotton, the ONE TON 01 Hockey Tee takes its silhouette from classic hockey jerseys and reworks it into an oversized streetwear staple. A ribbed v-insert collar and dropped shoulder seams give it structure, while the contrast varsity lettering and embroidered number patch at the hem nod to its athletic roots. Garment-washed for a broken-in feel straight out of the bag.', price:699, mrp:1299, colors:['#0a0a0a','#e8e2d5'], colorLabel:'Jet Black / Bone', sizes:['XS','S','M','L','XL','XXL'], fabric:'240 GSM raw Indian cotton', fit:'Oversized hockey cut', care:'Cold machine wash, inside-out', svgPrimary:'#0a0a0a', svgSecondary:'#e8e2d5', svgText:'#ffffff', svgLabel:'ONE TON 01', isNew:true, images:['images/tee-001-front.png','images/tee-001-back.png'] },
  { id:'tee-002', collection:'oneton', category:'tee', name:'ONE TON Hockey Jersey', desc:'Dual-tone hockey jersey in midnight navy and bone. Gold varsity graphics with embedded shark crest logo.', longDesc:'A dual-tone hockey jersey built in midnight navy and bone, finished with gold varsity graphics and an embroidered shark crest at the chest. The dropped-shoulder block construction is reinforced at the seams for a heavyweight drape that holds its shape wash after wash.', price:999, mrp:1899, colors:['#1b2a42','#e8e2d5','#c9a84c'], colorLabel:'Navy / Bone / Gold', sizes:['S','M','L','XL','XXL'], fabric:'260 GSM raw Indian cotton', fit:'Oversized hockey cut', care:'Cold machine wash, inside-out', svgPrimary:'#1b2a42', svgSecondary:'#e8e2d5', svgText:'#c9a84c', svgLabel:'ONE TON', isNew:true, images:['images/tee-002-front.png','images/tee-002-back.png'] },
  { id:'tee-003', collection:'oneton', category:'tee', name:'Raglan Panel Tee', desc:'Minimalist raglan in natural wheat. Tonal panelling at sleeves, subtle BE.OXIDE chest mark.', longDesc:'Stripped-back and tonal, the Raglan Panel Tee sits in natural wheat with contrast raglan sleeve panels for quiet detail. A subtle BE.OXIDE chest mark keeps the branding minimal, making this the everyday layering piece of the drop.', price:799, mrp:1599, colors:['#c8b89a','#a09070'], colorLabel:'Natural Wheat', sizes:['XS','S','M','L','XL','XXL'], fabric:'220 GSM raw Indian cotton', fit:'Relaxed raglan', care:'Cold machine wash, inside-out', svgPrimary:'#c8b89a', svgSecondary:'#a09070', svgText:'#0a0a0a', svgLabel:'BE.OXIDE', isNew:false, images:['images/tee-003-1.png','images/tee-003-2.png','images/tee-003-3.png','images/tee-003-4.png'] },
  { id:'tee-004', collection:'oneton', category:'tee', name:'Colorblock Raglan Tee', desc:'Bold monochrome contrast raglan — black body with white panel sleeves. BE.OXIDE micro-branding.', longDesc:'High-contrast colorblocking with a black body and crisp white raglan panel sleeves. Finished with micro BE.OXIDE branding at the chest for a piece that reads bold from across the room and clean up close.', price:799, mrp:1599, colors:['#0a0a0a','#ffffff'], colorLabel:'Black / White', sizes:['S','M','L','XL','XXL'], fabric:'220 GSM raw Indian cotton', fit:'Relaxed raglan', care:'Cold machine wash, inside-out', svgPrimary:'#0a0a0a', svgSecondary:'#ffffff', svgText:'#ffffff', svgLabel:'BE.OXIDE', isNew:false, images:['images/tee-004-front.png','images/tee-004-back.png'] },
  { id:'tee-005', collection:'oneton', category:'tee', name:'BE.OXIDE 01 Varsity Tee', desc:'Longline varsity tee in crisp white. Black shoulder stripes, chest emblem, and oversized BE.OXIDE 01 graphics.', longDesc:'A longline varsity tee in crisp white, anchored by black shoulder stripes, a woven chest emblem, and oversized BE.OXIDE 01 back graphics. Drop-shoulder construction with a slightly extended hem for layering under outerwear.', price:699, mrp:1299, colors:['#ffffff','#0a0a0a'], colorLabel:'White / Black', sizes:['XS','S','M','L','XL','XXL'], fabric:'240 GSM raw Indian cotton', fit:'Longline oversized', care:'Cold machine wash, inside-out', svgPrimary:'#ffffff', svgSecondary:'#0a0a0a', svgText:'#0a0a0a', svgLabel:'BE.OXIDE 01', isNew:true, images:['images/tee-005-front.png','images/tee-005-back.png'] },
  { id:'jog-001', collection:'oneton', category:'jogger', name:'ONE TON Track Jogger', desc:'Relaxed wide-leg silhouette in heavyweight French terry. Tonal embroidered crest at thigh.', longDesc:'A relaxed, wide-leg track jogger in heavyweight French terry with a tonal embroidered crest at the thigh. Elasticated drawcord waist and ribbed ankle cuffs keep the silhouette grounded without sacrificing comfort.', price:2799, mrp:3999, colors:['#0a0a0a'], colorLabel:'Jet Black', sizes:['S','M','L','XL','XXL'], fabric:'380 GSM French terry', fit:'Relaxed wide-leg', care:'Cold machine wash, inside-out', svgPrimary:'#0a0a0a', svgSecondary:'#2c2c2c', svgText:'#888', svgLabel:'ONE TON', isNew:true, images:[] },
  { id:'jog-002', collection:'oneton', category:'jogger', name:'Oxide Wide-Leg Jogger', desc:'Pleated wide-leg drop-crotch cut in charcoal. Clean lines, zero branding at front.', longDesc:'Pleated at the waist with a relaxed drop-crotch cut, the Oxide Wide-Leg Jogger keeps branding off the front for a cleaner silhouette. Charcoal heavyweight cotton drapes through the leg and tapers gently at the ankle.', price:2599, mrp:3599, colors:['#2c2c2c','#0a0a0a'], colorLabel:'Charcoal', sizes:['S','M','L','XL','XXL'], fabric:'360 GSM cotton blend', fit:'Wide-leg drop-crotch', care:'Cold machine wash, inside-out', svgPrimary:'#2c2c2c', svgSecondary:'#111', svgText:'#888', svgLabel:'be.oxide', isNew:false, images:[] },
  { id:'jog-003', collection:'oneton', category:'jogger', name:'Bone Cuffed Jogger', desc:'Tapered jogger in bone white with ribbed cuffs and tonal drawcord.', longDesc:'A tapered silhouette in bone white French terry, finished with ribbed ankle cuffs and a tonal drawcord at the waist. Side seam pockets and a clean back patch keep the detailing minimal.', price:0, mrp:0, colors:['#e8e2d5','#c8b89a'], colorLabel:'Bone White', sizes:['S','M','L','XL','XXL'], fabric:'380 GSM French terry', fit:'Tapered', care:'Cold machine wash, inside-out', svgPrimary:'#e8e2d5', svgSecondary:'#c8b89a', svgText:'#0a0a0a', svgLabel:'be.oxide', isNew:true, images:[] },
  { id:'jog-004', collection:'oneton', category:'jogger', name:'Shark Crest Cargo Jogger', desc:'Utility cargo jogger in olive with embroidered shark crest at thigh.', longDesc:'A utility-inspired cargo jogger in olive heavyweight cotton, featuring twin cargo pockets and an embroidered shark crest at the thigh. Elasticated waist with internal drawcord for a secure, relaxed fit.', price:0, mrp:0, colors:['#4a5240'], colorLabel:'Olive', sizes:['S','M','L','XL','XXL'], fabric:'400 GSM cotton blend', fit:'Relaxed cargo', care:'Cold machine wash, inside-out', svgPrimary:'#4a5240', svgSecondary:'#2c3024', svgText:'#c9a84c', svgLabel:'ONE TON', isNew:true, images:[] },
  { id:'jog-005', collection:'oneton', category:'jogger', name:'Midnight Navy Track Pant', desc:'Slim-tapered track pant in midnight navy with gold side stripe.', longDesc:'A slim-tapered track pant in midnight navy, detailed with a single gold side stripe running the full length of the leg. Stretch-finish heavyweight cotton with a ribbed waistband for all-day movement.', price:0, mrp:0, colors:['#1b2a42','#c9a84c'], colorLabel:'Navy / Gold', sizes:['S','M','L','XL','XXL'], fabric:'340 GSM cotton blend', fit:'Slim tapered', care:'Cold machine wash, inside-out', svgPrimary:'#1b2a42', svgSecondary:'#c9a84c', svgText:'#e8e2d5', svgLabel:'ONE TON', isNew:false, images:[] },
  { id:'tank-001', collection:'oneton', category:'tank_top', name:'ONE TON Muscle Tank', desc:'Ribbed muscle tank in black. Graphic ONE TON crest at chest, raw-edge armholes.', longDesc:'A ribbed muscle tank in black with a graphic ONE TON crest at the chest and raw-edge armholes for a stripped-back, gym-to-street finish. Snug through the body with extended armholes for full range of motion.', price:1499, mrp:2199, colors:['#0a0a0a'], colorLabel:'Jet Black', sizes:['XS','S','M','L','XL'], fabric:'220 GSM ribbed cotton', fit:'Slim muscle fit', care:'Cold machine wash, inside-out', svgPrimary:'#0a0a0a', svgSecondary:'#1a1a1a', svgText:'#e8e2d5', svgLabel:'ONE TON', isNew:false, images:[] },
  { id:'tank-002', collection:'oneton', category:'tank_top', name:'Oxide Oversized Tank', desc:'Drape-fit oversized tank in bone white. Dropped shoulders, high-low hem, micro BE.OXIDE chest stamp.', longDesc:'Oversized and drapey, this tank sits in bone white with dropped shoulders and a high-low hem. A micro BE.OXIDE chest stamp keeps the branding quiet on a piece designed to be worn loose, layered, or solo.', price:1599, mrp:2399, colors:['#e8e2d5','#c8b89a'], colorLabel:'Bone White', sizes:['S','M','L','XL','XXL'], fabric:'240 GSM cotton', fit:'Oversized drape', care:'Cold machine wash, inside-out', svgPrimary:'#e8e2d5', svgSecondary:'#c8b89a', svgText:'#0a0a0a', svgLabel:'BE.OXIDE', isNew:true, images:[] },
  { id:'tank-003', collection:'oneton', category:'tank_top', name:'Shark Crest Ribbed Tank', desc:'Ribbed tank in charcoal with embroidered shark crest at chest.', longDesc:'A ribbed charcoal tank finished with an embroidered shark crest at the chest. Built on the same fabric base as the OneTon hockey pieces for a cohesive look across the drop.', price:0, mrp:0, colors:['#2c2c2c'], colorLabel:'Charcoal', sizes:['XS','S','M','L','XL'], fabric:'220 GSM ribbed cotton', fit:'Slim muscle fit', care:'Cold machine wash, inside-out', svgPrimary:'#2c2c2c', svgSecondary:'#111', svgText:'#c9a84c', svgLabel:'ONE TON', isNew:true, images:[] },
  { id:'tank-004', collection:'oneton', category:'tank_top', name:'Varsity Stripe Tank', desc:'Bone tank with black varsity shoulder stripes and chest emblem.', longDesc:'A bone-coloured tank carrying the drop\'s signature black varsity shoulder stripes and a small woven chest emblem. Relaxed through the body for easy layering.', price:0, mrp:0, colors:['#e8e2d5','#0a0a0a'], colorLabel:'Bone / Black', sizes:['S','M','L','XL','XXL'], fabric:'230 GSM cotton', fit:'Relaxed', care:'Cold machine wash, inside-out', svgPrimary:'#e8e2d5', svgSecondary:'#0a0a0a', svgText:'#0a0a0a', svgLabel:'BE.OXIDE', isNew:false, images:[] },
  { id:'tank-005', collection:'oneton', category:'tank_top', name:'Raw Edge Crop Tank', desc:'Cropped raw-edge tank in natural wheat with tonal BE.OXIDE print.', longDesc:'A cropped, raw-edge tank in natural wheat cotton with a tonal BE.OXIDE print at the chest. Designed to sit shorter at the hem for layering over jogger waistbands.', price:0, mrp:0, colors:['#c8b89a'], colorLabel:'Natural Wheat', sizes:['XS','S','M','L','XL'], fabric:'210 GSM cotton', fit:'Cropped slim', care:'Cold machine wash, inside-out', svgPrimary:'#c8b89a', svgSecondary:'#a09070', svgText:'#0a0a0a', svgLabel:'BE.OXIDE', isNew:true, images:[] }
];

// ══ REVIEWS ════════════════════════════════════════════════════════════════════
const REVIEWS = [
  { stars: 5, text: "The hockey tee fits exactly like the photos promised — oversized but not sloppy. Fabric feels genuinely heavyweight.", name: 'Aarav M.', product: 'ONE TON 01 Hockey Tee' },
  { stars: 5, text: "Pre-ordered the jogger and it shipped right on time. Wide leg drapes so well, easily the comfiest thing I own.", name: 'Kabir S.', product: 'ONE TON Track Jogger' },
  { stars: 4, text: "Raglan tee is super clean for everyday wear. Wish it came in one more colourway but no complaints on quality.", name: 'Ishaan R.', product: 'Raglan Panel Tee' },
  { stars: 5, text: "Colour blocking on the raglan is bolder in person — really happy with how it turned out.", name: 'Vihaan K.', product: 'Colorblock Raglan Tee' },
  { stars: 5, text: "Tank top runs true to size and the stitching on the crest is solid. Worth the pre-order wait.", name: 'Reyansh D.', product: 'ONE TON Muscle Tank' }
];

// ══ STATE ══════════════════════════════════════════════════════════════════════
let activeCollection = 'oneton';
let activeCat = 'tee';
let preorderProduct = null;
let detailProduct = null;
let detailActiveImgIndex = 0;
let cart = [];
let currentSlide = 0;
let slideTimer = null;

// ══ UTILS ══════════════════════════════════════════════════════════════════════
const fmt = n => '₹' + n.toLocaleString('en-IN');
const pct = (sale, mrp) => Math.round((1 - sale / mrp) * 100);
const isComingSoonCategory = cat => cat === 'jogger' || cat === 'tank_top';

function toast(msg, type = 'success') {
  const c = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = `toast${type === 'error' ? ' error' : ''}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}

// ══ SVG ILLUSTRATIONS ══════════════════════════════════════════════════════════
function teeSVG(p) {
  const { svgPrimary: pri, svgSecondary: sec, svgText: txt, svgLabel: lbl, category: cat } = p;

  if (cat === 'jogger') return `
    <svg class="tee-svg" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg">
      <rect x="55" y="0" width="90" height="10" rx="5" fill="${pri}"/>
      <rect x="45" y="10" width="110" height="155" rx="4" fill="${pri}"/>
      <rect x="54" y="162" width="42" height="118" rx="4" fill="${sec || pri}"/>
      <rect x="104" y="162" width="42" height="118" rx="4" fill="${sec || pri}"/>
      <text x="100" y="100" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="16" fill="${txt}" opacity="0.6">${lbl}</text>
    </svg>`;

  if (cat === 'tank_top') return `
    <svg class="tee-svg" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
      <path d="M72 32 Q82 8 100 6 Q118 8 128 32 L152 32 L152 230 L48 230 L48 32 Z" fill="${pri}"/>
      <path d="M48 32 Q58 22 72 32" fill="none" stroke="${sec}" stroke-width="3"/>
      <path d="M128 32 Q142 22 152 32" fill="none" stroke="${sec}" stroke-width="3"/>
      <text x="100" y="140" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="15" fill="${txt}" opacity="0.75">${lbl}</text>
    </svg>`;

  // tee variants
  const isRaglan = p.id === 'tee-003' || p.id === 'tee-004';
  const isHockey = p.id === 'tee-001' || p.id === 'tee-002';
  const isVarsity = p.id === 'tee-005';

  if (isHockey) return `
    <svg class="tee-svg" viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 72 L28 125 L52 130 L52 228 L188 228 L188 130 L212 125 L180 72 L155 92 Q140 52 120 50 Q100 52 85 92 Z" fill="${pri}"/>
      <path d="M60 72 L28 125 L52 130 L52 180 L85 92 Z" fill="${sec}" opacity="0.35"/>
      <path d="M180 72 L212 125 L188 130 L188 180 L155 92 Z" fill="${sec}" opacity="0.35"/>
      <path d="M85 92 Q100 76 120 74 Q140 76 155 92" fill="none" stroke="${sec}" stroke-width="5" stroke-linecap="round"/>
      <text x="120" y="165" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="20" fill="${txt}" letter-spacing="2">${lbl}</text>
    </svg>`;

  if (isVarsity) return `
    <svg class="tee-svg" viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 70 L28 122 L52 128 L52 230 L188 230 L188 128 L212 122 L180 70 L156 82 Q140 50 120 48 Q100 50 84 82 Z" fill="${pri}"/>
      <rect x="52" y="70" width="18" height="90" fill="${sec}" opacity="0.8"/>
      <rect x="170" y="70" width="18" height="90" fill="${sec}" opacity="0.8"/>
      <text x="120" y="148" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="18" fill="${txt}" letter-spacing="1">${lbl}</text>
    </svg>`;

  return `
    <svg class="tee-svg" viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 70 L28 122 L52 128 L52 230 L188 230 L188 128 L212 122 L180 70 L156 82 Q140 50 120 48 Q100 50 84 82 Z" fill="${pri}"/>
      <path d="M60 70 L28 122 L52 128 L52 185 L84 82 Z" fill="${isRaglan ? sec : pri}" opacity="${isRaglan ? 0.65 : 1}"/>
      <path d="M180 70 L212 122 L188 128 L188 185 L156 82 Z" fill="${isRaglan ? sec : pri}" opacity="${isRaglan ? 0.65 : 1}"/>
      <ellipse cx="120" cy="65" rx="28" ry="14" fill="${sec}" opacity="0.4"/>
      <ellipse cx="120" cy="65" rx="20" ry="10" fill="${pri}"/>
      <text x="120" y="158" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="17" fill="${txt}" opacity="0.85" letter-spacing="1">${lbl}</text>
    </svg>`;
}

// Returns the markup for a product's primary visual: a real photo if one has
// been uploaded into product.images, otherwise the generated SVG fallback.
function productVisual(p) {
  if (p.images && p.images.length) {
    return `<img src="${p.images[0]}" alt="${p.name}">`;
  }
  return teeSVG(p);
}

// ══ TICKER ══════════════════════════════════════════════════════════════════════
function buildTicker() {
  const items = ['be.oxide','✦ OneTon Collection','✦ Pre-Order Open','✦ Made in India','✦ Limited Drop','✦ One Who Rules','✦ SS2026','✦ Free Delivery Above ₹1999','✦ be.oxide'];
  const html = [...items, ...items].map(i => `<span class="ticker-item">${i}</span>`).join('');
  document.getElementById('ticker').innerHTML = html;
}

// ══ HERO SLIDESHOW ══════════════════════════════════════════════════════════════
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('slideDots');
  if (!slides.length || !dotsWrap) return;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = `slide-dot${i === 0 ? ' active' : ''}`;
    d.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(d);
  });

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dotsWrap.children[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotsWrap.children[currentSlide].classList.add('active');
  }

  document.getElementById('slidePrev').addEventListener('click', () => { goToSlide(currentSlide - 1); resetTimer(); });
  document.getElementById('slideNext').addEventListener('click', () => { goToSlide(currentSlide + 1); resetTimer(); });

  function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  resetTimer();
}

// ══ COLLECTIONS ══════════════════════════════════════════════════════════════════
function buildCollections() {
  const grid = document.getElementById('collectionGrid');
  grid.innerHTML = COLLECTIONS.map(col => `
    <div class="collection-card${activeCollection === col.id ? ' active' : ''}" data-col="${col.id}">
      <div>
        <div class="collection-name">${col.name}</div>
        <div class="collection-meta">${col.tagline} · ${col.productCount} pieces</div>
      </div>
      <div class="collection-badge">${col.badge}</div>
    </div>`).join('');

  grid.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
      activeCollection = card.dataset.col;
      buildCollections();
      buildProducts();
      document.getElementById('drop').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ══ PRODUCTS ══════════════════════════════════════════════════════════════════════
function buildProducts() {
  const row = document.getElementById('productRow');
  const items = PRODUCTS.filter(p => p.collection === activeCollection && p.category === activeCat);

  if (!items.length) {
    row.innerHTML = '<div style="padding:3rem 2rem;color:var(--muted);font-family:var(--font-u);font-size:0.9rem">No products in this category yet</div>';
    return;
  }

  const comingSoon = isComingSoonCategory(activeCat);

  row.innerHTML = items.map(p => {
    const off = pct(p.price, p.mrp);
    return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">
        <div class="product-placeholder">${productVisual(p)}</div>
        <div class="badge-wrap">
          ${comingSoon ? '<span class="badge badge-preorder">Coming Soon</span>' : `<span class="badge badge-sale">Save ${off}%</span>`}
          ${p.isNew ? '<span class="badge badge-new">New</span>' : ''}
          ${comingSoon ? '' : '<span class="badge badge-preorder">Pre-Order</span>'}
        </div>
      </div>
      <div class="product-info">
        <div class="product-stars">★★★★★</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-colors">
          ${p.colors.map(c => `<div class="color-dot" style="background:${c}"></div>`).join('')}
        </div>
        ${comingSoon ? '' : `
        <div class="product-pricing">
          <span class="price-sale">${fmt(p.price)}</span>
          <span class="price-original">${fmt(p.mrp)}</span>
          <span class="price-off">${off}% off</span>
        </div>`}
      </div>
      ${comingSoon
        ? `<button class="quick-add" data-id="${p.id}" disabled style="opacity:0.6;cursor:default">Coming Soon</button>`
        : `<button class="quick-add" data-id="${p.id}">+ Pre-Order</button>`}
    </div>`;
  }).join('');

  // Card click → product detail / quick-view modal (image gallery + description)
  row.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.quick-add')) return;
      openDetailModal(card.dataset.id);
    });
  });

  // Quick-add button → straight to the pre-order modal with size/qty form
  // (skipped entirely for "coming soon" categories — jogger / tank_top)
  row.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (btn.disabled) return;
      openModal(btn.dataset.id);
    });
  });
}

// ══ CATEGORY PILLS ════════════════════════════════════════════════════════════
function initPills() {
  document.getElementById('categoryPills').querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCat = pill.dataset.cat;
      buildProducts();
    });
  });
}

// ══ ROW SCROLL ARROWS ══════════════════════════════════════════════════════════
function initRowArrows() {
  const row = document.getElementById('productRow');
  document.getElementById('rowPrev').addEventListener('click', () => {
    row.scrollBy({ left: -560, behavior: 'smooth' });
  });
  document.getElementById('rowNext').addEventListener('click', () => {
    row.scrollBy({ left: 560, behavior: 'smooth' });
  });
}

// ══ SEARCH ═════════════════════════════════════════════════════════════════════
function initSearch() {
  const bar = document.getElementById('searchBar');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  document.getElementById('searchToggle').addEventListener('click', () => {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) input.focus();
    else { input.value = ''; results.innerHTML = ''; }
  });
  document.getElementById('searchClose').addEventListener('click', () => {
    bar.classList.remove('open');
    input.value = ''; results.innerHTML = '';
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    results.innerHTML = matches.length
      ? matches.slice(0, 6).map(p => `
          <div class="search-result-item" data-id="${p.id}">
            ${p.name} <span style="color:var(--accent);font-size:0.65rem;margin-left:0.35rem">${isComingSoonCategory(p.category) ? 'Coming Soon' : fmt(p.price)}</span>
          </div>`).join('')
      : '<div style="color:var(--muted);font-size:0.8rem;padding:0.25rem 0">No results found</div>';

    results.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        activeCollection = 'oneton';
        const p = PRODUCTS.find(x => x.id === item.dataset.id);
        activeCat = p.category;
        document.querySelectorAll('.pill').forEach(pill => {
          pill.classList.toggle('active', pill.dataset.cat === activeCat);
        });
        buildCollections(); buildProducts();
        bar.classList.remove('open');
        input.value = ''; results.innerHTML = '';
        document.getElementById('drop').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => openDetailModal(p.id), 400);
      });
    });
  });
}

// ══ MENU DRAWER ════════════════════════════════════════════════════════════════
function initDrawer() {
  const drawer = document.getElementById('menuDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const ham = document.getElementById('hamburgerBtn');

  const openDrawer = () => { drawer.classList.add('open'); overlay.classList.add('open'); ham.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); ham.classList.remove('open'); document.body.style.overflow = ''; };

  ham.addEventListener('click', () => drawer.classList.contains('open') ? close() : openDrawer());
  overlay.addEventListener('click', close);
  document.getElementById('drawerClose').addEventListener('click', close);

  drawer.querySelectorAll('.drawer-cat').forEach(link => {
    link.addEventListener('click', () => {
      const cat = link.dataset.cat;
      activeCat = cat;
      activeCollection = 'oneton';
      document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.cat === cat));
      buildCollections(); buildProducts();
      close();
    });
  });

  drawer.querySelectorAll('[data-close]').forEach(a => {
    if (!a.classList.contains('drawer-cat')) a.addEventListener('click', close);
  });
}

// ══ CART ════════════════════════════════════════════════════════════════════════
function addToCart(product, size, qty = 1) {
  const existing = cart.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 5);
  } else {
    cart.push({ ...product, size, qty });
  }
  renderCart();
  toast(`${product.name} (${size}) added to cart`);
}

function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  renderCart();
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const count = cart.reduce((a, i) => a + i.qty, 0);
  document.getElementById('cartCount').textContent = count;

  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
      <p>Your cart is empty</p>
      <button class="btn-primary" onclick="closeCart();document.getElementById('drop').scrollIntoView({behavior:'smooth'})">Browse Drop</button>
    </div>`;
    footer.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${productVisual(item)}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Size: ${item.size} · Qty: ${item.qty}</div>
        <div class="cart-item-price">${fmt(item.price * item.qty)}</div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}" data-size="${item.size}">✕</button>
    </div>`).join('');

  body.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id, btn.dataset.size));
  });

  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = fmt(total);
  footer.style.display = 'block';
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function checkoutCart() {
  if (!cart.length) return;
  const names = cart.map(i => `${i.name} (${i.size} ×${i.qty})`).join(', ');
  toast(`Pre-order confirmed: ${names}. We'll reach out shortly!`);
  cart = [];
  renderCart();
  closeCart();
}

function initCart() {
  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
}

// ══ PRODUCT DETAIL / QUICK-VIEW MODAL ═══════════════════════════════════════════
// Opens a separate interface (gallery of images + full description + specs)
// for the clicked product, with a button to jump into the pre-order flow.
function openDetailModal(id) {
  detailProduct = PRODUCTS.find(p => p.id === id);
  if (!detailProduct) return;
  detailActiveImgIndex = 0;

  const p = detailProduct;
  const comingSoon = isComingSoonCategory(p.category);
  const off = pct(p.price, p.mrp);

  document.getElementById('detailTitle').textContent = p.name;

  document.getElementById('detailBadges').innerHTML = comingSoon
    ? `<span class="badge badge-preorder">Coming Soon</span>${p.isNew ? '<span class="badge badge-new">New</span>' : ''}`
    : `<span class="badge badge-sale">Save ${off}%</span>
       ${p.isNew ? '<span class="badge badge-new">New</span>' : ''}
       <span class="badge badge-preorder">Pre-Order</span>`;

  document.getElementById('detailPricing').innerHTML = comingSoon
    ? ''
    : `<span class="price-sale">${fmt(p.price)}</span>
       <span class="price-original">${fmt(p.mrp)}</span>
       <span class="price-off">${off}% off</span>`;

  document.getElementById('detailDesc').textContent = p.longDesc || p.desc;

  document.getElementById('detailMeta').innerHTML = `
    <div><strong>Fabric:</strong> ${p.fabric || '—'}</div>
    <div><strong>Fit:</strong> ${p.fit || '—'}</div>
    <div><strong>Care:</strong> ${p.care || '—'}</div>
    <div><strong>Sizes:</strong> ${p.sizes.join(', ')}</div>
    <div><strong>Colour:</strong> ${p.colorLabel}</div>`;

  renderDetailGallery();

  const preorderBtn = document.getElementById('detailPreorderBtn');
  if (comingSoon) {
    preorderBtn.textContent = 'Coming Soon';
    preorderBtn.disabled = true;
    preorderBtn.style.opacity = '0.6';
    preorderBtn.style.cursor = 'default';
    preorderBtn.onclick = null;
  } else {
    preorderBtn.textContent = 'Pre-Order Now';
    preorderBtn.disabled = false;
    preorderBtn.style.opacity = '';
    preorderBtn.style.cursor = '';
    preorderBtn.onclick = () => {
      closeDetailModal();
      openModal(p.id);
    };
  }

  document.getElementById('detailOverlay').classList.add('open');
  document.getElementById('detailModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderDetailGallery() {
  const p = detailProduct;
  if (!p) return;
  const hasPhotos = p.images && p.images.length;
  const mainImg = document.getElementById('detailMainImg');
  const thumbs = document.getElementById('detailThumbs');

  if (hasPhotos) {
    mainImg.innerHTML = `<img src="${p.images[detailActiveImgIndex]}" alt="${p.name}">`;
    thumbs.innerHTML = p.images.map((src, i) => `
      <div class="detail-thumb${i === detailActiveImgIndex ? ' active' : ''}" data-i="${i}">
        <img src="${src}" alt="${p.name} ${i + 1}">
      </div>`).join('');
    thumbs.querySelectorAll('.detail-thumb').forEach(t => {
      t.addEventListener('click', () => {
        detailActiveImgIndex = parseInt(t.dataset.i, 10);
        renderDetailGallery();
      });
    });
  } else {
    // No real photos uploaded yet for this product — fall back to the
    // generated illustration so the layout never breaks.
    mainImg.innerHTML = teeSVG(p);
    thumbs.innerHTML = '';
  }
}

function closeDetailModal() {
  document.getElementById('detailOverlay').classList.remove('open');
  document.getElementById('detailModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ══ PRE-ORDER MODAL ════════════════════════════════════════════════════════════
function openModal(id) {
  preorderProduct = PRODUCTS.find(p => p.id === id);
  if (!preorderProduct) return;
  if (isComingSoonCategory(preorderProduct.category)) return;

  // Reset form FIRST before repopulating — prevents stale selectedSize state
  document.getElementById('preorderForm').reset();

  document.getElementById('modalProduct').innerHTML = `
    <div class="modal-product-name">${preorderProduct.name}</div>
    <div class="modal-product-price">${fmt(preorderProduct.price)} <span style="font-family:var(--font-b);font-size:0.8rem;color:var(--muted);text-decoration:line-through">${fmt(preorderProduct.mrp)}</span></div>`;

  const sizeWrap = document.getElementById('sizeOptions');
  sizeWrap.innerHTML = preorderProduct.sizes.map(s =>
    `<button type="button" class="size-btn" data-size="${s}">${s}</button>`).join('');

  // Explicitly clear hidden size input after form reset
  document.getElementById('selectedSize').value = '';

  sizeWrap.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sizeWrap.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('selectedSize').value = btn.dataset.size;
      updateModalTotal();
    });
  });

  document.getElementById('qtyInput').value = 1;
  updateModalTotal();

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('preorderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateModalTotal() {
  const qty = parseInt(document.getElementById('qtyInput').value) || 1;
  if (!preorderProduct) return;
  document.getElementById('modalTotal').innerHTML = `
    <span>Order Total (${qty} item${qty > 1 ? 's' : ''})</span>
    <span>${fmt(preorderProduct.price * qty)}</span>`;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('preorderModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ══ REVIEWS ══════════════════════════════════════════════════════════════════════
function buildReviews() {
  document.getElementById('reviewsRow').innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-author">${r.name}</div>
      <div class="review-product">${r.product}</div>
    </div>`).join('');
}

// ══ NAV SCROLL SHRINK ══════════════════════════════════════════════════════════
function initNavScroll() {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const nav = document.getElementById('mainNav');
    if (y > 80) {
      nav.style.top = '0';
      document.querySelector('.ticker-wrap').style.transform = `translateY(-${Math.min(y, 34)}px)`;
    } else {
      nav.style.top = `${34 - y}px`;
      document.querySelector('.ticker-wrap').style.transform = '';
    }
  }, { passive: true });
}

// ══ INIT ════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1100);

  buildTicker();
  initSlider();
  buildCollections();
  buildProducts();
  initPills();
  initRowArrows();
  initSearch();
  initDrawer();
  initCart();
  buildReviews();
  initNavScroll();

  // Modal close via event delegation so it always works regardless of
  // DOM timing or re-renders.
  document.addEventListener('click', e => {
    if (e.target.closest('#modalClose')) closeModal();
    if (e.target.closest('#detailClose')) closeDetailModal();
  });
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
  document.getElementById('detailOverlay').addEventListener('click', closeDetailModal);

  // Qty buttons
  document.getElementById('qtyMinus').addEventListener('click', () => {
    const inp = document.getElementById('qtyInput');
    inp.value = Math.max(1, parseInt(inp.value) - 1);
    updateModalTotal();
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    const inp = document.getElementById('qtyInput');
    inp.value = Math.min(5, parseInt(inp.value) + 1);
    updateModalTotal();
  });
  document.getElementById('qtyInput').addEventListener('input', updateModalTotal);

  // Form submit → collect size + qty → add to cart
  document.getElementById('preorderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if (!data.size) { toast('Please select a size', 'error'); return; }

    const btn = e.target.querySelector('button[type=submit]');
    btn.textContent = 'Adding…'; btn.disabled = true;
    await new Promise(r => setTimeout(r, 700));
    btn.textContent = 'Confirm Pre-Order'; btn.disabled = false;

    addToCart(preorderProduct, data.size, parseInt(data.quantity) || 1);
    closeModal();
    openCart();
  });

  // Drawer category quick-links also update pills
  document.querySelectorAll('.drawer-cat').forEach(link => {
    const cat = link.dataset.cat;
    link.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.cat === cat));
    });
  });
});