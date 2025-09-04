import { UsuarioModelo } from '../../modelos/usuario.model.js';

// DAO para manejar operaciones sobre la coleccion de usuarios
export class UsuariosDAO {
  // Crea un nuevo usuario
  async create(data) {
    return UsuarioModelo.create(data);
  }

  // Busca un usuario por email
  async findByEmail(email) {
    return UsuarioModelo.findOne({ email }).lean();
  }

  // Busca un usuario por id
  async findById(id) {
    return UsuarioModelo.findById(id).lean();
  }

  // Busca un usuario por id incluyendo el campo password (normalmente oculto)
  async findByIdWithPassword(id) {
    return UsuarioModelo.findById(id).select('+password').lean();
  }

  // Actualiza la contrasena de un usuario con un nuevo hash
  async updatePassword(id, newHash) {
    return UsuarioModelo.findByIdAndUpdate(
      id,
      { password: newHash },
      { new: true }
    );
  }
}
