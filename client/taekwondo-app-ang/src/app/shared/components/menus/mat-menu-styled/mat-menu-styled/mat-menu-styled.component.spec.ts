import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMenuStyledComponent } from './mat-menu-styled.component';

describe('MatMenuStyledComponent', () => {
  let component: MatMenuStyledComponent;
  let fixture: ComponentFixture<MatMenuStyledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuStyledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatMenuStyledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
