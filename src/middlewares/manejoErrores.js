// Middleware de manejo global de errores
export default function manejoErrores(err, _req, res, _next) {
  // Log del error en consola (siempre util para debugging en servidor)
  console.error('Error:', err);

  // Determina el status HTTP, por defecto 500
  const status = err.status || 500;

  // Devuelve respuesta JSON con mensaje de error
  res.status(status).json({
    status: 'error',
    mensaje: err.message || 'Error inesperado',

    // Incluye el stack solo en entorno de desarrollo para no filtrar detalles en produccion
    detalle: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
