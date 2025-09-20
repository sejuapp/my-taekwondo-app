import { AfterViewInit, Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IItemBracketsSelect } from '@app/interface/item-brackets-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { AccionCompetidorEnum } from '@app/shared/enum/accion-competidor.enum';

@Component({
  selector: 'app-opciones-seleccion',
  imports: [...AllSharedImports],
  templateUrl: './opciones-seleccion.component.html',
  styleUrl: './opciones-seleccion.component.scss',
})
export class OpcionesSeleccionComponent implements AfterViewInit {

  itemBracketsSelect: IItemBracketsSelect | null = null;
  torneoData: IGestionTorneoData | null = null;

  existeGanador = signal<boolean>(true);

  constructor(
    public dialogRef: MatDialogRef<OpcionesSeleccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemBracketsSelect = data.itemBracketsSelect;
    this.torneoData = data.torneoData;
  }
  async ngAfterViewInit(): Promise<void> {
    this.validarExisteGanador();
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

  onCambiarCompetidor() {
    this.dialogRef.close(AccionCompetidorEnum.CAMBIAR);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
