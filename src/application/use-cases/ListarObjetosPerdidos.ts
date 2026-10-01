import type { ObjetoPerdido } from '../../domain/entities/ObjetoPerdido.ts';
import type {FiltrosObjetosPerdidos, IObjetosPerdidosRepository,
} from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import { ApplicationError } from '../errors/ApplicationError.ts';

export interface ResultadoListadoObjetosPerdidos { pagination: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
  data: ObjetoPerdido[];
}

export class ListarObjetosPerdidos { private readonly repository: IObjetosPerdidosRepository;

  constructor(repository: IObjetosPerdidosRepository) {
    this.repository = repository;
  }

  async execute(
    filtros: FiltrosObjetosPerdidos,
  ): Promise<ResultadoListadoObjetosPerdidos> {
    if (
      !Number.isInteger(filtros.page) ||
      filtros.page <= 0 ||
      !Number.isInteger(filtros.limit) ||
      filtros.limit <= 0 ||
      filtros.limit > 50
    ) {
      throw new ApplicationError(
        400,
        'page y limit deben ser enteros positivos; limit no puede superar 50',
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
      filtros.categoria !== undefined &&
      !categoriasValidas.includes(filtros.categoria)
    ) {
      throw new ApplicationError(
        400,
        'La categoria no es valida',
      );
    }

    const estadosValidos = ['EN_BODEGA', 'ENTREGADO'];

    if (
      filtros.estado !== undefined &&
      !estadosValidos.includes(filtros.estado)
    ) {
      throw new ApplicationError(
        400,
        'El estado no es valido',
      );
    }

    if (
      filtros.dia_id !== undefined &&
      (!Number.isInteger(filtros.dia_id) || filtros.dia_id <= 0)
    ) {
      throw new ApplicationError(
        400,
        'dia_id debe ser un entero positivo',
      );
    }

    if (
      filtros.zona_id !== undefined &&
      (!Number.isInteger(filtros.zona_id) || filtros.zona_id <= 0)
    ) {
      throw new ApplicationError(
        400,
        'zona_id debe ser un entero positivo',
      );
    }

    const { data, total } = await this.repository.listar(filtros);

    return {
      pagination: {
        total,
        currentPage: filtros.page,
        limit: filtros.limit,
        totalPages: Math.ceil(total / filtros.limit),
      },
      data,
    };
  }
}