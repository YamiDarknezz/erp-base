# Registro de Versionado y Seguimiento de Releases — ERP Base

Este archivo registra el historial cronológico de versiones, hashes de compilación (SHA-256 de fuentes), fechas de despliegue y notas técnicas para auditoría y control de caché.

---

## 📊 Historial de Builds y Versiones

| Versión | Build ID | Fecha / Hora (UTC) | Descripción del Cambio | Estado |
| :--- | :--- | :--- | :--- | :--- |
<!-- VERSION_ENTRIES -->
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
