import { Component, signal } from '@angular/core';

export interface AlertItem {
  id: string;
  badge: string;
  title: string;
  type: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly isRefreshing = signal(false);
  protected readonly lastUpdated = signal(this.formatTimestamp(new Date()));

  // Operational Alerts (General Enterprise ERP)
  protected readonly alerts = signal<AlertItem[]>([
    {
      id: 'a1',
      badge: '117',
      title: 'SKU con Precios por debajo del Margen Mínimo',
      type: 'warning',
    },
    {
      id: 'a2',
      badge: '62',
      title: 'Comprobantes y Facturas pendientes de validación',
      type: 'danger',
    },
    {
      id: 'a3',
      badge: 'LIQ',
      title: 'Existen planillas operativas pendientes de liquidar',
      type: 'warning',
    },
    {
      id: 'a4',
      badge: '13',
      title: 'Órdenes de despacho pendientes de entrega',
      type: 'warning',
    },
    {
      id: 'a5',
      badge: '+99',
      title: 'Movimientos y facturas pendientes de Cobro',
      type: 'danger',
    },
  ]);

  refreshAlerts(): void {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.lastUpdated.set(this.formatTimestamp(new Date()));
      this.isRefreshing.set(false);
    }, 500);
  }

  private formatTimestamp(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}/${month}/${year} ${pad(hours)}:${minutes} ${ampm}`;
  }
}
