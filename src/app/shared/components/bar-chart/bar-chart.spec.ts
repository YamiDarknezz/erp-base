import { TestBed } from '@angular/core/testing';
import { BarChart, BarChartItem } from './bar-chart';

describe('BarChart', () => {
  const items: BarChartItem[] = [
    { label: 'Carlos Rivas', value: 98400, target: 100000, color: '#10b981', tag: '98%' },
    { label: 'Lucía Mendoza', value: 86250, target: 95000, color: '#3b82f6', tag: '91%' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChart],
    }).compileComponents();
  });

  it('debe crearse y computar las filas y porcentajes correctamente', () => {
    const fixture = TestBed.createComponent(BarChart);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('title', 'Ventas por Asesor');
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    expect(instance).toBeTruthy();
    expect(instance['rows']().length).toBe(2);
    expect(instance['rows']()[0].label).toBe('Carlos Rivas');
    expect(instance['rows']()[0].pct).toBeGreaterThan(0);
  });
});
