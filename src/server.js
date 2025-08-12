import { crearApp } from './app.js';
import { config } from './config/config.js';
import 'dotenv/config'; 

const bootstrap = async () => {
    const app = await crearApp();
    app.listen(config.port, () => {
        console.log(`Servidor escuchando en http://localhost:${config.port}`);
    });
};

bootstrap().catch((e) => {
    console.error('Fallo en el arranque:', e);
    process.exit(1);
});
