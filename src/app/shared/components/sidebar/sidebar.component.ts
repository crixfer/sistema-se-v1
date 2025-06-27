import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside 
      class="fixed lg:relative inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-[211px] h-full bg-[#004b8d] border border-solid transform transition-transform duration-300 ease-in-out lg:transform-none"
      [class.translate-x-0]="!isMobile || isOpen"
      [class.-translate-x-full]="isMobile && !isOpen">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-4 lg:block lg:p-0">
        <!-- Logo y título centrados -->
        <div class="flex items-center justify-center w-full pt-0 lg:pt-[15px] px-0 lg:px-[15px]">
          <!-- Logo/Icono -->
          <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-9 lg:h-9 bg-white rounded-lg flex items-center justify-center mr-3 shadow-md">
            <i class="fas fa-clipboard-list text-[#004b8d] text-lg sm:text-xl lg:text-lg"></i>
          </div>
          
          <!-- Título -->
          <h1 class="font-bold text-white text-xl sm:text-2xl lg:text-xl font-inter">
            SOLICITUDES
          </h1>
        </div>
        
        <!-- Close button for mobile -->
        <button 
          *ngIf="isMobile"
          (click)="closeMenu.emit()"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-md transition-colors lg:hidden">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- Línea divisora más cerca y perfectamente contenida -->
      <div class="w-full h-px bg-white mt-3 lg:mt-[20px] mx-0"></div>

      <nav class="w-full px-2 lg:px-0 mt-4 lg:mt-6">
        <!-- Tablero button -->
        <div class="w-full h-12 sm:h-14 lg:h-12 flex items-center cursor-pointer transition-colors mb-1 lg:mb-0 rounded-lg lg:rounded-none mx-2 lg:mx-0"
             [class.bg-[#49AA42]]="isActiveRoute('/dashboard')"
             [class.border-black]="isActiveRoute('/dashboard')"
             [class.shadow-[0px_4px_4px_#00000040]]="isActiveRoute('/dashboard')"
             [class.hover:bg-[#0056a3]]="!isActiveRoute('/dashboard')"
             [class.hover:bg-opacity-80]="isMobile && !isActiveRoute('/dashboard')"
             (click)="navigateAndClose('/dashboard')"
             routerLink="/dashboard">
          <div class="ml-4 lg:ml-[17px] flex items-center">
            <i class="fas fa-th-large text-white text-base sm:text-lg w-5 sm:w-6 text-center"></i>
            <span class="ml-3 lg:ml-[13px] font-inter font-bold text-white text-lg sm:text-xl">
              Tablero
            </span>
          </div>
        </div>

        <!-- Registro button -->
        <div class="w-full h-12 sm:h-14 lg:h-12 flex items-center mt-2 lg:mt-[9px] cursor-pointer transition-colors mb-1 lg:mb-0 rounded-lg lg:rounded-none mx-2 lg:mx-0"
             [class.bg-[#49AA42]]="isActiveRoute('/registro')"
             [class.border-black]="isActiveRoute('/registro')"
             [class.shadow-[0px_4px_4px_#00000040]]="isActiveRoute('/registro')"
             [class.hover:bg-[#0056a3]]="!isActiveRoute('/registro')"
             [class.hover:bg-opacity-80]="isMobile && !isActiveRoute('/registro')"
             (click)="navigateAndClose('/registro')"
             routerLink="/registro">
          <div class="ml-4 lg:ml-[17px] flex items-center">
            <i class="fas fa-plus-circle text-white text-base sm:text-lg w-5 sm:w-6 text-center"></i>
            <span class="ml-3 lg:ml-[13px] font-inter font-bold text-white text-lg sm:text-xl">
              Registro
            </span>
          </div>
        </div>

        <!-- Seguimiento button -->
        <div class="w-full h-12 sm:h-14 lg:h-12 flex items-center mt-2 lg:mt-[9px] cursor-pointer transition-colors mb-1 lg:mb-0 rounded-lg lg:rounded-none mx-2 lg:mx-0"
             [class.bg-[#49AA42]]="isActiveRoute('/seguimiento')"
             [class.border-black]="isActiveRoute('/seguimiento')"
             [class.shadow-[0px_4px_4px_#00000040]]="isActiveRoute('/seguimiento')"
             [class.hover:bg-[#0056a3]]="!isActiveRoute('/seguimiento')"
             [class.hover:bg-opacity-80]="isMobile && !isActiveRoute('/seguimiento')"
             (click)="navigateAndClose('/seguimiento')"
             routerLink="/seguimiento">
          <div class="ml-4 lg:ml-[17px] flex items-center">
            <i class="fas fa-tasks text-white text-base sm:text-lg w-5 sm:w-6 text-center"></i>
            <span class="ml-3 lg:ml-[13px] font-inter font-bold text-white text-lg sm:text-xl">
              Seguimiento
            </span>
          </div>
        </div>

        <!-- Reportes button -->
        <div class="w-full h-12 sm:h-14 lg:h-12 flex items-center mt-2 lg:mt-[9px] cursor-pointer transition-colors mb-1 lg:mb-0 rounded-lg lg:rounded-none mx-2 lg:mx-0"
             [class.bg-[#49AA42]]="isActiveRoute('/reportes')"
             [class.border-black]="isActiveRoute('/reportes')"
             [class.shadow-[0px_4px_4px_#00000040]]="isActiveRoute('/reportes')"
             [class.hover:bg-[#0056a3]]="!isActiveRoute('/reportes')"
             [class.hover:bg-opacity-80]="isMobile && !isActiveRoute('/reportes')"
             (click)="navigateAndClose('/reportes')"
             routerLink="/reportes">
          <div class="ml-4 lg:ml-[17px] flex items-center">
            <i class="fas fa-chart-bar text-white text-base sm:text-lg w-5 sm:w-6 text-center"></i>
            <span class="ml-3 lg:ml-[13px] font-inter font-bold text-white text-lg sm:text-xl">
              Reportes
            </span>
          </div>
        </div>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isMobile = false;
  @Input() isOpen = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private router: Router) {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  navigateAndClose(route: string) {
    if (this.isMobile) {
      this.closeMenu.emit();
    }
  }
}