import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

export interface MenuOption {
  label: string;
  icon: string;
  action: () => void;
  show?: boolean;
  variant?: 'default' | 'warning' | 'success' | 'danger';
}

@Component({
  selector: 'app-mat-menu-styled',
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './mat-menu-styled.component.html',
  styleUrl: './mat-menu-styled.component.scss'
})
export class MatMenuStyledComponent {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  @Input() options: MenuOption[] = [];

  @Input() yPosition: string = "0px";
  @Input() xPosition: string = "0px";

  openMenu() {
    this.menuTrigger.openMenu();
  }

  closeMenu() {
    this.menuTrigger.closeMenu();
  }

}
