import { ProductoModelo } from '../../modelos/product.model.js';

// DAO para operaciones directas sobre la coleccion de productos
export class ProductosDAO {
  // Busca todos los productos aplicando filtros y opciones (paginacion, orden, etc.)
  async findAll(filter = {}, opts = {}) {
    return ProductoModelo.find(filter, null, opts).lean();
  }

  // Busca un producto por id
  async findById(id) {
    return ProductoModelo.findById(id).lean();
  }

  // Crea un nuevo producto
  async create(data) {
    return ProductoModelo.create(data);
  }

  // Actualiza un producto existente y devuelve la version nueva
  async update(id, data) {
    return ProductoModelo.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  // Elimina un producto por id
  async delete(id) {
    return ProductoModelo.findByIdAndDelete(id).lean();
  }

  // Disminuye el stock de un producto si hay suficiente cantidad disponible
  async decreaseStock(productId, qty) {
    return ProductoModelo.findOneAndUpdate(
      { _id: productId, stock: { $gte: qty } }, // solo si stock es suficiente
      { $inc: { stock: -qty } },
      { new: true }
    ).lean();
  }
}
