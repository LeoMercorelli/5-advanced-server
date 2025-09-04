import { Router } from 'express';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controladores/productos.controlador.js';
import { requiereUsuario, requiereRol } from '../middlewares/auth.js';

const router = Router();

// Obtiene todos los productos (publico)
router.get('/', listarProductos);

// Crea un producto (solo usuarios autenticados con rol admin)
router.post('/', requiereUsuario, requiereRol('admin'), crearProducto);

// Actualiza un producto existente (solo admin)
router.put('/:pid', requiereUsuario, requiereRol('admin'), actualizarProducto);

// Elimina un producto (solo admin)
router.delete('/:pid', requiereUsuario, requiereRol('admin'), eliminarProducto);

export default router;
