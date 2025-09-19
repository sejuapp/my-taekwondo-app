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


  procesarListaParticipantes(lstParticipants: any[]) {
    // Si la lista tiene un número impar de participantes, agregar un "BYE"
    if (lstParticipants.length % 2 !== 0) {
      lstParticipants.push({ id: 0, name: 'No hay rival' }); // ID ficticio para "BYE"
    }

    return lstParticipants;
  }


  async createTournament(
    dataCreate: ITorneoCreateData,
    lstMatch: Match[]
  ): Promise<ITorneoViewerData | null> {

    const lstParticipants = dataCreate?.participants ?? [];

    const stage = dataCreate.stage;

    const db = new InMemoryDatabase();

    db.setData({
      participant: lstParticipants.map((player: any) => ({
        ...player,
        tournament_id: dataCreate.stage.tournamentId,
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

  /**
   * Método que sirve para redondear hacia arriba un número al siguiente número que sea potencia de 2.
   * @param input valor a redondear
   * @returns Valor redondeado
   */
  private getNearestPowerOfTwo(input: number): number {
    return Math.pow(2, Math.ceil(Math.log2(input)));
  }
}
