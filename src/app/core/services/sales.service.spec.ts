import { TestBed } from '@angular/core/testing';
import { SalesService } from './sales.service';
import { INITIAL_ORDERS_SEED } from '../data/orders.seed';

describe('SalesService', () => {
  let service: SalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesService);
    service.resetToDefault();
  });

  it('should be created with initial seeded orders', () => {
    expect(service).toBeTruthy();
    expect(service.orders().length).toBe(INITIAL_ORDERS_SEED.length);
  });

  it('should create a new order and prepend to list', () => {
    const created = service.createOrder({
      clienteId: '20501234567',
      clienteNombre: 'CORPORACION LOGISTICA DEL CENTRO S.A.C.',
      documentoIdentidad: '20501234567',
      condicionPago: 'CREDITO_30',
      almacen: 'ALM_CENTRAL',
      moneda: 'PEN',
      fechaEmision: '08/11/2026',
      items: [],
      subtotal: 1000,
      igv: 180,
      total: 1180,
    });

    expect(created).toBeTruthy();
    expect(service.orders().length).toBe(INITIAL_ORDERS_SEED.length + 1);
    expect(service.orders()[0].codigo).toBe(created.codigo);
  });

  it('should cancel an order', () => {
    service.cancelOrder('1');
    const ord = service.orders().find((o) => o.id === '1');
    expect(ord?.estado).toBe('Anulado');
  });

  it('should clear orders cleanly', () => {
    service.clear();
    expect(service.orders().length).toBe(0);
  });
});
