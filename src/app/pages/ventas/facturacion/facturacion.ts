import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

export interface Factura {
  id: string;
  serieNumero: string;
  cliente: string;
  ruc: string;
  fechaEmision: string;
  monto: number;
  igv: number;
  total: number;
  estadoEnvio: 'Aceptado' | 'Pendiente' | 'Rechazado';
}

@Component({
  selector: 'app-facturacion',
  imports: [FormsModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex flex-col bg-surface overflow-hidden select-none text-on-surface">
      <!-- ── BARRA SUPERIOR DE HERRAMIENTAS Y ACCIONES (ALTA DENSIDAD) ── -->
      <div class="h-9 px-2 bg-surface border-b border-outline flex items-center justify-between gap-2 shrink-0">
        <div class="flex items-center gap-2">
          <!-- Botón Emitir Comprobante (+) -->
          <button
            type="button"
            title="Emitir nuevo comprobante electrónico"
            aria-label="Emitir comprobante"
            class="w-6 h-6 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <!-- Filtro de Estado de Emisión -->
          <select
            [(ngModel)]="filterEstado"
            class="h-6 text-[11px] px-1.5 rounded-xs border border-outline bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Aceptado">Aceptado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>

          <!-- Buscador Compacto -->
          <div class="relative flex items-center">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Buscar serie, RUC o cliente..."
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
            title="Descargar reporte XML/PDF consolidado"
            aria-label="Descargar reporte"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button
            type="button"
            title="Sincronizar validador"
            aria-label="Sincronizar validador"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ── TABLA ALTA DENSIDAD CON LÍNEAS VERTICALES ── -->
      <div class="flex-1 overflow-auto bg-surface">
        <table class="w-full text-left border-collapse text-[11px] font-sans">
          <thead class="sticky top-0 z-10 select-none shadow-xs">
            <tr class="bg-[#1e6fba] dark:bg-[#1a5a96] text-white text-[10px] font-bold uppercase tracking-wider">
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28">
                <div class="flex items-center justify-between gap-1">
                  <span>COMPROBANTE</span>
                  <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                </div>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-56">
                <div class="flex items-center justify-between gap-1">
                  <span>RAZÓN SOCIAL CLIENTE</span>
                  <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                </div>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28">
                <span>RUC / DNI</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24 text-center">
                <span>FECHA</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24 text-right">
                <span>SUBTOTAL (S/)</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-20 text-right">
                <span>IGV (S/)</span>
              </th>
              <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28 text-right">
                <span>TOTAL (S/)</span>
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
            @for (f of filteredFacturas(); track f.id; let idx = $index) {
              <tr
                class="h-6.5 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors"
                [class.bg-surface-alt]="idx % 2 === 1"
              >
                <td class="py-0.5 px-2 border-r border-outline/70 font-mono font-bold text-primary">
                  {{ f.serieNumero }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 font-medium text-on-surface truncate max-w-xs">
                  {{ f.cliente }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 font-mono text-on-surface-variant">
                  {{ f.ruc }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-center font-mono text-on-surface-muted">
                  {{ f.fechaEmision }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono text-on-surface-variant">
                  S/ {{ f.monto | number:'1.2-2' }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono text-on-surface-muted">
                  S/ {{ f.igv | number:'1.2-2' }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-right font-mono font-bold text-on-surface">
                  S/ {{ f.total | number:'1.2-2' }}
                </td>
                <td class="py-0.5 px-2 border-r border-outline/70 text-center">
                  @switch (f.estadoEnvio) {
                    @case ('Aceptado') {
                      <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Aceptado</span>
                    }
                    @case ('Pendiente') {
                      <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Pendiente</span>
                    }
                    @case ('Rechazado') {
                      <span class="px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Rechazado</span>
                    }
                  }
                </td>
                <td class="py-0.5 px-1 text-center whitespace-nowrap">
                  <div class="inline-flex items-center justify-center gap-1">
                    <button
                      type="button"
                      title="Descargar PDF"
                      aria-label="Descargar PDF"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Descargar XML comprobante"
                      aria-label="Descargar XML"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Reenviar a correo cliente"
                      aria-label="Reenviar comprobante"
                      class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
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
        <span>Mostrando {{ filteredFacturas().length }} comprobantes emitidos</span>
        <span>Página 1 de 1</span>
      </div>
    </div>
  `
})
export class Facturacion {
  protected readonly searchQuery = signal('');
  protected readonly filterEstado = signal('Todos');

  protected readonly facturas = signal<Factura[]>([
    { id: '1', serieNumero: 'F001-0004521', cliente: 'SUPERMERCADOS METRO S.A.', ruc: '20100070970', fechaEmision: '07/11/2026', monto: 4110.59, igv: 739.91, total: 4850.50, estadoEnvio: 'Aceptado' },
    { id: '2', serieNumero: 'F001-0004522', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', ruc: '20489632514', fechaEmision: '07/11/2026', monto: 10508.47, igv: 1891.53, total: 12400.00, estadoEnvio: 'Pendiente' },
    { id: '3', serieNumero: 'B001-0012890', cliente: 'TIENDAS TAMBO SAC', ruc: '20563458921', fechaEmision: '06/11/2026', monto: 2712.50, igv: 488.25, total: 3200.75, estadoEnvio: 'Aceptado' },
    { id: '4', serieNumero: 'F001-0004523', cliente: 'BODEGAS UNIDAS LIMA', ruc: '20601239845', fechaEmision: '06/11/2026', monto: 1601.69, igv: 288.31, total: 1890.00, estadoEnvio: 'Aceptado' },
    { id: '5', serieNumero: 'F001-0004524', cliente: 'COMERCIAL EL SOL S.R.L.', ruc: '20512897456', fechaEmision: '05/11/2026', monto: 6483.22, igv: 1166.98, total: 7650.20, estadoEnvio: 'Rechazado' },
  ]);

  protected readonly filteredFacturas = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const st = this.filterEstado();
    return this.facturas().filter(f => {
      const matchSt = st === 'Todos' || f.estadoEnvio === st;
      const matchQ = !q || f.serieNumero.toLowerCase().includes(q) || f.cliente.toLowerCase().includes(q) || f.ruc.includes(q);
      return matchSt && matchQ;
    });
  });
}
