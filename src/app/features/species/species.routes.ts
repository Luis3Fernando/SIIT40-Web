import { Routes } from '@angular/router';

export const SPECIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../core/layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/list/list').then(m => m.EspeciesList),
        data: { title: 'Gestión de especies' }
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/create/create').then(m => m.EspeciesCreate),
        data: { title: 'Registrar nueva especie' }
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/edit/edit').then(m => m.EspeciesEdit),
        data: { title: 'Modificar especie' }
      }
    ]
  }
];