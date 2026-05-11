const db = require('../config/db');

const User = {
    findByUsername(username) {
        return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    }
};

module.exports = User;
