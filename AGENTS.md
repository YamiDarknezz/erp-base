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

1. **Componente Reutilizable**: Toda tabla o maestro de datos debe implementar el componente compartido `<app-data-grid />` para evitar redundancias de marcado.
2. **Cálculo Automático de Viewport (Zero Configuración Manual)**:
   - `responsiveRows` viene activado por defecto en `true`.
   - La grilla utiliza un `ResizeObserver` nativo sobre su contenedor para medir la altura disponible (`wrapEl.clientHeight - theadH - hScrollOffset - 2`) y divide matemáticamente entre `rowHeight` (`26px` por defecto).
   - El desarrollador **NO** tiene que ajustar manualmente números de filas, scrollbars ni tamaños de página en cada vista; el componente se auto-encuadra al 100% del viewport sin generar scrollbars verticales parásitos.
   - Paginación dinámica en tiempo real: `pageSize` y `totalPages` se recalculan automáticamente si la ventana se redimensiona, si la pantalla se rota o si se abre en un dispositivo móvil.
3. **Alta Densidad y Separaciones Verticales**: Filas compactas (`h-6.5`, ~26px), tipografía `11px`, líneas divisorias verticales visibles entre todas las columnas (`border-r border-outline`).
4. **Columna ACCIONES Sticky / Flotante**: La columna de acciones debe fijarse al borde derecho (`sticky right-0`) con sombra y fondo de superficie esmerilada (`backdrop-blur-xs`) para permanecer siempre visible cuando la tabla tiene desplazamiento horizontal.
5. **Configuración Real de Columnas**: El botón y pestaña de "Configurar columnas" es funcional en runtime (permite mostrar/ocultar columnas dinámicamente con persistencia automática en `localStorage` usando `storageKey`).
6. **Margen Perimetral**: El contenedor de las grillas debe mantener un margen discreto (`p-1.5` o `p-2`) respecto a los bordes de la ventana para un encuadre visual óptimo.
7. **Cero Títulos Duplicados**: La ubicación del módulo reside exclusivamente en la TopBar / Header (`VENTAS \ GESTIÓN`); no debe repetirse en el cuerpo de la página.

---

## 🏛️ 8. Arquitectura Desacoplada: Cero Datos Hardcodeados en Componentes

1. **Inyección Obligatoria de Servicios**:
   - Queda estrictamente prohibido incrustar arrays o datos mock directamente dentro de los componentes UI (`pages/`, `shared/components/`).
   - Todo componente debe inyectar su servicio de dominio (`SalesService`, `InvoiceService`, `CollectionService`, `ClientService`, `ProductService`) o de contexto (`CompanyConfigService`, `UserContextService`, `BranchContextService`, `NotificationService`).
2. **Semillas de Datos Aisladas**:
   - Toda información inicial o de prueba reside en `src/app/core/data/*.seed.ts`.
   - Esto permite purgar datos o conectar endpoints de API reales sin modificar la interfaz de usuario.
3. **Identidad Dinámica (Marca y Logo)**:
   - Razón social, RUC, portal web y logotipos corporativos derivan exclusivamente de `CompanyConfigService`.
   - El componente `ErpLogo` soporta logotipos dinámicos por URL/imagen o isotipo vectorial SVG institucional.
4. **Referencia Técnica**: Consulte [`docs/ARQUITECTURA_CENTRALIZACION_Y_DATOS.md`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz\erp-base/docs/ARQUITECTURA_CENTRALIZACION_Y_DATOS.md) para detalles sobre la estructura y conexión a APIs.

---

## 🪟 9. Sistema Global de Modales y Notificaciones (Pop-ups y Toasts)

1. **Cero Duplicación de Marcado**:
   - Los componentes visuales `<app-confirm-dialog />` y `<app-toast />` residen una sola vez en el contenedor principal (`src/app/layout/shell.html`).
   - Queda estrictamente prohibido volver a declarar modales de confirmación o barras de notificación en las vistas hijas o componentes de página.
