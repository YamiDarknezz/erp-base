import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CompanyConfigService } from '../../../core/config/company-config.service';

@Component({
  selector: 'app-erp-logo',
  templateUrl: './erp-logo.html',
  styleUrl: './erp-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErpLogo {
  private readonly configService = inject(CompanyConfigService, { optional: true });

  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('sm');
  readonly customClass = input<string>('');
  readonly src = input<string | null>(null);

  protected effectiveLogoUrl(): string | null {
    return this.src() || this.configService?.logoUrl() || null;
  }
}
