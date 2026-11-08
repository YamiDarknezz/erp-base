import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SearchableSelect, SelectOption } from '../searchable-select/searchable-select';
import { ClientService } from '../../../core/services/client.service';
import { ProductService } from '../../../core/services/product.service';

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
  private readonly clientService = inject(ClientService);
  private readonly productService = inject(ProductService);

  readonly isOpen = input<boolean>(false);
  readonly closed = output<void>();
  readonly saved = output<CreatedOrderPayload>();

  // Catálogos reactivos provistos desde servicios centralizados
  readonly clientOptions = this.clientService.clientSelectOptions;
  readonly skuOptions = this.productService.skuOptions;

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
    const defaultProduct = this.productService.products()[0];
    const defaultSku = defaultProduct?.sku || 'BEB-001';
    const defaultDesc = defaultProduct?.descripcion || 'INCA KOLA PET 500ML RETORNABLE PACK X24';
    const defaultUnid = defaultProduct?.unidad || 'CJA';
    const defaultPrice = defaultProduct?.precioUnitario || 38.50;

    this.lines.update((prev) => [
      ...prev,
      {
        id: this.lineCounter,
        sku: defaultSku,
        descripcion: defaultDesc,
        unidad: defaultUnid,
        cantidad: 1,
        precioUnitario: defaultPrice,
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
    const found = this.productService.findBySku(sku);
    if (!found) return;

    this.lines.update((prev) =>
      prev.map((it) =>
        it.id === lineId
          ? {
              ...it,
              sku: found.sku,
              descripcion: found.descripcion,
              unidad: found.unidad,
              precioUnitario: found.precioUnitario,
            }
          : it
      )
    );
  }

  resetForm(): void {
    const firstClient = this.clientService.clients()[0];
    this.selectedClientId.set(firstClient ? firstClient.ruc : '20501234567');
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
