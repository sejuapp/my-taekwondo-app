import { AfterViewInit, Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IItemBracketsSelect } from '@app/interface/item-brackets-select';
import { AllSharedImports } from '@app/shared/all-shared-imports';

@Component({
  selector: 'app-opciones-seleccion',
  imports: [...AllSharedImports],
  templateUrl: './opciones-seleccion.component.html',
  styleUrl: './opciones-seleccion.component.scss',
})
export class OpcionesSeleccionComponent implements AfterViewInit {
  itemBracketsSelect: IItemBracketsSelect | null = null;

  existeGanador = signal<boolean>(true);

  constructor(
    public dialogRef: MatDialogRef<OpcionesSeleccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemBracketsSelect = data.itemBracketsSelect;
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

  onCambiarCompetidor(opponent: any, index: number) {
    /*
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
    */
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
