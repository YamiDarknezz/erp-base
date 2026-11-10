import { Injectable, signal, computed } from '@angular/core';

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  shortcut?: string;
  badge?: string;
  iconType: 'topbar' | 'sidebar' | 'datagrid' | 'invoice' | 'shortcuts';
}

@Injectable({
  providedIn: 'root',
})
export class TourService {
  readonly STORAGE_DISMISSED_KEY = 'erp_base_tour_dismissed';
  readonly STORAGE_SESSION_CLOSED_KEY = 'erp_base_tour_session_closed';

  readonly steps: TourStep[] = [
    {
      id: 'topbar-multisede',
      title: 'Barra Superior y Multisede',
      subtitle: 'Control centralizado y monitoreo de conectividad',
      description:
        'Visualiza la empresa activa, cambia de sede operativa en tiempo real con un clic y monitorea el estado PWA en línea. Además, activa la búsqueda global rápida presionando Ctrl + K.',
      shortcut: 'Ctrl + K',
      badge: 'Multisede & PWA',
      iconType: 'topbar',
    },
    {
      id: 'sidebar-favoritos',
      title: 'Menú Lateral y Favoritos',
      subtitle: 'Flujos de negocio modulares y accesos rápidos',
      description:
        'Despliega el menú corporativo con Ctrl + B. Navega entre Preventa, Facturación, Inventarios y Cobranzas. Marca cualquier módulo con la estrella para fijarlo en tus Favoritos persistentes.',
      shortcut: 'Ctrl + B',
      badge: 'Navegación Rápida',
      iconType: 'sidebar',
    },
    {
      id: 'datagrid-excel',
      title: 'DataGrid con Auto-Viewport',
      subtitle: 'Tablas de alta densidad sin scroll parásito',
      description:
        'El DataGrid calcula matemáticamente el espacio exacto de la pantalla en tiempo real mediante ResizeObserver. Exporta reportes completos a Excel (.csv con UTF-8 BOM) con caracteres y formato limpios.',
      shortcut: 'Excel BOM',
      badge: 'DataGrid Inteligente',
      iconType: 'datagrid',
    },
    {
      id: 'facturacion-impresion',
      title: 'Facturación e Impresión Fiscal A4',
      subtitle: 'Comprobantes fiscales UBL y SUNAT',
      description:
        'Emite y gestiona Facturas y Boletas electrónicas. Visualiza el comprobante en formato fiscal A4 con hoja membretada, desglose tributario y código QR listo para impresión real.',
      shortcut: 'Visor Fiscal A4',
      badge: 'SUNAT UBL',
      iconType: 'invoice',
    },
    {
      id: 'atajos-notificaciones',
      title: 'Atajos Globales y Centro de Alertas',
      subtitle: 'Máxima productividad sin levantar las manos del teclado',
      description:
        'Presiona ? o F1 para consultar todos los atajos de teclado del sistema. Alterna entre tema claro y oscuro con Ctrl + D y revisa notificaciones operativas en tiempo real al instante.',
      shortcut: 'F1 / ?',
      badge: 'Productividad',
      iconType: 'shortcuts',
    },
  ];

  readonly isTourActive = signal<boolean>(false);
  readonly currentStepIndex = signal<number>(0);
  readonly showWelcomeBubble = signal<boolean>(false);

  readonly currentStep = computed(() => this.steps[this.currentStepIndex()]);
  readonly totalSteps = this.steps.length;
  readonly isFirstStep = computed(() => this.currentStepIndex() === 0);
  readonly isLastStep = computed(() => this.currentStepIndex() === this.steps.length - 1);
  readonly progressPercent = computed(
    () => Math.round(((this.currentStepIndex() + 1) / this.totalSteps) * 100)
  );

  constructor() {
    this.checkInitialWelcome();
  }

  checkInitialWelcome(): void {
    if (typeof window === 'undefined') return;

    try {
      const isDismissed = localStorage.getItem(this.STORAGE_DISMISSED_KEY) === 'true';
      if (isDismissed) {
        this.showWelcomeBubble.set(false);
        return;
      }

      const isSessionClosed = sessionStorage.getItem(this.STORAGE_SESSION_CLOSED_KEY) === 'true';
      if (isSessionClosed) {
        this.showWelcomeBubble.set(false);
        return;
      }

      // Mostrar la burbuja de bienvenida flotante
      this.showWelcomeBubble.set(true);
    } catch {
      this.showWelcomeBubble.set(true);
    }
  }

  startTour(): void {
    this.showWelcomeBubble.set(false);
    this.currentStepIndex.set(0);
    this.isTourActive.set(true);
  }

  nextStep(): void {
    if (this.currentStepIndex() < this.steps.length - 1) {
      this.currentStepIndex.update((i) => i + 1);
    } else {
      this.finishTour();
    }
  }

  prevStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.update((i) => i - 1);
    }
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex.set(index);
    }
  }

  finishTour(): void {
    this.isTourActive.set(false);
  }

  dismissPermanently(): void {
    try {
      localStorage.setItem(this.STORAGE_DISMISSED_KEY, 'true');
    } catch {
      // Ignorar restricciones de almacenamiento
    }
    this.showWelcomeBubble.set(false);
    this.finishTour();
  }

  closeWelcomeForSession(): void {
    try {
      sessionStorage.setItem(this.STORAGE_SESSION_CLOSED_KEY, 'true');
    } catch {
      // Ignorar restricciones de almacenamiento
    }
    this.showWelcomeBubble.set(false);
  }

  /**
   * Restablece la preferencia para volver a ver la bienvenida (útil para pruebas o demos)
   */
  resetPreferences(): void {
    try {
      localStorage.removeItem(this.STORAGE_DISMISSED_KEY);
      sessionStorage.removeItem(this.STORAGE_SESSION_CLOSED_KEY);
    } catch {
      // Ignorar
    }
    this.showWelcomeBubble.set(true);
  }
}
