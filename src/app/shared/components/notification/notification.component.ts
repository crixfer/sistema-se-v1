import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  showCloseButton?: boolean;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="transform transition-all duration-500 ease-out mb-3"
      [class.translate-x-0]="visible"
      [class.translate-x-full]="!visible"
      [class.opacity-100]="visible"
      [class.opacity-0]="!visible"
      [class.scale-100]="visible"
      [class.scale-95]="!visible">
      
      <div class="bg-white rounded-lg shadow-xl border-l-4 overflow-hidden max-w-sm w-full"
           [ngClass]="getBorderClass()">
        
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icono -->
            <div class="flex-shrink-0 mr-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center"
                   [ngClass]="getIconBackgroundClass()">
                <i [class]="getIconClass()" class="text-white text-lg"></i>
              </div>
            </div>
            
            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <h4 class="font-inter font-bold text-gray-900 text-sm mb-1">
                {{ notification.title }}
              </h4>
              <p class="font-inter text-gray-600 text-sm leading-relaxed">
                {{ notification.message }}
              </p>
            </div>
            
            <!-- Botón cerrar -->
            <div *ngIf="notification.showCloseButton !== false" class="flex-shrink-0 ml-2">
              <button 
                (click)="close()"
                class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
                <i class="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Barra de progreso para auto-close -->
        <div *ngIf="notification.duration && notification.duration > 0" 
             class="h-1 bg-gray-200">
          <div class="h-full transition-all ease-linear"
               [ngClass]="getProgressBarClass()"
               [style.width.%]="progressWidth">
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationComponent implements OnInit {
  @Input() notification!: Notification;
  @Output() closed = new EventEmitter<void>();

  visible = false;
  progressWidth = 100;
  private progressInterval?: number;

  ngOnInit() {
    // Mostrar la notificación con animación
    setTimeout(() => {
      this.visible = true;
    }, 100);

    // Auto-cerrar si tiene duración
    if (this.notification.duration && this.notification.duration > 0) {
      this.startProgressBar();
      setTimeout(() => {
        this.close();
      }, this.notification.duration);
    }
  }

  private startProgressBar() {
    if (!this.notification.duration) return;
    
    const interval = 50; // Actualizar cada 50ms
    const totalSteps = this.notification.duration / interval;
    const stepDecrement = 100 / totalSteps;
    
    this.progressInterval = window.setInterval(() => {
      this.progressWidth -= stepDecrement;
      if (this.progressWidth <= 0) {
        this.progressWidth = 0;
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
        }
      }
    }, interval);
  }

  close() {
    this.visible = false;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    // Esperar a que termine la animación antes de emitir el evento
    setTimeout(() => {
      this.closed.emit();
    }, 500);
  }

  getBorderClass(): string {
    const classes = {
      'success': 'border-l-green-500',
      'error': 'border-l-red-500',
      'warning': 'border-l-yellow-500',
      'info': 'border-l-blue-500'
    };
    return classes[this.notification.type];
  }

  getIconClass(): string {
    const icons = {
      'success': 'fas fa-check',
      'error': 'fas fa-times',
      'warning': 'fas fa-exclamation-triangle',
      'info': 'fas fa-info'
    };
    return icons[this.notification.type];
  }

  getIconBackgroundClass(): string {
    const classes = {
      'success': 'bg-green-500',
      'error': 'bg-red-500',
      'warning': 'bg-yellow-500',
      'info': 'bg-blue-500'
    };
    return classes[this.notification.type];
  }

  getProgressBarClass(): string {
    const classes = {
      'success': 'bg-green-500',
      'error': 'bg-red-500',
      'warning': 'bg-yellow-500',
      'info': 'bg-blue-500'
    };
    return classes[this.notification.type];
  }
}