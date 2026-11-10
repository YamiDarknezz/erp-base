import { TestBed } from '@angular/core/testing';
import { StockDisponible } from './stock-disponible';

describe('StockDisponible', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockDisponible],
    }).compileComponents();
  });

  it('debe crear el componente y calcular métricas y gráficos de stock', () => {
    const fixture = TestBed.createComponent(StockDisponible);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
    expect(comp['kpis']().fisico).toBeGreaterThan(0);
    expect(comp['kpis']().disponible).toBeGreaterThan(0);
    expect(comp['donutDisponibilidad']().length).toBeGreaterThan(0);
    expect(comp['barStockArticulos']().length).toBeGreaterThan(0);
  });

  it('debe alternar la visibilidad de los gráficos', () => {
    const fixture = TestBed.createComponent(StockDisponible);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp['showCharts']()).toBe(true);
    comp['toggleCharts']();
    expect(comp['showCharts']()).toBe(false);
  });
});
