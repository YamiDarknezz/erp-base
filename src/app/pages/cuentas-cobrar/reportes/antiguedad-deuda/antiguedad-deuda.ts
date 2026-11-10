import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { CollectionService } from '../../../../core/services/collection.service';
import { AgingAccountEntity } from '../../../../core/data/collections.seed';
import { DonutChart, DonutChartItem } from '../../../../shared/components/donut-chart/donut-chart';
import { BarChart, BarChartItem } from '../../../../shared/components/bar-chart/bar-chart';

@Component({
  selector: 'app-antiguedad-deuda',
  standalone: true,
  imports: [DataGrid, DonutChart, BarChart, DecimalPipe],
  templateUrl: './antiguedad-deuda.html',
  styleUrl: './antiguedad-deuda.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AntiguedadDeuda {
  private readonly collectionService = inject(CollectionService);

  protected readonly showCharts = signal(true);
  protected readonly cartera = this.collectionService.agingAccounts;

  protected readonly columns: GridColumn[] = [
    { field: 'ruc', header: 'RUC CLIENTE', width: '120px', align: 'left', type: 'number' },
    { field: 'cliente', header: 'RAZÓN SOCIAL', minWidth: '220px' },
    { field: 'limiteCredito', header: 'LÍNEA CRÉDITO (S/)', width: '130px', align: 'right', type: 'currency' },
    { field: 'deudaTotal', header: 'DEUDA TOTAL (S/)', width: '130px', align: 'right', type: 'currency' },
    { field: 'corriente', header: 'VIGENTE (S/)', width: '110px', align: 'right', type: 'currency' },
    { field: 'vencido1_30', header: '1-30 DÍAS (S/)', width: '110px', align: 'right', type: 'currency' },
    { field: 'vencido31_60', header: '31-60 DÍAS (S/)', width: '110px', align: 'right', type: 'currency' },
    { field: 'vencido90Mas', header: '>90 DÍAS (S/)', width: '110px', align: 'right', type: 'currency' },
    {
      field: 'semaforo',
      header: 'CALIFICACIÓN',
      width: '110px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        switch (val) {
          case 'Normal':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          case 'Precaución':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          case 'Crítico':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          default:
            return 'bg-surface-muted text-on-surface';
        }
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar estado de cuenta detallado', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Exportar carta de cobranza o estado de deuda', color: 'blue' },
  ];

  protected readonly kpis = computed(() => {
    const list = this.cartera();
    const totalDeuda = list.reduce((acc, c) => acc + c.deudaTotal, 0);
    const totalVigente = list.reduce((acc, c) => acc + c.corriente, 0);
    const totalVencido = totalDeuda - totalVigente;
    const ratioMora = totalDeuda > 0 ? (totalVencido / totalDeuda) * 100 : 0;

    return {
      totalDeuda,
      totalVigente,
      totalVencido,
      ratioMora,
      clientesCount: list.length,
    };
  });

  protected readonly donutTramosMora = computed<DonutChartItem[]>(() => {
    const list = this.cartera();
    const corriente = list.reduce((acc, c) => acc + c.corriente, 0);
    const v1_30 = list.reduce((acc, c) => acc + c.vencido1_30, 0);
    const v31_60 = list.reduce((acc, c) => acc + c.vencido31_60, 0);
    const v90Mas = list.reduce((acc, c) => acc + c.vencido90Mas, 0);

    return [
      { label: 'Vigente (Al día)', value: corriente, color: '#10b981' },
      { label: '1 a 30 Días', value: v1_30, color: '#f59e0b' },
      { label: '31 a 60 Días', value: v31_60, color: '#f97316' },
      { label: 'Más de 90 Días', value: v90Mas, color: '#f43f5e' },
    ].filter(it => it.value > 0);
  });

  protected readonly barTopDeudores = computed<BarChartItem[]>(() => {
    return this.cartera()
      .slice(0, 4)
      .map(c => ({
        label: c.cliente,
        value: c.deudaTotal,
        target: c.limiteCredito,
        color: c.semaforo === 'Crítico' ? '#f43f5e' : c.semaforo === 'Precaución' ? '#f59e0b' : '#10b981',
        tag: c.semaforo,
      }));
  });

  protected toggleCharts(): void {
    this.showCharts.update(v => !v);
  }

  protected handleAction(evt: { actionId: string; item: AgingAccountEntity }): void {
    console.info(`Acción ${evt.actionId} para cliente con deuda:`, evt.item.cliente);
  }
}
