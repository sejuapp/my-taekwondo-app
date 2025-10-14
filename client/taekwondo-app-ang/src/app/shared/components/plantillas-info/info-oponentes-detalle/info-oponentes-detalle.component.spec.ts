import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoOponentes2Component } from './info-oponentes-detalle.component';

describe('InfoOponentes2Component', () => {
  let component: InfoOponentes2Component;
  let fixture: ComponentFixture<InfoOponentes2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoOponentes2Component]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoOponentes2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
