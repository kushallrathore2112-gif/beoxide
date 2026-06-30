const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.adminId = user.id;
  req.session.adminUsername = user.username;
  res.json({ success: true, username: user.username });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json({ id: req.session.adminId, username: req.session.adminUsername });
});

router.get('/dashboard', requireAdmin, (req, res) => {
  const collections = db.prepare('SELECT COUNT(*) AS c FROM collections').get().c;
  const products = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  const preOrders = db
    .prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending
       FROM pre_orders`
    )
    .get();

  const recentOrders = db
    .prepare(
      `SELECT po.*, p.name AS product_name, c.name AS collection_name
       FROM pre_orders po
       JOIN products p ON p.id = po.product_id
       JOIN collections c ON c.id = p.collection_id
       ORDER BY po.created_at DESC LIMIT 5`
    )
    .all();

  res.json({
    collections,
    products,
    preOrders,
    recentOrders,
  });
});

module.exports = router;
