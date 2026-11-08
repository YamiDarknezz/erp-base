import { DestroyRef, Injectable, NgZone, inject, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { APP_BUILD, AppBuildInfo } from './app-build';

export interface RemoteVersionInfo {
  id: string;
  version: string;
  builtAt?: string;
  storageSchema?: number;
}

@Injectable({ providedIn: 'root' })
export class AppVersionService {
  readonly current: AppBuildInfo = APP_BUILD;
  readonly available = signal<boolean>(false);
  readonly latestVersion = signal<string | null>(null);
  readonly dismissed = signal<boolean>(false);
  readonly checking = signal<boolean>(false);
  readonly installing = signal<boolean>(false);
  readonly status = signal<string>('');

  private readonly sw = inject(SwUpdate, { optional: true });
  private readonly zone = inject(NgZone);
  private readonly destroy = inject(DestroyRef);

  private started = false;
  private latestId: string | null = null;
  private workerTask: Promise<boolean> | null = null;

  start(): void {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;

    // Si venimos de una recarga de recuperación con bypass, limpiamos los query params
    const address = new URL(window.location.href);
    if (address.searchParams.has('_erp_update') || address.searchParams.has('ngsw-bypass')) {
      address.searchParams.delete('_erp_update');
      address.searchParams.delete('ngsw-bypass');
      window.history.replaceState(window.history.state, '', address.pathname + address.search + address.hash);
    }

    // Escuchar eventos del Service Worker si está habilitado
    if (this.sw?.isEnabled) {
      const versionSub = this.sw.versionUpdates.subscribe(evt => {
        if (evt.type === 'VERSION_READY') {
          this.zone.run(() => {
            this.available.set(true);
            void this.check();
          });
        }
      });

      const brokenSub = this.sw.unrecoverable.subscribe(() => {
        this.zone.run(() => {
          this.available.set(true);
          this.dismissed.set(false);
          this.status.set('Se requiere actualizar el sistema para continuar.');
        });
      });

      this.destroy.onDestroy(() => {
        versionSub.unsubscribe();
        brokenSub.unsubscribe();
      });
    }

    // Monitoreo en segundo plano fuera de la zona Angular
    this.zone.runOutsideAngular(() => {
      const initialTimer = window.setTimeout(() => {
        void this.check();
      }, 1500);

      const intervalTimer = window.setInterval(() => {
        if (document.visibilityState === 'visible') {
          void this.check();
        }
      }, 30000); // Chequeo cada 30s en runtime

      let lastResume = 0;
      const onResume = () => {
        if (document.visibilityState !== 'visible' || Date.now() - lastResume < 5000) return;
        lastResume = Date.now();
        void this.check();
      };

      window.addEventListener('focus', onResume);
      window.addEventListener('online', onResume);
      document.addEventListener('visibilitychange', onResume);

      // Exponer utilidades globales para depuración y pruebas locales
      (window as unknown as { __erpCheckVersion?: () => Promise<void> }).__erpCheckVersion = () => this.check();
      (window as unknown as { __erpSimulateUpdate?: (v?: string) => void }).__erpSimulateUpdate = (v = '0.0.3') => {
        this.zone.run(() => {
          this.latestVersion.set(v);
          this.available.set(true);
          this.dismissed.set(false);
          this.status.set(`Versión de prueba ${v} simulada.`);
        });
      };

      this.destroy.onDestroy(() => {
        window.clearTimeout(initialTimer);
        window.clearInterval(intervalTimer);
        window.removeEventListener('focus', onResume);
        window.removeEventListener('online', onResume);
        document.removeEventListener('visibilitychange', onResume);
      });
    });
  }

  private withTimeout<T>(operation: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('Operación de versionado excedió tiempo límite')), ms);
      operation.then(
        val => { window.clearTimeout(timer); resolve(val); },
        err => { window.clearTimeout(timer); reject(err); }
      );
    });
  }

  private async readLatest(timeout = 10000): Promise<RemoteVersionInfo> {
    const url = new URL('app-version.json', document.baseURI);
    url.searchParams.set('ngsw-bypass', 'true');
    url.searchParams.set('check', String(Date.now()));

    const controller = new AbortController();
    try {
      return await this.withTimeout(
        (async () => {
          const response = await fetch(url.toString(), {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache, no-store' },
            signal: controller.signal,
          });
          if (!response.ok) throw new Error('No se pudo obtener app-version.json');
          const data = (await response.json()) as RemoteVersionInfo;
          if (!data.id || !data.version) {
            throw new Error('Estructura inválida en app-version.json');
          }
          return data;
        })(),
        timeout
      );
    } finally {
      controller.abort();
    }
  }

  private prepareWorker(): Promise<boolean> {
    if (!this.sw?.isEnabled) return Promise.resolve(false);
    if (!this.workerTask) {
      this.workerTask = this.withTimeout(this.sw.checkForUpdate(), 15000).finally(() => {
        this.workerTask = null;
      });
    }
    return this.workerTask;
  }

  async check(): Promise<void> {
    if (this.checking() || this.installing()) return;

    this.checking.set(true);
    try {
      const remote = await this.readLatest();
      this.zone.run(() => {
        if (remote.id !== this.current.id) {
          if (remote.id !== this.latestId) {
            this.dismissed.set(false);
          }
          this.latestId = remote.id;
          this.latestVersion.set(remote.version);
          this.available.set(true);
          this.status.set(`Nueva versión ${remote.version} lista para aplicar.`);
          console.info(`[VersionService] Nueva versión detectada: v${remote.version} (Build: ${remote.id})`);
        } else {
          this.available.set(false);
          this.latestVersion.set(null);
          this.latestId = null;
          this.status.set('El sistema está actualizado.');
        }
      });
      void this.prepareWorker().catch(() => undefined);
    } catch {
      // Si falla por falta de conexión, no interrumpir la experiencia del usuario
    } finally {
      this.zone.run(() => this.checking.set(false));
    }
  }

  async update(): Promise<void> {
    if (this.installing()) return;
    this.installing.set(true);

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Sin conexión');
      }

      const latest = await this.readLatest(5000);
      this.latestId = latest.id;

      if (this.sw?.isEnabled) {
        try {
          await this.withTimeout(this.prepareWorker(), 4000);
          const activated = await this.withTimeout(this.sw.activateUpdate(), 2000);
          if (!activated && latest.id !== this.current.id) {
            throw new Error('El Service Worker no completó la activación');
          }
          this.reload(false);
          return;
        } catch {
          await this.recoverRegistration();
        }
      }

      this.reload(true);
    } catch (err) {
      console.warn('[Version] Error durante la actualización, reintentando con bypass:', err);
      this.reload(true);
    } finally {
      this.installing.set(false);
    }
  }

  private async recoverRegistration(): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
    } catch {
      // Ignorar para proceder con la recarga
    }
  }

  private reload(bypass: boolean): void {
    if (!bypass) {
      window.location.reload();
      return;
    }
    const address = new URL(window.location.href);
    address.searchParams.set('ngsw-bypass', 'true');
    address.searchParams.set('_erp_update', this.latestId || this.current.id);
    window.location.replace(address.href);
  }

  async hardPurgeAllClientData(): Promise<void> {
    if (typeof window === 'undefined') return;

    if ('caches' in window) {
      try {
        const keys = await window.caches.keys();
        await Promise.all(keys.map(k => window.caches.delete(k)));
      } catch (e) {
        console.warn('Error purgando CacheStorage:', e);
      }
    }

    await this.recoverRegistration();

    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch (e) {
      console.warn('Error limpiando almacenamiento:', e);
    }

    window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
  }
}
