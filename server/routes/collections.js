const express = require('express');
const { db, parseCollection } = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

router.get('/', (req, res) => {
  const status = req.query.status;
  let rows;
  if (status) {
    rows = db.prepare('SELECT * FROM collections WHERE status = ? ORDER BY created_at DESC').all(status);
  } else {
    rows = db.prepare('SELECT * FROM collections ORDER BY created_at DESC').all();
  }
  res.json(rows.map(parseCollection));
});

router.get('/:slug', (req, res) => {
  const collection = db.prepare('SELECT * FROM collections WHERE slug = ?').get(req.params.slug);
  if (!collection) return res.status(404).json({ error: 'Collection not found' });

  const products = db
    .prepare('SELECT * FROM products WHERE collection_id = ? AND active = 1 ORDER BY category, sort_order')
    .all(collection.id)
    .map((p) => ({ ...p, sizes: JSON.parse(p.sizes), active: Boolean(p.active) }));

  res.json({ ...parseCollection(collection), products });
});

router.post('/', requireAdmin, (req, res) => {
  const { name, description, status, drop_date, hero_tagline, slug, show_coming_soon } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const finalSlug = slug || slugify(name);
  try {
    const result = db
      .prepare(
        `INSERT INTO collections (name, slug, description, status, drop_date, hero_tagline, show_coming_soon)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        name,
        finalSlug,
        description || '',
        status || 'draft',
        drop_date || null,
        hero_tagline || '',
        show_coming_soon ? 1 : 0
      );

    const collection = db.prepare('SELECT * FROM collections WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(parseCollection(collection));
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Slug already exists' });
    }
    throw err;
  }
});

router.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Collection not found' });

  const { name, description, status, drop_date, hero_tagline, slug, show_coming_soon } = req.body;
  db.prepare(
    `UPDATE collections SET
      name = ?, slug = ?, description = ?, status = ?,
      drop_date = ?, hero_tagline = ?, show_coming_soon = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    name ?? existing.name,
    slug ?? existing.slug,
    description ?? existing.description,
    status ?? existing.status,
    drop_date !== undefined ? drop_date : existing.drop_date,
    hero_tagline ?? existing.hero_tagline,
    show_coming_soon !== undefined ? (show_coming_soon ? 1 : 0) : existing.show_coming_soon,
    req.params.id
  );

  res.json(parseCollection(db.prepare('SELECT * FROM collections WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM collections WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Collection not found' });
  res.json({ success: true });
});

module.exports = router;
