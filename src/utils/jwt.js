import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Toma el secreto y el expires de cualquiera de las dos formas de config
const JWT_SECRET =
  (config.jwt && config.jwt.secret) ||
  config.jwtSecret ||
  process.env.JWT_SECRET ||
  'dev-secret';

const JWT_EXPIRES =
  (config.jwt && (config.jwt.expires || config.jwt.expiresIn)) ||
  config.jwtExpires ||
  process.env.JWT_EXPIRES ||
  '1d';

export const generarToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

export const extraerTokenDeHeaders = (req) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  if (req.cookies?.token) return req.cookies.token;
  return null;
};
