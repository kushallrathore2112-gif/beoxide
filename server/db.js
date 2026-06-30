const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'beoxide.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'archived')),
      drop_date TEXT,
      hero_tagline TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('tee', 'jogger', 'tank_top')),
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      original_price REAL,
      badge TEXT DEFAULT '',
      color TEXT DEFAULT '#1a1a1a',
      icon TEXT DEFAULT '',
      sizes TEXT NOT NULL DEFAULT '["S","M","L","XL"]',
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pre_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      size TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled', 'fulfilled')),
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
    CREATE INDEX IF NOT EXISTS idx_preorders_product ON pre_orders(product_id);
    CREATE INDEX IF NOT EXISTS idx_preorders_status ON pre_orders(status);
  `);

  migrateDb();
}

function migrateDb() {
  const columns = db.prepare('PRAGMA table_info(collections)').all().map((c) => c.name);
  if (!columns.includes('show_coming_soon')) {
    db.exec('ALTER TABLE collections ADD COLUMN show_coming_soon INTEGER NOT NULL DEFAULT 0');
  }
  syncAdminUser();
}

function seedDb() {
  const collectionCount = db.prepare('SELECT COUNT(*) AS c FROM collections').get().c;
  if (collectionCount > 0) return;

  const insertCollection = db.prepare(`
    INSERT INTO collections (name, slug, description, status, drop_date, hero_tagline, show_coming_soon)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const vol1 = insertCollection.run(
    'Vol. 01 — Core Oxide',
    'vol-01-core-oxide',
    'The pieces that started it all. Raw silhouettes. Industrial finishes.',
    'active',
    '2026-03-15',
    'Coming Soon',
    1
  );

  const vol2 = insertCollection.run(
    'Vol. 02 — Rust Protocol',
    'vol-02-rust-protocol',
    'Earth tones meet street edge. Limited pre-order window.',
    'draft',
    '2026-06-01',
    'Coming Soon',
    1
  );

  const insertProduct = db.prepare(`
    INSERT INTO products (collection_id, category, name, description, price, original_price, badge, color, icon, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const vol1Products = [
    ['tee', 'Oxide Core Oversized Tee', '240 GSM heavyweight cotton. Drop shoulder fit.', 999, 1299, 'New', '#1a1a1a', '⬛', 1],
    ['tee', 'Rust Standard Tee', 'Mineral-washed finish. Boxy cut.', 899, 1199, 'Drop', '#2a1a0a', '🟫', 2],
    ['tee', 'Carbon Relaxed Tee', 'Brushed interior. Raw hem detail.', 1099, 1399, '', '#1c1c1c', '⬜', 3],
    ['jogger', 'Carbon Wide-Leg Jogger', 'Tapered ankle. Heavy fleece lining.', 1299, 1699, 'Hot', '#1c1c1c', '⬜', 1],
    ['jogger', 'Raw Edge Track Pant', 'Elastic waist. Side stripe detail.', 1199, 1499, 'New', '#0d0d0d', '⬛', 2],
    ['jogger', 'Industrial Cargo Jogger', 'Multi-pocket. Structured silhouette.', 1499, 1899, '', '#141414', '🟫', 3],
    ['tank_top', 'Oxide Logo Crop Tank', 'Ribbed cotton. Scoop neck.', 599, 799, '', '#1a0505', '🟥', 1],
    ['tank_top', 'Steel Muscle Tank', 'Deep armhole. Raw edge finish.', 649, 849, 'New', '#111111', '🩶', 2],
    ['tank_top', 'Acid Wash Tank', 'Vintage wash. Relaxed fit.', 699, 899, 'Drop', '#1a0e05', '🔶', 3],
  ];

  for (const p of vol1Products) {
    insertProduct.run(vol1.lastInsertRowid, ...p);
  }

  const vol2Products = [
    ['tee', 'Rust Protocol Tee', 'Coming in Vol. 02.', 999, 1299, 'Soon', '#2a1508', '🟤', 1],
    ['jogger', 'Protocol Jogger', 'Coming in Vol. 02.', 1399, 1799, 'Soon', '#1a1008', '🟫', 1],
    ['tank_top', 'Protocol Tank', 'Coming in Vol. 02.', 649, 849, 'Soon', '#150a05', '🟧', 1],
  ];

  for (const p of vol2Products) {
    insertProduct.run(vol2.lastInsertRowid, ...p);
  }

  const adminCount = db.prepare('SELECT COUNT(*) AS c FROM admin_users').get().c;
  if (adminCount === 0) {
    syncAdminUser();
  }
}

function syncAdminUser() {
  const username = process.env.ADMIN_USERNAME || 'kushal.kabeer';
  const password = process.env.ADMIN_PASSWORD || 'wegotthis';
  const hash = bcrypt.hashSync(password, 10);
  const existing = db.prepare('SELECT id FROM admin_users ORDER BY id LIMIT 1').get();

  if (existing) {
    db.prepare('UPDATE admin_users SET username = ?, password_hash = ? WHERE id = ?').run(
      username,
      hash,
      existing.id
    );
  } else {
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hash);
  }
}

function parseProduct(row) {
  if (!row) return null;
  return {
    ...row,
    sizes: JSON.parse(row.sizes),
    active: Boolean(row.active),
  };
}

function parseCollection(row) {
  if (!row) return null;
  return { ...row, show_coming_soon: Boolean(row.show_coming_soon) };
}

module.exports = { db, initDb, seedDb, syncAdminUser, parseProduct, parseCollection };
