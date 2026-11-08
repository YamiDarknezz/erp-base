# Registro de Versionado y Seguimiento de Releases — ERP Base

Este archivo registra el historial cronológico de versiones, hashes de compilación (SHA-256 de fuentes), fechas de despliegue y notas técnicas para auditoría y control de caché.

---

## 📊 Historial de Builds y Versiones

| Versión | Build ID | Fecha / Hora (UTC) | Descripción del Cambio | Estado |
| :--- | :--- | :--- | :--- | :--- |
<!-- VERSION_ENTRIES -->
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
