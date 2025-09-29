import { Component, computed, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IItemBracketsSelect,
  IOpcionSeleccionar,
  IOpponentBracketSelect,
} from '@app/interface/item-brackets-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { InfoEncabezadoMatchComponent } from '@app/shared/components/plantillas-info/info-encabezado-match/info-encabezado-match.component';
import { InfoOponentes2Component } from '@app/shared/components/plantillas-info/info-oponentes-2/info-oponentes-2.component';
import { AccionCompetidorEnum } from '@app/shared/enum/accion-competidor.enum';

@Component({
  selector: 'app-opciones-seleccion',
  imports: [
    ...AllSharedImports,
    InfoOponentes2Component,
    InfoEncabezadoMatchComponent,
  ],
  templateUrl: './opciones-seleccion.component.html',
  styleUrl: './opciones-seleccion.component.scss',
})
export class OpcionesSeleccionComponent {
  itemBracketsSelect = signal<IItemBracketsSelect | null>(null);
  torneoData = signal<IGestionTorneoData | null>(null);

  existeGanador = computed(() => {
    const match = this.itemBracketsSelect()?.match;
    if (!match) return false;

    return Boolean(match.opponent1?.result || match.opponent2?.result);
  });

  constructor(
    public dialogRef: MatDialogRef<OpcionesSeleccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemBracketsSelect.set(data.itemBracketsSelect);
    this.torneoData.set(data.torneoData);
  }

  onCambiarCompetidor(opponentBracketSelect: IOpponentBracketSelect | null): void {
    if (!opponentBracketSelect) return;

    const data: IOpcionSeleccionar = {
      accion: AccionCompetidorEnum.CAMBIAR,
      dataSeleccion: {
        idOpponentAnterior: opponentBracketSelect.opponent.id,
      }
    };
    this.dialogRef.close(data);
  }

  onDeclararGanador(opponentBracketSelect: IOpponentBracketSelect | null): void {
    if (!opponentBracketSelect) return;

    const data: IOpcionSeleccionar = {
      accion: AccionCompetidorEnum.ASIGNAR_GANADOR,
      dataSeleccion : {
        idOpponentWinner : opponentBracketSelect.opponent.id
      }
    };
    this.dialogRef.close(data);
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
