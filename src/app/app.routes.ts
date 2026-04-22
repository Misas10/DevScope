import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'repos',
    loadComponent: () => import('./pages/repository/list').then(c => c.RepositoryComponent),
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/repos',
  }
];
