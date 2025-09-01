import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TournamentService } from '@app/services/tournament-service';
import { AllSharedImports } from '@app/shared/all-shared-imports';

import { GestionTorneoComponent } from '@app/shared/components/gestion-torneo/gestion-torneo.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-combates',
  imports: [...AllSharedImports, GestionTorneoComponent],
  templateUrl: './combates.component.html',
  styleUrl: './combates.component.scss',
})
export class CombatesComponent implements OnInit, AfterViewInit {
  tournamentsData: any[] = [];

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
      { id: 123, name: 'Seed 5' },
      { id: 353, name: 'Seed 6' },
      { id: 354, name: 'Seed 7' },
      { id: 355, name: 'Seed 8' },
      { id: 356, name: 'Seed 9' },
      { id: 357, name: 'Seed 10' },
    ];

    const torneo3 = await this.tournamentService.createTournament3(roster, []);
    const torneoId3 = `T3`;

     const torneo4 = await this.tournamentService.createTournament4(roster, []);
    const torneoId4 = `T4`;

    console.log('Torneo generado:', torneo4);

    //this.tournamentsData.push({ torneoId: torneoId, torneoData: torneo });
    //this.tournamentsData.push({ torneoId: torneoId2, torneoData: torneo2 });
    //this.tournamentsData.push({ torneoId: torneoId3, torneoData: torneo3 });
    this.tournamentsData.push({ torneoId: torneoId4, torneoData: torneo4 });
  }
}
