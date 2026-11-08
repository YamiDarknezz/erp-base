import {
  Component,
  input,
  model,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  sublabel?: string;
  badge?: string;
}

@Component({
  selector: 'app-searchable-select',
  imports: [FormsModule],
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableSelect {
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>('Seleccionar...');
  readonly searchPlaceholder = input<string>('Buscar en el catálogo...');
  readonly disabled = input<boolean>(false);

  // Two-way binding for value
  readonly value = model<any>(null);
  readonly onSelect = output<SelectOption>();

  protected readonly isOpen = signal(false);
  protected readonly searchQuery = signal('');
  private readonly filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');

  // Currently selected option object computed from value & options
  protected readonly selectedOption = computed(() => {
    const val = this.value();
    if (val === null || val === undefined) return null;
    return this.options().find(o => o.value === val) || null;
  });

  // Filtered options based on search query
  protected readonly filteredOptions = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.options();
    if (!q) return all;
    return all.filter(
      o =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(q)) ||
        (o.badge && o.badge.toLowerCase().includes(q)),
    );
  });

  toggleOpen(): void {
    if (this.disabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.disabled()) return;
    this.searchQuery.set('');
    this.isOpen.set(true);
    setTimeout(() => {
      this.filterInput()?.nativeElement?.focus();
    }, 50);
  }

  close(): void {
    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  selectOption(opt: SelectOption): void {
    this.value.set(opt.value);
    this.onSelect.emit(opt);
    this.close();
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.value.set(null);
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
