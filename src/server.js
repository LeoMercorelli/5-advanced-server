import app from './app.js';
import { config } from './config/config.js';

// Inicia el servidor Express en el puerto configurado
app.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port}`);
});
