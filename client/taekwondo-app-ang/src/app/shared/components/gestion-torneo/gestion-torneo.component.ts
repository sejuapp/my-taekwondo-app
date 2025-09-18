import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  IItemBracketsSelect,
  IOpponentBracketSelect,
} from '@app/interface/item-brackets-select';
import { IResponseSelectMatch } from '@app/interface/response-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { ViewerService } from '@app/services/viewer-service';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { Subscription } from 'rxjs'; // Necesitamos Subscription para gestionar la desuscripción

@Component({
  selector: 'app-gestion-torneo',
  imports: [...AllSharedImports], // Asegúrate de incluir los imports necesarios
  templateUrl: './gestion-torneo.component.html',
  styleUrl: './gestion-torneo.component.scss',
})
export class GestionTorneoComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  @Input() torneoId: number | string = 'bracket-default';
  @Input() torneoData: IGestionTorneoData | null = null;
  private viewerSubscription: Subscription | null = null;

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  menuTopLeft = { x: '0px', y: '0px' };

  itemBracketsSelect: IItemBracketsSelect | null = null;

  constructor(
    private viewerService: ViewerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(
      `GestionTorneoComponent para ID ${this.torneoId} inicializado.`
    );
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.torneoData) {
      console.log(`[${this.torneoId}] Inicializando visor...`);

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

          this.menuTopLeft.x = message.coordinates.x + 'px';
          this.menuTopLeft.y = message.coordinates.y + 'px';

          // Abre el menú en la posición del clic
          this.menuTrigger.openMenu();
          //this.abrirDialog();

          const matchSeleccionado =
            this.torneoData?.viewerData?.matches[Number(message.match.id)];
          /*
          matchSeleccionado.opponent1.id = 7;
          matchSeleccionado.opponent1.position = 1;

          matchSeleccionado.opponent2.id = 55;
          matchSeleccionado.opponent2.position = 2;
          */

          await this.viewerService.viewerRender(
            this.torneoId,
            this.torneoData?.viewerData
          );
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

  mapItemSelect(message: IResponseSelectMatch): IItemBracketsSelect {
    const NOMBRE_SIN_ASIGNACION = 'Sin asignar';

    const opponent1Id = message.match.opponent1?.id;
    const opponent2Id = message.match.opponent2?.id;

    const p1Name =
      this.torneoData?.dataCreate.participants.find(
        (p: any) => p.id === opponent1Id
      )?.name ?? NOMBRE_SIN_ASIGNACION;

    const p2Name =
      this.torneoData?.dataCreate.participants.find(
        (p: any) => p.id === opponent2Id
      )?.name ?? NOMBRE_SIN_ASIGNACION;

    const op1: IOpponentBracketSelect = {
      id: opponent1Id,
      name: p1Name,
    };

    const op2: IOpponentBracketSelect = {
      id: opponent2Id,
      name: p2Name,
    };

    return {
      match: message.match,
      customOpponents: [
        op1,
        op2
      ]
    };
  }

  editMatch(): void {
    console.log('Editando partido:');
  }

  viewDetails(): void {
    console.log('Viendo detalles del partido:');
  }

  ngOnDestroy(): void {
    if (this.viewerSubscription) {
      this.viewerSubscription.unsubscribe();
    }
  }

  abrirDialog() {
    this.dialog.open(this.dialogTemplate, {
      position: {
        top: this.menuTopLeft.y,
        left: this.menuTopLeft.x,
      },
      //backdropClass: 'custom-backdrop', // opcional para personalizar fondo
      //panelClass: 'custom-dialog-panel' // opcional para estilos del cuadro
    });
  }

  onAsignarCompetidor(opponent: any, index: number) {
    console.log(`Oponente [${index + 1}] ->`, JSON.stringify(opponent, null, 2));
  }
}
