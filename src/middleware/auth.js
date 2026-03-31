/**
 * Verifica que el usuario tenga una sesión activa.
 * Criterio 2: Solo usuarios autenticados pueden borrar registros.
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
}

/**
 * Verifica que el usuario tenga rol 'veterinario' o 'admin'.
 * Criterio 1: Solo el veterinario puede alterar campos médicos.
 */
function isVeterinario(req, res, next) {
    if (!req.session || !req.session.user) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    const { role } = req.session.user;
    if (role === 'veterinario' || role === 'admin') {
        return next();
    }
    res.status(403).render('403', { title: 'Acceso Denegado' });
}

module.exports = { isAuthenticated, isVeterinario };
