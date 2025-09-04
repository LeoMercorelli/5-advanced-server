import { config } from '../config/config.js';
import { hashPassword } from '../utils/criptografia.js';
import { generarToken } from '../utils/jwt.js';
import { toUsuarioActualDTO } from '../dtos/usuarioActual.dto.js';

import { UsuariosDAO } from '../daos/mongoose/usuarios.dao.js';
import { RestablecerPasswordDAO } from '../daos/mongoose/restablecerPassword.dao.js';
import { UsuariosRepositorio } from '../repositorios/usuarios.repositorio.js';
import { RestablecerPasswordRepositorio } from '../repositorios/restablecerPassword.repositorio.js';
import { AuthServicio } from '../servicios/auth.servicio.js';

// Instancias de repositorios y servicio de autenticacion
const usuariosRepo = new UsuariosRepositorio(new UsuariosDAO());
const resetRepo = new RestablecerPasswordRepositorio(new RestablecerPasswordDAO());
const authServicio = new AuthServicio(usuariosRepo, resetRepo);

// Inicia sesion y genera token JWT que se guarda en cookie httpOnly
export async function iniciarSesion(req, res) {
  const usuario = req.user;
  const token = generarToken({ sub: usuario._id.toString(), role: usuario.role, email: usuario.email });

  res
    .cookie(config.jwtCookieName, token, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 })
    .json({ status: 'success', mensaje: 'Login OK', token });
}

// Devuelve el usuario actual en formato DTO (sin exponer campos sensibles)
export async function usuarioActual(req, res) {
  res.json({ status: 'success', user: toUsuarioActualDTO(req.user) });
}

// Cierra sesion eliminando la cookie con el token
export async function cerrarSesion(_req, res) {
  res.clearCookie(config.jwtCookieName);
  res.json({ status: 'success', mensaje: 'Logout OK' });
}

// Solicita un reset de contrasena y envia correo con enlace de recuperacion
export async function solicitarResetPassword(req, res, next) {
  try {
    const { email } = req.body;
    await authServicio.solicitarResetPassword(email);
    res.json({ status: 'success', mensaje: 'Si el correo existe, enviamos un enlace de recuperacion' });
  } catch (err) {
    next(err);
  }
}

// Restablece la contrasena usando el token de reset y guarda el hash de la nueva
export async function resetPassword(req, res, next) {
  try {
    const token = req.query.token || req.body.token;
    const { nuevaPassword } = req.body;

    await authServicio.restablecerPassword(token, nuevaPassword, hashPassword);
    res.json({ status: 'success', mensaje: 'Contrasena actualizada' });
  } catch (err) {
    next(err);
  }
}
