import { Injectable, signal, computed } from '@angular/core';
import { ClientEntity, INITIAL_CLIENTS_SEED } from '../data/clients.seed';
import { SelectOption } from '../../shared/components/searchable-select/searchable-select';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly clientsState = signal<ClientEntity[]>(INITIAL_CLIENTS_SEED);

  readonly clients = this.clientsState.asReadonly();

  readonly clientSelectOptions = computed<SelectOption[]>(() => {
    return this.clientsState().map((c) => ({
      value: c.ruc,
      label: c.razonSocial,
      sublabel: `RUC ${c.ruc} — ${c.localidad}, ${c.provincia}`,
      badge: c.categoria || c.tipoContribuyente,
    }));
  });

  addClient(client: ClientEntity): void {
    this.clientsState.update((prev) => [client, ...prev]);
  }

  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          this.clientsState.set(data);
        }
      }
    } catch (err) {
      console.warn('Error al cargar catálogo de clientes remoto:', err);
    }
  }

  clear(): void {
    this.clientsState.set([]);
  }

  resetToDefault(): void {
    this.clientsState.set(INITIAL_CLIENTS_SEED);
  }
}
