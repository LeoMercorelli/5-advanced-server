// Repositorio de usuarios: capa intermedia entre controladores/servicios y el DAO
export class UsuariosRepositorio {
  constructor(dao) {
    this.dao = dao; // DAO inyectado
  }

  // Crea un nuevo usuario
  create(data) {
    return this.dao.create(data);
  }

  // Busca usuario por email
  findByEmail(email) {
    return this.dao.findByEmail(email);
  }

  // Busca usuario por id
  findById(id) {
    return this.dao.findById(id);
  }

  // Busca usuario por id incluyendo password (oculto por defecto)
  findByIdWithPassword(id) {
    return this.dao.findByIdWithPassword(id);
  }

  // Actualiza la contrasena con un nuevo hash
  updatePassword(id, hash) {
    return this.dao.updatePassword(id, hash);
  }
}
