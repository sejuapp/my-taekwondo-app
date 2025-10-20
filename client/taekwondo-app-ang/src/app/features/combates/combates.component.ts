import { Component, OnInit, signal } from '@angular/core';
import { IInfoTorneoCategoria } from '@app/interface/request/info-torneo-categoria';
import {
  IGestionTorneoData,
} from '@app/interface/torneo-data';
import { dataTorneo } from '@app/json/torneo';
import { dataTorneo2 } from '@app/json/torneo2';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { GestionContenedorComponent } from '@app/shared/components/gestion-torneo/gestion-contenedor/gestion-contenedor.component';

@Component({
  selector: 'app-combates',
  imports: [...AllSharedImports, GestionContenedorComponent],
  templateUrl: './combates.component.html',
  styleUrl: './combates.component.scss',
})
export class CombatesComponent implements OnInit {
  tournamentsData = signal<IGestionTorneoData[]>([]);

  constructor() { }

  ngOnInit(): void {
    this.cargarTorneos();
  }

  private async cargarTorneos() {
    this.agregarTorneo(dataTorneo);

    setTimeout(()=> {
      this.agregarTorneo(dataTorneo2);
    }, 5000);

  }

  async agregarTorneo(miTorneoCategoria: IInfoTorneoCategoria) {
    const nuevoTorneo = await this.crearTorneo(miTorneoCategoria);
    this.tournamentsData.update((prev) => [...prev, nuevoTorneo]);
  }

  private async crearTorneo(
    miTorneoCategoria: IInfoTorneoCategoria
  ): Promise<IGestionTorneoData> {
    return {
      miTorneoCategoria: miTorneoCategoria,
    };
  }
}
