import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/taekwondo.routes').then(
        m => m.TAEKWONDO_ROUTES
      ),
  },
];
