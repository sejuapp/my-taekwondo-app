import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IItemBracketsSelect } from '@app/interface/item-brackets-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { AllSharedImports } from '@app/shared/all-shared-imports';

@Component({
  selector: 'app-reasignar-competidor',
  imports: [...AllSharedImports],
  templateUrl: './reasignar-competidor.component.html',
  styleUrl: './reasignar-competidor.component.scss'
})
export class ReasignarCompetidorComponent {

  itemBracketsSelect: IItemBracketsSelect | null = null;
  torneoData: IGestionTorneoData | null = null;

  constructor(
    public dialogRef: MatDialogRef<ReasignarCompetidorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemBracketsSelect = data.itemBracketsSelect;
    this.torneoData = data.torneoData;
  }


  cerrar(): void {
    console.log("cerrando con ABRIR");
  this.dialogRef.close("ABRIR");
  }

}
