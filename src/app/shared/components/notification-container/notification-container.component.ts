import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent, Notification } from '../notification/notification.component';
import { ConfirmationModalComponent, ConfirmationData } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, NotificationComponent, ConfirmationModalComponent],
  template: `
    <!-- Notificaciones -->
    <div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm">
      <div *ngFor="let notification of notifications; trackBy: trackByFn" 
           class="pointer-events-auto">
        <app-notification 
          [notification]="notification"
          (closed)="onNotificationClosed(notification.id!)">
        </app-notification>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <app-confirmation-modal
      *ngIf="currentConfirmation"
      [data]="currentConfirmation"
      [visible]="!!currentConfirmation"
      (confirmed)="onConfirmationResult($event)">
    </app-confirmation-modal>
  `
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  currentConfirmation: ConfirmationData | null = null;
  
  private notificationsSubscription?: Subscription;
  private confirmationSubscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // Suscribirse a las notificaciones
    this.notificationsSubscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );

    // Suscribirse a las confirmaciones
    this.confirmationSubscription = this.notificationService.confirmation$.subscribe(
      confirmation => {
        this.currentConfirmation = confirmation;
      }
    );
  }

  ngOnDestroy() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.confirmationSubscription) {
      this.confirmationSubscription.unsubscribe();
    }
  }

  onNotificationClosed(id: string) {
    this.notificationService.remove(id);
  }

  onConfirmationResult(result: boolean) {
    this.notificationService.resolveConfirmation(result);
  }

  trackByFn(index: number, item: Notification): string {
    return item.id || index.toString();
  }
}