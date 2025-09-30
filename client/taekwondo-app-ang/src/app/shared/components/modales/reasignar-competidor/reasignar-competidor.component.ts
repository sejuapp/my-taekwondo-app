import { Component, Inject, computed, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IItemBracketsSelect } from '@app/interface/item-brackets-select';
import { IParticipantCategoria } from '@app/interface/request/info-torneo-categoria';
import { IGestionTorneoData } from '@app/interface/torneo-data';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { IdOpponent } from '@app/type/type-brackets';

@Component({
  selector: 'app-reasignar-competidor',
  imports: [...AllSharedImports],
  templateUrl: './reasignar-competidor.component.html',
  styleUrl: './reasignar-competidor.component.scss',
})
export class ReasignarCompetidorComponent {
  itemBracketsSelect: IItemBracketsSelect | null;
  torneoData: IGestionTorneoData | null;
  idOpponentAntiguo: IdOpponent;

  viewerData: any = null;

  private participantsMap = new Map<IdOpponent, any>();

  competidorAntiguo = computed(
    () => this.participantsMap.get(this.idOpponentAntiguo) ?? null
  );

  competidoresRonda = computed(() => {
    const roundId = this.itemBracketsSelect?.match.round_id;
    const matches : any[] = this.viewerData?.viewerRender?.matches ?? [];

    return matches
      .filter((m) => m.round_id === roundId)
      .flatMap((m) => [m.opponent1?.id, m.opponent2?.id])
      .filter((id): id is number => !!id && id !== this.idOpponentAntiguo)
      .map((id) => this.participantsMap.get(id))
      .filter(Boolean);
  });

  constructor(
    public dialogRef: MatDialogRef<ReasignarCompetidorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Data recibida en modal ->', data);
    this.itemBracketsSelect = data.itemBracketsSelect;
    this.torneoData = data.torneoData;
    this.viewerData = data.viewerData;

     this.idOpponentAntiguo = this.itemBracketsSelect?.idOpponentClick;

    // Crear el mapa solo una vez
    this.participantsMap = new Map(
      this.torneoData?.miTorneoCategoria?.participants.map((p: any) => [p.bracket.id, p])
    );
  }

  onCambiarCompetidor(item: IParticipantCategoria) {
    console.log('Cambiar por ->', item);
    this.dialogRef.close(item);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
