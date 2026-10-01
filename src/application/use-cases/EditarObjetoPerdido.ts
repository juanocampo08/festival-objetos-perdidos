import type { ObjetoPerdido } from '../../domain/entities/ObjetoPerdido.ts';
import type {
  DatosActualizarObjetoPerdido,
  IObjetosPerdidosRepository,
} from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import { ApplicationError } from '../errors/ApplicationError.ts';

export class EditarObjetoPerdido {
  private readonly repository: IObjetosPerdidosRepository;

  constructor(repository: IObjetosPerdidosRepository) {
    this.repository = repository;
  }

  async execute(
    id: number,
    datos: DatosActualizarObjetoPerdido,
  ): Promise<ObjetoPerdido> {
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
        'Un objeto entregado no se puede editar',
      );
    }

    const camposPermitidos = [
      'descripcion',
      'categoria',
      'zona_id',
    ];

    const camposEnviados = Object.keys(datos);

    if (
      camposEnviados.length === 0 ||
      camposEnviados.some(
        (campo) => !camposPermitidos.includes(campo),
      )
    ) {
      throw new ApplicationError(
        400,
        'Solo se pueden editar descripcion, categoria y zona_id',
      );
    }

    if (
      datos.descripcion !== undefined &&
      (typeof datos.descripcion !== 'string' ||
        datos.descripcion.trim().length < 5 ||
        datos.descripcion.trim().length > 300)
    ) {
      throw new ApplicationError(
        400,
        'La descripcion debe tener entre 5 y 300 caracteres',
      );
    }

    const categoriasValidas = [
      'DOCUMENTOS',
      'ELECTRONICOS',
      'ROPA',
      'ACCESORIOS',
      'OTROS',
    ];

    if (
      datos.categoria !== undefined &&
      !categoriasValidas.includes(datos.categoria)
    ) {
      throw new ApplicationError(
        400,
        'La categoria no es valida',
      );
    }

    if (
      datos.zona_id !== undefined &&
      (!Number.isInteger(datos.zona_id) ||
        datos.zona_id <= 0)
    ) {
      throw new ApplicationError(
        400,
        'zona_id debe ser un entero positivo',
      );
    }

    if (
      datos.zona_id !== undefined &&
      !(await this.repository.existeZona(datos.zona_id))
    ) {
      throw new ApplicationError(
        404,
        'La zona no existe',
      );
    }

    return this.repository.actualizar(id, {
      ...datos,
      descripcion: datos.descripcion?.trim(),
    }) as Promise<ObjetoPerdido>;
  }
}