import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatchResults, ParticipantResult } from 'brackets-model';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  signal,
  DestroyRef,
  ViewChild,
  computed,
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
import { DialogService } from '@app/shared/services/dialog.service';
import { ReasignarCompetidorComponent } from '@app/shared/components/modales/reasignar-competidor/reasignar-competidor.component';
import { IParticipantCategoria } from '@app/interface/request/info-torneo-categoria';
import { IdOpponent } from '@app/type/type-brackets';
import { generateId } from '@app/utils/id-generator';
import { TournamentService } from '@app/services/tournament-service';
import { BracketsManager } from 'brackets-manager';
import { MatMenuTrigger } from '@angular/material/menu';
import { DetalleMatchComponent } from '@app/shared/components/modales/detalle-match/detalle-match.component';
import { MatMenuStyledComponent, MenuOption } from '@app/shared/components/menus/mat-menu-styled/mat-menu-styled/mat-menu-styled.component';

@Component({
  selector: 'app-gestion-torneo',
  imports: [...AllSharedImports, MatMenuStyledComponent],
  templateUrl: './gestion-torneo.component.html',
  styleUrl: './gestion-torneo.component.scss',
})
export class GestionTorneoComponent implements OnInit, AfterViewInit {
  @ViewChild('styledMenu') styledMenu!: MatMenuStyledComponent;
  @Input() torneoData: IGestionTorneoData | null = null;

  menuTopLeft = { x: '0px', y: '0px' };

  viewerId: string = `V_${generateId()}`;
  bracketsManager: BracketsManager | null = null;
  viewerData: any = null;

  NOMBRE_SIN_ASIGNACION = 'Sin asignar';

  // --- Signals ---
  participantsMap = signal<Map<number, any>>(new Map());
  itemBracketsSelect = signal<IItemBracketsSelect | null>(null);


  existeGanador = computed(() => {
    const match = this.itemBracketsSelect()?.match;
    if (!match) return false;

    return Boolean(match.opponent1?.result || match.opponent2?.result);
  });

  sePuedeCambiar = computed(() => {
    const opponentClick = this.itemBracketsSelect()?.idOpponentClick;
    return Boolean(opponentClick);
  });


  get menuOptionsDynamic(): MenuOption[] {
    return [
      {
        label: 'Ver detalle enfrentamiento',
        icon: 'visibility',
        action: () => this.openModalDetalleMatch()
      },
      {
        label: 'Cambiar competidor',
        icon: 'swap_horiz',
        action: () => this.openModalReasignar(),
        show: this.sePuedeCambiar() // Se evalúa cada vez que se abre el menú
      },
      {
        label: 'Declarar ganador',
        icon: 'emoji_events',
        action: () => this.asignarGanadorBrackets(),
        show: !this.existeGanador(),
        variant: 'warning'
      }
    ];
  }

