import type { ObjetoPerdido } from '../../domain/entities/ObjetoPerdido.ts';
import type { IObjetosPerdidosRepository } from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import { ApplicationError } from '../errors/ApplicationError.ts';

export class EliminarObjetoPerdido {
  private readonly repository: IObjetosPerdidosRepository;

  constructor(repository: IObjetosPerdidosRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<ObjetoPerdido> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApplicationError(
        400,
        'El id debe ser un entero positivo',
      );
    }

    const objeto = await this.repository.obtenerPorId(id);

    if (objeto === null) {
      throw new ApplicationError(
        404,
        'Objeto perdido no encontrado',
      );
    }

    if (objeto.estado === 'ENTREGADO') {
      throw new ApplicationError(
        409,
        'Un objeto entregado no se puede eliminar',
      );
    }

    const eliminado = await this.repository.borrarLogicamente(id);

    if (eliminado === null) {
      throw new ApplicationError(
        404,
        'Objeto perdido no encontrado',
      );
    }

    return eliminado;
  }
}