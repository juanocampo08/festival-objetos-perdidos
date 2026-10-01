import type { ObjetoPerdido } from '../../domain/entities/ObjetoPerdido.ts';
import type { IObjetosPerdidosRepository } from '../../domain/repositories/IObjetosPerdidosRepository.ts';

export class ObtenerObjetoPerdido {
  private readonly repository: IObjetosPerdidosRepository;

  constructor(repository: IObjetosPerdidosRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<ObjetoPerdido | null> {
    return this.repository.obtenerPorId(id);
  }
}