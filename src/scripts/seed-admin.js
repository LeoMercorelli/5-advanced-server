import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { UsuarioModelo } from '../modelos/usuario.model.js';
import { hashPassword } from '../utils/criptografia.js';

try {
  console.log('Conectando a MongoDB (seed admin)...');

  // Conexión a la base de datos con timeouts configurados
  await mongoose.connect(config.mongoUrl, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 20000,
  });

  const email = 'admin@ecommerce.com';

  // Verifica si ya existe un usuario admin con ese email
  const existe = await UsuarioModelo.findOne({ email }).lean();
  if (existe) {
    console.log('⚠️ Ya existe un admin con email', email);
  } else {
    // Crea un nuevo admin con password hasheada
    const admin = await UsuarioModelo.create({
      first_name: 'Admin',
      last_name: 'Principal',
      email,
      age: 30,
      password: hashPassword('Admin123!'), // contraseña inicial
      role: 'admin',
      cart: null,
    });

    // Muestra los datos principales del admin creado
    console.log('✅ Admin creado:', { _id: admin._id.toString(), email: admin.email });
    console.log('   Contraseña: Admin123!');
  }

  // Cierra la conexión con la base de datos
  await mongoose.disconnect();
  console.log('Hecho.');
  process.exit(0);
} catch (e) {
  // Si algo falla, muestra el error y termina con código 1
  console.error('Error semilla admin:', e);
  process.exit(1);
}
