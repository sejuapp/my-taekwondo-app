import {
  AfterViewInit,
  Component,
  Inject,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getEdad } from '@app/core/utils';
import { IItemBracketsSelect } from '@app/interface/item-brackets-select';
import { IParticipantCategoria } from '@app/interface/request/info-torneo-categoria';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { MessageService } from '@app/services/message/message.service';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { CloseModalButtonComponent } from '@app/shared/components/modales/buttons/close-modal-button/close-modal-button.component';
import { InfoOponentes1Component } from '@app/shared/components/plantillas-info/info-oponentes-1/info-oponentes-1.component';
import { IdOpponent } from '@app/type/type-brackets';

@Component({
  selector: 'app-reasignar-competidor',
  imports: [...AllSharedImports, InfoOponentes1Component, CloseModalButtonComponent],
  templateUrl: './reasignar-competidor.component.html',
  styleUrl: './reasignar-competidor.component.scss',
})
export class ReasignarCompetidorComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  itemBracketsSelect: IItemBracketsSelect | null;
  torneoData: IGestionTorneoData | null;
  idOpponentAntiguo: IdOpponent;

  viewerData: any = null;

  private participantsMap = new Map<IdOpponent, any>();

  competidorAntiguo: IParticipantCategoria | null = null;

  displayedColumns: string[] = [
    'competidor',
    'cinturon',
    'peso',
    'altura',
    'edad',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  constructor(
    private _messageService: MessageService,
    public dialogRef: MatDialogRef<ReasignarCompetidorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemBracketsSelect = data.itemBracketsSelect;
    this.torneoData = data.torneoData;
    this.viewerData = data.viewerData;

    this.idOpponentAntiguo = this.itemBracketsSelect?.idOpponentClick;

    // Crear el mapa solo una vez
    this.participantsMap = new Map(
      this.torneoData?.miTorneoCategoria?.participants.map((p: any) => [
        p.bracket.id,
        p,
      ])
    );

    //Obtenemos el competidor a cambiar
    this.competidorAntiguo =
      this.participantsMap.get(this.idOpponentAntiguo) ?? null;

    this.darTabla();
  }

  ngAfterViewInit() {
    // Asignar el sort después de que la vista se haya inicializado
    this.dataSource.sort = this.sort;

    // Configurar sortingDataAccessor personalizado para manejar propiedades anidadas
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'peso':
          return Number(item?.persona?.peso) || 0;
        case 'altura':
          return Number(item?.persona?.altura) || 0;
        case 'edad':
          return this.getEdad(item?.persona?.fechaNacimiento ?? null);
        default:
          return item[property];
      }
    };

    // Configurar ordenamiento por defecto: peso descendente después del ciclo de detección de cambios
    setTimeout(() => {
      this.sort.active = 'peso';
      this.sort.direction = 'desc';
      this.dataSource.sort = this.sort;
    });
  }

  darTabla() {
    const roundId = this.itemBracketsSelect?.match.round_id;
    const matches: any[] = this.viewerData?.viewerRender?.matches ?? [];

    console.log('matches ::> ', matches);

    const data = matches
      .filter((m) => m.round_id === roundId)
      .filter((m) => !m.opponent1?.result || !m.opponent2?.result)
      .flatMap((m) => [m.opponent1?.id, m.opponent2?.id])
      .filter((id): id is number => !!id && id !== this.idOpponentAntiguo)
      .map((id) => this.participantsMap.get(id))
      .filter(Boolean);

    this.dataSource.data = data; // Cambiado de crear nuevo MatTableDataSource a asignar data

    // Si el sort ya existe, reasignarlo
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  async onCambiarCompetidor(item: IParticipantCategoria) {
    const dataMesagge = `
        ¿Estás seguro de realizar el siguiente cambio? <br><br>

        <strong>${this.competidorAntiguo?.bracket?.name}</strong>
        <br><br> Por <br><br>
        <strong>${item?.bracket?.name}</strong>
        <br>
      `;

    const confirmacion = await this._messageService.confirmarMensaje(
      dataMesagge,
      'question'
    );

    if (confirmacion) {
      console.log('Cambiar por ->', item);
      this.dialogRef.close(item);
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  getEdad(fechaNacimiento: string | null): number {
    return getEdad(fechaNacimiento);
  }
}
