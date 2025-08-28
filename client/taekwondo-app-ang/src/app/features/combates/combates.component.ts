import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TournamentService } from '@app/services/tournament-service';
import { AllSharedImports } from '@app/shared/all-shared-imports';

import { GestionTorneoComponent } from '@app/shared/components/gestion-torneo/gestion-torneo.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-combates',
  imports: [
    ...AllSharedImports,
    GestionTorneoComponent
  ],
  templateUrl: './combates.component.html',
  styleUrl: './combates.component.scss'
})
export class CombatesComponent implements OnInit, AfterViewInit {

  tournamentsData: any[] = [];

  private viewerSubscription!: Subscription;

  constructor(
    private tournamentService: TournamentService,
  ) {
  }

  ngOnInit(): void {
    // Component initialization logic if needed


  }

  async ngAfterViewInit() {

    const torneo = await this.tournamentService.createTournament()
    const torneoId = `T1`;
    const torneo2 = await this.tournamentService.createTournament2()
    const torneoId2 = `T2`;


    this.tournamentsData.push({ torneoId: torneoId, torneoData: torneo });
    this.tournamentsData.push({ torneoId: torneoId2, torneoData: torneo2 });
  }




}
