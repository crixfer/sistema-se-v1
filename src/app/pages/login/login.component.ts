import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#004b8d] to-[#0056a3] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <!-- Logo y título -->
        <div class="text-center mb-6 sm:mb-8">
          <div class="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <i class="fas fa-clipboard-list text-[#004b8d] text-2xl sm:text-3xl"></i>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">SOLICITUDES</h1>
          <p class="text-blue-100 text-sm sm:text-base">Sistema de Administración</p>
        </div>

        <!-- Formulario de login -->
        <div class="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Iniciar Sesión</h2>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                placeholder="usuario@ejemplo.com"
              />
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                   class="text-red-500 text-xs mt-1">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">El correo es requerido</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Ingrese un correo válido</span>
              </div>
            </div>

            <div class="mb-4 sm:mb-6">
              <label class="block text-gray-700 text-sm font-medium mb-2">
                Contraseña
              </label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent pr-10 text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                   class="text-red-500 text-xs mt-1">
                La contraseña es requerida
              </div>
            </div>

            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-[#004b8d] text-white py-2 px-4 rounded-md hover:bg-[#003a6b] focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              <span *ngIf="!isLoading">Iniciar Sesión</span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Iniciando sesión...
              </span>
            </button>
          </form>

          <!-- Botón de acceso demo -->
          <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              (click)="loginDemo()"
              [disabled]="isLoading"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
            >
              <i class="fas fa-user-shield mr-2"></i>
              Acceso Demo (Administrador)
            </button>
            <p class="text-center mt-2 text-xs text-gray-500">
              Usa esta opción para probar el sistema sin registrarte
            </p>
          </div>

          <!-- Información de acceso -->
          <div class="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-700 mb-3 text-center">Información del Sistema:</h3>
            <div class="space-y-2 text-xs text-gray-600">
              <div class="text-center">
                <p>Este es un sistema de demostración.</p>
                <p>Para crear usuarios reales, necesitas configurar Supabase.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-4 sm:mt-6 text-blue-100 text-xs sm:text-sm">
          <p>&copy; 2024 Sistema de Administración de Solicitudes</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (usuario) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);
          
          if (error.message?.includes('Invalid login credentials')) {
            this.errorMessage = 'Credenciales incorrectas. Verifique su correo y contraseña.';
          } else if (error.message?.includes('Usuario inactivo')) {
            this.errorMessage = 'Su cuenta está inactiva. Contacte al administrador.';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intente con el acceso demo.';
          }
        }
      });
    }
  }

  loginDemo() {
    this.isLoading = true;
    this.errorMessage = '';

    // Simular usuario demo
    const usuarioDemo = {
      id: 'demo-admin-id',
      email: 'admin@demo.com',
      nombreCompleto: 'Administrador Demo',
      rol: 'administrador' as any,
      activo: true,
      permisos: {
        dashboard: { leer: true },
        solicitudes: { leer: true, crear: true, editar: true, eliminar: true },
        reportes: { leer: true, exportar: true },
        usuarios: { leer: true, crear: true, editar: true, eliminar: true },
        configuracion: { leer: true, editar: true }
      }
    };

    // Simular login exitoso
    setTimeout(() => {
      (this.authService as any).currentUserSubject.next(usuarioDemo);
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}