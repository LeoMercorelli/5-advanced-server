import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de producto: define los campos principales de un producto en el sistema
const productoSchema = new Schema({
    // Titulo o nombre del producto
    title: { type: String, required: true, trim: true },

    // Descripcion opcional
    description: { type: String, default: '' },

    // Codigo unico de producto (usado como identificador comercial)
    code: { type: String, required: true, unique: true, index: true },

    // Precio del producto (no puede ser negativo)
    price: { type: Number, required: true, min: 0 },

    // Cantidad disponible en stock (no puede ser negativa)
    stock: { type: Number, required: true, min: 0 },

    // Estado del producto (activo/inactivo)
    status: { type: Boolean, default: true },

    // Categoria a la que pertenece el producto
    category: { type: String, default: 'general' },

    // Lista de rutas o URLs de imagenes del producto
    thumbnails: { type: [String], default: [] }
}, { timestamps: true }); // agrega createdAt y updatedAt automaticamente

// Modelo asociado a la coleccion "productos"
export const ProductoModelo = mongoose.model('productos', productoSchema);
