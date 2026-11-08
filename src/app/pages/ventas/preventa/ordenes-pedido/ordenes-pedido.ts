import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface OrdenPedido {
  id: string;
  numero: string;
  cliente: string;
  zona: string;
  items: number;
  total: number;
  prioridad: 'Alta' | 'Normal' | 'Urgente';
}

@Component({
  selector: 'app-ordenes-pedido',
  imports: [DataGrid],
  templateUrl: './ordenes-pedido.html',
  styleUrl: './ordenes-pedido.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdenesPedido {
  protected readonly columns: GridColumn[] = [
    { field: 'numero', header: 'N° ORDEN', width: '120px', align: 'left' },
    { field: 'cliente', header: 'CLIENTE', minWidth: '240px' },
    { field: 'zona', header: 'ZONA / RUTA', width: '160px' },
    { field: 'items', header: 'ITEMS', width: '80px', align: 'center', type: 'number' },
    { field: 'total', header: 'IMPORTE (S/)', width: '120px', align: 'right', type: 'currency' },
    {
      field: 'prioridad',
      header: 'PRIORIDAD',
      width: '100px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        switch (val) {
          case 'Urgente':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          case 'Alta':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          case 'Normal':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          default:
            return 'bg-surface-muted text-on-surface';
        }
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'assign', icon: 'check', title: 'Asignar a picking', color: 'primary' },
    { id: 'view', icon: 'view', title: 'Ver detalle de la orden', color: 'emerald' },
    { id: 'print', icon: 'print', title: 'Imprimir orden de despacho', color: 'blue' },
  ];

  protected readonly ordenes = signal<OrdenPedido[]>([
    { id: '1', numero: 'ORD-9901', cliente: 'SUPERMERCADOS METRO S.A.', zona: 'Lima Metropolitana - R1', items: 18, total: 4850.50, prioridad: 'Alta' },
    { id: '2', numero: 'ORD-9902', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', zona: 'Lima Norte - R3', items: 42, total: 12400.00, prioridad: 'Urgente' },
    { id: '3', numero: 'ORD-9903', cliente: 'TIENDAS TAMBO SAC', zona: 'Lima Centro - R2', items: 12, total: 3200.75, prioridad: 'Normal' },
    { id: '4', numero: 'ORD-9904', cliente: 'BODEGAS UNIDAS LIMA', zona: 'Lima Este - R5', items: 8, total: 1890.00, prioridad: 'Normal' },
    { id: '5', numero: 'ORD-9905', cliente: 'COMERCIAL EL SOL S.R.L.', zona: 'Callao - R4', items: 25, total: 7650.20, prioridad: 'Alta' },
  ]);

  protected handleNew(): void {
    console.info('Nueva orden solicitada');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para orden:`, evt.item.numero);
  }
}
