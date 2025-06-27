import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Solicitud, ESTADOS_SOLICITUD_LABELS, TIPOS_SERVICIO_LABELS, PRIORIDAD_LABELS } from '../../core/models/solicitud.model';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <!-- Breadcrumb -->
      <div class="flex items-center mt-3 sm:mt-4 lg:mt-5 px-3 sm:px-4 lg:px-3.5">
        <div class="w-1.5 h-6 sm:h-8 lg:h-[34px] bg-[#49aa42] mr-2 sm:mr-2.5"></div>
        <h2 class="font-inter font-bold text-black text-lg sm:text-xl">
          Seguimiento de Solicitudes
        </h2>
      </div>

      <div class="w-full h-px bg-gray-300 mt-3 sm:mt-4 lg:mt-5 mx-3 sm:mx-4 lg:mx-3.5"></div>

      <!-- Search and filters -->
      <section class="px-3 sm:px-4 lg:px-3.5 mt-4 sm:mt-5 lg:mt-6 pb-6">
        <h3 class="font-inter font-normal italic text-[#004b8d] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10">
          Monitoreo y seguimiento en tiempo real de todas las solicitudes estudiantiles
        </h3>

        <div class="bg-white rounded-lg border border-[#d9d9d9] p-3 sm:p-4 mb-4 sm:mb-6">
          <div class="flex flex-col gap-3 sm:gap-4">
            <!-- Search input -->
            <div class="w-full">
              <input
                type="text"
                [(ngModel)]="filtroTexto"
                (input)="filtrarSolicitudes()"
                placeholder="Buscar por número, cédula, nombre o matrícula..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <!-- Filters row -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div class="flex-1 min-w-0">
                <select
                  [(ngModel)]="filtroEstado"
                  (change)="filtrarSolicitudes()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Todos los estados</option>
                  <option value="recibida">Recibida</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="pendiente_documentos">Pendiente Documentos</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="completada">Completada</option>
                  <option value="entregada">Entregada</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </div>
              <div class="flex-1 min-w-0">
                <select
                  [(ngModel)]="filtroTipoServicio"
                  (change)="filtrarSolicitudes()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Todos los servicios</option>
                  <option value="record_notas">Récord de Notas</option>
                  <option value="certificado_estudios">Certificado de Estudios</option>
                  <option value="constancia_estudiante">Constancia de Estudiante</option>
                  <option value="carta_presentacion">Carta de Presentación</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Solicitudes list -->
        <div class="space-y-3 sm:space-y-4">
          <div *ngFor="let solicitud of solicitudesFiltradas" 
               class="bg-white rounded-lg border border-[#d9d9d9] overflow-hidden hover:shadow-md transition-shadow">
            
            <!-- Header de la solicitud -->
            <div class="p-3 sm:p-4 border-b border-gray-200 cursor-pointer"
                 (click)="toggleSolicitud(solicitud.id!)">
              <div class="flex flex-col gap-3">
                <!-- Primera fila: Número y badges -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h3 class="font-inter font-bold text-base sm:text-lg text-[#004b8d] flex-shrink-0">
                    {{ solicitud.numero }}
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                          [ngClass]="getEstadoClasses(solicitud.estado)">
                      {{ getEstadoTexto(solicitud.estado) }}
                    </span>
                    <span class="px-2 py-1 rounded text-xs font-medium"
                          [ngClass]="getPrioridadClasses(solicitud.prioridad)">
                      {{ getPrioridadTexto(solicitud.prioridad) }}
                    </span>
                  </div>
                </div>

                <!-- Segunda fila: Información del estudiante -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-gray-600">
                  <div class="truncate">
                    <span class="font-medium">Estudiante:</span> 
                    <span class="block sm:inline">{{ solicitud.estudiante.nombre }} {{ solicitud.estudiante.apellido }}</span>
                  </div>
                  <div class="truncate">
                    <span class="font-medium">Cédula:</span> {{ solicitud.estudiante.cedula }}
                  </div>
                  <div class="truncate">
                    <span class="font-medium">Servicio:</span> 
                    <span class="block sm:inline">{{ getTipoServicioTexto(solicitud.tipoServicio) }}</span>
                  </div>
                  <div class="truncate">
                    <span class="font-medium">Fecha:</span> {{ solicitud.fechaSolicitud | date:'dd/MM/yyyy' }}
                  </div>
                </div>

                <!-- Tercera fila: Tiempo y toggle -->
                <div class="flex items-center justify-between">
                  <div class="text-xs sm:text-sm text-gray-600">
                    <span class="font-medium">
                      {{ solicitud.tiempoRespuesta ? solicitud.tiempoRespuesta + ' días' : getDiasTranscurridos(solicitud.fechaSolicitud) + ' días' }}
                    </span>
                    <span class="text-gray-500 ml-1">
                      {{ solicitud.fechaCompletada ? '(Completada)' : '(Tiempo transcurrido)' }}
                    </span>
                  </div>
                  <div class="text-gray-400 text-sm">
                    <span *ngIf="!solicitudExpandida[solicitud.id!]">▼</span>
                    <span *ngIf="solicitudExpandida[solicitud.id!]">▲</span>
                  </div>
                </div>

                <!-- Barra de progreso para solicitudes en proceso -->
                <div *ngIf="isEnProceso(solicitud.estado)" class="mt-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-[#004b8d]">Progreso del proceso</span>
                    <span class="text-xs text-gray-500">{{ getProgresoTexto(solicitud.estado) }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-gradient-to-r from-[#004b8d] to-[#49aa42] h-2 rounded-full transition-all duration-500" 
                         [style.width.%]="getProgresoPorcentaje(solicitud.estado)">
                    </div>
                  </div>
                  <div class="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Recibida</span>
                    <span>En Proceso</span>
                    <span>Revisión</span>
                    <span>Completada</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalles expandibles -->
            <div *ngIf="solicitudExpandida[solicitud.id!]" class="p-3 sm:p-4 bg-gray-50">
              <!-- Tracking detallado para solicitudes en proceso -->
              <div *ngIf="isEnProceso(solicitud.estado)" class="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-[#004b8d]">
                <h5 class="font-inter font-bold text-[#004b8d] mb-3 text-sm sm:text-base flex items-center">
                  <i class="fas fa-route mr-2"></i>
                  Seguimiento en Tiempo Real
                </h5>
                <div class="space-y-3">
                  <div *ngFor="let etapa of getEtapasTracking(solicitud.estado); let i = index" 
                       class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center"
                           [ngClass]="etapa.completada ? 'bg-[#49aa42] text-white' : (etapa.actual ? 'bg-[#004b8d] text-white animate-pulse' : 'bg-gray-300 text-gray-500')">
                        <i [class]="etapa.icono" class="text-sm"></i>
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-medium" 
                           [class]="etapa.completada ? 'text-green-700' : (etapa.actual ? 'text-[#004b8d]' : 'text-gray-500')">
                        {{ etapa.nombre }}
                      </div>
                      <div class="text-xs text-gray-500">{{ etapa.descripcion }}</div>
                      <div *ngIf="etapa.fecha" class="text-xs text-gray-400">{{ etapa.fecha | date:'dd/MM/yyyy HH:mm' }}</div>
                    </div>
                    <div *ngIf="etapa.actual" class="flex-shrink-0">
                      <span class="px-2 py-1 bg-[#004b8d] text-white text-xs rounded-full animate-pulse">
                        En progreso
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Tiempo estimado restante -->
                <div class="mt-4 p-3 bg-white rounded border">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-gray-700">Tiempo estimado restante</div>
                      <div class="text-xs text-gray-500">Basado en el tipo de servicio</div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-[#004b8d]">{{ getTiempoRestante(solicitud) }} días</div>
                      <div class="text-xs text-gray-500">aproximadamente</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <!-- Información del estudiante -->
                <div>
                  <h4 class="font-inter font-bold text-[#004b8d] mb-3 text-sm sm:text-base">Información del Estudiante</h4>
                  <div class="space-y-2 text-xs sm:text-sm">
                    <div class="break-words"><span class="font-medium">Matrícula:</span> {{ solicitud.estudiante.matricula }}</div>
                    <div class="break-words"><span class="font-medium">Carrera:</span> {{ solicitud.estudiante.carrera }}</div>
                    <div *ngIf="solicitud.estudiante.telefono" class="break-words">
                      <span class="font-medium">Teléfono:</span> {{ solicitud.estudiante.telefono }}
                    </div>
                    <div *ngIf="solicitud.estudiante.email" class="break-words">
                      <span class="font-medium">Email:</span> {{ solicitud.estudiante.email }}
                    </div>
                  </div>
                </div>

                <!-- Información de la solicitud -->
                <div>
                  <h4 class="font-inter font-bold text-[#004b8d] mb-3 text-sm sm:text-base">Detalles de la Solicitud</h4>
                  <div class="space-y-2 text-xs sm:text-sm">
                    <div><span class="font-medium">Descripción:</span></div>
                    <div class="text-gray-600 bg-white p-2 rounded border break-words">{{ solicitud.descripcion }}</div>
                    <div *ngIf="solicitud.responsableAsignado" class="break-words">
                      <span class="font-medium">Responsable:</span> {{ solicitud.responsableAsignado }}
                    </div>
                    <div *ngIf="solicitud.costoServicio">
                      <span class="font-medium">Costo:</span> RD$ {{ solicitud.costoServicio }}
                    </div>
                    <div *ngIf="solicitud.fechaLimiteEsperada">
                      <span class="font-medium">Fecha Límite:</span> {{ solicitud.fechaLimiteEsperada | date:'dd/MM/yyyy' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Documentos requeridos -->
              <div *ngIf="solicitud.documentosRequeridos.length > 0" class="mt-4">
                <h5 class="font-inter font-semibold text-gray-800 mb-2 text-sm">Documentos Requeridos</h5>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let doc of solicitud.documentosRequeridos" 
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded break-words">
                    {{ doc }}
                  </span>
                </div>
              </div>

              <!-- Observaciones -->
              <div *ngIf="solicitud.observaciones" class="mt-4">
                <h5 class="font-inter font-semibold text-gray-800 mb-2 text-sm">Observaciones</h5>
                <div class="bg-white p-3 rounded border text-xs sm:text-sm text-gray-600 break-words">
                  {{ solicitud.observaciones }}
                </div>
              </div>

              <!-- Acciones -->
              <div class="mt-4 sm:mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button 
                  *ngIf="solicitud.estado !== 'completada' && solicitud.estado !== 'entregada' && solicitud.estado !== 'rechazada'"
                  (click)="actualizarEstado(solicitud, 'en_proceso')"
                  class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                  Marcar En Proceso
                </button>
                <button 
                  *ngIf="solicitud.estado === 'en_proceso' || solicitud.estado === 'en_revision'"
                  (click)="actualizarEstado(solicitud, 'completada')"
                  class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#49aa42] text-white rounded-md hover:bg-[#3d8a37] transition-colors text-xs sm:text-sm">
                  Marcar Completada
                </button>
                <button 
                  *ngIf="solicitud.estado === 'completada'"
                  (click)="actualizarEstado(solicitud, 'entregada')"
                  class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs sm:text-sm">
                  Marcar Entregada
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="solicitudesFiltradas.length === 0 && !isLoading" 
             class="text-center py-8 sm:py-12">
          <div class="text-gray-400 text-3xl sm:text-4xl mb-4">📋</div>
          <h3 class="font-inter font-medium text-gray-600 mb-2 text-sm sm:text-base">No se encontraron solicitudes</h3>
          <p class="text-gray-500 text-xs sm:text-sm">
            {{ solicitudes.length === 0 ? 'No hay solicitudes registradas' : 'Intenta ajustar los filtros de búsqueda' }}
          </p>
        </div>

        <!-- Loading state -->
        <div *ngIf="isLoading" class="text-center py-8 sm:py-12">
          <div class="text-gray-400 text-3xl sm:text-4xl mb-4">⏳</div>
          <h3 class="font-inter font-medium text-gray-600 text-sm sm:text-base">Cargando solicitudes...</h3>
        </div>
      </section>
    </app-layout>
  `
})
export class SeguimientoComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  solicitudExpandida: { [key: string]: boolean } = {};
  filtroTexto = '';
  filtroEstado = '';
  filtroTipoServicio = '';
  isLoading = true;

  constructor(
    private solicitudesService: SolicitudesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.isLoading = true;
    this.solicitudesService.obtenerSolicitudes().subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes;
        this.filtrarSolicitudes();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando solicitudes:', error);
        this.notificationService.error(
          'Error al cargar solicitudes',
          'No se pudieron cargar las solicitudes. Por favor, intenta nuevamente.'
        );
        this.isLoading = false;
      }
    });
  }

  filtrarSolicitudes() {
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
      const coincideTexto = !this.filtroTexto || 
        solicitud.numero.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        solicitud.estudiante.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        solicitud.estudiante.apellido.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        solicitud.estudiante.cedula.includes(this.filtroTexto) ||
        solicitud.estudiante.matricula.toLowerCase().includes(this.filtroTexto.toLowerCase());
      
      const coincideEstado = !this.filtroEstado || solicitud.estado === this.filtroEstado;
      const coincideTipoServicio = !this.filtroTipoServicio || solicitud.tipoServicio === this.filtroTipoServicio;
      
      return coincideTexto && coincideEstado && coincideTipoServicio;
    });
  }

  toggleSolicitud(id: string) {
    this.solicitudExpandida[id] = !this.solicitudExpandida[id];
  }

  async actualizarEstado(solicitud: Solicitud, nuevoEstado: string) {
    const estadoTexto = this.getEstadoTexto(nuevoEstado);
    
    const confirmado = await this.notificationService.confirm(
      'Confirmar cambio de estado',
      `¿Está seguro de cambiar el estado de la solicitud ${solicitud.numero} a "${estadoTexto}"?`,
      {
        confirmText: 'Sí, cambiar estado',
        cancelText: 'Cancelar',
        type: 'default'
      }
    );

    if (confirmado) {
      this.solicitudesService.actualizarEstadoSolicitud(solicitud.id!, nuevoEstado as any).subscribe({
        next: (solicitudActualizada) => {
          // Actualizar la solicitud en la lista
          const index = this.solicitudes.findIndex(s => s.id === solicitud.id);
          if (index !== -1) {
            this.solicitudes[index] = solicitudActualizada;
            this.filtrarSolicitudes();
          }
          
          // Mostrar notificación de éxito con símbolo de check
          this.notificationService.successWithCheck(
            'Estado actualizado',
            `La solicitud ${solicitud.numero} ha sido marcada como "${estadoTexto}" exitosamente.`
          );
        },
        error: (error) => {
          console.error('Error actualizando estado:', error);
          this.notificationService.error(
            'Error al actualizar estado',
            'No se pudo actualizar el estado de la solicitud. Por favor, intenta nuevamente.'
          );
        }
      });
    }
  }

  // Métodos para el tracking
  isEnProceso(estado: string): boolean {
    return ['en_proceso', 'en_revision', 'pendiente_documentos'].includes(estado);
  }

  getProgresoPorcentaje(estado: string): number {
    const porcentajes = {
      'recibida': 25,
      'en_proceso': 50,
      'en_revision': 75,
      'pendiente_documentos': 60,
      'completada': 100,
      'entregada': 100
    };
    return porcentajes[estado as keyof typeof porcentajes] || 0;
  }

  getProgresoTexto(estado: string): string {
    const textos = {
      'recibida': 'Solicitud recibida',
      'en_proceso': 'En procesamiento',
      'en_revision': 'En revisión final',
      'pendiente_documentos': 'Esperando documentos',
      'completada': 'Proceso completado',
      'entregada': 'Entregada al estudiante'
    };
    return textos[estado as keyof typeof textos] || 'Estado desconocido';
  }

  getEtapasTracking(estado: string) {
    const etapas = [
      {
        nombre: 'Solicitud Recibida',
        descripcion: 'La solicitud ha sido registrada en el sistema',
        icono: 'fas fa-inbox',
        completada: true,
        actual: false,
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 días atrás
      },
      {
        nombre: 'En Procesamiento',
        descripcion: 'El documento está siendo preparado',
        icono: 'fas fa-cogs',
        completada: ['en_proceso', 'en_revision', 'completada', 'entregada'].includes(estado),
        actual: estado === 'en_proceso',
        fecha: estado === 'en_proceso' ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) : undefined
      },
      {
        nombre: 'Revisión y Validación',
        descripcion: 'Verificación final del documento',
        icono: 'fas fa-search',
        completada: ['en_revision', 'completada', 'entregada'].includes(estado),
        actual: estado === 'en_revision',
        fecha: estado === 'en_revision' ? new Date(Date.now() - 4 * 60 * 60 * 1000) : undefined
      },
      {
        nombre: 'Listo para Entrega',
        descripcion: 'El documento está completado y listo',
        icono: 'fas fa-check-circle',
        completada: ['completada', 'entregada'].includes(estado),
        actual: estado === 'completada',
        fecha: estado === 'completada' ? new Date() : undefined
      }
    ];

    return etapas;
  }

  getTiempoRestante(solicitud: Solicitud): number {
    const tiemposEstimados = {
      'record_notas': 3,
      'certificado_estudios': 5,
      'constancia_estudiante': 2,
      'carta_presentacion': 3,
      'certificado_conducta': 5,
      'historial_academico': 7
    };

    const tiempoTotal = tiemposEstimados[solicitud.tipoServicio as keyof typeof tiemposEstimados] || 5;
    const diasTranscurridos = this.getDiasTranscurridos(solicitud.fechaSolicitud);
    const tiempoRestante = Math.max(0, tiempoTotal - diasTranscurridos);
    
    return tiempoRestante;
  }

  getDiasTranscurridos(fechaSolicitud: Date): number {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaSolicitud.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  getEstadoClasses(estado: string): string {
    const classes = {
      'recibida': 'bg-gray-100 text-gray-800',
      'en_proceso': 'bg-blue-100 text-blue-800',
      'en_revision': 'bg-yellow-100 text-yellow-800',
      'pendiente_documentos': 'bg-orange-100 text-orange-800',
      'aprobada': 'bg-green-100 text-green-800',
      'completada': 'bg-green-100 text-green-800',
      'entregada': 'bg-emerald-100 text-emerald-800',
      'rechazada': 'bg-red-100 text-red-800',
      'cancelada': 'bg-gray-100 text-gray-800'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getPrioridadClasses(prioridad: string): string {
    const classes = {
      'baja': 'bg-gray-100 text-gray-600',
      'normal': 'bg-blue-100 text-blue-600',
      'alta': 'bg-orange-100 text-orange-600',
      'urgente': 'bg-red-100 text-red-600'
    };
    return classes[prioridad as keyof typeof classes] || 'bg-gray-100 text-gray-600';
  }

  getEstadoTexto(estado: string): string {
    return ESTADOS_SOLICITUD_LABELS[estado as keyof typeof ESTADOS_SOLICITUD_LABELS] || estado;
  }

  getTipoServicioTexto(tipo: string): string {
    return TIPOS_SERVICIO_LABELS[tipo as keyof typeof TIPOS_SERVICIO_LABELS] || tipo;
  }

  getPrioridadTexto(prioridad: string): string {
    return PRIORIDAD_LABELS[prioridad as keyof typeof PRIORIDAD_LABELS] || prioridad;
  }
}