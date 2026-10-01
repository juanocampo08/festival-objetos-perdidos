import type { Request, Response } from 'express';
import type { FiltrosObjetosPerdidos } from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import { ListarObjetosPerdidos } from '../../application/use-cases/ListarObjetosPerdidos.ts';

export class ObjetosPerdidosController {
    private readonly listarObjetosPerdidos: ListarObjetosPerdidos;

  constructor(listarObjetosPerdidos: ListarObjetosPerdidos) {
    this.listarObjetosPerdidos = listarObjetosPerdidos;
  }

  async listar(request: Request, response: Response): Promise<void> {
    const page = Number(request.query.page ?? 1);
    const limit = Number(request.query.limit ?? 10);

    const filtros: FiltrosObjetosPerdidos = {
      page,
      limit,
      categoria: request.query.categoria as FiltrosObjetosPerdidos['categoria'],
      estado: request.query.estado as FiltrosObjetosPerdidos['estado'],
      dia_id: request.query.dia_id
        ? Number(request.query.dia_id)
        : undefined,
      zona_id: request.query.zona_id
        ? Number(request.query.zona_id)
        : undefined,
    };
    const resultado = await this.listarObjetosPerdidos.execute(filtros);

    response.status(200).json(resultado);
  }
}