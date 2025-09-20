import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllSharedImports } from '@app/shared/all-shared-imports';

@Component({
  selector: 'app-reasignar-competidor',
  imports: [...AllSharedImports],
  templateUrl: './reasignar-competidor.component.html',
  styleUrl: './reasignar-competidor.component.scss'
})
export class ReasignarCompetidorComponent {

  constructor(
    public dialogRef: MatDialogRef<ReasignarCompetidorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  cerrar(): void {
    this.dialogRef.close();
  }

}
