// Repositorio de tickets: capa intermedia entre controladores/servicios y el DAO
export class TicketsRepositorio {
  constructor(dao) {
    this.dao = dao; // DAO inyectado
  }

  // Crea un nuevo ticket
  create(data) {
    return this.dao.create(data);
  }
}
