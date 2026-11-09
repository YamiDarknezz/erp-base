import { Injectable, signal, computed } from '@angular/core';

export interface CompanyConfig {
  name: string;
  tradeName: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  appTitle: string;
  appSubtitle: string;
  logoUrl?: string | null;
}

export const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  name: 'DISTRIBUIDORA GLOBAL S.A.C. - PE',
  tradeName: 'DISTRIBUCIÓN Y LOGÍSTICA CORPORATIVA',
  ruc: '20501234567',
  address: 'Av. Los Robles 450, San Isidro - Lima, Perú',
  phone: '(01) 710-5000',
  email: 'contacto@globalerp.pe',
  website: 'portal.globalerp.pe',
  appTitle: 'ERP BASE',
  appSubtitle: 'Sistema de Gestión Empresarial Integral',
  logoUrl: null,
};

@Injectable({
  providedIn: 'root',
})
export class CompanyConfigService {
  private readonly configState = signal<CompanyConfig>(DEFAULT_COMPANY_CONFIG);

  // Readonly signals for consumer components
  readonly config = this.configState.asReadonly();
  readonly name = computed(() => this.configState().name);
  readonly ruc = computed(() => this.configState().ruc);
  readonly tradeName = computed(() => this.configState().tradeName);
  readonly address = computed(() => this.configState().address);
  readonly phone = computed(() => this.configState().phone);
  readonly email = computed(() => this.configState().email);
  readonly website = computed(() => this.configState().website);
  readonly appTitle = computed(() => this.configState().appTitle);
  readonly logoUrl = computed(() => this.configState().logoUrl);

  /**
   * Actualiza los datos de la empresa en tiempo de ejecución.
   * Si mañana se conecta un endpoint de configuración o tenant,
   * se llama a este método directamente.
   */
  updateConfig(partial: Partial<CompanyConfig>): void {
    this.configState.update((prev) => ({
      ...prev,
      ...partial,
    }));
  }

  /**
   * Carga la configuración institucional desde un endpoint HTTP o JSON.
   */
  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        this.updateConfig(data);
      }
    } catch (err) {
      console.warn('No se pudo cargar la configuración remota de empresa:', err);
    }
  }

  /**
   * Restablece la configuración a los valores predeterminados.
   */
  resetToDefault(): void {
    this.configState.set(DEFAULT_COMPANY_CONFIG);
  }
}
