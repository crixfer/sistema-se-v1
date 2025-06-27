import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'warning' | 'success';
  icon?: string;
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay -->
    <div 
      *ngIf="visible"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      [class.opacity-100]="modalVisible"
      [class.opacity-0]="!modalVisible"
      (click)="onOverlayClick($event)">
      
      <!-- Modal - Ajustado al 40% del ancho de la pantalla -->
      <div 
        class="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300"
        style="width: min(40vw, 28rem); min-width: 320px;"
        [class.scale-100]="modalVisible"
        [class.scale-95]="!modalVisible"
        [class.opacity-100]="modalVisible"
        [class.opacity-0]="!modalVisible"
        (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-6 pb-4">
          <div class="flex items-center">
            <!-- Icono -->
            <div *ngIf="data.icon || getDefaultIcon()" class="flex-shrink-0 mr-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center"
                   [ngClass]="getIconBackgroundClass()">
                <i [class]="data.icon || getDefaultIcon()" class="text-white text-xl"></i>
              </div>
            </div>
            
            <!-- Título -->
            <div class="flex-1">
              <h3 class="font-inter font-bold text-lg text-gray-900">
                {{ data.title }}
              </h3>
            </div>
          </div>
        </div>
        
        <!-- Contenido -->
        <div class="px-6 pb-6">
          <p class="font-inter text-gray-600 text-sm leading-relaxed">
            {{ data.message }}
          </p>
        </div>
        
        <!-- Botones -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            (click)="onCancel()"
            class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md font-inter font-medium text-gray-700 hover:bg-gray-100 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            {{ data.cancelText || 'Cancelar' }}
          </button>
          
          <button
            (click)="onConfirm()"
            class="w-full sm:w-auto px-4 py-2 rounded-md font-inter font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            [ngClass]="getConfirmButtonClass()">
            {{ data.confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent implements OnInit {
  @Input() data!: ConfirmationData;
  @Input() visible = false;
  @Output() confirmed = new EventEmitter<boolean>();

  modalVisible = false;

  ngOnInit() {
    if (this.visible) {
      // Pequeño delay para la animación
      setTimeout(() => {
        this.modalVisible = true;
      }, 50);
    }
  }

  onOverlayClick(event: Event) {
    // Cerrar al hacer clic en el overlay
    this.onCancel();
  }

  onConfirm() {
    this.modalVisible = false;
    setTimeout(() => {
      this.confirmed.emit(true);
    }, 300);
  }

  onCancel() {
    this.modalVisible = false;
    setTimeout(() => {
      this.confirmed.emit(false);
    }, 300);
  }

  getDefaultIcon(): string {
    const icons = {
      'default': 'fas fa-question-circle',
      'danger': 'fas fa-exclamation-triangle',
      'warning': 'fas fa-exclamation-triangle',
      'success': 'fas fa-check-circle'
    };
    return icons[this.data.type || 'default'];
  }

  getIconBackgroundClass(): string {
    const classes = {
      'default': 'bg-blue-500',
      'danger': 'bg-red-500',
      'warning': 'bg-yellow-500',
      'success': 'bg-green-500'
    };
    return classes[this.data.type || 'default'];
  }

  getConfirmButtonClass(): string {
    const classes = {
      'default': 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      'danger': 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      'warning': 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
      'success': 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    };
    return classes[this.data.type || 'default'];
  }
}