import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoOponentes1Component } from './info-oponentes-1.component';

describe('InfoOponentes1Component', () => {
  let component: InfoOponentes1Component;
  let fixture: ComponentFixture<InfoOponentes1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoOponentes1Component]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoOponentes1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
