import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContenedorComponent } from './gestion-contenedor.component';

describe('GestionContenedorComponent', () => {
  let component: GestionContenedorComponent;
  let fixture: ComponentFixture<GestionContenedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionContenedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
