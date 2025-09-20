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
import { Subscription } from 'rxjs'; // Necesitamos Subscription para gestionar la desuscripción
import { ReasignarCompetidorComponent } from '@app/shared/components/modales/reasignar-competidor/reasignar-competidor.component';

@Component({
  selector: 'app-gestion-torneo',
  imports: [...AllSharedImports], // Asegúrate de incluir los imports necesarios
  templateUrl: './gestion-torneo.component.html',
  styleUrl: './gestion-torneo.component.scss',
})
export class GestionTorneoComponent
  implements OnInit, AfterViewInit, OnDestroy {
  NOMBRE_SIN_ASIGNACION = 'Sin asignar';

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  private dialogRef?: MatDialogRef<ReasignarCompetidorComponent>;

  @Input() torneoId: number | string = 'bracket-default';
  @Input() torneoData: IGestionTorneoData | null = null;
  private viewerSubscription: Subscription | null = null;

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  menuTopLeft = { x: '0px', y: '0px' };

  itemBracketsSelect: IItemBracketsSelect | null = null;

  participantsMap: Map<any, any> = new Map<number, any>();

  existeGanador = signal<boolean>(true);

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
          this.validarExisteGanador();

          this.menuTopLeft.x = message.coordinates.x + 'px';
          this.menuTopLeft.y = message.coordinates.y + 'px';

          // Abre el menú en la posición del clic
          this.menuTrigger.openMenu();
          //this.abrirDialog();

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
      result: message.match.opponent1?.result ?? null
    };

    const op2: IOpponentBracketSelect = {
      id: message.match.opponent2?.id,
      name: this.getOpponentName(message.match.opponent2?.id),
      result: message.match.opponent2?.result ?? null
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

  validarExisteGanador() {
    const c1 = this.itemBracketsSelect?.match.opponent1?.result ?? '';
    const c2 = this.itemBracketsSelect?.match.opponent2?.result ?? '';

    const validacion = c1 != '' || c2 != '';

    this.existeGanador.set(validacion);

  }

  onAsignarCompetidor(opponent: any, index: number) {
    console.log(
      `Oponente [${index + 1}] ->`,
      JSON.stringify(opponent, null, 2)
    );
  }

  onCambiarCompetidor(opponent: any, index: number) {
    this.console(opponent);

    this.dialogRef = this.dialog.open(ReasignarCompetidorComponent, {
      width: '90vw',       // ocupa el 90% del ancho de la pantalla
      maxWidth: '600px',   // pero nunca más ancho de 600px
      height: 'auto',      // ajusta la altura al contenido
      maxHeight: '90vh',   // nunca más alto que el 90% de la pantalla
      disableClose: true,
      data: {
        usuario: 'Juan Pérez',
        materias: ['Matemáticas', 'Lengua', 'Historia', 'Ciencias', 'Matemáticas', 'Lengua', 'Historia', 'Ciencias', 'Matemáticas', 'Lengua', 'Historia', 'Ciencias', 'Matemáticas', 'Lengua', 'Historia', 'Ciencias', 'Matemáticas', 'Lengua', 'Historia', 'Ciencias', 'Matemáticas', 'Lengua', 'Historia', 'Ciencias', 'Matemáticas', 'Lengua', 'Historia', 'Ciencias']
      }
    });

    this.dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        console.log('resultado ::> ', resultado);
      }
    });
  }

  close(): void {
    this.dialogRef?.close();
  }

  console(data: any) {
    console.log(
      `Data ->`,
      JSON.stringify(data, null, 2)
    );
  }
}
