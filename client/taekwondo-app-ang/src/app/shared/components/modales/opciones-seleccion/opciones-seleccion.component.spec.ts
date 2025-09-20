import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesSeleccionComponent } from './opciones-seleccion.component';

describe('OpcionesSeleccionComponent', () => {
  let component: OpcionesSeleccionComponent;
  let fixture: ComponentFixture<OpcionesSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcionesSeleccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionesSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
