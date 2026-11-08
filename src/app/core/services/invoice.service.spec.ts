import { TestBed } from '@angular/core/testing';
import { InvoiceService } from './invoice.service';
import { INITIAL_INVOICES_SEED } from '../data/invoices.seed';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceService);
    service.resetToDefault();
  });

  it('should be created with initial seeded invoices', () => {
    expect(service).toBeTruthy();
    expect(service.invoices().length).toBe(INITIAL_INVOICES_SEED.length);
  });

  it('should issue a new invoice and prepend to list', () => {
    const issued = service.issueInvoice({
      clienteId: '20501234567',
      clienteNombre: 'CORPORACION LOGISTICA DEL CENTRO SAC',
      documentoIdentidad: '20501234567',
      condicionPago: 'CREDITO_30',
      almacen: 'ALM_CENTRAL',
      moneda: 'PEN',
      fechaEmision: '08/11/2026',
      items: [],
      subtotal: 500,
      igv: 90,
      total: 590,
    });

    expect(issued).toBeTruthy();
    expect(service.invoices().length).toBe(INITIAL_INVOICES_SEED.length + 1);
    expect(service.invoices()[0].serieNumero).toBe(issued.serieNumero);
  });

  it('should clear invoices cleanly', () => {
    service.clear();
    expect(service.invoices().length).toBe(0);
  });
});
