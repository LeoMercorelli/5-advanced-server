import { CarritosDAO } from '../daos/mongoose/carritos.dao.js';
import { ProductosDAO } from '../daos/mongoose/productos.dao.js';
import { TicketsDAO } from '../daos/mongoose/tickets.dao.js';
import { CarritosRepositorio } from '../repositorios/carritos.repositorio.js';
import { ProductosRepositorio } from '../repositorios/productos.repositorio.js';
import { TicketsRepositorio } from '../repositorios/tickets.repositorio.js';
import { CompraServicio } from '../servicios/compra.servicio.js';

// Instancias de repositorios con sus respectivos DAOs
const carritosRepo = new CarritosRepositorio(new CarritosDAO());
const productosRepo = new ProductosRepositorio(new ProductosDAO());
const ticketsRepo = new TicketsRepositorio(new TicketsDAO());

// Servicio de compra que combina productos, carritos y tickets
const compraServicio = new CompraServicio(productosRepo, carritosRepo, ticketsRepo);

// Controlador para agregar un producto al carrito
export async function agregarAlCarrito(req, res, next) {
  try {
    const { cid } = req.params; // id del carrito
    const { productId, quantity } = req.body; // datos enviados por el cliente

    // Busca el carrito y revisa si el producto ya existe en la lista
    const cart = await carritosRepo.getById(cid);
    const yaEsta = cart?.items?.some(i => i.product._id.toString() === productId);

    // Si ya esta, incrementa cantidad; si no, lo agrega como nuevo
    const actualizado = yaEsta
      ? await carritosRepo.addItem(cid, productId, Number(quantity || 1))
      : await carritosRepo.pushItem(cid, productId, Number(quantity || 1));

    res.json({ status: 'success', payload: actualizado });
  } catch (e) {
    next(e); // pasa el error al manejador global
  }
}

// Controlador para procesar la compra de un carrito
export async function comprarCarrito(req, res, next) {
  try {
    const { cid } = req.params; // id del carrito
    const email = req.user.email; // email del usuario autenticado

    // Procesa la compra completa usando el servicio
    const r = await compraServicio.procesarCompra(cid, email);

    // Devuelve el resultado de la compra (tickets, productos restantes, etc.)
    res.json({ status: 'success', ...r });
  } catch (e) {
    next(e);
  }
}