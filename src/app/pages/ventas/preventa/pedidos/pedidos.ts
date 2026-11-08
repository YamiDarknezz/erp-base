import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../../shared/components/data-grid/data-grid';
import { OrderEditorModal, CreatedOrderPayload } from '../../../../shared/components/order-editor-modal/order-editor-modal';
import { DocumentViewerModal, FiscalDocumentData } from '../../../../shared/components/document-viewer/document-viewer';

export interface Pedido {
  id: string;
  codigo: string;
  cliente: string;
  vendedor: string;
  fecha: string;
  total: number;
  estado: 'Pendiente' | 'Aprobado' | 'Facturado' | 'Anulado';
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [DataGrid, OrderEditorModal, DocumentViewerModal],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pedidos {
  protected readonly isEditorOpen = signal<boolean>(false);
  protected readonly isViewerOpen = signal<boolean>(false);
  protected readonly selectedDocument = signal<FiscalDocumentData | null>(null);

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

  protected readonly pedidos = signal<Pedido[]>([
    { id: '1', codigo: 'PED-2026-0891', cliente: 'SUPERMERCADOS METRO S.A.', vendedor: 'Carlos Rivas', fecha: '07/11/2026', total: 4850.50, estado: 'Aprobado' },
    { id: '2', codigo: 'PED-2026-0892', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', vendedor: 'Lucía Mendoza', fecha: '07/11/2026', total: 12400.00, estado: 'Pendiente' },
    { id: '3', codigo: 'PED-2026-0893', cliente: 'TIENDAS TAMBO SAC', vendedor: 'Carlos Rivas', fecha: '06/11/2026', total: 3200.75, estado: 'Facturado' },
    { id: '4', codigo: 'PED-2026-0894', cliente: 'BODEGAS UNIDAS LIMA', vendedor: 'Jorge Campos', fecha: '06/11/2026', total: 1890.00, estado: 'Aprobado' },
    { id: '5', codigo: 'PED-2026-0895', cliente: 'COMERCIAL EL SOL S.R.L.', vendedor: 'Lucía Mendoza', fecha: '05/11/2026', total: 7650.20, estado: 'Pendiente' },
    { id: '6', codigo: 'PED-2026-0896', cliente: 'INVERSIONES SAN ROQUE', vendedor: 'Jorge Campos', fecha: '05/11/2026', total: 950.00, estado: 'Anulado' },
  ]);

  protected handleNew(): void {
    this.isEditorOpen.set(true);
  }

  protected onOrderSaved(payload: CreatedOrderPayload): void {
    const nextCode = `PED-2026-0${897 + this.pedidos().length}`;
    const newPedido: Pedido = {
      id: String(Date.now()),
      codigo: nextCode,
      cliente: payload.clienteNombre,
      vendedor: 'Carlos Mendoza Salazar',
      fecha: payload.fechaEmision,
      total: payload.total,
      estado: 'Aprobado',
    };

    this.pedidos.update((prev) => [newPedido, ...prev]);

    this.selectedDocument.set({
      tipoDocumento: 'ORDEN DE PEDIDO FISCAL',
      numero: nextCode,
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

  protected handleAction(evt: { actionId: string; item: Pedido }): void {
    if (evt.actionId === 'print' || evt.actionId === 'view') {
      this.selectedDocument.set({
        tipoDocumento: 'ORDEN DE PEDIDO FISCAL',
        numero: evt.item.codigo,
        cliente: evt.item.cliente,
        documentoIdentidad: '20501234567',
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
      this.pedidos.update((prev) =>
        prev.map((it) => (it.id === evt.item.id ? { ...it, estado: 'Anulado' } : it))
      );
    }
  }
}
