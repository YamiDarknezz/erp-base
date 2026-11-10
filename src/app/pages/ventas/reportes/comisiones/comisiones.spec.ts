import { TestBed } from '@angular/core/testing';
import { Comisiones } from './comisiones';

describe('Comisiones', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comisiones],
    }).compileComponents();
  });

  it('debe crear el componente de comisiones y calcular KPIs', () => {
    const fixture = TestBed.createComponent(Comisiones);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
    expect(comp['kpis']().ventas).toBeGreaterThan(0);
    expect(comp['kpis']().comisiones).toBeGreaterThan(0);
    expect(comp['donutComisiones']().length).toBe(3);
    expect(comp['barVentasCuota']().length).toBe(3);
  });

  it('debe alternar la visibilidad del panel de gráficos', () => {
    const fixture = TestBed.createComponent(Comisiones);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp['showCharts']()).toBe(true);
    comp['toggleCharts']();
    expect(comp['showCharts']()).toBe(false);
  });
});
