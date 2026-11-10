import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { DonutChart, DonutChartItem } from '../../../../shared/components/donut-chart/donut-chart';
import { BarChart, BarChartItem } from '../../../../shared/components/bar-chart/bar-chart';

export interface ReporteComision {
  id: string;
  asesor: string;
  ventas: number;
  cuota: number;
  cumplimiento: string;
  comision: number;
}

@Component({
  selector: 'app-comisiones',
  imports: [DataGrid, DonutChart, BarChart, DecimalPipe],
  templateUrl: './comisiones.html',
  styleUrl: './comisiones.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Comisiones {
  protected readonly showCharts = signal(true);

  protected readonly columns: GridColumn[] = [
    { field: 'asesor', header: 'ASESOR COMERCIAL', minWidth: '220px' },
    { field: 'ventas', header: 'VENTAS ACUMULADAS (S/)', width: '180px', align: 'right', type: 'currency' },
    { field: 'cuota', header: 'CUOTA ASIGNADA (S/)', width: '170px', align: 'right', type: 'currency' },
    { field: 'cumplimiento', header: 'CUMPLIMIENTO CUOTA', width: '160px', align: 'center' },
    { field: 'comision', header: 'COMISIÓN ASIGNADA (S/)', width: '180px', align: 'right', type: 'currency' },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver desglose por cliente', color: 'primary' },
    { id: 'liquidar', icon: 'check', title: 'Liquidación de comisiones', color: 'emerald' },
  ];

  protected readonly reportes = signal<ReporteComision[]>([
    { id: '1', asesor: 'Carlos Rivas', ventas: 98400.00, cuota: 100000.00, cumplimiento: '98.4%', comision: 3444.00 },
    { id: '2', asesor: 'Lucía Mendoza', ventas: 86250.00, cuota: 95000.00, cumplimiento: '90.8%', comision: 2932.50 },
    { id: '3', asesor: 'Jorge Campos', ventas: 63940.00, cuota: 75000.00, cumplimiento: '85.3%', comision: 2073.70 },
  ]);

  protected readonly kpis = computed(() => {
    const list = this.reportes();
    const ventas = list.reduce((acc, r) => acc + r.ventas, 0);
    const cuota = list.reduce((acc, r) => acc + r.cuota, 0);
    const comisiones = list.reduce((acc, r) => acc + r.comision, 0);
    const cumplimientoMedio = cuota > 0 ? (ventas / cuota) * 100 : 0;
    return {
      ventas,
      cuota,
      comisiones,
      cumplimientoMedio,
      asesoresCount: list.length,
    };
  });

  protected readonly donutComisiones = computed<DonutChartItem[]>(() => {
    const palette = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
    return this.reportes().map((r, i) => ({
      label: r.asesor,
      value: r.comision,
      color: palette[i % palette.length],
    }));
  });

  protected readonly barVentasCuota = computed<BarChartItem[]>(() => {
    return this.reportes().map(r => ({
      label: r.asesor,
      value: r.ventas,
      target: r.cuota,
      color: '#3b82f6',
      tag: r.cumplimiento,
    }));
  });

  protected toggleCharts(): void {
    this.showCharts.update(v => !v);
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para asesor:`, evt.item.asesor);
  }
}
