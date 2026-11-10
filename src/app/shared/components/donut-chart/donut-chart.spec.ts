import { TestBed } from '@angular/core/testing';
import { DonutChart, DonutChartItem } from './donut-chart';

describe('DonutChart', () => {
  const items: DonutChartItem[] = [
    { label: 'Entregado', value: 10, color: '#10b981' },
    { label: 'Pendiente', value: 5, color: '#f59e0b' },
    { label: 'Rechazado', value: 1, color: '#f43f5e' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutChart],
    }).compileComponents();
  });

  it('debe crearse correctamente y calcular el total', () => {
    const fixture = TestBed.createComponent(DonutChart);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('title', 'Estado de Entregas');
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    expect(instance).toBeTruthy();
    expect(instance['total']()).toBe(16);
    expect(instance['slices']().length).toBe(3);
  });

  it('debe actualizar el activeDisplay al hacer hover sobre un índice', () => {
    const fixture = TestBed.createComponent(DonutChart);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const instance = fixture.componentInstance;
    expect(instance['activeDisplay']().label).toBe('TOTAL');

    instance['setHovered'](0);
    expect(instance['activeDisplay']().label).toBe('Entregado');
    expect(instance['activeDisplay']().value).toBe(10);

    instance['setHovered'](null);
    expect(instance['activeDisplay']().label).toBe('TOTAL');
  });
});
