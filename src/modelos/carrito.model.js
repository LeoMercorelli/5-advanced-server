import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de carrito: guarda propietario y lista de productos con cantidad
const carritoSchema = new Schema({
  // Usuario dueño del carrito (puede ser null para visitantes)
  owner: { type: Schema.Types.ObjectId, ref: 'usuarios', required: false },

  // Lista de productos en el carrito
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'productos', required: true },
    quantity: { type: Number, required: true, min: 1 } // siempre al menos 1 unidad
  }]
}, { timestamps: true }); // agrega createdAt y updatedAt automaticamente

// Modelo asociado a la coleccion "carritos"
export const CarritoModelo = mongoose.model('carritos', carritoSchema);
