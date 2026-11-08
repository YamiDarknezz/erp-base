import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { OrderEditorModal, CreatedOrderPayload } from '../../../../shared/components/order-editor-modal/order-editor-modal';
import { DocumentViewerModal, FiscalDocumentData } from '../../../../shared/components/document-viewer/document-viewer';
import { SalesService } from '../../../../core/services/sales.service';
import { OrderEntity } from '../../../../core/data/orders.seed';
import { ConfirmDialogService } from '../../../../core/dialog/confirm-dialog.service';
import { ToastService } from '../../../../core/notifications/toast.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [DataGrid, OrderEditorModal, DocumentViewerModal],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pedidos {
  private readonly salesService = inject(SalesService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly toast = inject(ToastService);

  protected readonly isEditorOpen = signal<boolean>(false);
  protected readonly isViewerOpen = signal<boolean>(false);
  protected readonly selectedDocument = signal<FiscalDocumentData | null>(null);

  protected readonly pedidos = this.salesService.orders;

  protected readonly columns: GridColumn[] = [
    { field: 'codigo', header: 'N° PEDIDO', width: '120px', align: 'left' },
    { field: 'cliente', header: 'CLIENTE', minWidth: '240px' },
    { field: 'vendedor', header: 'ASESOR COMERCIAL', width: '160px' },
    { field: 'fecha', header: 'FECHA EMISIÓN', width: '110px', align: 'center', type: 'date' },
    { field: 'total', header: 'TOTAL (S/)', width: '120px', align: 'right', type: 'currency' },
    {
      field: 'estado',
      header: 'ESTADO',
      width: '100px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        switch (val) {
          case 'Aprobado':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          case 'Pendiente':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          case 'Facturado':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
          case 'Anulado':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          default:
            return 'bg-surface-muted text-on-surface';
        }
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver comprobante en visor', color: 'primary' },
    { id: 'edit', icon: 'edit', title: 'Editar pedido comercial', color: 'emerald' },
    { id: 'print', icon: 'print', title: 'Imprimir orden fiscal', color: 'blue' },
    { id: 'delete', icon: 'delete', title: 'Anular pedido', color: 'rose' },
  ];

  protected handleNew(): void {
    this.isEditorOpen.set(true);
  }

  protected onOrderSaved(payload: CreatedOrderPayload): void {
    const created = this.salesService.createOrder(payload);
    this.toast.success(`Pedido ${created.codigo} registrado exitosamente`);

    this.selectedDocument.set({
      tipoDocumento: 'ORDEN DE PEDIDO FISCAL',
      numero: created.codigo,
      cliente: payload.clienteNombre,
      documentoIdentidad: payload.documentoIdentidad,
      direccion: 'Av. Industrial N° 450, Urb. Vulcano, Lima',
      fechaEmision: payload.fechaEmision,
      condicionPago: payload.condicionPago,
      moneda: payload.moneda,
      items: payload.items.map((it) => ({
        sku: it.sku,
        descripcion: it.descripcion,
        cantidad: it.cantidad,
        unidad: it.unidad,
        precioUnitario: it.precioUnitario,
        subtotal: it.cantidad * it.precioUnitario,
      })),
    });

    this.isViewerOpen.set(true);
  }

  protected async handleAction(evt: { actionId: string; item: OrderEntity }): Promise<void> {
    if (evt.actionId === 'print' || evt.actionId === 'view') {
      this.selectedDocument.set({
        tipoDocumento: 'ORDEN DE PEDIDO FISCAL',
        numero: evt.item.codigo,
        cliente: evt.item.cliente,
        documentoIdentidad: evt.item.clienteRuc || '20501234567',
        direccion: 'Av. Industrial N° 450, Urb. Vulcano, Lima',
        fechaEmision: evt.item.fecha,
        condicionPago: 'Crédito 30 días',
        moneda: 'PEN',
        items: [
          { sku: 'BEB-001', descripcion: 'INCA KOLA PET 500ML RETORNABLE PACK X24', cantidad: 20, unidad: 'CJA', precioUnitario: 38.50, subtotal: 770.00 },
          { sku: 'BEB-002', descripcion: 'COCA COLA REGULAR 1.5L PACK X12', cantidad: 15, unidad: 'CJA', precioUnitario: 52.00, subtotal: 780.00 },
          { sku: 'ACE-201', descripcion: 'ACEITE VEGETAL PRIMOR CLÁSICO 1L CAJA X12', cantidad: 30, unidad: 'CJA', precioUnitario: 88.00, subtotal: 2640.00 },
        ],
      });
      this.isViewerOpen.set(true);
    } else if (evt.actionId === 'delete') {
      const ok = await this.confirmDialog.confirm({
        title: 'Anular Pedido Comercial',
        message: `¿Está seguro de que desea anular el pedido ${evt.item.codigo} de ${evt.item.cliente}? Esta acción cambiará el estado a Anulado.`,
        confirmText: 'Anular Pedido',
        cancelText: 'Cancelar',
        tone: 'danger',
      });
      if (ok) {
        this.salesService.cancelOrder(evt.item.id);
        this.toast.warning(`Pedido ${evt.item.codigo} anulado exitosamente`);
      }
    }
  }
}
