import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { SolicitudesService } from '../../core/services/solicitudes.service';
import { TiposServicioService, TipoServicio } from '../../core/services/tipos-servicio.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Solicitud, EstadoSolicitud, Prioridad } from '../../core/models/solicitud.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LayoutComponent],
  template: `
    <app-layout>
      <!-- Breadcrumb -->
      <div class="flex items-center mt-3 sm:mt-4 lg:mt-5 px-3 sm:px-4 lg:px-3.5">
        <div class="w-1.5 h-6 sm:h-8 lg:h-[34px] bg-[#49aa42] mr-2 sm:mr-2.5"></div>
        <h2 class="font-inter font-bold text-black text-lg sm:text-xl">
          Registro de Solicitudes
        </h2>
      </div>

      <div class="w-full h-px bg-gray-300 mt-3 sm:mt-4 lg:mt-5 mx-3 sm:mx-4 lg:mx-3.5"></div>

      <!-- Registration form -->
      <section class="px-3 sm:px-4 lg:px-3.5 mt-6 sm:mt-7 lg:mt-8 pb-6">
        <h3 class="font-inter font-normal italic text-[#004b8d] text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10">
          Registro de nuevas solicitudes estudiantiles en el sistema
        </h3>

        <div class="bg-white rounded-lg border border-[#d9d9d9] p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <h3 class="font-inter font-bold text-[#004b8d] text-lg sm:text-xl mb-4 sm:mb-6">
            Nueva Solicitud Estudiantil
          </h3>

          <form [formGroup]="registroForm" (ngSubmit)="onSubmit()" class="space-y-6 sm:space-y-8">
            <!-- Información del Estudiante -->
            <div class="border-b border-gray-200 pb-4 sm:pb-6">
              <h4 class="font-inter font-semibold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4">
                Información del Estudiante
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    formControlName="nombre"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="Nombre del estudiante"
                  />
                  <div *ngIf="registroForm.get('nombre')?.invalid && registroForm.get('nombre')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    El nombre es requerido
                  </div>
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    formControlName="apellido"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="Apellido del estudiante"
                  />
                  <div *ngIf="registroForm.get('apellido')?.invalid && registroForm.get('apellido')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    El apellido es requerido
                  </div>
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Cédula *
                  </label>
                  <input
                    type="text"
                    formControlName="cedula"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="000-0000000-0"
                  />
                  <div *ngIf="registroForm.get('cedula')?.invalid && registroForm.get('cedula')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    La cédula es requerida
                  </div>
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    formControlName="matricula"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="Número de matrícula"
                  />
                  <div *ngIf="registroForm.get('matricula')?.invalid && registroForm.get('matricula')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    La matrícula es requerida
                  </div>
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Carrera *
                  </label>
                  <input
                    type="text"
                    formControlName="carrera"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="Carrera que estudia"
                  />
                  <div *ngIf="registroForm.get('carrera')?.invalid && registroForm.get('carrera')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    La carrera es requerida
                  </div>
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    formControlName="telefono"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="(809) 000-0000"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    formControlName="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="estudiante@ejemplo.com"
                  />
                </div>
              </div>
            </div>

            <!-- Información de la Solicitud -->
            <div>
              <h4 class="font-inter font-semibold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4">
                Información de la Solicitud
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Tipo de Servicio *
                  </label>
                  <select
                    formControlName="tipoServicio"
                    (change)="onTipoServicioChange()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Seleccione un servicio</option>
                    <option *ngFor="let tipo of tiposServicio$ | async" [value]="tipo.codigo">
                      {{ tipo.nombre }}
                    </option>
                  </select>
                  <div *ngIf="registroForm.get('tipoServicio')?.invalid && registroForm.get('tipoServicio')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    Debe seleccionar un tipo de servicio
                  </div>
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Prioridad
                  </label>
                  <select
                    formControlName="prioridad"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div class="sm:col-span-2">
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Descripción *
                  </label>
                  <textarea
                    formControlName="descripcion"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="Describa detalladamente la solicitud y cualquier información adicional relevante"
                  ></textarea>
                  <div *ngIf="registroForm.get('descripcion')?.invalid && registroForm.get('descripcion')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    La descripción es requerida
                  </div>
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Fecha Límite Esperada
                  </label>
                  <input
                    type="date"
                    formControlName="fechaLimite"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label class="block font-inter font-medium text-gray-700 text-sm mb-2">
                    Responsable Asignado
                  </label>
                  <input
                    type="text"
                    formControlName="responsable"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004b8d] focus:border-transparent text-sm sm:text-base"
                    placeholder="Nombre del responsable"
                  />
                </div>
              </div>
            </div>

            <!-- Información del servicio seleccionado -->
            <div *ngIf="servicioSeleccionado" class="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h5 class="font-inter font-semibold text-[#004b8d] mb-2 text-sm sm:text-base">
                Información del Servicio: {{ servicioSeleccionado.nombre }}
              </h5>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span class="font-medium text-gray-700">Tiempo Estimado:</span>
                  <span class="text-gray-600 ml-1">{{ servicioSeleccionado.tiempoEstimado }} días</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Costo:</span>
                  <span class="text-gray-600 ml-1">RD$ {{ servicioSeleccionado.costo }}</span>
                </div>
                <div class="sm:col-span-3">
                  <span class="font-medium text-gray-700">Documentos Requeridos:</span>
                </div>
              </div>
              <div class="mt-2">
                <ul class="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                  <li *ngFor="let doc of servicioSeleccionado.documentosRequeridos">{{ doc }}</li>
                </ul>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="button"
                (click)="resetForm()"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-md font-inter font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Limpiar
              </button>
              <button
                type="submit"
                [disabled]="registroForm.invalid || isSubmitting"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#004b8d] text-white rounded-md font-inter font-medium hover:bg-[#003a6b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                {{ isSubmitting ? 'Registrando...' : 'Registrar Solicitud' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </app-layout>
  `
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  tiposServicio$!: Observable<TipoServicio[]>;
  servicioSeleccionado: TipoServicio | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private solicitudesService: SolicitudesService,
    private tiposServicioService: TiposServicioService,
    private notificationService: NotificationService
  ) {
    this.registroForm = this.fb.group({
      // Información del estudiante
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      matricula: ['', Validators.required],
      carrera: ['', Validators.required],
      telefono: [''],
      email: ['', Validators.email],
      
      // Información de la solicitud
      tipoServicio: ['', Validators.required],
      descripcion: ['', Validators.required],
      prioridad: ['normal'],
      fechaLimite: [''],
      responsable: ['']
    });
  }

  ngOnInit() {
    this.tiposServicio$ = this.tiposServicioService.obtenerTiposServicio();
  }

  onTipoServicioChange() {
    const tipoSeleccionado = this.registroForm.get('tipoServicio')?.value;
    if (tipoSeleccionado) {
      this.tiposServicioService.obtenerTipoServicioPorCodigo(tipoSeleccionado)
        .subscribe(tipo => {
          this.servicioSeleccionado = tipo;
        });
    } else {
      this.servicioSeleccionado = null;
    }
  }

  onSubmit() {
    if (this.registroForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.registroForm.value;
      const solicitud: Partial<Solicitud> = {
        estudiante: {
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          cedula: formValue.cedula,
          matricula: formValue.matricula,
          carrera: formValue.carrera,
          telefono: formValue.telefono,
          email: formValue.email
        },
        tipoServicio: formValue.tipoServicio,
        descripcion: formValue.descripcion,
        prioridad: formValue.prioridad as Prioridad,
        fechaLimiteEsperada: formValue.fechaLimite ? new Date(formValue.fechaLimite) : undefined,
        responsableAsignado: formValue.responsable,
        documentosRequeridos: this.servicioSeleccionado?.documentosRequeridos || [],
        costoServicio: this.servicioSeleccionado?.costo || 0
      };

      this.solicitudesService.crearSolicitud(solicitud).subscribe({
        next: (solicitudCreada) => {
          // Mostrar notificación de éxito con símbolo de check
          this.notificationService.successWithCheck(
            'Solicitud registrada exitosamente',
            `La solicitud ${solicitudCreada.numero} ha sido creada y está siendo procesada.`
          );
          
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error registrando solicitud:', error);
          this.notificationService.error(
            'Error al registrar solicitud',
            'No se pudo registrar la solicitud. Por favor, verifica los datos e intenta nuevamente.'
          );
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm() {
    this.registroForm.reset();
    this.registroForm.patchValue({ prioridad: 'normal' });
    this.servicioSeleccionado = null;
  }
}