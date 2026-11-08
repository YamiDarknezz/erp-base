import { Injectable, signal, computed } from '@angular/core';
import { ProductEntity, INITIAL_PRODUCTS_SEED } from '../data/products.seed';
import { SelectOption } from '../../shared/components/searchable-select/searchable-select';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsState = signal<ProductEntity[]>(INITIAL_PRODUCTS_SEED);

  readonly products = this.productsState.asReadonly();

  readonly skuOptions = computed<SelectOption[]>(() => {
    return this.productsState().map((p) => ({
      value: p.sku,
      label: `[${p.sku}] ${p.descripcion}`,
      sublabel: `Unid: ${p.unidad} | Ref: S/ ${p.precioUnitario.toFixed(2)} | Stock: ${p.stockActual}`,
      badge: p.unidad,
    }));
  });

  findBySku(sku: string): ProductEntity | undefined {
    return this.productsState().find((p) => p.sku === sku);
  }

  addProduct(product: ProductEntity): void {
    this.productsState.update((prev) => [product, ...prev]);
  }

  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          this.productsState.set(data);
        }
      }
    } catch (err) {
      console.warn('Error al cargar catálogo de productos remoto:', err);
    }
  }

  clear(): void {
    this.productsState.set([]);
  }

  resetToDefault(): void {
    this.productsState.set(INITIAL_PRODUCTS_SEED);
  }
}
