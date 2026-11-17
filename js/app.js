/**
 * PlayBeat Digital - Core Application Engine
 * Domain: playbeat.digital
 */

const AppState = {
  currentCurrency: 'EUR',
  currencySymbols: { EUR: '€', USD: '$', GBP: '£' },
  vipActive: false,
  cart: JSON.parse(localStorage.getItem('playbeat_cart') || '[]'),
  catalog: []
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('playbeat_products.json');
    AppState.catalog = await res.json();
  } catch (e) {
    console.warn('Catalog loaded locally.');
  }

  setupEventListeners();
  updateCartUI();
});

function setupEventListeners() {
  // Currency Switcher
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      AppState.currentCurrency = e.target.value;
      updateCurrencyDisplay();
      updateCartUI();
    });
  }

  // Cart Drawer open/close
  const btnCartToggle = document.getElementById('btn-cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const btnCartClose = document.getElementById('btn-cart-close');

  if (btnCartToggle) {
    btnCartToggle.addEventListener('click', () => {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
    });
  }

  const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  };

  if (btnCartClose) btnCartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Search filter
  const searchInput = document.getElementById('main-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.k4g-card, .sub-card, .software-card').forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) || !q ? '' : 'none';
      });
    });
  }

  // Checkout Button
  const btnCheckout = document.getElementById('btn-checkout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (AppState.cart.length === 0) {
        alert('Your cart is currently empty! Please add a product.');
        return;
      }
      openCheckoutModal();
    });
  }

  // Modal Close
  const modalOverlay = document.getElementById('product-modal-overlay');
  const modalClose = document.getElementById('btn-modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
  }
}

// Update all prices across DOM
function updateCurrencyDisplay() {
  const sym = AppState.currencySymbols[AppState.currentCurrency];
  const curKey = AppState.currentCurrency.toLowerCase(); // 'eur', 'usd', 'gbp'

  document.querySelectorAll('[data-eur]').forEach((el) => {
    let base = parseFloat(el.getAttribute(`data-${curKey}`) || el.getAttribute('data-eur'));
    if (AppState.vipActive) base *= 0.95;
    el.textContent = `${sym}${base.toFixed(2)}`;
  });
}

window.toggleVIP = function () {
  AppState.vipActive = !AppState.vipActive;
  alert(
    AppState.vipActive
      ? '★ PlayBeat VIP Activated! You are saving an extra 5% on all game keys and software.'
      : 'PlayBeat VIP Deactivated.'
  );
  updateCurrencyDisplay();
  updateCartUI();
};

window.filterByPrice = function (maxPrice) {
  alert(`Filtering products up to €${maxPrice}. Check the cheap games and software sections!`);
  const el = document.getElementById('bestsellers');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// Cart Logic
window.addToCart = function (productId) {
  let product = AppState.catalog.find((p) => p.id === productId);
  if (!product) {
    product = {
      id: productId,
      title: 'Digital Key Activation Code',
      cover: 'https://cdn.k4g.com/files/cover/5ffde97535570a5490b987868c86495e.jpg',
      price_eur: 14.50,
      price_usd: 16.20,
      price_gbp: 12.70
    };
  }

  const existing = AppState.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      id: product.id,
      title: product.title,
      cover: product.cover,
      price_eur: product.price_eur,
      price_usd: product.price_usd,
      price_gbp: product.price_gbp,
      quantity: 1
    });
  }

  localStorage.setItem('playbeat_cart', JSON.stringify(AppState.cart));
  updateCartUI();

  // Open drawer
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-drawer-overlay').classList.add('open');
};

window.updateCartQty = function (productId, delta) {
  const item = AppState.cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    AppState.cart = AppState.cart.filter((i) => i.id !== productId);
  }

  localStorage.setItem('playbeat_cart', JSON.stringify(AppState.cart));
  updateCartUI();
};

