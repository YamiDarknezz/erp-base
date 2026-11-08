import { TestBed } from '@angular/core/testing';
import { NotificationService, DEFAULT_NOTIFICATIONS } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
    service.resetToDefault();
  });

  it('should be created with initial notifications', () => {
    expect(service).toBeTruthy();
    expect(service.notifications().length).toBe(DEFAULT_NOTIFICATIONS.length);
  });

  it('should add a new notification at the top', () => {
    service.add({
      title: 'Nuevo pedido recibido',
      time: 'Ahora',
      type: 'info',
    });

    expect(service.notifications().length).toBe(DEFAULT_NOTIFICATIONS.length + 1);
    expect(service.notifications()[0].title).toBe('Nuevo pedido recibido');
  });

  it('should dismiss a notification', () => {
    const idToDismiss = DEFAULT_NOTIFICATIONS[0].id;
    service.dismiss(idToDismiss);
    expect(service.notifications().some((n) => n.id === idToDismiss)).toBe(false);
  });

  it('should clear all notifications when requested', () => {
    service.clearAll();
    expect(service.notifications().length).toBe(0);
    expect(service.unreadCount()).toBe(0);
  });
});
