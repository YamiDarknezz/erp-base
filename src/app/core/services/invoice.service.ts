import { Injectable, signal } from '@angular/core';
import { InvoiceEntity, INITIAL_INVOICES_SEED } from '../data/invoices.seed';
import { CreatedOrderPayload } from '../../shared/components/order-editor-modal/order-editor-modal';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly invoicesState = signal<InvoiceEntity[]>(INITIAL_INVOICES_SEED);

  readonly invoices = this.invoicesState.asReadonly();

  issueInvoice(payload: CreatedOrderPayload): InvoiceEntity {
    const nextNum = `F001-000${4525 + this.invoicesState().length}`;
    const newInvoice: InvoiceEntity = {
      id: String(Date.now()),
      serieNumero: nextNum,
      cliente: payload.clienteNombre,
      ruc: payload.documentoIdentidad,
      fechaEmision: payload.fechaEmision,
      monto: payload.subtotal,
      igv: payload.igv,
      total: payload.total,
      estadoEnvio: 'Aceptado',
    };

    this.invoicesState.update((prev) => [newInvoice, ...prev]);
    return newInvoice;
  }

  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          this.invoicesState.set(data);
        }
      }
    } catch (err) {
      console.warn('Error al cargar comprobantes remotos:', err);
    }
  }

  clear(): void {
    this.invoicesState.set([]);
  }

  resetToDefault(): void {
    this.invoicesState.set(INITIAL_INVOICES_SEED);
  }
}
