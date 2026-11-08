import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../shared/components/data-grid/data-grid';

export interface ReporteComision {
  id: string;
  asesor: string;
  ventas: number;
  cumplimiento: string;
  comision: number;
}

@Component({
  selector: 'app-reportes',
  imports: [DataGrid],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reportes {
  protected readonly columns: GridColumn[] = [
    { field: 'asesor', header: 'ASESOR COMERCIAL', minWidth: '220px' },
    { field: 'ventas', header: 'VENTAS ACUMULADAS (S/)', width: '180px', align: 'right', type: 'currency' },
    { field: 'cumplimiento', header: 'CUMPLIMIENTO CUOTA', width: '160px', align: 'center' },
    { field: 'comision', header: 'COMISIÓN ASIGNADA (S/)', width: '180px', align: 'right', type: 'currency' },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver desglose por cliente', color: 'primary' },
    { id: 'liquidar', icon: 'check', title: 'Liquidación de comisiones', color: 'emerald' },
  ];

  protected readonly reportes = signal<ReporteComision[]>([
    { id: '1', asesor: 'Carlos Rivas', ventas: 98400.00, cumplimiento: '98.4%', comision: 3444.00 },
    { id: '2', asesor: 'Lucía Mendoza', ventas: 86250.00, cumplimiento: '91.8%', comision: 2932.50 },
    { id: '3', asesor: 'Jorge Campos', ventas: 63940.00, cumplimiento: '85.2%', comision: 2073.70 },
  ]);

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para asesor:`, evt.item.asesor);
  }
}
