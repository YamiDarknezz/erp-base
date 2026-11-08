import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'warning' | 'danger';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly currentToast = signal<ToastMessage | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  show(message: string, tone: 'success' | 'info' | 'warning' | 'danger' = 'success', duration = 3500): void {
    if (this.timer) clearTimeout(this.timer);

    const toast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      tone,
    };

    this.currentToast.set(toast);

    this.timer = setTimeout(() => {
      this.dismiss();
    }, duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  danger(message: string): void {
    this.show(message, 'danger');
  }

  dismiss(): void {
    if (this.timer) clearTimeout(this.timer);
    this.currentToast.set(null);
  }
}
