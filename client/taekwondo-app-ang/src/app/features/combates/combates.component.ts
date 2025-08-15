import { Component } from '@angular/core';

@Component({
  selector: 'app-combates',
  imports: [],
  templateUrl: './combates.component.html',
  styleUrl: './combates.component.scss'
})
export class CombatesComponent {

  lstCompetidores: any[] = [
    { id: 1, nombre: 'Juan Perez', categoria: 'Junior', peso: '68kg' },
    { id: 2, nombre: 'Maria Gomez', categoria: 'Senior', peso: '55kg' },
    { id: 3, nombre: 'Carlos Ruiz', categoria: 'Cadete', peso: '75kg' }
  ];

}
