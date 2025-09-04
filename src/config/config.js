// Carga las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config();

// Configuracion centralizada de la aplicacion
export const config = {
  // Puerto donde corre la aplicacion
  port: process.env.PORT ?? 8080,

  // Cadena de conexion a MongoDB
  mongoUrl: process.env.MONGODB_URL ?? '',

  // Configuracion de JWT para autenticacion
  jwtSecret: process.env.JWT_SECRET ?? 'dev_secret', // No usar este valor en produccion
  jwtExpiresIn: process.env.JWT_EXPIRES ?? '1d',
  jwtCookieName: process.env.JWT_COOKIE_NAME ?? 'token',

  // Numero de rondas de salt para hashing de contrasenas
  saltRounds: Number(process.env.SALT_ROUNDS ?? 10),

  // URL base de la aplicacion (usada en links absolutos)
  baseUrl: process.env.BASE_URL ?? 'http://localhost:8080',

  // Configuracion de correo para enviar emails
  mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM ?? 'Ecommerce <no-reply@local>', // Valor por defecto para ambiente local
  },
};
