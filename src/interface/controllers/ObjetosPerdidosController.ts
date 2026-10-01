import type { Request, Response } from 'express';
import { ListarObjetosPerdidos } from '../../application/use-cases/ListarObjetosPerdidos.ts';
import { ObtenerObjetoPerdido } from '../../application/use-cases/ObtenerObjetoPerdido.ts';
import { CrearObjetoPerdido } from '../../application/use-cases/CrearObjetoPerdido.ts';
import { EditarObjetoPerdido } from '../../application/use-cases/EditarObjetoPerdido.ts';
import { ApplicationError } from '../../application/errors/ApplicationError.ts';
import type { DatosCrearObjetoPerdido } from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import type {
  DatosActualizarObjetoPerdido,
  FiltrosObjetosPerdidos,
} from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import { EliminarObjetoPerdido } from '../../application/use-cases/EliminarObjetoPerdido.ts';

export class ObjetosPerdidosController {
    private readonly listarObjetosPerdidos: ListarObjetosPerdidos;
    private readonly obtenerObjetoPerdido: ObtenerObjetoPerdido;
    private readonly crearObjetoPerdido: CrearObjetoPerdido;
    private readonly editarObjetoPerdido: EditarObjetoPerdido;
    private readonly eliminarObjetoPerdido: EliminarObjetoPerdido;

  constructor(
    listarObjetosPerdidos: ListarObjetosPerdidos,
    obtenerObjetoPerdido: ObtenerObjetoPerdido,
    crearObjetoPerdido: CrearObjetoPerdido,
    editarObjetoPerdido: EditarObjetoPerdido,
    eliminarObjetoPerdido: EliminarObjetoPerdido,


    ) {
    this.listarObjetosPerdidos = listarObjetosPerdidos;
    this.obtenerObjetoPerdido = obtenerObjetoPerdido;
    this.crearObjetoPerdido = crearObjetoPerdido;
    this.editarObjetoPerdido = editarObjetoPerdido;
    this.eliminarObjetoPerdido = eliminarObjetoPerdido;

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

  async crear(request: Request, response: Response): Promise<void> {
    try {
      const datos = request.body as DatosCrearObjetoPerdido;
      const objeto = await this.crearObjetoPerdido.execute(datos);

      response.status(201).json({ data: objeto });
    } catch (error) {
      if (error instanceof ApplicationError) {
        response.status(error.statusCode).json({
          error: error.message,
        });
        return;
      }

      response.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }

  async editar(request: Request, response: Response): Promise<void> {
    try {
      const id = Number(request.params.id);
      const datos = request.body as DatosActualizarObjetoPerdido;

      const objeto = await this.editarObjetoPerdido.execute(id, datos);

      response.status(200).json({ data: objeto });
    } catch (error) {
      if (error instanceof ApplicationError) {
        response.status(error.statusCode).json({
          error: error.message,
        });
        return;
      }

      response.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }

  async eliminar(request: Request, response: Response): Promise<void> {
    try {
      const id = Number(request.params.id);

      const objeto = await this.eliminarObjetoPerdido.execute(id);

      response.status(200).json({
        data: objeto,
      });
    } catch (error) {
      if (error instanceof ApplicationError) {
        response.status(error.statusCode).json({
          error: error.message,
        });
        return;
      }

      response.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  }
}


