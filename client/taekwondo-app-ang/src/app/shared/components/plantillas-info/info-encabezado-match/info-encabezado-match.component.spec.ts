import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoEncabezadoMatchComponent } from './info-encabezado-match.component';

describe('InfoEncabezadoMatchComponent', () => {
  let component: InfoEncabezadoMatchComponent;
  let fixture: ComponentFixture<InfoEncabezadoMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoEncabezadoMatchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoEncabezadoMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
