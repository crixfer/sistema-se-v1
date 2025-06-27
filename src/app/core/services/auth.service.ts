import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of, BehaviorSubject, tap, switchMap, filter, delay } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Usuario, LoginCredentials, RegisterData, RolUsuario, SesionUsuario } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isOfflineMode = false;

  // Usuarios demo para el sistema
  private usuariosDemo: Usuario[] = [
    {
      id: 'demo-admin-id',
      email: 'admin@demo.com',
      nombreCompleto: 'Carlos Portorreal',
      rol: RolUsuario.ADMINISTRADOR,
      activo: true,
      permisos: {
        dashboard: { leer: true },
        solicitudes: { leer: true, crear: true, editar: true, eliminar: true },
        reportes: { leer: true, exportar: true },
        usuarios: { leer: true, crear: true, editar: true, eliminar: true },
        configuracion: { leer: true, editar: true }
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20')
    },
    {
      id: 'demo-supervisor-id',
      email: 'supervisor@demo.com',
      nombreCompleto: 'María González Supervisor',
      rol: RolUsuario.SUPERVISOR,
      activo: true,
      permisos: {
        dashboard: { leer: true },
        solicitudes: { leer: true, crear: true, editar: true, eliminar: false },
        reportes: { leer: true, exportar: true },
        usuarios: { leer: true, crear: false, editar: false, eliminar: false },
        configuracion: { leer: false, editar: false }
      },
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-06-18')
    },
    {
      id: 'demo-operador-id',
      email: 'operador@demo.com',
      nombreCompleto: 'Ana Martínez Operador',
      rol: RolUsuario.OPERADOR,
      activo: true,
      permisos: {
        dashboard: { leer: true },
        solicitudes: { leer: true, crear: true, editar: true, eliminar: false },
        reportes: { leer: false, exportar: false },
        usuarios: { leer: false, crear: false, editar: false, eliminar: false },
        configuracion: { leer: false, editar: false }
      },
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-06-15')
    },
    {
      id: 'demo-consultor-id',
      email: 'consultor@demo.com',
      nombreCompleto: 'Luis Pérez Consultor',
      rol: RolUsuario.CONSULTOR,
      activo: true,
      permisos: {
        dashboard: { leer: true },
        solicitudes: { leer: true, crear: false, editar: false, eliminar: false },
        reportes: { leer: true, exportar: false },
        usuarios: { leer: false, crear: false, editar: false, eliminar: false },
        configuracion: { leer: false, editar: false }
      },
      createdAt: new Date('2024-04-05'),
      updatedAt: new Date('2024-06-10')
    },
    {
      id: 'demo-operador2-id',
      email: 'operador2@demo.com',
      nombreCompleto: 'Carmen Jiménez',
      rol: RolUsuario.OPERADOR,
      activo: true,
      permisos: {
        dashboard: { leer: true },
        solicitudes: { leer: true, crear: true, editar: true, eliminar: false },
        reportes: { leer: false, exportar: false },
        usuarios: { leer: false, crear: false, editar: false, eliminar: false },
        configuracion: { leer: false, editar: false }
      },
      createdAt: new Date('2024-05-12'),
      updatedAt: new Date('2024-06-22')
    },
    {
      id: 'demo-supervisor2-id',
      email: 'supervisor2@demo.com',
      nombreCompleto: 'Roberto Díaz',
      rol: RolUsuario.SUPERVISOR,
      activo: false,
      permisos: {
        dashboard: { leer: true },
        solicitudes: { leer: true, crear: true, editar: true, eliminar: false },
        reportes: { leer: true, exportar: true },
        usuarios: { leer: true, crear: false, editar: false, eliminar: false },
        configuracion: { leer: false, editar: false }
      },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-05-30')
    }
  ];

  constructor(private supabase: SupabaseService) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Verificar conexión a Supabase de forma segura
      const isConnected = await this.supabase.testConnection();
      if (!isConnected) {
        console.warn('Supabase connection failed, using demo mode');
        this.isOfflineMode = true;
        return;
      }

      // Solo intentar autenticación si hay conexión
      try {
        const { data: { session } } = await this.supabase.client.auth.getSession();
        if (session?.user) {
          this.loadUserProfile(session.user.id);
        }

        // Escuchar cambios de autenticación solo si hay conexión
        this.supabase.client.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            this.loadUserProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            this.currentUserSubject.next(null);
          }
        });
      } catch (authError) {
        console.warn('Auth initialization failed, using offline mode:', authError);
        this.isOfflineMode = true;
      }
    } catch (error) {
      console.error('Error inicializando auth:', error);
      console.warn('Fallback to demo mode due to auth initialization error');
      this.isOfflineMode = true;
    }
  }

  private loadUserProfile(userId: string) {
    this.obtenerPerfil(userId).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.currentUserSubject.next(usuario);
        }
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        console.warn('Using demo user due to profile loading error');
        this.isOfflineMode = true;
      }
    });
  }

  // Iniciar sesión - Modo completamente offline para evitar errores
  login(credentials: LoginCredentials): Observable<Usuario> {
    // Usar solo modo demo para evitar errores de LockManager
    const usuario = this.usuariosDemo.find(u => u.email === credentials.email);
    
    if (usuario && usuario.activo) {
      this.currentUserSubject.next(usuario);
      return of(usuario);
    } else if (usuario && !usuario.activo) {
      throw new Error('Usuario inactivo');
    } else {
      throw new Error('Invalid login credentials');
    }
  }

  // Registrar usuario (solo administradores) - Modo demo
  register(userData: RegisterData): Observable<Usuario> {
    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      email: userData.email,
      nombreCompleto: userData.nombreCompleto,
      rol: userData.rol || RolUsuario.OPERADOR,
      activo: true,
      permisos: this.getPermisosPorRol(userData.rol || RolUsuario.OPERADOR),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.usuariosDemo.push(nuevoUsuario);
    return of(nuevoUsuario);
  }

  // Cerrar sesión
  logout(): Observable<void> {
    this.currentUserSubject.next(null);
    return of(void 0);
  }

  // Obtener perfil de usuario - Solo modo demo
  obtenerPerfil(userId: string): Observable<Usuario | null> {
    const usuario = this.usuariosDemo.find(u => u.id === userId);
    return of(usuario || null);
  }

  // Obtener todos los usuarios (solo administradores) - Solo modo demo
  obtenerUsuarios(): Observable<Usuario[]> {
    return of([...this.usuariosDemo]);
  }

  // Actualizar perfil de usuario - Solo modo demo
  actualizarPerfil(userId: string, datos: Partial<Usuario>): Observable<Usuario> {
    const index = this.usuariosDemo.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.usuariosDemo[index] = {
        ...this.usuariosDemo[index],
        ...datos,
        updatedAt: new Date()
      };
      
      // Actualizar usuario actual si es el mismo
      if (this.currentUserSubject.value?.id === userId) {
        this.currentUserSubject.next(this.usuariosDemo[index]);
      }
      
      return of(this.usuariosDemo[index]);
    }
    throw new Error('Usuario no encontrado');
  }

  // Cambiar contraseña - Modo demo
  cambiarPassword(newPassword: string): Observable<void> {
    return of(void 0);
  }

  // Verificar si el usuario tiene un permiso específico
  tienePermiso(modulo: string, accion: string): boolean {
    const usuario = this.currentUserSubject.value;
    if (!usuario || !usuario.activo) return false;

    const moduloPermisos = usuario.permisos[modulo as keyof typeof usuario.permisos];
    if (!moduloPermisos) return false;

    return moduloPermisos[accion as keyof typeof moduloPermisos] || false;
  }

  // Verificar si el usuario tiene un rol específico
  tieneRol(rol: RolUsuario): boolean {
    const usuario = this.currentUserSubject.value;
    return usuario?.rol === rol || false;
  }

  // Verificar si el usuario es administrador
  esAdministrador(): boolean {
    return this.tieneRol(RolUsuario.ADMINISTRADOR);
  }

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Verificar si está en modo offline
  isOffline(): boolean {
    return this.isOfflineMode;
  }

  // Obtener permisos por rol
  private getPermisosPorRol(rol: RolUsuario) {
    const permisosPorRol = {
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

    return permisosPorRol[rol];
  }

  // Mapear datos de Supabase a modelo Usuario (mantenido para compatibilidad futura)
  private mapToUsuario(data: any): Usuario {
    return {
      id: data.id,
      email: data.email,
      nombreCompleto: data.nombre_completo,
      rol: data.rol as RolUsuario,
      activo: data.activo,
      permisos: data.permisos,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
  }
}