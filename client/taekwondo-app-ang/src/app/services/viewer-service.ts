import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'; // Importa Subject y Observable
import { Match, Participant } from 'brackets-model';
import { ICoordinates, IResponseSelectMatch } from '@app/interface/response-select';

@Injectable({ providedIn: 'root' })
export class ViewerService {

  // Ya no necesitamos un Subject global
  // private matchActionSource = new Subject<string>();
  // matchAction$ = this.matchActionSource.asObservable();

  constructor() { }

  /**
   * Inicializa el visor de brackets y devuelve un Observable para los eventos de ese bracket específico.
   * @returns Un Observable que emite los mensajes de acción para este bracket.
   */
  async initializeViewer(
    selectorId: string,
    viewerData: any
  ): Promise<Observable<IResponseSelectMatch>> {

    await this.viewerRender(selectorId, viewerData);

    // 2. Retornamos la llamada a una nueva función que se encargará de los eventos
    return this.setupBracketEvents(selectorId, viewerData);
  }

  async viewerRender(selectorId: string, tournamentData: any) {
    const viewer = window.bracketsViewer;

    const miSelector = selectorId.startsWith('#') ? selectorId : `#${selectorId}`;
    await viewer.render(tournamentData, { selector: miSelector, clear: true });
  }


  private setupBracketEvents(
    containerId: string,
    viewerData: any
  ): Observable<IResponseSelectMatch> {
    const container = document.getElementById(containerId);
    if (!container) {
      // Si el contenedor no existe, retornamos un Observable que no emite nada
      return new Observable<IResponseSelectMatch>();
    }

    // 1. Crea un nuevo Subject (fuente de eventos) para esta instancia
    const matchActionSource = new Subject<IResponseSelectMatch>();

    // 3. Añade el listener de eventos
    const eventListener = async (event: MouseEvent) => {
      const matchElement = (event.target as HTMLElement).closest('.match');
      if (!matchElement) return;

      const matchId = (matchElement as HTMLElement).dataset['matchId'];
      const clickedMatch = viewerData.matches.find(
        (m: Match) => m.id === parseInt(matchId!)
      );
      if (!clickedMatch) return;

      // Obtenemos las coordenadas del clic
      const miCoordinates: ICoordinates = { x: event?.clientX ?? 0, y: event?.clientY ?? 0 };

      // 4. Emite el mensaje a través del Subject local
      matchActionSource.next({ match: clickedMatch, coordinates: miCoordinates } as IResponseSelectMatch);
    };

    container.addEventListener('click', eventListener);

    // 5. Retorna el Observable que los componentes pueden suscribir
    return matchActionSource.asObservable();
  }
}
