const db = require('../config/db');

const Appointment = {
    findAllWithDetails(callback) {
        const sql = `SELECT a.*, p.name AS pet_name, o.name AS owner_name
                     FROM appointments a
                     JOIN pets p ON a.pet_id = p.id
                     JOIN owners o ON p.owner_id = o.id
                     ORDER BY a.appointment_date DESC`;
        db.all(sql, [], callback);
    },

    findMedicalHistory(callback) {
        const sql = `SELECT a.*, p.name AS pet_name, o.name AS owner_name
                     FROM appointments a
                     JOIN pets p ON a.pet_id = p.id
                     JOIN owners o ON p.owner_id = o.id
                     ORDER BY a.pet_id ASC, a.appointment_date ASC`;
        db.all(sql, [], callback);
    },

    create({ pet_id, service, appointment_date, diagnosis, weight, prescribed_medication }, callback) {
        const sql = `INSERT INTO appointments (pet_id, service, appointment_date, diagnosis, weight, prescribed_medication)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [pet_id, service, appointment_date, diagnosis || '', weight || null, prescribed_medication || ''], callback);
    },

    deleteById(id, callback) {
        db.run('DELETE FROM appointments WHERE id = ?', [id], callback);
    }
};

module.exports = Appointment;
