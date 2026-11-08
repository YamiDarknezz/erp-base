import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../shared/components/data-grid/data-grid';

export interface Factura {
  id: string;
  serieNumero: string;
  cliente: string;
  ruc: string;
  fechaEmision: string;
  monto: number;
  igv: number;
  total: number;
  estadoEnvio: 'Aceptado' | 'Pendiente' | 'Rechazado';
}

@Component({
  selector: 'app-facturacion',
  imports: [DataGrid],
  templateUrl: './facturacion.html',
  styleUrl: './facturacion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Facturacion {
  protected readonly columns: GridColumn[] = [
    { field: 'serieNumero', header: 'COMPROBANTE', width: '130px', align: 'left' },
    { field: 'cliente', header: 'RAZÓN SOCIAL CLIENTE', minWidth: '240px' },
    { field: 'ruc', header: 'RUC / DNI', width: '120px', type: 'number' },
    { field: 'fechaEmision', header: 'FECHA EMISIÓN', width: '110px', align: 'center', type: 'date' },
    { field: 'monto', header: 'SUBTOTAL (S/)', width: '120px', align: 'right', type: 'currency' },
    { field: 'igv', header: 'IGV (S/)', width: '100px', align: 'right', type: 'currency' },
    { field: 'total', header: 'TOTAL (S/)', width: '120px', align: 'right', type: 'currency' },
    {
      field: 'estadoEnvio',
      header: 'ESTADO',
      width: '100px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        switch (val) {
          case 'Aceptado':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          case 'Pendiente':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          case 'Rechazado':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          default:
            return 'bg-surface-muted text-on-surface';
        }
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'pdf', icon: 'file', title: 'Descargar representación impresa PDF', color: 'primary' },
    { id: 'xml', icon: 'check', title: 'Descargar comprobante XML firmado', color: 'emerald' },
    { id: 'print', icon: 'print', title: 'Imprimir comprobante térmico', color: 'blue' },
  ];

  protected readonly facturas = signal<Factura[]>([
    { id: '1', serieNumero: 'F001-0004521', cliente: 'SUPERMERCADOS METRO S.A.', ruc: '20100070970', fechaEmision: '07/11/2026', monto: 4110.59, igv: 739.91, total: 4850.50, estadoEnvio: 'Aceptado' },
    { id: '2', serieNumero: 'F001-0004522', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', ruc: '20489632514', fechaEmision: '07/11/2026', monto: 10508.47, igv: 1891.53, total: 12400.00, estadoEnvio: 'Pendiente' },
    { id: '3', serieNumero: 'B001-0012890', cliente: 'TIENDAS TAMBO SAC', ruc: '20563458921', fechaEmision: '06/11/2026', monto: 2712.50, igv: 488.25, total: 3200.75, estadoEnvio: 'Aceptado' },
    { id: '4', serieNumero: 'F001-0004523', cliente: 'BODEGAS UNIDAS LIMA', ruc: '20601239845', fechaEmision: '06/11/2026', monto: 1601.69, igv: 288.31, total: 1890.00, estadoEnvio: 'Aceptado' },
    { id: '5', serieNumero: 'F001-0004524', cliente: 'COMERCIAL EL SOL S.R.L.', ruc: '20512897456', fechaEmision: '05/11/2026', monto: 6483.22, igv: 1166.98, total: 7650.20, estadoEnvio: 'Rechazado' },
  ]);

  protected handleNew(): void {
    console.info('Emitir nuevo comprobante');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para comprobante:`, evt.item.serieNumero);
  }
}
