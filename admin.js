const API =
  window.location.hostname === 'localhost'
    ? window.location.port === '3200'
      ? '/api'
      : 'http://localhost:3200/api'
    : '/api';

let collections = [];
let products = [];
let preorders = [];

async function fetchJson(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (networkErr) {
    const err = new Error('Could not reach the server. Check your connection or that the API is running.');
    err.status = null;
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

function showToast(msg) {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function openModal(title, html) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

document.getElementById('modalOverlay').onclick = closeModal;

async function checkAuth() {
  try {
    await fetchJson(`${API}/admin/me`);
    showAdmin();
    return true;
  } catch {
    showLogin();
    return false;
  }
}

function showLogin() {
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('adminApp').classList.add('hidden');
  document.querySelector('#loginForm [name="username"]')?.focus();
}

function showAdmin() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('adminApp').classList.remove('hidden');
}

document.getElementById('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in…';

  try {
    await fetchJson(`${API}/admin/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });
    showAdmin();
    loadDashboard();
    showToast('Welcome back');
  } catch (err) {
    // Surface what actually happened instead of always saying
    // "Invalid credentials" — that message used to fire even when
    // the real problem was a wrong API URL, a downed server, or CORS.
    if (err.status === 401 || err.status === 400) {
      showToast('Invalid username or password');
    } else if (err.status) {
      showToast(`Login failed: ${err.message}`);
    } else {
      showToast(err.message);
    }
    form.password.value = '';
    form.password.focus();
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
};

document.getElementById('logoutBtn').onclick = async () => {
  try {
    await fetchJson(`${API}/admin/logout`, { method: 'POST' });
  } catch {
    // even if the request fails, drop the user back to the login screen
  }
  showLogin();
};

document.querySelectorAll('.sidebar-nav a[data-page]').forEach((link) => {
  link.onclick = () => {
    document.querySelectorAll('.sidebar-nav a').forEach((a) => a.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.page').forEach((p) => p.classList.add('hidden'));
    document.getElementById('page' + link.dataset.page.charAt(0).toUpperCase() + link.dataset.page.slice(1)).classList.remove('hidden');

    if (link.dataset.page === 'dashboard') loadDashboard();
    if (link.dataset.page === 'collections') loadCollections();
    if (link.dataset.page === 'products') loadProducts();
    if (link.dataset.page === 'preorders') loadPreorders();
  };
});

async function loadDashboard() {
  try {
    const data = await fetchJson(`${API}/admin/dashboard`);
    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card"><div class="stat-label">Collections</div><div class="stat-value">${data.collections}</div></div>
      <div class="stat-card"><div class="stat-label">Products</div><div class="stat-value">${data.products}</div></div>
      <div class="stat-card"><div class="stat-label">Pre-Orders</div><div class="stat-value">${data.preOrders.total}</div></div>
      <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value">${data.preOrders.pending}</div></div>`;

    const recent = data.recentOrders;
    document.getElementById('recentOrders').innerHTML = recent.length
      ? `<table><thead><tr><th>Customer</th><th>Product</th><th>Size</th><th>Status</th><th>Date</th></tr></thead><tbody>
        ${recent.map((o) => `<tr>
          <td>${o.customer_name}</td><td>${o.product_name}</td><td>${o.size}</td>
          <td><span class="badge badge-${o.status}">${o.status}</span></td>
          <td>${new Date(o.created_at).toLocaleDateString()}</td></tr>`).join('')}
        </tbody></table>`
      : '<div class="empty">No pre-orders yet</div>';
  } catch (err) {
    showToast(err.message || 'Failed to load dashboard');
  }
}

async function loadCollections() {
  try {
    collections = await fetchJson(`${API}/collections`);
    document.getElementById('collectionsTable').innerHTML = collections.length
      ? `<table><thead><tr><th>Name</th><th>Slug</th><th>Status</th><th>Drop Date</th><th>Actions</th></tr></thead><tbody>
        ${collections.map((c) => `<tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.slug}</td>
          <td><span class="badge badge-${c.status}">${c.status}</span></td>
          <td>${c.drop_date || '—'}</td>
          <td>
            <button class="btn btn-ghost btn-sm" onclick="editCollection(${c.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCollection(${c.id})">Delete</button>
          </td></tr>`).join('')}
        </tbody></table>`
      : '<div class="empty">No collections. Create your first drop.</div>';
  } catch (err) {
    showToast(err.message || 'Failed to load collections');
  }
}

function collectionFormHtml(c = {}) {
  return `
    <form id="collectionForm">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input class="form-input" name="name" value="${c.name || ''}" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Slug</label>
          <input class="form-input" name="slug" value="${c.slug || ''}" placeholder="auto-generated if empty">
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" name="status">
            <option value="draft" ${c.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="active" ${c.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="archived" ${c.status === 'archived' ? 'selected' : ''}>Archived</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Drop Date</label>
          <input class="form-input" type="date" name="drop_date" value="${c.drop_date || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Hero Tagline</label>
          <input class="form-input" name="hero_tagline" value="${c.hero_tagline || ''}" placeholder="First Drop">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" name="description">${c.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:0.5rem;text-transform:none;letter-spacing:0;">
          <input type="checkbox" name="show_coming_soon" ${c.show_coming_soon ? 'checked' : ''}>
          Show "Coming Soon" badge (pre-orders still work when status is active)
        </label>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      </div>
    </form>`;
}

function parseCollectionForm(form) {
  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());
  body.show_coming_soon = fd.has('show_coming_soon');
  return body;
}

function openCollectionModal() {
  openModal('New Collection', collectionFormHtml());
  document.getElementById('collectionForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchJson(`${API}/collections`, { method: 'POST', body: JSON.stringify(parseCollectionForm(e.target)) });
      closeModal();
      loadCollections();
      showToast('Collection created');
    } catch (err) {
      showToast(err.message);
    }
  };
}

