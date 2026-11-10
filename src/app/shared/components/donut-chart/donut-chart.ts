import {
  Component,
  input,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface DonutChartItem {
  label: string;
  value: number;
  color: string; // Tailwind color class or hex (e.g. '#10b981' or 'emerald')
}

export interface DonutSlice {
  label: string;
  value: number;
  percentage: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChart {
  readonly items = input.required<DonutChartItem[]>();
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly centerLabel = input<string>('TOTAL');
  readonly unit = input<string>('');
  readonly showLegend = input(true);
  readonly size = input<number>(140);

  protected readonly hoveredIndex = signal<number | null>(null);

  protected readonly total = computed(() => {
    return this.items().reduce((acc, it) => acc + (it.value || 0), 0);
  });

  protected readonly activeDisplay = computed(() => {
    const idx = this.hoveredIndex();
    const list = this.items();
    if (idx !== null && list[idx]) {
      const it = list[idx];
      const pct = this.total() > 0 ? (it.value / this.total()) * 100 : 0;
      return {
        label: it.label,
        value: it.value,
        pct: `${pct.toFixed(1)}%`,
        color: it.color,
      };
    }
    return {
      label: this.centerLabel(),
      value: this.total(),
      pct: '100%',
      color: 'inherit',
    };
  });

  protected readonly slices = computed<DonutSlice[]>(() => {
    const totalVal = this.total();
    const list = this.items();
    if (totalVal <= 0 || list.length === 0) return [];

    const circumference = 2 * Math.PI * 45; // Radio r=45
    let cumulativeAngle = 0;

    return list.map(it => {
      const pct = (it.value / totalVal) * 100;
      const strokeLength = (pct / 100) * circumference;
      const offset = -((cumulativeAngle / 100) * circumference);
      cumulativeAngle += pct;

      return {
        label: it.label,
        value: it.value,
        percentage: pct,
        color: it.color,
        dashArray: `${strokeLength} ${circumference}`,
        dashOffset: offset,
      };
    });
  });

  protected setHovered(idx: number | null): void {
    this.hoveredIndex.set(idx);
  }
}
