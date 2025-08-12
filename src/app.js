import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { config } from './config/config.js';
import { inicializarPassport } from './config/passport.js';
import { manejoErrores } from './middlewares/manejoErrores.js';

import { sessionsRouter } from './rutas/sessions.router.js';
import { usuariosRouter } from './rutas/usuarios.router.js';

export const crearApp = async () => {
    // Log con password oculto (soporta mongodb y mongodb+srv)
    const redacted = (config.mongoUrl || '').replace(
        /(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/,
        '$1$2:<hidden>@'
    );
    console.log('Conectando a MongoDB...', redacted);

    // Con SRV no agregues puertos ni TLS manual; Mongoose lo resuelve solo.
    await mongoose.connect(config.mongoUrl, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 20000,
    });

    console.log('✅ MongoDB conectado a DB:', mongoose.connection.name);

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan('dev'));

    app.use(inicializarPassport());

    app.use('/api/sessions', sessionsRouter);
    app.use('/api/users', usuariosRouter);

    app.use(manejoErrores);
    app.get('/', (req, res) => {
        res.send('Servidor funcionando ✅');
    });

    return app;
};
