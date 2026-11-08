import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface ReportePedidoEfectividad {
  id: string;
  pedido: string;
  fecha: string;
  cliente: string;
  vendedor: string;
  montoSolicitado: number;
  montoEntregado: number;
  efectividad: string;
  estadoEntrega: 'Entregado Completo' | 'Parcial' | 'Rechazado' | 'En Ruta';
}

@Component({
  selector: 'app-pedidos-reporte',
  imports: [DataGrid],
  templateUrl: './pedidos-reporte.html',
  styleUrl: './pedidos-reporte.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosReporte {
  protected readonly columns: GridColumn[] = [
    { field: 'pedido', header: 'N° PEDIDO', width: '120px', align: 'center' },
    { field: 'fecha', header: 'FECHA REGISTRO', width: '120px', align: 'center', type: 'date' },
    { field: 'cliente', header: 'CLIENTE', minWidth: '240px' },
    { field: 'vendedor', header: 'ASESOR COMERCIAL', width: '170px' },
    { field: 'montoSolicitado', header: 'SOLICITADO (S/)', width: '130px', align: 'right', type: 'currency' },
    { field: 'montoEntregado', header: 'ENTREGADO (S/)', width: '130px', align: 'right', type: 'currency' },
    { field: 'efectividad', header: 'EFECTIVIDAD %', width: '110px', align: 'center' },
    {
      field: 'estadoEntrega',
      header: 'ESTADO DESPACHO',
      width: '150px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) => {
        if (v === 'Entregado Completo') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
        if (v === 'Rechazado') return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        if (v === 'En Ruta') return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar trazabilidad de entrega y liquidación', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Imprimir constancia de entrega', color: 'blue' },
  ];

  protected readonly pedidos = signal<ReportePedidoEfectividad[]>([
    { id: 'rp1', pedido: 'PED-2026-00450', fecha: '08/11/2026', cliente: 'SAGA FALABELLA S.A.', vendedor: 'Carlos Rivas Sánchez', montoSolicitado: 12500.00, montoEntregado: 12500.00, efectividad: '100%', estadoEntrega: 'Entregado Completo' },
    { id: 'rp2', pedido: 'PED-2026-00451', fecha: '08/11/2026', cliente: 'BODEGAS DON LUIS S.A.C.', vendedor: 'Lucía Mendoza Ortiz', montoSolicitado: 3400.00, montoEntregado: 3400.00, efectividad: '100%', estadoEntrega: 'En Ruta' },
    { id: 'rp3', pedido: 'PED-2026-00452', fecha: '08/11/2026', cliente: 'ALMACENES Y LOGISTICA DEL SUR S.A.C', vendedor: 'Jorge Campos Paredes', montoSolicitado: 8900.00, montoEntregado: 7800.00, efectividad: '87.6%', estadoEntrega: 'Parcial' },
    { id: 'rp4', pedido: 'PED-2026-00453', fecha: '08/11/2026', cliente: 'AUTO CENTER PERU S.A.C.', vendedor: 'Carlos Rivas Sánchez', montoSolicitado: 1800.00, montoEntregado: 0.00, efectividad: '0%', estadoEntrega: 'Rechazado' },
  ]);

  protected handleAction(evt: { actionId: string; item: ReportePedidoEfectividad }): void {
    console.info(`Acción ${evt.actionId} ejecutada para pedido reporte:`, evt.item.pedido);
  }
}
