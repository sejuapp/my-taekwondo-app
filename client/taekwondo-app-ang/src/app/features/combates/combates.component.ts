import { Component, OnInit, signal } from '@angular/core';
import { IInfoTorneoCategoria } from '@app/interface/request/info-torneo-categoria';
import {
  IGestionTorneoData,
  ITorneoCreateData,
} from '@app/interface/torneo-data';
import { dataTorneo } from '@app/json/torneo';
import { LoadingBackdropService } from '@app/services/message/loading-backdrop.service';
import { MessageService } from '@app/services/message/message.service';
import { AllSharedImports } from '@app/shared/all-shared-imports';

import { GestionTorneoComponent } from '@app/shared/components/gestion-torneo/gestion-torneo.component';

@Component({
  selector: 'app-combates',
  imports: [...AllSharedImports, GestionTorneoComponent],
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
