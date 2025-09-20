import { Id } from 'brackets-model';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  signal,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  IItemBracketsSelect,
  IOpponentBracketSelect,
} from '@app/interface/item-brackets-select';
import { IResponseSelectMatch } from '@app/interface/response-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { ViewerService } from '@app/services/viewer-service';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { Subscription } from 'rxjs';
import { OpcionesSeleccionComponent } from '@app/shared/components/modales/opciones-seleccion/opciones-seleccion.component';
import { BASE_DIALOG_CONFIG } from 'src/global-dialog-config';
import { DialogService } from '@app/shared/services/dialog.service';
import { AccionCompetidorEnum } from '@app/shared/enum/accion-competidor.enum';
import { ReasignarCompetidorComponent } from '@app/shared/components/modales/reasignar-competidor/reasignar-competidor.component';

@Component({
  selector: 'app-gestion-torneo',
  imports: [...AllSharedImports],
  templateUrl: './gestion-torneo.component.html',
  styleUrl: './gestion-torneo.component.scss',
})
export class GestionTorneoComponent
  implements OnInit, AfterViewInit, OnDestroy {
  NOMBRE_SIN_ASIGNACION = 'Sin asignar';

  @Input() torneoId: number | string = 'bracket-default';
  @Input() torneoData: IGestionTorneoData | null = null;
  private viewerSubscription: Subscription | null = null;

  itemBracketsSelect: IItemBracketsSelect | null = null;

  participantsMap: Map<any, any> = new Map<number, any>();

  constructor(
    private viewerService: ViewerService,
    private dialog: MatDialog,
    private _dialogService: DialogService
  ) { }

  ngOnInit(): void {
    console.log(
      `GestionTorneoComponent para ID ${this.torneoId} inicializado.`
    );
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.torneoData) {
      console.log(`[${this.torneoId}] Inicializando visor...`);

      this.participantsMap = new Map(
        this.torneoData.dataCreate.participants.map((p: any) => [p.id, p])
      );

      // Espera a que el servicio devuelva el Observable
      const matchActionObservable = await this.viewerService.initializeViewer(
        this.torneoId,
        this.torneoData.viewerData
      );

      // Suscribe la instancia actual del componente al Observable que le corresponde
      this.viewerSubscription = matchActionObservable.subscribe({
        next: async (message: IResponseSelectMatch) => {
          console.log(
            `[${this.torneoId}] Mensaje de acción recibido:`,
            message
          );

          this.itemBracketsSelect = this.mapItemSelect(message);

          this.onOpcionesSeleccion();

          const matchSeleccionado =
            this.torneoData?.viewerData?.matches[Number(message.match.id)];

          //await this.refrescarRender();
        },
        error: (err) => {
          console.error(
            `[${this.torneoId}] Error al recibir el mensaje del servicio:`,
            err
          );
        },
      });
    }
  }

  async refrescarRender() {
    await this.viewerService.viewerRender(
      this.torneoId,
      this.torneoData?.viewerData
    );
  }

  mapItemSelect(message: IResponseSelectMatch): IItemBracketsSelect {
    const op1: IOpponentBracketSelect = {
      id: message.match.opponent1?.id,
      name: this.getOpponentName(message.match.opponent1?.id),
      result: message.match.opponent1?.result ?? null,
    };

    const op2: IOpponentBracketSelect = {
      id: message.match.opponent2?.id,
      name: this.getOpponentName(message.match.opponent2?.id),
      result: message.match.opponent2?.result ?? null,
    };

    return {
      match: message.match,
      customOpponents: [op1, op2],
    };
  }

  getOpponentName(opponentId: any): string {
    return opponentId
      ? this.participantsMap.get(opponentId)?.name ?? this.NOMBRE_SIN_ASIGNACION
      : this.NOMBRE_SIN_ASIGNACION;
  }

  ngOnDestroy(): void {
    if (this.viewerSubscription) {
      this.viewerSubscription.unsubscribe();
    }
  }

  console(data: any) {
    console.log(`Data ->`, JSON.stringify(data, null, 2));
  }

  onOpcionesSeleccion() {

    const data = {
      itemBracketsSelect: this.itemBracketsSelect,
      torneoData: this.torneoData
    }

    const dialogRef = this._dialogService.open(OpcionesSeleccionComponent, data);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (AccionCompetidorEnum.CAMBIAR == result) {
          this.openModalCambiar();
        }
      }
    });

  }

  openModalCambiar() {

    const data = {
      itemBracketsSelect: this.itemBracketsSelect,
      torneoData: this.torneoData
    }

    const dialogRef = this._dialogService.open(ReasignarCompetidorComponent, data);

    dialogRef.afterClosed().subscribe(result => {
       if (result === 'ABRIR') {
      this.onOpcionesSeleccion(); // <- reabrir la primera modal
    }
    });
  }
}
