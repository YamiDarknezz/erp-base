# Reglas de Desarrollo y Diseño del Proyecto — ERP Base

Este archivo contiene las directivas obligatorias para cualquier agente o desarrollador que trabaje en esta base de código. Estas reglas son estrictas y deben respetarse en cada implementación.

---

## 🚫 1. Regla de Oro: Botones Exclusivamente con Iconos (PROHIBIDO TEXTO)

- **Queda estrictamente prohibido colocar texto dentro de los botones**, a menos que el usuario lo especifique de manera explícita y textual.
- Todas las acciones se ejecutan mediante **botones de icono optimizados**:
  - Iconos SVG limpios, proporcionados y vectoriales.
  - Atributos de accesibilidad obligatorios: `aria-label` y `title` (tooltip nativo) para describir la acción.
  - Estilos de interacción: fondos hover/active elegantes, focus ring discreto y transiciones suaves.
- **Ejemplos aplicados**:
  - Cerrar sesión: Botón con icono de salida/puerta (`LogOut`), **nunca** el texto "Cerrar Sesión".
  - Instalación PWA: Botón con icono de descarga (`Download`), **nunca** el texto "Instalar App".
  - Tema: Botón con icono de Sol/Luna (`Sun`/`Moon`), **nunca** texto descriptivo.
  - Notificaciones: Botón con icono de campana (`Bell`) con badge numérico flotante.
  - Soporte/Ayuda: Botón con icono de auriculares (`Headphones`).
  - Menú lateral: Botón hamburguesa (`Menu`).
  - Refrescar alertas: Botón con icono de recarga (`RefreshCw`).

---

## 🏛️ 2. Estructura y Jerarquía Visual del Dashboard

Inspirado en la cabecera corporativa de sistemas ERP de alto rendimiento (referencia CHESS ERP):

### Header Superior (TopBar)
1. **Dimensiones compactas**: Altura angosta y sobria (`h-11`, ~44px), optimizada para máxima densidad de información y espacio vertical.
2. **Extremo Izquierdo**:
   - Botón hamburguesa (icono) para colapsar/expandir el sidebar.
   - Isotipo / Logo del ERP + Identificador de versión (ej. `CHESS 6.2.57`).
   - Módulo o pestaña activa en mayúsculas sobrias (ej. `DASHBOARD`).
3. **Extremo Derecho**:
   - Razón social / Nombre de la empresa (ej. `DISTRIBUIDORA GLOBAL S.A.C. - PE` o configurable).
   - Chip de usuario con avatar, username y nombre completo estructurados en dos líneas compactas.
   - Fila de botones de acción rápida tipo icono circular (Notificaciones, Selector de tema, Soporte, Descarga PWA, Cerrar Sesión).

### Sidebar (Navegación Lateral)
- Desplegable / colapsable al interactuar con el botón de hamburguesa.
- Cabecera alineada en altura con el header (`h-11`).
- Íconos representativos por cada módulo del sistema (Ventas, Inventario, Facturación, Compras, Reportes, Configuración).

### Área de Trabajo (Main Viewport)
- Panel de Alertas / Indicadores Operacionales destacados (con métricas numéricas grandes, badges de estado crítico/advertencia y botón de actualización).
- Fondo corporativo degradado fluido que se adapta perfectamente tanto al modo claro como al modo oscuro.
- Área inferior minimalista o con marca de agua discreta de versión/producto para prototipo/sample.

---

## 🔄 3. Sistema de Versionado, Control de Caché y Auditoría

1. **Generación Automática de Build**:
   - Cada compilación ejecuta `node scripts/generate-version.cjs` antes del build (`prebuild`).
   - Computa un hash SHA-256 de las fuentes (`src`, `public`, `package.json`, configs).
   - Genera `public/app-version.json` y `src/app/core/version/app-build.ts`.
2. **Registro Centralizado**:
   - Toda nueva versión o build debe quedar registrada en [`docs/VERSION_TRACKING.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/docs/VERSION_TRACKING.md).
3. **Monitoreo en Runtime (`AppVersionService`)**:
   - Consulta periódica fuera de Angular zone cada 60s con cabeceras `Cache-Control: no-cache, no-store` y `ngsw-bypass=true`.
   - Si detecta versión nueva, despliega notificación flotante con botones de icono.
   - Preserva la sesión del usuario (`sessionStorage` y `localStorage`) al actualizar; no cierra la sesión intempestivamente.

---

## 🎨 4. Sistema de Temas y Calidad de Producción

1. **Tokens Centralizados**:
   - Toda propiedad visual de color debe derivar de las variables CSS de [`src/tailwind.css`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/src/tailwind.css) (`surface`, `surface-alt`, `on-surface`, `outline`, `primary`, `danger`, `warning`, `success`).
2. **Cero Mención a "Prueba" o "Demo"**:
   - El proyecto se presenta directamente a clientes finales como producto terminado. No incluir palabras como "prueba", "mock", "demo", "dummy" o similares en textos visibles de la interfaz.
3. **PWA First**:
   - Integración nativa de Progressive Web App con service worker, manifest e instalador reactivo con signals.

---

## 🧪 5. Verificación de Código

- Cada cambio debe verificar que `ng build` compila con 0 errores y que los tests unitarios (`ng test --watch=false`) se ejecutan y aprueban exitosamente.

---

## 📁 6. Separación Estricta de Archivos (PROHIBIDO HTML/CSS INLINE EN .TS)

- **Queda terminantemente prohibido incluir código HTML en el atributo `template: ...` o CSS en `styles: ...` dentro de los archivos TypeScript (`.ts`)**.
- Todo componente debe tener su archivo de plantilla HTML independiente (`templateUrl: './component.html'`) y su archivo SCSS (`styleUrl: './component.scss'`).
- La arquitectura debe ser modular, limpia y desacoplada.

---

## 📊 7. Grillas de Datos Enterprise Reutilizables (DataGrid)

1. **Componente Reutilizable**: Toda tabla o maestro de datos debe implementar el componente compartido de grilla para evitar redundancias de marcado.
2. **Alta Densidad y Separaciones Verticales**: Filas compactas (`h-6.5`, ~26px), tipografía `11px`, líneas divisorias verticales visibles entre todas las columnas (`border-r border-outline`).
3. **Columna ACCIONES Sticky / Flotante**: La columna de acciones debe fijarse al borde derecho (`sticky right-0`) con sombra y fondo de superficie para permanecer siempre visible cuando la tabla tiene desplazamiento horizontal.
4. **Configuración Real de Columnas**: El botón y pestaña de "Configurar columnas" debe ser funcional en runtime (permitir mostrar/ocultar columnas dinámicamente con persistencia).
5. **Margen Perimetral**: El contenedor de las grillas debe mantener un margen discreto (`p-1.5` o `p-2`) respecto a los bordes de la ventana para un encuadre visual óptimo.
6. **Cero Títulos Duplicados**: La ubicación del módulo reside exclusivamente en la TopBar / Header (`VENTAS \ GESTIÓN`); no debe repetirse en el cuerpo de la página.
