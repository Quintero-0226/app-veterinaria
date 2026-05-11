const db = require('../config/db');

const Pet = {
    findAll() {
        return db.prepare('SELECT * FROM pets').all();
    }
};

module.exports = Pet;
