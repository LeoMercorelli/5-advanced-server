import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de ticket de compra
const ticketSchema = new Schema({
    // Codigo unico del ticket
    code: { type: String, required: true, unique: true, index: true },

    // Fecha y hora de la compra (por defecto ahora)
    purchase_datetime: { type: Date, default: Date.now },

    // Monto total de la compra
    amount: { type: Number, required: true },

    // Email del comprador
    purchaser: { type: String, required: true }
}, { timestamps: true }); // agrega createdAt y updatedAt automaticamente

// Modelo asociado a la coleccion "tickets"
export const TicketModelo = mongoose.model('tickets', ticketSchema);
