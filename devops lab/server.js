const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// lowdb setup
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

const JWT_SECRET = 'replace_this_with_a_secure_secret';

async function initDB() {
  await db.read();
  db.data = db.data || { users: [], resources: [] };
  await db.write();
}

initDB();

// Serve static frontend
app.use('/', express.static(path.join(__dirname, 'public')));

// Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  await db.read();
  const exists = db.data.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name: name || '', email, password: hashed };
  db.data.users.push(user);
  await db.write();
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  await db.read();
  const user = db.data.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Resources: public get, protected modify
app.get('/api/resources', async (req, res) => {
  await db.read();
  res.json(db.data.resources || []);
});

app.post('/api/resources', authMiddleware, async (req, res) => {
  const { title, type, location, status, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  await db.read();
  const resource = { id: Date.now().toString(), title, type: type || 'General', location: location || '', status: status || 'available', description: description || '', createdBy: req.user.id };
  db.data.resources.push(resource);
  await db.write();
  res.json(resource);
});

app.put('/api/resources/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  await db.read();
  const r = db.data.resources.find(x => x.id === id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  Object.assign(r, req.body);
  await db.write();
  res.json(r);
});

app.delete('/api/resources/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  await db.read();
  const idx = db.data.resources.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = db.data.resources.splice(idx, 1)[0];
  await db.write();
  res.json({ success: true, removed });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
