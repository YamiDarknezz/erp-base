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

  it('should mark a notification as read and toggle read state', () => {
    const target = DEFAULT_NOTIFICATIONS.find((n) => !n.read);
    expect(target).toBeTruthy();
    if (target) {
      service.markAsRead(target.id);
      expect(service.notifications().find((n) => n.id === target.id)?.read).toBe(true);

      service.toggleRead(target.id);
      expect(service.notifications().find((n) => n.id === target.id)?.read).toBe(false);
    }
  });

  it('should mark all notifications as read', () => {
    service.markAllAsRead();
    expect(service.unreadCount()).toBe(0);
    expect(service.notifications().every((n) => n.read)).toBe(true);
  });
});
