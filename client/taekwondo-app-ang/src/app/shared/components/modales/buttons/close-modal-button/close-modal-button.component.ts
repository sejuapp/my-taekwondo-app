import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-close-modal-button',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './close-modal-button.component.html',
  styleUrl: './close-modal-button.component.scss'
})
export class CloseModalButtonComponent {
  @Input() tooltip: string = 'Cerrar ventana';
  @Input() icon: string = 'close';
  @Input() color: string = '#000000';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
