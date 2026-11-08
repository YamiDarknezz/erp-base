import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SearchableSelect, SelectOption } from '../searchable-select/searchable-select';

export interface OrderLineItem {
  id: number;
  sku: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
}

export interface CreatedOrderPayload {
  clienteId: string;
  clienteNombre: string;
  documentoIdentidad: string;
  condicionPago: string;
  almacen: string;
  moneda: string;
  fechaEmision: string;
  items: OrderLineItem[];
  subtotal: number;
  igv: number;
  total: number;
}

@Component({
  selector: 'app-order-editor-modal',
  standalone: true,
  imports: [CommonModule, DecimalPipe, SearchableSelect],
  templateUrl: './order-editor-modal.html',
  styleUrl: './order-editor-modal.scss',
})
export class OrderEditorModal {
  readonly isOpen = input<boolean>(false);
  readonly closed = output<void>();
  readonly saved = output<CreatedOrderPayload>();

  readonly clientOptions = signal<SelectOption[]>([
    { value: '20501234567', label: 'CORPORACION LOGISTICA DEL CENTRO SAC', sublabel: 'RUC 20501234567 — San Isidro, Lima', badge: 'VIP' },
    { value: '20100039207', label: 'RANSA COMERCIAL SA', sublabel: 'RUC 20100039207 — Callao, Lima', badge: 'Logística' },
    { value: '20508778920', label: 'INVERSIONES QUISSEL SRL', sublabel: 'RUC 20508778920 — Ate Vitarte, Lima' },
    { value: '20539721870', label: 'PROTEKTOR SEGURIDAD INTEGRAL S.A.C.', sublabel: 'RUC 20539721870 — Miraflores' },
    { value: '20353607783', label: 'MERCANTIL INCA S.A.', sublabel: 'RUC 20353607783 — Salaverry, Lima' },
    { value: '20451583060', label: 'BODEGAS DON LUIS S.A.C.', sublabel: 'RUC 20451583060 — Chorrillos, Lima' },
    { value: '20100128056', label: 'SAGA FALABELLA S.A.', sublabel: 'RUC 20100128056 — San Isidro, Lima' },
    { value: '20467533026', label: 'AMERICA MOVIL PERU S.A.C.', sublabel: 'RUC 20467533026 — La Victoria, Lima' },
  ]);

  readonly skuCatalog = [
    { sku: 'BEB-001', descripcion: 'INCA KOLA PET 500ML RETORNABLE PACK X24', unidad: 'CJA', precio: 38.50 },
    { sku: 'BEB-002', descripcion: 'COCA COLA REGULAR 1.5L PACK X12', unidad: 'CJA', precio: 52.00 },
    { sku: 'BEB-003', descripcion: 'AGUA SAN LUIS SIN GAS 2.5L X6', unidad: 'FAR', precio: 19.80 },
    { sku: 'ARR-101', descripcion: 'ARROZ EXTRA PAISANA BOLSA 5KG', unidad: 'BLS', precio: 22.50 },
    { sku: 'ACE-201', descripcion: 'ACEITE VEGETAL PRIMOR CLÁSICO 1L CAJA X12', unidad: 'CJA', precio: 88.00 },
    { sku: 'LAC-301', descripcion: 'LECHE GLORIA ETIQUETA AZUL 400G PLANCHA X24', unidad: 'PLA', precio: 94.00 },
    { sku: 'CER-401', descripcion: 'CERVEZA CRISTAL RETORNABLE 650ML X12', unidad: 'CJA', precio: 49.50 },
  ];

  readonly skuOptions = computed<SelectOption[]>(() => {
    return this.skuCatalog.map((item) => ({
      value: item.sku,
      label: `[${item.sku}] ${item.descripcion}`,
      sublabel: `Unid: ${item.unidad} | Ref: S/ ${item.precio.toFixed(2)}`,
      badge: item.unidad,
    }));
  });

  readonly paymentTermOptions: SelectOption[] = [
    { value: 'CONTADO', label: 'CONTADO CONTRA ENTREGA' },
    { value: 'CREDITO_15', label: 'CRÉDITO 15 DÍAS' },
    { value: 'CREDITO_30', label: 'CRÉDITO 30 DÍAS' },
    { value: 'CREDITO_60', label: 'CRÉDITO 60 DÍAS' },
  ];

  readonly warehouseOptions: SelectOption[] = [
    { value: 'ALM_CENTRAL', label: 'ALMACÉN PRINCIPAL CALLAO', sublabel: 'Stock en línea central' },
    { value: 'ALM_LIMA', label: 'DEPÓSITO SUR ATE', sublabel: 'Despacho rápido' },
    { value: 'ALM_NORTE', label: 'SUCURSAL NORTE CHICLAYO', sublabel: 'Zona Norte' },
  ];

