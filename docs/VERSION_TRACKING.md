# Registro de Versionado y Seguimiento de Releases — ERP Base

Este archivo registra el historial cronológico de versiones, hashes de compilación (SHA-256 de fuentes), fechas de despliegue y notas técnicas para auditoría y control de caché.

---

## 📊 Historial de Builds y Versiones

| Versión | Build ID | Fecha / Hora (UTC) | Descripción del Cambio | Estado |
| :--- | :--- | :--- | :--- | :--- |
<!-- VERSION_ENTRIES -->
| v0.0.13 | `190f5534438d` | 2026-11-08T21:08:18.698Z | Estandarización total de sangrías y diseño jerárquico del Sidebar (eliminado espacio vacío lateral y unificada guía vertical ml-3 pl-2 border-l); reemplazo de flechas chevron en pestañas terminales por botón de icono de estrella de favoritos con persistencia en localStorage y sección interactiva 'Favoritos' con contador; eliminación de 'Seteos Iniciales'; asignación de micro-iconos SVG vectoriales limpios a todas las sub-opciones de tercer nivel; preservación del Sidebar al abrir modales superpuestos de configuración, perfil y permisos; y solución definitiva al cierre automático de notificaciones al hacer clic fuera (backdrop global transparente y HostListener document:click sin interferencia de backdrop-filter). | Activo |
| v0.0.12 | `180f7a70becf` | 2026-11-08T20:17:55.604Z | Diseño 100% responsivo para móviles y tablets en todas las pantallas y modales; grilla DataGrid inteligente que calcula automáticamente las filas que caben en el viewport mediante ResizeObserver (sin scrollbars parásitos y paginación reactiva en tiempo real); integración de componentes pop-up y notificaciones globales por default (ConfirmDialog y Toast con tonos danger/warning/info y diseño frosted pill Apple) sin componentes sueltos y bajo la estricta Regla de Oro (cero texto en botones, exclusivamente botones de icono accesibles) | Activo |
| v0.0.11 | `56d003144a7c` | 2026-11-08T19:52:31.069Z | Estandarización visual estilo Apple "simple pero premium": tipografía San Francisco y suavizado de fuentes, scrollbars invisibles y minimalistas, tokens de color refinados, header TopBar y drawer lateral con vidrio esmerilado (frosted glass / backdrop-blur-md), micro-interacciones táctiles active:scale-95 en botones de icono, cabecera DataGrid ejecutiva en slate navy profundo con divisores ultrafinos, columna ACCIONES flotante esmerilada con sombra suave, selector SearchableSelect y modales con bordes suavizados (rounded-2xl) e indicadores de alerta operacionales estilo widget iOS | Activo |
| v0.0.10 | `804f3d25d9ca` | 2026-11-08T18:24:33.808Z | Centralización completa desacoplada de la plantilla: CompanyConfigService (branding, razón social, RUC, dirección, teléfono, logo institucional y soporte para endpoints API), UserContextService (perfil, iniciales automáticas, roles y matriz de permisos), BranchContextService (gestión de sucursales operativas), NotificationService (notificaciones operativas con limpieza y descarte reactivo) y servicios de datos de dominio (ClientService, ProductService, SalesService, InvoiceService, CollectionService) con semillas de prueba totalmente aisladas y limpiables sin tocar componentes UI | Activo |
| v0.0.9 | `a6db5c0c10b9` | 2026-11-08T18:05:37.034Z | Selector de búsqueda empresarial SearchableSelect sin desplegables nativos, modal de captura transaccional OrderEditorModal con cálculo en vivo de IGV y totales, visor oficial de comprobantes fiscales DocumentViewerModal (impresión A4 y descarga PDF), módulo de Cuentas por Cobrar (operativo/planillas y reportes/antiguedad-deuda), selector de sede activa en TopBar y buscador global Spotlight (Ctrl + K) | Activo |
| v0.0.8 | `7099814b1a65` | 2026-11-08T16:53:56.648Z | Simetría y arquitectura modular estricta en Inventarios idéntica a Ventas: carpetas agrupadas por operativo (kardex), gestión (artículos, depósitos, grupos) y reportes (stock disponible, stock físico, lotes), y navegación lateral desplegable por categorías | Activo |
| v0.0.7 | `b012720b2946` | 2026-11-08T05:14:08.384Z | Cierre automático al hacer clic fuera (click-outside) en popover de notificaciones y panel de columnas/filtros en DataGrid con soporte Escape; e isotipo vectorizado institucional del ERP unificado mediante componente ErpLogo en Header, Login y favicon de pestaña | Activo |
| v0.0.6 | `7a0f187a5989` | 2026-11-08T05:05:13.450Z | Reestructuración estricta de carpetas por dominio empresarial: eliminación total de carpetas y componentes sueltos en pages, jerarquía modular completa en ventas (preventa, facturación, gestión y reportes con todos sus subcomponentes) e inventarios (kardex, artículos, depósitos, grupos y reportes de stock y lotes) | Activo |
| v0.0.5 | `57207332864c` | 2026-11-08T04:52:11.529Z | Modales interactivos de gestión de permisos por roles, configuración de perfil y ficha de cuenta, redimensionamiento interactivo de columnas en DataGrid con persistencia, navegación completa en Gestión y Reportes, y diferenciación visual de botones de acción vs filtros pasivos | Activo |
| v0.0.4 | `ee809df251e9` | 2026-11-08T04:49:31.980Z | Build generado automáticamente | Activo |
| v0.0.4 | `daa94e9da56e` | 2026-11-08T01:50:15.736Z | Componente compartido DataGrid reutilizable en todas las vistas, eliminación total de HTML inline en .ts, columna ACCIONES fija flotante (sticky right), panel real de configuración de columnas con persistencia y fix de AbortError | Activo |
| v0.0.3 | `04698f96273e` | 2026-11-08T01:40:01.134Z | Grillas de alta densidad estilo ERP enterprise: líneas verticales entre columnas, cabeceras azules, toolbar compacto, cero títulos duplicados, breadcrumbs completos en header y monitor de versiones con zone.run y simulador de pruebas | Activo |
| v0.0.2 | `fddfebb74ff9` | 2026-11-08T01:26:24.088Z | Optimización global: animación fluida izquierda-derecha del sidebar, submenús minimizados por defecto, eliminación de scroll parásito en dashboard, OnPush en todos los componentes | Activo |
| v0.0.1 | `7e23e3e5ef3e` | 2026-11-08T01:20:27.247Z | Build generado automáticamente | Activo |
| v0.0.1 | `dacb3beacee9` | 2026-11-08T01:18:46.867Z | Build generado automáticamente | Activo |
| v0.0.1 | `2d50f88075ad` | 2026-11-08T01:17:44.803Z | Build generado automáticamente | Activo |
| v0.0.1 | `930dab546ef5` | 2026-11-08T01:05:11.544Z | Inicio v0.0.1: Sidebar bajo header con submenús (Operativo, Reportes, Gestión), PWA connect y limpieza placeholder | Activo |
| v6.2.0 | `cdcc2e3e5a84` | 2026-11-08T00:54:40.691Z | Sistema de versionado automatizado, header compacto y control de caché | Activo |
| v1.0.0 | `init-pwa-01` | 2026-11-08T00:40:00.000Z | Implementación de PWA, Shell Dashboard y Auth | Deprecado |

---

## 🛠️ Funcionamiento del Control de Versión Automático

1. **Hash de Fuentes**: Cada compilación ejecuta `scripts/generate-version.cjs` que calcula un hash SHA-256 de todos los archivos (`src/`, `public/`, `package.json`, configuraciones).
2. **`public/app-version.json`**: Se genera automáticamente en la carpeta pública para ser servido con cabecera `Cache-Control: no-cache, no-store`.
3. **`APP_BUILD`**: Se incrusta directamente en el código de Angular (`src/app/core/version/app-build.ts`).
4. **`AppVersionService`**:
   - Monitorea cada 60 segundos en segundo plano mediante `fetch('app-version.json?ngsw-bypass=true&check=Date.now()')`.
   - Si detecta un `id` diferente al compilado en la app del usuario, emite una notificación visual.
   - Al confirmar la actualización, purga Service Workers viejos y recarga limpiamente sin cerrar la sesión del usuario.
