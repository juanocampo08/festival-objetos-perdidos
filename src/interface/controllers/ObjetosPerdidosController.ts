import type { Request, Response } from 'express';
import type { FiltrosObjetosPerdidos } from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import { ListarObjetosPerdidos } from '../../application/use-cases/ListarObjetosPerdidos.ts';
import { ObtenerObjetoPerdido } from '../../application/use-cases/ObtenerObjetoPerdido.ts';

export class ObjetosPerdidosController {
    private readonly listarObjetosPerdidos: ListarObjetosPerdidos;
    private readonly obtenerObjetoPerdido: ObtenerObjetoPerdido;

  constructor(
    listarObjetosPerdidos: ListarObjetosPerdidos,
    obtenerObjetoPerdido: ObtenerObjetoPerdido,
    ) {
    this.listarObjetosPerdidos = listarObjetosPerdidos;
    this.obtenerObjetoPerdido = obtenerObjetoPerdido;

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

  async obtenerPorId(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({ error: 'El id debe ser un entero positivo' });
      return;
    }

    const objeto = await this.obtenerObjetoPerdido.execute(id);

    if (objeto === null) {
      response.status(404).json({ error: 'Objeto perdido no encontrado' });
      return;
    }

    response.status(200).json({ data: objeto });
  }
}