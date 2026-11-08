import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-reportes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex flex-col bg-surface overflow-hidden select-none text-on-surface">
      <!-- ── BARRA SUPERIOR DE HERRAMIENTAS Y ACCIONES (ALTA DENSIDAD) ── -->
      <div class="h-9 px-2 bg-surface border-b border-outline flex items-center justify-between gap-2 shrink-0">
        <!-- Resumen de Métricas en Miniatura (Sin espacios muertos) -->
        <div class="flex items-center gap-3 text-[11px]">
          <div class="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xs">
            <span class="text-on-surface-muted">Total Ventas:</span>
            <span class="font-bold text-primary font-mono">S/ 248,590.00</span>
          </div>
          <div class="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xs">
            <span class="text-on-surface-muted">Cuota:</span>
            <span class="font-bold text-emerald-600 font-mono">92.4%</span>
          </div>
          <div class="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xs">
            <span class="text-on-surface-muted">Comisiones:</span>
            <span class="font-bold text-amber-600 font-mono">S/ 8,450.20</span>
          </div>
        </div>

        <!-- Herramientas Rápidas -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            title="Exportar reporte de comisiones"
            aria-label="Exportar comisiones"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            type="button"
            title="Recargar métricas"
            aria-label="Recargar métricas"
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
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-44">
                <div class="flex items-center justify-between gap-1">
                  <span>ASESOR COMERCIAL</span>
                  <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                </div>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-32 text-right">
                <span>VENTAS ACUMULADAS (S/)</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28 text-center">
                <span>CUMPLIMIENTO CUOTA</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28 text-right">
                <span>COMISIÓN ASIGNADA (S/)</span>
              </th>
              <th class="py-1 px-2 whitespace-nowrap min-w-24 text-center">
                <span>ACCIONES</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/50">
            <tr class="h-6.5 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors">
              <td class="py-0.5 px-2 border-r border-outline/70 font-medium text-on-surface">Carlos Rivas</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono font-bold text-on-surface">S/ 98,400.00</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-center font-bold text-emerald-600 font-mono">98.4%</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-right font-bold text-primary font-mono">S/ 3,444.00</td>
              <td class="py-0.5 px-1 text-center whitespace-nowrap">
                <div class="inline-flex items-center justify-center gap-1">
                  <button type="button" title="Ver desglose por cliente" aria-label="Ver desglose" class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </button>
                  <button type="button" title="Liquidación de comisiones" aria-label="Liquidación" class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr class="h-6.5 bg-surface-alt hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors">
              <td class="py-0.5 px-2 border-r border-outline/70 font-medium text-on-surface">Lucía Mendoza</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono font-bold text-on-surface">S/ 86,250.00</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-center font-bold text-emerald-600 font-mono">91.8%</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-right font-bold text-primary font-mono">S/ 2,932.50</td>
              <td class="py-0.5 px-1 text-center whitespace-nowrap">
                <div class="inline-flex items-center justify-center gap-1">
                  <button type="button" title="Ver desglose por cliente" aria-label="Ver desglose" class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </button>
                  <button type="button" title="Liquidación de comisiones" aria-label="Liquidación" class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr class="h-6.5 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors">
              <td class="py-0.5 px-2 border-r border-outline/70 font-medium text-on-surface">Jorge Campos</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono font-bold text-on-surface">S/ 63,940.00</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-center font-bold text-amber-600 font-mono">85.2%</td>
              <td class="py-0.5 px-2 border-r border-outline/70 text-right font-bold text-primary font-mono">S/ 2,073.70</td>
              <td class="py-0.5 px-1 text-center whitespace-nowrap">
                <div class="inline-flex items-center justify-center gap-1">
                  <button type="button" title="Ver desglose por cliente" aria-label="Ver desglose" class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </button>
                  <button type="button" title="Liquidación de comisiones" aria-label="Liquidación" class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── PIE DE GRILLA ── -->
      <div class="h-6 px-3 bg-surface border-t border-outline flex items-center justify-between text-[10px] text-on-surface-muted shrink-0 select-none">
        <span>Mostrando 3 asesores comerciales</span>
        <span>Página 1 de 1</span>
      </div>
    </div>
  `
})
export class Reportes {}
