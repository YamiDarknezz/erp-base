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
      {
        path: 'ventas/ordenes-pedido',
        loadComponent: () => import('./pages/ventas/ordenes-pedido/ordenes-pedido').then(m => m.OrdenesPedido),
      },
      {
        path: 'ventas/pedidos',
        loadComponent: () => import('./pages/ventas/pedidos/pedidos').then(m => m.Pedidos),
      },
      {
        path: 'ventas/facturacion',
        loadComponent: () => import('./pages/ventas/facturacion/facturacion').then(m => m.Facturacion),
      },
      {
        path: 'inventarios',
        loadComponent: () => import('./pages/inventarios/inventarios').then(m => m.Inventarios),
      },
      {
        path: 'ventas/reportes',
        loadComponent: () => import('./pages/ventas/reportes/reportes').then(m => m.Reportes),
      },
      {
        path: 'ventas/gestion',
        loadComponent: () => import('./pages/ventas/gestion/gestion').then(m => m.Gestion),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
