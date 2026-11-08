import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/auth/auth.guard';
import { Shell } from './layout/shell';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
      },

      // ── MÓDULO VENTAS: PREVENTA ──
      {
        path: 'ventas/preventa/ordenes-pedido',
        loadComponent: () =>
          import('./pages/ventas/preventa/ordenes-pedido/ordenes-pedido').then(m => m.OrdenesPedido),
      },
      { path: 'ventas/ordenes-pedido', redirectTo: 'ventas/preventa/ordenes-pedido', pathMatch: 'full' },
      {
        path: 'ventas/preventa/pedidos',
        loadComponent: () =>
          import('./pages/ventas/preventa/pedidos/pedidos').then(m => m.Pedidos),
      },
      { path: 'ventas/pedidos', redirectTo: 'ventas/preventa/pedidos', pathMatch: 'full' },

      // ── MÓDULO VENTAS: FACTURACIÓN ──
      {
        path: 'ventas/facturacion',
        loadComponent: () =>
          import('./pages/ventas/facturacion/facturacion').then(m => m.Facturacion),
      },

      // ── MÓDULO VENTAS: GESTIÓN DE CATÁLOGOS ──
      {
        path: 'ventas/gestion/clientes',
        loadComponent: () =>
          import('./pages/ventas/gestion/clientes/clientes').then(m => m.Clientes),
      },
      { path: 'ventas/gestion', redirectTo: 'ventas/gestion/clientes', pathMatch: 'full' },
      {
        path: 'ventas/gestion/personal-comercial',
        loadComponent: () =>
          import('./pages/ventas/gestion/personal-comercial/personal-comercial').then(
            m => m.PersonalComercial,
          ),
      },
      {
        path: 'ventas/gestion/precios-venta',
        loadComponent: () =>
          import('./pages/ventas/gestion/precios-venta/precios-venta').then(m => m.PreciosVenta),
      },

      // ── MÓDULO VENTAS: REPORTES ──
      {
        path: 'ventas/reportes/comprobantes',
        loadComponent: () =>
          import('./pages/ventas/reportes/comprobantes/comprobantes').then(m => m.Comprobantes),
      },
      {
        path: 'ventas/reportes/pedidos',
        loadComponent: () =>
          import('./pages/ventas/reportes/pedidos/pedidos-reporte').then(m => m.PedidosReporte),
      },
      {
        path: 'ventas/reportes/comisiones',
        loadComponent: () =>
          import('./pages/ventas/reportes/comisiones/comisiones').then(m => m.Comisiones),
      },
      { path: 'ventas/reportes', redirectTo: 'ventas/reportes/comisiones', pathMatch: 'full' },

      // ── MÓDULO INVENTARIOS: OPERATIVO, GESTIÓN Y REPORTES ──
      { path: 'inventarios', redirectTo: 'inventarios/operativo/kardex', pathMatch: 'full' },
      { path: 'inventarios/kardex', redirectTo: 'inventarios/operativo/kardex', pathMatch: 'full' },
      {
        path: 'inventarios/operativo/kardex',
        loadComponent: () =>
          import('./pages/inventarios/operativo/kardex/kardex').then(m => m.Kardex),
      },

      // Inventarios: Gestión de Catálogos
      { path: 'gestion/articulos', redirectTo: 'inventarios/gestion/articulos', pathMatch: 'full' },
      { path: 'inventarios/articulos', redirectTo: 'inventarios/gestion/articulos', pathMatch: 'full' },
      {
        path: 'inventarios/gestion/articulos',
        loadComponent: () =>
          import('./pages/inventarios/gestion/articulos/articulos').then(m => m.Articulos),
      },
      { path: 'gestion/depositos', redirectTo: 'inventarios/gestion/depositos', pathMatch: 'full' },
      { path: 'inventarios/depositos', redirectTo: 'inventarios/gestion/depositos', pathMatch: 'full' },
      {
        path: 'inventarios/gestion/depositos',
        loadComponent: () =>
          import('./pages/inventarios/gestion/depositos/depositos').then(m => m.Depositos),
      },
      { path: 'gestion/grupos', redirectTo: 'inventarios/gestion/grupos', pathMatch: 'full' },
      { path: 'inventarios/grupos', redirectTo: 'inventarios/gestion/grupos', pathMatch: 'full' },
      {
        path: 'inventarios/gestion/grupos',
        loadComponent: () =>
          import('./pages/inventarios/gestion/grupos/grupos').then(m => m.Grupos),
      },

      // Inventarios: Reportes
      { path: 'reportes/stock-disponible', redirectTo: 'inventarios/reportes/stock-disponible', pathMatch: 'full' },
      { path: 'inventarios/stock-disponible', redirectTo: 'inventarios/reportes/stock-disponible', pathMatch: 'full' },
      {
        path: 'inventarios/reportes/stock-disponible',
        loadComponent: () =>
          import('./pages/inventarios/reportes/stock-disponible/stock-disponible').then(
            m => m.StockDisponible,
          ),
      },
      { path: 'reportes/stock-fisico', redirectTo: 'inventarios/reportes/stock-fisico', pathMatch: 'full' },
      { path: 'inventarios/stock-fisico', redirectTo: 'inventarios/reportes/stock-fisico', pathMatch: 'full' },
      {
        path: 'inventarios/reportes/stock-fisico',
        loadComponent: () =>
          import('./pages/inventarios/reportes/stock-fisico/stock-fisico').then(m => m.StockFisico),
      },
      { path: 'reportes/lotes', redirectTo: 'inventarios/reportes/lotes', pathMatch: 'full' },
      { path: 'inventarios/lotes', redirectTo: 'inventarios/reportes/lotes', pathMatch: 'full' },
      {
        path: 'inventarios/reportes/lotes',
        loadComponent: () =>
          import('./pages/inventarios/reportes/lotes/lotes').then(m => m.Lotes),
      },

      // ── MÓDULO CUENTAS POR COBRAR (OPERATIVO Y REPORTES) ──
      { path: 'cuentas-cobrar', redirectTo: 'cuentas-cobrar/operativo/planillas', pathMatch: 'full' },
      { path: 'cuentas-cobrar/planillas', redirectTo: 'cuentas-cobrar/operativo/planillas', pathMatch: 'full' },
      {
        path: 'cuentas-cobrar/operativo/planillas',
        loadComponent: () =>
          import('./pages/cuentas-cobrar/operativo/planillas/planillas').then(m => m.Planillas),
      },
      { path: 'cuentas-cobrar/antiguedad-deuda', redirectTo: 'cuentas-cobrar/reportes/antiguedad-deuda', pathMatch: 'full' },
      {
        path: 'cuentas-cobrar/reportes/antiguedad-deuda',
        loadComponent: () =>
          import('./pages/cuentas-cobrar/reportes/antiguedad-deuda/antiguedad-deuda').then(m => m.AntiguedadDeuda),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
