import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IGestionTorneoData, ITorneoCreateData } from '@app/interface/torneo-data';
import { dataTorneo } from '@app/json/torneo';
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
export class CombatesComponent implements OnInit, AfterViewInit {
  tournamentsData: IGestionTorneoData[] = [];

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  async ngAfterViewInit() {
    const miTorneo = dataTorneo;

    const participant = miTorneo.participantes;
    const stage = <InputStage>miTorneo.stage;

    const dataCreate: ITorneoCreateData = {
      participants: participant.map(m => m.bracket),
      stage: stage
    }

    const torneo1 = await this.crearTorneo(dataCreate);
    console.log('Torneo generado:', torneo1);

    this.tournamentsData.push(torneo1);

  }

  async crearTorneo(dataCreate: ITorneoCreateData): Promise<IGestionTorneoData> {
    // Lógica para crear un nuevo torneo
    const dataTorneo = await this.tournamentService.createTournament(dataCreate, []);

    return {
      viewerData: dataTorneo?.viewerData ?? null,
      dataCreate: dataCreate
    };
  }
}
