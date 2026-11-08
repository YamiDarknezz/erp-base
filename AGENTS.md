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
1. **Extremo Izquierdo**:
   - Botón hamburguesa (icono) para colapsar/expandir el sidebar.
   - Isotipo / Logo del ERP + Identificador de versión (ej. `ERP BASE 6.2`).
   - Módulo o pestaña activa en mayúsculas sobrias (ej. `DASHBOARD`).
2. **Extremo Derecho**:
   - Razón social / Nombre de la empresa (ej. `DISTRIBUIDORA GLOBAL S.A.C. - PE` o configurable).
   - Chip de usuario con avatar, username y nombre completo estructurados en dos líneas compactas.
   - Fila de botones de acción rápida tipo icono circular (Notificaciones, Selector de tema, Soporte, Descarga PWA, Cerrar Sesión).

### Sidebar (Navegación Lateral)
- Desplegable / colapsable al interactuar con el botón de hamburguesa.
- Íconos representativos por cada módulo del sistema (Ventas, Inventario, Facturación, Compras, Reportes, Configuración).

### Área de Trabajo (Main Viewport)
- Panel de Alertas / Indicadores Operacionales destacados (con métricas numéricas grandes, badges de estado crítico/advertencia y botón de actualización).
- Fondo corporativo degradado fluido que se adapta perfectamente tanto al modo claro como al modo oscuro.
- Área inferior minimalista o con marca de agua discreta de versión/producto para prototipo/sample.

---

## 🎨 3. Sistema de Temas y Calidad de Producción

1. **Tokens Centralizados**:
   - Toda propiedad visual de color debe derivar de las variables CSS de [`src/tailwind.css`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/src/tailwind.css) (`surface`, `surface-alt`, `on-surface`, `outline`, `primary`, `danger`, `warning`, `success`).
2. **Cero Mención a "Prueba" o "Demo"**:
   - El proyecto se presenta directamente a clientes finales como producto terminado. No incluir palabras como "prueba", "mock", "demo", "dummy" o similares en textos visibles de la interfaz.
3. **PWA First**:
   - Integración nativa de Progressive Web App con service worker, manifest e instalador reactivo con signals.

---

## 🧪 4. Verificación de Código

- Cada cambio debe verificar que `ng build` compila con 0 errores y que los tests unitarios (`ng test --watch=false`) se ejecutan y aprueban exitosamente.
