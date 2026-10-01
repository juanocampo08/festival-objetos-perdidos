// este archivo me representa el concepto de objeto perdido dentro del negocio

export type CategoriaObjeto = 'DOCUMENTOS' | 'ELECTRONICOS' | 'ROPA' | 'ACCESORIOS' | 'OTROS';

export type EstadoObjeto = 'EN_BODEGA' | 'ENTREGADO';

export type EstadoRegistro = 'ACTIVE' | 'REMOVED';

export interface ObjetoPerdido{
    id: number;
    descripcion: string;
    categoria: CategoriaObjeto;
    zona_id: number;
    dia_id: number;
    voluntario_id: number;
    estado: EstadoObjeto;
    reclamado_por_asistente_id: number | null;
    fecha_entrega: Date | null;
    state: EstadoRegistro;
    created_at: Date;
    updated_at: Date;
}