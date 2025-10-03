import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-overlay">
      <div class="spinner-container">
        <img src="/assets/preloader.svg" alt="Cargando..." class="spinner-img" />
        <p>{{ mensaje }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(3px);
    }

    .spinner-container {
      text-align: center;
      color: white;
    }

    .spinner-img {
      width: 60px;
      height: 60px;
      margin-bottom: 20px;
    }

    p {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
class LoadingSpinnerComponent {
  mensaje: string = 'Por favor espera...';
}

@Injectable({ providedIn: 'root' })
export class LoadingBackdropService {
  private componentRef: any = null;

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  show(mensaje?: string) {
    if (this.componentRef) return;

    this.componentRef = createComponent(LoadingSpinnerComponent, {
      environmentInjector: this.injector
    });

    if (mensaje) this.componentRef.instance.mensaje = mensaje;

    this.appRef.attachView(this.componentRef.hostView);
    document.body.appendChild(this.componentRef.location.nativeElement);
  }

  hide() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
