import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DataGrid, GridColumn, GridAction } from '../../../shared/components/data-grid/data-grid';
import { OrderEditorModal, CreatedOrderPayload } from '../../../shared/components/order-editor-modal/order-editor-modal';
import { DocumentViewerModal, FiscalDocumentData } from '../../../shared/components/document-viewer/document-viewer';

export interface Factura {
  id: string;
  serieNumero: string;
  cliente: string;
  ruc: string;
  fechaEmision: string;
  monto: number;
  igv: number;
  total: number;
  estadoEnvio: 'Aceptado' | 'Pendiente' | 'Rechazado';
}

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [DataGrid, OrderEditorModal, DocumentViewerModal],
  templateUrl: './facturacion.html',
  styleUrl: './facturacion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Facturacion {
  protected readonly isEditorOpen = signal<boolean>(false);
  protected readonly isViewerOpen = signal<boolean>(false);
  protected readonly selectedDocument = signal<FiscalDocumentData | null>(null);

  protected readonly columns: GridColumn[] = [
    { field: 'serieNumero', header: 'COMPROBANTE', width: '130px', align: 'left' },
    { field: 'cliente', header: 'RAZÓN SOCIAL CLIENTE', minWidth: '240px' },
    { field: 'ruc', header: 'RUC / DNI', width: '120px', type: 'number' },
    { field: 'fechaEmision', header: 'FECHA EMISIÓN', width: '110px', align: 'center', type: 'date' },
    { field: 'monto', header: 'SUBTOTAL (S/)', width: '120px', align: 'right', type: 'currency' },
    { field: 'igv', header: 'IGV (S/)', width: '100px', align: 'right', type: 'currency' },
    { field: 'total', header: 'TOTAL (S/)', width: '120px', align: 'right', type: 'currency' },
    {
      field: 'estadoEnvio',
      header: 'ESTADO',
      width: '100px',
      align: 'center',
      type: 'badge',
      badgeClassMap: (val: unknown) => {
        switch (val) {
          case 'Aceptado':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
          case 'Pendiente':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          case 'Rechazado':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          default:
            return 'bg-surface-muted text-on-surface';
        }
      },
    },
  ];

  protected readonly actions: GridAction[] = [
    { id: 'view', icon: 'view', title: 'Ver factura en visor PDF', color: 'primary' },
    { id: 'print', icon: 'print', title: 'Imprimir comprobante fiscal', color: 'blue' },
    { id: 'xml', icon: 'check', title: 'Descargar comprobante XML firmado SUNAT', color: 'emerald' },
  ];

  protected readonly facturas = signal<Factura[]>([
    { id: '1', serieNumero: 'F001-0004521', cliente: 'SUPERMERCADOS METRO S.A.', ruc: '20100070970', fechaEmision: '07/11/2026', monto: 4110.59, igv: 739.91, total: 4850.50, estadoEnvio: 'Aceptado' },
    { id: '2', serieNumero: 'F001-0004522', cliente: 'DISTRIBUIDORA NORTE E.I.R.L.', ruc: '20489632514', fechaEmision: '07/11/2026', monto: 10508.47, igv: 1891.53, total: 12400.00, estadoEnvio: 'Pendiente' },
    { id: '3', serieNumero: 'B001-0012890', cliente: 'TIENDAS TAMBO SAC', ruc: '20563458921', fechaEmision: '06/11/2026', monto: 2712.50, igv: 488.25, total: 3200.75, estadoEnvio: 'Aceptado' },
    { id: '4', serieNumero: 'F001-0004523', cliente: 'BODEGAS UNIDAS LIMA', ruc: '20601239845', fechaEmision: '06/11/2026', monto: 1601.69, igv: 288.31, total: 1890.00, estadoEnvio: 'Aceptado' },
    { id: '5', serieNumero: 'F001-0004524', cliente: 'COMERCIAL EL SOL S.R.L.', ruc: '20512897456', fechaEmision: '05/11/2026', monto: 6483.22, igv: 1166.98, total: 7650.20, estadoEnvio: 'Rechazado' },
  ]);

  protected handleNew(): void {
    this.isEditorOpen.set(true);
  }

  protected onOrderSaved(payload: CreatedOrderPayload): void {
    const nextNum = `F001-000${4525 + this.facturas().length}`;
    const newFactura: Factura = {
      id: String(Date.now()),
      serieNumero: nextNum,
      cliente: payload.clienteNombre,
      ruc: payload.documentoIdentidad,
      fechaEmision: payload.fechaEmision,
      monto: payload.subtotal,
      igv: payload.igv,
      total: payload.total,
      estadoEnvio: 'Aceptado',
    };

    this.facturas.update((prev) => [newFactura, ...prev]);

    this.selectedDocument.set({
      tipoDocumento: 'FACTURA ELECTRÓNICA',
      numero: nextNum,
      cliente: payload.clienteNombre,
      documentoIdentidad: payload.documentoIdentidad,
      direccion: 'Av. Las Begonias 441, San Isidro, Lima',
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

  protected handleAction(evt: { actionId: string; item: Factura }): void {
    if (evt.actionId === 'view' || evt.actionId === 'print') {
      this.selectedDocument.set({
        tipoDocumento: evt.item.serieNumero.startsWith('B') ? 'BOLETA DE VENTA ELECTRÓNICA' : 'FACTURA ELECTRÓNICA',
        numero: evt.item.serieNumero,
        cliente: evt.item.cliente,
        documentoIdentidad: evt.item.ruc,
        direccion: 'Av. Víctor Andrés Belaúnde 147, San Isidro, Lima',
        fechaEmision: evt.item.fechaEmision,
        condicionPago: 'Crédito 30 días',
        moneda: 'PEN',
        items: [
          { sku: 'BEB-001', descripcion: 'INCA KOLA PET 500ML RETORNABLE PACK X24', cantidad: 10, unidad: 'CJA', precioUnitario: 38.50, subtotal: 385.00 },
          { sku: 'ACE-201', descripcion: 'ACEITE VEGETAL PRIMOR CLÁSICO 1L CAJA X12', cantidad: 5, unidad: 'CJA', precioUnitario: 88.00, subtotal: 440.00 },
        ],
      });
      this.isViewerOpen.set(true);
    } else if (evt.actionId === 'xml') {
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"><ID>${evt.item.serieNumero}</ID><IssueDate>${evt.item.fechaEmision}</IssueDate></Invoice>`;
      const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `20501234567-01-${evt.item.serieNumero}.xml`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}
