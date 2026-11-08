import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

export interface GridColumn {
  field: string;
  header: string;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'badge';
  sortable?: boolean;
  visible?: boolean;
  badgeClassMap?: (val: unknown) => string;
  format?: (val: unknown) => string;
}

export interface GridAction {
  id: string;
  icon: 'view' | 'edit' | 'file' | 'print' | 'delete' | 'check';
  title: string;
  color?: 'primary' | 'emerald' | 'blue' | 'rose' | 'amber';
}

@Component({
  selector: 'app-data-grid',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGrid {
  // Inputs
  readonly columns = input.required<GridColumn[]>();
  readonly data = input.required<any[]>();
  readonly actions = input<GridAction[]>([]);
  readonly showNewButton = input(true);
  readonly showAnuladosFilter = input(false);
  readonly newButtonTitle = input('Nuevo registro');
  readonly searchPlaceholder = input('Buscar...');
  readonly storageKey = input<string>('erp-grid-config');

  // Outputs
  readonly onNew = output<void>();
  readonly onAction = output<{ actionId: string; item: any }>();
  readonly onRefresh = output<void>();
  readonly onExport = output<void>();

  // State
  protected readonly searchQuery = signal('');
  protected readonly incluirAnulados = signal(false);
  protected readonly isConfigOpen = signal(false);
  protected readonly columnsState = signal<GridColumn[]>([]);

  constructor() {
    effect(
      () => {
        const rawCols = this.columns();
        const key = this.storageKey();
        let savedMap: Record<string, boolean> = {};

        try {
          if (typeof localStorage !== 'undefined' && key) {
            const stored = localStorage.getItem(`grid-cols-${key}`);
            if (stored) savedMap = JSON.parse(stored);
          }
        } catch {
          // Fallback a columnas por defecto
        }

        const state: GridColumn[] = rawCols.map(col => ({
          ...col,
          visible: savedMap[col.field] !== undefined ? savedMap[col.field] : col.visible !== false,
        }));

        this.columnsState.set(state);
      }
    );
  }

  protected readonly visibleColumns = computed(() => {
    return this.columnsState().filter(c => c.visible);
  });

  protected readonly filteredData = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const incAnul = this.incluirAnulados();
    const dataList = this.data();
    const cols = this.visibleColumns();

    return dataList.filter(item => {
      if (this.showAnuladosFilter() && !incAnul && item.anulado === true) {
        return false;
      }
      if (!q) return true;

      return cols.some(col => {
        const val = item[col.field];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  });

  protected toggleConfig(): void {
    this.isConfigOpen.update(v => !v);
  }

  protected closeConfig(): void {
    this.isConfigOpen.set(false);
  }

  protected toggleColumnVisibility(field: string): void {
    this.columnsState.update(cols => {
      const updated = cols.map(c => (c.field === field ? { ...c, visible: !c.visible } : c));
      this.persistConfig(updated);
      return updated;
    });
  }

  protected resetColumnsConfig(): void {
    const raw = this.columns().map(c => ({ ...c, visible: c.visible !== false }));
    this.persistConfig(raw);
    this.columnsState.set(raw);
  }

  private persistConfig(cols: GridColumn[]): void {
    try {
      const key = this.storageKey();
      if (typeof localStorage !== 'undefined' && key) {
        const map: Record<string, boolean> = {};
        cols.forEach(c => {
          map[c.field] = !!c.visible;
        });
        localStorage.setItem(`grid-cols-${key}`, JSON.stringify(map));
      }
    } catch {
      // Ignorar restricciones de almacenamiento
    }
  }

  protected triggerAction(actionId: string, item: any, event?: Event): void {
    if (event) event.stopPropagation();
    this.onAction.emit({ actionId, item });
  }

  protected getCellValue(item: any, col: GridColumn): string {
    const val = item[col.field];
    if (col.format) return col.format(val);
    if (val === null || val === undefined) return '';
    return String(val);
  }
}
