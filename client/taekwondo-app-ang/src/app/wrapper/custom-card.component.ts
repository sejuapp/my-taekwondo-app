import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'mat-card-custom',
  imports: [MatCardModule],
  template: `
    <mat-card appearance="raised">
      <ng-content />
    </mat-card>
  `,
})
export class MatCustomCardComponent {
  @Input() appearance: 'outlined' | 'raised' = 'outlined';
}
