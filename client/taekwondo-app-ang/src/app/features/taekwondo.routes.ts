import { Routes } from '@angular/router';
import { CombatesComponent } from '@app/features/combates/combates.component';
import { ExampleComponent } from '@app/features/example/example.component';

export const TAEKWONDO_ROUTES: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(
        m => m.ADMIN_ROUTES
      ),
  },
  { path: '', component: CombatesComponent },
  { path: 'example', component: ExampleComponent },
];
