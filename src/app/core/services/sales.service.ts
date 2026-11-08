import { Injectable, signal } from '@angular/core';
import { OrderEntity, INITIAL_ORDERS_SEED } from '../data/orders.seed';
import { CreatedOrderPayload } from '../../shared/components/order-editor-modal/order-editor-modal';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly ordersState = signal<OrderEntity[]>(INITIAL_ORDERS_SEED);

  readonly orders = this.ordersState.asReadonly();

  createOrder(payload: CreatedOrderPayload): OrderEntity {
    const nextCode = `PED-2026-0${897 + this.ordersState().length}`;
    const newOrder: OrderEntity = {
      id: String(Date.now()),
      codigo: nextCode,
      cliente: payload.clienteNombre,
      clienteRuc: payload.documentoIdentidad,
      vendedor: 'Carlos Mendoza Salazar',
      fecha: payload.fechaEmision,
      total: payload.total,
      estado: 'Aprobado',
    };

    this.ordersState.update((prev) => [newOrder, ...prev]);
    return newOrder;
  }

  cancelOrder(id: string): void {
    this.ordersState.update((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, estado: 'Anulado' } : ord))
    );
  }

  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          this.ordersState.set(data);
        }
      }
    } catch (err) {
      console.warn('Error al cargar órdenes remotas:', err);
    }
  }

  clear(): void {
    this.ordersState.set([]);
  }

  resetToDefault(): void {
    this.ordersState.set(INITIAL_ORDERS_SEED);
  }
}
