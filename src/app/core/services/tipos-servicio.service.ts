import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface TipoServicio {
  id?: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tiempoEstimado: number;
  costo: number;
  documentosRequeridos: string[];
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TiposServicioService {
  private tiposServicioDemo: TipoServicio[] = [
    {
      id: '1',
      codigo: 'record_notas',
      nombre: 'Récord de Notas',
      descripcion: 'Documento oficial con el historial completo de calificaciones del estudiante, incluyendo todas las materias cursadas y sus respectivas notas.',
      tiempoEstimado: 3,
      costo: 150.00,
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago'],
      activo: true
    },
    {
      id: '2',
      codigo: 'certificado_estudios',
      nombre: 'Certificado de Estudios',
      descripcion: 'Certificado oficial que acredita los estudios realizados por el estudiante, incluyendo el nivel académico alcanzado.',
      tiempoEstimado: 5,
      costo: 200.00,
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago', 'Foto 2x2'],
      activo: true
    },
    {
      id: '3',
      codigo: 'constancia_estudiante',
      nombre: 'Constancia de Estudiante',
      descripcion: 'Documento que certifica la condición de estudiante activo en la institución educativa.',
      tiempoEstimado: 2,
      costo: 100.00,
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago'],
      activo: true
    },
    {
      id: '4',
      codigo: 'carta_presentacion',
      nombre: 'Carta de Presentación',
      descripcion: 'Carta oficial de presentación del estudiante para fines académicos o profesionales.',
      tiempoEstimado: 3,
      costo: 75.00,
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago'],
      activo: true
    },
    {
      id: '5',
      codigo: 'certificado_conducta',
      nombre: 'Certificado de Conducta',
      descripcion: 'Certificado que acredita la buena conducta del estudiante durante su permanencia en la institución.',
      tiempoEstimado: 5,
      costo: 125.00,
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago', 'Foto 2x2'],
      activo: true
    },
    {
      id: '6',
      codigo: 'historial_academico',
      nombre: 'Historial Académico',
      descripcion: 'Historial académico completo con todas las materias cursadas, calificaciones obtenidas y pensum académico.',
      tiempoEstimado: 7,
      costo: 300.00,
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago', 'Solicitud firmada'],
      activo: true
    },
    {
      id: '7',
      codigo: 'titulo_bachiller',
      nombre: 'Título de Bachiller',
      descripcion: 'Título oficial de bachiller debidamente legalizado y apostillado.',
      tiempoEstimado: 15,
      costo: 500.00,
      documentosRequeridos: ['Cédula de identidad', 'Acta de nacimiento', 'Fotos 2x2', 'Recibo de pago'],
      activo: true
    },
    {
      id: '8',
      codigo: 'legalizacion_documentos',
      nombre: 'Legalización de Documentos',
      descripcion: 'Servicio de legalización y apostillado de documentos académicos para uso internacional.',
      tiempoEstimado: 10,
      costo: 250.00,
      documentosRequeridos: ['Documentos originales', 'Cédula de identidad', 'Recibo de pago'],
      activo: true
    },
    {
      id: '9',
      codigo: 'cambio_carrera',
      nombre: 'Cambio de Carrera',
      descripcion: 'Solicitud formal para cambio de carrera universitaria, incluyendo evaluación de materias convalidables.',
      tiempoEstimado: 20,
      costo: 1000.00,
      documentosRequeridos: ['Cédula de identidad', 'Récord de notas', 'Carta de motivos', 'Recibo de pago'],
      activo: true
    },
    {
      id: '10',
      codigo: 'retiro_asignatura',
      nombre: 'Retiro de Asignatura',
      descripcion: 'Solicitud de retiro oficial de una o varias asignaturas del período académico actual.',
      tiempoEstimado: 3,
      costo: 50.00,
      documentosRequeridos: ['Cédula de identidad', 'Justificación', 'Recibo de pago'],
      activo: true
    },
    {
      id: '11',
      codigo: 'solicitud_beca',
      nombre: 'Solicitud de Beca',
      descripcion: 'Solicitud de beca estudiantil por excelencia académica, situación socioeconómica o mérito deportivo.',
      tiempoEstimado: 30,
      costo: 0.00,
      documentosRequeridos: ['Cédula de identidad', 'Récord de notas', 'Declaración de ingresos', 'Carta de motivos'],
      activo: true
    },
    {
      id: '12',
      codigo: 'reposicion_carnet',
      nombre: 'Reposición de Carnet',
      descripcion: 'Reposición de carnet estudiantil por pérdida, robo o deterioro del documento original.',
      tiempoEstimado: 5,
      costo: 200.00,
      documentosRequeridos: ['Cédula de identidad', 'Foto 2x2', 'Recibo de pago', 'Declaración jurada'],
      activo: true
    }
  ];

  constructor(private supabase: SupabaseService) {}

  obtenerTiposServicio(): Observable<TipoServicio[]> {
    // Usar solo datos demo para evitar errores de conectividad
    return of([...this.tiposServicioDemo]);
  }

  obtenerTipoServicioPorCodigo(codigo: string): Observable<TipoServicio | null> {
    // Usar solo datos demo para evitar errores de conectividad
    const tipo = this.tiposServicioDemo.find(t => t.codigo === codigo);
    return of(tipo || null);
  }

  // Método para verificar conectividad (mantenido para compatibilidad futura)
  verificarConectividad(): Observable<boolean> {
    return of(false); // Siempre retorna false para usar modo offline
  }

  // Mapear datos de Supabase a modelo TipoServicio (mantenido para compatibilidad futura)
  private mapToTipoServicio(data: any): TipoServicio {
    return {
      id: data.id,
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      tiempoEstimado: data.tiempo_estimado,
      costo: data.costo,
      documentosRequeridos: data.documentos_requeridos || [],
      activo: data.activo
    };
  }
}