import { Injectable, signal } from '@angular/core';
import {
  CollectionSheetEntity,
  AgingAccountEntity,
  INITIAL_COLLECTIONS_SEED,
  INITIAL_AGING_SEED,
} from '../data/collections.seed';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly sheetsState = signal<CollectionSheetEntity[]>(INITIAL_COLLECTIONS_SEED);
  private readonly agingState = signal<AgingAccountEntity[]>(INITIAL_AGING_SEED);

  readonly collectionSheets = this.sheetsState.asReadonly();
  readonly agingAccounts = this.agingState.asReadonly();

  createCollectionSheet(sheet: CollectionSheetEntity): void {
    this.sheetsState.update((prev) => [sheet, ...prev]);
  }

  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.sheets) this.sheetsState.set(data.sheets);
        if (data.aging) this.agingState.set(data.aging);
      }
    } catch (err) {
      console.warn('Error al cargar datos de cobranzas remotos:', err);
    }
  }

  clear(): void {
    this.sheetsState.set([]);
    this.agingState.set([]);
  }

  resetToDefault(): void {
    this.sheetsState.set(INITIAL_COLLECTIONS_SEED);
    this.agingState.set(INITIAL_AGING_SEED);
  }
}
