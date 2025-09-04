import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from './config/config.js';
import { inicializarPassport } from './config/passport.js';

import sesionesRouter from './rutas/sessions.router.js';
import productosRouter from './rutas/productos.router.js';
import carritosRouter from './rutas/carritos.router.js';
import { usuariosRouter } from './rutas/usuarios.router.js'; // rutas de usuarios

import manejoErrores from './middlewares/manejoErrores.js';

const app = express();

// --- Conexion a MongoDB ---
// En el log se oculta la contraseña para mayor seguridad
const redacted = (config.mongoUrl || '').replace(
  /(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/,
  '$1$2:<hidden>@'
);
console.log('Conectando a MongoDB...', redacted);

await mongoose.connect(config.mongoUrl, {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 20000,
});

console.log('✅ MongoDB conectada:', mongoose.connection.name);

// --- Middlewares base ---
app.use(cors()); // habilita CORS
app.use(express.json()); // parsea JSON en requests
app.use(express.urlencoded({ extended: true })); // parsea datos de formularios
app.use(cookieParser()); // permite leer cookies
app.use(morgan('dev')); // logger de requests

// --- Passport (estrategias login + current) ---
app.use(inicializarPassport());

// --- Rutas ---
app.use('/api/sessions', sesionesRouter);
app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);
app.use('/api/users', usuariosRouter);

// --- Healthcheck simple ---
app.get('/', (_req, res) => res.send('Servidor OK ✅'));

// --- Manejo global de errores ---
app.use(manejoErrores);

export default app;
