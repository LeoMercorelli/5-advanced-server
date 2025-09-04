// Repositorio de restablecimiento de contrasena: capa intermedia entre controladores/servicios y el DAO
export class RestablecerPasswordRepositorio {
  constructor(dao) {
    this.dao = dao; // DAO inyectado
  }

  // Crea un registro de solicitud de reset
  create(data) {
    return this.dao.create(data);
  }

  // Busca un token valido por su hash (no usado y no expirado)
  findValidByHash(hash) {
    return this.dao.findValidByHash(hash);
  }

  // Marca un token como usado
  markUsed(id) {
    return this.dao.markUsed(id);
  }
}
