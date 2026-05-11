const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database(':memory:');

const adminHash = bcrypt.hashSync('admin123', 10);
const vetHash   = bcrypt.hashSync('vet123', 10);
const recHash   = bcrypt.hashSync('rec123', 10);

db.exec(`
    CREATE TABLE owners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

    CREATE TABLE pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER,
        FOREIGN KEY (owner_id) REFERENCES owners(id)
    );

    CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER,
        service TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        medical_notes TEXT DEFAULT '',
        diagnosis TEXT DEFAULT '',
        weight REAL,
        prescribed_medication TEXT DEFAULT '',
        status TEXT DEFAULT 'Scheduled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id)
    );

    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'veterinario', 'recepcionista'))
    );
`);

const insertOwner = db.prepare('INSERT INTO owners (name) VALUES (?)');
insertOwner.run('Juan Pérez');
insertOwner.run('Maria García');

const insertPet = db.prepare('INSERT INTO pets (name, owner_id) VALUES (?, ?)');
insertPet.run('Rex', 1);
insertPet.run('Luna', 2);

const insertAppointment = db.prepare(`
    INSERT INTO appointments (pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medication)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertAppointment.run(1, 'Consulta general', '2026-02-25 10:00', 'Sin alergias conocidas', 'Otitis leve', 22.4, 'Gotas oticas 2 veces al dia por 7 dias');
insertAppointment.run(2, 'Control dermatologico', '2026-02-25 11:30', 'Piel sensible', 'Dermatitis alergica controlada', 11.1, 'Shampoo medicado cada 72 horas');

const insertUser = db.prepare('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)');
insertUser.run('admin', adminHash, 'Administrador', 'admin');
insertUser.run('dr_garcia', vetHash, 'Dr. García (Vet)', 'veterinario');
insertUser.run('recepcion', recHash, 'Recepcionista', 'recepcionista');

module.exports = db;
