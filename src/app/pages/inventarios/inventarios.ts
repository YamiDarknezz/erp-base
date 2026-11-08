import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../shared/components/data-grid/data-grid';

export interface ArticuloInventario {
  id: string;
  sku: string;
  descripcion: string;
  deposito: string;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  precioUnitario: number;
}

@Component({
  selector: 'app-inventarios',
  imports: [DataGrid],
  templateUrl: './inventarios.html',
  styleUrl: './inventarios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inventarios {
  protected readonly columns: GridColumn[] = [
    { field: 'sku', header: 'SKU', width: '120px', align: 'left' },
    { field: 'descripcion', header: 'DESCRIPCIÓN ARTÍCULO', minWidth: '260px' },
    { field: 'deposito', header: 'DEPÓSITO / ALMACÉN', width: '180px' },
    { field: 'unidad', header: 'UNIDAD', width: '80px', align: 'center' },
    { field: 'stockActual', header: 'STOCK ACTUAL', width: '110px', align: 'right', type: 'number' },
    { field: 'stockMinimo', header: 'STOCK MÍN', width: '100px', align: 'right', type: 'number' },
    { field: 'precioUnitario', header: 'PRECIO UNIT. (S/)', width: '120px', align: 'right', type: 'currency' },
    {
      field: 'estadoStock',
      header: 'ESTADO',
      width: '110px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        return val === 'Bajo Mínimo'
          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'kardex', icon: 'file', title: 'Consultar Kardex de movimientos', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Editar parámetros de reposición', color: 'emerald' },
  ];

  protected readonly articulos = signal<(ArticuloInventario & { estadoStock: string })[]>([
    { id: '1', sku: 'SKU-00109', descripcion: 'BEBIDA ENERGIZANTE 500ML SIX-PACK', deposito: 'Almacén Central Lima', stockActual: 1250, stockMinimo: 300, unidad: 'CJ', precioUnitario: 32.50, estadoStock: 'Normal' },
    { id: '2', sku: 'SKU-00110', descripcion: 'AGUA MINERAL SIN GAS 2.5L PACK X6', deposito: 'Almacén Central Lima', stockActual: 80, stockMinimo: 150, unidad: 'CJ', precioUnitario: 18.00, estadoStock: 'Bajo Mínimo' },
    { id: '3', sku: 'SKU-00215', descripcion: 'DETERGENTE MULTIUSO 4.5KG BOLSA', deposito: 'Depósito Callao', stockActual: 420, stockMinimo: 200, unidad: 'BL', precioUnitario: 24.80, estadoStock: 'Normal' },
    { id: '4', sku: 'SKU-00301', descripcion: 'ACEITE VEGETAL PREMIUM 1L BOTELLA', deposito: 'Sucursal Norte', stockActual: 25, stockMinimo: 100, unidad: 'CJ', precioUnitario: 68.00, estadoStock: 'Bajo Mínimo' },
    { id: '5', sku: 'SKU-00450', descripcion: 'ARROZ EXTRA SELECCIONADO 50KG', deposito: 'Almacén Central Lima', stockActual: 600, stockMinimo: 150, unidad: 'SA', precioUnitario: 145.00, estadoStock: 'Normal' },
  ]);

  protected handleNew(): void {
    console.info('Nuevo artículo solicitado');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} ejecutada para SKU:`, evt.item.sku);
  }
}
