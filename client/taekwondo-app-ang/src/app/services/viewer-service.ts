import { Injectable } from '@angular/core';
import { fromEvent, Observable, EMPTY } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Match } from 'brackets-model';
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
    return this.setupBracketEvents(selectorId, viewerData);
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
   * @param viewerData Los datos del torneo para buscar el match.
   * @returns Un Observable que emite los datos del match seleccionado.
   */
  private setupBracketEvents(
    containerId: string | number,
    viewerData: any
  ): Observable<IResponseSelectMatch> {
    const container = document.getElementById(String(containerId));
    if (!container) {
      console.warn(`El contenedor con ID "${containerId}" no fue encontrado.`);
      return EMPTY;
    }

    return fromEvent<MouseEvent>(container, 'click').pipe(
      map((event) => this.processClickEvent(event, viewerData)),
      filter((value): value is IResponseSelectMatch => value !== null)
    );
  }

  /**
   * Procesa un evento de clic para extraer el match y las coordenadas.
   * @param event El evento de clic.
   * @param viewerData Los datos del torneo.
   * @returns Los datos del match seleccionado o `null` si no se encuentra.
   */
  private processClickEvent(
    event: MouseEvent,
    viewerData: any
  ): IResponseSelectMatch | null {
    const targetElement = event.target as HTMLElement;
    const opponentsElement = targetElement.closest('.opponents');
    if (!opponentsElement) return null;

    const matchElement = opponentsElement.closest('.match');
    if (!matchElement) return null;

    const matchId = matchElement.getAttribute('data-match-id');
    const parsedMatchId = matchId ? parseInt(matchId, 10) : NaN;
    if (isNaN(parsedMatchId)) return null;

    const clickedMatch = viewerData.matches?.find(
      (m: Match) => m.id === parsedMatchId
    );
    if (!clickedMatch) return null;

    const coordinates: ICoordinates = {
      x: event.clientX,
      y: event.clientY,
    };

    return { match: clickedMatch, coordinates };
  }
}
