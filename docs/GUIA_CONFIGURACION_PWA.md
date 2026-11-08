# Guía Definitiva: Configuración de PWA en Angular 21

Esta guía documenta la integración e implementación de Progressive Web App (PWA) en proyectos Angular modernos (Angular 21+, standalone components, signals y `@angular/service-worker`).

---

## 1. Dependencias Necesarias

Instalación con `pnpm`:

```bash
pnpm add @angular/service-worker@^21.0.0
pnpm add -D @angular/pwa@^21.0.0
```

> **Importante:** Asegúrate de que las versiones coincidan con la versión principal de `@angular/core` para evitar conflictos de dependencias entre pares (*peer dependencies*).

---

## 2. Archivos de Configuración Clave

### 2.1 `angular.json` — Habilitar el Service Worker en Producción

Dentro de `projects.<tu-app>.architect.build.configurations.production`:

```json
"production": {
  "serviceWorker": "ngsw-config.json",
  "budgets": [ /* ... */ ],
  "outputHashing": "all"
}
```

> **Nota:** El Service Worker sólo se genera y activa en builds de producción (`production`). En modo desarrollo (`ng serve`), permanece desactivado para no almacenar en caché archivos en caliente.

---

### 2.2 `ngsw-config.json` — Estrategia de Caché del Service Worker

Ubicado en la raíz del proyecto:

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.svg",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/**/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-performance",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "performance",
        "maximumSize": 100,
        "maximumAge": 86400000
      }
    },
    {
      "name": "api-freshness",
      "urls": ["/api/live/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maximumSize": 100,
        "maximumAge": 3600000,
        "timeout": 5000
      }
    }
  ]
}
```

---

### 2.3 `public/manifest.webmanifest` — Manifiesto de la Aplicación

Ubicado en `public/` (se transfiere automáticamente al bundle final en `dist/`):

```json
{
  "name": "Sistema ERP - Gestión Integral",
  "short_name": "Sistema ERP",
  "theme_color": "#2563eb",
  "background_color": "#0f172a",
  "display": "standalone",
  "orientation": "any",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

---

### 2.4 `src/index.html` — Enlace al Manifiesto

En la sección `<head>`:

```html
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#2563eb">
```

---

### 2.5 `src/app/app.config.ts` — Registro del Service Worker con Standalone APIs

```ts
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    // otros providers...
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

---

## 3. Servicio Reactivo de Instalación (`PwaInstallService`)

Implementación moderna basada en **Signals**:

```ts
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
    if (!this.deferredPrompt) return false;
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
```

### Uso en Componentes (Regla: Botón de Icono sin texto)
```html
<button
  type="button"
  (click)="pwa.install()"
  [disabled]="!pwa.canInstall() && pwa.isInstalled()"
  title="Descargar versión PWA"
  aria-label="Descargar versión PWA"
  class="p-2 rounded-full border border-outline hover:bg-surface-muted transition-colors"
>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
  </svg>
</button>
```

---

## 4. Despliegue en Servidores (Nginx / Docker)

Para garantizar que el Service Worker y el manifiesto no queden cacheados por proxies o navegadores:

```nginx
types {
  application/manifest+json webmanifest;
}

server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # Sin cache para SW y manifest (siempre frescos)
  location ~* \.(?:webmanifest|json)$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # Service Worker nunca debe cachearse agresivamente
  location = /ngsw-worker.js {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # Cache eficiente para estáticos con hash
  location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 5. Casos Especiales: Despliegue bajo Sub-path (ej. `/ops/`)

Si tu aplicación no se sirve en la raíz del dominio sino bajo una subruta:
1. Compila con: `ng build --base-href /ops/`.
2. En `manifest.webmanifest`: ajusta `"start_url": "/ops/"` y `"scope": "/ops/"`.
3. En `ngsw-config.json`: antepone el prefijo `/ops/` en los patrones de archivos.
4. En Nginx: configura un bloque `location /ops { alias /usr/share/nginx/html/; try_files $uri $uri/ /ops/index.html; }`.

---

## 6. Verificación de la PWA

1. Compila el proyecto en modo producción:
   ```bash
   pnpm build
   ```
2. Sirve el directorio generado (`dist/erp-base`) con un servidor estático (ej. `npx serve dist/erp-base -s`).
3. Abre Chrome / Edge / Firefox DevTools:
   - **Pestaña Application → Manifest**: Debe cargar sin advertencias, mostrando iconos, nombres y colores.
   - **Pestaña Application → Service Workers**: Debe registrarse y activarse `ngsw-worker.js`.
   - **Modo Offline**: Marca la casilla "Offline" en Network y recarga la página; la aplicación continuará funcionando y cargando el shell.
