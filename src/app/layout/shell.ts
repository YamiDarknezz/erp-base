import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/theme/theme.service';
import { PwaInstallService } from '../core/pwa/pwa-install.service';
import { APP_BUILD } from '../core/version/app-build';

export interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  isFavorite?: boolean;
}

export interface MenuGroup {
  id: string;
  label: string;
  iconType: 'flow' | 'report' | 'gear' | 'chart';
  path?: string;
  items?: SubMenuItem[];
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  path?: string;
  isFavorite?: boolean;
  groups?: MenuGroup[];
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);
  protected readonly pwa = inject(PwaInstallService);

  // App Build & Version
  protected readonly appVersion = signal(APP_BUILD.version || '0.0.2');

  // Sidebar starts CLOSED as requested
  protected readonly sidebarOpen = signal(false);
  protected readonly notificationsOpen = signal(false);

  // Expanded menu accordion state (all closed / minimized by default)
  protected readonly expandedSection = signal<string | null>(null);
  protected readonly expandedGroup = signal<string | null>(null);
  protected readonly searchQuery = signal('');

  // Active module title in header based on current route
  protected readonly currentUrl = signal(this.router.url);

  protected readonly activeModuleTitle = computed(() => {
    const url = this.currentUrl();
    if (url.includes('/ventas/ordenes-pedido')) return 'VENTAS \\ PREVENTA \\ ÓRDENES DE PEDIDO';
    if (url.includes('/ventas/pedidos')) return 'VENTAS \\ PREVENTA \\ PEDIDOS';
    if (url.includes('/ventas/facturacion')) return 'VENTAS \\ FACTURACIÓN';
    if (url.includes('/inventarios')) return 'INVENTARIOS \\ CONTROL DE EXISTENCIAS';
    if (url.includes('/ventas/reportes')) return 'VENTAS \\ REPORTES';
    if (url.includes('/ventas/gestion')) return 'VENTAS \\ GESTIÓN';
    return 'DASHBOARD';
  });

  // Corporate Profile Data
  protected readonly companyName = signal('DISTRIBUIDORA GLOBAL S.A.C. - PE');
  protected readonly userName = signal('admin');
  protected readonly userFullName = signal('Administrador General');

  // General ERP Notifications
  protected readonly notifications = signal<NotificationItem[]>([
    {
      id: 'n1',
      title: '5 pedidos pendientes de aprobación comercial',
      time: 'Hace 10 minutos',
      type: 'warning',
    },
    {
      id: 'n2',
      title: '12 productos con stock por debajo del mínimo',
      time: 'Hace 25 minutos',
      type: 'danger',
    },
    {
      id: 'n3',
      title: 'Cierre de caja del turno mañana listo para conciliar',
      time: 'Hace 1 hora',
      type: 'info',
    },
    {
      id: 'n4',
      title: '3 cotizaciones comerciales próximas a vencer hoy',
      time: 'Hoy 09:15 a. m.',
      type: 'warning',
    },
  ]);

  // Sidebar Sections matching screenshot structure
  protected readonly sections = signal<NavSection[]>([
    {
      id: 'favoritos',
      label: 'Favoritos',
      icon: 'star',
      path: '/dashboard',
    },
    {
      id: 'seteos',
      label: 'Seteos Iniciales',
      icon: 'sliders',
      groups: [
        { id: 'param', label: 'Parámetros Generales', iconType: 'gear', path: '/dashboard' },
        { id: 'series', label: 'Series y Correlativos', iconType: 'flow', path: '/dashboard' },
      ],
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: 'shopping-cart',
      groups: [
        {
          id: 'indicadores',
          label: 'Indicadores',
          iconType: 'chart',
          path: '/dashboard',
        },
        {
          id: 'preventa',
          label: 'Preventa',
          iconType: 'flow',
          items: [
            { id: 'op1', label: 'Órdenes de Pedido', path: '/ventas/ordenes-pedido', isFavorite: true },
            { id: 'op2', label: 'Pedidos', path: '/ventas/pedidos', isFavorite: true },
            { id: 'op3', label: 'Controles y Ajustes', path: '/ventas/pedidos', isFavorite: false },
          ],
        },
        {
          id: 'facturacion',
          label: 'Facturación',
          iconType: 'flow',
          path: '/ventas/facturacion',
        },
        {
          id: 'trade',
          label: 'Trade Spend',
          iconType: 'flow',
          path: '/ventas/pedidos',
        },
        {
          id: 'reportes',
          label: 'Reportes',
          iconType: 'report',
          path: '/ventas/reportes',
        },
        {
          id: 'gestion',
          label: 'Gestión',
          iconType: 'gear',
          path: '/ventas/gestion',
        },
      ],
    },
    {
      id: 'cuentas-cobrar',
      label: 'Cuentas por Cobrar',
      icon: 'file-text',
      groups: [
        { id: 'rec', label: 'Planillas de Cobranza', iconType: 'flow', path: '/dashboard' },
        { id: 'ant', label: 'Antigüedad de Deuda', iconType: 'report', path: '/dashboard' },
      ],
    },
    {
      id: 'distribucion',
      label: 'Distribución',
      icon: 'truck',
      groups: [
        { id: 'rep', label: 'Hojas de Reparto', iconType: 'flow', path: '/dashboard' },
        { id: 'flota', label: 'Control de Flota', iconType: 'gear', path: '/dashboard' },
      ],
    },
    {
      id: 'inventarios',
      label: 'Inventarios',
      icon: 'box',
      path: '/inventarios',
      groups: [
        { id: 'kardex', label: 'Kardex Valorizado', iconType: 'report', path: '/inventarios' },
        { id: 'stock', label: 'Stock por Depósito', iconType: 'gear', path: '/inventarios' },
      ],
    },
    {
      id: 'tesoreria',
      label: 'Tesorería',
      icon: 'dollar-sign',
      path: '/dashboard',
    },
    {
      id: 'cuentas-pagar',
      label: 'Cuentas por Pagar',
      icon: 'credit-card',
      path: '/dashboard',
    },
    {
      id: 'herramientas',
      label: 'Herramientas',
      icon: 'tool',
      path: '/dashboard',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'pie-chart',
      path: '/dashboard',
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: 'users',
      isFavorite: true,
      path: '/dashboard',
    },
  ]);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl.set(event.urlAfterRedirects || event.url);
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  toggleSection(sectionId: string): void {
    if (this.expandedSection() === sectionId) {
      this.expandedSection.set(null);
    } else {
      this.expandedSection.set(sectionId);
    }
  }

  toggleGroup(groupId: string): void {
    if (this.expandedGroup() === groupId) {
      this.expandedGroup.set(null);
    } else {
      this.expandedGroup.set(groupId);
    }
  }

  navigateTo(path: string | undefined): void {
    if (path) {
      this.router.navigate([path]);
      this.closeSidebar();
    }
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(open => !open);
  }

  closeNotifications(): void {
    this.notificationsOpen.set(false);
  }

  async installPwa(): Promise<void> {
    await this.pwa.install();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
