import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface MovimientoKardex {
  id: string;
  fecha: string;
  sku: string;
  descripcion: string;
  tipoMovimiento: string;
  comprobante: string;
  almacen: string;
  cantidadEntrada: number;
  cantidadSalida: number;
  saldoCantidad: number;
  costoUnitario: number;
  saldoValorizado: number;
}

@Component({
  selector: 'app-kardex',
  imports: [DataGrid],
  templateUrl: './kardex.html',
  styleUrl: './kardex.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kardex {
  protected readonly columns: GridColumn[] = [
    { field: 'fecha', header: 'FECHA / HORA', width: '130px', align: 'center' },
    { field: 'sku', header: 'SKU', width: '110px', align: 'left' },
    { field: 'descripcion', header: 'DESCRIPCIÓN ARTÍCULO', minWidth: '240px' },
    { field: 'almacen', header: 'DEPÓSITO', width: '150px' },
    {
      field: 'tipoMovimiento',
      header: 'OPERACIÓN',
      width: '120px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) => {
        if (v === 'Ingreso Compra' || v === 'Ajuste Entrada') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
        if (v === 'Salida Venta' || v === 'Merma') return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      },
    },
    { field: 'comprobante', header: 'N° DOCUMENTO', width: '130px', align: 'center' },
    { field: 'cantidadEntrada', header: 'ENTRADA', width: '85px', align: 'right', type: 'number' },
    { field: 'cantidadSalida', header: 'SALIDA', width: '85px', align: 'right', type: 'number' },
    { field: 'saldoCantidad', header: 'SALDO', width: '85px', align: 'right', type: 'number' },
    { field: 'costoUnitario', header: 'COSTO UNIT. (S/)', width: '120px', align: 'right', type: 'currency' },
    { field: 'saldoValorizado', header: 'VALORIZADO (S/)', width: '130px', align: 'right', type: 'currency' },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar detalle de trazabilidad', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Imprimir vale de movimiento', color: 'blue' },
  ];

  protected readonly movimientos = signal<MovimientoKardex[]>([
    {
      id: 'k1',
      fecha: '08/11/2026 08:30',
      sku: 'SKU-00109',
      descripcion: 'BEBIDA ENERGIZANTE 500ML SIX-PACK',
      almacen: 'Almacén Central Lima',
      tipoMovimiento: 'Ingreso Compra',
      comprobante: 'FAC-001-09823',
      cantidadEntrada: 500,
      cantidadSalida: 0,
      saldoCantidad: 1250,
      costoUnitario: 24.50,
      saldoValorizado: 30625.00,
    },
    {
      id: 'k2',
      fecha: '08/11/2026 09:15',
      sku: 'SKU-00109',
      descripcion: 'BEBIDA ENERGIZANTE 500ML SIX-PACK',
      almacen: 'Almacén Central Lima',
      tipoMovimiento: 'Salida Venta',
      comprobante: 'BV-004-12401',
      cantidadEntrada: 0,
      cantidadSalida: 120,
      saldoCantidad: 1130,
      costoUnitario: 24.50,
      saldoValorizado: 27685.00,
    },
    {
      id: 'k3',
      fecha: '08/11/2026 10:00',
      sku: 'SKU-00110',
      descripcion: 'AGUA MINERAL SIN GAS 2.5L PACK X6',
      almacen: 'Almacén Central Lima',
      tipoMovimiento: 'Salida Venta',
      comprobante: 'FAC-002-05412',
      cantidadEntrada: 0,
      cantidadSalida: 40,
      saldoCantidad: 80,
      costoUnitario: 12.80,
      saldoValorizado: 1024.00,
    },
    {
      id: 'k4',
      fecha: '08/11/2026 11:20',
      sku: 'SKU-00215',
      descripcion: 'DETERGENTE MULTIUSO 4.5KG BOLSA',
      almacen: 'Depósito Callao',
      tipoMovimiento: 'Ingreso Compra',
      comprobante: 'FAC-008-01290',
      cantidadEntrada: 200,
      cantidadSalida: 0,
      saldoCantidad: 420,
      costoUnitario: 18.20,
      saldoValorizado: 7644.00,
    },
    {
      id: 'k5',
      fecha: '08/11/2026 12:45',
      sku: 'SKU-00301',
      descripcion: 'ACEITE VEGETAL PREMIUM 1L BOTELLA',
      almacen: 'Sucursal Norte',
      tipoMovimiento: 'Transferencia',
      comprobante: 'TR-001-00045',
      cantidadEntrada: 50,
      cantidadSalida: 0,
      saldoCantidad: 75,
      costoUnitario: 52.00,
      saldoValorizado: 3900.00,
    },
  ]);

  protected handleNew(): void {
    console.info('Nuevo movimiento kardex solicitado');
  }

  protected handleAction(evt: { actionId: string; item: MovimientoKardex }): void {
    console.info(`Acción ${evt.actionId} ejecutada para Kardex doc:`, evt.item.comprobante);
  }
}
