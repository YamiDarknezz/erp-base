# Guía de Responsividad Inteligente y Componentes por Defecto — ERP Base

Esta guía explica la arquitectura de responsividad automática y el uso de los componentes globales por defecto del sistema ERP Base. Diseñado bajo el principio **Zero-Configuraton**: al crear una nueva vista o maestro, el desarrollador **no** necesita ajustar parámetros de altura, ni configurar paginaciones manuales, ni duplicar componentes de diálogo o notificación.

---

## 🎯 1. Filosofía: Reglas Generales vs Datos Hardcodeados

Todo el comportamiento responsivo y visual está centralizado en componentes de orden superior y servicios raíz (`providedIn: 'root'`). 
- **NO hay parámetros hardcodeados por vista**: La responsividad no depende de clases fijas o cálculos manuales en cada componente.
- **Detección Dinámica en Runtime**: Los componentes leen el tamaño real del DOM del dispositivo (`ResizeObserver`, signals de ventana).
- **Valores por Defecto Corporativos**: Si una vista no especifica configuraciones avanzadas, automáticamente hereda la alta densidad (filas de 26px, encuadre al 100% del viewport, columna de acciones sticky y botones con accesibilidad completa).

---

## 📊 2. Grilla de Datos 100% Responsiva (`DataGrid`)

El componente `<app-data-grid />` (`src/app/shared/components/data-grid/`) incorpora un motor de auto-adaptación al viewport.

### Parámetros por Defecto (Heredados Automáticamente)

| Parámetro | Tipo | Valor por Defecto | Propósito |
| :--- | :--- | :--- | :--- |
| `responsiveRows` | `boolean` | `true` | Activa la medición dinámica del contenedor con `ResizeObserver`. |
| `rowHeight` | `number` | `26` | Altura estándar en píxeles de cada fila de datos (`h-6.5`). |
| `minRows` | `number` | `4` | Mínimo de filas a renderizar (evita colapsos en pantallas muy pequeñas). |
| `maxRows` | `number` | `50` | Límite superior por página para optimizar el rendimiento del DOM. |
| `defaultPageSize`| `number` | `12` | Fallback en caso de renderizado sin DOM activo o pruebas unitarias. |
| `showNewButton` | `boolean` | `true` | Muestra el botón de acción rápida (+) con acento verde. |
| `storageKey` | `string` | `'erp-grid-config'`| Clave para persistir configuración de columnas en `localStorage`. |

### Cómo Funciona el Cálculo Automático
```typescript
// Medición en tiempo real
const availableH = Math.max(0, el.clientHeight - theadH - hScrollOffset - 2);
const computedRows = Math.floor(availableH / rowHeight);
const clamped = Math.max(minRows, Math.min(maxRows, computedRows));
```
1. Detecta la altura disponible del contenedor scrolleable.
2. Descuenta la altura de la cabecera ejecutiva (`thead`) y el margen de scroll horizontal si está presente.
3. Divide entre la altura de fila (`26px`) y asigna el `pageSize` exacto.
4. Si el usuario gira la tablet/móvil o redimensiona la ventana del navegador, el `pageSize` y `totalPages` se recalculan en tiempo real sin recargar la página.

---

## 🪟 3. Componentes Pop-up por Defecto (ConfirmDialog & Toast)

