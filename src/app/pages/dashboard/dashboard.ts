import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { PwaInstallService } from '../../core/pwa/pwa-install.service';
import { APP_BUILD } from '../../core/version/app-build';

export interface AlertItem {
  id: string;
  badge: string;
  title: string;
  type: 'danger' | 'warning' | 'info';
}

export interface MenuGroup {
  operativo: string[];
  reportes: string[];
  gestion: string[];
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  isFavorite?: boolean;
  subGroups?: MenuGroup;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);
  protected readonly pwa = inject(PwaInstallService);

  // App Build & Version
  protected readonly appVersion = signal(APP_BUILD.version || '0.0.1');

  // Layout & UI State
  protected readonly sidebarOpen = signal(true); // Open by default under header
  protected readonly notificationsOpen = signal(false);
  protected readonly isRefreshing = signal(false);
  protected readonly expandedMenu = signal<string | null>('ventas'); // 'ventas' open by default
  protected readonly searchQuery = signal('');

  // Corporate Profile Data
  protected readonly companyName = signal('DISTRIBUIDORA GLOBAL S.A.C. - PE');
  protected readonly userName = signal('admin');
  protected readonly userFullName = signal('Administrador General');

  // Last update timestamp
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
      title: '12 productos con stock por debajo del punto de reorden',
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

  // Sidebar Sections (matching reference image structure)
  protected readonly sections = signal<NavSection[]>([
    {
      id: 'favoritos',
      label: 'Favoritos',
      icon: 'star',
    },
    {
      id: 'seteos',
      label: 'Seteos Iniciales',
      icon: 'sliders',
      subGroups: {
        operativo: ['Parámetros Generales', 'Numeración de Series', 'Turnos y Cajas'],
        reportes: ['Auditoría de Parámetros', 'Logs del Sistema'],
        gestion: ['Sucursales', 'Unidades de Negocio', 'Monedas y Tipos de Cambio'],
      },
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: 'shopping-cart',
      subGroups: {
        operativo: ['Preventa', 'Facturación Directa', 'Cobranzas en Ruta', 'Aprobación de Pedidos'],
        reportes: ['Comprobantes Emitidos', 'Pedidos por Vendedor', 'Comisiones de Venta', 'Ranking de Artículos'],
        gestion: ['Clientes', 'Personal Comercial', 'Listas de Precios', 'Condiciones de Pago', 'Zonas de Venta'],
      },
    },
    {
      id: 'cuentas-cobrar',
      label: 'Cuentas por Cobrar',
      icon: 'file-text',
      subGroups: {
        operativo: ['Registro de Cobranzas', 'Planillas de Recaudación', 'Canje de Letras'],
        reportes: ['Estado de Cuenta Cliente', 'Antigüedad de Deuda', 'Proyección de Cobros'],
        gestion: ['Límites de Crédito', 'Cobradores y Rutas', 'Políticas de Cobranza'],
      },
    },
    {
      id: 'distribucion',
      label: 'Distribución',
      icon: 'truck',
      subGroups: {
        operativo: ['Asignación de Reparto', 'Hojas de Ruta', 'Liquidación de Fletes', 'Control de Entregas'],
        reportes: ['Efectividad de Entrega', 'Tiempos de Ruta', 'Reporte de No Entregados'],
        gestion: ['Flota y Vehículos', 'Conductores', 'Tarifarios de Flete', 'Puntos de Llegada'],
      },
    },
    {
      id: 'inventarios',
      label: 'Inventarios',
      icon: 'box',
      subGroups: {
        operativo: ['Entradas / Salidas de Almacén', 'Transferencias entre Depósitos', 'Toma de Inventario Físico'],
        reportes: ['Kardex Físico y Valorizado', 'Stock por Depósito', 'Rotación de Productos', 'Lotes por Vencer'],
        gestion: ['Catálogo de SKUs', 'Depósitos y Almacenes', 'Líneas y Familias', 'Proveedores'],
      },
    },
    {
      id: 'tesoreria',
      label: 'Tesorería',
      icon: 'dollar-sign',
      subGroups: {
        operativo: ['Ingresos y Egresos', 'Conciliación Bancaria', 'Pagos a Proveedores'],
        reportes: ['Flujo de Caja Real vs Proyectado', 'Movimientos Bancarios'],
        gestion: ['Cuentas Bancarias', 'Conceptos de Gasto', 'Chequeras'],
      },
    },
    {
      id: 'cuentas-pagar',
      label: 'Cuentas por Pagar',
      icon: 'credit-card',
      subGroups: {
        operativo: ['Registro de Compras', 'Programación de Pagos', 'Emisión de Retenciones'],
        reportes: ['Antigüedad de Cuentas por Pagar', 'Comprobantes de Compra'],
        gestion: ['Proveedores y Contactos', 'Condiciones de Proveedor'],
      },
    },
    {
      id: 'herramientas',
      label: 'Herramientas',
      icon: 'tool',
      subGroups: {
        operativo: ['Importador Masivo de Datos', 'Generador de Archivos Planos'],
        reportes: ['Monitoreo de Procesos', 'Historial de Interfaces'],
        gestion: ['Plantillas de Importación', 'Mapeo de Columnas'],
      },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'pie-chart',
      subGroups: {
        operativo: ['Tableros Ejecutivos', 'Métricas en Tiempo Real'],
        reportes: ['Ventas vs Presupuesto', 'Margen Contributivo', 'Análisis de Churn'],
        gestion: ['Definición de KPIs', 'Metas Comerciales'],
      },
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: 'users',
      subGroups: {
        operativo: ['Oportunidades de Venta', 'Seguimiento de Prospectos', 'Agendamiento de Visitas'],
        reportes: ['Embudo de Conversión (Funnel)', 'Actividad por Asesor'],
        gestion: ['Segmentos de Clientes', 'Etapas del Pipeline'],
      },
    },
  ]);

  // Filtered Sections based on search query
  protected readonly filteredSections = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.sections();
    return this.sections().filter(s => {
      if (s.label.toLowerCase().includes(q)) return true;
      if (s.subGroups) {
        const matchOp = s.subGroups.operativo.some(i => i.toLowerCase().includes(q));
        const matchRep = s.subGroups.reportes.some(i => i.toLowerCase().includes(q));
        const matchGest = s.subGroups.gestion.some(i => i.toLowerCase().includes(q));
        return matchOp || matchRep || matchGest;
      }
      return false;
    });
  });

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  toggleSection(id: string): void {
    if (this.expandedMenu() === id) {
      this.expandedMenu.set(null);
    } else {
      this.expandedMenu.set(id);
    }
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
