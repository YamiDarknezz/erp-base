import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-erp-logo',
  templateUrl: './erp-logo.html',
  styleUrl: './erp-logo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErpLogo {
  readonly size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('sm');
  readonly customClass = input<string>('');
}
