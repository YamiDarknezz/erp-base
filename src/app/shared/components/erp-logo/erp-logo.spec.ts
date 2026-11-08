import { TestBed } from '@angular/core/testing';
import { ErpLogo } from './erp-logo';

describe('ErpLogo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErpLogo],
    }).compileComponents();
  });

  it('should create the logo component', () => {
    const fixture = TestBed.createComponent(ErpLogo);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render an SVG with viewbox 0 0 40 40', () => {
    const fixture = TestBed.createComponent(ErpLogo);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const svg = compiled.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 40 40');
  });
});
