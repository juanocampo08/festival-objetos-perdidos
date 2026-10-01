import { Router } from 'express';
import { PrismaObjetosPerdidosRepository } from '../../infrastructure/prisma/PrismaObjetosPerdidosRepository.ts';
import { ListarObjetosPerdidos } from '../../application/use-cases/ListarObjetosPerdidos.ts';
import { ObjetosPerdidosController } from '../controllers/ObjetosPerdidosController.ts';

const repository = new PrismaObjetosPerdidosRepository();
const listarObjetosPerdidos = new ListarObjetosPerdidos(repository);
const controller = new ObjetosPerdidosController(listarObjetosPerdidos);

export const objetosPerdidosRoutes = Router();

objetosPerdidosRoutes.get(
  '/objetos-perdidos',
  controller.listar.bind(controller),
);