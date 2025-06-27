import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { NotificationContainerComponent } from '../notification-container/notification-container.component';

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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}