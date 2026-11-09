import { TestBed } from '@angular/core/testing';
import { UserContextService, DEFAULT_USER_PROFILE } from './user-context.service';

describe('UserContextService', () => {
  let service: UserContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserContextService);
    service.resetToDefault();
  });

  it('should be created with default user data', () => {
    expect(service).toBeTruthy();
    expect(service.username()).toBe(DEFAULT_USER_PROFILE.username);
    expect(service.fullName()).toBe(DEFAULT_USER_PROFILE.fullName);
  });

  it('should update user profile and auto-generate initials', () => {
    service.updateProfile({
      fullName: 'Carlos Mendoza Ramos',
      email: 'carlos@globalerp.pe',
    });

    expect(service.fullName()).toBe('Carlos Mendoza Ramos');
    expect(service.initials()).toBe('CM');
    expect(service.email()).toBe('carlos@globalerp.pe');
  });

  it('should update role and permissions', () => {
    service.selectRole('Contador General');
    expect(service.selectedRole()).toBe('Contador General');

    service.updatePermission('Facturación Electrónica', 'crear', true);
    const facturacion = service.permissions().find((p) => p.modulo === 'Facturación Electrónica');
    expect(facturacion?.crear).toBe(true);
  });
});
