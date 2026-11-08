import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../shared/components/data-grid/data-grid';

export interface GrupoProducto {
  id: string;
  codigo: string;
  nombre: string;
  categoriaPadre: string;
  totalSkus: number;
  margenSugerido: string;
  estado: string;
}

@Component({
  selector: 'app-grupos',
  imports: [DataGrid],
  templateUrl: './grupos.html',
  styleUrl: './grupos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grupos {
  protected readonly columns: GridColumn[] = [
    { field: 'codigo', header: 'CÓDIGO', width: '90px', align: 'left' },
    { field: 'nombre', header: 'GRUPO / FAMILIA', minWidth: '220px' },
    { field: 'categoriaPadre', header: 'CATEGORÍA GENERAL', width: '180px' },
    { field: 'totalSkus', header: 'TOTAL SKUs', width: '100px', align: 'center', type: 'number' },
    { field: 'margenSugerido', header: 'MARGEN BASE', width: '120px', align: 'right' },
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
    { id: 'view', icon: 'view', title: 'Ver SKUs de la familia', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Editar parámetros de familia', color: 'emerald' },
  ];

  protected readonly grupos = signal<GrupoProducto[]>([
    { id: '1', codigo: 'GRP-01', nombre: 'Bebidas Gasificadas y Aguas', categoriaPadre: 'Bebidas y Líquidos', totalSkus: 28, margenSugerido: '18.5%', estado: 'Activo' },
    { id: '2', codigo: 'GRP-02', nombre: 'Lácteos, Yogures y Quesos', categoriaPadre: 'Perecibles Refrigerados', totalSkus: 34, margenSugerido: '14.0%', estado: 'Activo' },
    { id: '3', codigo: 'GRP-03', nombre: 'Abarrotes Secos y Granos', categoriaPadre: 'Alimentos Básicos', totalSkus: 52, margenSugerido: '12.0%', estado: 'Activo' },
    { id: '4', codigo: 'GRP-04', nombre: 'Golosinas y Snacks Salados', categoriaPadre: 'Confitería e Impulso', totalSkus: 45, margenSugerido: '24.0%', estado: 'Activo' },
    { id: '5', codigo: 'GRP-05', nombre: 'Cuidado del Hogar y Limpieza', categoriaPadre: 'No Comestibles', totalSkus: 19, margenSugerido: '21.0%', estado: 'Activo' },
  ]);

  protected handleNew(): void {
    console.info('Crear nuevo grupo');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} sobre grupo:`, evt.item.codigo);
  }
}
