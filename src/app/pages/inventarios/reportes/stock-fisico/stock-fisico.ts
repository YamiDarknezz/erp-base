import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface StockFisicoItem {
  id: string;
  sku: string;
  descripcion: string;
  deposito: string;
  ubicacionRack: string;
  stockContado: number;
  stockSistema: number;
  diferencia: number;
  unidad: string;
  estadoInventario: string;
}

@Component({
  selector: 'app-stock-fisico',
  imports: [DataGrid],
  templateUrl: './stock-fisico.html',
  styleUrl: './stock-fisico.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockFisico {
  protected readonly columns: GridColumn[] = [
    { field: 'sku', header: 'SKU', width: '110px', align: 'left' },
    { field: 'descripcion', header: 'DESCRIPCIÓN ARTÍCULO', minWidth: '260px' },
    { field: 'deposito', header: 'DEPÓSITO', width: '160px' },
    { field: 'ubicacionRack', header: 'RACK / POSICIÓN', width: '130px', align: 'center' },
    { field: 'stockSistema', header: 'STOCK SISTEMA', width: '120px', align: 'right', type: 'number' },
    { field: 'stockContado', header: 'STOCK FÍSICO', width: '120px', align: 'right', type: 'number' },
    { field: 'diferencia', header: 'DIFERENCIA', width: '100px', align: 'right', type: 'number' },
    { field: 'unidad', header: 'UNIDAD', width: '80px', align: 'center' },
    {
      field: 'estadoInventario',
      header: 'CONCILIACIÓN',
      width: '120px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) => {
        if (v === 'Faltante') return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        if (v === 'Sobrante') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar boleta de conteo físico', color: 'primary' },
    { id: 'check', icon: 'check', title: 'Aprobar ajuste de inventario', color: 'emerald' },
  ];

  protected readonly reporte = signal<StockFisicoItem[]>([
    { id: '1', sku: 'SKU-00101', descripcion: 'GASEOSA COLA 3L PAQUETE X4', deposito: 'Almacén Central', ubicacionRack: 'R-01-A-04', stockSistema: 850, stockContado: 850, diferencia: 0, unidad: 'PQT', estadoInventario: 'Cuadrado' },
    { id: '2', sku: 'SKU-00102', descripcion: 'JUGO NÉCTAR DURAZNO 1L PACK X6', deposito: 'Almacén Central', ubicacionRack: 'R-02-B-01', stockSistema: 110, stockContado: 108, diferencia: -2, unidad: 'CJ', estadoInventario: 'Faltante' },
    { id: '3', sku: 'SKU-00103', descripcion: 'GALLETA DE SODA FAMILIAR 400G', deposito: 'Depósito Callao', ubicacionRack: 'R-04-C-02', stockSistema: 420, stockContado: 420, diferencia: 0, unidad: 'CJ', estadoInventario: 'Cuadrado' },
    { id: '4', sku: 'SKU-00104', descripcion: 'LECHE EVAPORADA ENTERA 400G PACK X24', deposito: 'Almacén Central', ubicacionRack: 'R-01-D-03', stockSistema: 680, stockContado: 685, diferencia: +5, unidad: 'CJ', estadoInventario: 'Sobrante' },
    { id: '5', sku: 'SKU-00105', descripcion: 'ACEITE VEGETAL 900ML CAJA X12', deposito: 'Sucursal Norte', ubicacionRack: 'R-03-A-01', stockSistema: 90, stockContado: 90, diferencia: 0, unidad: 'CJ', estadoInventario: 'Cuadrado' },
  ]);

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} sobre stock físico:`, evt.item.sku);
  }
}
