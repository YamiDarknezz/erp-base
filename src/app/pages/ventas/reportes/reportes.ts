import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-reportes',
  template: `
    <div class="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Reportes y Comisiones de Venta</h1>
          <p class="text-xs text-on-surface-variant">Rendimiento por vendedor, cumplimiento de cuota y comisiones</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            title="Exportar consolidado"
            aria-label="Exportar consolidado"
            class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div class="rounded-xl bg-surface border border-outline p-4 shadow-xs">
          <span class="text-xs text-on-surface-variant font-medium">Ventas Totales Mes</span>
          <p class="text-2xl font-bold text-on-surface mt-1">S/ 248,590.00</p>
          <span class="text-[10px] text-emerald-600 font-semibold">+14.2% vs mes anterior</span>
        </div>
        <div class="rounded-xl bg-surface border border-outline p-4 shadow-xs">
          <span class="text-xs text-on-surface-variant font-medium">Cumplimiento de Cuota</span>
          <p class="text-2xl font-bold text-primary mt-1">92.4%</p>
          <span class="text-[10px] text-on-surface-muted">Meta: S/ 270,000.00</span>
        </div>
        <div class="rounded-xl bg-surface border border-outline p-4 shadow-xs">
          <span class="text-xs text-on-surface-variant font-medium">Comisiones Generadas</span>
          <p class="text-2xl font-bold text-amber-600 mt-1">S/ 8,450.20</p>
          <span class="text-[10px] text-on-surface-muted">3 asesores comerciales</span>
        </div>
      </div>

      <div class="rounded-xl bg-surface border border-outline shadow-xs overflow-hidden">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-surface-alt border-b border-outline text-on-surface-variant uppercase text-[10px] tracking-wider">
              <th class="py-2.5 px-4 font-bold">Asesor Comercial</th>
              <th class="py-2.5 px-4 font-bold text-right">Ventas Acumuladas</th>
              <th class="py-2.5 px-4 font-bold text-center">Cumplimiento</th>
              <th class="py-2.5 px-4 font-bold text-right">Comisión</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/60">
            <tr class="hover:bg-surface-muted/60">
              <td class="py-2.5 px-4 font-bold text-on-surface">Carlos Rivas</td>
              <td class="py-2.5 px-4 text-right">S/ 98,400.00</td>
              <td class="py-2.5 px-4 text-center font-bold text-emerald-600">98.4%</td>
              <td class="py-2.5 px-4 text-right font-bold text-primary">S/ 3,444.00</td>
            </tr>
            <tr class="hover:bg-surface-muted/60">
              <td class="py-2.5 px-4 font-bold text-on-surface">Lucía Mendoza</td>
              <td class="py-2.5 px-4 text-right">S/ 86,250.00</td>
              <td class="py-2.5 px-4 text-center font-bold text-emerald-600">91.8%</td>
              <td class="py-2.5 px-4 text-right font-bold text-primary">S/ 2,932.50</td>
            </tr>
            <tr class="hover:bg-surface-muted/60">
              <td class="py-2.5 px-4 font-bold text-on-surface">Jorge Campos</td>
              <td class="py-2.5 px-4 text-right">S/ 63,940.00</td>
              <td class="py-2.5 px-4 text-center font-bold text-amber-600">85.2%</td>
              <td class="py-2.5 px-4 text-right font-bold text-primary">S/ 2,073.70</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class Reportes {}
