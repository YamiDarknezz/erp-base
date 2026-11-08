import { TestBed } from '@angular/core/testing';
import { ErpLogo } from './erp-logo';
import { CompanyConfigService } from '../../../core/config/company-config.service';

describe('ErpLogo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErpLogo],
      providers: [CompanyConfigService],
    }).compileComponents();
  });

  it('should create the logo component', () => {
    const fixture = TestBed.createComponent(ErpLogo);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render an SVG with viewbox 0 0 40 40 by default', () => {
    const fixture = TestBed.createComponent(ErpLogo);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const svg = compiled.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 40 40');
  });

  it('should render an img when custom logoUrl is provided in config service', () => {
    const configService = TestBed.inject(CompanyConfigService);
    configService.updateConfig({ logoUrl: 'https://example.com/logo.png' });

    const fixture = TestBed.createComponent(ErpLogo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/logo.png');
  });
});
