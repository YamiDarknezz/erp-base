import { Component, inject, signal, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/theme/theme.service';
import { PwaInstallService } from '../core/pwa/pwa-install.service';
import { APP_BUILD } from '../core/version/app-build';
import { ErpLogo } from '../shared/components/erp-logo/erp-logo';

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
  imports: [RouterOutlet, FormsModule, ErpLogo],
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
    if (url.includes('/ventas/preventa/ordenes-pedido') || url.includes('/ventas/ordenes-pedido')) return 'VENTAS \\ PREVENTA \\ ÓRDENES DE PEDIDO';
    if (url.includes('/ventas/preventa/pedidos') || url.includes('/ventas/pedidos')) return 'VENTAS \\ PREVENTA \\ PEDIDOS';
    if (url.includes('/ventas/facturacion')) return 'VENTAS \\ FACTURACIÓN';
    if (url.includes('/ventas/gestion/clientes') || url.includes('/ventas/gestion')) return 'VENTAS \\ GESTIÓN \\ CLIENTES Y PROVEEDORES';
    if (url.includes('/ventas/gestion/personal-comercial')) return 'VENTAS \\ GESTIÓN \\ PERSONAL COMERCIAL';
    if (url.includes('/ventas/gestion/precios-venta')) return 'VENTAS \\ GESTIÓN \\ PRECIOS DE VENTA';
    if (url.includes('/ventas/reportes/comprobantes')) return 'VENTAS \\ REPORTES \\ COMPROBANTES DE VENTA';
    if (url.includes('/ventas/reportes/pedidos')) return 'VENTAS \\ REPORTES \\ PEDIDOS Y EFECTIVIDAD';
    if (url.includes('/ventas/reportes/comisiones') || url.includes('/ventas/reportes')) return 'VENTAS \\ REPORTES \\ COMISIONES';
    if (url.includes('/inventarios/operativo/kardex') || url.includes('/inventarios/kardex') || url === '/inventarios') return 'INVENTARIOS \\ OPERATIVO \\ KARDEX Y EXISTENCIAS';
    if (url.includes('/inventarios/gestion/articulos') || url.includes('/gestion/articulos') || url.includes('/inventarios/articulos')) return 'INVENTARIOS \\ GESTIÓN \\ ARTÍCULOS (SKU)';
    if (url.includes('/inventarios/gestion/depositos') || url.includes('/gestion/depositos') || url.includes('/inventarios/depositos')) return 'INVENTARIOS \\ GESTIÓN \\ DEPÓSITOS Y ALMACENES';
    if (url.includes('/inventarios/gestion/grupos') || url.includes('/gestion/grupos') || url.includes('/inventarios/grupos')) return 'INVENTARIOS \\ GESTIÓN \\ GRUPOS DE PRODUCTOS';
    if (url.includes('/inventarios/reportes/stock-disponible') || url.includes('/reportes/stock-disponible') || url.includes('/inventarios/stock-disponible')) return 'INVENTARIOS \\ REPORTES \\ STOCK DISPONIBLE';
    if (url.includes('/inventarios/reportes/stock-fisico') || url.includes('/reportes/stock-fisico') || url.includes('/inventarios/stock-fisico')) return 'INVENTARIOS \\ REPORTES \\ STOCK FÍSICO';
    if (url.includes('/inventarios/reportes/lotes') || url.includes('/reportes/lotes') || url.includes('/inventarios/lotes')) return 'INVENTARIOS \\ REPORTES \\ TRAZABILIDAD DE LOTES';
    return 'DASHBOARD';
  });

  // Corporate Profile Data
  protected readonly companyName = signal('DISTRIBUIDORA GLOBAL S.A.C. - PE');
  protected readonly userName = signal('admin');
  protected readonly userFullName = signal('Administrador General');

  // Modals state for bottom sidebar buttons
  protected readonly permissionsOpen = signal(false);
  protected readonly profileOpen = signal(false);
  protected readonly accountOpen = signal(false);

  // User Roles & Permissions Matrix
  protected readonly selectedRole = signal('Vendedor');
  protected readonly rolesList = signal(['Vendedor', 'Jefe de Almacén', 'Contador General', 'Supervisor Comercial']);
  protected readonly permissionsMatrix = signal([
    { modulo: 'Preventa (Órdenes y Pedidos)', ver: true, crear: true, editar: true, anular: false, exportar: true },
    { modulo: 'Facturación Electrónica', ver: true, crear: false, editar: false, anular: false, exportar: true },
    { modulo: 'Control de Inventarios', ver: true, crear: false, editar: false, anular: false, exportar: true },
    { modulo: 'Reportes de Stock y Lotes', ver: true, crear: false, editar: false, anular: false, exportar: true },
    { modulo: 'Gestión de Catálogos (SKU/Clientes)', ver: true, crear: true, editar: true, anular: false, exportar: false },
  ]);

  // Personal Profile fields
  protected readonly profileEmail = signal('admin@globalerp.com');
  protected readonly profileCurrentPassword = signal('');
  protected readonly profileNewPassword = signal('');
  protected readonly profileTimeoutMinutes = signal(30);

  // Generic ERP Operational Notifications
  protected readonly notifications = signal<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Cierre de turno operativo N° 01 conciliado exitosamente',
      time: 'Hace 8 minutos',
      type: 'info',
    },
    {
      id: 'n2',
      title: 'Actualización general de listas de precios mayoristas completada',
      time: 'Hace 20 minutos',
      type: 'info',
    },
    {
      id: 'n3',
      title: 'Límite de crédito superado para cliente comercial CLI-00102',
      time: 'Hace 45 minutos',
      type: 'warning',
    },
    {
      id: 'n4',
      title: 'Sincronización periódica de existencias con Depósito Central finalizada',
      time: 'Hoy 08:30 a. m.',
      type: 'info',
    },
    {
      id: 'n5',
      title: 'Alerta de reposición: 4 SKUs alcanzaron el punto de reorden',
      time: 'Hoy 07:15 a. m.',
      type: 'danger',
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
            { id: 'op1', label: 'Órdenes de Pedido', path: '/ventas/preventa/ordenes-pedido', isFavorite: true },
            { id: 'op2', label: 'Pedidos', path: '/ventas/preventa/pedidos', isFavorite: true },
            { id: 'op3', label: 'Controles y Ajustes', path: '/ventas/preventa/pedidos', isFavorite: false },
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
          path: '/ventas/preventa/pedidos',
        },
        {
          id: 'reportes',
          label: 'Reportes',
          iconType: 'report',
          items: [
            { id: 'rep1', label: 'Comprobantes de Venta', path: '/ventas/reportes/comprobantes', isFavorite: true },
            { id: 'rep2', label: 'Pedidos y Efectividad', path: '/ventas/reportes/pedidos', isFavorite: false },
            { id: 'rep3', label: 'Comisiones de Ventas', path: '/ventas/reportes/comisiones', isFavorite: false },
          ],
        },
        {
          id: 'gestion',
          label: 'Gestión',
          iconType: 'gear',
          items: [
            { id: 'ges1', label: 'Clientes y Proveedores', path: '/ventas/gestion/clientes', isFavorite: true },
            { id: 'ges2', label: 'Personal Comercial', path: '/ventas/gestion/personal-comercial', isFavorite: false },
            { id: 'ges3', label: 'Precios de Venta', path: '/ventas/gestion/precios-venta', isFavorite: false },
          ],
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
      path: '/inventarios/operativo/kardex',
      groups: [
        {
          id: 'kardex',
          label: 'Kardex Valorizado',
          iconType: 'flow',
          path: '/inventarios/operativo/kardex',
        },
        {
          id: 'reportes-inv',
          label: 'Reportes',
          iconType: 'report',
          items: [
            { id: 'inv-rep1', label: 'Stock Disponible', path: '/inventarios/reportes/stock-disponible', isFavorite: true },
            { id: 'inv-rep2', label: 'Stock Físico', path: '/inventarios/reportes/stock-fisico', isFavorite: false },
            { id: 'inv-rep3', label: 'Trazabilidad de Lotes', path: '/inventarios/reportes/lotes', isFavorite: false },
          ],
        },
        {
          id: 'gestion-inv',
          label: 'Gestión',
          iconType: 'gear',
          items: [
            { id: 'inv-ges1', label: 'Artículos (SKU)', path: '/inventarios/gestion/articulos', isFavorite: true },
            { id: 'inv-ges2', label: 'Depósitos y Almacenes', path: '/inventarios/gestion/depositos', isFavorite: false },
            { id: 'inv-ges3', label: 'Grupos de Productos', path: '/inventarios/gestion/grupos', isFavorite: false },
          ],
        },
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

  openPermissions(): void {
    this.closeSidebar();
    this.permissionsOpen.set(true);
  }

  closePermissions(): void {
    this.permissionsOpen.set(false);
  }

  openProfile(): void {
    this.closeSidebar();
    this.profileOpen.set(true);
  }

  closeProfile(): void {
    this.profileOpen.set(false);
  }

  openAccount(): void {
    this.closeSidebar();
    this.accountOpen.set(true);
  }

  closeAccount(): void {
    this.accountOpen.set(false);
  }

  savePermissions(): void {
    this.closePermissions();
  }

  saveProfile(): void {
    this.closeProfile();
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.notificationsOpen()) this.closeNotifications();
    if (this.sidebarOpen()) this.closeSidebar();
    if (this.permissionsOpen()) this.closePermissions();
    if (this.profileOpen()) this.closeProfile();
    if (this.accountOpen()) this.closeAccount();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
