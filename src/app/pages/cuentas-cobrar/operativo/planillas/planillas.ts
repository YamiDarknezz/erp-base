import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface PlanillaCobranza {
  id: string;
  numero: string;
  fecha: string;
  cobrador: string;
  zona: string;
  documentosCobradas: number;
  totalRecaudado: number;
  bancoDestino: string;
  estado: 'Liquidada' | 'En Proceso' | 'Pendiente';
}

@Component({
  selector: 'app-planillas',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './planillas.html',
  styleUrl: './planillas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Planillas {
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

  protected readonly planillas = signal<PlanillaCobranza[]>([
    {
      id: '1',
      numero: 'PLC-2026-00381',
      fecha: '08/11/2026',
      cobrador: 'Marcos Benítez Salazar',
      zona: 'Lima Este / Ate',
      documentosCobradas: 14,
      totalRecaudado: 48920.50,
      bancoDestino: 'BCP Cta Corriente Soles',
      estado: 'Liquidada',
    },
    {
      id: '2',
      numero: 'PLC-2026-00382',
      fecha: '08/11/2026',
      cobrador: 'Raúl Espinoza Peña',
      zona: 'Callao Centro / Ventanilla',
      documentosCobradas: 9,
      totalRecaudado: 23410.00,
      bancoDestino: 'BBVA Continental Soles',
      estado: 'En Proceso',
    },
    {
      id: '3',
      numero: 'PLC-2026-00383',
      fecha: '07/11/2026',
      cobrador: 'Christian Villegas Ruiz',
      zona: 'Lima Sur / Chorrillos',
      documentosCobradas: 22,
      totalRecaudado: 67180.25,
      bancoDestino: 'Interbank Recaudaciones',
      estado: 'Liquidada',
    },
    {
      id: '4',
      numero: 'PLC-2026-00384',
      fecha: '07/11/2026',
      cobrador: 'Marcos Benítez Salazar',
      zona: 'San Juan de Lurigancho',
      documentosCobradas: 6,
      totalRecaudado: 12850.00,
      bancoDestino: 'Scotiabank Empresas',
      estado: 'Pendiente',
    },
    {
      id: '5',
      numero: 'PLC-2026-00385',
      fecha: '06/11/2026',
      cobrador: 'Raúl Espinoza Peña',
      zona: 'Lima Norte / Los Olivos',
      documentosCobradas: 18,
      totalRecaudado: 54300.80,
      bancoDestino: 'BCP Cta Corriente Soles',
      estado: 'Liquidada',
    },
  ]);

  protected handleNew(): void {
    console.info('Generar nueva planilla de cobranza');
  }

  protected handleAction(evt: { actionId: string; item: PlanillaCobranza }): void {
    console.info(`Acción ${evt.actionId} ejecutada para planilla:`, evt.item.numero);
  }
}
