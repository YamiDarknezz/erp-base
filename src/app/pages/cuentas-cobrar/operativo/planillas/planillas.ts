import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { CollectionService } from '../../../../core/services/collection.service';
import { CollectionSheetEntity } from '../../../../core/data/collections.seed';

@Component({
  selector: 'app-planillas',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './planillas.html',
  styleUrl: './planillas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Planillas {
  private readonly collectionService = inject(CollectionService);

  protected readonly planillas = this.collectionService.collectionSheets;

  protected readonly columns: GridColumn[] = [
    { field: 'numero', header: 'N° PLANILLA', width: '130px', align: 'left' },
    { field: 'fecha', header: 'FECHA LIQUIDACIÓN', width: '120px', align: 'center', type: 'date' },
    { field: 'cobrador', header: 'GESTOR / COBRADOR', minWidth: '200px' },
    { field: 'zona', header: 'ZONA REPARTO', width: '150px' },
    { field: 'documentosCobradas', header: 'DOCS', width: '70px', align: 'center', type: 'number' },
    { field: 'totalRecaudado', header: 'TOTAL RECAUDADO (S/)', width: '160px', align: 'right', type: 'currency' },
    { field: 'bancoDestino', header: 'BANCO DE DEPÓSITO', width: '160px' },
    {
      field: 'estado',
      header: 'ESTADO',
      width: '110px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        switch (val) {
          case 'Liquidada':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          case 'En Proceso':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          case 'Pendiente':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          default:
            return 'bg-surface-muted text-on-surface';
        }
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar detalle de comprobantes liquidados', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Imprimir constancia de liquidación bancaria', color: 'blue' },
    { id: 'edit', icon: 'edit', title: 'Ajustar recibos y amortizaciones', color: 'emerald' },
  ];

  protected handleNew(): void {
    console.info('Generar nueva planilla de cobranza');
  }

  protected handleAction(evt: { actionId: string; item: CollectionSheetEntity }): void {
    console.info(`Acción ${evt.actionId} ejecutada para planilla:`, evt.item.numero);
  }
}
