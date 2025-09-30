import { Injectable } from '@angular/core';
import { fromEvent, Observable, EMPTY } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  ICoordinates,
  IResponseSelectMatch,
} from '@app/interface/response-select';

@Injectable({ providedIn: 'root' })
export class ViewerService {
  constructor() { }

  /**
   * Inicializa el visor y emite eventos de clic en los oponentes.
   * @param selectorId El ID del contenedor HTML para el visor.
   * @param viewerData Los datos del torneo para renderizar.
   * @returns Un Observable de los clics en los oponentes o un Observable vacío si falla.
   */
  async initializeViewer(
    selectorId: string | number,
    viewerData: any
  ): Promise<Observable<IResponseSelectMatch>> {
    await this.viewerRender(selectorId, viewerData);
    return this.setupBracketEvents(selectorId);
  }

  /**
   * Renderiza los datos del torneo en un contenedor HTML.
   * @param selectorId El ID del contenedor.
   * @param tournamentData Los datos del torneo.
   */
  async viewerRender(selectorId: string | number, tournamentData: any) {
    const viewer = window.bracketsViewer;
    const selectorStr = String(selectorId);
    const miSelector = selectorStr.startsWith('#') ? selectorStr : `#${selectorStr}`;
    await viewer.render(tournamentData, { selector: miSelector, clear: true });
  }

  /**
   * Configura el listener de eventos de clic en el contenedor.
   * @param containerId El ID del contenedor.
   * @returns Un Observable que emite los datos del match seleccionado.
   */
  private setupBracketEvents(
    containerId: string | number
  ): Observable<IResponseSelectMatch> {
    const container = document.getElementById(String(containerId));
    if (!container) {
      console.warn(`El contenedor con ID "${containerId}" no fue encontrado.`);
      return EMPTY;
    }

    return fromEvent<MouseEvent>(container, 'click').pipe(
      map((event) => this.processClickEvent(event)),
      filter((value): value is IResponseSelectMatch => value !== null)
    );
  }

  /**
   * Procesa un evento de clic para extraer el match y las coordenadas.
   * @param event El evento de clic.
   * @param viewerData Los datos del torneo.
   * @returns Los datos del match seleccionado o `null` si no se encuentra.
   */
  private processClickEvent(event: MouseEvent): IResponseSelectMatch | null {
    // 1. Encontrar el contenedor del participante en el que se hizo clic
    const participantElement = (event.target as HTMLElement).closest(
      '.participant'
    );

    // Si no se hizo clic en un participante (o un elemento dentro de uno), salimos
    if (!participantElement) {
      return null;
    }

    // 2. Encontrar el contenedor de los oponentes y del match a partir del participante
    const opponentsElement = participantElement.closest('.opponents');
    if (!opponentsElement) return null;

    const matchElement = opponentsElement.closest('.match');
    if (!matchElement) return null;

    // 3. Obtener el ID del match
    const matchId = matchElement.getAttribute('data-match-id');
    const parsedMatchId = matchId ? parseInt(matchId, 10) : NaN;
    if (isNaN(parsedMatchId)) return null;

    // 4. Obtener el ID del oponente directamente desde el elemento del participante
    const participantId = participantElement.getAttribute(
      'data-participant-id'
    );
    const parsedOpponentId = participantId ? parseInt(participantId, 10) : null;

    const coordinates: ICoordinates = {
      x: event.clientX,
      y: event.clientY,
    };

    return {
      idMatch: parsedMatchId,
      idOpponent: parsedOpponentId,
      coordinates,
    };
  }
}
