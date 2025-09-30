import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
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

  obtenerNombreYClub(item: IOpponentBracketSelect): string {
    const nombre = item?.participant?.bracket?.name || 'No hay rival';

    const nombreClub = item?.participant?.persona.club ?? '';
    const club = nombreClub ? `(${nombreClub})` : '&nbsp;';
    return `${nombre} <br> ${club}`;
  }

  isWinner(item: IOpponentBracketSelect): boolean {
    return (item?.opponent?.result || '').trim().toLowerCase() === 'win';
  }

}
