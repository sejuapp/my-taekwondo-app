import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { IResponseSelectMatch } from '@app/interface/response-select';
import { ViewerService } from '@app/services/viewer-service';
import { Subscription } from 'rxjs'; // Necesitamos Subscription para gestionar la desuscripción

@Component({
  selector: 'app-gestion-torneo',
  imports: [], // Asegúrate de incluir los imports necesarios
  templateUrl: './gestion-torneo.component.html',
  styleUrl: './gestion-torneo.component.scss',
})
export class GestionTorneoComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() torneoId: string = 'bracket-default';
  @Input() torneoData: any | null = null;
  private viewerSubscription: Subscription | null = null;

  constructor(private viewerService: ViewerService) { }

  ngOnInit(): void {
    console.log(
      `GestionTorneoComponent para ID ${this.torneoId} inicializado.`
    );
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.torneoData) {
      console.log(`[${this.torneoId}] Inicializando visor...`);

      // Espera a que el servicio devuelva el Observable
      const matchActionObservable = await this.viewerService.initializeViewer(
        this.torneoId,
        this.torneoData.viewerData
      );

      // Suscribe la instancia actual del componente al Observable que le corresponde
      this.viewerSubscription = matchActionObservable.subscribe({
        next: async (message: IResponseSelectMatch) => {
          console.log(
            `[${this.torneoId}] Mensaje de acción recibido:`,
            message
          );

          const matchSeleccionado = this.torneoData.viewerData.matches[message.match.id];
          matchSeleccionado.opponent1.id = 7;
          matchSeleccionado.opponent1.position = 1;

          matchSeleccionado.opponent2.id = 55;
          matchSeleccionado.opponent2.position = 2;

          await this.viewerService.viewerRender(this.torneoId, this.torneoData.viewerData);


        },
        error: (err) => {
          console.error(
            `[${this.torneoId}] Error al recibir el mensaje del servicio:`,
            err
          );
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.viewerSubscription) {
      this.viewerSubscription.unsubscribe();
    }
  }
}
