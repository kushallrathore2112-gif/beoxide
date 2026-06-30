require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const { initDb, seedDb } = require('./db');

const collectionsRouter = require('./routes/collections');
const productsRouter = require('./routes/products');
const preordersRouter = require('./routes/preorders');
const adminRouter = require('./routes/admin');

initDb();
seedDb();

const app = express();
const PORT = process.env.PORT || 3200;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'beoxide-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' },
  })
);

app.use('/api/collections', collectionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/preorders', preordersRouter);
app.use('/api/admin', adminRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/beoxide.html', (_req, res) => res.redirect('/'));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`be.oxide running on port ${PORT}`);
});
