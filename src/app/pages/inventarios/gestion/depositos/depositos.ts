import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';

export interface Deposito {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  direccion: string;
  responsable: string;
  capacidadUtilizada: string;
  estado: string;
}

@Component({
  selector: 'app-depositos',
  imports: [DataGrid],
  templateUrl: './depositos.html',
  styleUrl: './depositos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Depositos {
  protected readonly columns: GridColumn[] = [
    { field: 'codigo', header: 'CÓDIGO', width: '90px', align: 'left' },
    { field: 'nombre', header: 'NOMBRE DEL DEPÓSITO', minWidth: '220px' },
    { field: 'tipo', header: 'TIPO ALMACÉN', width: '150px' },
    { field: 'direccion', header: 'UBICACIÓN / DIRECCIÓN', minWidth: '240px' },
    { field: 'responsable', header: 'RESPONSABLE', width: '160px' },
    { field: 'capacidadUtilizada', header: 'OCUPACIÓN', width: '110px', align: 'center' },
    {
      field: 'estado',
      header: 'ESTADO',
      width: '95px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (v: unknown) =>
        v === 'Operativo'
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver existencias del depósito', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Configurar parámetros de almacén', color: 'emerald' },
  ];

  protected readonly depositos = signal<Deposito[]>([
    { id: '1', codigo: 'ALM-01', nombre: 'Almacén Central Principal', tipo: 'Principal / Despacho', direccion: 'Av. Nicolás Arriola 1840, La Victoria', responsable: 'Manuel Quispe', capacidadUtilizada: '84.5%', estado: 'Operativo' },
    { id: '2', codigo: 'ALM-02', nombre: 'Depósito Pulmón Callao', tipo: 'Tránsito / Pulmón', direccion: 'Av. Elmer Faucett 3400, Callao', responsable: 'David Cornejo', capacidadUtilizada: '62.0%', estado: 'Operativo' },
    { id: '3', codigo: 'ALM-03', nombre: 'Sucursal Norte Los Olivos', tipo: 'Distribución Local', direccion: 'Av. Alfredo Mendiola 5890, Los Olivos', responsable: 'Rosa Huamán', capacidadUtilizada: '78.2%', estado: 'Operativo' },
    { id: '4', codigo: 'ALM-04', nombre: 'Cámara de Frío N°1', tipo: 'Refrigerados', direccion: 'Av. Nicolás Arriola 1840, La Victoria', responsable: 'Alberto Vega', capacidadUtilizada: '91.0%', estado: 'Operativo' },
  ]);

  protected handleNew(): void {
    console.info('Crear nuevo depósito');
  }

  protected handleAction(evt: { actionId: string; item: any }): void {
    console.info(`Acción ${evt.actionId} sobre depósito:`, evt.item.codigo);
  }
}
