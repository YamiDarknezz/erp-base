import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface BarChartItem {
  label: string;
  value: number;
  target?: number;
  color?: string; // Hex or CSS color
  formattedValue?: string;
  tag?: string;
}

export interface ComputedBarRow {
  label: string;
  value: number;
  target?: number;
  pct: number;
  targetPct?: number;
  color: string;
  formattedValue: string;
  tag?: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChart {
  readonly items = input.required<BarChartItem[]>();
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly unit = input<string>('');
  readonly currencySymbol = input<string>('');

  protected readonly maxVal = computed(() => {
    const list = this.items();
    if (list.length === 0) return 100;
    const max = Math.max(...list.map(it => Math.max(it.value || 0, it.target || 0)));
    return max > 0 ? max * 1.05 : 100; // Un 5% de margen visual
  });

  protected readonly rows = computed<ComputedBarRow[]>(() => {
    const ceiling = this.maxVal();
    return this.items().map(it => {
      const val = Math.max(0, it.value || 0);
      const pct = Math.min(100, (val / ceiling) * 100);
      const targetPct = it.target ? Math.min(100, (it.target / ceiling) * 100) : undefined;
      const formatted = it.formattedValue || (this.currencySymbol() ? `${this.currencySymbol()} ${val.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : `${val} ${this.unit()}`.trim());

      return {
        label: it.label,
        value: val,
        target: it.target,
        pct,
        targetPct,
        color: it.color || '#3b82f6',
        formattedValue: formatted,
        tag: it.tag,
      };
    });
  });
}
