import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

export function hashPassword(passwordPlano) {
  return bcrypt.hashSync(passwordPlano, config.saltRounds);
}

export function validarPassword(passwordPlano, hashGuardado) {
  return bcrypt.compareSync(passwordPlano, hashGuardado);
}
