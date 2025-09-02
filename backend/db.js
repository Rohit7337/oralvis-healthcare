const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'oralvis.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('technician','dentist')) NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    scan_type TEXT NOT NULL,
    region TEXT NOT NULL,
    image_url TEXT NOT NULL,
    upload_date TEXT NOT NULL
  )`);
});

module.exports = db;
