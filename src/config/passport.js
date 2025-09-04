import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsuarioModelo } from '../modelos/usuario.model.js';
import { validarPassword } from '../utils/criptografia.js';
import { config } from './config.js';

// Extrae el token desde la cookie configurada
const cookieExtractor = (req) => req?.cookies?.[config.jwtCookieName] || null;

// Permite extraer el token desde header Authorization o desde cookie
const fromHeaderOrCookie = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  cookieExtractor
]);

// Configura las estrategias de Passport
export function inicializarPassport() {
  // Estrategia de login con email y password
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password', session: false },
      async (email, password, done) => {
        try {
          // Busca usuario por email incluyendo el campo password
          const user = await UsuarioModelo.findOne({ email }).select('+password');
          if (!user) return done(null, false, { message: 'Usuario no encontrado' });

          // Valida la contraseña con hash
          const ok = validarPassword(password, user.password);
          if (!ok) return done(null, false, { message: 'Credenciales invalidas' });

          // Si es valido, retorna el usuario
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  // Estrategia JWT para validar usuarios autenticados
  passport.use(
    'current',
    new JwtStrategy(
      { jwtFromRequest: fromHeaderOrCookie, secretOrKey: config.jwtSecret, ignoreExpiration: false },
      async (payload, done) => {
        try {
          // Busca usuario por id contenido en el token
          const user = await UsuarioModelo.findById(payload.sub).lean();
          if (!user) return done(null, false, { message: 'Token invalido' });

          // Si existe, devuelve el usuario
          return done(null, user);
        } catch (e) {
          return done(e, false);
        }
      }
    )
  );

  // Inicializa passport en la app
  return passport.initialize();
}
