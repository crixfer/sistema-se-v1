import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../shared/components/layout/layout.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <!-- Breadcrumb -->
      <div class="flex items-center mt-3 sm:mt-4 lg:mt-5 px-3 sm:px-4 lg:px-3.5">
        <div class="w-1.5 h-6 sm:h-8 lg:h-[34px] bg-[#49aa42] mr-2 sm:mr-2.5"></div>
        <h2 class="font-inter font-bold text-black text-lg sm:text-xl">
          Reportes
        </h2>
      </div>

      <div class="w-full h-px bg-gray-300 mt-3 sm:mt-4 lg:mt-5 mx-3 sm:mx-4 lg:mx-3.5"></div>

      <!-- Reports content -->
      <section class="px-3 sm:px-4 lg:px-3.5 mt-6 sm:mt-7 lg:mt-8 pb-6">
        <h3 class="font-inter font-normal italic text-[#004b8d] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10">
          Análisis y reportes del sistema de solicitudes estudiantiles
        </h3>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <!-- Statistics Summary -->
          <div class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
            <h3 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
              Resumen Estadístico
            </h3>
            <div class="space-y-3 sm:space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="font-inter text-xs sm:text-sm text-gray-700">Total de Solicitudes</span>
                <span class="font-inter font-bold text-base sm:text-lg text-[#004b8d]">{{ totalSolicitudes }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="font-inter text-xs sm:text-sm text-gray-700">Completadas este mes</span>
                <span class="font-inter font-bold text-base sm:text-lg text-[#49aa42]">{{ completadasMes }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="font-inter text-xs sm:text-sm text-gray-700">Promedio de procesamiento</span>
                <span class="font-inter font-bold text-base sm:text-lg text-[#6d6d6d]">{{ promedioTiempo }} días</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="font-inter text-xs sm:text-sm text-gray-700">Tasa de éxito</span>
                <span class="font-inter font-bold text-base sm:text-lg text-[#49aa42]">{{ tasaExito }}%</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="font-inter text-xs sm:text-sm text-gray-700">Satisfacción del cliente</span>
                <span class="font-inter font-bold text-base sm:text-lg text-[#8b5cf6]">{{ satisfaccionCliente }}%</span>
              </div>
            </div>
          </div>

          <!-- Recent Reports -->
          <div class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
            <h3 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
              Reportes Recientes
            </h3>
            <div class="space-y-2 sm:space-y-3">
              <div *ngFor="let reporte of reportesRecientes" 
                   class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 px-3 sm:px-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer gap-2 sm:gap-0">
                <div class="min-w-0 flex-1">
                  <div class="font-inter font-medium text-xs sm:text-sm text-gray-800 truncate">{{ reporte.nombre }}</div>
                  <div class="font-inter text-xs text-gray-500">{{ reporte.fecha }} • {{ reporte.tamano }}</div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="px-2 py-1 text-xs rounded-full" [ngClass]="getStatusClass(reporte.estado)">
                    {{ reporte.estado }}
                  </span>
                  <button class="text-[#004b8d] hover:text-[#003a6b] font-inter text-xs sm:text-sm font-medium">
                    <i class="fas fa-download mr-1"></i>Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="mt-6 sm:mt-8 bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
          <h3 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
            Análisis de Tendencias por Mes
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            <div *ngFor="let mes of solicitudesPorMes" class="text-center p-3 sm:p-4 rounded-lg" [style.background-color]="mes.color + '20'">
              <div class="text-xl sm:text-2xl font-bold mb-2" [style.color]="mes.color">{{ mes.cantidad }}</div>
              <div class="text-xs sm:text-sm text-gray-600 mb-1">{{ mes.nombre }}</div>
              <div class="text-xs text-gray-500">
                <span [class]="mes.tendencia > 0 ? 'text-green-600' : 'text-red-600'">
                  <i [class]="mes.tendencia > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  {{ Math.abs(mes.tendencia) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Análisis por tipo de servicio -->
        <div class="mt-6 sm:mt-8 bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
          <h3 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
            Análisis por Tipo de Servicio
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Servicios más solicitados -->
            <div>
              <h4 class="font-inter font-semibold text-gray-800 mb-4 text-sm sm:text-base">Servicios Más Solicitados</h4>
              <div class="space-y-3">
                <div *ngFor="let servicio of serviciosMasSolicitados" class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="font-inter text-xs sm:text-sm text-gray-700 truncate">{{ servicio.nombre }}</div>
                    <div class="font-inter text-xs text-gray-500">{{ servicio.cantidad }} solicitudes</div>
                  </div>
                  <div class="flex items-center ml-4">
                    <div class="w-16 sm:w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div class="bg-[#004b8d] h-2 rounded-full" [style.width.%]="servicio.porcentaje"></div>
                    </div>
                    <span class="font-inter text-xs text-[#004b8d] font-medium min-w-[2rem] text-right">{{ servicio.porcentaje }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tiempos promedio -->
            <div>
              <h4 class="font-inter font-semibold text-gray-800 mb-4 text-sm sm:text-base">Tiempos Promedio de Procesamiento</h4>
              <div class="space-y-3">
                <div *ngFor="let tiempo of tiemposPromedio" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div class="flex-1 min-w-0">
                    <div class="font-inter text-xs sm:text-sm text-gray-700 truncate">{{ tiempo.servicio }}</div>
                    <div class="font-inter text-xs text-gray-500">Tiempo estimado: {{ tiempo.estimado }} días</div>
                  </div>
                  <div class="text-right">
                    <div class="font-inter text-sm font-bold" [class]="tiempo.real <= tiempo.estimado ? 'text-green-600' : 'text-red-600'">
                      {{ tiempo.real }} días
                    </div>
                    <div class="font-inter text-xs text-gray-500">
                      {{ tiempo.real <= tiempo.estimado ? 'A tiempo' : 'Retrasado' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="mt-6 sm:mt-8 bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
          <h3 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
            Generar Nuevos Reportes
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button class="w-full px-4 py-3 bg-[#004b8d] text-white rounded-md font-inter font-medium hover:bg-[#003a6b] transition-colors text-sm sm:text-base flex items-center justify-center">
              <i class="fas fa-file-excel mr-2"></i>
              Exportar a Excel
            </button>
            <button class="w-full px-4 py-3 bg-[#49aa42] text-white rounded-md font-inter font-medium hover:bg-[#3d8a37] transition-colors text-sm sm:text-base flex items-center justify-center">
              <i class="fas fa-file-pdf mr-2"></i>
              Exportar a PDF
            </button>
            <button class="w-full px-4 py-3 border border-[#004b8d] text-[#004b8d] rounded-md font-inter font-medium hover:bg-[#004b8d] hover:text-white transition-colors text-sm sm:text-base flex items-center justify-center">
              <i class="fas fa-chart-line mr-2"></i>
              Reporte Personalizado
            </button>
            <button class="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-inter font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base flex items-center justify-center">
              <i class="fas fa-calendar-alt mr-2"></i>
              Programar Reporte
            </button>
          </div>
        </div>

        <!-- Alertas y notificaciones -->
        <div class="mt-6 sm:mt-8 bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
          <h3 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
            Alertas del Sistema
          </h3>
          <div class="space-y-3">
            <div *ngFor="let alerta of alertas" class="flex items-start space-x-3 p-3 rounded-lg" [ngClass]="getAlertClass(alerta.tipo)">
              <div class="flex-shrink-0 mt-1">
                <i [class]="getAlertIcon(alerta.tipo)"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-inter font-medium text-sm">{{ alerta.titulo }}</div>
                <div class="font-inter text-xs text-gray-600 mt-1">{{ alerta.descripcion }}</div>
                <div class="font-inter text-xs text-gray-500 mt-1">{{ alerta.fecha }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </app-layout>
  `
})
export class ReportesComponent implements OnInit {
  // Make Math available in template
  public Math = Math;

  totalSolicitudes = 179;
  completadasMes = 67;
  promedioTiempo = 3.8;
  tasaExito = 94.7;
  satisfaccionCliente = 92.3;

  solicitudesPorMes = [
    { nombre: 'Enero', cantidad: 42, color: '#004b8d', tendencia: 8.5 },
    { nombre: 'Febrero', cantidad: 38, color: '#49aa42', tendencia: -9.5 },
    { nombre: 'Marzo', cantidad: 45, color: '#f59e0b', tendencia: 18.4 },
    { nombre: 'Abril', cantidad: 52, color: '#8b5cf6', tendencia: 15.6 },
    { nombre: 'Mayo', cantidad: 48, color: '#ef4444', tendencia: -7.7 },
    { nombre: 'Junio', cantidad: 35, color: '#06b6d4', tendencia: -27.1 }
  ];

  reportesRecientes = [
    { 
      nombre: 'Reporte Mensual - Junio 2024', 
      fecha: '26 Jun 2024', 
      tamano: '2.4 MB',
      estado: 'Completado'
    },
    { 
      nombre: 'Análisis de Productividad Q2', 
      fecha: '20 Jun 2024', 
      tamano: '1.8 MB',
      estado: 'Completado'
    },
    { 
      nombre: 'Reporte de Solicitudes Pendientes', 
      fecha: '15 Jun 2024', 
      tamano: '956 KB',
      estado: 'Completado'
    },
    { 
      nombre: 'Estadísticas Semestrales', 
      fecha: '10 Jun 2024', 
      tamano: '3.2 MB',
      estado: 'Procesando'
    },
    { 
      nombre: 'Análisis de Satisfacción', 
      fecha: '05 Jun 2024', 
      tamano: '1.2 MB',
      estado: 'Completado'
    }
  ];

  serviciosMasSolicitados = [
    { nombre: 'Récord de Notas', cantidad: 68, porcentaje: 38 },
    { nombre: 'Constancia de Estudiante', cantidad: 45, porcentaje: 25 },
    { nombre: 'Certificado de Estudios', cantidad: 32, porcentaje: 18 },
    { nombre: 'Carta de Presentación', cantidad: 21, porcentaje: 12 },
    { nombre: 'Certificado de Conducta', cantidad: 13, porcentaje: 7 }
  ];

  tiemposPromedio = [
    { servicio: 'Récord de Notas', estimado: 3, real: 2.8 },
    { servicio: 'Constancia de Estudiante', estimado: 2, real: 1.9 },
    { servicio: 'Certificado de Estudios', estimado: 5, real: 4.2 },
    { servicio: 'Carta de Presentación', estimado: 3, real: 2.5 },
    { servicio: 'Certificado de Conducta', estimado: 5, real: 5.8 },
    { servicio: 'Historial Académico', estimado: 7, real: 6.3 }
  ];

  alertas = [
    {
      tipo: 'warning',
      titulo: 'Tiempo de procesamiento elevado',
      descripcion: 'Los certificados de conducta están tomando más tiempo del estimado (5.8 vs 5.0 días)',
      fecha: 'Hace 2 horas'
    },
    {
      tipo: 'info',
      titulo: 'Pico de solicitudes detectado',
      descripcion: 'Se ha registrado un aumento del 15% en solicitudes de récord de notas esta semana',
      fecha: 'Hace 4 horas'
    },
    {
      tipo: 'success',
      titulo: 'Meta de satisfacción alcanzada',
      descripcion: 'La satisfacción del cliente ha superado el 90% por tercer mes consecutivo',
      fecha: 'Hace 1 día'
    }
  ];

  ngOnInit() {
    // Aquí podrías cargar datos reales desde un servicio
  }

  getStatusClass(estado: string): string {
    const classes = {
      'Completado': 'bg-green-100 text-green-800',
      'Procesando': 'bg-yellow-100 text-yellow-800',
      'Error': 'bg-red-100 text-red-800'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getAlertClass(tipo: string): string {
    const classes = {
      'warning': 'bg-yellow-50 border-l-4 border-yellow-400',
      'info': 'bg-blue-50 border-l-4 border-blue-400',
      'success': 'bg-green-50 border-l-4 border-green-400',
      'error': 'bg-red-50 border-l-4 border-red-400'
    };
    return classes[tipo as keyof typeof classes] || 'bg-gray-50 border-l-4 border-gray-400';
  }

  getAlertIcon(tipo: string): string {
    const icons = {
      'warning': 'fas fa-exclamation-triangle text-yellow-600',
      'info': 'fas fa-info-circle text-blue-600',
      'success': 'fas fa-check-circle text-green-600',
      'error': 'fas fa-times-circle text-red-600'
    };
    return icons[tipo as keyof typeof icons] || 'fas fa-info-circle text-gray-600';
  }
}