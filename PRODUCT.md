# PRODUCT — ERP Base

> Documento de seguimiento y arquitectura del proyecto. Se actualiza conforme avanza el desarrollo.

---

## 📋 Información General

| Campo         | Valor                                          |
| ------------- | ---------------------------------------------- |
| Nombre        | ERP Base                                       |
| Framework     | Angular 21 (Reactivity: Signals, Control Flow) |
| Estilos       | SCSS + Tailwind CSS v4                         |
| Package Mgr   | pnpm 10.29.3                                   |
| Node          | 24.19.0                                        |
| Tests         | Vitest 4.x                                     |
| SSR           | No (SPA optimizada)                            |
| Routing       | Lazy loaded components con Guards              |

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
- Script inline anti-flicker en `<head>` de `index.html` para evitar destellos blancos antes del renderizado.

---

## 🔐 Autenticación & Control de Acceso

### AuthService (`src/app/core/auth/auth.service.ts`)
- Manejo de sesión reactivo con `signal<boolean>`.
- Persistencia de sesión en `sessionStorage` (`erp_auth`).
- Credenciales configuradas para el acceso administrativo: `admin` / `admin`.
- Cero menciones en UI de credenciales demo o textos de prueba (apariencia 100% de producto real para clientes).

### Route Guards (`src/app/core/auth/auth.guard.ts`)
- **`authGuard`**: Protege rutas privadas (`/dashboard`, módulos del ERP). Si no hay sesión activa, redirige inmediatamente a `/login`.
- **`loginGuard`**: Si el usuario ya está autenticado e intenta visitar `/login`, lo redirige automáticamente a `/dashboard`.

---

## 🗺️ Rutas de la Aplicación (`src/app/app.routes.ts`)

```ts
[
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => Login, canActivate: [loginGuard] },
  { path: 'dashboard', loadComponent: () => Dashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
]
```

---

## 🖥️ Vistas Desarrolladas

### 1. Vista de Login (`/login`)
- **Layout Split Profesional**:
  - **Panel Izquierdo (Marca corporativa)**: Gradiente sobrio, patrón de micro-puntos SVG, isotipo modular geométrico, tipografía de alta jerarquía y presentación de "Gestión integral para su empresa".
  - **Panel Derecho (Formulario)**: Tarjeta limpia, inputs accesibles con bordes y focus ring corporativo, botón con estado de carga animado (`loading()`), mensaje de error sobrio en caso de credenciales incorrectas.
  - **Selector de Tema**: Toggle accesible en la esquina superior para alternar entre tema claro y oscuro en tiempo real.
  - **Adaptabilidad Móvil**: Oculta el panel decorativo en pantallas pequeñas mostrando versión compacta del logo.

### 2. Vista de Dashboard Shell (`/dashboard`)
- Vista protegida que sirve como receptor tras el login exitoso.
- Barra superior con isotipo, nombre de producto, botón de tema y botón de cierre de sesión (`Cerrar Sesión`).

---

## 🧹 Limpieza Inicial del Boilerplate

| Archivo | Qué se hizo |
| --- | --- |
| `src/app/app.html` | Eliminado todo el template demo de Angular. Reemplazado con solo `<router-outlet />`. |
| `src/app/app.ts` | Eliminado `signal('erp-base')`. Componente raíz limpio. |
| `src/app/app.scss` | Reset básico `:host { display: block; }`. |
| `src/styles.scss` | CSS reset global acoplado a los tokens de diseño. |
| `src/index.html` | Título "Sistema ERP", `lang="es"`, favicon SVG y script pre-render theme. |
| `src/app/app.spec.ts` | Test unitario con `TestBed` pasando en Vitest. |
| `public/favicon.ico` | Eliminado el favicon angular por defecto (15 KB). |
| `public/favicon.svg` | Favicon SVG personalizado. |

---

## 📦 Skills de IA Instaladas (.agents/skills)

- **Angular**: `angular-developer`, `reference-core`, `reference-signal-forms`, `reference-compiler-cli`, `adev-writing-guide`, `pr_review`
- **TypeScript**: `typescript-advanced-types`
- **Node.js**: `nodejs-backend-patterns`, `nodejs-best-practices`
- **Vitest**: `vitest`
- **Frontend & Accesibilidad**: `frontend-design`, `accessibility`, `seo`

---

## 🛠️ Estado del Proyecto

- **Build de producción**: `ng build` exitoso (0 errores, bundles separados y lazy loaded).
- **Tests unitarios**: `ng test --watch=false` ejecutado con Vitest (100% pasando).
