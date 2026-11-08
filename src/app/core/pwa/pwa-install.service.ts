import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  readonly canInstall = signal(false);
  readonly isInstalled = signal(false);

  constructor() {
    this.initPwaListeners();
  }

  private initPwaListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.canInstall.set(false);
      this.isInstalled.set(true);
    });

    // Detectar si ya se ejecuta en modo standalone PWA
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const isStandalone =
      (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
      nav?.standalone === true;
    if (isStandalone) {
      this.isInstalled.set(true);
    }
  }

  async install(): Promise<boolean> {
    const promptEvent = this.deferredPrompt;
    if (!promptEvent) return false;

    this.deferredPrompt = null;
    this.canInstall.set(false);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      const accepted = choice.outcome === 'accepted';
      if (accepted) {
        this.isInstalled.set(true);
      }
      return accepted;
    } catch {
      return false;
    }
  }
}
