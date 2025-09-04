import { v4 as uuid } from 'uuid';

export class CompraServicio {
  constructor(productosRepo, carritosRepo, ticketsRepo) {
    // Repositorios inyectados
    this.productosRepo = productosRepo;
    this.carritosRepo = carritosRepo;
    this.ticketsRepo = ticketsRepo;
  }

  // Procesa la compra de un carrito y genera ticket si hay items comprados
  async procesarCompra(cartId, purchaserEmail) {
    // Obtiene el carrito con productos populados
    const cart = await this.carritosRepo.getById(cartId);

    // Si no hay carrito o esta vacio, corta el flujo
    if (!cart || !cart.items?.length) {
      return { ok: false, mensaje: 'Carrito vacio', rechazados: [], ticket: null };
    }

    // Acumuladores para items comprados y rechazados
    const comprados = [];
    const rechazados = [];
    let total = 0;

    // Intenta descontar stock por cada item del carrito
    for (const item of cart.items) {
      const p = item.product;
      const qty = item.quantity;

      // decreaseStock solo aplica si hay stock suficiente
      const actualizado = await this.productosRepo.decreaseStock(p._id, qty);

      if (actualizado) {
        // Registra item comprado y suma al total
        comprados.push({ product: p._id, quantity: qty, price: p.price });
        total += p.price * qty;
      } else {
        // Sin stock suficiente, queda rechazado
        rechazados.push({ product: p._id, quantity: qty });
      }
    }

    // Actualiza el carrito dejando solo los items rechazados
    await this.carritosRepo.setItems(
      cartId,
      rechazados.map(r => ({ product: r.product, quantity: r.quantity }))
    );

    // Si hubo compras efectivas, genera ticket
    let ticket = null;
    if (comprados.length > 0) {
      ticket = await this.ticketsRepo.create({
        code: uuid(),           // identificador unico del ticket
        amount: total,          // monto total de la compra
        purchaser: purchaserEmail, // email del comprador
      });
    }

    // Devuelve el resultado con ticket (si existe) y detalle de rechazados
    return {
      ok: true,
      ticket,
      rechazados,
      mensaje: rechazados.length ? 'Compra parcial' : 'Compra completa',
    };
  }
}
