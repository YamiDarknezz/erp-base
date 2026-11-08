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

      // ── MÓDULO INVENTARIOS: OPERATIVO Y REPORTES ──
      { path: 'inventarios', redirectTo: 'inventarios/kardex', pathMatch: 'full' },
      {
        path: 'inventarios/kardex',
        loadComponent: () => import('./pages/inventarios/kardex/kardex').then(m => m.Kardex),
      },
      {
        path: 'inventarios/articulos',
        loadComponent: () =>
          import('./pages/inventarios/articulos/articulos').then(m => m.Articulos),
      },
      { path: 'gestion/articulos', redirectTo: 'inventarios/articulos', pathMatch: 'full' },
      {
        path: 'inventarios/depositos',
        loadComponent: () =>
          import('./pages/inventarios/depositos/depositos').then(m => m.Depositos),
      },
      { path: 'gestion/depositos', redirectTo: 'inventarios/depositos', pathMatch: 'full' },
      {
        path: 'inventarios/grupos',
        loadComponent: () =>
          import('./pages/inventarios/grupos/grupos').then(m => m.Grupos),
      },
      { path: 'gestion/grupos', redirectTo: 'inventarios/grupos', pathMatch: 'full' },
      {
        path: 'inventarios/stock-disponible',
        loadComponent: () =>
          import('./pages/inventarios/stock-disponible/stock-disponible').then(
            m => m.StockDisponible,
          ),
      },
      { path: 'reportes/stock-disponible', redirectTo: 'inventarios/stock-disponible', pathMatch: 'full' },
      {
        path: 'inventarios/stock-fisico',
        loadComponent: () =>
          import('./pages/inventarios/stock-fisico/stock-fisico').then(m => m.StockFisico),
      },
      { path: 'reportes/stock-fisico', redirectTo: 'inventarios/stock-fisico', pathMatch: 'full' },
      {
        path: 'inventarios/lotes',
        loadComponent: () =>
          import('./pages/inventarios/lotes/lotes').then(m => m.Lotes),
      },
      { path: 'reportes/lotes', redirectTo: 'inventarios/lotes', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
