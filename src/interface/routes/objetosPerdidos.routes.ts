import { Router } from 'express';
import { PrismaObjetosPerdidosRepository } from '../../infrastructure/prisma/PrismaObjetosPerdidosRepository.ts';
import { ListarObjetosPerdidos } from '../../application/use-cases/ListarObjetosPerdidos.ts';
import { ObtenerObjetoPerdido } from '../../application/use-cases/ObtenerObjetoPerdido.ts';
import { ObjetosPerdidosController } from '../controllers/ObjetosPerdidosController.ts';
import { CrearObjetoPerdido } from '../../application/use-cases/CrearObjetoPerdido.ts';

const repository = new PrismaObjetosPerdidosRepository();
const listarObjetosPerdidos = new ListarObjetosPerdidos(repository);
const obtenerObjetoPerdido = new ObtenerObjetoPerdido(repository);
const crearObjetoPerdido = new CrearObjetoPerdido(repository);

const controller = new ObjetosPerdidosController(listarObjetosPerdidos, obtenerObjetoPerdido,crearObjetoPerdido,);
export const objetosPerdidosRoutes = Router();


objetosPerdidosRoutes.get(
  '/objetos-perdidos',
  controller.listar.bind(controller),
);

objetosPerdidosRoutes.get(
  '/objetos-perdidos/:id',
  controller.obtenerPorId.bind(controller),
);

objetosPerdidosRoutes.post(
  '/objetos-perdidos',
  controller.crear.bind(controller),
);