function editCollection(id) {
  const c = collections.find((x) => x.id === id);
  if (!c) return;
  openModal('Edit Collection', collectionFormHtml(c));
  document.getElementById('collectionForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchJson(`${API}/collections/${id}`, { method: 'PUT', body: JSON.stringify(parseCollectionForm(e.target)) });
      closeModal();
      loadCollections();
      showToast('Collection updated');
    } catch (err) {
      showToast(err.message);
    }
  };
}

async function deleteCollection(id) {
  if (!confirm('Delete this collection and all its products?')) return;
  try {
    await fetchJson(`${API}/collections/${id}`, { method: 'DELETE' });
    loadCollections();
    showToast('Collection deleted');
  } catch (err) {
    showToast(err.message);
  }
}

async function loadProducts() {
  try {
    if (!collections.length) collections = await fetchJson(`${API}/collections`);
    products = await fetchJson(`${API}/products`);
    document.getElementById('productsTable').innerHTML = products.length
      ? `<table><thead><tr><th>Name</th><th>Collection</th><th>Category</th><th>Price</th><th>Active</th><th>Actions</th></tr></thead><tbody>
        ${products.map((p) => `<tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.collection_name}</td>
          <td>${p.category.replace('_', ' ')}</td>
          <td>₹${p.price.toLocaleString()}</td>
          <td>${p.active ? '✓' : '—'}</td>
          <td>
            <button class="btn btn-ghost btn-sm" onclick="editProduct(${p.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Delete</button>
          </td></tr>`).join('')}
        </tbody></table>`
      : '<div class="empty">No products yet.</div>';
  } catch (err) {
    showToast(err.message || 'Failed to load products');
  }
}

