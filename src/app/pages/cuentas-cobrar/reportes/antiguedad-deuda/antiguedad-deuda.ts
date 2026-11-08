import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { CollectionService } from '../../../../core/services/collection.service';
import { AgingAccountEntity } from '../../../../core/data/collections.seed';

@Component({
  selector: 'app-antiguedad-deuda',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './antiguedad-deuda.html',
  styleUrl: './antiguedad-deuda.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AntiguedadDeuda {
  private readonly collectionService = inject(CollectionService);

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

  protected handleAction(evt: { actionId: string; item: AgingAccountEntity }): void {
    console.info(`Acción ${evt.actionId} para cliente con deuda:`, evt.item.cliente);
  }
}
