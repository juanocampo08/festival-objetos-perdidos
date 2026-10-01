import cors from 'cors'; // permite peticiones externas
import dotenv from 'dotenv'; // esto sirve para leer el archivo .env
import express, { type Express, type Request, type Response } from 'express'; // crea el servidor

import { objetosPerdidosRoutes } from './interface/routes/objetosPerdidos.routes.ts';

dotenv.config(); // esto carga el .env

const app = express();  // esto crea la  aplicacion
const port = Number(process.env.PORT) || 3000; // esto lee el puerto 

app.use(cors()); // esto permite que otros clientes se comuniquen con la API
app.use(express.json()); // eso ayuda a leer el JSON
app.use('/api', objetosPerdidosRoutes);

// esto permite comprobar si el servidor esta vivo.
// el guion bajo quiere decir que no se usará por ahora la peticion
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({message: 'API funcionando'});
});

// aca se unicia la API
app.listen(port, () => {
    console.log(`API ejecutándose en http://localhost:${port}`);
});