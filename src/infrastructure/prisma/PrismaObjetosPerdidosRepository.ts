// aca se crea la implementación de la interfaz...

import { prisma } from '../database/prisma.ts';
import type {
  DatosActualizarObjetoPerdido,
  DatosCrearObjetoPerdido,
  FiltrosObjetosPerdidos,
  IObjetosPerdidosRepository,
} from '../../domain/repositories/IObjetosPerdidosRepository.ts';
import type { ObjetoPerdido } from '../../domain/entities/ObjetoPerdido.ts';

export class PrismaObjetosPerdidosRepository
    implements IObjetosPerdidosRepository {
        // esto le dice a prisma que busque la fila cuyo id sea este
        async obtenerPorId(id: number): Promise<ObjetoPerdido | null> {
            const row = await prisma.objetos_perdidos.findUnique({
                where: { id },
            });
            
            // objeto marcado como removed o null se trata como nul/no disponible
            if (row === null || row.state === 'REMOVED') {
                return null;
            }
            
            // eso construye un nuevo objeto del dominio
            return {
                id: row.id,
                descripcion: row.descripcion,
                categoria: row.categoria as ObjetoPerdido['categoria'],
                zona_id: row.zona_id,
                dia_id: row.dia_id,
                voluntario_id: row.voluntario_id,
                estado: row.estado as ObjetoPerdido['estado'],
                reclamado_por_asistente_id: row.reclamado_por_asistente_id,
                fecha_entrega: row.fecha_entrega,
                state: row.state as ObjetoPerdido['state'],
                created_at: row.created_at,
                updated_at: row.updated_at,
                };
            }
            
        async existeZone(id:number): Promise<boolean> {
            const zona = await prisma.zonas.findUnique({
                where: {id},
                select: {id:true},
            });
            return zona !== null;
        }

        async existeDia(id:number): Promise<boolean> {
            const dia = await prisma.dias.findUnique({
                where: {id},
                select: {id:true},
            });
            return dia !== null;
        }

        async existeVoluntario(id: number): Promise<boolean> {
            const voluntario = await prisma.voluntarios.findUnique({
                where: {id},
                select: {id:true}
            });
            return voluntario !== null;
        }

        async obtenerDocumentoAsistente(id: number): Promise<string | null> {
            const asistente = await prisma.asistentes.findUnique({
                where: { id },
                select: { documento: true },
            });
            return asistente?.documento ?? null;
            }
        
}