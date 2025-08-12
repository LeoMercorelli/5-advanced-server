import passport from 'passport';

// Wrapper para invocar estrategias Passport sin sesiones
export const usarPassport = (estrategia) => (req, res, next) => {
    passport.authenticate(estrategia, { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            const mensaje = info?.message || 'No autorizado';
            return res.status(401).json({ status: 'error', error: mensaje });
        }
        req.user = user;
        next();
    })(req, res, next);
};

// Políticas por rol
export const requiereRoles = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const rol = req.user?.role;
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({ status: 'error', error: 'Prohibido' });
        }
        next();
    };
};
