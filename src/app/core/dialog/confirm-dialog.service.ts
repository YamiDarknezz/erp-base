import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  tone?: 'danger' | 'warning' | 'info';
  confirmTitle?: string;
  cancelTitle?: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  readonly isOpen = signal(false);
  readonly options = signal<ConfirmOptions | null>(null);

  private resolvePromise: ((value: boolean) => void) | null = null;

  confirm(options: ConfirmOptions): Promise<boolean> {
    this.options.set(options);
    this.isOpen.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  onConfirm(): void {
    this.isOpen.set(false);
    this.resolvePromise?.(true);
    this.resolvePromise = null;
  }

  onCancel(): void {
    this.isOpen.set(false);
    this.resolvePromise?.(false);
    this.resolvePromise = null;
  }
}
