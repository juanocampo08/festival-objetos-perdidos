import { Router } from 'express';
import { PrismaObjetosPerdidosRepository } from '../../infrastructure/prisma/PrismaObjetosPerdidosRepository.ts';
import { ListarObjetosPerdidos } from '../../application/use-cases/ListarObjetosPerdidos.ts';
import { ObtenerObjetoPerdido } from '../../application/use-cases/ObtenerObjetoPerdido.ts';
import { ObjetosPerdidosController } from '../controllers/ObjetosPerdidosController.ts';

const repository = new PrismaObjetosPerdidosRepository();
const listarObjetosPerdidos = new ListarObjetosPerdidos(repository);
const obtenerObjetoPerdido = new ObtenerObjetoPerdido(repository);

const controller = new ObjetosPerdidosController(listarObjetosPerdidos, obtenerObjetoPerdido,);
export const objetosPerdidosRoutes = Router();

objetosPerdidosRoutes.get(
  '/objetos-perdidos',
  controller.listar.bind(controller),
);

objetosPerdidosRoutes.get(
  '/objetos-perdidos/:id',
  controller.obtenerPorId.bind(controller),
);