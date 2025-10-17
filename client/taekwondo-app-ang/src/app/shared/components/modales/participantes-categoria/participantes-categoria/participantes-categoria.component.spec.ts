import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantesCategoriaComponent } from './participantes-categoria.component';

describe('ParticipantesCategoriaComponent', () => {
  let component: ParticipantesCategoriaComponent;
  let fixture: ComponentFixture<ParticipantesCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantesCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantesCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
