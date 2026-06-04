import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../core/layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about').then(m => m.About)
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];