function productFormHtml(p = {}) {
  const collOptions = collections
    .map((c) => `<option value="${c.id}" ${p.collection_id === c.id ? 'selected' : ''}>${c.name}</option>`)
    .join('');
  return `
    <form id="productForm">
      <div class="form-group">
        <label class="form-label">Collection</label>
        <select class="form-select" name="collection_id" required>${collOptions}</select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" name="category" required>
            <option value="tee" ${p.category === 'tee' ? 'selected' : ''}>Tee</option>
            <option value="jogger" ${p.category === 'jogger' ? 'selected' : ''}>Jogger</option>
            <option value="tank_top" ${p.category === 'tank_top' ? 'selected' : ''}>Tank Top</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input class="form-input" name="name" value="${p.name || ''}" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" name="description">${p.description || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Price (₹)</label>
          <input class="form-input" type="number" name="price" value="${p.price || ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Original Price (₹)</label>
          <input class="form-input" type="number" name="original_price" value="${p.original_price || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Badge</label>
          <input class="form-input" name="badge" value="${p.badge || ''}" placeholder="New, Hot, etc.">
        </div>
        <div class="form-group">
          <label class="form-label">Icon (emoji)</label>
          <input class="form-input" name="icon" value="${p.icon || ''}" placeholder="⬛">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Color</label>
          <input class="form-input" name="color" value="${p.color || '#1a1a1a'}">
        </div>
        <div class="form-group">
          <label class="form-label">Sizes (comma separated)</label>
          <input class="form-input" name="sizes" value="${(p.sizes || ['S','M','L','XL']).join(', ')}" required>
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      </div>
    </form>`;
}

function parseProductForm(fd) {
  const body = Object.fromEntries(fd.entries());
  body.collection_id = parseInt(body.collection_id, 10);
  body.price = parseFloat(body.price);
  body.original_price = body.original_price ? parseFloat(body.original_price) : null;
  body.sizes = body.sizes.split(',').map((s) => s.trim()).filter(Boolean);
  return body;
}

function openProductModal() {
  openModal('New Product', productFormHtml());
  document.getElementById('productForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchJson(`${API}/products`, { method: 'POST', body: JSON.stringify(parseProductForm(new FormData(e.target))) });
      closeModal();
      loadProducts();
      showToast('Product created');
    } catch (err) {
      showToast(err.message);
    }
  };
}

function editProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  openModal('Edit Product', productFormHtml(p));
  document.getElementById('productForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchJson(`${API}/products/${id}`, { method: 'PUT', body: JSON.stringify(parseProductForm(new FormData(e.target))) });
      closeModal();
      loadProducts();
      showToast('Product updated');
    } catch (err) {
      showToast(err.message);
    }
  };
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try {
    await fetchJson(`${API}/products/${id}`, { method: 'DELETE' });
    loadProducts();
    showToast('Product deleted');
  } catch (err) {
    showToast(err.message);
  }
}

async function loadPreorders() {
  const status = document.getElementById('preorderFilter')?.value || '';
  const url = status ? `${API}/preorders?status=${status}` : `${API}/preorders`;
  try {
    preorders = await fetchJson(url);
    document.getElementById('preordersTable').innerHTML = preorders.length
      ? `<table><thead><tr><th>Customer</th><th>Product</th><th>Collection</th><th>Size</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        ${preorders.map((o) => `<tr>
          <td>${o.customer_name}<br><small style="color:var(--steel)">${o.email}</small></td>
          <td>${o.product_name}</td><td>${o.collection_name}</td>
          <td>${o.size}</td><td>${o.quantity}</td>
          <td><select class="form-select" style="width:auto;padding:0.3rem;" onchange="updatePreorderStatus(${o.id}, this.value)">
            ${['pending','confirmed','fulfilled','cancelled'].map((s) => `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
          </select></td>
          <td><button class="btn btn-danger btn-sm" onclick="deletePreorder(${o.id})">Delete</button></td></tr>`).join('')}
        </tbody></table>`
      : '<div class="empty">No pre-orders yet</div>';
  } catch (err) {
    showToast(err.message || 'Failed to load pre-orders');
  }
}

async function updatePreorderStatus(id, status) {
  try {
    await fetchJson(`${API}/preorders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    showToast('Status updated');
  } catch (err) {
    showToast(err.message);
  }
}

async function deletePreorder(id) {
  if (!confirm('Delete this pre-order?')) return;
  try {
    await fetchJson(`${API}/preorders/${id}`, { method: 'DELETE' });
    loadPreorders();
    showToast('Pre-order deleted');
  } catch (err) {
    showToast(err.message);
  }
}

window.openCollectionModal = openCollectionModal;
window.editCollection = editCollection;
window.deleteCollection = deleteCollection;
window.openProductModal = openProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updatePreorderStatus = updatePreorderStatus;
window.deletePreorder = deletePreorder;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', async () => {
  const authed = await checkAuth();
  if (authed) loadDashboard();
});