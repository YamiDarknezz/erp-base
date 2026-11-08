import { Component, inject, signal, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/theme/theme.service';
import { PwaInstallService } from '../core/pwa/pwa-install.service';
import { APP_BUILD } from '../core/version/app-build';
import { ErpLogo } from '../shared/components/erp-logo/erp-logo';
import { ConfirmDialog } from '../shared/components/confirm-dialog/confirm-dialog';
import { Toast } from '../shared/components/toast/toast';
import { ConfirmDialogService } from '../core/dialog/confirm-dialog.service';
import { ToastService } from '../core/notifications/toast.service';
import { CompanyConfigService } from '../core/config/company-config.service';
import { UserContextService } from '../core/context/user-context.service';
import { BranchContextService } from '../core/context/branch-context.service';
import { NotificationService, NotificationItem } from '../core/notifications/notification.service';

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

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, FormsModule, ErpLogo, ConfirmDialog, Toast],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);
  protected readonly pwa = inject(PwaInstallService);
  protected readonly companyConfig = inject(CompanyConfigService);
  protected readonly userContext = inject(UserContextService);
  protected readonly branchContext = inject(BranchContextService);
  protected readonly notificationService = inject(NotificationService);
  protected readonly confirmDialog = inject(ConfirmDialogService);
  protected readonly toast = inject(ToastService);

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
    if (url.includes('/cuentas-cobrar/operativo/planillas') || url.includes('/cuentas-cobrar/planillas')) return 'CUENTAS POR COBRAR \\ OPERATIVO \\ PLANILLAS DE COBRANZA';
    if (url.includes('/cuentas-cobrar/reportes/antiguedad-deuda') || url.includes('/cuentas-cobrar/antiguedad-deuda') || url.includes('/cuentas-cobrar')) return 'CUENTAS POR COBRAR \\ REPORTES \\ ANTIGÜEDAD DE DEUDA';
    return 'DASHBOARD';
  });

  // Centralized Corporate Brand, User Profile & Branch State
  protected readonly companyName = this.companyConfig.name;
  protected readonly userName = this.userContext.username;
  protected readonly userFullName = this.userContext.fullName;
  protected readonly userInitials = this.userContext.initials;

  // Multi-Branch Active Sede Selector
  protected readonly selectedBranch = this.branchContext.activeBranchName;
  protected readonly branchSelectorOpen = signal(false);
  protected readonly availableBranches = this.branchContext.branches;

  // Global Search / Spotlight (Ctrl + K)
  protected readonly spotlightOpen = signal(false);
  protected readonly spotlightQuery = signal('');

  protected readonly spotlightItems = [
    { title: 'Órdenes de Pedido', category: 'Ventas / Preventa', path: '/ventas/preventa/ordenes-pedido', keywords: 'pedidos preventa orden cotizacion' },
    { title: 'Pedidos de Venta', category: 'Ventas / Preventa', path: '/ventas/preventa/pedidos', keywords: 'pedidos ventas comercial' },
    { title: 'Facturación Electrónica', category: 'Ventas / Facturación', path: '/ventas/facturacion', keywords: 'facturas boletas sunat comprobantes xml ubl' },
    { title: 'Clientes y Proveedores', category: 'Ventas / Gestión', path: '/ventas/gestion/clientes', keywords: 'clientes ruc padron proveedores razon social' },
    { title: 'Personal Comercial', category: 'Ventas / Gestión', path: '/ventas/gestion/personal-comercial', keywords: 'vendedores comisiones personal asesores' },
    { title: 'Precios de Venta', category: 'Ventas / Gestión', path: '/ventas/gestion/precios-venta', keywords: 'listas tarifas precios descuentos productos' },
    { title: 'Comprobantes de Venta', category: 'Ventas / Reportes', path: '/ventas/reportes/comprobantes', keywords: 'reporte comprobantes facturas boletas' },
    { title: 'Pedidos y Efectividad', category: 'Ventas / Reportes', path: '/ventas/reportes/pedidos', keywords: 'reporte pedidos cumplimiento efectividad' },
    { title: 'Comisiones de Ventas', category: 'Ventas / Reportes', path: '/ventas/reportes/comisiones', keywords: 'reporte comisiones liquidacion asesores' },
    { title: 'Kardex Valorizado', category: 'Inventarios / Operativo', path: '/inventarios/operativo/kardex', keywords: 'kardex existencias inventario valorizado entradas salidas' },
    { title: 'Artículos (SKU)', category: 'Inventarios / Gestión', path: '/inventarios/gestion/articulos', keywords: 'sku articulos productos catalogo inventarios' },
    { title: 'Depósitos y Almacenes', category: 'Inventarios / Gestión', path: '/inventarios/gestion/depositos', keywords: 'almacenes depositos ubicaciones sedes' },
    { title: 'Grupos de Productos', category: 'Inventarios / Gestión', path: '/inventarios/gestion/grupos', keywords: 'categorias familias lineas grupos articulos' },
    { title: 'Stock Disponible', category: 'Inventarios / Reportes', path: '/inventarios/reportes/stock-disponible', keywords: 'stock saldo disponible existencia despacho' },
    { title: 'Stock Físico', category: 'Inventarios / Reportes', path: '/inventarios/reportes/stock-fisico', keywords: 'conteo toma inventario fisico cuadre' },
    { title: 'Trazabilidad de Lotes', category: 'Inventarios / Reportes', path: '/inventarios/reportes/lotes', keywords: 'lotes vencimiento fecha perecibles cuarentena' },
    { title: 'Planillas de Cobranza', category: 'Cuentas por Cobrar / Operativo', path: '/cuentas-cobrar/operativo/planillas', keywords: 'cobranzas liquidacion vouchers amortizacion bancos' },
    { title: 'Antigüedad de Deuda', category: 'Cuentas por Cobrar / Reportes', path: '/cuentas-cobrar/reportes/antiguedad-deuda', keywords: 'cartera vencida mora creditos semaforo clientes' },
  ];

  protected readonly filteredSpotlightItems = computed(() => {
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const q = normalize(this.spotlightQuery().trim());
    if (!q) return this.spotlightItems.slice(0, 8);
    return this.spotlightItems.filter(item => {
      const title = normalize(item.title);
      const cat = normalize(item.category);
      const kw = normalize(item.keywords);
      return title.includes(q) || cat.includes(q) || kw.includes(q);
    });
  });

  // Modals state for bottom sidebar buttons
  protected readonly permissionsOpen = signal(false);
  protected readonly profileOpen = signal(false);
  protected readonly accountOpen = signal(false);

  // User Roles & Permissions Matrix
  protected readonly selectedRole = this.userContext.selectedRole;
  protected readonly rolesList = this.userContext.roles;
  protected readonly permissionsMatrix = this.userContext.permissions;

  // Personal Profile fields
  protected readonly profileEmail = signal(this.userContext.email());
  protected readonly profileCurrentPassword = signal('');
  protected readonly profileNewPassword = signal('');
  protected readonly profileTimeoutMinutes = signal(this.userContext.timeoutMinutes());

  // Centralized ERP Operational Notifications
  protected readonly notifications = this.notificationService.notifications;
  protected readonly unreadNotificationsCount = this.notificationService.unreadCount;

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
    this.userContext.updateProfile({
      email: this.profileEmail(),
      timeoutMinutes: this.profileTimeoutMinutes(),
    });
    this.closeProfile();
  }

  toggleBranchSelector(): void {
    this.branchSelectorOpen.update(v => !v);
  }

  selectBranch(branchName: string): void {
    this.branchContext.selectBranch(branchName);
    this.branchSelectorOpen.set(false);
  }

  dismissNotification(id: string): void {
    this.notificationService.dismiss(id);
  }

  clearAllNotifications(): void {
    this.notificationService.clearAll();
  }

  onRoleChange(role: string): void {
    this.userContext.selectRole(role);
  }

  toggleSpotlight(): void {
    this.spotlightOpen.update(v => !v);
    if (this.spotlightOpen()) {
      this.spotlightQuery.set('');
    }
  }

  closeSpotlight(): void {
    this.spotlightOpen.set(false);
  }

  selectSpotlightItem(path: string): void {
    this.closeSpotlight();
    this.router.navigate([path]);
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalShortcuts(evt: KeyboardEvent): void {
    if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 'k') {
      evt.preventDefault();
      this.toggleSpotlight();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.spotlightOpen()) this.closeSpotlight();
    if (this.branchSelectorOpen()) this.branchSelectorOpen.set(false);
    if (this.notificationsOpen()) this.closeNotifications();
    if (this.sidebarOpen()) this.closeSidebar();
    if (this.permissionsOpen()) this.closePermissions();
    if (this.profileOpen()) this.closeProfile();
    if (this.accountOpen()) this.closeAccount();
  }

  async logout(): Promise<void> {
    const ok = await this.confirmDialog.confirm({
      title: 'Cerrar Sesión',
      message: '¿Está seguro de que desea salir del sistema ERP? Deberá ingresar sus credenciales nuevamente.',
      confirmText: 'Cerrar Sesión',
      cancelText: 'Cancelar',
      tone: 'danger',
    });
    if (ok) {
      if (this.accountOpen()) this.closeAccount();
      this.toast.info('Sesión finalizada correctamente');
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}
