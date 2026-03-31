const db = require('../config/db');

const Pet = {
    findAll(callback) {
        db.all('SELECT * FROM pets', [], callback);
    }
};

module.exports = Pet;
