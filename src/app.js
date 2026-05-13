const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

function resolveDir(name) {
    const candidates = [
        path.join(__dirname, '..', name),
        path.join(__dirname, name),
        path.join(__dirname, '..', '..', name),
        path.join(process.cwd(), name),
        path.join('/var/task', name),
        path.join('/var/task/netlify/functions', name)
    ];
    for (const candidate of candidates) {
        try {
            if (fs.statSync(candidate).isDirectory()) return candidate;
        } catch {}
    }
    return candidates[0];
}

const viewsPath = resolveDir('views');
const publicPath = resolveDir('public');

app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    if (typeof req.body === 'string' && req.body.trim()) {
        req.body = Object.fromEntries(new URLSearchParams(req.body));
    }
    next();
});
app.use(express.static(publicPath));

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
