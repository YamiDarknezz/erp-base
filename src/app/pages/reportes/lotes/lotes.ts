import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../shared/components/data-grid/data-grid';

export interface LoteTrazabilidad {
  id: string;
  lote: string;
  sku: string;
  descripcion: string;
  fechaFabricacion: string;
  fechaVencimiento: string;
  diasParaVencer: number;
  cantidadDisponible: number;
  unidad: string;
  estadoVencimiento: string;
}

@Component({
  selector: 'app-lotes',
  imports: [DataGrid],
  templateUrl: './lotes.html',
  styleUrl: './lotes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lotes {
  protected readonly columns: GridColumn[] = [
    { field: 'lote', header: 'N° LOTE', width: '120px', align: 'left' },
    { field: 'sku', header: 'SKU', width: '110px', align: 'left' },
    { field: 'descripcion', header: 'DESCRIPCIÓN ARTÍCULO', minWidth: '240px' },
    { field: 'fechaFabricacion', header: 'F. FABRICACIÓN', width: '120px', align: 'center', type: 'date' },
    { field: 'fechaVencimiento', header: 'F. VENCIMIENTO', width: '120px', align: 'center', type: 'date' },
    { field: 'diasParaVencer', header: 'DÍAS VIGENCIA', width: '110px', align: 'right', type: 'number' },
    { field: 'cantidadDisponible', header: 'CANTIDAD', width: '100px', align: 'right', type: 'number' },
    { field: 'unidad', header: 'UNIDAD', width: '80px', align: 'center' },
    {
      field: 'estadoVencimiento',
      header: 'CONDICIÓN',
      width: '120px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) => {
        if (v === 'Vencido') return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
        if (v === 'Por Vencer (<30d)') return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver trazabilidad de entradas/salidas', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Imprimir certificado de lote', color: 'blue' },
  ];

  protected readonly lotes = signal<LoteTrazabilidad[]>([
    { id: '1', lote: 'LOT-2026-A11', sku: 'SKU-00101', descripcion: 'GASEOSA COLA 3L PAQUETE X4', fechaFabricacion: '15/09/2026', fechaVencimiento: '15/09/2027', diasParaVencer: 312, cantidadDisponible: 730, unidad: 'PQT', estadoVencimiento: 'Vigente' },
    { id: '2', lote: 'LOT-2026-B04', sku: 'SKU-00102', descripcion: 'JUGO NÉCTAR DURAZNO 1L PACK X6', fechaFabricacion: '10/06/2026', fechaVencimiento: '25/11/2026', diasParaVencer: 18, cantidadDisponible: 15, unidad: 'CJ', estadoVencimiento: 'Por Vencer (<30d)' },
    { id: '3', lote: 'LOT-2026-C89', sku: 'SKU-00103', descripcion: 'GALLETA DE SODA FAMILIAR 400G', fechaFabricacion: '01/08/2026', fechaVencimiento: '01/08/2027', diasParaVencer: 267, cantidadDisponible: 340, unidad: 'CJ', estadoVencimiento: 'Vigente' },
    { id: '4', lote: 'LOT-2026-D12', sku: 'SKU-00104', descripcion: 'LECHE EVAPORADA ENTERA 400G PACK X24', fechaFabricacion: '20/07/2026', fechaVencimiento: '20/07/2027', diasParaVencer: 255, cantidadDisponible: 540, unidad: 'CJ', estadoVencimiento: 'Vigente' },
    { id: '5', lote: 'LOT-2025-X02', sku: 'SKU-00105', descripcion: 'ACEITE VEGETAL 900ML CAJA X12', fechaFabricacion: '12/10/2025', fechaVencimiento: '12/10/2026', diasParaVencer: -26, cantidadDisponible: 20, unidad: 'CJ', estadoVencimiento: 'Vencido' },
  ]);

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} sobre lote:`, evt.item.lote);
  }
}
