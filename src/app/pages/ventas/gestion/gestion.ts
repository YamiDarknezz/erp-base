import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ProveedorCliente {
  codigo: string;
  razonSocial: string;
  anulado: boolean;
  domicilio: string;
  provincia: string;
  departamento: string;
  localidad: string;
  telefono: string;
  tipoContribuyente: 'PJ' | 'PN';
  identificador: string;
  fechaAlta: string;
}

@Component({
  selector: 'app-gestion',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex flex-col bg-surface overflow-hidden select-none text-on-surface">
      <!-- ── BARRA SUPERIOR DE HERRAMIENTAS Y ACCIONES (ALTA DENSIDAD) ── -->
      <div class="h-9 px-2 bg-surface border-b border-outline flex items-center justify-between gap-2 shrink-0">
        <!-- Lado Izquierdo: Botón Nuevo + Filtros -->
        <div class="flex items-center gap-2">
          <!-- Botón Nuevo (+) Estilo Enterprise -->
          <button
            type="button"
            title="Nuevo registro"
            aria-label="Nuevo registro"
            class="w-6 h-6 rounded-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <!-- Checkbox Incluir Anulados -->
          <label class="inline-flex items-center gap-1.5 text-[11px] text-on-surface-variant hover:text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              [(ngModel)]="incluirAnulados"
              class="w-3.5 h-3.5 rounded-xs border-outline text-primary focus:ring-0 cursor-pointer"
            />
            <span>Incluir anulados.</span>
          </label>

          <!-- Buscador Compacto -->
          <div class="relative flex items-center">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Buscar..."
              class="h-6 text-[11px] pl-2 pr-6 rounded-xs border border-outline bg-surface text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-1 focus:ring-primary w-40 sm:w-60"
            />
            <svg class="w-3 h-3 text-on-surface-muted absolute right-1.5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <!-- Lado Derecho: Iconos de Control Rápido de Grilla -->
        <div class="flex items-center gap-1">
          <!-- 📁 Exportar / Datos -->
          <button
            type="button"
            title="Exportar registros"
            aria-label="Exportar registros"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <!-- 🔄 Recargar -->
          <button
            type="button"
            title="Recargar grilla"
            aria-label="Recargar grilla"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>

          <!-- ↔️ Columnas -->
          <button
            type="button"
            title="Ajustar columnas"
            aria-label="Ajustar columnas"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 19 12 15 6" /><polyline points="9 6 5 12 9 18" />
            </svg>
          </button>

          <!-- 💾 Guardar vista -->
          <button
            type="button"
            title="Guardar preferencias de grilla"
            aria-label="Guardar preferencias de grilla"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
            </svg>
          </button>

          <!-- ⚙️ Configuración -->
          <button
            type="button"
            title="Configuración de parámetros"
            aria-label="Configuración de parámetros"
            class="w-6 h-6 rounded-xs flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-muted cursor-pointer transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ── ÁREA DE GRILLA CON ALTA DENSIDAD Y PESTAÑA LATERAL ── -->
      <div class="flex-1 relative flex overflow-hidden">
        <!-- Tabla con scroll horizontal y vertical -->
        <div class="flex-1 overflow-auto bg-surface">
          <table class="w-full text-left border-collapse text-[11px] font-sans">
            <!-- Cabecera Azul Corporativa -->
            <thead class="sticky top-0 z-10 select-none shadow-xs">
              <tr class="bg-[#1e6fba] dark:bg-[#1a5a96] text-white text-[10px] font-bold uppercase tracking-wider">
                <th class="py-1 px-1.5 border-r border-white/20 whitespace-nowrap min-w-14">
                  <div class="flex items-center justify-between gap-1">
                    <span>CÓDIGO</span>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-56">
                  <div class="flex items-center justify-between gap-1">
                    <span>RAZÓN SOCIAL</span>
                    <svg class="w-3 h-3 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-18 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                    <span>ANULADO</span>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-44">
                  <div class="flex items-center justify-between gap-1">
                    <span>DOMICILIO</span>
                    <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24">
                  <div class="flex items-center justify-between gap-1">
                    <span>PROVINCIA</span>
                    <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28">
                  <div class="flex items-center justify-between gap-1">
                    <span>DEPARTAMENTO</span>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24">
                  <div class="flex items-center justify-between gap-1">
                    <span>LOCALIDAD</span>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24">
                  <div class="flex items-center justify-between gap-1">
                    <span>TELÉFONO</span>
                  </div>
                </th>
                <th class="py-1 px-1.5 border-r border-white/20 whitespace-nowrap min-w-16 text-center">
                  <span>T. CONTR</span>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-28">
                  <div class="flex items-center justify-between gap-1">
                    <span>IDENTIFICADOR</span>
                    <svg class="w-2.5 h-2.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/></svg>
                  </div>
                </th>
                <th class="py-1 px-2 border-r border-white/20 whitespace-nowrap min-w-24">
                  <span>FECHA ALTA</span>
                </th>
                <th class="py-1 px-2 whitespace-nowrap min-w-28 text-center">
                  <span>ACCIONES</span>
                </th>
              </tr>
            </thead>

            <!-- Filas Ultra-Compactas con Separaciones Verticales Entre Columnas -->
            <tbody class="divide-y divide-outline/50">
              @for (item of filteredList(); track item.codigo; let idx = $index) {
                <tr
                  class="h-6.5 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors"
                  [class.bg-surface-alt]="idx % 2 === 1"
                >
                  <!-- Código -->
                  <td class="py-0.5 px-2 border-r border-outline/70 font-mono text-on-surface-variant text-right">
                    {{ item.codigo }}
                  </td>

                  <!-- Razón Social -->
                  <td class="py-0.5 px-2 border-r border-outline/70 font-medium text-on-surface truncate max-w-xs">
                    {{ item.razonSocial }}
                  </td>

                  <!-- Anulado -->
                  <td class="py-0.5 px-2 border-r border-outline/70 text-center font-bold" [class.text-rose-600]="item.anulado" [class.text-on-surface-muted]="!item.anulado">
                    {{ item.anulado ? 'SÍ' : 'NO' }}
                  </td>

                  <!-- Domicilio -->
                  <td class="py-0.5 px-2 border-r border-outline/70 text-on-surface-variant truncate max-w-sm">
                    {{ item.domicilio }}
                  </td>

                  <!-- Provincia -->
                  <td class="py-0.5 px-2 border-r border-outline/70 text-on-surface-muted">
                    {{ item.provincia }}
                  </td>

                  <!-- Departamento -->
                  <td class="py-0.5 px-2 border-r border-outline/70 text-on-surface-muted">
                    {{ item.departamento }}
                  </td>

                  <!-- Localidad -->
                  <td class="py-0.5 px-2 border-r border-outline/70 text-on-surface-muted">
                    {{ item.localidad }}
                  </td>

                  <!-- Teléfono -->
                  <td class="py-0.5 px-2 border-r border-outline/70 font-mono text-on-surface-variant">
                    {{ item.telefono }}
                  </td>

                  <!-- Tipo Contribuyente -->
                  <td class="py-0.5 px-1.5 border-r border-outline/70 text-center font-semibold text-primary">
                    {{ item.tipoContribuyente }}
                  </td>

                  <!-- Identificador (RUC / DNI) -->
                  <td class="py-0.5 px-2 border-r border-outline/70 font-mono text-on-surface-variant">
                    {{ item.identificador }}
                  </td>

                  <!-- Fecha Alta -->
                  <td class="py-0.5 px-2 border-r border-outline/70 font-mono text-on-surface-muted">
                    {{ item.fechaAlta }}
                  </td>

                  <!-- Acciones (Botones de Icono Ultra Compactos) -->
                  <td class="py-0.5 px-1 text-center whitespace-nowrap">
                    <div class="inline-flex items-center justify-center gap-1">
                      <!-- 🔍 Ver Detalle -->
                      <button
                        type="button"
                        title="Ver detalle"
                        aria-label="Ver detalle"
                        class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-soft transition-colors cursor-pointer"
                      >
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </button>

                      <!-- ✏️ Editar -->
                      <button
                        type="button"
                        title="Editar registro"
                        aria-label="Editar registro"
                        class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                      >
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>

                      <!-- 🏷️ Ficha / Documentos -->
                      <button
                        type="button"
                        title="Ver comprobantes y fichas"
                        aria-label="Ver comprobantes y fichas"
                        class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                      >
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </button>

                      <!-- 🗑️ Eliminar / Anular -->
                      <button
                        type="button"
                        title="Anular registro"
                        aria-label="Anular registro"
                        class="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pestaña Lateral Derecha: Configurar Columnas (Fiel a la Captura) -->
        <div class="w-6 border-l border-outline bg-surface-alt flex flex-col items-center justify-center select-none cursor-pointer hover:bg-surface-muted transition-colors py-2 text-on-surface-variant">
          <svg class="w-3 h-3 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span class="text-[9px] font-semibold tracking-wider uppercase [writing-mode:vertical-rl] rotate-180">
            Configurar columnas
          </span>
        </div>
      </div>

      <!-- ── PIE DE GRILLA: CONTADOR DE REGISTROS Y ESTADO ── -->
      <div class="h-6 px-3 bg-surface border-t border-outline flex items-center justify-between text-[10px] text-on-surface-muted shrink-0 select-none">
        <span>Mostrando {{ filteredList().length }} de {{ registros().length }} registros</span>
        <span>Página 1 de 1</span>
      </div>
    </div>
  `
})
export class Gestion {
  protected readonly searchQuery = signal('');
  protected readonly incluirAnulados = signal(false);

  protected readonly registros = signal<ProveedorCliente[]>([
    { codigo: '0', razonSocial: 'MOVIMIENTOS S/CPBTE.FISCAL', anulado: false, domicilio: 'AV. VICTOR ANDRE...', provincia: 'LIMA', departamento: 'LIMA', localidad: 'SAN ISIDRO', telefono: '', tipoContribuyente: 'PJ', identificador: '20501234567', fechaAlta: '01/02/2016' },
    { codigo: '1', razonSocial: 'CORPORACION LOGISTICA DEL CENTRO SAC', anulado: false, domicilio: 'AV. ARGENTINA N°...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '3136000..3136..', tipoContribuyente: 'PJ', identificador: '20100039207', fechaAlta: '27/06/2015' },
    { codigo: '2', razonSocial: 'RANSA COMERCIAL SA', anulado: false, domicilio: 'GREGORIO PAREDE...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '4313980', tipoContribuyente: 'PJ', identificador: '20508778920', fechaAlta: '23/02/2016' },
    { codigo: '3', razonSocial: 'INVERSIONES QUISSEL SRL', anulado: false, domicilio: 'AV ANTENOR ORR...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '044266065', tipoContribuyente: 'PJ', identificador: '20539721870', fechaAlta: '27/01/2020' },
    { codigo: '4', razonSocial: 'PROTEKTOR SEGURIDAD INTEGRAL S.A.C.', anulado: false, domicilio: 'AV ANTENOR ORR...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '2053607783', fechaAlta: '27/03/2020' },
    { codigo: '9', razonSocial: 'ESSALUD', anulado: false, domicilio: 'AV. SALAVERRY N°...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20348624866', fechaAlta: '22/01/2020' },
    { codigo: '13', razonSocial: 'MERCANTIL INCA S.A.', anulado: false, domicilio: 'CALLE TIZON Y BU...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '2211259', tipoContribuyente: 'PJ', identificador: '20451583060', fechaAlta: '29/10/2016' },
    { codigo: '14', razonSocial: 'INVERSIONES WARNER MIC S.R.L.', anulado: false, domicilio: 'AV LA ALAMEDA S...', provincia: 'LIMA', departamento: 'LIMA', localidad: 'CHORRILLOS', telefono: '', tipoContribuyente: 'PJ', identificador: '20482656494', fechaAlta: '30/11/2016' },
    { codigo: '15', razonSocial: 'BODEGAS DON LUIS S.A.C.', anulado: false, domicilio: 'MZA. E LOTE. 16 U...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '763323', tipoContribuyente: 'PN', identificador: '10419440502', fechaAlta: '30/11/2016' },
    { codigo: '16', razonSocial: 'BALLARES NARRO WALTER PAUL', anulado: false, domicilio: 'MZ. C LT 1 URB LA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20465876345', fechaAlta: '29/02/2020' },
    { codigo: '17', razonSocial: 'SERVICIOS LAS FLORES DEL GOLF S.A.C', anulado: false, domicilio: 'JR. PASEO DEL BO...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20131872233', fechaAlta: '01/01/1900' },
    { codigo: '18', razonSocial: 'AEROPAGO SA', anulado: false, domicilio: 'AV. JOSE FAUSTIN...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10467853321', fechaAlta: '01/01/1900' },
    { codigo: '19', razonSocial: 'ALATA CJUNO SONIA', anulado: false, domicilio: 'CARR. PANAMERIC...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '291010', tipoContribuyente: 'PJ', identificador: '20100128056', fechaAlta: '01/01/1900' },
    { codigo: '20', razonSocial: 'AGROBEX S.A.C.', anulado: false, domicilio: 'AV. PASEO DE LA R...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20131872233', fechaAlta: '27/06/2018' },
    { codigo: '21', razonSocial: 'SAGA FALABELLA S.A.', anulado: false, domicilio: 'AV. PASEO DE LA R...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '', tipoContribuyente: 'PJ', identificador: '20100128056', fechaAlta: '31/07/2018' },
    { codigo: '22', razonSocial: 'ALEJANDRO ARAUJO LUIS ERNESTO', anulado: false, domicilio: 'CAL.SANTO TOMA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10068142437', fechaAlta: '01/01/1900' },
    { codigo: '23', razonSocial: 'ALMACENES Y LOGISTICA DEL SUR S.A.C', anulado: false, domicilio: 'CAR.PANAMERICA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20535198901', fechaAlta: '01/01/1900' },
    { codigo: '24', razonSocial: 'AMERICA EXPRESS S.A.', anulado: false, domicilio: 'AV. 28 DE JULIO N...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20114111342', fechaAlta: '20/12/2019' },
    { codigo: '25', razonSocial: 'AMERICA MOVIL PERU S.A.C.', anulado: false, domicilio: 'AV. NICOLAS ARRI...', provincia: 'LIMA', departamento: 'LIMA', localidad: 'LA VICTORIA', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20467534026', fechaAlta: '06/01/2020' },
    { codigo: '26', razonSocial: 'ANDINA SERVICIOS Y REPRESENTACIONES EIRL', anulado: false, domicilio: 'JR. AMALIA PUGA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20113742047', fechaAlta: '01/01/1900' },
    { codigo: '27', razonSocial: 'ANTARA CHAVEZ KELY LISETH', anulado: true, domicilio: 'SIN DIRECCIÓN', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10470898577', fechaAlta: '01/01/1900' },
    { codigo: '28', razonSocial: 'AREQUIPA EXPRESO MARVISUR EIRL', anulado: false, domicilio: 'CAL. GARCI CARBA...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20498199637', fechaAlta: '13/01/2020' },
    { codigo: '29', razonSocial: 'AUTO CENTER PERU S.A.C.', anulado: false, domicilio: 'AV. ANTENOR ORR...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20477535209', fechaAlta: '10/01/2020' },
    { codigo: '30', razonSocial: 'AUTOPISTA DEL NORTE S.A.C.', anulado: false, domicilio: 'AV. 28 DE JULIO N...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20520929658', fechaAlta: '08/01/2020' },
    { codigo: '31', razonSocial: 'AVA TRADING SOCIEDAD ANONIMA - AVA TRADING S...', anulado: false, domicilio: 'AV. REPUBLICA DE...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20565643496', fechaAlta: '01/01/1900' },
    { codigo: '32', razonSocial: 'BARNUEVO CUELLAR GINO EMILIO ERNESTO', anulado: false, domicilio: 'CAL ACACIAS N° 1...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10076217233', fechaAlta: '15/01/2020' },
    { codigo: '33', razonSocial: 'BAUER LUBRICENTROS S.A.C.', anulado: false, domicilio: 'AV. JOSE PARDO N...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20569290610', fechaAlta: '01/01/1900' },
    { codigo: '34', razonSocial: 'BENITES HATADA JUAN ANTONIO', anulado: false, domicilio: 'SIN DIRECCIÓN', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PN', identificador: '10178002584', fechaAlta: '01/01/1900' },
    { codigo: '35', razonSocial: 'CARGO EXPRESS AMERICANO S.A.C.', anulado: false, domicilio: 'NRO. S/N INT. B-12...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20532029008', fechaAlta: '06/01/2020' },
    { codigo: '36', razonSocial: 'CORPORACION LOGISTICA DEL CENTRO S.A.C', anulado: false, domicilio: 'AV. VICTOR ANDRE...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20501234567', fechaAlta: '06/01/2020' },
    { codigo: '37', razonSocial: 'CENTRAL PARKING SYSTEM PERU S.A.', anulado: false, domicilio: 'AV. JAVIER PRADO...', provincia: 'LIMA', departamento: 'LIMA', localidad: '', telefono: '123456', tipoContribuyente: 'PJ', identificador: '20505205791', fechaAlta: '01/01/1900' },
  ]);

  protected readonly filteredList = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const incAnul = this.incluirAnulados();
    return this.registros().filter(r => {
      if (!incAnul && r.anulado) return false;
      if (!q) return true;
      return (
        r.codigo.toLowerCase().includes(q) ||
        r.razonSocial.toLowerCase().includes(q) ||
        r.identificador.toLowerCase().includes(q) ||
        r.domicilio.toLowerCase().includes(q)
      );
    });
  });
}
