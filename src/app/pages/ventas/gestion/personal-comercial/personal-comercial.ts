import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface AsesorComercial {
  id: string;
  codigo: string;
  nombre: string;
  rol: string;
  zona: string;
  telefono: string;
  cuotaMensual: number;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-personal-comercial',
  imports: [DataGrid],
  templateUrl: './personal-comercial.html',
  styleUrl: './personal-comercial.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalComercial {
  protected readonly columns: GridColumn[] = [
    { field: 'codigo', header: 'CÓDIGO', width: '90px', align: 'center' },
    { field: 'nombre', header: 'NOMBRE COMPLETO', minWidth: '220px' },
    { field: 'rol', header: 'CARGO / ROL', width: '160px' },
    { field: 'zona', header: 'ZONA ASIGNADA', width: '150px' },
    { field: 'telefono', header: 'TELÉFONO', width: '120px', align: 'center' },
    { field: 'cuotaMensual', header: 'CUOTA MES (S/)', width: '140px', align: 'right', type: 'currency' },
    {
      field: 'estado',
      header: 'ESTADO',
      width: '100px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) =>
        v === 'Activo'
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver cartera y metas asignadas', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Editar datos del asesor', color: 'emerald' },
    { id: 'delete', icon: 'delete', title: 'Desactivar asesor', color: 'rose' },
  ];

  protected readonly personal = signal<AsesorComercial[]>([
    { id: 'p1', codigo: 'VEN-001', nombre: 'Carlos Rivas Sánchez', rol: 'Ejecutivo Senior', zona: 'Lima Centro / Breña', telefono: '984512340', cuotaMensual: 100000.00, estado: 'Activo' },
    { id: 'p2', codigo: 'VEN-002', nombre: 'Lucía Mendoza Ortiz', rol: 'Ejecutiva Mayorista', zona: 'Lima Norte / Cono', telefono: '976123450', cuotaMensual: 95000.00, estado: 'Activo' },
    { id: 'p3', codigo: 'VEN-003', nombre: 'Jorge Campos Paredes', rol: 'Preventista Junior', zona: 'Lima Sur / Chorrillos', telefono: '991234567', cuotaMensual: 75000.00, estado: 'Activo' },
    { id: 'p4', codigo: 'SUP-001', nombre: 'Mariana Vega Luna', rol: 'Supervisora Comercial', zona: 'Regional Lima Metropolitana', telefono: '954321980', cuotaMensual: 350000.00, estado: 'Activo' },
  ]);

  protected handleNew(): void {
    console.info('Nuevo asesor comercial solicitado');
  }

  protected handleAction(evt: { actionId: string; item: AsesorComercial }): void {
    console.info(`Acción ${evt.actionId} ejecutada para asesor:`, evt.item.nombre);
  }
}
