import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../shared/components/data-grid/data-grid';

export interface ArticuloSku {
  id: string;
  sku: string;
  descripcion: string;
  grupo: string;
  marca: string;
  unidad: string;
  precioVenta: number;
  costoPromedio: number;
  estado: string;
}

@Component({
  selector: 'app-articulos',
  imports: [DataGrid],
  templateUrl: './articulos.html',
  styleUrl: './articulos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Articulos {
  protected readonly columns: GridColumn[] = [
    { field: 'sku', header: 'SKU', width: '110px', align: 'left' },
    { field: 'descripcion', header: 'DESCRIPCIÓN COMERCIAL', minWidth: '260px' },
    { field: 'grupo', header: 'GRUPO / FAMILIA', width: '160px' },
    { field: 'marca', header: 'MARCA', width: '140px' },
    { field: 'unidad', header: 'UNIDAD', width: '80px', align: 'center' },
    { field: 'costoPromedio', header: 'COSTO PROM. (S/)', width: '130px', align: 'right', type: 'currency' },
    { field: 'precioVenta', header: 'PRECIO VENTA (S/)', width: '130px', align: 'right', type: 'currency' },
    {
      field: 'estado',
      header: 'ESTADO',
      width: '95px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) =>
        v === 'Activo'
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ficha técnica del SKU', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Modificar datos del artículo', color: 'emerald' },
    { id: 'delete', icon: 'delete', title: 'Desactivar SKU', color: 'rose' },
  ];

  protected readonly articulos = signal<ArticuloSku[]>([
    { id: '1', sku: 'SKU-00101', descripcion: 'GASEOSA COLA 3L PAQUETE X4', grupo: 'Bebidas Gasificadas', marca: 'Global Drink', unidad: 'PQT', costoPromedio: 18.50, precioVenta: 26.00, estado: 'Activo' },
    { id: '2', sku: 'SKU-00102', descripcion: 'JUGO NÉCTAR DURAZNO 1L PACK X6', grupo: 'Jugos y Néctares', marca: 'FrutaSol', unidad: 'CJ', costoPromedio: 22.00, precioVenta: 31.50, estado: 'Activo' },
    { id: '3', sku: 'SKU-00103', descripcion: 'GALLETA DE SODA FAMILIAR 400G', grupo: 'Abarrotes y Harinas', marca: 'TrigoDorado', unidad: 'CJ', costoPromedio: 34.00, precioVenta: 48.00, estado: 'Activo' },
    { id: '4', sku: 'SKU-00104', descripcion: 'LECHE EVAPORADA ENTERA 400G PACK X24', grupo: 'Lácteos y Derivados', marca: 'VacaPur', unidad: 'CJ', costoPromedio: 78.50, precioVenta: 96.00, estado: 'Activo' },
    { id: '5', sku: 'SKU-00105', descripcion: 'ACEITE VEGETAL 900ML CAJA X12', grupo: 'Aceites Comestibles', marca: 'Girasol Real', unidad: 'CJ', costoPromedio: 64.00, precioVenta: 82.50, estado: 'Activo' },
  ]);

  protected handleNew(): void {
    console.info('Crear nuevo artículo SKU');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} sobre SKU:`, evt.item.sku);
  }
}
