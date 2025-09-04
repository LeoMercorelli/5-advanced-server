import { Router } from 'express';
import { agregarAlCarrito, comprarCarrito } from '../controladores/carritos.controlador.js';
import { requiereUsuario, requiereRol } from '../middlewares/auth.js';

const router = Router();

// Agrega un producto al carrito
// Solo usuarios autenticados con rol "user" pueden hacerlo
router.post('/:cid/items', requiereUsuario, requiereRol('user'), agregarAlCarrito);

// Procesa la compra de un carrito
// Solo usuarios autenticados con rol "user" pueden hacerlo
router.post('/:cid/purchase', requiereUsuario, requiereRol('user'), comprarCarrito);

export default router;
