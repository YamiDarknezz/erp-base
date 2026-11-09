import { Injectable, signal, computed } from '@angular/core';

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'danger' | 'warning' | 'info';
  read?: boolean;
  module?: string;
  route?: string;
}

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Cierre de turno operativo N° 01 conciliado exitosamente',
    time: 'Hace 8 min',
    type: 'info',
    read: false,
    module: 'Ventas',
    route: '/ventas/facturacion',
  },
  {
    id: 'n2',
    title: 'Actualización general de listas de precios mayoristas completada',
    time: 'Hace 20 min',
    type: 'info',
    read: false,
    module: 'Precios',
    route: '/ventas/gestion/precios-venta',
  },
  {
    id: 'n3',
    title: 'Límite de crédito superado para cliente comercial CLI-00102',
    time: 'Hace 45 min',
    type: 'warning',
    read: false,
    module: 'Clientes',
    route: '/ventas/gestion/clientes',
  },
  {
    id: 'n4',
    title: 'Alerta de reposición: 4 SKUs alcanzaron el punto de reorden',
    time: 'Hoy 07:15 a. m.',
    type: 'danger',
    read: false,
    module: 'Inventario',
    route: '/inventarios/operativo/kardex',
  },
  {
    id: 'n5',
    title: 'Sincronización periódica de existencias con Depósito Central finalizada',
    time: 'Hoy 08:30 a. m.',
    type: 'info',
    read: true,
    module: 'Depósitos',
    route: '/inventarios/operativo/kardex',
  },
  {
    id: 'n6',
    title: 'Factura F001-000492 anulada y nota de crédito generada',
    time: 'Ayer 18:40',
    type: 'warning',
    read: true,
    module: 'Facturación',
    route: '/ventas/facturacion',
  },
  {
    id: 'n7',
    title: 'Nueva orden de pedido PED-2026-0084 ingresada desde App Preventa',
    time: 'Ayer 16:15',
    type: 'info',
    read: true,
    module: 'Preventa',
    route: '/ventas/preventa/pedidos',
  },
  {
    id: 'n8',
    title: 'Discrepancia en arqueo de cobranzas de la zona Norte',
    time: 'Ayer 14:00',
    type: 'danger',
    read: true,
    module: 'Cobranzas',
    route: '/cuentas-cobrar/operativo/planillas',
  },
];

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsState = signal<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  readonly notifications = this.notificationsState.asReadonly();
  readonly unreadCount = computed(
    () => this.notificationsState().filter((n) => !n.read).length
  );

  add(item: Omit<NotificationItem, 'id'>): void {
    const newItem: NotificationItem = {
      ...item,
      id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      read: item.read ?? false,
    };
    this.notificationsState.update((prev) => [newItem, ...prev]);
  }

  dismiss(id: string): void {
    this.notificationsState.update((prev) => prev.filter((n) => n.id !== id));
  }

  markAsRead(id: string): void {
    this.notificationsState.update((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  toggleRead(id: string): void {
    this.notificationsState.update((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  markAllAsRead(): void {
    this.notificationsState.update((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  }

  clearAll(): void {
    this.notificationsState.set([]);
  }

  setNotifications(items: NotificationItem[]): void {
    this.notificationsState.set(items);
  }

  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          this.setNotifications(data);
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar notificaciones remotas:', err);
    }
  }

  resetToDefault(): void {
    this.notificationsState.set(DEFAULT_NOTIFICATIONS);
  }
}
