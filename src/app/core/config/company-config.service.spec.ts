import { TestBed } from '@angular/core/testing';
import { CompanyConfigService, DEFAULT_COMPANY_CONFIG } from './company-config.service';

describe('CompanyConfigService', () => {
  let service: CompanyConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyConfigService);
    service.resetToDefault();
  });

  it('should be created with default config', () => {
    expect(service).toBeTruthy();
    expect(service.name()).toBe(DEFAULT_COMPANY_CONFIG.name);
    expect(service.ruc()).toBe(DEFAULT_COMPANY_CONFIG.ruc);
  });

  it('should update company name and ruc dynamically', () => {
    service.updateConfig({
      name: 'NUEVA EMPRESA CORP S.A.C.',
      ruc: '20999999999',
    });

    expect(service.name()).toBe('NUEVA EMPRESA CORP S.A.C.');
    expect(service.ruc()).toBe('20999999999');
  });

  it('should update logoUrl dynamically when new brand icon is provided', () => {
    service.updateConfig({
      logoUrl: 'https://cdn.example.com/brand-logo.svg',
    });

    expect(service.logoUrl()).toBe('https://cdn.example.com/brand-logo.svg');
  });

  it('should reset back to defaults', () => {
    service.updateConfig({ name: 'TEMPORAL' });
    expect(service.name()).toBe('TEMPORAL');
    service.resetToDefault();
    expect(service.name()).toBe(DEFAULT_COMPANY_CONFIG.name);
  });
});
