import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

export interface OrdenPedido {
  id: string;
  numero: string;
  cliente: string;
  zona: string;
  items: number;
  total: number;
  prioridad: 'Alta' | 'Normal' | 'Urgente';
}

@Component({
  selector: 'app-ordenes-pedido',
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Órdenes de Pedido</h1>
          <p class="text-xs text-on-surface-variant">Preventa comercial y asignación a picking</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            title="Nueva orden"
            aria-label="Nueva orden"
            class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            title="Actualizar listado"
            aria-label="Actualizar listado"
            class="w-8 h-8 rounded-lg border border-outline bg-surface text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>
      </div>

      <div class="rounded-xl bg-surface border border-outline shadow-xs overflow-hidden">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-surface-alt border-b border-outline text-on-surface-variant uppercase text-[10px] tracking-wider">
              <th class="py-2.5 px-4 font-bold">N° Orden</th>
              <th class="py-2.5 px-4 font-bold">Cliente</th>
              <th class="py-2.5 px-4 font-bold">Zona</th>
              <th class="py-2.5 px-4 font-bold text-center">Items</th>
              <th class="py-2.5 px-4 font-bold text-right">Importe</th>
              <th class="py-2.5 px-4 font-bold text-center">Prioridad</th>
              <th class="py-2.5 px-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/60">
            @for (o of ordenes(); track o.id) {
              <tr class="hover:bg-surface-muted/60 transition-colors">
                <td class="py-2.5 px-4 font-mono font-bold text-primary">{{ o.numero }}</td>
                <td class="py-2.5 px-4 font-medium text-on-surface">{{ o.cliente }}</td>
                <td class="py-2.5 px-4 text-on-surface-variant">{{ o.zona }}</td>
                <td class="py-2.5 px-4 text-center font-mono">{{ o.items }}</td>
                <td class="py-2.5 px-4 font-bold text-right text-on-surface">S/ {{ o.total | number:'1.2-2' }}</td>
                <td class="py-2.5 px-4 text-center">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [class.bg-rose-100]="o.prioridad === 'Urgente'"
                    [class.text-rose-800]="o.prioridad === 'Urgente'"
                    [class.bg-amber-100]="o.prioridad === 'Alta'"
                    [class.text-amber-800]="o.prioridad === 'Alta'"
                    [class.bg-slate-100]="o.prioridad === 'Normal'"
                    [class.text-slate-700]="o.prioridad === 'Normal'"
                  >
                    {{ o.prioridad }}
                  </span>
                </td>
                <td class="py-2.5 px-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      title="Procesar orden"
                      aria-label="Procesar orden"
                      class="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class OrdenesPedido {
  protected readonly ordenes = signal<OrdenPedido[]>([
    { id: '1', numero: 'ORD-5401', cliente: 'CENTRO COMERCIAL NORTE', zona: 'Lima Norte', items: 18, total: 3450.00, prioridad: 'Urgente' },
    { id: '2', numero: 'ORD-5402', cliente: 'CADENA DE GRIFOS SUR', zona: 'Lima Sur', items: 8, total: 1200.50, prioridad: 'Normal' },
    { id: '3', numero: 'ORD-5403', cliente: 'DISTRIBUIDORA CALLAO', zona: 'Callao', items: 32, total: 8900.00, prioridad: 'Alta' },
    { id: '4', numero: 'ORD-5404', cliente: 'MINIMARKET EXPRESS', zona: 'Lima Centro', items: 5, total: 720.00, prioridad: 'Normal' },
  ]);
}
