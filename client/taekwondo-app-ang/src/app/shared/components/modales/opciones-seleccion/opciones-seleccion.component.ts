import {
  AfterViewInit,
  Component,
  computed,
  Inject,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IItemBracketsSelect,
  IOpcionSeleccionar,
  IOpponentBracketSelect,
} from '@app/interface/item-brackets-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { AccionCompetidorEnum } from '@app/shared/enum/accion-competidor.enum';

@Component({
  selector: 'app-opciones-seleccion',
  imports: [...AllSharedImports],
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

  onCambiarCompetidor(oponente: IOpponentBracketSelect) {
    const data: IOpcionSeleccionar = {
      accion: AccionCompetidorEnum.CAMBIAR,
      idOpponent: oponente.match.id,
    };
    this.dialogRef.close(data);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
