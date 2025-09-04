// src/rutas/sessions.router.js
import { Router } from 'express';
import passport from 'passport';
import {
  iniciarSesion,
  usuarioActual,
  cerrarSesion,
  solicitarResetPassword,
  resetPassword,
} from '../controladores/sesiones.controlador.js';
import { requiereUsuario } from '../middlewares/auth.js';

const router = Router();

/* Login (JWT -> cookie) */
router.post('/login', passport.authenticate('login', { session: false }), iniciarSesion);

/* Usuario actual (DTO, sin datos sensibles) */
router.get('/current', requiereUsuario, usuarioActual);

/* Logout (limpia cookie) */
router.post('/logout', cerrarSesion);

/* Forgot password (envía mail con link 1h) */
router.post('/forgot-password', solicitarResetPassword);

/* Reset password (GET) -> formulario mínimo que POSTea al endpoint real */
router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Falta token');

  // HTML inline, sin recursos externos (evita CSP). Usa urlencoded (app ya tiene express.urlencoded()).
  res.type('html').send(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Restablecer contraseña</title>
  <style>
    :root { --bg:#f6f7fb; --card:#fff; --txt:#111827; --muted:#6b7280; --bd:#e5e7eb; --btn:#2563eb; --btnh:#1e40af; }
    body { margin:0; font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; background:var(--bg); }
    .box { max-width:420px; margin:8vh auto; background:var(--card); padding:24px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,.08); border:1px solid var(--bd); }
    h1 { margin:0 0 10px; font-size:20px; color:var(--txt); }
    p { margin:0 0 14px; color:var(--muted); }
    label { display:block; font-weight:600; margin:14px 0 6px; color:var(--txt); }
    input[type=password] { width:100%; padding:10px 12px; border:1px solid var(--bd); border-radius:8px; font-size:14px; }
    button { width:100%; margin-top:16px; padding:12px; border:0; border-radius:10px; font-weight:700; color:#fff; background:var(--btn); cursor:pointer; }
    button:hover { background:var(--btnh); }
  </style>
</head>
<body>
  <div class="box">
    <h1>Restablecer contraseña</h1>
    <p>Ingresá tu nueva contraseña. El enlace vence en 1 hora.</p>
    <form method="POST" action="/api/sessions/reset-password" autocomplete="off">
      <input type="hidden" name="token" value="${token}" />
      <label for="pwd">Nueva contraseña</label>
      <input id="pwd" name="nuevaPassword" type="password" minlength="6" required />
      <button type="submit">Cambiar contraseña</button>
    </form>
    <p style="margin-top:10px">Si el enlace venció, solicitá uno nuevo.</p>
  </div>
</body>
</html>`);
});

/* Reset password (POST) -> aplica cambio */
router.post('/reset-password', resetPassword);

export default router;
