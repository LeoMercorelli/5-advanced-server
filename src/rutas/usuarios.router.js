import { Router } from 'express';
import { UsuarioModelo } from '../modelos/usuario.model.js';
import { usarPassport, requiereRoles } from '../middlewares/auth.js';
import bcrypt from 'bcrypt';

export const usuariosRouter = Router();

// PROTEGEMOS todas estas rutas con JWT.
// Y solo 'admin' puede listar/crear/editar/eliminar a gusto.
// Podés ajustar políticas a tu gusto según el TP.

usuariosRouter.use(usarPassport('jwt'), requiereRoles(['admin']));

// CREATE
usuariosRouter.post('/', async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body;
        if (!password) return res.status(400).json({ status: 'error', error: 'password requerida' });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const creado = await UsuarioModelo.create({
            first_name,
            last_name,
            email,
            age,
            password: hash,
            cart,
            role: role || 'user'
        });

        res.status(201).json({ status: 'success', payload: creado });
    } catch (err) {
        next(err);
    }
});

// READ (lista)
usuariosRouter.get('/', async (req, res, next) => {
    try {
        const usuarios = await UsuarioModelo.find().populate('cart');
        res.json({ status: 'success', payload: usuarios });
    } catch (err) {
        next(err);
    }
});

// READ (detalle)
usuariosRouter.get('/:id', async (req, res, next) => {
    try {
        const u = await UsuarioModelo.findById(req.params.id).populate('cart');
        if (!u) return res.status(404).json({ status: 'error', error: 'No encontrado' });
        res.json({ status: 'success', payload: u });
    } catch (err) {
        next(err);
    }
});

// UPDATE
usuariosRouter.put('/:id', async (req, res, next) => {
    try {
        const datos = { ...req.body };
        // si envían password, re-hashear
        if (datos.password) {
            const salt = bcrypt.genSaltSync(10);
            datos.password = bcrypt.hashSync(datos.password, salt);
        }
        const actualizado = await UsuarioModelo.findByIdAndUpdate(req.params.id, datos, {
            new: true,
            runValidators: true
        });
        if (!actualizado) return res.status(404).json({ status: 'error', error: 'No encontrado' });
        res.json({ status: 'success', payload: actualizado });
    } catch (err) {
        next(err);
    }
});

// DELETE
usuariosRouter.delete('/:id', async (req, res, next) => {
    try {
        const borrado = await UsuarioModelo.findByIdAndDelete(req.params.id);
        if (!borrado) return res.status(404).json({ status: 'error', error: 'No encontrado' });
        res.json({ status: 'success', payload: borrado._id });
    } catch (err) {
        next(err);
    }
});
