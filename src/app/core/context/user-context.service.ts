import { Injectable, signal, computed } from '@angular/core';

export interface UserProfile {
  username: string;
  fullName: string;
  initials: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  timeoutMinutes: number;
}

export interface RolePermission {
  modulo: string;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  anular: boolean;
  exportar: boolean;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  username: 'admin',
  fullName: 'Carlos Mendoza Salazar',
  initials: 'CM',
  email: 'admin@globalerp.pe',
  role: 'Administrador General',
  avatarUrl: null,
  timeoutMinutes: 30,
};

export const DEFAULT_ROLES: string[] = [
  'Administrador General',
  'Jefe de Almacén',
  'Vendedor',
  'Contador General',
  'Supervisor Comercial',
];

export const DEFAULT_PERMISSIONS: RolePermission[] = [
  { modulo: 'Preventa (Órdenes y Pedidos)', ver: true, crear: true, editar: true, anular: false, exportar: true },
  { modulo: 'Facturación Electrónica', ver: true, crear: false, editar: false, anular: false, exportar: true },
  { modulo: 'Control de Inventarios', ver: true, crear: false, editar: false, anular: false, exportar: true },
  { modulo: 'Reportes de Stock y Lotes', ver: true, crear: false, editar: false, anular: false, exportar: true },
  { modulo: 'Gestión de Catálogos (SKU/Clientes)', ver: true, crear: true, editar: true, anular: false, exportar: false },
  { modulo: 'Cuentas por Cobrar y Planillas', ver: true, crear: true, editar: true, anular: false, exportar: true },
];

@Injectable({
  providedIn: 'root',
})
export class UserContextService {
  private readonly userState = signal<UserProfile>(DEFAULT_USER_PROFILE);
  private readonly rolesState = signal<string[]>(DEFAULT_ROLES);
  private readonly selectedRoleState = signal<string>('Vendedor');
  private readonly permissionsState = signal<RolePermission[]>(DEFAULT_PERMISSIONS);

  // Readonly signals
  readonly user = this.userState.asReadonly();
  readonly username = computed(() => this.userState().username);
  readonly fullName = computed(() => this.userState().fullName);
  readonly initials = computed(() => this.userState().initials);
  readonly email = computed(() => this.userState().email);
  readonly role = computed(() => this.userState().role);
  readonly avatarUrl = computed(() => this.userState().avatarUrl);
  readonly timeoutMinutes = computed(() => this.userState().timeoutMinutes);

  readonly roles = this.rolesState.asReadonly();
  readonly selectedRole = this.selectedRoleState.asReadonly();
  readonly permissions = this.permissionsState.asReadonly();

  /**
   * Actualiza los datos del usuario logueado en tiempo de ejecución.
   */
  updateProfile(partial: Partial<UserProfile>): void {
    this.userState.update((prev) => {
      const next = { ...prev, ...partial };
      if (partial.fullName && !partial.initials) {
        next.initials = next.fullName
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0].toUpperCase())
          .join('');
      }
      return next;
    });
  }

  selectRole(role: string): void {
    this.selectedRoleState.set(role);
  }

  updatePermission(modulo: string, field: keyof RolePermission, value: boolean): void {
    this.permissionsState.update((prev) =>
      prev.map((perm) => (perm.modulo === modulo ? { ...perm, [field]: value } : perm))
    );
  }

  /**
   * Carga el perfil del usuario desde un endpoint de autenticación / sesión.
   */
  async loadFromApi(endpointUrl: string): Promise<void> {
    try {
      const response = await fetch(endpointUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        this.updateProfile(data);
      }
    } catch (err) {
      console.warn('No se pudo cargar el perfil remoto de usuario:', err);
    }
  }

  resetToDefault(): void {
    this.userState.set(DEFAULT_USER_PROFILE);
    this.rolesState.set(DEFAULT_ROLES);
    this.selectedRoleState.set('Vendedor');
    this.permissionsState.set(DEFAULT_PERMISSIONS);
  }
}
