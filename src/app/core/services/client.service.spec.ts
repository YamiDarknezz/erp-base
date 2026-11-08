import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import { INITIAL_CLIENTS_SEED } from '../data/clients.seed';

describe('ClientService', () => {
  let service: ClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientService);
    service.resetToDefault();
  });

  it('should be created with initial seeded clients', () => {
    expect(service).toBeTruthy();
    expect(service.clients().length).toBe(INITIAL_CLIENTS_SEED.length);
    expect(service.clientSelectOptions().length).toBe(INITIAL_CLIENTS_SEED.length);
  });

  it('should add a client', () => {
    service.addClient({
      id: '99',
      ruc: '20999999991',
      razonSocial: 'NUEVO CLIENTE SAC',
      direccion: 'Av Test 123',
      departamento: 'LIMA',
      provincia: 'LIMA',
      localidad: 'MIRAFLORES',
      telefono: '123456',
      tipoContribuyente: 'PJ',
      fechaAlta: '08/11/2026',
      limiteCredito: 10000,
      anulado: false,
    });

    expect(service.clients().length).toBe(INITIAL_CLIENTS_SEED.length + 1);
  });

  it('should clear clients list cleanly', () => {
    service.clear();
    expect(service.clients().length).toBe(0);
    expect(service.clientSelectOptions().length).toBe(0);
  });
});
