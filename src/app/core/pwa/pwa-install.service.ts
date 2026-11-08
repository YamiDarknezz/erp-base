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

  readonly canInstall = this.installable.asReadonly();
  readonly isInstalled = this.installed.asReadonly();

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
      });

      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.installed.set(true);
      }
    }
  }

  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      // In browsers where beforeinstallprompt hasn't fired yet or is already installed
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
      console.error('Error during PWA installation:', err);
    }
    return false;
  }
}
