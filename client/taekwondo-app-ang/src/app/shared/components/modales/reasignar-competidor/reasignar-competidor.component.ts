import { Component, Inject, computed, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IItemBracketsSelect } from '@app/interface/item-brackets-select';
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
  idOpponent: IdOpponent;

  private participantsMap = new Map<IdOpponent, any>();

  competidorAntiguo = computed(
    () => this.participantsMap.get(this.idOpponent) ?? null
  );

  competidoresRonda = computed(() => {
    const roundId = this.itemBracketsSelect?.match.round_id;
    const matches = this.torneoData?.viewerData?.matches ?? [];

    return matches
      .filter((m) => m.round_id === roundId)
      .flatMap((m) => [m.opponent1?.id, m.opponent2?.id])
      .filter((id): id is number => !!id && id !== this.idOpponent)
      .map((id) => this.participantsMap.get(id))
      .filter(Boolean);
  });

  constructor(
    public dialogRef: MatDialogRef<ReasignarCompetidorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemBracketsSelect = data.itemBracketsSelect;
    this.torneoData = data.torneoData;
    this.idOpponent = data.idOpponent;

    // Crear el mapa solo una vez
    this.participantsMap = new Map(
      this.torneoData?.miTorneo?.participants.map((p: any) => [p.bracket.id, p])
    );
  }

  cerrar(): void {
    this.dialogRef.close('ABRIR');
  }
}
