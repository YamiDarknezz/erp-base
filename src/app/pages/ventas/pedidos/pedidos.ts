import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

export interface Pedido {
  id: string;
  codigo: string;
  cliente: string;
  vendedor: string;
  fecha: string;
  total: number;
  estado: 'Pendiente' | 'Aprobado' | 'Facturado' | 'Anulado';
}

@Component({
  selector: 'app-pedidos',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './pedidos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pedidos {
  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal('Todos');

  protected readonly pedidos = signal<Pedido[]>([
    { id: '1', codigo: 'PED-2026-0891', cliente: 'SUPERMERCADOS METRO S.A.', vendedor: 'Carlos Rivas', fecha: '07/11/2026', total: 4850.50, estado: 'Aprobado' },
    { id: '2', codigo: 'PED-2026-0892', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', vendedor: 'Lucía Mendoza', fecha: '07/11/2026', total: 12400.00, estado: 'Pendiente' },
    { id: '3', codigo: 'PED-2026-0893', cliente: 'TIENDAS TAMBO SAC', vendedor: 'Carlos Rivas', fecha: '06/11/2026', total: 3200.75, estado: 'Facturado' },
    { id: '4', codigo: 'PED-2026-0894', cliente: 'BODEGAS UNIDAS LIMA', vendedor: 'Jorge Campos', fecha: '06/11/2026', total: 1890.00, estado: 'Aprobado' },
    { id: '5', codigo: 'PED-2026-0895', cliente: 'COMERCIAL EL SOL S.R.L.', vendedor: 'Lucía Mendoza', fecha: '05/11/2026', total: 7650.20, estado: 'Pendiente' },
    { id: '6', codigo: 'PED-2026-0896', cliente: 'INVERSIONES SAN ROQUE', vendedor: 'Jorge Campos', fecha: '05/11/2026', total: 950.00, estado: 'Anulado' },
  ]);

  protected readonly filteredPedidos = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const st = this.statusFilter();
    return this.pedidos().filter(p => {
      const matchQ = p.codigo.toLowerCase().includes(q) || p.cliente.toLowerCase().includes(q) || p.vendedor.toLowerCase().includes(q);
      const matchSt = st === 'Todos' || p.estado === st;
      return matchQ && matchSt;
    });
  });

  protected readonly totalVentas = computed(() => {
    return this.pedidos().reduce((acc, p) => acc + (p.estado !== 'Anulado' ? p.total : 0), 0);
  });
}
