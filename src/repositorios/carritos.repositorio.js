// Repositorio de carritos: actua como capa intermedia entre controladores/servicios y el DAO
export class CarritosRepositorio {
  constructor(dao) {
    this.dao = dao; // DAO inyectado
  }

  // Obtiene un carrito por id
  getById(id) {
    return this.dao.getById(id);
  }

  // Crea un carrito vacio, opcionalmente con owner
  createEmpty(owner) {
    return this.dao.createEmpty(owner);
  }

  // Incrementa cantidad de un producto existente en el carrito
  addItem(cartId, productId, qty) {
    return this.dao.addItem(cartId, productId, qty);
  }

  // Agrega un nuevo producto al carrito
  pushItem(cartId, productId, qty) {
    return this.dao.pushItem(cartId, productId, qty);
  }

  // Reemplaza todos los items del carrito
  setItems(cartId, items) {
    return this.dao.setItems(cartId, items);
  }
}
