import passport from 'passport';

// Middleware que requiere un usuario autenticado mediante la estrategia 'current' (JWT)
export const requiereUsuario = passport.authenticate('current', { session: false });

// Middleware que valida que el usuario tenga alguno de los roles permitidos
export function requiereRol(...rolesPermitidos) {
  return (req, res, next) => {
    const rol = req.user?.role;

    // Si no hay rol o no esta en la lista de permitidos, devuelve 403
    if (!rol || !rolesPermitidos.includes(rol)) {
      return res.status(403).json({ status: 'error', mensaje: 'No autorizado' });
    }

    // Si el rol es valido, continua
    next();
  };
}
