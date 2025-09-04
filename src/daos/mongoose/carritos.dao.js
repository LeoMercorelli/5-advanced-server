import { CarritoModelo } from '../../modelos/carrito.model.js';

// DAO para operaciones directas sobre la coleccion de carritos
export class CarritosDAO {
  // Busca carrito por id y popula los productos dentro de items
  async getById(id) {
    return CarritoModelo.findById(id).populate('items.product').lean();
  }

  // Crea un carrito vacio (opcionalmente con owner asignado)
  async createEmpty(owner = null) {
    return CarritoModelo.create({ owner, items: [] });
  }

  // Incrementa la cantidad de un producto ya existente en el carrito
  async addItem(cartId, productId, qty = 1) {
    return CarritoModelo.findByIdAndUpdate(
      cartId,
      { $inc: { 'items.$[elem].quantity': qty } }, // busca el item que coincide con productId
      { arrayFilters: [{ 'elem.product': productId }], new: true }
    ).lean();
  }

  // Agrega un nuevo producto al carrito con la cantidad indicada
  async pushItem(cartId, productId, qty = 1) {
    return CarritoModelo.findByIdAndUpdate(
      cartId,
      { $push: { items: { product: productId, quantity: qty } } },
      { new: true }
    ).lean();
  }

  // Reemplaza toda la lista de items del carrito por la lista recibida
  async setItems(cartId, items) {
    return CarritoModelo.findByIdAndUpdate(cartId, { items }, { new: true }).lean();
  }
}
