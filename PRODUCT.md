# PRODUCT — ERP Base

> Documento de seguimiento del proyecto. Se actualiza conforme avanza el desarrollo.

---

## 📋 Información General

| Campo         | Valor                  |
| ------------- | ---------------------- |
| Nombre        | ERP Base               |
| Framework     | Angular 21             |
| Estilos       | SCSS                   |
| Package Mgr   | pnpm 10.29.3           |
| Node          | 24.19.0                |
| Tests         | Vitest 4.x             |
| CSS Framework | Tailwind CSS 4.3.5 (v4)|
| SSR           | No (SPA)               |

---

## 🧹 Limpieza Inicial (v0.0.0)

### Archivos limpiados

| Archivo | Qué se hizo |
| --- | --- |
| `src/app/app.html` | **Eliminado** todo el template demo de Angular (342 líneas de SVGs, links, estilos inline). Reemplazado con solo `<router-outlet />`. |
| `src/app/app.ts` | **Eliminado** el `signal('erp-base')` del título. Componente limpio sin lógica innecesaria. |
| `src/app/app.scss` | **Agregado** estilo base `:host` con `display: block` y `min-height: 100vh`. |
| `src/styles.scss` | **Reescrito** con CSS reset básico (box-sizing, margin/padding reset, font-family del sistema, colores neutros). |
| `src/index.html` | **Cambiado** `lang="en"` → `lang="es"`, título a "ERP Base", referencia al nuevo favicon SVG. |
| `src/app/app.spec.ts` | **Simplificado** el test para que solo valide que la app se crea correctamente. |
| `public/favicon.ico` | **Eliminado** el favicon por defecto de Angular (15 KB). |
| `public/favicon.svg` | **Creado** favicon SVG personalizado: letra "E" blanca sobre fondo oscuro (#1a1a2e) con accent rojo (#e94560). |
| `README.md` | **Reescrito** con info del proyecto, requisitos y comandos útiles. |

### Autoskills instaladas (13)

Skills de buenas prácticas AI auto-detectadas e instaladas:

- **Angular**: `angular-developer`, `reference-core`, `reference-signal-forms`, `reference-compiler-cli`, `adev-writing-guide`, `pr_review`
- **TypeScript**: `typescript-advanced-types`
- **Node.js**: `nodejs-backend-patterns`, `nodejs-best-practices`
- **Vitest**: `vitest`
- **Frontend**: `frontend-design`, `accessibility`, `seo`

### Estado del build

```
✔ Build exitoso
Initial total: 187.24 kB (51.05 kB transferido)
0 errores, 0 warnings
```

---

## 🗂️ Estructura actual

```
erp-base/
├── public/
│   └── favicon.svg          # Favicon personalizado SVG
├── src/
│   ├── app/
│   │   ├── app.config.ts    # Configuración de la app (providers)
│   │   ├── app.html         # Template raíz (solo router-outlet)
│   │   ├── app.routes.ts    # Rutas (vacías, listas para configurar)
│   │   ├── app.scss         # Estilos del componente raíz
│   │   ├── app.spec.ts      # Test del componente raíz
│   │   └── app.ts           # Componente raíz
│   ├── index.html           # HTML host
│   ├── main.ts              # Bootstrap de la app
│   └── styles.scss          # Estilos globales + CSS reset
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── README.md
```

---

## 🚧 Pendiente (por definir)

- [ ] Diseño / layout del ERP (sidebar, header, etc.)
- [ ] Sistema de rutas y módulos
- [ ] Librería de componentes UI
- [ ] Autenticación
- [ ] Tema / design tokens
- [ ] API / servicios

---

## 🎨 Tailwind CSS v4 (añadido)

Instalado via `ng add tailwindcss`. Configuración generada:

- `src/tailwind.css` — punto de entrada con `@import 'tailwindcss'`
- `.postcssrc.json` — plugin `@tailwindcss/postcss`
- `angular.json` — `tailwind.css` añadido al array de `styles`

> **Nota:** Tailwind v4 NO usa `tailwind.config.js`. La configuración se maneja con CSS variables directamente.

---

> _Esperando indicaciones del usuario para definir el diseño._
