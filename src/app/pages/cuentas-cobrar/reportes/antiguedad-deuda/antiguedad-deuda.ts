import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface AntiguedadRegistro {
  id: string;
  ruc: string;
  cliente: string;
  limiteCredito: number;
  deudaTotal: number;
  corriente: number;
  vencido1_30: number;
  vencido31_60: number;
  vencido90Mas: number;
  semaforo: 'Normal' | 'Precaución' | 'Crítico';
}

@Component({
  selector: 'app-antiguedad-deuda',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './antiguedad-deuda.html',
  styleUrl: './antiguedad-deuda.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AntiguedadDeuda {
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

  protected readonly cartera = signal<AntiguedadRegistro[]>([
    {
      id: '1',
      ruc: '20100039207',
      cliente: 'RANSA COMERCIAL SA',
      limiteCredito: 200000,
      deudaTotal: 84500.00,
      corriente: 84500.00,
      vencido1_30: 0,
      vencido31_60: 0,
      vencido90Mas: 0,
      semaforo: 'Normal',
    },
    {
      id: '2',
      ruc: '20501234567',
      cliente: 'CORPORACION LOGISTICA DEL CENTRO SAC',
      limiteCredito: 350000,
      deudaTotal: 142300.50,
      corriente: 110000.00,
      vencido1_30: 32300.50,
      vencido31_60: 0,
      vencido90Mas: 0,
      semaforo: 'Normal',
    },
    {
      id: '3',
      ruc: '20508778920',
      cliente: 'INVERSIONES QUISSEL SRL',
      limiteCredito: 80000,
      deudaTotal: 65400.00,
      corriente: 15000.00,
      vencido1_30: 25000.00,
      vencido31_60: 25400.00,
      vencido90Mas: 0,
      semaforo: 'Precaución',
    },
    {
      id: '4',
      ruc: '20353607783',
      cliente: 'MERCANTIL INCA S.A.',
      limiteCredito: 50000,
      deudaTotal: 49800.00,
      corriente: 0,
      vencido1_30: 5000.00,
      vencido31_60: 12000.00,
      vencido90Mas: 32800.00,
      semaforo: 'Crítico',
    },
    {
      id: '5',
      ruc: '20451583060',
      cliente: 'BODEGAS DON LUIS S.A.C.',
      limiteCredito: 30000,
      deudaTotal: 18200.00,
      corriente: 12000.00,
      vencido1_30: 6200.00,
      vencido31_60: 0,
      vencido90Mas: 0,
      semaforo: 'Normal',
    },
    {
      id: '6',
      ruc: '20539721870',
      cliente: 'PROTEKTOR SEGURIDAD INTEGRAL S.A.C.',
      limiteCredito: 100000,
      deudaTotal: 78900.00,
      corriente: 20000.00,
      vencido1_30: 18900.00,
      vencido31_60: 40000.00,
      vencido90Mas: 0,
      semaforo: 'Precaución',
    },
  ]);

  protected handleAction(evt: { actionId: string; item: AntiguedadRegistro }): void {
    console.info(`Acción ${evt.actionId} para cliente con deuda:`, evt.item.cliente);
  }
}
