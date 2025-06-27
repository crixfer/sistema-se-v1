import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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
      <div class="flex items-center">
        <!-- User name and role - Hidden on very small screens -->
        <div class="mr-2 sm:mr-4 text-right hidden xs:block">
          <div class="font-doppio font-normal text-black text-sm sm:text-base leading-tight">
            {{ userInfo.name }}
          </div>
          <div class="font-doppio font-normal text-[#adabab] text-[10px] sm:text-[11px]">
            {{ userInfo.role }}
          </div>
        </div>
        
        <!-- Línea divisora alineada con la del sidebar -->
        <div class="w-px h-6 sm:h-8 lg:h-[34px] bg-gray-300 mr-2 sm:mr-4"></div>
        
        <!-- Avatar -->
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-[#004b8d] rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-xs sm:text-sm">{{ userInfo.initials }}</span>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() userInfo: any = {
    name: 'C. PORTORREAL',
    role: 'ADMINISTRADOR',
    initials: 'CP'
  };
  @Input() isMobile = false;
  @Output() toggleMenu = new EventEmitter<void>();
}