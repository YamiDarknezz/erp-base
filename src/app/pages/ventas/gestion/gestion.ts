import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface Cliente {
  id: string;
  codigo: string;
  razonSocial: string;
  documento: string;
  canal: string;
  zona: string;
  limiteCredito: number;
}

@Component({
  selector: 'app-gestion',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Gestión de Catálogo de Clientes</h1>
          <p class="text-xs text-on-surface-variant">Maestro de clientes, límites de crédito y condiciones</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            title="Nuevo cliente"
            aria-label="Nuevo cliente"
            class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="rounded-xl bg-surface border border-outline shadow-xs overflow-hidden">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-surface-alt border-b border-outline text-on-surface-variant uppercase text-[10px] tracking-wider">
              <th class="py-2.5 px-4 font-bold">Código</th>
              <th class="py-2.5 px-4 font-bold">Razón Social</th>
              <th class="py-2.5 px-4 font-bold">Doc / RUC</th>
              <th class="py-2.5 px-4 font-bold">Canal</th>
              <th class="py-2.5 px-4 font-bold">Zona</th>
              <th class="py-2.5 px-4 font-bold text-right">Límite Crédito</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline/60">
            @for (c of clientes(); track c.id) {
              <tr class="hover:bg-surface-muted/60 transition-colors">
                <td class="py-2.5 px-4 font-mono font-bold text-primary">{{ c.codigo }}</td>
                <td class="py-2.5 px-4 font-medium text-on-surface">{{ c.razonSocial }}</td>
                <td class="py-2.5 px-4 font-mono text-on-surface-variant">{{ c.documento }}</td>
                <td class="py-2.5 px-4 text-on-surface-muted">{{ c.canal }}</td>
                <td class="py-2.5 px-4 text-on-surface-variant">{{ c.zona }}</td>
                <td class="py-2.5 px-4 text-right font-bold text-on-surface">S/ {{ c.limiteCredito | number:'1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class Gestion {
  protected readonly clientes = signal<Cliente[]>([
    { id: '1', codigo: 'CLI-00101', razonSocial: 'SUPERMERCADOS METRO S.A.', documento: '20100070970', canal: 'Cuentas Clave', zona: 'Lima Metropolitana', limiteCredito: 150000.00 },
    { id: '2', codigo: 'CLI-00102', razonSocial: 'DISTRIBUIDORA NORTE E.I.R.L.', documento: '20489632514', canal: 'Mayorista', zona: 'Lima Norte', limiteCredito: 45000.00 },
    { id: '3', codigo: 'CLI-00103', razonSocial: 'TIENDAS TAMBO SAC', documento: '20563458921', canal: 'Conveniencia', zona: 'Lima Centro', limiteCredito: 80000.00 },
    { id: '4', codigo: 'CLI-00104', razonSocial: 'BODEGAS UNIDAS LIMA', documento: '20601239845', canal: 'Tradicional', zona: 'Lima Este', limiteCredito: 15000.00 },
  ]);
}
