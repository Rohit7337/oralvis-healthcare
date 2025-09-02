require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const db = require('./db');
const guard = require('./auth');
const cloudinary = require('./cloudinary');

const app = express();
const PORT = process.env.PORT || 5002;

const allowed = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['*'];

app.use(cors({ origin: allowed, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/** seed two users on first run */
function seedUsers() {
  db.get('SELECT COUNT(*) as c FROM users', (err, row) => {
    if (err) return console.error('Seed check failed:', err.message);
    if (row.c === 0) {
      const techPass = bcrypt.hashSync('tech123', 10);
      const dentPass = bcrypt.hashSync('dent123', 10);
      db.run('INSERT INTO users (email,password,role) VALUES (?,?,?)',
        ['tech@oralvis.com', techPass, 'technician']);
      db.run('INSERT INTO users (email,password,role) VALUES (?,?,?)',
        ['dentist@oralvis.com', dentPass, 'dentist']);
      console.log('Seeded default users: tech@oralvis.com / dentist@oralvis.com');
    }
  });
}
seedUsers();

/** auth: login */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token, role: user.role, email: user.email });
  });
});

/** (optional) register — handy for testing */
app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password || !role) return res.status(400).json({ error: 'email, password, role required' });

  const hash = bcrypt.hashSync(password, 10);
  db.run(
    'INSERT INTO users (email,password,role) VALUES (?,?,?)',
    [email, hash, role],
    function (err) {
      if (err) {
        if ((err.message || '').includes('UNIQUE')) return res.status(409).json({ error: 'Email already exists' });
        return res.status(500).json({ error: 'db error' });
      }
      res.json({ id: this.lastID });
    }
  );
});

/** technician uploads a scan */
app.post('/api/scans', guard(['technician']), upload.single('image'), (req, res) => {
  const { patientName, patientId, scanType, region } = req.body || {};
  if (!req.file) return res.status(400).json({ error: 'image file is required (field name: image)' });
  if (!patientName || !patientId || !scanType || !region) {
    return res.status(400).json({ error: 'patientName, patientId, scanType, region are required' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'oralvis', resource_type: 'image' },
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Cloudinary upload failed', details: err.message });

      const id = uuidv4();
      const uploadDate = new Date().toISOString();
      const imageUrl = result.secure_url;

      db.run(
        `INSERT INTO scans (id, patient_name, patient_id, scan_type, region, image_url, upload_date)
         VALUES (?,?,?,?,?,?,?)`,
        [id, patientName, patientId, scanType, region, imageUrl, uploadDate],
        (e) => {
          if (e) return res.status(500).json({ error: 'DB insert failed' });
          res.json({ id, patientName, patientId, scanType, region, imageUrl, uploadDate });
        }
      );
    }
  );
  stream.end(req.file.buffer);
});

/** dentist views all scans */
app.get('/api/scans', guard(['dentist']), (req, res) => {
  db.all('SELECT * FROM scans ORDER BY upload_date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});

app.get('/', (_, res) => res.send('OralVis API is running'));
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
