import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema(
    {
        productos: [
            {
                productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
                cantidad: { type: Number, default: 1, min: 1 }
            }
        ]
    },
    { timestamps: true }
);

export const CarritoModelo = mongoose.model('Carrito', carritoSchema);
