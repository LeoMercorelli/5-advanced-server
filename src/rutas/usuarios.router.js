import { Router } from 'express';
import { UsuarioModelo } from '../modelos/usuario.model.js';
import { requiereUsuario, requiereRol } from '../middlewares/auth.js';
import { hashPassword } from '../utils/criptografia.js';

export const usuariosRouter = Router();

// Todas las rutas de usuarios quedan protegidas: requiere login y rol admin
usuariosRouter.use(requiereUsuario, requiereRol('admin'));

// CREATE - Crea un nuevo usuario
usuariosRouter.post('/', async (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;

    // Validacion de campos obligatorios
    if (!first_name || !last_name || !email || age == null || !password) {
      return res.status(400).json({ status: 'error', error: 'Datos obligatorios faltantes' });
    }

    // Evita duplicados por email
    const yaExiste = await UsuarioModelo.findOne({ email }).lean();
    if (yaExiste) return res.status(409).json({ status: 'error', error: 'Email ya registrado' });

    // Creacion del usuario con password hasheada
    const creado = await UsuarioModelo.create({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password),
      cart: cart ?? null,
      role: role ?? 'user',
    });

    // Elimina el password antes de responder
    const limpio = creado.toObject();
    delete limpio.password;

    res.status(201).json({ status: 'success', payload: limpio });
  } catch (err) {
    // Maneja error de duplicado por indice unico
    if (err?.code === 11000) {
      return res.status(409).json({ status: 'error', error: 'Email ya registrado' });
    }
    next(err);
  }
});

// READ - Lista todos los usuarios (sin password, con cart populado)
usuariosRouter.get('/', async (_req, res, next) => {
  try {
    const usuarios = await UsuarioModelo.find().select('-password').populate('cart');
    res.json({ status: 'success', payload: usuarios });
  } catch (err) {
    next(err);
  }
});

// READ - Obtiene detalle de un usuario por id
usuariosRouter.get('/:id', async (req, res, next) => {
  try {
    const u = await UsuarioModelo.findById(req.params.id).select('-password').populate('cart');
    if (!u) return res.status(404).json({ status: 'error', error: 'No encontrado' });
    res.json({ status: 'success', payload: u });
  } catch (err) {
    next(err);
  }
});

// UPDATE - Actualiza datos de un usuario
usuariosRouter.put('/:id', async (req, res, next) => {
  try {
    const datos = { ...req.body };

    // Si envian password, se rehashea; si no, se omite
    if (typeof datos.password === 'string' && datos.password.trim() !== '') {
      datos.password = hashPassword(datos.password);
    } else {
      delete datos.password;
    }

    const actualizado = await UsuarioModelo
      .findByIdAndUpdate(req.params.id, datos, { new: true, runValidators: true })
      .select('-password')
      .populate('cart');

    if (!actualizado) return res.status(404).json({ status: 'error', error: 'No encontrado' });
    res.json({ status: 'success', payload: actualizado });
  } catch (err) {
    // Maneja duplicados de email en update
    if (err?.code === 11000) {
      return res.status(409).json({ status: 'error', error: 'Email ya registrado' });
    }
    next(err);
  }
});

// DELETE - Elimina un usuario por id
usuariosRouter.delete('/:id', async (req, res, next) => {
  try {
    const borrado = await UsuarioModelo.findByIdAndDelete(req.params.id);
    if (!borrado) return res.status(404).json({ status: 'error', error: 'No encontrado' });
    res.json({ status: 'success', payload: borrado._id });
  } catch (err) {
    next(err);
  }
});
