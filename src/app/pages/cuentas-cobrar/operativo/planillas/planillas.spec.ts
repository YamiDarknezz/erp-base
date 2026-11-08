import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Planillas } from './planillas';

describe('Planillas', () => {
  let component: Planillas;
  let fixture: ComponentFixture<Planillas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planillas],
    }).compileComponents();

    fixture = TestBed.createComponent(Planillas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create planillas component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial collection sheets listed', () => {
    expect(component['planillas']().length).toBeGreaterThan(0);
  });
});
