const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLogin = (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { title: 'Iniciar Sesión', error: null });
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('login', { title: 'Iniciar Sesión', error: 'Completa todos los campos.' });
    }

    try {
        const user = User.findByUsername(username);

        if (!user) {
            return res.render('login', { title: 'Iniciar Sesión', error: 'Usuario o contraseña incorrectos.' });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.render('login', { title: 'Iniciar Sesión', error: 'Usuario o contraseña incorrectos.' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            role: user.role
        };

        const redirectTo = req.session.returnTo || '/';
        req.session.returnTo = null;
        res.redirect(redirectTo);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.logout = (req, res) => {
    req.session = null;
    res.redirect('/login');
};
