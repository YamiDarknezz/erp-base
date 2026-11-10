import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { ToastService } from '../notifications/toast.service';

@Injectable({ providedIn: 'root' })
export class NetworkStatusService {
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef, { optional: true });

  readonly isOnline = signal<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  private onlineHandler: (() => void) | null = null;
  private offlineHandler: (() => void) | null = null;

  constructor() {
    this.initNetworkListeners();
  }

  private initNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    this.onlineHandler = () => {
      this.isOnline.set(true);
      this.toast.success('Conexión a Internet restablecida: Sistema sincronizado');
    };

    this.offlineHandler = () => {
      this.isOnline.set(false);
      this.toast.warning('Sin conexión a Internet: Operando en modo local PWA (Cache first)');
    };

    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);

    this.destroyRef?.onDestroy(() => {
      if (this.onlineHandler) {
        window.removeEventListener('online', this.onlineHandler);
      }
      if (this.offlineHandler) {
        window.removeEventListener('offline', this.offlineHandler);
      }
    });
  }

  /**
   * Permite simular o actualizar el estado en tests o entornos específicos
   */
  setOnline(status: boolean): void {
    this.isOnline.set(status);
  }
}
