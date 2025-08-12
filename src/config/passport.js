import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';

import { UsuarioModelo } from '../modelos/usuario.model.js';
import { config } from './config.js';

const JWT_SECRET = (config.jwt && config.jwt.secret) || config.jwtSecret || process.env.JWT_SECRET;

// -------- Estrategia LOCAL: 'login' (email + password) --------
passport.use(
  'login',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: false },
    async (email, password, done) => {
      try {
        const usuario = await UsuarioModelo.findOne({ email });
        if (!usuario) return done(null, false, { message: 'Credenciales inválidas' });

        // Evita 500 si en la DB quedó una password sin hash
        let ok = false;
        try {
          if (typeof usuario.password === 'string' && usuario.password.startsWith('$2')) {
            ok = bcrypt.compareSync(password, usuario.password);
          }
        } catch {
          ok = false;
        }

        if (!ok) return done(null, false, { message: 'Credenciales inválidas' });
        return done(null, usuario);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// -------- Estrategia JWT: 'jwt' (protege rutas y /current) --------
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // usa "Authorization: Bearer <token>"
      secretOrKey: JWT_SECRET,
      algorithms: ['HS256']
    },
    async (payload, done) => {
      try {
        // El login emite { uid, role, email } — usamos uid
        const userId = payload.uid || payload._id || payload.id;
        if (!userId) return done(null, false, { message: 'Token sin usuario' });

        const usuario = await UsuarioModelo.findById(userId).populate('cart');
        if (!usuario) return done(null, false, { message: 'Token válido, usuario inexistente' });

        return done(null, usuario); // será req.user
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Inicializador que usarás en app.js
export const inicializarPassport = () => passport.initialize();

export default passport;
