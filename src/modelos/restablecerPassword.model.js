import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema para solicitudes de restablecimiento de contrasena
const resetSchema = new Schema({
    // Usuario al que pertenece la solicitud
    user: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true, index: true },

    // Hash unico del token de recuperacion
    tokenHash: { type: String, required: true, unique: true },

    // Fecha de expiracion del token
    expiresAt: { type: Date, required: true },

    // Marca si el token ya fue usado
    used: { type: Boolean, default: false }
}, { timestamps: true }); // agrega createdAt y updatedAt automaticamente

// Modelo asociado a la coleccion "password_resets"
export const RestablecerPasswordModelo = mongoose.model('password_resets', resetSchema);
