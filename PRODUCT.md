# PRODUCT — ERP Base

> Documento de seguimiento y arquitectura del proyecto. Se actualiza conforme avanza el desarrollo.

---

## 📋 Información General

| Campo         | Valor                                          |
| ------------- | ---------------------------------------------- |
| Nombre        | ERP Base (Inspirado en CHESS ERP)              |
| Versión       | 0.0.1 (En desarrollo)                         |
| Framework     | Angular 21 (Reactivity: Signals, Control Flow) |
| Estilos       | SCSS + Tailwind CSS v4                         |
| PWA           | `@angular/service-worker` v21 + Web Manifest   |
| Package Mgr   | pnpm 10.29.3                                   |
| Node          | 24.19.0                                        |
| Tests         | Vitest 4.x                                     |
| SSR           | No (SPA optimizada)                            |
| Routing       | Lazy loaded components con Guards              |

---

## 🚫 Reglas de Diseño Estrictas (`AGENTS.md`)

Registradas formalmente en `AGENTS.md`:
1. **PROHIBIDO EL TEXTO EN BOTONES**: Todos los botones de acción usan exclusivamente **iconos optimizados** (SVG limpios, vectoriales, con `title` y `aria-label`). No se permite texto visible dentro de los botones a menos que el usuario lo solicite explícitamente.
2. **Jerarquía Visual y Header Compacto**: Header angosto y de alta densidad (`h-11`, ~44px) con menú hamburguesa, marca + versión, pestaña activa, empresa a la derecha, chip de usuario y fila de botones circulares tipo icono.
3. **Cero Mención a Demos**: Interfaz lista para clientes finales sin términos como "prueba", "mock" o "demo".

---

## 🔄 Sistema de Versionado, Control de Caché y Auditoría

Implementación integral para erradicar cachés obsoletas y evitar "pantallas blancas":
- **`scripts/generate-version.cjs`**: Script ejecutado automáticamente en `prebuild` que computa el SHA-256 de todo el código fuente y genera:
  - `public/app-version.json` (servido estáticamente sin caché).
  - `src/app/core/version/app-build.ts` (embebido en el bundle de Angular).
- **`AppVersionService`**: Servicio reactivo que monitorea en segundo plano (cada 60s fuera de la zona Angular y al recuperar foco/red) si hay una nueva versión disponible mediante `fetch('app-version.json?ngsw-bypass=true&check=Date.now()')`.
- **Actualización Segura sin Pérdida de Sesión**: Al aplicar una nueva versión, se activa el nuevo Service Worker (o se purgan los corruptos vía `recoverRegistration`) y se recarga la aplicación preservando la sesión y tokens del usuario.
- **Registro Centralizado**: Historial de versiones y hashes en [`docs/VERSION_TRACKING.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/docs/VERSION_TRACKING.md).
- **Guía de Referencia**: Documentada en [`docs/GUIA_SISTEMA_VERSIONADO_Y_CACHE.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/docs/GUIA_SISTEMA_VERSIONADO_Y_CACHE.md).

---

## 📱 Progressive Web App (PWA)