Inspirados en sistemas modernos y montados a nivel raíz en [`Shell`](file:///c:/Users/Erick/Documents/Proyectos/YamiDarknezz/erp-base/src/app/layout/shell.html), evitando código repetido en las vistas hijas:

```
src/app/layout/shell.html
├── <router-outlet />              <- Vistas hijas y maestros
├── <app-confirm-dialog />         <- Modal global único de confirmación
└── <app-toast />                  <- Píldora global única de notificaciones
```

### A. Diálogos de Confirmación (`ConfirmDialogService`)
Para operaciones destructivas o críticas (anular, eliminar, cerrar sesión, autorizar):

```typescript
import { inject } from '@angular/core';
import { ConfirmDialogService } from '../../../core/dialog/confirm-dialog.service';

export class MiComponente {
  private readonly confirmDialog = inject(ConfirmDialogService);

  async anularRegistro(id: string): Promise<void> {
    const confirmado = await this.confirmDialog.confirm({
      title: 'Anular Pedido Comercial',
      message: '¿Está seguro de anular este pedido? El stock será devuelto al almacén.',
      tone: 'danger', // 'danger' | 'warning' | 'info'
      confirmText: 'Anular Pedido',
      cancelText: 'Cancelar',
    });

    if (confirmado) {
      // Proceder con la anulación
    }
  }
}
```

### B. Notificaciones Toast (`ToastService`)
Feedback visual inmediato estilo Apple pill en el borde inferior:

```typescript
import { inject } from '@angular/core';
import { ToastService } from '../../../core/notifications/toast.service';

export class MiComponente {
  private readonly toast = inject(ToastService);

  guardar(): void {
    this.toast.success('Cambios guardados con éxito');
    this.toast.warning('El cliente tiene facturas vencidas');
    this.toast.danger('No se pudo establecer conexión con el servicio');
    this.toast.info('Se aplicó la lista de precios mayorista');
  }
}
```

---

## 📱 4. Estándares de Diseño Móvil para Vistas y Modales Nuevos

Para asegurar que cualquier interfaz se adapte con elegancia estética desde teléfonos de 320px hasta pantallas 4K:

1. **Vistas Principales con DataGrid**:
   ```html
   <!-- Ocupa el 100% del viewport sin dobles barras de scroll -->
   <div class="w-full h-full p-1.5 sm:p-2 flex flex-col overflow-hidden bg-surface-alt">
     <app-data-grid ... />
   </div>
   ```

2. **Modales Emergentes Transaccionales**:
   - Contenedor exterior: `fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4`
   - Tarjeta modal: `w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl`
   - Cuerpo scrolleable: `flex-1 overflow-y-auto p-3 sm:p-5 space-y-4`

3. **Tablas Internas dentro de Modales**:
   - Siempre colocar contenedor con desplazamiento horizontal seguro:
   ```html
   <div class="border border-outline/70 rounded-xl overflow-x-auto bg-surface">
     <table class="w-full min-w-[520px] sm:min-w-full border-collapse">
       ...
     </table>
   </div>
   ```

4. **Bloques de Totales y Liquidaciones**:
   - En pantallas móviles deben ser de ancho completo y en escritorio compactos a la derecha:
   ```html
   <div class="flex justify-end pt-2">
     <div class="w-full sm:w-72 bg-surface-alt/50 border border-outline/70 rounded-xl p-3">
       ...
     </div>
   </div>
   ```

5. **Regla de Oro en Todos los Botones**:
   - **PROHIBIDO TEXTO EN BOTONES**. Exclusivamente iconos SVG con atributos de accesibilidad `title` y `aria-label`.

---

## 🛠️ 5. Ejemplo Práctico: Crear una Nueva Vista en 3 Pasos

Ejemplo completo para crear el maestro de **Marcas y Categorías**:

### Paso 1: Definir el Componente TypeScript (`marcas.ts`)
```typescript
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { ConfirmDialogService } from '../../../../core/dialog/confirm-dialog.service';
import { ToastService } from '../../../../core/notifications/toast.service';

@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './marcas.html',
  styleUrl: './marcas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Marcas {
  private readonly confirm = inject(ConfirmDialogService);
  private readonly toast = inject(ToastService);

  protected readonly data = signal([
    { id: '1', codigo: 'MC-01', nombre: 'GLORIA', lineas: 14, estado: 'Activo' },
    { id: '2', codigo: 'MC-02', nombre: 'COCA COLA CO.', lineas: 28, estado: 'Activo' },
  ]);

  protected readonly columns: GridColumn[] = [
    { field: 'codigo', header: 'CÓDIGO', width: '100px' },
    { field: 'nombre', header: 'MARCA / LÍNEA', minWidth: '220px' },
    { field: 'lineas', header: 'N° SKUS', width: '100px', align: 'right', type: 'number' },
    { field: 'estado', header: 'ESTADO', width: '100px', align: 'center', type: 'badge' },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'edit', icon: 'edit', title: 'Editar marca', color: 'emerald' },
    { id: 'delete', icon: 'delete', title: 'Eliminar marca', color: 'rose' },
  ];

  protected async handleAction(evt: { actionId: string; item: any }): Promise<void> {
    if (evt.actionId === 'delete') {
      const ok = await this.confirm.confirm({
        title: 'Eliminar Marca',
        message: `¿Desea eliminar la marca ${evt.item.nombre}?`,
        tone: 'danger',
      });
      if (ok) {
        this.toast.success('Marca eliminada');
      }
    }
  }
}
```

### Paso 2: Plantilla HTML (`marcas.html`)
```html
<div class="w-full h-full p-1.5 sm:p-2 flex flex-col overflow-hidden bg-surface-alt">
  <app-data-grid
    [columns]="columns"
    [data]="data()"
    [actions]="actions"
    storageKey="grid-marcas"
    searchPlaceholder="Buscar por código o nombre..."
    (onAction)="handleAction($event)"
  />
</div>
```

### Paso 3: Estilos SCSS (`marcas.scss`)
```scss
:host {
  display: block;
  width: 100%;
  height: 100%;
}
```

*Con solo esas líneas de código, la nueva vista obtiene de manera 100% automática: cálculo dinámico del viewport, scroll horizontal con acciones fijas, paginación reactiva, búsqueda en vivo, configuración de columnas persistente y diálogos/toasts integrados.*
