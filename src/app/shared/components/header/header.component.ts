import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Usuario } from '../../../core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="w-full h-14 sm:h-16 lg:h-[60px] flex items-center justify-between px-3 sm:px-4 lg:px-3.5 border-b border-gray-200 bg-white">
      <!-- Mobile menu button -->
      <button 
        *ngIf="isMobile"
        (click)="toggleMenu.emit()"
        class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-md transition-colors lg:hidden">
        <div class="space-y-1">
          <div class="w-5 h-0.5 bg-gray-600"></div>
          <div class="w-5 h-0.5 bg-gray-600"></div>
          <div class="w-5 h-0.5 bg-gray-600"></div>
        </div>
      </button>

      <!-- Desktop menu button -->
      <div 
        *ngIf="!isMobile"
        class="w-[31px] h-[31px] flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-md transition-colors">
        <div class="space-y-1">
          <div class="w-6 h-0.5 bg-gray-600"></div>
          <div class="w-6 h-0.5 bg-gray-600"></div>
          <div class="w-6 h-0.5 bg-gray-600"></div>
        </div>
      </div>
      
      <!-- User info -->
      <div class="flex items-center relative">
        <!-- User name and role - Hidden on very small screens -->
        <div class="mr-2 sm:mr-4 text-right hidden xs:block">
          <div class="font-doppio font-normal text-black text-sm sm:text-base leading-tight">
            {{ currentUser?.nombreCompleto || userInfo.name }}
          </div>
          <div class="font-doppio font-normal text-[#adabab] text-[10px] sm:text-[11px] uppercase">
            {{ currentUser?.rol || userInfo.role }}
          </div>
        </div>
        
        <!-- Línea divisora alineada con la del sidebar -->
        <div class="w-px h-6 sm:h-8 lg:h-[34px] bg-gray-300 mr-2 sm:mr-4"></div>
        
        <!-- Avatar with dropdown -->
        <div class="relative">
          <button
            (click)="toggleDropdown()"
            class="w-8 h-8 sm:w-10 sm:h-10 bg-[#004b8d] rounded-full flex items-center justify-center hover:bg-[#003a6b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:ring-offset-2"
            [attr.aria-expanded]="isDropdownOpen"
            aria-haspopup="true">
            <span class="text-white font-bold text-xs sm:text-sm">
              {{ getInitials() }}
            </span>
          </button>

          <!-- Dropdown menu -->
          <div 
            *ngIf="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1"
            role="menu"
            aria-orientation="vertical">
            
            <!-- User info in dropdown (visible on small screens) -->
            <div class="px-4 py-3 border-b border-gray-100 block xs:hidden">
              <div class="font-medium text-gray-900 text-sm">
                {{ currentUser?.nombreCompleto || userInfo.name }}
              </div>
              <div class="text-xs text-gray-500 uppercase">
                {{ currentUser?.rol || userInfo.role }}
              </div>
            </div>

            <!-- Menu items -->
            <button
              (click)="goToProfile()"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
              role="menuitem">
              <i class="fas fa-user mr-3 text-gray-400"></i>
              Mi Perfil
            </button>

            <button
              (click)="goToSettings()"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
              role="menuitem">
              <i class="fas fa-cog mr-3 text-gray-400"></i>
              Configuración
            </button>

            <div class="border-t border-gray-100 my-1"></div>

            <button
              (click)="logout()"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
              role="menuitem">
              <i class="fas fa-sign-out-alt mr-3 text-red-500"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Overlay para cerrar dropdown en mobile -->
    <div 
      *ngIf="isDropdownOpen"
      class="fixed inset-0 z-40"
      (click)="closeDropdown()">
    </div>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() userInfo: any = {
    name: 'C. PORTORREAL',
    role: 'ADMINISTRADOR',
    initials: 'CP'
  };
  @Input() isMobile = false;
  @Output() toggleMenu = new EventEmitter<void>();

  currentUser: Usuario | null = null;
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse al usuario actual
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    // Cleanup se maneja automáticamente por el observable
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  getInitials(): string {
    if (this.currentUser?.nombreCompleto) {
      return this.currentUser.nombreCompleto
        .split(' ')
        .map((name: string) => name.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }
    return this.userInfo.initials;
  }

  goToProfile() {
    this.closeDropdown();
    // Navegar a perfil (por ahora solo cierra el dropdown)
    console.log('Ir a perfil');
  }

  goToSettings() {
    this.closeDropdown();
    // Navegar a configuración (por ahora solo cierra el dropdown)
    console.log('Ir a configuración');
  }

  async logout() {
    this.closeDropdown();
    
    // Usar el servicio de notificaciones para mostrar confirmación personalizada
    const confirmado = await this.notificationService.confirm(
      'Confirmar cierre de sesión',
      '¿Está seguro de que desea cerrar sesión? Será redirigido a la página de inicio de sesión.',
      {
        confirmText: 'Sí, cerrar sesión',
        cancelText: 'Cancelar',
        type: 'warning',
        icon: 'fas fa-sign-out-alt'
      }
    );

    if (confirmado) {
      this.authService.logout().subscribe({
        next: () => {
          this.notificationService.successWithCheck(
            'Sesión cerrada',
            'Ha cerrado sesión exitosamente. Hasta pronto.'
          );
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('Error al cerrar sesión:', error);
          this.notificationService.error(
            'Error al cerrar sesión',
            'Ocurrió un error al cerrar sesión, pero será redirigido al login.'
          );
          // Forzar navegación al login incluso si hay error
          this.router.navigate(['/login']);
        }
      });
    }
  }
}