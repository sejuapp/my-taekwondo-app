import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IOpponentBracketSelect } from '@app/interface/item-brackets-select';
import { AllSharedImports } from '@app/shared/all-shared-imports';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'app-info-oponentes-2',
  imports: [...AllSharedImports],
  templateUrl: './info-oponentes-2.component.html',
  styleUrl: './info-oponentes-2.component.scss',
})
export class InfoOponentes2Component implements OnChanges {
  @Input() customOpponents: IOpponentBracketSelect[] = [];

  displayedColumns = ['op1T', 'op2T'];

  ELEMENT_DATA: any[] = [
    { icon: 'sports_martial_arts', label: 'Cinturon', op1: null, op2: null },
    { icon: 'monitor_weight', label: 'Peso', op1: null, op2: null },
    { icon: 'height', label: 'Altura', op1: null, op2: null },
    { icon: 'calendar_month', label: 'Edad', op1: null, op2: null },
  ];

  dataSource: any[] = [];

  constructor(private _helperService: HelperService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customOpponents'] && this.customOpponents?.length > 0) {
      this.procesarOpponentes();
    }
  }

  private procesarOpponentes(): void {

    this.customOpponents.forEach((op, index) => {
      const llave = `op${index + 1}`;
      if (index < 2) {
        this.ELEMENT_DATA[0][llave] = op?.participant?.persona?.cinturon ?? null;
        this.ELEMENT_DATA[1][llave] = op?.participant?.persona?.peso ?? '0';
        this.ELEMENT_DATA[2][llave] = op?.participant?.persona?.altura ?? '0';
        this.ELEMENT_DATA[3][llave] = this._helperService.getEdad(
          op?.participant?.persona?.fechaNacimiento ?? null
        );
      }
    });
    this.dataSource = [...this.ELEMENT_DATA];
  }

  validarComplemento(label: string): string {
    const complementos: Record<string, string> = {
      'peso': 'kg',
      'altura': 'cm'
    };

    return complementos[label.toLowerCase()] || '';
  }


}
