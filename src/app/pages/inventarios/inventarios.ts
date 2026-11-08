import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ArticuloInventario {
  id: string;
  sku: string;
  descripcion: string;
  deposito: string;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  precioUnitario: number;
}

@Component({
  selector: 'app-inventarios',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex flex-col bg-surface overflow-hidden select-none text-on-surface">
      <!-- ── BARRA SUPERIOR DE HERRAMIENTAS Y ACCIONES (ALTA DENSIDAD) ── -->
      <div class="h-9 px-2 bg-surface border-b border-outline flex items-center justify-between gap-2 shrink-0">
        <div class="flex items-center gap-2">
          <!-- Botón Nuevo Artículo (+) -->
          <button
            type="button"
            title="Nuevo artículo de inventario"
            aria-label="Nuevo artículo"
            class="w-6 h-6 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <!-- Filtro Depósito -->
          <select
            [(ngModel)]="filterDeposito"
            class="h-6 text-[11px] px-1.5 rounded-xs border border-outline bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="Todos">Todos los Almacenes</option>
            <option value="Almacén Central Lima">Almacén Central Lima</option>
            <option value="Depósito Callao">Depósito Callao</option>
            <option value="Sucursal Norte">Sucursal Norte</option>
          </select>

          <!-- Buscador Compacto -->
          <div class="relative flex items-center">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Buscar por SKU o descripción..."
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
            title="Kardex valorizado"
            aria-label="Kardex valorizado"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <button
            type="button"
            title="Recargar inventarios"
            aria-label="Recargar inventarios"
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
                  <span>SKU</span>
                  <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                </div>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-64">
                <div class="flex items-center justify-between gap-1">
                  <span>DESCRIPCIÓN ARTÍCULO</span>
                  <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                </div>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-44">
                <span>DEPÓSITO / ALMACÉN</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-16 text-center">
                <span>UNIDAD</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24 text-right">
                <span>STOCK ACTUAL</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24 text-right">
                <span>STOCK MÍN</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24 text-center">
                <span>ESTADO</span>
              </th>
              <th class="py-1 px-2 whitespace-nowrap min-w-24 text-center">
                <span>ACCIONES</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/50">
            @for (art of filteredArticulos(); track art.id; let idx = $index) {
              <tr
                class="h-6.5 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors"
                [class.bg-surface-alt]="idx % 2 === 1"
              >
                <td class="py-0.5 px-2 border-r border-outline/70 font-mono font-bold text-primary">
                  {{ art.sku }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 font-medium text-on-surface truncate max-w-sm">
                  {{ art.descripcion }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-on-surface-variant">
                  {{ art.deposito }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-center font-mono text-on-surface-muted">
                  {{ art.unidad }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono font-bold text-on-surface">
                  {{ art.stockActual }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono text-on-surface-muted">
                  {{ art.stockMinimo }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-center">
                  @if (art.stockActual <= art.stockMinimo) {
                    <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      Bajo Mínimo
                    </span>
                  } @else {
                    <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Normal
                    </span>
                  }
                </td>
                <td class="py-0.5 px-1 text-center whitespace-nowrap">
                  <div class="inline-flex items-center justify-center gap-1">
                    <button
                      type="button"
                      title="Kardex del SKU"
                      aria-label="Kardex del SKU"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Editar parámetros de stock"
                      aria-label="Editar stock"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
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
        <span>Mostrando {{ filteredArticulos().length }} de {{ articulos().length }} SKUs</span>
        <span>Página 1 de 1</span>
      </div>
    </div>
  `
})
export class Inventarios {
  protected readonly searchQuery = signal('');
  protected readonly filterDeposito = signal('Todos');

  protected readonly articulos = signal<ArticuloInventario[]>([
    { id: '1', sku: 'SKU-00109', descripcion: 'BEBIDA ENERGIZANTE 500ML SIX-PACK', deposito: 'Almacén Central Lima', stockActual: 1250, stockMinimo: 300, unidad: 'CJ', precioUnitario: 32.50 },
    { id: '2', sku: 'SKU-00110', descripcion: 'AGUA MINERAL SIN GAS 2.5L PACK X6', deposito: 'Almacén Central Lima', stockActual: 80, stockMinimo: 150, unidad: 'CJ', precioUnitario: 18.00 },
    { id: '3', sku: 'SKU-00215', descripcion: 'DETERGENTE MULTIUSO 4.5KG BOLSA', deposito: 'Depósito Callao', stockActual: 420, stockMinimo: 200, unidad: 'BL', precioUnitario: 24.80 },
    { id: '4', sku: 'SKU-00301', descripcion: 'ACEITE VEGETAL PREMIUM 1L BOTELLA', deposito: 'Sucursal Norte', stockActual: 25, stockMinimo: 100, unidad: 'CJ', precioUnitario: 68.00 },
    { id: '5', sku: 'SKU-00450', descripcion: 'ARROZ EXTRA SELECCIONADO 50KG', deposito: 'Almacén Central Lima', stockActual: 600, stockMinimo: 150, unidad: 'SA', precioUnitario: 145.00 },
  ]);

  protected readonly filteredArticulos = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const dep = this.filterDeposito();
    return this.articulos().filter(a => {
      const matchDep = dep === 'Todos' || a.deposito === dep;
      const matchQ = !q || a.sku.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q);
      return matchDep && matchQ;
    });
  });
}
