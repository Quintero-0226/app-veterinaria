const db = require('../config/db');

const Owner = {
    findAll() {
        return db.prepare('SELECT * FROM owners').all();
    }
};

module.exports = Owner;
