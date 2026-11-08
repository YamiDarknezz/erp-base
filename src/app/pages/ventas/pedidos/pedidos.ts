import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../shared/components/data-grid/data-grid';

export interface Pedido {
  id: string;
  codigo: string;
  cliente: string;
  vendedor: string;
  fecha: string;
  total: number;
  estado: 'Pendiente' | 'Aprobado' | 'Facturado' | 'Anulado';
}

@Component({
  selector: 'app-pedidos',
  imports: [DataGrid],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pedidos {
  protected readonly columns: GridColumn[] = [
    { field: 'codigo', header: 'N° PEDIDO', width: '120px', align: 'left' },
    { field: 'cliente', header: 'CLIENTE', minWidth: '240px' },
    { field: 'vendedor', header: 'ASESOR COMERCIAL', width: '160px' },
    { field: 'fecha', header: 'FECHA EMISIÓN', width: '110px', align: 'center', type: 'date' },
    { field: 'total', header: 'TOTAL (S/)', width: '120px', align: 'right', type: 'currency' },
    {
      field: 'estado',
      header: 'ESTADO',
      width: '100px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        switch (val) {
          case 'Aprobado':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          case 'Pendiente':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          case 'Facturado':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
          case 'Anulado':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          default:
            return 'bg-surface-muted text-on-surface';
        }
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver detalle del pedido', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Editar pedido comercial', color: 'emerald' },
    { id: 'print', icon: 'print', title: 'Imprimir nota de pedido', color: 'blue' },
    { id: 'delete', icon: 'delete', title: 'Anular pedido', color: 'rose' },
  ];

  protected readonly pedidos = signal<Pedido[]>([
    { id: '1', codigo: 'PED-2026-0891', cliente: 'SUPERMERCADOS METRO S.A.', vendedor: 'Carlos Rivas', fecha: '07/11/2026', total: 4850.50, estado: 'Aprobado' },
    { id: '2', codigo: 'PED-2026-0892', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', vendedor: 'Lucía Mendoza', fecha: '07/11/2026', total: 12400.00, estado: 'Pendiente' },
    { id: '3', codigo: 'PED-2026-0893', cliente: 'TIENDAS TAMBO SAC', vendedor: 'Carlos Rivas', fecha: '06/11/2026', total: 3200.75, estado: 'Facturado' },
    { id: '4', codigo: 'PED-2026-0894', cliente: 'BODEGAS UNIDAS LIMA', vendedor: 'Jorge Campos', fecha: '06/11/2026', total: 1890.00, estado: 'Aprobado' },
    { id: '5', codigo: 'PED-2026-0895', cliente: 'COMERCIAL EL SOL S.R.L.', vendedor: 'Lucía Mendoza', fecha: '05/11/2026', total: 7650.20, estado: 'Pendiente' },
    { id: '6', codigo: 'PED-2026-0896', cliente: 'INVERSIONES SAN ROQUE', vendedor: 'Jorge Campos', fecha: '05/11/2026', total: 950.00, estado: 'Anulado' },
  ]);

  protected handleNew(): void {
    console.info('Crear nuevo pedido');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para pedido:`, evt.item.codigo);
  }
}
