// este archivo repositorio es como la entrada a los datos

import type { CategoriaObjeto, ObjetoPerdido } from "../entities/ObjetoPerdido.ts";

export interface FiltrosObjetosPerdidos{
    categoria?: CategoriaObjeto;
    estado?: 'EN_BODEGA' | 'ENTREGADO';
    dia_id?: number;
    zona_id?: number;
    page: number;
    limit: number;
}

// Datos para crear el objeto perdido, donde son estos los que puede enviar el cliente
export interface DatosCrearObjetoPerdido{
    descripcion:string; 
    categoria:CategoriaObjeto; 
    zona_id:number; 
    dia_id:number; 
    voluntario_id:number; 
}

// Datos para actualizar, donde incluye los campos editables definidos en el cto.
export interface DatosActualizarObjetoPerdido {
  descripcion?: string;
  categoria?: CategoriaObjeto;
  zona_id?: number;
}

// interfaz del repo
export interface IObjetosPerdidosRepository {
  listar(
    filtros: FiltrosObjetosPerdidos,
  ): Promise<{
    data: ObjetoPerdido[];
    total: number;
  }>;

  obtenerPorId(id: number): Promise<ObjetoPerdido | null>;

  crear(datos: DatosCrearObjetoPerdido): Promise<ObjetoPerdido>;

  actualizar(
    id: number,
    datos: DatosActualizarObjetoPerdido,
  ): Promise<ObjetoPerdido | null>;

  borrarLogicamente(id: number): Promise<ObjetoPerdido | null>;

  existeZona(id: number): Promise<boolean>;

  existeDia(id: number): Promise<boolean>;

  existeVoluntario(id: number): Promise<boolean>;

  obtenerDocumentoAsistente(id: number): Promise<string | null>;
} 