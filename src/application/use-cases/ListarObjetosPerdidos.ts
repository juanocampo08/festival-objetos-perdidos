import type { ObjetoPerdido } from '../../domain/entities/ObjetoPerdido.ts';
import type {FiltrosObjetosPerdidos, IObjetosPerdidosRepository,
} from '../../domain/repositories/IObjetosPerdidosRepository.ts';

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