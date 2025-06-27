import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Solicitud, EstadoSolicitud, TipoServicio, Prioridad } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private solicitudesDemo: Solicitud[] = [
    {
      id: '1',
      numero: 'SOL-2024-789456',
      estudiante: {
        nombre: 'María',
        apellido: 'González Pérez',
        cedula: '001-1234567-8',
        matricula: '2021-0145',
        carrera: 'Ingeniería en Sistemas',
        telefono: '(809) 555-0123',
        email: 'maria.gonzalez@estudiante.edu.do'
      },
      tipoServicio: 'record_notas' as any,
      descripcion: 'Solicito récord de notas completo para proceso de beca de estudios en el extranjero. Necesito que incluya todas las materias cursadas desde el primer semestre.',
      fechaSolicitud: new Date('2024-06-20'),
      fechaLimiteEsperada: new Date('2024-06-25'),
      fechaCompletada: new Date('2024-06-23'),
      estado: EstadoSolicitud.ENTREGADA,
      prioridad: Prioridad.ALTA,
      tiempoRespuesta: 3,
      observaciones: 'Documento entregado exitosamente. Estudiante confirmó recepción.',
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago'],
      documentosEntregados: ['Cédula de identidad', 'Recibo de pago'],
      responsableAsignado: 'Ana Rodríguez',
      etapas: [],
      costoServicio: 150.00
    },
    {
      id: '2',
      numero: 'SOL-2024-789457',
      estudiante: {
        nombre: 'Carlos',
        apellido: 'Rodríguez Martínez',
        cedula: '001-2345678-9',
        matricula: '2020-0298',
        carrera: 'Administración de Empresas',
        telefono: '(829) 555-0456',
        email: 'carlos.rodriguez@estudiante.edu.do'
      },
      tipoServicio: 'certificado_estudios' as any,
      descripcion: 'Necesito certificado de estudios para solicitud de empleo en empresa multinacional. Requiere apostillado.',
      fechaSolicitud: new Date('2024-06-22'),
      fechaLimiteEsperada: new Date('2024-06-29'),
      estado: EstadoSolicitud.EN_PROCESO,
      prioridad: Prioridad.NORMAL,
      observaciones: 'En proceso de revisión por el departamento académico.',
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago', 'Foto 2x2'],
      documentosEntregados: ['Cédula de identidad', 'Recibo de pago'],
      responsableAsignado: 'Luis Fernández',
      etapas: [],
      costoServicio: 200.00
    },
    {
      id: '3',
      numero: 'SOL-2024-789458',
      estudiante: {
        nombre: 'Ana',
        apellido: 'Martínez López',
        cedula: '001-3456789-0',
        matricula: '2022-0087',
        carrera: 'Psicología Clínica',
        telefono: '(849) 555-0789',
        email: 'ana.martinez@estudiante.edu.do'
      },
      tipoServicio: 'constancia_estudiante' as any,
      descripcion: 'Constancia de estudiante regular para solicitud de descuento estudiantil en transporte público.',
      fechaSolicitud: new Date('2024-06-24'),
      fechaLimiteEsperada: new Date('2024-06-26'),
      estado: EstadoSolicitud.COMPLETADA,
      prioridad: Prioridad.NORMAL,
      observaciones: 'Documento listo para entrega.',
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago'],
      documentosEntregados: ['Cédula de identidad', 'Recibo de pago'],
      responsableAsignado: 'Carmen Jiménez',
      etapas: [],
      costoServicio: 100.00
    },
    {
      id: '4',
      numero: 'SOL-2024-789459',
      estudiante: {
        nombre: 'Luis',
        apellido: 'Pérez Santos',
        cedula: '001-4567890-1',
        matricula: '2019-0156',
        carrera: 'Derecho',
        telefono: '(809) 555-0321',
        email: 'luis.perez@estudiante.edu.do'
      },
      tipoServicio: 'carta_presentacion' as any,
      descripcion: 'Carta de presentación para práctica profesional en bufete de abogados reconocido.',
      fechaSolicitud: new Date('2024-06-21'),
      fechaLimiteEsperada: new Date('2024-06-24'),
      fechaCompletada: new Date('2024-06-23'),
      estado: EstadoSolicitud.ENTREGADA,
      prioridad: Prioridad.ALTA,
      tiempoRespuesta: 2,
      observaciones: 'Carta entregada. Estudiante muy satisfecho con el servicio.',
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago'],
      documentosEntregados: ['Cédula de identidad', 'Recibo de pago'],
      responsableAsignado: 'Roberto Díaz',
      etapas: [],
      costoServicio: 75.00
    },
    {
      id: '5',
      numero: 'SOL-2024-789460',
      estudiante: {
        nombre: 'Carmen',
        apellido: 'Jiménez Vargas',
        cedula: '001-5678901-2',
        matricula: '2021-0234',
        carrera: 'Medicina',
        telefono: '(829) 555-0654',
        email: 'carmen.jimenez@estudiante.edu.do'
      },
      tipoServicio: 'certificado_conducta' as any,
      descripcion: 'Certificado de conducta para solicitud de residencia médica en hospital universitario.',
      fechaSolicitud: new Date('2024-06-25'),
      fechaLimiteEsperada: new Date('2024-07-02'),
      estado: EstadoSolicitud.EN_REVISION,
      prioridad: Prioridad.ALTA,
      observaciones: 'Pendiente de revisión final por el decano.',
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago', 'Foto 2x2'],
      documentosEntregados: ['Cédula de identidad', 'Recibo de pago', 'Foto 2x2'],
      responsableAsignado: 'Dr. Miguel Torres',
      etapas: [],
      costoServicio: 125.00
    },
    {
      id: '6',
      numero: 'SOL-2024-789461',
      estudiante: {
        nombre: 'Roberto',
        apellido: 'Díaz Herrera',
        cedula: '001-6789012-3',
        matricula: '2020-0345',
        carrera: 'Ingeniería Civil',
        telefono: '(849) 555-0987',
        email: 'roberto.diaz@estudiante.edu.do'
      },
      tipoServicio: 'historial_academico' as any,
      descripcion: 'Historial académico completo para solicitud de maestría en universidad extranjera. Debe incluir pensum y calificaciones detalladas.',
      fechaSolicitud: new Date('2024-06-23'),
      fechaLimiteEsperada: new Date('2024-07-05'),
      estado: EstadoSolicitud.PENDIENTE_DOCUMENTOS,
      prioridad: Prioridad.NORMAL,
      observaciones: 'Falta entregar solicitud firmada por el estudiante.',
      documentosRequeridos: ['Cédula de identidad', 'Recibo de pago', 'Solicitud firmada'],
      documentosEntregados: ['Cédula de identidad', 'Recibo de pago'],
      responsableAsignado: 'Ing. Patricia Morales',
      etapas: [],
      costoServicio: 300.00
    },
    {
      id: '7',
      numero: 'SOL-2024-789462',
      estudiante: {
        nombre: 'Patricia',
        apellido: 'Morales Cruz',
        cedula: '001-7890123-4',
        matricula: '2022-0123',
        carrera: 'Arquitectura',
        telefono: '(809) 555-0147',
        email: 'patricia.morales@estudiante.edu.do'
      },
      tipoServicio: 'reposicion_carnet' as any,
      descripcion: 'Reposición de carnet estudiantil extraviado durante viaje de estudios.',
      fechaSolicitud: new Date('2024-06-26'),
      fechaLimiteEsperada: new Date('2024-07-01'),
      estado: EstadoSolicitud.RECIBIDA,
      prioridad: Prioridad.NORMAL,
      observaciones: 'Solicitud recibida, pendiente de procesamiento.',
      documentosRequeridos: ['Cédula de identidad', 'Foto 2x2', 'Recibo de pago', 'Declaración jurada'],
      documentosEntregados: ['Cédula de identidad', 'Foto 2x2'],
      responsableAsignado: 'María Fernández',
      etapas: [],
      costoServicio: 200.00
    },
    {
      id: '8',
      numero: 'SOL-2024-789463',
      estudiante: {
        nombre: 'Miguel',
        apellido: 'Torres Ramírez',
        cedula: '001-8901234-5',
        matricula: '2021-0456',
        carrera: 'Contabilidad',
        telefono: '(829) 555-0258',
        email: 'miguel.torres@estudiante.edu.do'
      },
      tipoServicio: 'solicitud_beca' as any,
      descripcion: 'Solicitud de beca por excelencia académica. Promedio actual: 3.85/4.00. Situación económica familiar difícil.',
      fechaSolicitud: new Date('2024-06-19'),
      fechaLimiteEsperada: new Date('2024-07-15'),
      estado: EstadoSolicitud.EN_PROCESO,
      prioridad: Prioridad.ALTA,
      observaciones: 'En evaluación por el comité de becas.',
      documentosRequeridos: ['Cédula de identidad', 'Récord de notas', 'Declaración de ingresos', 'Carta de motivos'],
      documentosEntregados: ['Cédula de identidad', 'Récord de notas', 'Declaración de ingresos', 'Carta de motivos'],
      responsableAsignado: 'Comité de Becas',
      etapas: [],
      costoServicio: 0.00
    }
  ];

  constructor(private supabase: SupabaseService) {}

  // Crear nueva solicitud
  crearSolicitud(solicitud: Partial<Solicitud>): Observable<Solicitud> {
    const nuevaSolicitudData = {
      numero: this.generarNumeroSolicitud(),
      estudiante_nombre: solicitud.estudiante!.nombre,
      estudiante_apellido: solicitud.estudiante!.apellido,
      estudiante_cedula: solicitud.estudiante!.cedula,
      estudiante_matricula: solicitud.estudiante!.matricula,
      estudiante_carrera: solicitud.estudiante!.carrera,
      estudiante_telefono: solicitud.estudiante!.telefono,
      estudiante_email: solicitud.estudiante!.email,
      tipo_servicio: solicitud.tipoServicio,
      descripcion: solicitud.descripcion,
      fecha_limite_esperada: solicitud.fechaLimiteEsperada?.toISOString(),
      prioridad: solicitud.prioridad || 'normal',
      observaciones: solicitud.observaciones,
      documentos_requeridos: solicitud.documentosRequeridos || [],
      documentos_entregados: solicitud.documentosEntregados || [],
      responsable_asignado: solicitud.responsableAsignado,
      costo_servicio: solicitud.costoServicio
    };

    return from(this.supabase.client
      .from('solicitudes')
      .insert(nuevaSolicitudData)
      .select()
      .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error creating solicitud in Supabase:', error);
          throw error;
        }
        return this.mapToSolicitud(data);
      }),
      catchError((error) => {
        console.warn('Supabase create failed, using demo mode:', error.message);
        
        // Fallback a creación demo
        const nuevaSolicitud: Solicitud = {
          id: Date.now().toString(),
          numero: this.generarNumeroSolicitud(),
          estudiante: solicitud.estudiante!,
          tipoServicio: solicitud.tipoServicio!,
          descripcion: solicitud.descripcion!,
          fechaSolicitud: new Date(),
          fechaLimiteEsperada: solicitud.fechaLimiteEsperada,
          estado: EstadoSolicitud.RECIBIDA,
          prioridad: solicitud.prioridad || Prioridad.NORMAL,
          observaciones: solicitud.observaciones,
          documentosRequeridos: solicitud.documentosRequeridos || [],
          documentosEntregados: solicitud.documentosEntregados || [],
          responsableAsignado: solicitud.responsableAsignado,
          etapas: [],
          costoServicio: solicitud.costoServicio
        };

        this.solicitudesDemo.unshift(nuevaSolicitud);
        return of(nuevaSolicitud);
      })
    );
  }

  // Obtener todas las solicitudes
  obtenerSolicitudes(): Observable<Solicitud[]> {
    return from(this.supabase.client
      .from('solicitudes')
      .select('*')
      .order('fecha_solicitud', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching solicitudes from Supabase:', error);
          throw error;
        }
        return data.map(item => this.mapToSolicitud(item));
      }),
      catchError((error) => {
        console.warn('Supabase fetch failed, using demo data:', error.message);
        
        // Verificar si es un error de red específico
        if (error.message?.includes('Failed to fetch') || 
            error.message?.includes('NetworkError') ||
            error.message?.includes('fetch')) {
          console.warn('Network error detected, switching to offline mode');
        }
        
        // Fallback a datos demo
        return of([...this.solicitudesDemo]);
      })
    );
  }

  // Obtener solicitud por ID
  obtenerSolicitudPorId(id: string): Observable<Solicitud | null> {
    return from(this.supabase.client
      .from('solicitudes')
      .select('*')
      .eq('id', id)
      .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching solicitud by ID from Supabase:', error);
          throw error;
        }
        return this.mapToSolicitud(data);
      }),
      catchError((error) => {
        console.warn('Supabase fetch failed, using demo data:', error.message);
        
        // Fallback a datos demo
        const solicitud = this.solicitudesDemo.find(s => s.id === id);
        return of(solicitud || null);
      })
    );
  }

  // Actualizar estado de solicitud
  actualizarEstadoSolicitud(id: string, estado: EstadoSolicitud, observaciones?: string): Observable<Solicitud> {
    const updateData: any = {
      estado,
      updated_at: new Date().toISOString()
    };

    if (observaciones) {
      updateData.observaciones = observaciones;
    }

    if (estado === EstadoSolicitud.COMPLETADA) {
      updateData.fecha_completada = new Date().toISOString();
    }

    return from(this.supabase.client
      .from('solicitudes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error updating solicitud in Supabase:', error);
          throw error;
        }
        return this.mapToSolicitud(data);
      }),
      catchError((error) => {
        console.warn('Supabase update failed, using demo mode:', error.message);
        
        // Fallback a actualización demo
        const index = this.solicitudesDemo.findIndex(s => s.id === id);
        if (index !== -1) {
          this.solicitudesDemo[index] = {
            ...this.solicitudesDemo[index],
            estado,
            observaciones: observaciones || this.solicitudesDemo[index].observaciones,
            fechaCompletada: estado === EstadoSolicitud.COMPLETADA ? new Date() : this.solicitudesDemo[index].fechaCompletada,
            tiempoRespuesta: estado === EstadoSolicitud.COMPLETADA ? 
              Math.ceil((new Date().getTime() - this.solicitudesDemo[index].fechaSolicitud.getTime()) / (1000 * 60 * 60 * 24)) : 
              this.solicitudesDemo[index].tiempoRespuesta
          };
          return of(this.solicitudesDemo[index]);
        }
        throw new Error('Solicitud no encontrada');
      })
    );
  }

  // Obtener estadísticas del dashboard
  obtenerEstadisticas(): Observable<any> {
    // Intentar con Supabase primero
    return from(this.supabase.client
      .from('solicitudes')
      .select('estado, fecha_solicitud, tiempo_respuesta')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        
        const total = data.length;
        const completadas = data.filter(s => s.estado === 'completada' || s.estado === 'entregada').length;
        const enProceso = data.filter(s => s.estado === 'en_proceso' || s.estado === 'en_revision').length;
        const pendientes = data.filter(s => s.estado === 'recibida' || s.estado === 'pendiente_documentos').length;

        // Calcular tiempo promedio de respuesta
        const solicitudesCompletadas = data.filter(s => s.tiempo_respuesta);
        let tiempoPromedioRespuesta = 0;
        if (solicitudesCompletadas.length > 0) {
          const tiempoTotal = solicitudesCompletadas.reduce((acc, s) => acc + (s.tiempo_respuesta || 0), 0);
          tiempoPromedioRespuesta = Math.round((tiempoTotal / solicitudesCompletadas.length) * 10) / 10;
        }

        return {
          total,
          completadas,
          enProceso,
          pendientes,
          tiempoPromedioRespuesta
        };
      }),
      catchError((error) => {
        console.warn('Supabase stats failed, using demo data:', error.message);
        
        // Fallback a estadísticas demo
        const solicitudes = this.solicitudesDemo;
        const total = solicitudes.length;
        const completadas = solicitudes.filter(s => s.estado === EstadoSolicitud.COMPLETADA || s.estado === EstadoSolicitud.ENTREGADA).length;
        const enProceso = solicitudes.filter(s => 
          s.estado === EstadoSolicitud.EN_PROCESO || 
          s.estado === EstadoSolicitud.EN_REVISION
        ).length;
        const pendientes = solicitudes.filter(s => 
          s.estado === EstadoSolicitud.RECIBIDA || 
          s.estado === EstadoSolicitud.PENDIENTE_DOCUMENTOS
        ).length;

        // Calcular tiempo promedio de respuesta
        const solicitudesCompletadas = solicitudes.filter(s => s.tiempoRespuesta);
        let tiempoPromedioRespuesta = 0;
        if (solicitudesCompletadas.length > 0) {
          const tiempoTotal = solicitudesCompletadas.reduce((acc, s) => acc + (s.tiempoRespuesta || 0), 0);
          tiempoPromedioRespuesta = Math.round((tiempoTotal / solicitudesCompletadas.length) * 10) / 10;
        }

        return of({
          total,
          completadas,
          enProceso,
          pendientes,
          tiempoPromedioRespuesta
        });
      })
    );
  }

  // Generar número de solicitud único
  private generarNumeroSolicitud(): string {
    const año = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `SOL-${año}-${timestamp}`;
  }

  // Mapear datos de Supabase a modelo Solicitud
  private mapToSolicitud(data: any): Solicitud {
    return {
      id: data.id,
      numero: data.numero,
      estudiante: {
        nombre: data.estudiante_nombre,
        apellido: data.estudiante_apellido,
        cedula: data.estudiante_cedula,
        matricula: data.estudiante_matricula,
        carrera: data.estudiante_carrera,
        telefono: data.estudiante_telefono,
        email: data.estudiante_email
      },
      tipoServicio: data.tipo_servicio,
      descripcion: data.descripcion,
      fechaSolicitud: new Date(data.fecha_solicitud),
      fechaLimiteEsperada: data.fecha_limite_esperada ? new Date(data.fecha_limite_esperada) : undefined,
      fechaCompletada: data.fecha_completada ? new Date(data.fecha_completada) : undefined,
      estado: data.estado,
      prioridad: data.prioridad,
      tiempoRespuesta: data.tiempo_respuesta,
      observaciones: data.observaciones,
      documentosRequeridos: data.documentos_requeridos || [],
      documentosEntregados: data.documentos_entregados || [],
      responsableAsignado: data.responsable_asignado,
      etapas: [],
      costoServicio: data.costo_servicio,
      created_at: data.created_at ? new Date(data.created_at) : undefined,
      updated_at: data.updated_at ? new Date(data.updated_at) : undefined
    };
  }
}