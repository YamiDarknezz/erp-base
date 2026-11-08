# ERP Base — Enterprise Architecture & Application Framework

[![Angular](https://img.shields.io/badge/Angular-21.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Vitest](https://img.shields.io/badge/Tests-79%2F79%20Passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions_%2B_Oracle_VPS-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

Solución de software empresarial de **alta densidad de información, ultra responsiva y desacoplada**, diseñada como base sólida para sistemas ERP corporativos modernos (inspirado en la ergonomía y rendimiento de sistemas ERP de clase mundial como CHESS ERP).

---

## 🌐 Demostración en Vivo & Acceso

| Parámetro | Detalle |
| :--- | :--- |
| **URL Demo** | [https://erp.darknezz.dev](https://erp.darknezz.dev) |
| **Usuario Demo** | `admin` |
| **Contraseña** | `admin` (o cualquier valor para prueba de sesión) |
| **Modo Offline** | Soportado mediante PWA Service Worker |

---

## 🏛️ Pilares de Arquitectura y Reglas de Diseño

### 1. Grilla de Datos Enterprise Inteligente (`<app-data-grid />`)
- **Cálculo Automático de Viewport**: La grilla implementa un `ResizeObserver` nativo sobre su contenedor. Mide en milisegundos la altura real disponible y divide matemáticamente entre la altura de fila (`26px`).
- **Zero Configuración Manual**: El desarrollador no calcula tamaños de página fijos ni scrollbars parásitos. Si el usuario rota una tablet o redimensiona la ventana, el componente recalcula en tiempo real el `pageSize` y `totalPages`.
- **Columna de Acciones Sticky**: La columna derecha permanece fija con efecto cristal (`backdrop-blur-xs`) y sombra sutil, garantizando acceso a acciones en tablas con desplazamiento horizontal.
- **Configuración Dinámica de Columnas**: Permite mostrar u ocultar columnas en runtime con persistencia automática en `localStorage` mediante `storageKey`.

### 2. Regla de Oro: Botones 100% Basados en Iconos
- **Cero Texto Innecesario**: Máxima densidad visual y economía de espacio. Las acciones se ejecutan mediante botones vectoriales estilizados.
- **Accesibilidad Total**: Cada botón cuenta de manera obligatoria con atributos nativos `title` (tooltip) y `aria-label` para lectores de pantalla.

### 3. Arquitectura Desacoplada: Cero Datos Hardcodeados
- **Inyección Pura de Servicios de Dominio**: Ningún componente UI almacena arrays de datos en memoria ni lógica simulada local (`SalesService`, `InvoiceService`, `CollectionService`, `ClientService`, `ProductService`).
- **Semillas Aisladas**: Todos los datos iniciales residen en `src/app/core/data/*.seed.ts`, lo que permite sustituir la capa de datos por endpoints REST o GraphQL sin tocar una sola línea de marcado UI.
- **Identidad Dinámica**: Razón social, RUC, sucursales y branding corporativo derivan de `CompanyConfigService`, soportando logotipos SVG o imágenes por URL.

### 4. Sistema Centralizado de Modales y Notificaciones
- Los contenedores globales `<app-confirm-dialog />` y `<app-toast />` residen exclusivamente en el shell de la aplicación (`src/app/layout/shell.html`).
- Cualquier vista o servicio dispara confirmaciones asíncronas con `await this.confirmDialog.confirm({...})` y feedback con `this.toast.success(...)`.

### 5. Control de Versiones en Runtime y Hot Reload
- Cada compilación ejecuta `node scripts/generate-version.cjs` (`prebuild`), calculando un hash SHA-256 de los archivos fuente.
- `AppVersionService` consulta periódicamente fuera de la zona de Angular con cabeceras `Cache-Control: no-cache` y `ngsw-bypass=true`.
- Al detectar una nueva compilación en producción, notifica al usuario permitiendo actualizar sin destruir la sesión activa en `localStorage`/`sessionStorage`.

---

## 💻 Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Framework** | Angular 21 (Signals reactivos, Control Flow `@if` / `@for`, Standalone Components) |
| **Estilos** | Tailwind CSS v4, SCSS modular con variables centralizadas de tokens de diseño |
| **Pruebas** | Vitest + jsdom (23 suites, 79 pruebas unitarias automatizadas) |
| **PWA** | Angular Service Worker (`@angular/service-worker`), Manifest v2, soporte de instalación nativa |
| **Contenerización** | Docker multi-stage (Node 22 Alpine builder + Nginx Alpine runtime) |
| **Servidor Web** | Nginx con compresión Gzip, políticas estrictas de CSP y caché inmutable para assets |
| **Proxy Inverso** | Traefik v3 con resolución automática de certificados SSL (Let's Encrypt) |
| **CI / CD** | GitHub Actions con despliegue continuo vía SSH en Oracle Cloud VPS y rollback automático |

---

## 🚀 Pipeline de CI/CD y Despliegue Automatizado

Inspirado en flujos de entrega continua de nivel de producción:

```mermaid
flowchart LR
    A["Push a master/main"] --> B["GitHub Actions CI"]
    B --> C["Instalación pnpm"]
    C --> D["Pruebas Unitarias (79 tests)"]
    D --> E["Build Producción Angular"]
    E --> F["Construcción Imagen Docker"]
    F --> G["Validación Sintaxis Nginx"]
    G --> H["Smoke Test en Contenedor CI"]
    H --> I["SSH al VPS (Oracle Cloud)"]
    I --> J["Fijar Commit SHA en VPS"]
    J --> K["docker compose build & up"]
    K --> L{"Smoke Test /health y /"}
    L -- "Exitoso (200 OK)" --> M["Registro en despliegues.log"]
    L -- "Fallo" --> N["Rollback Automático al Commit Previo"]
```

### Características de Seguridad del Despliegue:
1. **Despliegue de Commit Exacto**: El script `scripts/desplegar.sh` aplica `git reset --hard <sha>`, garantizando que solo el commit probado y aprobado por el CI llegue a ejecutarse.
2. **Smoke Test Transaccional**: Verifica en bucle que `/health` y `/` respondan con código `200 OK` pasando por la cabecera `Host` del dominio real.
3. **Rollback Automático**: Si el smoke test falla tras un despliegue, el script revierte automáticamente al commit anterior registrado en `despliegue.estado` y notifica el error.
4. **Comando de Reversión Manual**: `bash scripts/desplegar.sh --volver` permite regresar al release previo en cualquier momento.

---

## 📁 Estructura del Proyecto

```
erp-base/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline completo de CI/CD (Test + Docker + SSH Deploy)
├── nginx.conf                   # Configuración de Nginx con caché, gzip y seguridad CSP
├── Dockerfile                   # Construcción multi-stage de producción
├── docker-compose.yml           # Definición de contenedor para Traefik y red proxy
├── scripts/
│   ├── generate-version.cjs     # Generador de SHA-256 y metadata de build
│   └── desplegar.sh             # Script de despliegue con smoke test y auto-rollback
├── public/
│   ├── _headers                 # Cabeceras de seguridad y control de caché
│   ├── _redirects               # Reglas de redirección SPA
│   ├── manifest.webmanifest     # Manifiesto PWA
│   └── icons/                   # Iconografía de la aplicación
├── src/
│   ├── app/
│   │   ├── core/                # Servicios núcleo (Auth, Config, Versión, Contextos, Seeds)
│   │   │   ├── config/          # CompanyConfigService, etc.
│   │   │   ├── context/         # UserContext, BranchContext
│   │   │   ├── data/            # Semillas desacopladas (clients, products, sales, invoices)
│   │   │   ├── dialog/          # ConfirmDialogService
│   │   │   ├── notifications/   # ToastService, NotificationService
│   │   │   └── services/        # Servicios de dominio (Sales, Product, Client, Invoice)
│   │   ├── layout/              # Shell, TopBar h-11, Sidebar colapsable multinivel
│   │   ├── pages/               # Vistas (Dashboard, Ventas, Cuentas por Cobrar, etc.)
│   │   └── shared/              # Componentes UI reusables (<app-data-grid />, modals, inputs)
│   ├── tailwind.css             # Tokens corporativos y variables de tema
│   └── styles.scss              # Estilos base y transiciones
├── package.json
└── pnpm-lock.yaml
```

---

## 🛠️ Instalación y Desarrollo Local

### Requisitos Previos
- **Node.js**: `22.x` o superior
- **pnpm**: `10.x` o superior

```bash
# 1. Clonar el repositorio
git clone https://github.com/YamiDarknezz/erp-base.git
cd erp-base

# 2. Instalar dependencias
pnpm install

# 3. Iniciar servidor de desarrollo
pnpm start
# La aplicación estará disponible en http://localhost:4200

# 4. Ejecutar suite de pruebas unitarias
pnpm test -- --watch=false

# 5. Generar compilación de producción
pnpm build
```

---

## 🔒 Variables de Entorno y Secretos del CI/CD

Para habilitar el despliegue automático en GitHub Actions, configure los siguientes **Repository Secrets** en su repositorio de GitHub:

| Secreto | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `VPS_HOST` | Dirección IP pública o host del VPS | `146.181.50.183` |
| `VPS_USER` | Usuario SSH del servidor | `yami` |
| `DEPLOY_KEY` | Clave privada SSH con acceso al servidor | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.
