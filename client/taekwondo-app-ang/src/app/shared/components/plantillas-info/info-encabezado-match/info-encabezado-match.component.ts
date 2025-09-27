import { Component, computed, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { IItemBracketsSelect, IOpponentBracketSelect } from '@app/interface/item-brackets-select';
import { AllSharedImports } from '@app/shared/all-shared-imports';

@Component({
  selector: 'app-info-encabezado-match',
  imports: [...AllSharedImports],
  templateUrl: './info-encabezado-match.component.html',
  styleUrl: './info-encabezado-match.component.scss',
})
export class InfoEncabezadoMatchComponent {
  @Input() itemBracketsSelect = signal<IItemBracketsSelect | null>(null);
  @Output() cambiarCompetidor = new EventEmitter<IOpponentBracketSelect | null>();


  opponentClick = signal<IOpponentBracketSelect | null>(null);

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  existeGanador = computed(() => {
    const match = this.itemBracketsSelect()?.match;
    if (!match) return false;

    return Boolean(match.opponent1?.result || match.opponent2?.result);
  });

  sePuedeCambiar = computed(() => {
    const opponentClick = this.opponentClick();
    if (!opponentClick) return false;

    return Boolean(opponentClick?.participant);
  });

  obtenerNombreYClub(item: IOpponentBracketSelect): string {
    const nombre = item?.participant?.bracket?.name || 'No hay rival';
    const club = item?.participant?.persona.club || 'N/A';
    return `${nombre} <br> (${club})`;
  }

  isWinner(item: any): boolean {
    return (item?.match?.result || '').trim().toLowerCase() === 'win';
  }

  onMenuIconClick(pOpponentClick: IOpponentBracketSelect) {
    this.opponentClick.set(pOpponentClick);
  }

  onCambiarCompetidor() {
    this.cambiarCompetidor.emit(this.opponentClick());
  }

}
