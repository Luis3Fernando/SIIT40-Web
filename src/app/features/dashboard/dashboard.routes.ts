import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../core/layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home),
        data: { title: 'Resumen general' }
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics').then(m => m.Analytics),
        data: { title: 'Análisis de datos' }
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about').then(m => m.About),
        data: { title: 'Acerca del sistema' }
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact').then(m => m.Contact),
        data: { title: 'Soporte y contacto' }
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];