import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true, trim: true },
        last_name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        age: { type: Number, required: true, min: 0 },
        password: { type: String, required: true }, // hash bcrypt
        cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrito' },
        role: { type: String, enum: ['user', 'admin'], default: 'user' }
    },
    { timestamps: true }
);

export const UsuarioModelo = mongoose.model('Usuario', usuarioSchema);
