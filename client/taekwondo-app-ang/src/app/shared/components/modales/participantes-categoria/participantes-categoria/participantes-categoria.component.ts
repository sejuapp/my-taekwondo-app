import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getEdad } from '@app/core/utils';
import { IParticipantCategoria } from '@app/interface/request/info-torneo-categoria';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { CloseModalButtonComponent } from '@app/shared/components/modales/buttons/close-modal-button/close-modal-button.component';

@Component({
  selector: 'app-participantes-categoria',
  imports: [...AllSharedImports, CloseModalButtonComponent],
  templateUrl: './participantes-categoria.component.html',
  styleUrl: './participantes-categoria.component.scss',
})
export class ParticipantesCategoriaComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  torneoData: IGestionTorneoData | null = null;

  displayedColumns: string[] = [
    'competidor',
    'cinturon',
    'peso',
    'altura',
    'edad',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  constructor(
    public dialogRef: MatDialogRef<ParticipantesCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.torneoData = data.torneoData;
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
    const participants: IParticipantCategoria[] = this.torneoData?.miTorneoCategoria?.participants ?? [];

    console.log('participants ::> ', participants);

    this.dataSource.data = participants; // Cambiado de crear nuevo MatTableDataSource a asignar data

    // Si el sort ya existe, reasignarlo
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  getEdad(fechaNacimiento: string | null): number {
    return getEdad(fechaNacimiento);
  }
}
