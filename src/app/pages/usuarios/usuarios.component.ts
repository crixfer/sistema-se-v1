import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Usuario, RolUsuario, ROLES_LABELS, PERMISOS_POR_ROL } from '../../core/models/auth.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LayoutComponent],
  template: `
    <app-layout>
      <!-- Breadcrumb -->
      <div class="flex items-center mt-3 sm:mt-4 lg:mt-5 px-3 sm:px-4 lg:px-3.5">
        <div class="w-1.5 h-6 sm:h-8 lg:h-[34px] bg-[#49aa42] mr-2 sm:mr-2.5"></div>
        <h2 class="font-inter font-bold text-black text-lg sm:text-xl">
          Gestión de Usuarios
        </h2>
      </div>

      <div class="w-full h-px bg-gray-300 mt-3 sm:mt-4 lg:mt-5 mx-3 sm:mx-4 lg:mx-3.5"></div>

      <!-- Contenido -->
      <section class="px-3 sm:px-4 lg:px-3.5 mt-6 sm:mt-7 lg:mt-8 pb-6">
        <h3 class="font-inter font-normal italic text-[#004b8d] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10">
          Administración completa de usuarios y permisos del sistema
        </h3>

        <!-- Botón para crear usuario -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div class="text-sm text-gray-600">
            Total de usuarios: <span class="font-semibold text-[#004b8d]">{{ usuarios.length }}</span>
          </div>
          <button
            (click)="mostrarFormulario = true"
            class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#004b8d] text-white rounded-md hover:bg-[#003a6b] transition-colors font-inter font-medium text-sm sm:text-base"
          >
            <i class="fas fa-plus mr-2"></i>
            Nuevo Usuario
          </button>
        </div>

        <!-- Formulario de usuario -->
        <div *ngIf="mostrarFormulario" class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6 mb-4 sm:mb-6">
          <div class="flex justify-between items-center mb-3 sm:mb-4">
            <h4 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg">
              {{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario' }}
            </h4>
            <button
              (click)="cancelarFormulario()"
              class="text-gray-500 hover:text-gray-700 p-1"
            >
              <i class="fas fa-times text-lg sm:text-xl"></i>
            </button>
          </div>

          <form [formGroup]="usuarioForm" (ngSubmit)="guardarUsuario()">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  formControlName="nombreCompleto"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                  placeholder="Nombre completo del usuario"
                />
                <div *ngIf="usuarioForm.get('nombreCompleto')?.invalid && usuarioForm.get('nombreCompleto')?.touched" 
                     class="text-red-500 text-xs mt-1">
                  El nombre completo es requerido
                </div>
              </div>

              <div>
                <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  formControlName="email"
                  [disabled]="!!usuarioEditando"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent disabled:bg-gray-100 text-sm sm:text-base"
                  placeholder="correo@ejemplo.com"
                />
                <div *ngIf="usuarioForm.get('email')?.invalid && usuarioForm.get('email')?.touched" 
                     class="text-red-500 text-xs mt-1">
                  <span *ngIf="usuarioForm.get('email')?.errors?.['required']">El correo es requerido</span>
                  <span *ngIf="usuarioForm.get('email')?.errors?.['email']">Ingrese un correo válido</span>
                </div>
              </div>

              <div>
                <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                  Rol *
                </label>
                <select
                  formControlName="rol"
                  (change)="onRolChange()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Seleccione un rol</option>
                  <option *ngFor="let rol of rolesDisponibles" [value]="rol.value">
                    {{ rol.label }}
                  </option>
                </select>
                <div *ngIf="usuarioForm.get('rol')?.invalid && usuarioForm.get('rol')?.touched" 
                     class="text-red-500 text-xs mt-1">
                  Debe seleccionar un rol
                </div>
              </div>

              <div *ngIf="!usuarioEditando">
                <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  formControlName="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                  placeholder="Contraseña temporal"
                />
                <div *ngIf="usuarioForm.get('password')?.invalid && usuarioForm.get('password')?.touched" 
                     class="text-red-500 text-xs mt-1">
                  La contraseña es requerida (mínimo 6 caracteres)
                </div>
              </div>

              <div class="sm:col-span-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    formControlName="activo"
                    class="mr-2 h-4 w-4 text-[#004b8d] focus:ring-[#004b8d] border-gray-300 rounded"
                  />
                  <span class="font-inter text-sm text-gray-700">Usuario activo</span>
                </label>
              </div>
            </div>

            <!-- Permisos del rol seleccionado -->
            <div *ngIf="permisosRolSeleccionado" class="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <h5 class="font-inter font-semibold text-[#004b8d] mb-3 text-sm sm:text-base">
                Permisos del Rol: {{ getRolLabel(usuarioForm.get('rol')?.value) }}
              </h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div *ngFor="let modulo of getModulosPermisos()" class="bg-white p-2 sm:p-3 rounded border">
                  <div class="font-medium text-gray-800 mb-2 capitalize">{{ modulo }}</div>
                  <div class="space-y-1">
                    <div *ngFor="let accion of getAccionesModulo(modulo)" class="flex items-center">
                      <i [class]="tienePermisoRol(modulo, accion) ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'" class="w-3 sm:w-4 mr-2 text-xs"></i>
                      <span class="capitalize text-gray-600">{{ accion }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
              <button
                type="button"
                (click)="cancelarFormulario()"
                class="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-md font-inter font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="usuarioForm.invalid || isSubmitting"
                class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#004b8d] text-white rounded-md font-inter font-medium hover:bg-[#003a6b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {{ isSubmitting ? 'Guardando...' : (usuarioEditando ? 'Actualizar' : 'Crear Usuario') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de usuarios -->
        <div class="bg-white rounded-lg border border-[#d9d9d9] overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h4 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg">
              Usuarios del Sistema
            </h4>
          </div>

          <!-- Mobile view -->
          <div class="block sm:hidden">
            <div *ngFor="let usuario of usuarios" class="border-b border-gray-200 p-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-[#004b8d] flex items-center justify-center">
                    <span class="text-white font-medium text-sm">
                      {{ getInitials(usuario.nombreCompleto) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 truncate">{{ usuario.nombreCompleto }}</div>
                  <div class="text-sm text-gray-500 truncate">{{ usuario.email }}</div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [ngClass]="getRolBadgeClass(usuario.rol)">
                      {{ getRolLabel(usuario.rol) }}
                    </span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [ngClass]="usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                  <div class="mt-2 text-xs text-gray-500">
                    Registrado: {{ usuario.createdAt | date:'dd/MM/yyyy' }}
                  </div>
                  <div class="mt-3 flex space-x-3">
                    <button
                      (click)="editarUsuario(usuario)"
                      class="text-[#004b8d] hover:text-[#003a6b] text-sm font-medium"
                    >
                      <i class="fas fa-edit mr-1"></i>Editar
                    </button>
                    <button
                      (click)="toggleUsuarioActivo(usuario)"
                      [class]="usuario.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                      class="text-sm font-medium"
                    >
                      <i [class]="usuario.activo ? 'fas fa-user-slash mr-1' : 'fas fa-user-check mr-1'"></i>
                      {{ usuario.activo ? 'Desactivar' : 'Activar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop view -->
          <div class="hidden sm:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let usuario of usuarios" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-[#004b8d] flex items-center justify-center">
                          <span class="text-white font-medium text-sm">
                            {{ getInitials(usuario.nombreCompleto) }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4 min-w-0 flex-1">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ usuario.nombreCompleto }}</div>
                        <div class="text-sm text-gray-500 truncate">{{ usuario.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [ngClass]="getRolBadgeClass(usuario.rol)">
                      {{ getRolLabel(usuario.rol) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          [ngClass]="usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ usuario.createdAt | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      (click)="editarUsuario(usuario)"
                      class="text-[#004b8d] hover:text-[#003a6b] mr-3"
                      title="Editar usuario"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      (click)="toggleUsuarioActivo(usuario)"
                      [class]="usuario.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                      [title]="usuario.activo ? 'Desactivar usuario' : 'Activar usuario'"
                    >
                      <i [class]="usuario.activo ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="usuarios.length === 0" class="text-center py-8 sm:py-12">
            <div class="text-gray-400 text-3xl sm:text-4xl mb-4">👥</div>
            <h3 class="font-inter font-medium text-gray-600 mb-2 text-sm sm:text-base">No hay usuarios registrados</h3>
            <p class="text-gray-500 text-xs sm:text-sm">Crea el primer usuario del sistema</p>
          </div>
        </div>
      </section>
    </app-layout>
  `
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioForm: FormGroup;
  mostrarFormulario = false;
  usuarioEditando: Usuario | null = null;
  isSubmitting = false;
  permisosRolSeleccionado: any = null;

  rolesDisponibles = [
    { value: RolUsuario.ADMINISTRADOR, label: ROLES_LABELS[RolUsuario.ADMINISTRADOR] },
    { value: RolUsuario.SUPERVISOR, label: ROLES_LABELS[RolUsuario.SUPERVISOR] },
    { value: RolUsuario.OPERADOR, label: ROLES_LABELS[RolUsuario.OPERADOR] },
    { value: RolUsuario.CONSULTOR, label: ROLES_LABELS[RolUsuario.CONSULTOR] }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      activo: [true]
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.authService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.notificationService.error(
          'Error al cargar usuarios',
          'No se pudieron cargar los usuarios del sistema.'
        );
      }
    });
  }

  onRolChange() {
    const rolSeleccionado = this.usuarioForm.get('rol')?.value;
    if (rolSeleccionado) {
      this.permisosRolSeleccionado = PERMISOS_POR_ROL[rolSeleccionado as RolUsuario];
    } else {
      this.permisosRolSeleccionado = null;
    }
  }

  guardarUsuario() {
    if (this.usuarioForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.usuarioForm.value;

      if (this.usuarioEditando) {
        // Actualizar usuario existente
        this.authService.actualizarPerfil(this.usuarioEditando.id, {
          nombreCompleto: formValue.nombreCompleto,
          rol: formValue.rol,
          activo: formValue.activo,
          permisos: PERMISOS_POR_ROL[formValue.rol as RolUsuario]
        }).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.cancelarFormulario();
            this.cargarUsuarios();
            this.notificationService.successWithCheck(
              'Usuario actualizado',
              `El usuario ${formValue.nombreCompleto} ha sido actualizado exitosamente.`
            );
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error actualizando usuario:', error);
            this.notificationService.error(
              'Error al actualizar usuario',
              'No se pudo actualizar el usuario. Por favor, intenta nuevamente.'
            );
          }
        });
      } else {
        // Crear nuevo usuario
        this.authService.register({
          email: formValue.email,
          password: formValue.password,
          nombreCompleto: formValue.nombreCompleto,
          rol: formValue.rol
        }).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.cancelarFormulario();
            this.cargarUsuarios();
            this.notificationService.successWithCheck(
              'Usuario creado exitosamente',
              `El usuario ${formValue.nombreCompleto} ha sido creado y puede acceder al sistema.`
            );
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error creando usuario:', error);
            this.notificationService.error(
              'Error al crear usuario',
              'No se pudo crear el usuario. Verifica que el correo no esté en uso.'
            );
          }
        });
      }
    }
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioEditando = usuario;
    this.mostrarFormulario = true;
    
    this.usuarioForm.patchValue({
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo
    });

    // Remover validación de password para edición
    this.usuarioForm.get('password')?.clearValidators();
    this.usuarioForm.get('password')?.updateValueAndValidity();

    this.onRolChange();
  }

  async toggleUsuarioActivo(usuario: Usuario) {
    const accion = usuario.activo ? 'desactivar' : 'activar';
    
    const confirmado = await this.notificationService.confirm(
      `Confirmar ${accion} usuario`,
      `¿Está seguro de ${accion} el usuario ${usuario.nombreCompleto}?`,
      {
        confirmText: `Sí, ${accion}`,
        cancelText: 'Cancelar',
        type: usuario.activo ? 'warning' : 'success'
      }
    );

    if (confirmado) {
      this.authService.actualizarPerfil(usuario.id, {
        activo: !usuario.activo
      }).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.notificationService.successWithCheck(
            `Usuario ${accion}do`,
            `El usuario ${usuario.nombreCompleto} ha sido ${accion}do exitosamente.`
          );
        },
        error: (error) => {
          console.error(`Error al ${accion} usuario:`, error);
          this.notificationService.error(
            `Error al ${accion} usuario`,
            `No se pudo ${accion} el usuario. Por favor, intenta nuevamente.`
          );
        }
      });
    }
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.usuarioEditando = null;
    this.permisosRolSeleccionado = null;
    this.usuarioForm.reset();
    this.usuarioForm.patchValue({ activo: true });
    
    // Restaurar validación de password
    this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('password')?.updateValueAndValidity();
  }

  getInitials(nombreCompleto: string): string {
    return nombreCompleto
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getRolLabel(rol: string): string {
    return ROLES_LABELS[rol as RolUsuario] || rol;
  }

  getRolBadgeClass(rol: RolUsuario): string {
    const classes = {
      [RolUsuario.ADMINISTRADOR]: 'bg-red-100 text-red-800',
      [RolUsuario.SUPERVISOR]: 'bg-blue-100 text-blue-800',
      [RolUsuario.OPERADOR]: 'bg-green-100 text-green-800',
      [RolUsuario.CONSULTOR]: 'bg-gray-100 text-gray-800'
    };
    return classes[rol] || 'bg-gray-100 text-gray-800';
  }

  getModulosPermisos(): string[] {
    if (!this.permisosRolSeleccionado) return [];
    return Object.keys(this.permisosRolSeleccionado);
  }

  getAccionesModulo(modulo: string): string[] {
    if (!this.permisosRolSeleccionado || !this.permisosRolSeleccionado[modulo]) return [];
    return Object.keys(this.permisosRolSeleccionado[modulo]);
  }

  tienePermisoRol(modulo: string, accion: string): boolean {
    if (!this.permisosRolSeleccionado || !this.permisosRolSeleccionado[modulo]) return false;
    return this.permisosRolSeleccionado[modulo][accion] || false;
  }
}