import { Component, inject, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { ConfirmDialogService } from '../../../core/dialog/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  protected readonly confirmService = inject(ConfirmDialogService);

  protected readonly options = computed(() => this.confirmService.options());
  protected readonly tone = computed(() => this.options()?.tone || 'warning');

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.confirmService.isOpen()) {
      this.confirmService.onCancel();
    }
  }
}
