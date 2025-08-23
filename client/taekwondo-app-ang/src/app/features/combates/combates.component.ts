import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { InMemoryDatabase } from '@app/storage/memory';
import { BracketsManager } from 'brackets-manager';

import { TournamentService } from '@app/services/tournament-service';


@Component({
  selector: 'app-combates',
  imports: [
    ...AllSharedImports
  ],
  templateUrl: './combates.component.html',
  styleUrl: './combates.component.scss'
})
export class CombatesComponent implements OnInit, AfterViewInit {



  constructor(
    private tournamentService: TournamentService
  ) {
  }

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  async ngAfterViewInit() {

    const torneo1 = await this.tournamentService.createTournament();
    const torneo2 = await this.tournamentService.createTournament2();

    console.log('Torneo 1:', torneo1);
    console.log('Torneo 2:', torneo2);

    (window as any).bracketsViewer.render(torneo1, {
      selector: '#bracket1'
    });

    (window as any).bracketsViewer.render(torneo2, {
      selector: '#bracket2'
    });


  }



}
