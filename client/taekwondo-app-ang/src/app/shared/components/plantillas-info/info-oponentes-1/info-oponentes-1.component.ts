import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPersonaCategoria } from '@app/interface/request/info-torneo-categoria';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'app-info-oponentes-1',
  imports: [MatIconModule, CommonModule],
  templateUrl: './info-oponentes-1.component.html',
  styleUrl: './info-oponentes-1.component.scss'
})
export class InfoOponentes1Component {
  @Input() persona: IPersonaCategoria | null = null;

  constructor(public _helperService : HelperService) {}

}
