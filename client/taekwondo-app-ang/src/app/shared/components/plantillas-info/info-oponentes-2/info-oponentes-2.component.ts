// info-oponentes-2.component.ts
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IOpponentBracketSelect } from '@app/interface/item-brackets-select';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { HelperService } from '@app/services/helper.service';
import { getEdad } from '@app/core/utils';

interface OpponentDataRow {
  icon: string;
  label: string;
  op1: string | number | null;
  op2: string | number | null;
}

@Component({
  selector: 'app-info-oponentes-2',
  imports: [...AllSharedImports],
  templateUrl: './info-oponentes-2.component.html',
  styleUrl: './info-oponentes-2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoOponentes2Component implements OnChanges {
  @Input() customOpponents: IOpponentBracketSelect[] = [];

  readonly displayedColumns = ['op1T', 'op2T'] as const;
  readonly MAX_OPPONENTS = 2;

  private readonly DATA_TEMPLATE: OpponentDataRow[] = [
    { icon: 'sports_martial_arts', label: 'Cinturon', op1: null, op2: null },
    { icon: 'monitor_weight', label: 'Peso', op1: null, op2: null },
    { icon: 'height', label: 'Altura', op1: null, op2: null },
    { icon: 'calendar_month', label: 'Edad', op1: null, op2: null },
  ];

  private readonly COMPLEMENTOS: ReadonlyMap<string, string> = new Map([
    ['peso', 'kg'],
    ['altura', 'cm'],
  ]);

  dataSource: OpponentDataRow[] = [];

  constructor(private readonly _helperService: HelperService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customOpponents']?.currentValue?.length > 0) {
      this.procesarOpponentes();
    }
  }

  private procesarOpponentes(): void {
    const data = this.DATA_TEMPLATE.map((row) => ({ ...row }));

    this.customOpponents.slice(0, this.MAX_OPPONENTS).forEach((op, index) => {
      const llave = `op${index + 1}` as 'op1' | 'op2';
      const persona = op?.participant?.persona;

      if (persona) {
        data[0][llave] = persona.cinturon ?? null;
        data[1][llave] = persona.peso ?? null;
        data[2][llave] = persona.altura ?? null;
        data[3][llave] = getEdad(
          persona.fechaNacimiento ?? null
        );
      }
    });

    this.dataSource = data;
  }

  validarComplemento(label: string): string {
    return this.COMPLEMENTOS.get(label.toLowerCase()) ?? '';
  }

  isCinturonLabel(label: string): boolean {
    return label.toLowerCase() === 'cinturon';
  }

  getCinturonClass(value: string | number | null): string {
    return value ? `cinturon-${String(value).toLowerCase()}` : '';
  }
}
