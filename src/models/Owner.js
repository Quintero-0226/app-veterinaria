const db = require('../config/db');

const Owner = {
    findAll(callback) {
        db.all('SELECT * FROM owners', [], callback);
    }
};

module.exports = Owner;
