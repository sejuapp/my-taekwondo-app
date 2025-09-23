import { Component, OnInit, signal } from '@angular/core';
import { IGestionTorneoData, ITorneoCreateData } from '@app/interface/torneo-data';
import { dataTorneo } from '@app/json/torneo';
import { dataTorneo2 } from '@app/json/torneo2';
import { TournamentService } from '@app/services/tournament-service';
import { AllSharedImports } from '@app/shared/all-shared-imports';

import { GestionTorneoComponent } from '@app/shared/components/gestion-torneo/gestion-torneo.component';
import { InputStage } from 'brackets-model';

@Component({
  selector: 'app-combates',
  imports: [...AllSharedImports, GestionTorneoComponent],
  templateUrl: './combates.component.html',
  styleUrl: './combates.component.scss',
})
export class CombatesComponent implements OnInit {

  tournamentsData = signal<IGestionTorneoData[]>([]);

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
    this.cargarTorneos();
  }

  private async cargarTorneos() {
    this.agregarTorneo(dataTorneo);

    setTimeout(() => {
      this.agregarTorneo(dataTorneo2);
    }, 5000)

  }

  async agregarTorneo(miTorneo: any) {
    const nuevoTorneo = await this.crearTorneo(miTorneo);
    console.log('Torneo generado ::> ', nuevoTorneo);

    this.tournamentsData.update(prev => [...prev, nuevoTorneo]);
  }

  private async crearTorneo(miTorneo: any): Promise<IGestionTorneoData> {
    const dataCreate: ITorneoCreateData = {
      participants: miTorneo.participants.map((m: any) => m.bracket),
      stage: <InputStage>miTorneo.stage
    };

    const dataTorneo = await this.tournamentService.createTournament(dataCreate, []);
    return {
      viewerData: dataTorneo?.viewerData ?? null,
      miTorneo
    };
  }

}
