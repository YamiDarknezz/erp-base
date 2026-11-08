import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
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
    <div class="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Emisión de Facturación Electrónica</h1>
          <p class="text-xs text-on-surface-variant">Gestión de facturas, boletas y notas de crédito</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            title="Emitir comprobante"
            aria-label="Emitir comprobante"
            class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            title="Descargar reporte XML/PDF"
            aria-label="Descargar reporte XML/PDF"
            class="w-8 h-8 rounded-lg border border-outline bg-surface text-on-surface-variant hover:text-on-surface flex items-center justify-center cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>

      <div class="rounded-xl bg-surface border border-outline shadow-xs overflow-hidden">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-surface-alt border-b border-outline text-on-surface-variant uppercase text-[10px] tracking-wider">
              <th class="py-2.5 px-4 font-bold">Comprobante</th>
              <th class="py-2.5 px-4 font-bold">Cliente</th>
              <th class="py-2.5 px-4 font-bold">Doc / RUC</th>
              <th class="py-2.5 px-4 font-bold">Fecha</th>
              <th class="py-2.5 px-4 font-bold text-right">Subtotal</th>
              <th class="py-2.5 px-4 font-bold text-right">Total</th>
              <th class="py-2.5 px-4 font-bold text-center">Estado Envío</th>
              <th class="py-2.5 px-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/60">
            @for (f of facturas(); track f.id) {
              <tr class="hover:bg-surface-muted/60 transition-colors">
                <td class="py-2.5 px-4 font-mono font-bold text-primary">{{ f.serieNumero }}</td>
                <td class="py-2.5 px-4 font-medium text-on-surface">{{ f.cliente }}</td>
                <td class="py-2.5 px-4 font-mono text-on-surface-variant">{{ f.ruc }}</td>
                <td class="py-2.5 px-4 text-on-surface-muted">{{ f.fechaEmision }}</td>
                <td class="py-2.5 px-4 text-right">S/ {{ f.monto | number:'1.2-2' }}</td>
                <td class="py-2.5 px-4 font-bold text-right text-on-surface">S/ {{ f.total | number:'1.2-2' }}</td>
                <td class="py-2.5 px-4 text-center">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [class.bg-emerald-100]="f.estadoEnvio === 'Aceptado'"
                    [class.text-emerald-800]="f.estadoEnvio === 'Aceptado'"
                    [class.bg-amber-100]="f.estadoEnvio === 'Pendiente'"
                    [class.text-amber-800]="f.estadoEnvio === 'Pendiente'"
                  >
                    {{ f.estadoEnvio }}
                  </span>
                </td>
                <td class="py-2.5 px-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      title="Descargar PDF"
                      aria-label="Descargar PDF"
                      class="w-6 h-6 rounded flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
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
export class Facturacion {
  protected readonly facturas = signal<Factura[]>([
    { id: '1', serieNumero: 'F001-0004521', cliente: 'RESTAURANTES UNIDOS SAC', ruc: '20554896231', fechaEmision: '07/11/2026', monto: 2100.00, igv: 378.00, total: 2478.00, estadoEnvio: 'Aceptado' },
    { id: '2', serieNumero: 'F001-0004522', cliente: 'INVERSIONES ALFA & OMEGA', ruc: '20601458932', fechaEmision: '07/11/2026', monto: 5400.00, igv: 972.00, total: 6372.00, estadoEnvio: 'Aceptado' },
    { id: '3', serieNumero: 'F001-0004523', cliente: 'COMERCIALIZADORA DEL PACÍFICO', ruc: '20489632514', fechaEmision: '06/11/2026', monto: 1850.00, igv: 333.00, total: 2183.00, estadoEnvio: 'Pendiente' },
    { id: '4', serieNumero: 'B001-0012890', cliente: 'MARÍA FERNANDA LÓPEZ', ruc: '10458963214', fechaEmision: '06/11/2026', monto: 380.00, igv: 68.40, total: 448.40, estadoEnvio: 'Aceptado' },
  ]);
}