function updateCartUI() {
  const list = document.getElementById('cart-items-list');
  const navBadge = document.getElementById('nav-cart-count');
  const sym = AppState.currencySymbols[AppState.currentCurrency];

  const totalQty = AppState.cart.reduce((sum, i) => sum + i.quantity, 0);
  if (navBadge) navBadge.textContent = totalQty;

  if (!list) return;

  if (AppState.cart.length === 0) {
    list.innerHTML = `
      <div style="text-align:center; padding:50px 10px; color:var(--text-muted);">
        <p>Your cart is empty.</p>
        <p style="font-size:0.8rem; margin-top:6px;">Add your favorite game or subscription!</p>
      </div>
    `;
    document.getElementById('cart-subtotal').textContent = `${sym}0.00`;
    document.getElementById('cart-discount').textContent = `-${sym}0.00`;
    document.getElementById('cart-total').textContent = `${sym}0.00`;
    return;
  }

  let subtotal = 0;
  list.innerHTML = AppState.cart
    .map((item) => {
      let price =
        AppState.currentCurrency === 'USD'
          ? item.price_usd
          : AppState.currentCurrency === 'GBP'
          ? item.price_gbp
          : item.price_eur;

      if (AppState.vipActive) price *= 0.95;
      const totalItemPrice = price * item.quantity;
      subtotal += totalItemPrice;

      return `
      <div style="display:flex; gap:12px; background:var(--bg-surface); padding:10px; border-radius:8px; border:1px solid var(--border-color);">
        <img src="${item.cover}" style="width:48px; height:64px; object-fit:cover; border-radius:4px;" />
        <div style="flex:1;">
          <div style="font-size:0.82rem; font-weight:700; color:#fff; line-height:1.2;">${item.title}</div>
          <div style="font-size:0.95rem; font-weight:800; color:var(--red-primary); margin-top:4px;">${sym}${totalItemPrice.toFixed(2)}</div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <button onclick="updateCartQty('${item.id}', -1)" style="background:#262d4a; color:#fff; width:22px; height:22px; border-radius:4px;">-</button>
            <span style="font-size:0.85rem; font-weight:700;">${item.quantity}</span>
            <button onclick="updateCartQty('${item.id}', 1)" style="background:#262d4a; color:#fff; width:22px; height:22px; border-radius:4px;">+</button>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  const discount = AppState.vipActive ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  document.getElementById('cart-subtotal').textContent = `${sym}${subtotal.toFixed(2)}`;
  document.getElementById('cart-discount').textContent = `-${sym}${discount.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `${sym}${total.toFixed(2)}`;
}

// Product Modal
window.openProductModal = function (productId) {
  let product = AppState.catalog.find((p) => p.id === productId);
  if (!product) {
    product = {
      id: productId,
      title: 'Digital Key Activation Code',
      cover: 'https://cdn.k4g.com/files/cover/5ffde97535570a5490b987868c86495e.jpg',
      price_eur: 14.50,
      retail_eur: 49.99,
      discount: 71,
      rating: 4.8,
      reviews: 1400,
      platform: 'Steam / PC',
      region: 'GLOBAL',
      description: 'Official digital activation key with 100% PlayBeat Protection Guarantee.'
    };
  }

  const modal = document.getElementById('product-modal-overlay');
  const content = document.getElementById('product-modal-content');
  const sym = AppState.currencySymbols[AppState.currentCurrency];

  content.innerHTML = `
    <div style="display:grid; grid-template-columns: 240px 1fr; gap:24px; padding:28px;">
      <img src="${product.cover}" style="width:100%; border-radius:10px; border:1px solid var(--border-color);" />
      <div>
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <span style="background:var(--green-badge); color:#000; font-weight:800; font-size:0.75rem; padding:2px 8px; border-radius:4px;">-${product.discount || 30}%</span>
          <span style="background:#1f253e; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:4px;">${product.platform || 'PC'}</span>
          <span style="color:var(--green-badge); font-size:0.75rem; font-weight:700;">● ${product.region || 'GLOBAL'}</span>
        </div>
        <h2 style="font-size:1.3rem; font-weight:800; line-height:1.2; margin-bottom:10px;">${product.title}</h2>
        <div style="color:var(--yellow-gold); font-size:0.85rem; margin-bottom:12px;">
          ★ ${product.rating || 4.9} / 5.0 (${product.reviews || 2400} reviews)
        </div>
        <p style="font-size:0.85rem; color:var(--text-gray); line-height:1.5; margin-bottom:18px;">
          ${product.description || 'Verified authentic digital CD key. Instant automatic delivery.'}
        </p>
        <div style="font-size:1.6rem; font-weight:900; color:#fff; margin-bottom:18px;">
          ${sym}${product.price_eur} <span style="font-size:0.85rem; color:var(--green-badge); font-weight:600;">(Instant Delivery)</span>
        </div>
        <button class="btn-sell-now" style="width:100%; justify-content:center; padding:12px; font-size:0.95rem;" onclick="addToCart('${product.id}'); document.getElementById('product-modal-overlay').classList.remove('open');">
          Add to Cart & Checkout
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
};

// Checkout & Instant Key Revealer
function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal-overlay');
  const content = document.getElementById('checkout-modal-content');
  const sym = AppState.currencySymbols[AppState.currentCurrency];

  content.innerHTML = `
    <div style="padding:28px;">
      <h3 style="font-size:1.4rem; font-weight:800; margin-bottom:6px;">Instant Checkout</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">100% PlayBeat Protection Guarantee • Instant Key Unlock</p>

      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:8px; padding:16px; margin-bottom:18px;">
        <label style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:8px;">Select Payment:</label>
        <div style="display:flex; gap:10px;">
          <label style="flex:1; border:1px solid var(--red-primary); padding:10px; border-radius:6px; text-align:center; font-weight:700; font-size:0.85rem; background:rgba(247,48,48,0.1); cursor:pointer;">
            <input type="radio" name="pay" checked /> Credit Card
          </label>
          <label style="flex:1; border:1px solid var(--border-color); padding:10px; border-radius:6px; text-align:center; font-weight:700; font-size:0.85rem; background:var(--bg-card); cursor:pointer;">
            <input type="radio" name="pay" /> PayPal
          </label>
          <label style="flex:1; border:1px solid var(--border-color); padding:10px; border-radius:6px; text-align:center; font-weight:700; font-size:0.85rem; background:var(--bg-card); cursor:pointer;">
            <input type="radio" name="pay" /> Binance Pay
          </label>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <label style="font-size:0.82rem; font-weight:700; display:block; margin-bottom:6px;">Delivery Email:</label>
        <input type="email" id="checkout-email" value="gamer@playbeat.digital" style="width:100%; padding:10px 14px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:6px; color:#fff;" />
      </div>

      <button class="btn-sell-now" style="width:100%; justify-content:center; padding:14px; font-size:1rem;" onclick="processInstantKeyDelivery()">
        Pay Now & Reveal Keys
      </button>
    </div>
  `;

  modal.classList.add('open');
}

function generateCDKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${seg()}-${seg()}-${seg()}-${seg()}`;
}

window.processInstantKeyDelivery = function () {
  const content = document.getElementById('checkout-modal-content');
  const email = document.getElementById('checkout-email').value || 'gamer@playbeat.digital';

  const keys = AppState.cart.map((i) => ({
    title: i.title,
    key: generateCDKey()
  }));

  content.innerHTML = `
    <div style="padding:32px; text-align:center;">
      <div style="width:50px; height:50px; background:rgba(16,185,129,0.15); border:2px solid var(--green-badge); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 14px;">
        <svg style="width:28px;height:28px;fill:var(--green-badge);" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
      <h3 style="font-size:1.4rem; font-weight:800; color:#fff;">Order Complete!</h3>
      <p style="font-size:0.85rem; color:var(--text-gray); margin-top:4px;">
        Keys sent to <strong>${email}</strong> & unlocked below:
      </p>

      <div style="margin:20px 0; text-align:left; max-height:240px; overflow-y:auto;">
        ${keys
          .map(
            (k) => `
          <div style="background:var(--bg-surface); padding:12px; border-radius:8px; border:1px solid var(--border-color); margin-bottom:10px;">
            <div style="font-size:0.8rem; font-weight:700; color:#fff; margin-bottom:4px;">${k.title}</div>
            <div style="font-family:monospace; font-size:1.15rem; font-weight:800; color:var(--cyan-accent); letter-spacing:1px; background:#080a14; padding:8px; border-radius:6px; border:1px dashed var(--cyan-accent); text-align:center;">
              ${k.key}
            </div>
            <button onclick="navigator.clipboard.writeText('${k.key}'); this.textContent='Copied!';" style="margin-top:6px; background:var(--cyan-accent); color:#000; font-size:0.75rem; font-weight:800; padding:4px 10px; border-radius:4px;">
              Copy Key
            </button>
          </div>
        `
          )
          .join('')}
      </div>

      <button class="btn-sell-now" style="width:100%; justify-content:center;" onclick="document.getElementById('checkout-modal-overlay').classList.remove('open'); AppState.cart=[]; localStorage.removeItem('playbeat_cart'); updateCartUI();">
        Done & Continue Shopping
      </button>
    </div>
  `;
};
