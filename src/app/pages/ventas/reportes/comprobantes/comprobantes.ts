import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface ComprobanteEmitido {
  id: string;
  tipoDoc: string;
  numero: string;
  fechaEmision: string;
  cliente: string;
  documentoIdentidad: string;
  subtotal: number;
  igv: number;
  total: number;
  estadoSunat: 'Aceptado' | 'Rechazado' | 'Pendiente' | 'Anulado';
}

@Component({
  selector: 'app-comprobantes',
  imports: [DataGrid],
  templateUrl: './comprobantes.html',
  styleUrl: './comprobantes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Comprobantes {
  protected readonly columns: GridColumn[] = [
    { field: 'tipoDoc', header: 'TIPO', width: '90px', align: 'center' },
    { field: 'numero', header: 'N° COMPROBANTE', width: '130px', align: 'center' },
    { field: 'fechaEmision', header: 'FECHA EMISIÓN', width: '110px', align: 'center', type: 'date' },
    { field: 'cliente', header: 'RAZÓN SOCIAL / CLIENTE', minWidth: '240px' },
    { field: 'documentoIdentidad', header: 'RUC / DNI', width: '110px', align: 'center' },
    { field: 'subtotal', header: 'SUBTOTAL (S/)', width: '120px', align: 'right', type: 'currency' },
    { field: 'igv', header: 'IGV (S/)', width: '100px', align: 'right', type: 'currency' },
    { field: 'total', header: 'TOTAL (S/)', width: '130px', align: 'right', type: 'currency' },
    {
      field: 'estadoSunat',
      header: 'ESTADO',
      width: '105px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) => {
        if (v === 'Aceptado') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
        if (v === 'Anulado' || v === 'Rechazado') return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar representación impresa', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Imprimir comprobante fiscal', color: 'blue' },
    { id: 'file', icon: 'file', title: 'Descargar archivo XML/CDR', color: 'emerald' },
  ];

  protected readonly comprobantes = signal<ComprobanteEmitido[]>([
    { id: 'c1', tipoDoc: 'FACTURA', numero: 'F001-0004812', fechaEmision: '08/11/2026', cliente: 'CORPORACION LOGISTICA DEL CENTRO SAC', documentoIdentidad: '20100039207', subtotal: 8250.00, igv: 1485.00, total: 9735.00, estadoSunat: 'Aceptado' },
    { id: 'c2', tipoDoc: 'BOLETA', numero: 'B001-0012940', fechaEmision: '08/11/2026', cliente: 'ALEJANDRO ARAUJO LUIS ERNESTO', documentoIdentidad: '10068142437', subtotal: 350.00, igv: 63.00, total: 413.00, estadoSunat: 'Aceptado' },
    { id: 'c3', tipoDoc: 'FACTURA', numero: 'F001-0004813', fechaEmision: '08/11/2026', cliente: 'RANSA COMERCIAL SA', documentoIdentidad: '20508778920', subtotal: 14200.00, igv: 2556.00, total: 16756.00, estadoSunat: 'Aceptado' },
    { id: 'c4', tipoDoc: 'FACTURA', numero: 'F001-0004814', fechaEmision: '08/11/2026', cliente: 'PROTEKTOR SEGURIDAD INTEGRAL S.A.C.', documentoIdentidad: '2053607783', subtotal: 2100.00, igv: 378.00, total: 2478.00, estadoSunat: 'Pendiente' },
    { id: 'c5', tipoDoc: 'NOTA CRÉD.', numero: 'NC01-0000312', fechaEmision: '08/11/2026', cliente: 'MERCANTIL INCA S.A.', documentoIdentidad: '20451583060', subtotal: -500.00, igv: -90.00, total: -590.00, estadoSunat: 'Aceptado' },
  ]);

  protected handleAction(evt: { actionId: string; item: ComprobanteEmitido }): void {
    console.info(`Acción ${evt.actionId} ejecutada para comprobante:`, evt.item.numero);
  }
}
