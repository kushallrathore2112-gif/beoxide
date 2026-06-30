const express = require('express');
const { db } = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAdmin, (req, res) => {
  const { status, collection_id } = req.query;
  let sql = `
    SELECT po.*,
           p.name AS product_name, p.category, p.price,
           c.name AS collection_name, c.slug AS collection_slug
    FROM pre_orders po
    JOIN products p ON p.id = po.product_id
    JOIN collections c ON c.id = p.collection_id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    sql += ' AND po.status = ?';
    params.push(status);
  }
  if (collection_id) {
    sql += ' AND p.collection_id = ?';
    params.push(collection_id);
  }

  sql += ' ORDER BY po.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/stats', requireAdmin, (req, res) => {
  const stats = db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
         SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
         SUM(CASE WHEN status = 'fulfilled' THEN 1 ELSE 0 END) AS fulfilled,
         SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
         SUM(quantity * (SELECT price FROM products WHERE id = product_id)) AS revenue
       FROM pre_orders`
    )
    .get();
  res.json(stats);
});

router.post('/', (req, res) => {
  const { product_id, customer_name, email, phone, size, quantity, notes } = req.body;

  if (!product_id || !customer_name || !email || !phone || !size) {
    return res.status(400).json({ error: 'product_id, customer_name, email, phone, and size are required' });
  }

  const product = db
    .prepare(
      `SELECT p.*, c.status AS collection_status
       FROM products p JOIN collections c ON c.id = p.collection_id
       WHERE p.id = ? AND p.active = 1`
    )
    .get(product_id);

  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (product.collection_status !== 'active') {
    return res.status(400).json({ error: 'This collection is not open for pre-orders yet' });
  }

  const sizes = JSON.parse(product.sizes);
  if (!sizes.includes(size)) {
    return res.status(400).json({ error: 'Invalid size selected' });
  }

  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  const result = db
    .prepare(
      `INSERT INTO pre_orders (product_id, customer_name, email, phone, size, quantity, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(product_id, customer_name.trim(), email.trim().toLowerCase(), phone.trim(), size, qty, notes || '');

  const order = db.prepare('SELECT * FROM pre_orders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    ...order,
    product_name: product.name,
    price: product.price,
    total: product.price * qty,
  });
});

router.patch('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM pre_orders WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Pre-order not found' });

  const { status, notes } = req.body;
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'fulfilled'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.prepare(`UPDATE pre_orders SET status = ?, notes = ? WHERE id = ?`).run(
    status ?? existing.status,
    notes !== undefined ? notes : existing.notes,
    req.params.id
  );

  res.json(db.prepare('SELECT * FROM pre_orders WHERE id = ?').get(req.params.id));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM pre_orders WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Pre-order not found' });
  res.json({ success: true });
});

module.exports = router;
