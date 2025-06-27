import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../components/notification/notification.component';
import { ConfirmationData } from '../components/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private confirmationSubject = new BehaviorSubject<ConfirmationData | null>(null);
  public confirmation$ = this.confirmationSubject.asObservable();

  private idCounter = 0;
  private confirmationResolver?: (value: boolean) => void;

  constructor() {}

  // Método principal para mostrar notificaciones
  show(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      ...notification,
      id: (++this.idCounter).toString(),
      duration: notification.duration ?? 5000, // 5 segundos por defecto
      showCloseButton: notification.showCloseButton ?? true
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);
  }

  // Métodos de conveniencia para notificaciones
  success(title: string, message: string, duration?: number): void {
    this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, duration?: number): void {
    this.show({
      type: 'error',
      title,
      message,
      duration: duration ?? 7000 // Los errores duran más tiempo
    });
  }

  warning(title: string, message: string, duration?: number): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(title: string, message: string, duration?: number): void {
    this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  // Método especial para éxito con símbolo de check
  successWithCheck(title: string, message: string, duration?: number): void {
    this.show({
      type: 'success',
      title: title.startsWith('✓') ? title : `✓ ${title}`,
      message,
      duration
    });
  }

  // Método especial para errores de conectividad
  networkError(title: string = 'Error de Conectividad', message: string = 'No se pudo conectar al servidor. La aplicación funcionará en modo offline.', duration?: number): void {
    this.show({
      type: 'warning',
      title: `⚠️ ${title}`,
      message,
      duration: duration ?? 8000 // Errores de red duran más tiempo
    });
  }

  // Cerrar una notificación específica
  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  // Cerrar todas las notificaciones
  clear(): void {
    this.notificationsSubject.next([]);
  }

  // Método para confirmaciones personalizadas (reemplaza confirm() del navegador)
  confirm(
    title: string, 
    message: string, 
    options?: {
      confirmText?: string;
      cancelText?: string;
      type?: 'default' | 'danger' | 'warning' | 'success';
      icon?: string;
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationResolver = resolve;
      
      const confirmationData: ConfirmationData = {
        title,
        message,
        confirmText: options?.confirmText || 'Confirmar',
        cancelText: options?.cancelText || 'Cancelar',
        type: options?.type || 'default',
        icon: options?.icon
      };

      this.confirmationSubject.next(confirmationData);
    });
  }

  // Métodos de conveniencia para confirmaciones
  confirmDanger(title: string, message: string, confirmText: string = 'Eliminar'): Promise<boolean> {
    return this.confirm(title, message, {
      confirmText,
      type: 'danger',
      icon: 'fas fa-exclamation-triangle'
    });
  }

  confirmWarning(title: string, message: string, confirmText: string = 'Continuar'): Promise<boolean> {
    return this.confirm(title, message, {
      confirmText,
      type: 'warning',
      icon: 'fas fa-exclamation-triangle'
    });
  }

  confirmSuccess(title: string, message: string, confirmText: string = 'Aceptar'): Promise<boolean> {
    return this.confirm(title, message, {
      confirmText,
      type: 'success',
      icon: 'fas fa-check-circle'
    });
  }

  // Resolver la confirmación
  resolveConfirmation(result: boolean): void {
    if (this.confirmationResolver) {
      this.confirmationResolver(result);
      this.confirmationResolver = undefined;
    }
    this.confirmationSubject.next(null);
  }

  // Obtener la confirmación actual
  getCurrentConfirmation(): ConfirmationData | null {
    return this.confirmationSubject.value;
  }
}