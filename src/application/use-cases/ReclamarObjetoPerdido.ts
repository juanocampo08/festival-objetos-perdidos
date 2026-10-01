import type { ObjetoPerdido } from '../../domain/entities/ObjetoPerdido.ts';
import type { IObjetosPerdidosRepository } from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import { ApplicationError } from '../errors/ApplicationError.ts';

export interface DatosReclamarObjeto {
  asistente_id: number;
  documento: string;
}

export class ReclamarObjetoPerdido {
  private readonly repository: IObjetosPerdidosRepository;

  constructor(repository: IObjetosPerdidosRepository) {
    this.repository = repository;
  }

  async execute(
    id: number,
    datos: DatosReclamarObjeto,
  ): Promise<ObjetoPerdido> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApplicationError(
        400,
        'El id debe ser un entero positivo',
      );
    }

    if (
      !datos ||
      !Number.isInteger(datos.asistente_id) ||
      datos.asistente_id <= 0 ||
      typeof datos.documento !== 'string' ||
      datos.documento.trim() === ''
    ) {
      throw new ApplicationError(
        400,
        'asistente_id y documento son obligatorios',
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
        'El objeto ya fue entregado',
      );
    }

    const documentoReal =
      await this.repository.obtenerDocumentoAsistente(
        datos.asistente_id,
      );

    if (documentoReal === null) {
      throw new ApplicationError(
        404,
        'El asistente no existe',
      );
    }

    if (documentoReal !== datos.documento.trim()) {
      throw new ApplicationError(
        409,
        'El documento no coincide con el asistente',
      );
    }

    const entregado = await this.repository.reclamar(
      id,
      datos.asistente_id,
      new Date(),
    );

    if (entregado === null) {
      throw new ApplicationError(
        404,
        'Objeto perdido no encontrado',
      );
    }

    return entregado;
  }
}