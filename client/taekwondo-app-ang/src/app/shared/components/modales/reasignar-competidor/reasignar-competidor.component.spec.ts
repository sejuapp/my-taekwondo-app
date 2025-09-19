import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarCompetidorComponent } from './reasignar-competidor.component';

describe('ReasignarCompetidorComponent', () => {
  let component: ReasignarCompetidorComponent;
  let fixture: ComponentFixture<ReasignarCompetidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReasignarCompetidorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReasignarCompetidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