  readonly currencyOptions: SelectOption[] = [
    { value: 'PEN', label: 'SOLES (PEN S/)' },
    { value: 'USD', label: 'DÓLARES AMERICANOS (USD $)' },
  ];

  // State signals
  readonly selectedClientId = signal<string>('20501234567');
  readonly paymentTerm = signal<string>('CREDITO_30');
  readonly warehouse = signal<string>('ALM_CENTRAL');
  readonly currency = signal<string>('PEN');
  readonly emissionDate = signal<string>(new Date().toISOString().substring(0, 10));

  private lineCounter = 2;
  readonly lines = signal<OrderLineItem[]>([
    {
      id: 1,
      sku: 'BEB-001',
      descripcion: 'INCA KOLA PET 500ML RETORNABLE PACK X24',
      unidad: 'CJA',
      cantidad: 10,
      precioUnitario: 38.50,
    },
    {
      id: 2,
      sku: 'ACE-201',
      descripcion: 'ACEITE VEGETAL PRIMOR CLÁSICO 1L CAJA X12',
      unidad: 'CJA',
      cantidad: 5,
      precioUnitario: 88.00,
    },
  ]);

  readonly subtotalTotal = computed<number>(() => {
    return this.lines().reduce((acc, it) => acc + (it.cantidad * it.precioUnitario), 0);
  });

  readonly igvTotal = computed<number>(() => {
    return this.subtotalTotal() * 0.18;
  });

  readonly grandTotal = computed<number>(() => {
    return this.subtotalTotal() + this.igvTotal();
  });

  addLine(): void {
    this.lineCounter += 1;
    const defaultSku = this.skuCatalog[0];
    this.lines.update((prev) => [
      ...prev,
      {
        id: this.lineCounter,
        sku: defaultSku.sku,
        descripcion: defaultSku.descripcion,
        unidad: defaultSku.unidad,
        cantidad: 1,
        precioUnitario: defaultSku.precio,
      },
    ]);
  }

  removeLine(id: number): void {
    if (this.lines().length <= 1) {
      return;
    }
    this.lines.update((prev) => prev.filter((it) => it.id !== id));
  }

  updateQuantity(id: number, val: string | number): void {
    const num = Math.max(1, Number(val) || 1);
    this.lines.update((prev) =>
      prev.map((it) => (it.id === id ? { ...it, cantidad: num } : it))
    );
  }

  updatePrice(id: number, val: string | number): void {
    const num = Math.max(0, Number(val) || 0);
    this.lines.update((prev) =>
      prev.map((it) => (it.id === id ? { ...it, precioUnitario: num } : it))
    );
  }

  onClientSelected(clientId: string): void {
    this.selectedClientId.set(clientId);
  }

  onSkuChanged(lineId: number, sku: string): void {
    const found = this.skuCatalog.find((x) => x.sku === sku);
    if (!found) return;

    this.lines.update((prev) =>
      prev.map((it) =>
        it.id === lineId
          ? {
              ...it,
              sku: found.sku,
              descripcion: found.descripcion,
              unidad: found.unidad,
              precioUnitario: found.precio,
            }
          : it
      )
    );
  }

  resetForm(): void {
    this.selectedClientId.set('20501234567');
    this.paymentTerm.set('CREDITO_30');
    this.warehouse.set('ALM_CENTRAL');
    this.currency.set('PEN');
    this.emissionDate.set(new Date().toISOString().substring(0, 10));
    this.lines.set([
      {
        id: 1,
        sku: 'BEB-001',
        descripcion: 'INCA KOLA PET 500ML RETORNABLE PACK X24',
        unidad: 'CJA',
        cantidad: 10,
        precioUnitario: 38.50,
      },
    ]);
  }

  saveOrder(): void {
    const client = this.clientOptions().find((c) => c.value === this.selectedClientId());
    const payload: CreatedOrderPayload = {
      clienteId: this.selectedClientId(),
      clienteNombre: client?.label || 'CLIENTE REGISTRADO',
      documentoIdentidad: this.selectedClientId(),
      condicionPago: this.paymentTerm(),
      almacen: this.warehouse(),
      moneda: this.currency(),
      fechaEmision: this.emissionDate(),
      items: [...this.lines()],
      subtotal: this.subtotalTotal(),
      igv: this.igvTotal(),
      total: this.grandTotal(),
    };

    this.saved.emit(payload);
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
