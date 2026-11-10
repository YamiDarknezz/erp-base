import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  HostListener,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ToastService } from '../../../core/notifications/toast.service';
import { exportToExcel } from '../../../core/utils/excel-export.util';

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
export class DataGrid implements AfterViewInit, OnDestroy {
  // Inputs
  readonly columns = input.required<GridColumn[]>();
  readonly data = input.required<any[]>();
  readonly actions = input<GridAction[]>([]);
  readonly showNewButton = input(true);
  readonly showAnuladosFilter = input(false);
  readonly newButtonTitle = input('Nuevo registro');
  readonly searchPlaceholder = input('Buscar...');
  readonly storageKey = input<string>('erp-grid-config');
  readonly responsiveRows = input(true);
  readonly defaultPageSize = input(12);
  readonly minRows = input(4);
  readonly maxRows = input(50);
  readonly rowHeight = input(26);
  readonly exportFileName = input<string>('reporte-datos');

  private readonly toast = inject(ToastService);

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

  // Pagination & Dynamic Viewport State
  protected readonly pageSize = signal(12);
  protected readonly currentPage = signal(1);

  @ViewChild('tableContainer') private tableContainerRef?: ElementRef<HTMLElement>;
  private resizeObserver?: ResizeObserver;
  private resizeTimeout?: ReturnType<typeof setTimeout>;

  // Column Resizing State
  private resizingCol: string | null = null;
  private startX = 0;
  private startWidth = 0;

  constructor() {
    // Configuración inicial de columnas y persistencia
    effect(() => {
      const rawCols = this.columns();
      const key = this.storageKey();
      let savedMap: Record<string, { visible: boolean; width?: string }> = {};

      try {
        if (typeof localStorage !== 'undefined' && key) {
          const stored = localStorage.getItem(`grid-cols-${key}`);
          if (stored) savedMap = JSON.parse(stored);
        }
      } catch {
        // Fallback a columnas por defecto
      }

      const state: GridColumn[] = rawCols.map(col => {
        const saved = savedMap[col.field];
        return {
          ...col,
          visible: saved?.visible !== undefined ? saved.visible : col.visible !== false,
          width: saved?.width ? saved.width : col.width,
          minWidth: saved?.width ? saved.width : col.minWidth,
        };
      });

      this.columnsState.set(state);
    });

    // Resetear a página 1 al cambiar filtros o término de búsqueda
    effect(() => {
      this.searchQuery();
      this.incluirAnulados();
      this.currentPage.set(1);
    });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.responsiveRows()) {
      // Cálculo inicial de filas disponibles
      requestAnimationFrame(() => {
        this.recalculatePageSize();

        if (typeof ResizeObserver !== 'undefined' && this.tableContainerRef?.nativeElement) {
          this.resizeObserver = new ResizeObserver(() => {
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.recalculatePageSize(), 80);
          });
          this.resizeObserver.observe(this.tableContainerRef.nativeElement);
        }
      });
    } else {
      this.pageSize.set(this.defaultPageSize());
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.responsiveRows()) {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.recalculatePageSize(), 100);
    }
  }

  /**
   * Calcula el número de filas que caben exactamente en el viewport del contenedor
   * garantizando que el cuadro sea 100% responsivo sin scrollbars parásitos.
   */
  public recalculatePageSize(): void {
    if (typeof window === 'undefined') return;
    const el = this.tableContainerRef?.nativeElement;
    if (!el || el.clientHeight < 50) return;

    const theadEl = el.querySelector('thead') as HTMLElement | null;
    const theadH = theadEl ? theadEl.offsetHeight : 28;

    const isMobile = window.innerWidth < 1024;
    const hasHScroll = isMobile || (el.scrollWidth > el.clientWidth + 1);
    const hScrollOffset = hasHScroll ? 10 : 0;

    const rowH = this.rowHeight();
    const availableH = Math.max(0, el.clientHeight - theadH - hScrollOffset - 2);
    const computedRows = Math.floor(availableH / rowH);
    const clamped = Math.max(this.minRows(), Math.min(this.maxRows(), computedRows));

    if (clamped !== this.pageSize()) {
      const oldSize = this.pageSize();
      const currentFirstIndex = (this.currentPage() - 1) * oldSize;
      this.pageSize.set(clamped);
      const newPage = Math.max(1, Math.floor(currentFirstIndex / clamped) + 1);
      this.currentPage.set(Math.min(newPage, this.totalPages()));
    }
  }

  protected onResizeStart(event: MouseEvent, field: string): void {
    event.preventDefault();
    event.stopPropagation();

    this.resizingCol = field;
    this.startX = event.clientX;

    const th = (event.target as HTMLElement).closest('th');
    this.startWidth = th ? th.offsetWidth : 100;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!this.resizingCol) return;
      const deltaX = moveEvent.clientX - this.startX;
      const newWidth = Math.max(50, this.startWidth + deltaX);
      this.columnsState.update(cols =>
        cols.map(c =>
          c.field === this.resizingCol ? { ...c, width: `${newWidth}px`, minWidth: `${newWidth}px` } : c
        )
      );
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (this.resizingCol) {
        this.persistConfig(this.columnsState());
        this.resizingCol = null;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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

  protected readonly totalFiltered = computed(() => this.filteredData().length);

  protected readonly totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.totalFiltered() / this.pageSize()));
  });

  protected readonly paginatedData = computed(() => {
    const total = this.totalFiltered();
    if (total === 0) return [];

    const page = Math.min(this.currentPage(), this.totalPages());
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.filteredData().slice(start, start + size);
  });

  protected readonly showingRange = computed(() => {
    const total = this.totalFiltered();
    if (total === 0) return '0 de 0';

    const page = Math.min(this.currentPage(), this.totalPages());
    const size = this.pageSize();
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return `${start} - ${end} de ${total}`;
  });

  protected goToFirstPage(): void {
    this.currentPage.set(1);
  }

  protected goToPrevPage(): void {
    this.currentPage.update(p => Math.max(1, p - 1));
  }

  protected goToNextPage(): void {
    this.currentPage.update(p => Math.min(this.totalPages(), p + 1));
  }

  protected goToLastPage(): void {
    this.currentPage.set(this.totalPages());
  }

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

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isConfigOpen()) {
      this.closeConfig();
    }
  }

  private persistConfig(cols: GridColumn[]): void {
    try {
      const key = this.storageKey();
      if (typeof localStorage !== 'undefined' && key) {
        const map: Record<string, { visible: boolean; width?: string }> = {};
        cols.forEach(c => {
          map[c.field] = { visible: !!c.visible, width: c.width };
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

  protected handleExportClick(): void {
    const cols = this.visibleColumns();
    const rows = this.filteredData();

    if (rows.length === 0) {
      this.toast.warning('No existen registros para exportar');
      return;
    }

    const success = exportToExcel({
      fileName: this.exportFileName(),
      columns: cols.map(c => ({ header: c.header, field: c.field, type: c.type })),
      data: rows,
    });

    if (success) {
      this.toast.success(`Exportación completada (${rows.length} registros generados)`);
    } else {
      this.toast.danger('No se pudo generar el archivo de exportación');
    }

    this.onExport.emit();
  }

  protected getCellValue(item: any, col: GridColumn): string {
    const val = item[col.field];
    if (col.format) return col.format(val);
    if (val === null || val === undefined) return '';
    return String(val);
  }
}
