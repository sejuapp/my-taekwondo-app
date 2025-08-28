import { AfterViewInit, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ViewerService } from '@app/services/viewer-service';
import { Subscription } from 'rxjs'; // Necesitamos Subscription para gestionar la desuscripción

@Component({
  selector: 'app-gestion-torneo',
  imports: [], // Asegúrate de incluir los imports necesarios
  templateUrl: './gestion-torneo.component.html',
  styleUrl: './gestion-torneo.component.scss',
})
export class GestionTorneoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() torneoId: string = 'bracket-default';
  @Input() torneoData: any | null = null;
  private viewerSubscription: Subscription | null = null;

  constructor(private viewerService: ViewerService) {}

  ngOnInit(): void {
    console.log(`GestionTorneoComponent para ID ${this.torneoId} inicializado.`);
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.torneoData) {
      console.log(`[${this.torneoId}] Inicializando visor...`);
      // Espera a que el servicio devuelva el Observable
      const matchActionObservable = await this.viewerService.initializeViewer(this.torneoId, this.torneoData);

      // Suscribe la instancia actual del componente al Observable que le corresponde
      this.viewerSubscription = matchActionObservable.subscribe({
        next: (message: string) => {
          console.log(`[${this.torneoId}] Mensaje de acción recibido:`, message);
        },
        error: (err) => {
          console.error(`[${this.torneoId}] Error al recibir el mensaje del servicio:`, err);
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
