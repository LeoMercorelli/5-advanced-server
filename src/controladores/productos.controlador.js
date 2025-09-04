import { ProductosDAO } from '../daos/mongoose/productos.dao.js';
import { ProductosRepositorio } from '../repositorios/productos.repositorio.js';

// Instancia del repositorio de productos con su DAO
const repo = new ProductosRepositorio(new ProductosDAO());

// Controlador para obtener todos los productos
export async function listarProductos(_req, res, next) {
  try {
    const data = await repo.list();
    res.json({ status: 'success', payload: data });
  } catch (e) {
    next(e);
  }
}

// Controlador para crear un nuevo producto
export async function crearProducto(req, res, next) {
  try {
    const creado = await repo.create(req.body);
    res.status(201).json({ status: 'success', payload: creado });
  } catch (e) {
    next(e);
  }
}

// Controlador para actualizar un producto existente
export async function actualizarProducto(req, res, next) {
  try {
    const actualizado = await repo.update(req.params.pid, req.body);
    res.json({ status: 'success', payload: actualizado });
  } catch (e) {
    next(e);
  }
}

// Controlador para eliminar un producto
export async function eliminarProducto(req, res, next) {
  try {
    const eliminado = await repo.remove(req.params.pid);
    res.json({ status: 'success', payload: eliminado });
  } catch (e) {
    next(e);
  }
}
