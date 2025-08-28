import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTorneoComponent } from './gestion-torneo.component';

describe('GestionTorneoComponent', () => {
  let component: GestionTorneoComponent;
  let fixture: ComponentFixture<GestionTorneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTorneoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTorneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
