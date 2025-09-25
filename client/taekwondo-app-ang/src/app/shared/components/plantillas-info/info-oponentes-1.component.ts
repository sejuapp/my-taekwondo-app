import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPersonaCategoria } from '@app/interface/request/info-torneo-categoria';

@Component({
  selector: 'app-info-oponentes-1',
  imports: [MatIconModule, CommonModule],
  templateUrl: './info-oponentes-1.component.html',
  styleUrl: './info-oponentes-1.component.scss'
})
export class InfoOponentes1Component {
  @Input() persona: IPersonaCategoria | null = null;

  // Para calcular la edad
  getEdad(fechaNacimiento: string | null): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
