import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AntiguedadDeuda } from './antiguedad-deuda';

describe('AntiguedadDeuda', () => {
  let component: AntiguedadDeuda;
  let fixture: ComponentFixture<AntiguedadDeuda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntiguedadDeuda],
    }).compileComponents();

    fixture = TestBed.createComponent(AntiguedadDeuda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create antiguedad-deuda component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial aging accounts listed', () => {
    expect(component['cartera']().length).toBeGreaterThan(0);
    expect(component['kpis']().totalDeuda).toBeGreaterThan(0);
    expect(component['donutTramosMora']().length).toBeGreaterThan(0);
  });
});
