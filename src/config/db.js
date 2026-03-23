const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    // New schema for Sprint 1
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
        status TEXT DEFAULT 'Scheduled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pet_id) REFERENCES pets(id)
    )`);

    // Sample data migrated
    db.run("INSERT INTO owners (name) VALUES ('Juan Pérez')");
    db.run("INSERT INTO owners (name) VALUES ('Maria García')");
    db.run("INSERT INTO pets (name, owner_id) VALUES ('Rex', 1)");
    db.run("INSERT INTO pets (name, owner_id) VALUES ('Luna', 2)");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date) VALUES (1, 'Corte de Pelo', '2026-02-25 10:00')");
    db.run("INSERT INTO appointments (pet_id, service, appointment_date) VALUES (2, 'Baño y Limpieza', '2026-02-25 11:30')");
});

module.exports = db;