import { Component } from '@angular/core';
import { AllSharedImports } from '@app/shared/all-shared-imports';

@Component({
  selector: 'app-example',
  imports: [
    ...AllSharedImports
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent {

}
