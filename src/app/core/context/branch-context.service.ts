import { Injectable, signal, computed } from '@angular/core';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  isDefault?: boolean;
}

export const DEFAULT_BRANCHES: Branch[] = [
  { id: 'lima', name: 'SEDE CENTRAL LIMA', code: '001', address: 'Av. Víctor Andrés Belaúnde 147, San Isidro', isDefault: true },
  { id: 'callao', name: 'ALMACÉN PRINCIPAL CALLAO', code: '002', address: 'Av. Argentina N° 2440, Callao' },
  { id: 'norte', name: 'SUCURSAL NORTE CHICLAYO', code: '003', address: 'Av. Salaverry 850, Chiclayo' },
];

@Injectable({
  providedIn: 'root',
})
export class BranchContextService {
  private readonly branchesState = signal<Branch[]>(DEFAULT_BRANCHES);
  private readonly activeBranchState = signal<Branch>(DEFAULT_BRANCHES[0]);

  readonly branches = this.branchesState.asReadonly();
  readonly activeBranch = this.activeBranchState.asReadonly();
  readonly activeBranchName = computed(() => this.activeBranchState().name);
  readonly activeBranchCode = computed(() => this.activeBranchState().code);

  selectBranch(branchIdOrName: string): void {
    const found = this.branchesState().find(
      (b) => b.id === branchIdOrName || b.name === branchIdOrName
    );
    if (found) {
      this.activeBranchState.set(found);
    }
  }

  setBranches(branches: Branch[]): void {
    this.branchesState.set(branches);
    if (branches.length > 0 && !branches.some((b) => b.id === this.activeBranch().id)) {
      this.activeBranchState.set(branches[0]);
    }
  }

  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          this.setBranches(data);
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar la lista remota de sucursales:', err);
    }
  }

  resetToDefault(): void {
    this.branchesState.set(DEFAULT_BRANCHES);
    this.activeBranchState.set(DEFAULT_BRANCHES[0]);
  }
}
