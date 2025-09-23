import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatchResults, ParticipantResult } from 'brackets-model';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  signal,
  DestroyRef,
} from '@angular/core';
import {
  IItemBracketsSelect,
  IOpcionSeleccionar,
  IOpponentBracketSelect,
} from '@app/interface/item-brackets-select';
import { IResponseSelectMatch } from '@app/interface/response-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { ViewerService } from '@app/services/viewer-service';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { OpcionesSeleccionComponent } from '@app/shared/components/modales/opciones-seleccion/opciones-seleccion.component';
import { DialogService } from '@app/shared/services/dialog.service';
import { AccionCompetidorEnum } from '@app/shared/enum/accion-competidor.enum';
import { ReasignarCompetidorComponent } from '@app/shared/components/modales/reasignar-competidor/reasignar-competidor.component';
import { filter } from 'rxjs';
import { IParticipantCategoria } from '@app/interface/request/info-torneo-categoria';
import { IdOpponent } from '@app/type/type-brackets';

@Component({
  selector: 'app-gestion-torneo',
  imports: [...AllSharedImports],
  templateUrl: './gestion-torneo.component.html',
  styleUrl: './gestion-torneo.component.scss',
})
export class GestionTorneoComponent implements OnInit, AfterViewInit {
  NOMBRE_SIN_ASIGNACION = 'Sin asignar';

  @Input() torneoId: number | string = 'bracket-default';
  @Input() torneoData: IGestionTorneoData | null = null;

  // --- Signals ---
  participantsMap = signal<Map<number, any>>(new Map());
  itemBracketsSelect = signal<IItemBracketsSelect | null>(null);

