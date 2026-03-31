const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database(':memory:');

// Pre-hash passwords synchronously before DB initialization
const adminHash      = bcrypt.hashSync('admin123', 10);
const vetHash        = bcrypt.hashSync('vet123', 10);
const recHash        = bcrypt.hashSync('rec123', 10);

db.serialize(() => {
    db.run(`CREATE TABLE owners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER,
        FOREIGN KEY (owner_id) REFERENCES owners(id)
    )`);

    db.run(`CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER,
        service TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        medical_notes TEXT DEFAULT '',
        status TEXT DEFAULT 'Scheduled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id)
    )`);

    // Sprint 3: tabla de usuarios con roles
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'veterinario', 'recepcionista'))
    )`);

    // Datos de prueba
    db.run("INSERT INTO owners (name) VALUES ('Juan Pérez')");
    db.run("INSERT INTO owners (name) VALUES ('Maria García')");
    db.run("INSERT INTO pets (name, owner_id) VALUES ('Rex', 1)");
    db.run("INSERT INTO pets (name, owner_id) VALUES ('Luna', 2)");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date, medical_notes) VALUES (1, 'Corte de Pelo', '2026-02-25 10:00', 'Sin alergias conocidas')");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date, medical_notes) VALUES (2, 'Baño y Limpieza', '2026-02-25 11:30', 'Piel sensible')");

    // Usuarios de prueba
    db.run(`INSERT INTO users (username, password, full_name, role) VALUES ('admin', ?, 'Administrador', 'admin')`, [adminHash]);
    db.run(`INSERT INTO users (username, password, full_name, role) VALUES ('dr_garcia', ?, 'Dr. García (Vet)', 'veterinario')`, [vetHash]);
    db.run(`INSERT INTO users (username, password, full_name, role) VALUES ('recepcion', ?, 'Recepcionista', 'recepcionista')`, [recHash]);
});

module.exports = db;