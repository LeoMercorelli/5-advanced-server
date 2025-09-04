import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de usuario
const usuarioSchema = new Schema({
  // Nombre del usuario
  first_name: { type: String, required: true, trim: true },

  // Apellido del usuario
  last_name: { type: String, required: true, trim: true },

  // Email unico, usado como identificador de login
  email: { type: String, required: true, unique: true, index: true, trim: true },

  // Edad del usuario (no puede ser negativa)
  age: { type: Number, required: true, min: 0 },

  // Contrasena en hash, no se devuelve en consultas por defecto
  password: { type: String, required: true, select: false },

  // Referencia al carrito del usuario
  cart: { type: Schema.Types.ObjectId, ref: 'carritos', default: null },

  // Rol del usuario (user o admin)
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true }); // agrega createdAt y updatedAt automaticamente

// Modelo asociado a la coleccion "usuarios"
export const UsuarioModelo = mongoose.model('usuarios', usuarioSchema);
