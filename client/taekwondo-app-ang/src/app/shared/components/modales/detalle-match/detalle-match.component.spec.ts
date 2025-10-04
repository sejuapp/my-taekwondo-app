import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleMatchComponent } from './detalle-match.component';

describe('DetalleMatchComponent', () => {
  let component: DetalleMatchComponent;
  let fixture: ComponentFixture<DetalleMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMatchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
