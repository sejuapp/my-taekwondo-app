import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { generateId } from '@app/core/utils';
import { IResponseSelectMatch } from '@app/interface/response-select';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { ViewerService } from '@app/services/brackets/viewer-service';
import { GestionTorneoComponent } from '@app/shared/components/gestion-torneo/gestion-torneo/gestion-torneo.component';

@Component({
  selector: 'app-gestion-contenedor',
  imports: [MatDividerModule, GestionTorneoComponent],
  templateUrl: './gestion-contenedor.component.html',
  styleUrl: './gestion-contenedor.component.scss',
})
export class GestionContenedorComponent implements OnInit, AfterViewInit {
  @Input() tournamentsData = signal<IGestionTorneoData[]>([]);
  messageClickMatch = signal<IResponseSelectMatch | null>(null);

  viewerContainerId: string = `bracket_container_${generateId()}`;

  constructor(
    private _viewerService: ViewerService,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit(): void {
    console.log(this.viewerContainerId);
  }

  async ngAfterViewInit(): Promise<void> {
    //Creamos el  observable de eventos de selección de match
    const matchActionObservable = await this._viewerService.initializeViewer(
      this.viewerContainerId
    );

    //Escuchamos eventos de selección de
    matchActionObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (message: IResponseSelectMatch) => {
        // 🔔 Log único para cuando llega un mensaje
        console.log(`[${this.viewerContainerId}] 📩 Acción recibida:`, message);
        this.messageClickMatch.set(message);
      },
      error: (err) => {
        console.error(`[${this.viewerContainerId}] ❌ Error al recibir mensaje:`, err);
      },
    });
  }
}
