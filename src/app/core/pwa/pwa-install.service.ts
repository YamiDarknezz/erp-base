import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private readonly installable = signal<boolean>(false);
  private readonly installed = signal<boolean>(false);
  private readonly notification = signal<string | null>(null);

  readonly canInstall = this.installable.asReadonly();
  readonly isInstalled = this.installed.asReadonly();
  readonly message = this.notification.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        this.installable.set(true);
      });

      window.addEventListener('appinstalled', () => {
        this.installable.set(false);
        this.installed.set(true);
        this.deferredPrompt = null;
        this.showTemporaryMessage('¡Aplicación PWA instalada exitosamente!');
      });

      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.installed.set(true);
      }
    }
  }

  async install(): Promise<boolean> {
    if (this.installed()) {
      this.showTemporaryMessage('La aplicación ya se encuentra instalada en este dispositivo.');
      return false;
    }

    if (!this.deferredPrompt) {
      this.showTemporaryMessage('Para instalar la aplicación, utilice el icono de instalación en la barra de direcciones de su navegador.');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        this.installable.set(false);
        this.deferredPrompt = null;
        return true;
      }
    } catch (err) {
      console.error('Error durante la instalación PWA:', err);
    }
    return false;
  }

  private showTemporaryMessage(msg: string): void {
    this.notification.set(msg);
    setTimeout(() => {
      if (this.notification() === msg) {
        this.notification.set(null);
      }
    }, 4500);
  }

  clearMessage(): void {
    this.notification.set(null);
  }
}
