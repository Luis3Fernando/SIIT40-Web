import { Routes } from '@angular/router';

export const GREENHOUSE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../core/layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'plants',
        loadComponent: () => import('./pages/plant-list/plant-list').then(m => m.PlantList),
        data: { title: 'Plantas en producción' }
      },
      {
        path: 'plants/create',
        loadComponent: () => import('./pages/plant-create/plant-create').then(m => m.PlantCreate),
        data: { title: 'Registrar siembra' }
      },
      {
        path: 'plants/edit/:id',
        loadComponent: () => import('./pages/plant-edit/plant-edit').then(m => m.PlantEdit),
        data: { title: 'Actualizar etapa fenológica' }
      }
    ]
  }
];