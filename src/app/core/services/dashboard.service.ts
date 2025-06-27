import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StatusCard } from '../../shared/components/status-card/status-card.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor() {}

  getStatusCards(): Observable<StatusCard[]> {
    return of([
      { 
        title: 'Solicitudes Completadas', 
        value: '127',
        color: '#49aa42'
      },
      { 
        title: 'Solicitudes en Proceso', 
        value: '34',
        color: '#004b8d'
      },
      { 
        title: 'Solicitudes Pendientes', 
        value: '18',
        color: '#f59e0b'
      },
      { 
        title: 'Total de Solicitudes', 
        value: '179',
        color: '#6d6d6d'
      }
    ]);
  }

  getEstadisticasDetalladas(): Observable<any> {
    return of({
      total: 179,
      completadas: 127,
      enProceso: 34,
      pendientes: 18,
      tiempoPromedioRespuesta: 3.8
    });
  }

  getUserInfo() {
    return {
      name: 'C. PORTORREAL',
      role: 'ADMINISTRADOR',
      initials: 'CP'
    };
  }

  getServiciosMasSolicitados(): Observable<any[]> {
    return of([
      { nombre: 'Récord de Notas', porcentaje: 38, cantidad: 68 },
      { nombre: 'Constancia de Estudiante', porcentaje: 25, cantidad: 45 },
      { nombre: 'Certificado de Estudios', porcentaje: 18, cantidad: 32 },
      { nombre: 'Carta de Presentación', porcentaje: 12, cantidad: 21 },
      { nombre: 'Certificado de Conducta', porcentaje: 7, cantidad: 13 }
    ]);
  }

  getTiemposRespuestaPorServicio(): Observable<any[]> {
    return of([
      { servicio: 'Récord de Notas', tiempo: 3, color: '#004b8d' },
      { servicio: 'Constancia Estudiante', tiempo: 2, color: '#49aa42' },
      { servicio: 'Certificado Estudios', tiempo: 5, color: '#f59e0b' },
      { servicio: 'Carta Presentación', tiempo: 3, color: '#8b5cf6' },
      { servicio: 'Certificado Conducta', tiempo: 4, color: '#ef4444' },
      { servicio: 'Historial Académico', tiempo: 7, color: '#06b6d4' }
    ]);
  }

  getActividadReciente(): Observable<any[]> {
    return of([
      {
        tipo: 'completada',
        solicitud: 'SOL-2024-789456',
        estudiante: 'María González',
        servicio: 'Récord de Notas',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        icono: 'fas fa-check-circle',
        color: 'text-green-600'
      },
      {
        tipo: 'nueva',
        solicitud: 'SOL-2024-789457',
        estudiante: 'Carlos Rodríguez',
        servicio: 'Certificado de Estudios',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        icono: 'fas fa-plus-circle',
        color: 'text-blue-600'
      },
      {
        tipo: 'en_proceso',
        solicitud: 'SOL-2024-789455',
        estudiante: 'Ana Martínez',
        servicio: 'Constancia de Estudiante',
        fecha: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
        icono: 'fas fa-clock',
        color: 'text-yellow-600'
      },
      {
        tipo: 'entregada',
        solicitud: 'SOL-2024-789454',
        estudiante: 'Luis Pérez',
        servicio: 'Carta de Presentación',
        fecha: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
        icono: 'fas fa-handshake',
        color: 'text-emerald-600'
      }
    ]);
  }
}