  constructor(
    private _tournamentService: TournamentService,
    private viewerService: ViewerService,
    private _dialogService: DialogService,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit(): void {
    console.log(`✅ [${this.viewerId}] Componente inicializado`);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.torneoData) return;

    // Guardamos los participantes en el mapa para buscarlos rápido por id
    this.participantsMap.set(
      new Map(
        this.torneoData.miTorneoCategoria?.participants.map((p: any) => [
          p.bracket.id,
          p,
        ])
      )
    );

    this.bracketsManager = await this._tournamentService.createBracketsManager(this.viewerId, this.torneoData.miTorneoCategoria);
    this.viewerData = await this._tournamentService.getViewerData(this.bracketsManager);

    console.log(`⚙️ [${this.viewerId}] Inicializando visor... `, this.viewerData);

    // Inicializamos el visor y escuchamos eventos de selección de matches
    const matchActionObservable = await this.viewerService.initializeViewer(
      this.viewerId,
      this.viewerData.viewerRender
    );

    matchActionObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (message: IResponseSelectMatch) => {
        // 🔔 Log único para cuando llega un mensaje
        console.log(`[${this.viewerId}] 📩 Acción recibida:`, message);
        this.handleMatchAction(message);
      },
      error: (err) => {
        console.error(`[${this.viewerId}] ❌ Error al recibir mensaje:`, err);
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
    this.openMenuOpciones(message);
  }

  private openMenuOpciones(message: IResponseSelectMatch) {
    this.menuTopLeft.x = message.coordinates.x + 'px';
    this.menuTopLeft.y = message.coordinates.y + 'px';

    // Abre el menú en la posición del clic
    this.styledMenu.openMenu();
  }

  async refreshRender() {
    if (!this.bracketsManager) {
      console.error(`[${this.viewerId}] ❌ bracketsManager es null, no se puede refrescar el visor.`);
      return;
    }

    this.viewerData = await this._tournamentService.getViewerData(this.bracketsManager);

    await this.viewerService.viewerRender(
      this.viewerId,
      this.viewerData?.viewerRender
    );
  }

  /**
   * Mapea el mensaje de respuesta a un item seleccionable
   */
  private mapItemSelect(message: IResponseSelectMatch): IItemBracketsSelect {
    const match = this.viewerData.viewerRender?.matches[message.idMatch];
    if (!match) {
      throw new Error(
        `Match con ID ${message.idMatch} no encontrado en los datos del torneo.`
      );
    }
    return {
      idOpponentClick: message.idOpponent,
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
      opponent: {
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
  openModalDetalleMatch(): void {
    const currentItem = this.itemBracketsSelect();
    if (!currentItem) return;

    const dialogData = {
      itemBracketsSelect: currentItem,
      torneoData: this.torneoData,
    };

    this._dialogService.open(
      DetalleMatchComponent,
      dialogData
    );
  }


  async asignarGanadorBrackets() {
    const idMatch = (this.itemBracketsSelect()?.match.id ?? 0).toString();
    let idOpponentWinner = (this.itemBracketsSelect()?.idOpponentClick ?? 0).toString();

    const matchId = parseInt(idMatch, 10);
    const opponentId = parseInt(idOpponentWinner, 10);

    await this.updateWinner(matchId, opponentId);

    /*
    setTimeout(async () => {
      console.log('reset');
      await this.bracketsManager?.reset.matchResults(matchId);
      await this.refreshRender();
    }, 5000)
    */
  }

  async updateWinner(matchId: number, opponentWinnerId: number) {

    if (this.bracketsManager) {

      const match = this.viewerData?.viewerRender.matches[matchId];

      let llave: any = { id: matchId };

      if (match?.opponent1?.id == opponentWinnerId) {
        llave['opponent1'] = { result: 'win' };
      }

      if (match?.opponent2?.id == opponentWinnerId) {
        llave['opponent2'] = { result: 'win' };
      }

      await this.bracketsManager?.update.match({
        id: matchId,
        opponent1: { result: 'win' }
      });

      await this.refreshRender();
    }

  }

  /**
   * Abre el modal para reasignar un competidor
   */
  openModalReasignar() {
    const data = {
      itemBracketsSelect: this.itemBracketsSelect(),
      torneoData: this.torneoData,
      viewerData: this.viewerData,
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
          console.log(`[${this.viewerId}] ❌ Reasignación cancelada`);
          return;
        }

        console.log(`[${this.viewerId}] 🔄 Reasignación result:`, nuevoOponente);
        this.reasignar(this.itemBracketsSelect()?.idOpponentClick, nuevoOponente);
      });
  }

  private async reasignar(idOponenteAnterior: IdOpponent, nuevoOponente: IParticipantCategoria) {

    const roundId = this.itemBracketsSelect()?.match?.round_id ?? 0;
    const matches = this.viewerData.viewerRender?.matches ?? [];
    const nuevoOponenteId = nuevoOponente.bracket.id;

    if (matches.length === 0) {
      return;
    }

    const matchesOponenteAnterior = matches.filter((m: any) => {
      const isRelevantRound = roundId === 0 || m.round_id >= roundId;
      return isRelevantRound && (m.opponent1?.id === idOponenteAnterior || m.opponent2?.id === idOponenteAnterior);
    });

    const matchesNuevoOponente = matches.filter((m: any) => {
      const isRelevantRound = roundId === 0 || m.round_id >= roundId;
      return isRelevantRound && (m.opponent1?.id === nuevoOponenteId || m.opponent2?.id === nuevoOponenteId);
    });

    if (!matchesOponenteAnterior || !matchesNuevoOponente) {
      return;
    }

    // Intercambiar IDs de los oponentes.
    matchesOponenteAnterior.forEach((item: any) => {
      this.intercambiarOponente(item, idOponenteAnterior, nuevoOponenteId);
    })

    matchesNuevoOponente.forEach((item: any) => {
      this.intercambiarOponente(item, nuevoOponenteId, idOponenteAnterior);
    })

    if (this.torneoData?.miTorneoCategoria) {
      this.bracketsManager = await this._tournamentService.createBracketsManager(this.viewerId, this.torneoData.miTorneoCategoria, this.viewerData.viewerRender);
      this.refreshRender();
    }
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
