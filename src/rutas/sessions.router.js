import { Router } from 'express';
import bcrypt from 'bcrypt';
import { UsuarioModelo } from '../modelos/usuario.model.js';
import { CarritoModelo } from '../modelos/carrito.model.js';
import { generarToken } from '../utils/jwt.js';
import { usarPassport } from '../middlewares/auth.js';

export const sessionsRouter = Router();

/**
 * POST /api/sessions/register
 * Crea usuario (pass hasheada) y carrito vacío
 */
sessionsRouter.post('/register', async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        if (!first_name || !last_name || !email || !password || typeof age !== 'number') {
            return res.status(400).json({ status: 'error', error: 'Faltan campos requeridos' });
        }

        const existe = await UsuarioModelo.findOne({ email });
        if (existe) {
            return res.status(400).json({ status: 'error', error: 'Email ya registrado' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const carrito = await CarritoModelo.create({ productos: [] });

        const nuevo = await UsuarioModelo.create({
            first_name,
            last_name,
            email,
            age,
            password: hash,
            cart: carrito._id,
            role: role || 'user'
        });

        return res.status(201).json({ status: 'success', payload: { uid: nuevo._id } });
    } catch (err) {
        next(err);
    }
});

// Login (manual) + JWT — fuerza traer password si el schema lo tiene select:false
sessionsRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ status: 'error', error: 'Faltan email o password' });

    // ¡OJO!: .select('+password') para que venga el hash
    const usuario = await UsuarioModelo.findOne({ email }).select('+password');
    if (!usuario)
      return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });

    const hash = usuario.password || '';
    const ok = typeof hash === 'string' && hash.startsWith('$2') && bcrypt.compareSync(password, hash);
    if (!ok)
      return res.status(401).json({ status: 'error', error: 'Credenciales inválidas' });

    const token = generarToken({
      uid: usuario._id.toString(),
      role: usuario.role,
      email: usuario.email
    });

    return res.json({ status: 'success', token });
  } catch (e) {
    console.error('Error en /login:', e);
    return res.status(500).json({ status: 'error', error: 'No se pudo iniciar sesión' });
  }
});
/**
 * GET /api/sessions/current
 * Valida JWT y devuelve el usuario asociado
 * Nota: la estrategia 'jwt' ya coloca el documento de usuario en req.user
 */
sessionsRouter.get('/current', usarPassport('jwt'), async (req, res, next) => {
    try {
        const u = req.user; // viene desde la estrategia JWT (UsuarioModelo poblado si así se configuró)
        if (!u) {
            return res.status(401).json({ status: 'error', error: 'No autorizado' });
        }

        return res.json({
            status: 'success',
            user: {
                id: u._id,
                first_name: u.first_name,
                last_name: u.last_name,
                email: u.email,
                age: u.age,
                role: u.role,
                cart: u.cart
            }
        });
    } catch (err) {
        next(err);
    }
});

export default sessionsRouter;
