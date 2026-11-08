import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { PwaInstallService } from '../../core/pwa/pwa-install.service';

export interface AlertItem {
  id: string;
  badge: string;
  title: string;
  type: 'danger' | 'warning' | 'info';
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  active?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);
  protected readonly pwa = inject(PwaInstallService);

  // Layout & UI State
  protected readonly sidebarOpen = signal(false);
  protected readonly notificationsOpen = signal(false);
  protected readonly isRefreshing = signal(false);

  // Corporate Profile Data
  protected readonly companyName = signal('DISTRIBUIDORA GLOBAL S.A.C. - PE');
  protected readonly userName = signal('admin');
  protected readonly userFullName = signal('Administrador General');

  // Last update timestamp
  protected readonly lastUpdated = signal(this.formatTimestamp(new Date()));

  // Sample Operational Alerts (inspired by reference image)
  protected readonly alerts = signal<AlertItem[]>([
    {
      id: 'a1',
      badge: '117',
      title: 'SKU con Precios por debajo del Margen Estipulado',
      type: 'warning',
    },
    {
      id: 'a2',
      badge: '62',
      title: 'Comprobantes Electrónicos no informados a SUNAT',
      type: 'danger',
    },
    {
      id: 'a3',
      badge: 'LIQ',
      title: 'Existen planillas pendientes de liquidar',
      type: 'warning',
    },
    {
      id: 'a4',
      badge: '13',
      title: 'Operaciones y despachos pendientes de entrega',
      type: 'warning',
    },
    {
      id: 'a5',
      badge: '+99',
      title: 'Movimientos y facturas pendientes de Cobrar',
      type: 'danger',
    },
  ]);

  // Sidebar navigation modules
  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid', path: '/dashboard', active: true },
    { label: 'Ventas y Facturación', icon: 'file-text', path: '/dashboard' },
    { label: 'Inventario y Almacén', icon: 'box', path: '/dashboard' },
    { label: 'Compras y Proveedores', icon: 'shopping-cart', path: '/dashboard' },
    { label: 'Logística y Despacho', icon: 'truck', path: '/dashboard' },
    { label: 'Finanzas y Cobranzas', icon: 'dollar-sign', path: '/dashboard' },
    { label: 'Reportes y Métricas', icon: 'pie-chart', path: '/dashboard' },
    { label: 'Configuración del Sistema', icon: 'settings', path: '/dashboard' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
  }

  closeNotifications(): void {
    this.notificationsOpen.set(false);
  }

  refreshAlerts(): void {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.lastUpdated.set(this.formatTimestamp(new Date()));
      this.isRefreshing.set(false);
    }, 500);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
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
