import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { DonutChart, DonutChartItem } from '../../../../shared/components/donut-chart/donut-chart';
import { BarChart, BarChartItem } from '../../../../shared/components/bar-chart/bar-chart';

export interface StockDisponibleItem {
  id: string;
  sku: string;
  descripcion: string;
  deposito: string;
  stockFisico: number;
  comprometido: number;
  disponibleVenta: number;
  enTransito: number;
  unidad: string;
  estadoDisponibilidad: string;
}

@Component({
  selector: 'app-stock-disponible',
  imports: [DataGrid, DonutChart, BarChart, DecimalPipe],
  templateUrl: './stock-disponible.html',
  styleUrl: './stock-disponible.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockDisponible {
  protected readonly showCharts = signal(true);

  protected readonly columns: GridColumn[] = [
    { field: 'sku', header: 'SKU', width: '110px', align: 'left' },
    { field: 'descripcion', header: 'DESCRIPCIÓN ARTÍCULO', minWidth: '260px' },
    { field: 'deposito', header: 'DEPÓSITO', width: '160px' },
    { field: 'stockFisico', header: 'STOCK FÍSICO', width: '110px', align: 'right', type: 'number' },
    { field: 'comprometido', header: 'COMPROMETIDO', width: '120px', align: 'right', type: 'number' },
    { field: 'disponibleVenta', header: 'DISPONIBLE VENTA', width: '130px', align: 'right', type: 'number' },
    { field: 'enTransito', header: 'EN TRÁNSITO', width: '110px', align: 'right', type: 'number' },
    { field: 'unidad', header: 'UNIDAD', width: '80px', align: 'center' },
    {
      field: 'estadoDisponibilidad',
      header: 'DISPONIBILIDAD',
      width: '120px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) => {
        if (v === 'Crítico') return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        if (v === 'Aceptable') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar pedidos comprometidos', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Imprimir reporte de disponibilidad', color: 'blue' },
  ];

  protected readonly reporte = signal<StockDisponibleItem[]>([
    { id: '1', sku: 'SKU-00101', descripcion: 'GASEOSA COLA 3L PAQUETE X4', deposito: 'Almacén Central', stockFisico: 850, comprometido: 120, disponibleVenta: 730, enTransito: 300, unidad: 'PQT', estadoDisponibilidad: 'Óptimo' },
    { id: '2', sku: 'SKU-00102', descripcion: 'JUGO NÉCTAR DURAZNO 1L PACK X6', deposito: 'Almacén Central', stockFisico: 110, comprometido: 95, disponibleVenta: 15, enTransito: 200, unidad: 'CJ', estadoDisponibilidad: 'Crítico' },
    { id: '3', sku: 'SKU-00103', descripcion: 'GALLETA DE SODA FAMILIAR 400G', deposito: 'Depósito Callao', stockFisico: 420, comprometido: 80, disponibleVenta: 340, enTransito: 0, unidad: 'CJ', estadoDisponibilidad: 'Aceptable' },
    { id: '4', sku: 'SKU-00104', descripcion: 'LECHE EVAPORADA ENTERA 400G PACK X24', deposito: 'Almacén Central', stockFisico: 680, comprometido: 140, disponibleVenta: 540, enTransito: 450, unidad: 'CJ', estadoDisponibilidad: 'Óptimo' },
    { id: '5', sku: 'SKU-00105', descripcion: 'ACEITE VEGETAL 900ML CAJA X12', deposito: 'Sucursal Norte', stockFisico: 90, comprometido: 70, disponibleVenta: 20, enTransito: 150, unidad: 'CJ', estadoDisponibilidad: 'Crítico' },
  ]);

  protected readonly kpis = computed(() => {
    const list = this.reporte();
    const fisico = list.reduce((acc, r) => acc + r.stockFisico, 0);
    const comprometido = list.reduce((acc, r) => acc + r.comprometido, 0);
    const disponible = list.reduce((acc, r) => acc + r.disponibleVenta, 0);
    const transito = list.reduce((acc, r) => acc + r.enTransito, 0);

    return {
      fisico,
      comprometido,
      disponible,
      transito,
      articulosCount: list.length,
    };
  });

  protected readonly donutDisponibilidad = computed<DonutChartItem[]>(() => {
    const counts: Record<string, number> = {};
    this.reporte().forEach(r => {
      counts[r.estadoDisponibilidad] = (counts[r.estadoDisponibilidad] || 0) + 1;
    });

    return [
      { label: 'Óptimo', value: counts['Óptimo'] || 0, color: '#10b981' },
      { label: 'Aceptable', value: counts['Aceptable'] || 0, color: '#f59e0b' },
      { label: 'Crítico / Rotura', value: counts['Crítico'] || 0, color: '#f43f5e' },
    ].filter(it => it.value > 0);
  });

  protected readonly barStockArticulos = computed<BarChartItem[]>(() => {
    return this.reporte().map(r => ({
      label: r.descripcion,
      value: r.disponibleVenta,
      target: r.stockFisico,
      color: r.estadoDisponibilidad === 'Crítico' ? '#f43f5e' : r.estadoDisponibilidad === 'Aceptable' ? '#f59e0b' : '#10b981',
      tag: r.unidad,
    }));
  });

  protected toggleCharts(): void {
    this.showCharts.update(v => !v);
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para artículo:`, evt.item.sku);
  }
}
