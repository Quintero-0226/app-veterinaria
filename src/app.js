const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const viewsPath = process.env.NETLIFY
    ? path.join(process.cwd(), 'views')
    : path.join(__dirname, '..', 'views');

app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(cookieSession({
    name: 'pelucan_session',
    keys: [process.env.SESSION_SECRET || 'dev_only_insecure_secret'],
    maxAge: 1000 * 60 * 60 * 2
}));

app.use((req, res, next) => {
    res.locals.user = (req.session && req.session.user) || null;
    next();
});

app.use('/', authRoutes);
app.use('/', appointmentRoutes);

module.exports = app;
