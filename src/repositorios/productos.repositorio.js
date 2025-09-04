// Repositorio de productos: capa intermedia entre controladores/servicios y el DAO
export class ProductosRepositorio {
  constructor(dao) {
    this.dao = dao; // DAO inyectado
  }

  // Lista productos con filtros y opciones (paginacion, orden, etc.)
  list(filter, opts) {
    return this.dao.findAll(filter, opts);
  }

  // Obtiene un producto por id
  get(id) {
    return this.dao.findById(id);
  }

  // Crea un nuevo producto
  create(data) {
    return this.dao.create(data);
  }

  // Actualiza un producto existente
  update(id, data) {
    return this.dao.update(id, data);
  }

  // Elimina un producto
  remove(id) {
    return this.dao.delete(id);
  }

  // Disminuye el stock de un producto
  decreaseStock(id, qty) {
    return this.dao.decreaseStock(id, qty);
  }
}