2. **Inyección Universal por Servicios**:
   - Cualquier vista nueva que requiera confirmación inyecta directamente `ConfirmDialogService`.
     ```typescript
     const ok = await this.confirmDialog.confirm({
       title: 'Anular Documento',
       message: '¿Está seguro de anular este registro?',
       tone: 'danger', // 'danger' | 'warning' | 'info'
     });
     ```
   - Cualquier vista nueva que requiera feedback feedback toast inyecta directamente `ToastService`.
     ```typescript
     this.toast.success('Registro guardado exitosamente');
     this.toast.warning('Operación ejecutada con advertencias');
     this.toast.danger('Ocurrió un error al procesar');
     this.toast.info('Información actualizada');
     ```
3. **Regla de Oro en Diálogos**: Todos los botones de los modales de confirmación son exclusivamente de iconos con accesibilidad completa (`title` y `aria-label`).

---

## 📱 10. Reglas de Diseño Móvil y Responsividad en Vistas Nuevas

1. **Encuadre de Página (Viewport Seguro)**:
   - Las vistas que alojen maestros o tablas utilizan la clase base `w-full h-full overflow-hidden flex flex-col`.
   - Las vistas de dashboards o paneles estadísticos con scroll vertical utilizan `w-full h-full overflow-y-auto`.
2. **Dimensiones de Modales Emergentes**:
   - Ancho responsivo: `w-full max-w-[calc(100vw-1.5rem)] sm:max-w-xl` (o `max-w-3xl` según el contenido).
   - Altura máxima: `max-h-[92vh]` con `overflow-y-auto` en el cuerpo del formulario para asegurar total usabilidad en móviles apaisados o pantallas pequeñas.
   - Márgenes perimetrales del backdrop: `p-2 sm:p-4`.
3. **Tablas Internas dentro de Modales**:
   - Si un modal incluye una grilla de detalle (ej. ítems de una orden o factura), la tabla debe envolverse en un contenedor con `overflow-x-auto` y la tabla tener `min-w-[500px] sm:min-w-full`. Esto previene cortes de texto o desbordes horizontales en pantallas estrechas.
4. **Tarjetas de Totales y Resúmenes Transaccionales**:
   - En vistas o modales con cálculos de subtotales e impuestos, la caja de resumen debe tener `w-full sm:w-72` (ancho completo en smartphone, ancho fijo alineado a la derecha en escritorio).
5. **Cero Ruptura de Textos o Encabezados**:
   - En encabezados de tarjetas con badges o acciones, usar siempre `flex flex-col sm:flex-row sm:items-center justify-between gap-1` y aplicar `truncate` con atributo `title` nativo en textos largos.

---

## 🚀 11. Guía Rápida: Cómo Crear una Vista Nueva en 3 Pasos (Zero Boilerplate)

Al crear una nueva pantalla o maestro, el desarrollador **NO** necesita volver a ajustar parámetros de responsividad ni configurar librerías externas:

1. **Crear el servicio o consumir el servicio de dominio existente**:
   - Inyectar en el componente `.ts` el servicio correspondiente (ej. `SalesService`, `ClientService`).
2. **Definir columnas y acciones en el TypeScript**:
   - Declarar el array `columns: GridColumn[] = [...]` y `actions: GridAction[] = [...]`.
   - Inyectar `ConfirmDialogService` o `ToastService` si requiere confirmaciones o alertas.
3. **Insertar el componente DataGrid en la plantilla HTML**:
   ```html
   <app-data-grid
     [columns]="columns"
     [data]="miData()"
     [actions]="actions"
     storageKey="nombre-modulo-grid"
     (onNew)="abrirModalNuevo()"
     (onAction)="ejecutarAccion($event)"
   />
   ```
   *Listo. La grilla automáticamente medirá la pantalla, paginará las filas exactas, activará scroll lateral fluido con columna sticky y respetará el diseño corporativo sin configuración adicional.*
