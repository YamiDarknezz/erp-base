import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ErpLogo } from '../erp-logo/erp-logo';
import { CompanyConfigService } from '../../../core/config/company-config.service';

export interface FiscalDocumentItem {
  sku: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  subtotal: number;
}

export interface FiscalDocumentData {
  tipoDocumento: string;
  numero: string;
  cliente: string;
  documentoIdentidad: string;
  direccion: string;
  fechaEmision: string;
  condicionPago: string;
  moneda: string;
  items?: FiscalDocumentItem[];
}

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ErpLogo],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.scss',
})
export class DocumentViewerModal {
  protected readonly companyConfig = inject(CompanyConfigService);

  readonly isOpen = input<boolean>(false);
  readonly document = input<FiscalDocumentData | null>(null);
  readonly items = computed<FiscalDocumentItem[]>(() => {
    return this.document()?.items || [];
  });

  readonly closed = output<void>();

  readonly subtotalTotal = computed<number>(() => {
    return this.items().reduce((acc, it) => acc + (it.subtotal || 0), 0);
  });

  readonly igvTotal = computed<number>(() => {
    return this.subtotalTotal() * 0.18;
  });

  readonly totalPagar = computed<number>(() => {
    return this.subtotalTotal() + this.igvTotal();
  });

  printDocument(): void {
    window.print();
  }

  downloadPdf(): void {
    const docNum = this.document()?.numero || 'documento';
    const blob = new Blob([`COMPROBANTE FISCAL ${docNum} - ${this.companyConfig.name()}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docNum}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  close(): void {
    this.closed.emit();
  }
}
