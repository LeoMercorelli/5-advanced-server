import { TicketModelo } from '../../modelos/ticket.model.js';

// DAO para manejar operaciones sobre la coleccion de tickets
export class TicketsDAO {
  // Crea un nuevo ticket con los datos recibidos
  async create(data) {
    return TicketModelo.create(data);
  }
}
