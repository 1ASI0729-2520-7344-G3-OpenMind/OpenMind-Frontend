import { Routes } from '@angular/router';

export const RECOM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/recom-page/recom-page.component').then(m => m.RecomPageComponent)
  }
];
