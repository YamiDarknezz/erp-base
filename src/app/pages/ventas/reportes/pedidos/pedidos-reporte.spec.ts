import { TestBed } from '@angular/core/testing';
import { PedidosReporte } from './pedidos-reporte';

describe('PedidosReporte', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosReporte],
    }).compileComponents();
  });

  it('debe crear el componente de reporte y calcular KPIs correctamente', () => {
    const fixture = TestBed.createComponent(PedidosReporte);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
    expect(comp['kpis']().totalPedidos).toBe(4);
    expect(comp['kpis']().solicitado).toBeGreaterThan(0);
    expect(comp['donutEstadoDespacho']().length).toBeGreaterThan(0);
    expect(comp['barEfectividadAsesores']().length).toBeGreaterThan(0);
  });

  it('debe permitir alternar la visibilidad de los gráficos', () => {
    const fixture = TestBed.createComponent(PedidosReporte);
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp['showCharts']()).toBe(true);

    comp['toggleCharts']();
    expect(comp['showCharts']()).toBe(false);

    comp['toggleCharts']();
    expect(comp['showCharts']()).toBe(true);
  });
});
