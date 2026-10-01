import type {
  CategoriaObjeto,
  ObjetoPerdido,
} from '../../domain/entities/ObjetoPerdido.ts';
import type {
  DatosCrearObjetoPerdido,
  IObjetosPerdidosRepository,
} from '../../domain/repositories/IObjetosPerdidosRepository.ts';

import { ApplicationError } from '../errors/ApplicationError.ts';

export class CrearObjetoPerdido {
  private readonly repository: IObjetosPerdidosRepository;

  constructor(repository: IObjetosPerdidosRepository) {
    this.repository = repository;
  }

  async execute(
    datos: DatosCrearObjetoPerdido,
  ): Promise<ObjetoPerdido> {
    if (
      !datos ||
      typeof datos.descripcion !== 'string' ||
      datos.descripcion.trim().length < 5 ||
      datos.descripcion.trim().length > 300
    ) {
      throw new ApplicationError(
        400,
        'La descripcion debe tener entre 5 y 300 caracteres',
      );
    }

    const categoriasValidas: CategoriaObjeto[] = [
      'DOCUMENTOS',
      'ELECTRONICOS',
      'ROPA',
      'ACCESORIOS',
      'OTROS',
    ];

    if (!categoriasValidas.includes(datos.categoria)) {
      throw new ApplicationError(
        400,
        'La categoria no es valida',
      );
    }

    if (
      !Number.isInteger(datos.zona_id) ||
      datos.zona_id <= 0 ||
      !Number.isInteger(datos.dia_id) ||
      datos.dia_id <= 0 ||
      !Number.isInteger(datos.voluntario_id) ||
      datos.voluntario_id <= 0
    ) {
      throw new ApplicationError(
        400,
        'Los IDs deben ser enteros positivos',
      );
    }

    const [zonaExiste, diaExiste, voluntarioExiste] =
      await Promise.all([
        this.repository.existeZona(datos.zona_id),
        this.repository.existeDia(datos.dia_id),
        this.repository.existeVoluntario(datos.voluntario_id),
      ]);

    if (!zonaExiste || !diaExiste || !voluntarioExiste) {
      throw new ApplicationError(
        404,
        'La zona, el dia o el voluntario no existe',
      );
    }

    return this.repository.crear({
      ...datos,
      descripcion: datos.descripcion.trim(),
    });
  }
}