import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { NotificationContainerComponent } from '../notification-container/notification-container.component';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/auth.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, NotificationContainerComponent],
  template: `
    <div class="bg-white flex flex-row justify-center w-full min-h-screen">
      <div class="bg-white w-full max-w-[1920px] min-h-screen">
        <div class="relative min-h-screen">
          <div class="w-full min-h-screen bg-white overflow-hidden shadow-[0px_4px_4px_#00000040] flex">
            <!-- Mobile Overlay -->
            <div 
              *ngIf="isMobileMenuOpen && isMobile" 
              class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              (click)="closeMobileMenu()">
            </div>

            <!-- Sidebar -->
            <app-sidebar 
              [isMobile]="isMobile"
              [isOpen]="isMobileMenuOpen"
              (toggleMenu)="toggleMobileMenu()"
              (closeMenu)="closeMobileMenu()">
            </app-sidebar>

            <!-- Main content -->
            <main class="flex-1 min-h-screen w-full lg:w-auto overflow-x-hidden">
              <!-- Header -->
              <app-header 
                [userInfo]="userInfo"
                [isMobile]="isMobile"
                (toggleMenu)="toggleMobileMenu()">
              </app-header>

              <!-- Content -->
              <div class="w-full overflow-x-auto">
                <ng-content></ng-content>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenedor de notificaciones y confirmaciones -->
    <app-notification-container></app-notification-container>
  `
})
export class LayoutComponent implements OnInit, OnDestroy {
  userInfo = {
    name: 'C. PORTORREAL',
    role: 'ADMINISTRADOR',
    initials: 'CP'
  };

  isMobile = false;
  isMobileMenuOpen = false;
  currentUser: Usuario | null = null;

  constructor(private authService: AuthService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
    
    // Suscribirse al usuario actual para actualizar la información del header
    this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.currentUser = user;
      if (user) {
        this.userInfo = {
          name: this.getDisplayName(user.nombreCompleto),
          role: user.rol.toUpperCase(),
          initials: this.getInitials(user.nombreCompleto)
        };
      }
    });
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 1024; // lg breakpoint
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  private getDisplayName(nombreCompleto: string): string {
    // Convertir "Carlos Portorreal" a "C. PORTORREAL"
    const nombres = nombreCompleto.split(' ');
    if (nombres.length >= 2) {
      const primerNombre = nombres[0].charAt(0).toUpperCase();
      const apellido = nombres[nombres.length - 1].toUpperCase();
      return `${primerNombre}. ${apellido}`;
    }
    return nombreCompleto.toUpperCase();
  }

  private getInitials(nombreCompleto: string): string {
    return nombreCompleto
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}