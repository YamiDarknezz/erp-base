import { TestBed } from '@angular/core/testing';
import { CollectionService } from './collection.service';
import { INITIAL_COLLECTIONS_SEED, INITIAL_AGING_SEED } from '../data/collections.seed';

describe('CollectionService', () => {
  let service: CollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionService);
    service.resetToDefault();
  });

  it('should be created with initial collections and aging', () => {
    expect(service).toBeTruthy();
    expect(service.collectionSheets().length).toBe(INITIAL_COLLECTIONS_SEED.length);
    expect(service.agingAccounts().length).toBe(INITIAL_AGING_SEED.length);
  });

  it('should create a new collection sheet', () => {
    service.createCollectionSheet({
      id: '99',
      numero: 'PLC-2026-00999',
      fecha: '08/11/2026',
      cobrador: 'Test Cobrador',
      zona: 'Zona Test',
      documentosCobradas: 1,
      totalRecaudado: 500,
      bancoDestino: 'BCP',
      estado: 'Liquidada',
    });

    expect(service.collectionSheets().length).toBe(INITIAL_COLLECTIONS_SEED.length + 1);
  });

  it('should clear collections and aging cleanly', () => {
    service.clear();
    expect(service.collectionSheets().length).toBe(0);
    expect(service.agingAccounts().length).toBe(0);
  });
});
