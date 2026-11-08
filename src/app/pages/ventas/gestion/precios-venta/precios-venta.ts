import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface ListaPrecio {
  id: string;
  codigoLista: string;
  nombreLista: string;
  canal: string;
  moneda: string;
  margenSugerido: string;
  vigenciaDesde: string;
  vigenciaHasta: string;
  estado: 'Vigente' | 'Cerrada';
}

@Component({
  selector: 'app-precios-venta',
  imports: [DataGrid],
  templateUrl: './precios-venta.html',
  styleUrl: './precios-venta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreciosVenta {
  protected readonly columns: GridColumn[] = [
    { field: 'codigoLista', header: 'CÓD. LISTA', width: '100px', align: 'center' },
    { field: 'nombreLista', header: 'DENOMINACIÓN DE LISTA', minWidth: '240px' },
    { field: 'canal', header: 'CANAL / SEGMENTO', width: '160px' },
    { field: 'moneda', header: 'MONEDA', width: '80px', align: 'center' },
    { field: 'margenSugerido', header: 'MARGEN BASE', width: '110px', align: 'center' },
    { field: 'vigenciaDesde', header: 'DESDE', width: '100px', align: 'center', type: 'date' },
    { field: 'vigenciaHasta', header: 'HASTA', width: '100px', align: 'center', type: 'date' },
    {
      field: 'estado',
      header: 'ESTADO',
      width: '100px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) =>
        v === 'Vigente'
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Consultar escala de precios por SKU', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Ajustar porcentajes de descuento', color: 'emerald' },
    { id: 'print', icon: 'print', title: 'Exportar catálogo oficial en PDF', color: 'blue' },
  ];

  protected readonly precios = signal<ListaPrecio[]>([
    { id: 'lp1', codigoLista: 'LP-MAY-01', nombreLista: 'Precios Mayoristas Distribución Directa', canal: 'Mayorista / Distribuidores', moneda: 'PEN (S/)', margenSugerido: '18.5%', vigenciaDesde: '01/01/2026', vigenciaHasta: '31/12/2026', estado: 'Vigente' },
    { id: 'lp2', codigoLista: 'LP-COB-02', nombreLista: 'Precios Cobertura Bodegas y Mercados', canal: 'Minorista / Tradicional', moneda: 'PEN (S/)', margenSugerido: '24.0%', vigenciaDesde: '01/01/2026', vigenciaHasta: '31/12/2026', estado: 'Vigente' },
    { id: 'lp3', codigoLista: 'LP-INS-03', nombreLista: 'Precios Institucionales y Corporativos', canal: 'Institucional / Horeca', moneda: 'PEN (S/)', margenSugerido: '15.0%', vigenciaDesde: '01/02/2026', vigenciaHasta: '30/06/2026', estado: 'Vigente' },
    { id: 'lp4', codigoLista: 'LP-ESP-04', nombreLista: 'Campaña Especial Fin de Temporada', canal: 'Todos los canales', moneda: 'PEN (S/)', margenSugerido: '12.0%', vigenciaDesde: '01/10/2026', vigenciaHasta: '31/10/2026', estado: 'Cerrada' },
  ]);

  protected handleNew(): void {
    console.info('Nueva lista de precios solicitada');
  }

  protected handleAction(evt: { actionId: string; item: ListaPrecio }): void {
    console.info(`Acción ${evt.actionId} ejecutada para lista:`, evt.item.codigoLista);
  }
}
