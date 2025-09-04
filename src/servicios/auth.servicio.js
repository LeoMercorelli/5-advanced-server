import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import { enviarMail } from '../utils/mailer.js';

export class AuthServicio {
  constructor(usuariosRepo, resetRepo) {
    // Repositorios inyectados para usuarios y resets
    this.usuariosRepo = usuariosRepo;
    this.resetRepo = resetRepo;
  }

  // Genera un token de reset y envia un correo con el enlace
  async solicitarResetPassword(email) {
    // No revelar existencia del usuario
    const user = await this.usuariosRepo.findByEmail(email);
    if (!user) return;

    // Token aleatorio y su hash para guardar en BD
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Expiracion en 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Guarda registro de reset con hash (nunca guardar el token plano)
    await this.resetRepo.create({ user: user._id, tokenHash, expiresAt });

    // Construye enlace de reset usando baseUrl del proyecto
    const link = `${config.baseUrl}/api/sessions/reset-password?token=${token}`;

    // Contenido del correo con CTA
    const html = `
      <h2>Restablecer contraseña</h2>
      <p>Hacé click en el botón para restablecer tu contraseña. El enlace caduca en 1 hora.</p>
      <p><a href="${link}">Restablecer contraseña</a></p>
      <p>Si no fuiste vos, ignorá este correo.</p>
    `;

    // Envia el correo de reset
    await enviarMail({ to: user.email, subject: 'Restablecer contraseña', html });
  }

  // Valida el token y actualiza la contrasena del usuario
  async restablecerPassword(tokenPlano, nuevaPassword, bcryptHashFn) {
    // Hashea el token recibido para buscarlo en BD
    const tokenHash = crypto.createHash('sha256').update(tokenPlano).digest('hex');

    // Busca registro valido (no usado y no expirado)
    const registro = await this.resetRepo.findValidByHash(tokenHash);
    if (!registro) throw Object.assign(new Error('Token inválido o expirado'), { status: 400 });

    // Obtiene usuario incluyendo password para comparar
    const user = await this.usuariosRepo.findByIdWithPassword(registro.user);
    if (!user) throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });

    // Evita reutilizar la misma contrasena
    const esMisma = bcrypt.compareSync(nuevaPassword, user.password);
    if (esMisma) throw Object.assign(new Error('La nueva contraseña no puede ser igual a la anterior'), { status: 400 });

    // Genera nuevo hash y actualiza
    const nuevoHash = bcryptHashFn(nuevaPassword);
    await this.usuariosRepo.updatePassword(user._id, nuevoHash);

    // Invalida el token marcandolo como usado
    await this.resetRepo.markUsed(registro._id);

    return true;
  }
}
