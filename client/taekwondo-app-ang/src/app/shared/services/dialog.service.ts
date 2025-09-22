import { Injectable, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BASE_DIALOG_CONFIG } from 'src/global-dialog-config';

@Injectable({ providedIn: 'root' })
export class DialogService {

  constructor(private dialog: MatDialog) { }

  // método de apertura que combina data común + data específica
  open(component: any, extraData: any = {}, config: MatDialogConfig = {}) {
    const dialogRef = this.dialog.open(component, {
      ...BASE_DIALOG_CONFIG,
      ...config,
      data: {
        ...extraData
      }
    });

    return dialogRef;
  }
}
