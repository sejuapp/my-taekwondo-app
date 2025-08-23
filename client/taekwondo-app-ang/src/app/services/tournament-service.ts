import { Injectable } from '@angular/core';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {

  TOURNAMENT_ID = 0;

  dataset8: any = {
    title: '8 competitor tournament',
    type: 'single_elimination',
    roster: [
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
      { id: 358, name: 'Seed 11' },
    ],
  };


  customTournament = {
    stages: [
      {
        id: 0,
        tournament_id: 0,
        name: "Torneo 3 jugadores",
        type: "single_elimination",
        number: 1,
        settings: {
          seedOrdering: ["inner_outer"],
          size: 4, // 3 reales + 1 BYE
          consolationFinal: false,
          matchesChildCount: 0
        }
      }
    ],
    matches: [
      // Semifinal 1: Jugador 1 vs Jugador 2
      {
        id: 0,
        number: 1,
        stage_id: 0,
        group_id: 0,
        round_id: 0,
        child_count: 1,
        status: 0,
        opponent1: { id: 1, position: 1 },
        opponent2: { id: 2, position: 2 },
      },
      // Semifinal 2: Jugador 3 vs BYE → Jugador 3 avanza directo
      {
        id: 1,
        number: 2,
        stage_id: 0,
        group_id: 0,
        round_id: 0,
        child_count: 1,
        status: 1, // ya terminado
        opponent1: { id: 3, position: 1 },
        opponent2: { id: 99, position: 2 },
      },
      // Final
      {
        id: 2,
        number: 3,
        stage_id: 0,
        group_id: 0,
        round_id: 1,
        child_count: 0,
        status: 0,
        opponent1: null, // se llena con el ganador del match 0
        opponent2: null, // se llena con el ganador del match 1
      }
    ],
    matchGames: [],
    participants: [
      { id: 1, name: "Jugador 1", tournament_id: 0 },
      { id: 2, name: "Jugador 2", tournament_id: 0 },
      { id: 3, name: "Jugador 3", tournament_id: 0 },
      { id: 99, name: "BYE", tournament_id: 0 } // ficticio
    ]
  };





  constructor() {
  }

  async createTournament(): Promise<any> {

    const db = new InMemoryDatabase();
    const manager = new BracketsManager(db);

    db.setData({
      participant: this.dataset8.roster.map((player: any) => ({
        ...player,
        tournament_id: this.TOURNAMENT_ID,
      })),
      stage: [],
      group: [],
      round: [],
      match: [],
      match_game: [],
    });

    await manager.create.stage({
      name: 'Hola',
      tournamentId: this.TOURNAMENT_ID,
      type: 'single_elimination',
      seeding: this.dataset8.roster.map((player: any) => player.name),
      settings: {
        seedOrdering: ['inner_outer'],
        size: this.getNearestPowerOfTwo(this.dataset8.roster.length),
      },
    });

    const data = await manager.get.stageData(0);

    return {
      stages: data.stage,
      matches: data.match,
      matchGames: data.match_game,
      participants: data.participant,
    };
  }

  private getNearestPowerOfTwo(input: number): number {
    return Math.pow(2, Math.ceil(Math.log2(input)));
  }

  createTournament2() {
    return this.customTournament;
  }


}
