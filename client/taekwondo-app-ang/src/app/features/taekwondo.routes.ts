import { Routes } from '@angular/router';
import { CombatesComponent } from '@app/features/combates/combates.component';
import { ExampleComponent } from '@app/features/example/example.component';

export const TAEKWONDO_ROUTES: Routes = [
  { path: '', component: CombatesComponent },
  { path: 'example', component: ExampleComponent },
];
