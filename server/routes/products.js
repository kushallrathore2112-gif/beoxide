const express = require('express');
const { db, parseProduct } = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { collection_id, category } = req.query;
  let sql = 'SELECT p.*, c.name AS collection_name, c.slug AS collection_slug FROM products p JOIN collections c ON c.id = p.collection_id WHERE 1=1';
  const params = [];

  if (collection_id) {
    sql += ' AND p.collection_id = ?';
    params.push(collection_id);
  }
  if (category) {
    sql += ' AND p.category = ?';
    params.push(category);
  }

  sql += ' ORDER BY p.collection_id, p.category, p.sort_order';
  const rows = db.prepare(sql).all(...params).map(parseProduct);
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db
    .prepare(
      `SELECT p.*, c.name AS collection_name, c.slug AS collection_slug
       FROM products p JOIN collections c ON c.id = p.collection_id WHERE p.id = ?`
    )
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(parseProduct(row));
});

router.post('/', requireAdmin, (req, res) => {
  const {
    collection_id,
    category,
    name,
    description,
    price,
    original_price,
    badge,
    color,
    icon,
    sizes,
    active,
    sort_order,
  } = req.body;

  if (!collection_id || !category || !name || price == null) {
    return res.status(400).json({ error: 'collection_id, category, name, and price are required' });
  }

  if (!['tee', 'jogger', 'tank_top'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const result = db
    .prepare(
      `INSERT INTO products
       (collection_id, category, name, description, price, original_price, badge, color, icon, sizes, active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      collection_id,
      category,
      name,
      description || '',
      price,
      original_price || null,
      badge || '',
      color || '#1a1a1a',
      icon || '',
      JSON.stringify(sizes || ['S', 'M', 'L', 'XL']),
      active !== false ? 1 : 0,
      sort_order || 0
    );

  res.status(201).json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)));
});

router.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const {
    collection_id,
    category,
    name,
    description,
    price,
    original_price,
    badge,
    color,
    icon,
    sizes,
    active,
    sort_order,
  } = req.body;

  db.prepare(
    `UPDATE products SET
      collection_id = ?, category = ?, name = ?, description = ?,
      price = ?, original_price = ?, badge = ?, color = ?, icon = ?,
      sizes = ?, active = ?, sort_order = ?
     WHERE id = ?`
  ).run(
    collection_id ?? existing.collection_id,
    category ?? existing.category,
    name ?? existing.name,
    description ?? existing.description,
    price ?? existing.price,
    original_price !== undefined ? original_price : existing.original_price,
    badge ?? existing.badge,
    color ?? existing.color,
    icon ?? existing.icon,
    sizes ? JSON.stringify(sizes) : existing.sizes,
    active !== undefined ? (active ? 1 : 0) : existing.active,
    sort_order ?? existing.sort_order,
    req.params.id
  );

  res.json(parseProduct(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

module.exports = router;
