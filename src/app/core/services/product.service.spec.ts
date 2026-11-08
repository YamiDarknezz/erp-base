import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { INITIAL_PRODUCTS_SEED } from '../data/products.seed';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
    service.resetToDefault();
  });

  it('should be created with initial seeded products', () => {
    expect(service).toBeTruthy();
    expect(service.products().length).toBe(INITIAL_PRODUCTS_SEED.length);
    expect(service.skuOptions().length).toBe(INITIAL_PRODUCTS_SEED.length);
  });

  it('should find product by SKU', () => {
    const found = service.findBySku('BEB-001');
    expect(found).toBeDefined();
    expect(found?.descripcion).toContain('INCA KOLA');
  });

  it('should clear products list cleanly', () => {
    service.clear();
    expect(service.products().length).toBe(0);
    expect(service.skuOptions().length).toBe(0);
  });
});
