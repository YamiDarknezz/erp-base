import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentViewerModal } from './document-viewer';
import { ComponentRef } from '@angular/core';

describe('DocumentViewerModal', () => {
  let component: DocumentViewerModal;
  let componentRef: ComponentRef<DocumentViewerModal>;
  let fixture: ComponentFixture<DocumentViewerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentViewerModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentViewerModal);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create the document viewer', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate subtotal, igv and total correctly', () => {
    componentRef.setInput('document', {
      tipoDocumento: 'FACTURA ELECTRÓNICA',
      numero: 'F001-000100',
      cliente: 'CLIENTE PRUEBA',
      documentoIdentidad: '20123456789',
      direccion: 'Av Principal 123',
      fechaEmision: '08/11/2026',
      condicionPago: 'Contado',
      moneda: 'PEN',
      items: [
        { sku: 'SKU-1', descripcion: 'Prod 1', cantidad: 2, unidad: 'NIU', precioUnitario: 100, subtotal: 200 },
        { sku: 'SKU-2', descripcion: 'Prod 2', cantidad: 1, unidad: 'NIU', precioUnitario: 300, subtotal: 300 },
      ],
    });
    fixture.detectChanges();

    expect(component.subtotalTotal()).toBe(500);
    expect(component.igvTotal()).toBe(90);
    expect(component.totalPagar()).toBe(590);
  });

  it('should emit closed when close is called', () => {
    let closedCalled = false;
    component.closed.subscribe(() => {
      closedCalled = true;
    });

    component.close();
    expect(closedCalled).toBe(true);
  });
});
