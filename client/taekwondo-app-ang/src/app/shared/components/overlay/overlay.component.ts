import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  imports: [],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {
  @Output() closed = new EventEmitter<void>();

  onClick() {
    this.closed.emit();
  }
}
