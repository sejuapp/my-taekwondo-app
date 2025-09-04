import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IGestionTorneoData, ITorneoCreateData } from '@app/interface/torneo-data';
import { TournamentService } from '@app/services/tournament-service';
import { AllSharedImports } from '@app/shared/all-shared-imports';

import { GestionTorneoComponent } from '@app/shared/components/gestion-torneo/gestion-torneo.component';
import { InputStage } from 'brackets-model';
import { Subscription } from 'rxjs';

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
    //const torneo = await this.tournamentService.createTournament();
    //const torneoId = `T1`;

    const torneo2 = await this.tournamentService.createTournament2();
    const torneoId2 = `T2`;


    const roster = [
      { id: 7, name: 'Seed 1' },
      { id: 55, name: 'Seed 2' },
      { id: 53, name: 'Seed 3' },
      { id: 523, name: 'Seed 4' },
      /*{ id: 123, name: 'Seed 5' },
      { id: 353, name: 'Seed 6' },
      { id: 354, name: 'Seed 7' },
      { id: 355, name: 'Seed 8' },
      { id: 356, name: 'Seed 9' },
      { id: 357, name: 'Seed 10' },*/
    ];

    const roster2 = [
      { id: 17, name: 'Participante 1' },
      { id: 155, name: 'Participante 2' },
      { id: 153, name: 'Participante 3' },
      { id: 1523, name: 'Participante 4' },
      { id: 1123, name: 'Participante 5' },
      /*{ id: 353, name: 'Participante 6' },
      { id: 354, name: 'Participante 7' },
      { id: 355, name: 'Participante 8' },
      { id: 356, name: 'Participante 9' },
      { id: 357, name: 'Participante 10' },*/
    ];


    const stage: InputStage = {
      tournamentId: 'T1',
      name: 'Torneo 3 jugadores',
      type: 'single_elimination',
    }

    const dataCreate: ITorneoCreateData = {
      participants: roster2,
      stage: stage
    }

    const torneo1 = await this.crearTorneo(dataCreate);
    console.log('Torneo generado:', torneo1);

    this.tournamentsData.push(torneo1);

  }

  async crearTorneo(dataCreate: ITorneoCreateData) : Promise<IGestionTorneoData> {
    // Lógica para crear un nuevo torneo
    const dataTorneo = await this.tournamentService.createTournament4(dataCreate, []);

    return {
      viewerData: dataTorneo?.viewerData ?? null,
      dataCreate: dataCreate
    };
  }
}
