import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="text-6xl text-red-500 mb-4">🚫</div>
          <h1 class="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p class="text-gray-600 mb-6">
            No tienes permisos suficientes para acceder a esta sección del sistema.
          </p>
          <div class="space-y-3">
            <button
              (click)="goBack()"
              class="w-full px-4 py-2 bg-[#004b8d] text-white rounded-md hover:bg-[#003a6b] transition-colors"
            >
              Volver Atrás
            </button>
            <button
              (click)="goToDashboard()"
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    window.history.back();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}