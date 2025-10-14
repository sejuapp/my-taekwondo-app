import { MatDialogConfig } from '@angular/material/dialog';

export const BASE_DIALOG_CONFIG: MatDialogConfig = {
  width: '95vw',       // ocupa el 95% del ancho de la pantalla
  maxWidth: '600px',   // pero nunca más ancho de 600px
  height: 'auto',      // ajusta la altura al contenido
  maxHeight: '90vh',   // nunca más alto que el 90% de la pantalla
  disableClose: true,
  autoFocus: false,
};
