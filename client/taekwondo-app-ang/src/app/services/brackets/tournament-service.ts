import { Injectable } from '@angular/core';
import { IInfoTorneoCategoria } from '@app/interface/request/info-torneo-categoria';
import { BracketsManager } from 'brackets-manager';
import { InMemoryDatabase } from 'brackets-memory-db';

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

  async createBracketsManager(
    bracketsId: string,
    dataCreate: IInfoTorneoCategoria,
    existingData?: any // 👈 Datos ya modificados
  ): Promise<BracketsManager> {
    const lstParticipants = dataCreate?.participants ?? [];
    const stage = dataCreate.stage;

    const db = new InMemoryDatabase();

    // Si ya tienes datos modificados, úsalos directamente
    if (existingData) {
      db.setData({
        participant: existingData.participants,
        stage: existingData.stages,
        group: existingData.groups || [],
        round: existingData.rounds || [],
        match: existingData.matches,
        match_game: existingData.matchGames || [],
      });
    } else {
      // Crear desde cero
      db.setData({
        participant: lstParticipants.map((player: any) => ({
          ...player.id,
          tournament_id: bracketsId,
        })),
        stage: [],
        group: [],
        round: [],
        match: [],
        match_game: [],
      });
    }

    const manager = new BracketsManager(db);

    // Solo crear el stage si no existe
    if (!existingData) {
      const seeding = lstParticipants.map((player: any) => player.bracket);
      const stageNameFinal = stage.name.trim() === '' ? ' ' : stage.name;

      await manager.create.stage({
        name: stageNameFinal,
        tournamentId: bracketsId,
        type: stage.type,
        seeding: seeding,
        settings: {
          seedOrdering: ['inner_outer'],
          size: this.getNearestPowerOfTwo(lstParticipants.length),
        },
      });
    }

    return manager;
  }

  async getViewerData(bracketsManager: BracketsManager) {
    const data = await bracketsManager.export();
    return {
      viewerRender: {
        //Necesarios para actualizar los cambios en el manager
        groups: data.group,
        rounds: data.round,

        //Necesarios para renderizar
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
