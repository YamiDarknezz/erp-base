import { Component, signal, computed } from '@angular/core';
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
  template: `
    <div class="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Control de Inventarios y Almacenes</h1>
          <p class="text-xs text-on-surface-variant">Existencias por depósito, stocks mínimos y valorización</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            title="Nuevo artículo"
            aria-label="Nuevo artículo"
            class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            title="Kardex valorizado"
            aria-label="Kardex valorizado"
            class="w-8 h-8 rounded-lg border border-outline bg-surface text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
        </div>
      </div>

      <div class="rounded-xl bg-surface border border-outline shadow-xs overflow-hidden">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-surface-alt border-b border-outline text-on-surface-variant uppercase text-[10px] tracking-wider">
              <th class="py-2.5 px-4 font-bold">SKU</th>
              <th class="py-2.5 px-4 font-bold">Descripción</th>
              <th class="py-2.5 px-4 font-bold">Depósito</th>
              <th class="py-2.5 px-4 font-bold text-center">Unidad</th>
              <th class="py-2.5 px-4 font-bold text-right">Stock Actual</th>
              <th class="py-2.5 px-4 font-bold text-right">Stock Mínimo</th>
              <th class="py-2.5 px-4 font-bold text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/60">
            @for (art of articulos(); track art.id) {
              <tr class="hover:bg-surface-muted/60 transition-colors">
                <td class="py-2.5 px-4 font-mono font-bold text-primary">{{ art.sku }}</td>
                <td class="py-2.5 px-4 font-medium text-on-surface">{{ art.descripcion }}</td>
                <td class="py-2.5 px-4 text-on-surface-variant">{{ art.deposito }}</td>
                <td class="py-2.5 px-4 text-center font-mono">{{ art.unidad }}</td>
                <td class="py-2.5 px-4 font-bold text-right text-on-surface">{{ art.stockActual }}</td>
                <td class="py-2.5 px-4 text-right text-on-surface-muted">{{ art.stockMinimo }}</td>
                <td class="py-2.5 px-4 text-center">
                  @if (art.stockActual <= art.stockMinimo) {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      Bajo Mínimo
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Normal
                    </span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class Inventarios {
  protected readonly articulos = signal<ArticuloInventario[]>([
    { id: '1', sku: 'SKU-00124', descripcion: 'Aceite Vegetal Premium 1L', deposito: 'Almacén Central', stockActual: 1450, stockMinimo: 500, unidad: 'UND', precioUnitario: 8.50 },
    { id: '2', sku: 'SKU-00125', descripcion: 'Arroz Extra Selección 5kg', deposito: 'Almacén Central', stockActual: 380, stockMinimo: 600, unidad: 'BOL', precioUnitario: 22.00 },
    { id: '3', sku: 'SKU-00126', descripcion: 'Azúcar Blanca Refinada 1kg', deposito: 'Depósito Callao', stockActual: 2100, stockMinimo: 800, unidad: 'BOL', precioUnitario: 4.20 },
    { id: '4', sku: 'SKU-00127', descripcion: 'Leche Evaporada Entera 400g', deposito: 'Depósito Callao', stockActual: 120, stockMinimo: 400, unidad: 'LTA', precioUnitario: 3.80 },
    { id: '5', sku: 'SKU-00128', descripcion: 'Fideos Spaghetti 500g', deposito: 'Almacén Central', stockActual: 3200, stockMinimo: 1000, unidad: 'PAQ', precioUnitario: 2.90 },
  ]);
}
