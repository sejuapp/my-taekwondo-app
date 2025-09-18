import { Injectable } from '@angular/core';
import {
  ITorneoCreateData,
  ITorneoViewerData,
} from '@app/interface/torneo-data';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';
import { JsonDatabase } from 'brackets-json-db';
import { Match, Participant } from 'brackets-model';

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
    ],
  };

  customTournament = {
    stages: [
      {
        id: 0,
        tournament_id: 0,
        name: 'Torneo 3 jugadores',
        type: 'single_elimination',
        number: 1,
        settings: {
          seedOrdering: ['inner_outer'],
          size: 4, // 3 reales + 1 BYE
          consolationFinal: false,
          matchesChildCount: 0,
          locale: 'en',
        },
      },
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
        opponent1: undefined,
        opponent2: undefined,
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
        opponent1: undefined,
        opponent2: undefined,
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
        opponent1: { id: null, position: undefined },
        opponent2: { id: null, position: undefined },
      },
    ],
    matchGames: [],
    participants: [
      { id: 1, name: 'Sebastian Alejandro Gonzalez Montenegro' },
      { id: 2, name: 'Julian David Gonzalez Montenegro' },
      { id: 3, name: 'Rigoberto Daniel Pedraza Molina' },
      { id: 99, name: 'No hay rival' }, // ficticio
    ],
  };

  constructor() {
    window.bracketsViewer.addLocale('es', {
      common: {
        round: 'Ronda',
        bye: 'No hay rival',
        seed: 'Clasificación',
        final: 'Final',
        grandFinal: 'Gran Final',
        consolationFinal: 'Final de Consolación',
      },
      abbreviations: {
        semifinal: 'Semifinal',
        semifinals: 'Semifinales',
        '3rdPlace': '3er Puesto',
      },
    });
  }

  async createTournament(): Promise<ITorneoViewerData | null> {
    const db = new InMemoryDatabase();

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

    const manager = new BracketsManager(db);

    const seeding = undefined; //this.dataset8.roster.map((player: any) => player.id);
    console.log('Seeding:', seeding);

    await manager.create.stage({
      name: 'Hola',
      tournamentId: this.TOURNAMENT_ID,
      type: 'single_elimination',
      seeding: seeding,
      settings: {
        seedOrdering: ['inner_outer'],
        size: this.getNearestPowerOfTwo(this.dataset8.roster.length),
      },
    });

    const data = await manager.export();
    //const data = await manager.get.stageData(0);

    return {
      viewerData: {
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant,
      },
    };
  }

  private getNearestPowerOfTwo(input: number): number {
    return Math.pow(2, Math.ceil(Math.log2(input)));
  }

  async createTournament2() {
    return {
      viewerData: this.customTournament,
    };
  }

  async createTournament3(lstParticipants: any[], lstMatches: any[]) {
    const customTournamentBase = JSON.parse(
      JSON.stringify(this.customTournament)
    );

    this.procesarListaParticipantes(lstParticipants);

    if (lstMatches.length == 0) {
      lstMatches = this.generarMatches(lstParticipants.length);
    }

    customTournamentBase.participants = lstParticipants;
    customTournamentBase.matches = lstMatches;

    return {
      viewerData: customTournamentBase,
    };
  }

  procesarListaParticipantes(lstParticipants: any[]) {
    // Si la lista tiene un número impar de participantes, agregar un "BYE"
    if (lstParticipants.length % 2 !== 0) {
      lstParticipants.push({ id: 0, name: 'No hay rival' }); // ID ficticio para "BYE"
    }

    return lstParticipants;
  }

  generarMatches(numParticipants: number) {
    // Redondear hacia arriba al siguiente múltiplo de potencia de 2
    const total = Math.pow(2, Math.ceil(Math.log2(numParticipants)));
    const rounds = Math.log2(total);

    const matches: any[] = [];
    let matchId = 0;

    for (let round = 0; round < rounds; round++) {
      const matchesInRound = total / Math.pow(2, round + 1);

      for (let m = 0; m < matchesInRound; m++) {
        matches.push({
          id: matchId++,
          round_id: round,
          stage_id: 0,
          group_id: 0,
          child_count: round < rounds - 1 ? 2 : 0,
          status: 0,
          opponent1: undefined,
          opponent2: undefined,
        });
      }
    }

    return matches;
  }

  async createTournament4(
    dataCreate: ITorneoCreateData,
    lstMatch: Match[]
  ): Promise<ITorneoViewerData | null> {

    const lstParticipants = dataCreate?.participants ?? [];

    const stage = dataCreate.stage;

    const db = new InMemoryDatabase();

    db.setData({
      participant: lstParticipants.map((player: any) => ({
        ...player,
        tournament_id: this.TOURNAMENT_ID,
      })),
      stage: [],
      group: [],
      round: [],
      match: lstMatch,
      match_game: [],
    });

    const manager = new BracketsManager(db);

    const seeding = lstParticipants.map((player: any) => player);

    await manager.create.stage({
      name: stage.name,
      tournamentId: stage.tournamentId,
      type: stage.type,
      seeding: seeding,
      settings: {
        seedOrdering: ['inner_outer'],
        size: this.getNearestPowerOfTwo(lstParticipants.length),
      },
    });

    const data = await manager.export();
    //const data = await manager.get.stageData(0);

    return {
      viewerData: {
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant,
      },
    };
  }
}
