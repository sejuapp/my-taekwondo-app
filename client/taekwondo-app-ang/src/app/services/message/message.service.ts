import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private stylesInjected = false;

  constructor() {
    this.injectStyles();
  }

  /** Inyecta estilos globales para SweetAlert2 una sola vez */
  private injectStyles() {
    if (this.stylesInjected) return;

    const style = document.createElement('style');
    style.textContent = `
      .popup-custom {
        font-size: 13px;
      }
    `;
    document.head.appendChild(style);

    this.stylesInjected = true;
  }

  private getCustomClass() {
    return { popup: 'popup-custom' };
  }

  private colorButton() {
    return {
      confirmButtonColor: "#4caf50",
      cancelButtonColor: "#c22418",
    }
  }

  private txtButton() {
    return {
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
    }
  }

  mostrarMensaje(
    mensaje: string,
    icon: 'warning' | 'error' | 'success' | 'info' | 'question',
    titulo?: string
  ) {
    return Swal.fire({
      title: titulo,
      html: mensaje,
      icon,
      ...this.txtButton(),
      ...this.colorButton(),
      allowOutsideClick: false,
      customClass: this.getCustomClass(),
    });
  }

  async confirmarMensaje(
    mensaje: string,
    icon: 'warning' | 'error' | 'success' | 'info' | 'question',
    titulo?: string
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: titulo,
      html: mensaje,
      icon,
      showCancelButton: true,
      ...this.txtButton(),
      ...this.colorButton(),
      allowOutsideClick: false,
      customClass: this.getCustomClass(),
    });

    return result.isConfirmed;
  }
}
