import { RestablecerPasswordModelo } from '../../modelos/restablecerPassword.model.js';

// DAO para manejar solicitudes de restablecimiento de contrasena
export class RestablecerPasswordDAO {
  // Crea un registro de restablecimiento con usuario, hash del token y fecha de expiracion
  async create({ user, tokenHash, expiresAt }) {
    return RestablecerPasswordModelo.create({ user, tokenHash, expiresAt });
  }

  // Busca un token valido: no usado y que no haya expirado
  async findValidByHash(tokenHash) {
    return RestablecerPasswordModelo.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() }
    }).lean();
  }

  // Marca un token como usado para que no pueda reutilizarse
  async markUsed(id) {
    return RestablecerPasswordModelo.findByIdAndUpdate(
      id,
      { used: true },
      { new: true }
    ).lean();
  }
}
