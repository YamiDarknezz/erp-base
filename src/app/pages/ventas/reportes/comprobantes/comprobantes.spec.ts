import { TestBed } from '@angular/core/testing';
import { Comprobantes } from './comprobantes';

describe('Comprobantes', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comprobantes],
    }).compileComponents();
  });

  it('debe crear el componente de comprobantes y computar KPIs', () => {
    const fixture = TestBed.createComponent(Comprobantes);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
    expect(comp['kpis']().total).toBeGreaterThan(0);
    expect(comp['donutTipos']().length).toBeGreaterThan(0);
    expect(comp['barTopFacturados']().length).toBeGreaterThan(0);
  });

  it('debe alternar la visualización del panel de gráficos', () => {
    const fixture = TestBed.createComponent(Comprobantes);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp['showCharts']()).toBe(true);
    comp['toggleCharts']();
    expect(comp['showCharts']()).toBe(false);
  });
});
