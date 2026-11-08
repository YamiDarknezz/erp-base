import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex flex-col bg-surface overflow-hidden select-none text-on-surface">
      <!-- ── BARRA SUPERIOR DE HERRAMIENTAS Y ACCIONES (ALTA DENSIDAD) ── -->
      <div class="h-9 px-2 bg-surface border-b border-outline flex items-center justify-between gap-2 shrink-0">
        <div class="flex items-center gap-2">
          <!-- Botón Nueva Orden (+) -->
          <button
            type="button"
            title="Nueva orden de pedido"
            aria-label="Nueva orden"
            class="w-6 h-6 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <!-- Filtro de Prioridad -->
          <select
            [(ngModel)]="filterPrioridad"
            class="h-6 text-[11px] px-1.5 rounded-xs border border-outline bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="Todas">Todas las Prioridades</option>
            <option value="Urgente">Urgente</option>
            <option value="Alta">Alta</option>
            <option value="Normal">Normal</option>
          </select>

          <!-- Buscador Compacto -->
          <div class="relative flex items-center">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Buscar orden o cliente..."
              class="h-6 text-[11px] pl-2 pr-6 rounded-xs border border-outline bg-surface text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-1 focus:ring-primary w-44 sm:w-64"
            />
            <svg class="w-3 h-3 text-on-surface-muted absolute right-1.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <!-- Herramientas Rápidas -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            title="Exportar órdenes"
            aria-label="Exportar órdenes"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            type="button"
            title="Actualizar listado"
            aria-label="Actualizar listado"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ── TABLA ALTA DENSIDAD ── -->
      <div class="flex-1 overflow-auto bg-surface">
        <table class="w-full text-left border-collapse text-[11px] font-sans">
          <thead class="sticky top-0 z-10 select-none shadow-xs">
            <tr class="bg-[#1e6fba] dark:bg-[#1a5a96] text-white text-[10px] font-bold uppercase tracking-wider">
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28">
                <div class="flex items-center justify-between gap-1">
                  <span>N° ORDEN</span>
                  <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                </div>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-60">
                <div class="flex items-center justify-between gap-1">
                  <span>CLIENTE</span>
                  <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                </div>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-36">
                <span>ZONA / RUTA</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-16 text-center">
                <span>ITEMS</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28 text-right">
                <span>IMPORTE (S/)</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24 text-center">
                <span>PRIORIDAD</span>
              </th>
              <th class="py-1 px-2 whitespace-nowrap min-w-24 text-center">
                <span>ACCIONES</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/50">
            @for (o of filteredOrdenes(); track o.id; let idx = $index) {
              <tr
                class="h-6.5 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors"
                [class.bg-surface-alt]="idx % 2 === 1"
              >
                <td class="py-0.5 px-2 border-r border-outline/70 font-mono font-bold text-primary">
                  {{ o.numero }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 font-medium text-on-surface truncate max-w-xs">
                  {{ o.cliente }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-on-surface-variant">
                  {{ o.zona }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-center font-mono text-on-surface-muted">
                  {{ o.items }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono font-bold text-on-surface">
                  S/ {{ o.total | number:'1.2-2' }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-center">
                  @switch (o.prioridad) {
                    @case ('Urgente') {
                      <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Urgente</span>
                    }
                    @case ('Alta') {
                      <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Alta</span>
                    }
                    @case ('Normal') {
                      <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Normal</span>
                    }
                  }
                </td>
                <td class="py-0.5 px-1 text-center whitespace-nowrap">
                  <div class="inline-flex items-center justify-center gap-1">
                    <button
                      type="button"
                      title="Asignar picking"
                      aria-label="Asignar picking"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Ver detalle de orden"
                      aria-label="Ver detalle"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Imprimir guía de picking"
                      aria-label="Imprimir guía"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- ── PIE DE GRILLA ── -->
      <div class="h-6 px-3 bg-surface border-t border-outline flex items-center justify-between text-[10px] text-on-surface-muted shrink-0 select-none">
        <span>Mostrando {{ filteredOrdenes().length }} órdenes de pedido</span>
        <span>Página 1 de 1</span>
      </div>
    </div>
  `
})
export class OrdenesPedido {
  protected readonly searchQuery = signal('');
  protected readonly filterPrioridad = signal('Todas');

  protected readonly ordenes = signal<OrdenPedido[]>([
    { id: '1', numero: 'ORD-9901', cliente: 'SUPERMERCADOS METRO S.A.', zona: 'Lima Metropolitana - R1', items: 18, total: 4850.50, prioridad: 'Alta' },
    { id: '2', numero: 'ORD-9902', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', zona: 'Lima Norte - R3', items: 42, total: 12400.00, prioridad: 'Urgente' },
    { id: '3', numero: 'ORD-9903', cliente: 'TIENDAS TAMBO SAC', zona: 'Lima Centro - R2', items: 12, total: 3200.75, prioridad: 'Normal' },
    { id: '4', numero: 'ORD-9904', cliente: 'BODEGAS UNIDAS LIMA', zona: 'Lima Este - R5', items: 8, total: 1890.00, prioridad: 'Normal' },
    { id: '5', numero: 'ORD-9905', cliente: 'COMERCIAL EL SOL S.R.L.', zona: 'Callao - R4', items: 25, total: 7650.20, prioridad: 'Alta' },
  ]);

  protected readonly filteredOrdenes = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const prio = this.filterPrioridad();
    return this.ordenes().filter(o => {
      const matchPrio = prio === 'Todas' || o.prioridad === prio;
      const matchQ = !q || o.numero.toLowerCase().includes(q) || o.cliente.toLowerCase().includes(q) || o.zona.toLowerCase().includes(q);
      return matchPrio && matchQ;
    });
  });
}
