export interface Usuario {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: RolUsuario;
  activo: boolean;
  permisos: Permisos;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SesionUsuario {
  id?: string;
  usuarioId: string;
  fechaInicio: Date;
  fechaFin?: Date;
  ipAddress?: string;
  userAgent?: string;
  activa: boolean;
}

export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  SUPERVISOR = 'supervisor',
  OPERADOR = 'operador',
  CONSULTOR = 'consultor'
}

export interface Permisos {
  dashboard: {
    leer: boolean;
  };
  solicitudes: {
    leer: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  reportes: {
    leer: boolean;
    exportar: boolean;
  };
  usuarios: {
    leer: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
  };
  configuracion: {
    leer: boolean;
    editar: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombreCompleto: string;
  rol?: RolUsuario;
}

export const ROLES_LABELS = {
  [RolUsuario.ADMINISTRADOR]: 'Administrador',
  [RolUsuario.SUPERVISOR]: 'Supervisor',
  [RolUsuario.OPERADOR]: 'Operador',
  [RolUsuario.CONSULTOR]: 'Consultor'
};

export const PERMISOS_POR_ROL: Record<RolUsuario, Permisos> = {
  [RolUsuario.ADMINISTRADOR]: {
    dashboard: { leer: true },
    solicitudes: { leer: true, crear: true, editar: true, eliminar: true },
    reportes: { leer: true, exportar: true },
    usuarios: { leer: true, crear: true, editar: true, eliminar: true },
    configuracion: { leer: true, editar: true }
  },
  [RolUsuario.SUPERVISOR]: {
    dashboard: { leer: true },
    solicitudes: { leer: true, crear: true, editar: true, eliminar: false },
    reportes: { leer: true, exportar: true },
    usuarios: { leer: true, crear: false, editar: false, eliminar: false },
    configuracion: { leer: false, editar: false }
  },
  [RolUsuario.OPERADOR]: {
    dashboard: { leer: true },
    solicitudes: { leer: true, crear: true, editar: true, eliminar: false },
    reportes: { leer: false, exportar: false },
    usuarios: { leer: false, crear: false, editar: false, eliminar: false },
    configuracion: { leer: false, editar: false }
  },
  [RolUsuario.CONSULTOR]: {
    dashboard: { leer: true },
    solicitudes: { leer: true, crear: false, editar: false, eliminar: false },
    reportes: { leer: true, exportar: false },
    usuarios: { leer: false, crear: false, editar: false, eliminar: false },
    configuracion: { leer: false, editar: false }
  }
};