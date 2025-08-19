import { Component } from '@angular/core';
import { AllSharedImports } from '@app/shared/all-shared-imports';

@Component({
  selector: 'app-combates',
  imports: [
    ...AllSharedImports
  ],
  templateUrl: './combates.component.html',
  styleUrl: './combates.component.scss'
})
export class CombatesComponent {

  lstCompetidores: any[] = [
    { id: 1, nombre: 'Juan Perez', categoria: 'Junior', peso: '68kg' },
    { id: 2, nombre: 'Maria Gomez', categoria: 'Senior', peso: '55kg' },
    { id: 3, nombre: 'Carlos Ruiz', categoria: 'Cadete', peso: '75kg' },
    { id: 4, nombre: 'Ana Torres', categoria: 'Junior', peso: '60kg' },
    { id: 5, nombre: 'Luis Martinez', categoria: 'Senior', peso: '80kg' },
    { id: 6, nombre: 'Sofia Lopez', categoria: 'Cadete', peso: '50kg' },
    { id: 7, nombre: 'Pedro Sanchez', categoria: 'Junior', peso: '70kg' }
  ];

}
