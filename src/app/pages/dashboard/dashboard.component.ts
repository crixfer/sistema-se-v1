import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { StatusCardComponent, StatusCard } from '../../shared/components/status-card/status-card.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent, StatusCardComponent],
  template: `
    <app-layout>
      <!-- Breadcrumb -->
      <div class="flex items-center mt-3 sm:mt-4 lg:mt-5 px-3 sm:px-4 lg:px-3.5">
        <div class="w-1.5 h-6 sm:h-8 lg:h-[34px] bg-[#49aa42] mr-2 sm:mr-2.5"></div>
        <h2 class="font-inter font-bold text-black text-lg sm:text-xl">
          Tablero
        </h2>
      </div>

      <div class="w-full h-px bg-gray-300 mt-3 sm:mt-4 lg:mt-5 mx-3 sm:mx-4 lg:mx-3.5"></div>

      <!-- Dashboard content -->
      <section class="px-3 sm:px-4 lg:px-3.5 mt-6 sm:mt-7 lg:mt-8 pb-6">
        <h3 class="font-inter font-normal italic text-[#004b8d] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10">
          Vista previa de estado de solicitudes estudiantiles
        </h3>

        <!-- Status cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          <app-status-card 
            *ngFor="let card of statusCards$ | async" 
            [card]="card">
          </app-status-card>
        </div>

        <!-- Estadísticas detalladas -->
        <div class="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <!-- Métricas de rendimiento -->
          <div class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
            <h4 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
              Métricas de Rendimiento
            </h4>
            <div class="space-y-3 sm:space-y-4" *ngIf="estadisticas$ | async as stats">
              <div class="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-blue-50 rounded-md">
                <div>
                  <div class="font-inter font-medium text-xs sm:text-sm text-gray-800">Tiempo Promedio de Respuesta</div>
                  <div class="font-inter text-xs text-gray-500">Días hábiles</div>
                </div>
                <div class="text-xl sm:text-2xl font-bold text-[#004b8d]">{{ stats.tiempoPromedioRespuesta }}</div>
              </div>
              <div class="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-green-50 rounded-md">
                <div>
                  <div class="font-inter font-medium text-xs sm:text-sm text-gray-800">Tasa de Completado</div>
                  <div class="font-inter text-xs text-gray-500">Porcentaje</div>
                </div>
                <div class="text-xl sm:text-2xl font-bold text-[#49aa42]">
                  {{ stats.total > 0 ? ((stats.completadas / stats.total) * 100).toFixed(1) : 0 }}%
                </div>
              </div>
              <div class="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-yellow-50 rounded-md">
                <div>
                  <div class="font-inter font-medium text-xs sm:text-sm text-gray-800">Solicitudes Este Mes</div>
                  <div class="font-inter text-xs text-gray-500">Nuevas solicitudes</div>
                </div>
                <div class="text-xl sm:text-2xl font-bold text-yellow-600">{{ stats.total }}</div>
              </div>
              <div class="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 bg-purple-50 rounded-md">
                <div>
                  <div class="font-inter font-medium text-xs sm:text-sm text-gray-800">Eficiencia del Sistema</div>
                  <div class="font-inter text-xs text-gray-500">Solicitudes/día</div>
                </div>
                <div class="text-xl sm:text-2xl font-bold text-purple-600">8.2</div>
              </div>
            </div>
          </div>

          <!-- Servicios más solicitados -->
          <div class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
            <h4 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
              Servicios Más Solicitados
            </h4>
            <div class="space-y-3 sm:space-y-4" *ngIf="serviciosMasSolicitados$ | async as servicios">
              <div *ngFor="let servicio of servicios" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
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
        </div>

        <!-- Actividad reciente y tiempos de respuesta -->
        <div class="mt-6 sm:mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <!-- Actividad reciente -->
          <div class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
            <h4 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
              Actividad Reciente
            </h4>
            <div class="space-y-3 sm:space-y-4" *ngIf="actividadReciente$ | async as actividades">
              <div *ngFor="let actividad of actividades" class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-shrink-0 mt-1">
                  <i [class]="actividad.icono + ' ' + actividad.color + ' text-sm'"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-inter text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {{ actividad.solicitud }}
                  </div>
                  <div class="font-inter text-xs text-gray-600 truncate">
                    {{ actividad.estudiante }} - {{ actividad.servicio }}
                  </div>
                  <div class="font-inter text-xs text-gray-500">
                    {{ getTimeAgo(actividad.fecha) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tiempos de respuesta por servicio -->
          <div class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
            <h4 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
              Tiempos de Respuesta por Servicio
            </h4>
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" *ngIf="tiemposRespuesta$ | async as tiempos">
              <div *ngFor="let tiempo of tiempos" class="text-center p-3 sm:p-4 rounded-lg" [style.background-color]="tiempo.color + '20'">
                <div class="text-base sm:text-lg font-bold mb-1" [style.color]="tiempo.color">{{ tiempo.tiempo }} días</div>
                <div class="text-xs text-gray-600 leading-tight">{{ tiempo.servicio }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen mensual -->
        <div class="mt-6 sm:mt-8 bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6">
          <h4 class="font-inter font-bold text-[#004b8d] text-base sm:text-lg mb-4 sm:mb-6">
            Resumen de Solicitudes por Mes
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <div class="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div class="text-base sm:text-lg font-bold text-[#004b8d] mb-1">42</div>
              <div class="text-xs text-gray-600">Enero</div>
            </div>
            <div class="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <div class="text-base sm:text-lg font-bold text-[#49aa42] mb-1">38</div>
              <div class="text-xs text-gray-600">Febrero</div>
            </div>
            <div class="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
              <div class="text-base sm:text-lg font-bold text-yellow-600 mb-1">45</div>
              <div class="text-xs text-gray-600">Marzo</div>
            </div>
            <div class="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div class="text-base sm:text-lg font-bold text-purple-600 mb-1">52</div>
              <div class="text-xs text-gray-600">Abril</div>
            </div>
            <div class="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
              <div class="text-base sm:text-lg font-bold text-red-600 mb-1">48</div>
              <div class="text-xs text-gray-600">Mayo</div>
            </div>
            <div class="text-center p-3 sm:p-4 bg-indigo-50 rounded-lg">
              <div class="text-base sm:text-lg font-bold text-indigo-600 mb-1">35</div>
              <div class="text-xs text-gray-600">Junio</div>
            </div>
          </div>
        </div>
      </section>
    </app-layout>
  `
})
export class DashboardComponent implements OnInit {
  statusCards$!: Observable<StatusCard[]>;
  estadisticas$!: Observable<any>;
  serviciosMasSolicitados$!: Observable<any[]>;
  tiemposRespuesta$!: Observable<any[]>;
  actividadReciente$!: Observable<any[]>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.statusCards$ = this.dashboardService.getStatusCards();
    this.estadisticas$ = this.dashboardService.getEstadisticasDetalladas();
    this.serviciosMasSolicitados$ = this.dashboardService.getServiciosMasSolicitados();
    this.tiemposRespuesta$ = this.dashboardService.getTiemposRespuestaPorServicio();
    this.actividadReciente$ = this.dashboardService.getActividadReciente();
  }

  getTimeAgo(fecha: Date): string {
    const now = new Date();
    const diff = now.getTime() - fecha.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Hace un momento';
    }
  }
}