Configuración completa e integrada:
- **Service Worker**: Activado en producción con `ngsw-config.json` y registrado mediante `provideServiceWorker` en `app.config.ts`.
- **Manifiesto**: `public/manifest.webmanifest` con iconos en `public/icons/` (192x192, 512x512 y SVG maskable), `display: standalone` y `theme_color: #2563eb`.
- **Servicio de Instalación (`PwaInstallService`)**: Basado en **Signals**, detecta `beforeinstallprompt`, expone `canInstall` y ejecuta `install()`.
- **Botón de Descarga PWA**: Ubicado en el header superior como botón de icono (descarga) para instalar la app en Windows/Android/macOS.
- **Documentación**: Trasladada y mejorada en [`docs/GUIA_CONFIGURACION_PWA.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/docs/GUIA_CONFIGURACION_PWA.md).

---

## 🎨 Sistema de Temas (Design Tokens & Modo Claro/Oscuro)

Configuración centralizada en `src/tailwind.css` utilizando variables CSS nativas y variantes Tailwind v4 (`@custom-variant dark` y `@theme`):

### Paleta Semántica
- **Surface**:
  - Claro: `--surface: #ffffff`, `--surface-alt: #f8fafc`, `--surface-muted: #f1f5f9`
  - Oscuro: `--surface: #0f172a`, `--surface-alt: #1e293b`, `--surface-muted: #334155`
- **Textos (On-Surface)**:
  - Claro: `--on-surface: #0f172a`, `--on-surface-variant: #475569`, `--on-surface-muted: #94a3b8`
  - Oscuro: `--on-surface: #f1f5f9`, `--on-surface-variant: #94a3b8`, `--on-surface-muted: #64748b`
- **Bordes (Outline)**:
  - Claro: `--outline: #e2e8f0`, `--outline-variant: #cbd5e1`
  - Oscuro: `--outline: #334155`, `--outline-variant: #475569`
- **Colores de Acento y Estado**:
  - Primary (Azul corporativo): `#2563eb` (light) / `#3b82f6` (dark)
  - Danger (Rojo): `#dc2626` / `#ef4444`
  - Success (Verde): `#16a34a` / `#22c55e`
  - Warning (Ámbar): `#d97706` / `#f59e0b`

### ThemeService (`src/app/core/theme/theme.service.ts`)
- Basado en Angular **Signals** y **Effects** reactivos.
- Persistencia en `localStorage` (`erp-theme`).
- Detección automática de preferencia del sistema operativo (`prefers-color-scheme`).
- Script inline anti-flicker en `<head>` de `index.html`.

---

## 🔐 Autenticación & Control de Acceso

- **`AuthService`**: Señal reactiva `isAuthenticated`, persistencia en `sessionStorage`, credenciales `admin` / `admin`.
- **`authGuard`**: Redirige a `/login` si no hay sesión.
- **`loginGuard`**: Redirige a `/dashboard` si ya hay sesión activa.

---

## 🖥️ Vistas Desarrolladas

### 1. Vista de Login (`/login`)
- Layout split corporativo con marca en panel izquierdo, formulario limpio a la derecha y selector de tema por icono.

### 2. Vista de Dashboard (`/dashboard`)
Inspirada en el sistema CHESS ERP:
- **Header Superior (Angosto y Compacto `h-11`)**:
  - **Izquierda**: Botón hamburguesa (icono), Isotipo + Texto "CHESS 6.2.57", Pestaña activa en badge "DASHBOARD".
  - **Derecha**: Nombre de la empresa (`DISTRIBUIDORA GLOBAL S.A.C. - PE`), Chip de usuario (`admin` - `Administrador General`), y fila de botones circulares de acción tipo icono:
    - 🔔 **Notificaciones** con badge flotante y popover de alertas recientes.
    - 🌓 **Tema** claro/oscuro.
    - 🎧 **Soporte** / Mesa de ayuda.
    - 📥 **Descarga PWA** / Versión instalable.
    - 🚪 **Cerrar Sesión** segura.
- **Sidebar Retráctil**:
  - Desplegable al accionar la hamburguesa con backdrop desenfocado.
  - Altura de cabecera alineada a `h-11`.
  - Módulos del ERP: Dashboard, Ventas y Facturación, Inventario, Compras, Logística, Finanzas, Reportes, Configuración.
  - Indicador de estado "Conectado al servidor central" y versión.
- **Panel Central de Alertas Operacionales**:
  - Tarjetas destacadas en ámbar y rojo (SKU bajo margen, Comprobantes no informados, Planillas por liquidar, Despachos pendientes, Cuentas por cobrar).
  - Indicadores con números prominentes, badges de advertencia e iconos de detalle.
  - Timestamp de actualización y botón de refresco por icono.
- **Fondo Ambiental & Marca de Agua**:
  - Degradado fluido con ondas SVG sutiles adaptadas al tema claro y oscuro.
  - Marca de agua "CHESS 6.2" en la esquina inferior izquierda.

---

## 📁 Organización de la Carpeta `docs/`

Toda la documentación técnica del proyecto se encuentra centralizada y ordenada:
- [`docs/GUIA_CONFIGURACION_PWA.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/docs/GUIA_CONFIGURACION_PWA.md): Guía de Service Worker, PWA, Nginx y offline.
- [`docs/GUIA_SISTEMA_VERSIONADO_Y_CACHE.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/docs/GUIA_SISTEMA_VERSIONADO_Y_CACHE.md): Arquitectura de control de caché, hashing SHA-256 y actualización en runtime.
- [`docs/VERSION_TRACKING.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/docs/VERSION_TRACKING.md): Historial cronológico de builds y versiones desplegadas.

---

## 🛠️ Estado del Proyecto

- **Build de producción**: `ng build` exitoso con hook `prebuild` (0 errores, Service Worker generado, assets listos).
- **Tests unitarios**: `ng test --watch=false` ejecutado con Vitest (100% pasando).
