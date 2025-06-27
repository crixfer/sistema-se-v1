export interface Solicitud {
  id?: string;
  numero: string;
  estudiante: {
    nombre: string;
    apellido: string;
    cedula: string;
    matricula: string;
    carrera: string;
    telefono?: string;
    email?: string;
  };
  tipoServicio: TipoServicio;
  descripcion: string;
  fechaSolicitud: Date;
  fechaLimiteEsperada?: Date;
  fechaCompletada?: Date;
  estado: EstadoSolicitud;
  prioridad: Prioridad;
  tiempoRespuesta?: number; // en días
  observaciones?: string;
  documentosRequeridos: string[];
  documentosEntregados: string[];
  responsableAsignado?: string;
  etapas: EtapaSolicitud[];
  costoServicio?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface EtapaSolicitud {
  id?: string;
  nombre: string;
  descripcion?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  completada: boolean;
  tiempoEstimado?: number; // en días
  tiempoReal?: number; // en días
  responsable?: string;
  comentarios?: string;
  orden: number;
}

export enum TipoServicio {
  RECORD_NOTAS = 'record_notas',
  CERTIFICADO_ESTUDIOS = 'certificado_estudios',
  CONSTANCIA_ESTUDIANTE = 'constancia_estudiante',
  CARTA_PRESENTACION = 'carta_presentacion',
  CERTIFICADO_CONDUCTA = 'certificado_conducta',
  HISTORIAL_ACADEMICO = 'historial_academico',
  TITULO_BACHILLER = 'titulo_bachiller',
  LEGALIZACION_DOCUMENTOS = 'legalizacion_documentos',
  CAMBIO_CARRERA = 'cambio_carrera',
  RETIRO_ASIGNATURA = 'retiro_asignatura',
  SOLICITUD_BECA = 'solicitud_beca',
  REPOSICION_CARNET = 'reposicion_carnet'
}

export enum EstadoSolicitud {
  RECIBIDA = 'recibida',
  EN_PROCESO = 'en_proceso',
  EN_REVISION = 'en_revision',
  PENDIENTE_DOCUMENTOS = 'pendiente_documentos',
  APROBADA = 'aprobada',
  COMPLETADA = 'completada',
  ENTREGADA = 'entregada',
  RECHAZADA = 'rechazada',
  CANCELADA = 'cancelada'
}

export enum Prioridad {
  BAJA = 'baja',
  NORMAL = 'normal',
  ALTA = 'alta',
  URGENTE = 'urgente'
}

export const TIPOS_SERVICIO_LABELS = {
  [TipoServicio.RECORD_NOTAS]: 'Récord de Notas',
  [TipoServicio.CERTIFICADO_ESTUDIOS]: 'Certificado de Estudios',
  [TipoServicio.CONSTANCIA_ESTUDIANTE]: 'Constancia de Estudiante',
  [TipoServicio.CARTA_PRESENTACION]: 'Carta de Presentación',
  [TipoServicio.CERTIFICADO_CONDUCTA]: 'Certificado de Conducta',
  [TipoServicio.HISTORIAL_ACADEMICO]: 'Historial Académico',
  [TipoServicio.TITULO_BACHILLER]: 'Título de Bachiller',
  [TipoServicio.LEGALIZACION_DOCUMENTOS]: 'Legalización de Documentos',
  [TipoServicio.CAMBIO_CARRERA]: 'Cambio de Carrera',
  [TipoServicio.RETIRO_ASIGNATURA]: 'Retiro de Asignatura',
  [TipoServicio.SOLICITUD_BECA]: 'Solicitud de Beca',
  [TipoServicio.REPOSICION_CARNET]: 'Reposición de Carnet'
};

export const ESTADOS_SOLICITUD_LABELS = {
  [EstadoSolicitud.RECIBIDA]: 'Recibida',
  [EstadoSolicitud.EN_PROCESO]: 'En Proceso',
  [EstadoSolicitud.EN_REVISION]: 'En Revisión',
  [EstadoSolicitud.PENDIENTE_DOCUMENTOS]: 'Pendiente Documentos',
  [EstadoSolicitud.APROBADA]: 'Aprobada',
  [EstadoSolicitud.COMPLETADA]: 'Completada',
  [EstadoSolicitud.ENTREGADA]: 'Entregada',
  [EstadoSolicitud.RECHAZADA]: 'Rechazada',
  [EstadoSolicitud.CANCELADA]: 'Cancelada'
};

export const PRIORIDAD_LABELS = {
  [Prioridad.BAJA]: 'Baja',
  [Prioridad.NORMAL]: 'Normal',
  [Prioridad.ALTA]: 'Alta',
  [Prioridad.URGENTE]: 'Urgente'
};