  constructor(
    private viewerService: ViewerService,
    private _dialogService: DialogService,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit(): void {
    console.log(`✅ [${this.torneoId}] Componente inicializado`);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.torneoData) return;

    console.log(`⚙️ [${this.torneoId}] Inicializando visor...`);

    // Guardamos los participantes en el mapa para buscarlos rápido por id
    this.participantsMap.set(
      new Map(
        this.torneoData.miTorneoCategoria?.participants.map((p: any) => [
          p.bracket.id,
          p,
        ])
      )
    );

    // Inicializamos el visor y escuchamos eventos de selección de matches
    const matchActionObservable = await this.viewerService.initializeViewer(
      this.torneoId,
      this.torneoData.viewerData
    );

    matchActionObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (message: IResponseSelectMatch) => {
        // 🔔 Log único para cuando llega un mensaje
        console.log(`[${this.torneoId}] 📩 Acción recibida:`, message);
        this.handleMatchAction(message);
      },
      error: (err) => {
        console.error(`[${this.torneoId}] ❌ Error al recibir mensaje:`, err);
      },
    });
  }

  /**
   * Maneja las acciones de match recibidas
   */
  private handleMatchAction(message: IResponseSelectMatch): void {
    // Mapeamos el mensaje a un item seleccionable
    const mappedItem = this.mapItemSelect(message);

    // Actualizamos la señal con el item actual
    this.itemBracketsSelect.set(mappedItem);

    // Abrimos el modal con las opciones disponibles
    this.openModalOpcionesSeleccion();
  }

  /**
   * Refresca el render del visor
   */
  async refrescarRender() {
    console.log(`🔄 [${this.torneoId}] Refrescando render del visor...`);
    await this.viewerService.viewerRender(
      this.torneoId,
      this.torneoData?.viewerData
    );
  }

  /**
   * Mapea el mensaje de respuesta a un item seleccionable
   */
  private mapItemSelect(message: IResponseSelectMatch): IItemBracketsSelect {
    const match = this.torneoData?.viewerData?.matches[message.idMatch];
    if (!match) {
      throw new Error(
        `Match con ID ${message.idMatch} no encontrado en los datos del torneo.`
      );
    }
    return {
      match: match,
      customOpponents: [
        this.buildOpponent(match?.opponent1),
        this.buildOpponent(match?.opponent2),
      ],
    };
  }

  /**
   * Construye un oponente para la selección
   */
  private buildOpponent(
    opponent: ParticipantResult | null
  ): IOpponentBracketSelect {
    const participant = this.getOpponent(opponent?.id);
    return {
      match: {
        id: opponent?.id,
        name: this.getOpponentName(participant),
        result: opponent?.result ?? null,
      },
      participant,
    };
  }

  /**
   * Busca un participante por id en el mapa
   */
  private getOpponent(opponentId: any): any | null {
    return opponentId != null
      ? this.participantsMap().get(opponentId) ?? null
      : null;
  }

  /**
   * Obtiene el nombre de un oponente
   */
  private getOpponentName(opponent: any): string {
    return opponent?.bracket?.name ?? this.NOMBRE_SIN_ASIGNACION;
  }

  /**
   * Abre el modal de opciones de selección
   */
  private openModalOpcionesSeleccion(): void {
    const currentItem = this.itemBracketsSelect();
    if (!currentItem) return;

    const dialogData = {
      itemBracketsSelect: currentItem,
      torneoData: this.torneoData,
    };

    const dialogRef = this._dialogService.open(
      OpcionesSeleccionComponent,
      dialogData
    );

    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((result: IOpcionSeleccionar) => !!result)
      )
      .subscribe((result: IOpcionSeleccionar) => {
        if (result.accion === AccionCompetidorEnum.CAMBIAR) {
          this.openModalReasignar(result);
        }
      });
  }

  /**
   * Abre el modal para reasignar un competidor
   */
  openModalReasignar(result: IOpcionSeleccionar) {
    const data = {
      idOpponent: result.idOpponent,
      itemBracketsSelect: this.itemBracketsSelect(),
      torneoData: this.torneoData,
    };

    const dialogRef = this._dialogService.open(
      ReasignarCompetidorComponent,
      data
    );

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nuevoOponente: IParticipantCategoria | null) => {
        if (!nuevoOponente) {
          console.log(`[${this.torneoId}] ❌ Reasignación cancelada`);
          return;
        }

        console.log(`[${this.torneoId}] 🔄 Reasignación result:`, nuevoOponente);
        this.reasignar(data.idOpponent, nuevoOponente);
      });
  }

  private reasignar(idOponenteAnterior: IdOpponent, nuevoOponente: IParticipantCategoria) {

    const roundId = this.itemBracketsSelect()?.match?.round_id ?? 0;
    const matches = this.torneoData?.viewerData?.matches ?? [];
    const nuevoOponenteId = nuevoOponente.bracket.id;

    if (matches.length === 0) {
      return;
    }

    const matchesOponenteAnterior = matches.filter(m => {
      const isRelevantRound = roundId === 0 || m.round_id >= roundId;
      return isRelevantRound && (m.opponent1?.id === idOponenteAnterior || m.opponent2?.id === idOponenteAnterior);
    });

    const matchesNuevoOponente = matches.filter(m => {
      const isRelevantRound = roundId === 0 || m.round_id >= roundId;
      return isRelevantRound && (m.opponent1?.id === nuevoOponenteId || m.opponent2?.id === nuevoOponenteId);
    });

    if (!matchesOponenteAnterior || !matchesNuevoOponente) {
      return;
    }

    // Intercambiar IDs de los oponentes.
    matchesOponenteAnterior.forEach(item => {
      this.intercambiarOponente(item, idOponenteAnterior, nuevoOponenteId);
    })

    matchesNuevoOponente.forEach(item => {
      this.intercambiarOponente(item, nuevoOponenteId, idOponenteAnterior);
    })

    this.refrescarRender();
  }

  /**
   * Método de ayuda para intercambiar el ID de un oponente en un partido.
   * Valida que los oponentes no sean null antes de la asignación.
   */
  private intercambiarOponente(
    match: MatchResults,
    idActual: IdOpponent,
    idNuevo: IdOpponent
  ) {
    // Los siguientes if/else ya manejan la posibilidad de que el ID sea null o undefined.
    if (idNuevo && match?.opponent1 && match.opponent1?.id === idActual) {
      match.opponent1.id = idNuevo;
    } else if (idNuevo && match?.opponent2 && match.opponent2?.id === idActual) {
      match.opponent2.id = idNuevo;
    }
  }
}
