import { Component, computed, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IItemBracketsSelect, IOpcionSeleccionar, IOpponentBracketSelect } from '@app/interface/item-brackets-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { InfoEncabezadoMatchComponent } from '@app/shared/components/plantillas-info/info-encabezado-match/info-encabezado-match.component';
import { InfoOponentes2Component } from '@app/shared/components/plantillas-info/info-oponentes-detalle/info-oponentes-detalle.component';
import { AccionCompetidorEnum } from '@app/shared/enum/accion-competidor.enum';

@Component({
  selector: 'app-detalle-match',
  imports: [
      ...AllSharedImports,
      InfoOponentes2Component,
      InfoEncabezadoMatchComponent,
    ],
  templateUrl: './detalle-match.component.html',
  styleUrl: './detalle-match.component.scss'
})
export class DetalleMatchComponent {
  itemBracketsSelect = signal<IItemBracketsSelect | null>(null);
  torneoData = signal<IGestionTorneoData | null>(null);

  constructor(
    public dialogRef: MatDialogRef<DetalleMatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemBracketsSelect.set(data.itemBracketsSelect);
    this.torneoData.set(data.torneoData);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  // Para clases de resultado
  getResultClass(result: string | null): string {
    switch (result?.toLowerCase()) {
      case 'victoria':
      case 'win':
        return 'result-win';
      case 'derrota':
      case 'loss':
        return 'result-loss';
      case 'empate':
      case 'draw':
        return 'result-draw';
      default:
        return 'result-pending';
    }
  }
}
