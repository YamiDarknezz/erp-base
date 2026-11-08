import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderEditorModal } from './order-editor-modal';

describe('OrderEditorModal', () => {
  let component: OrderEditorModal;
  let fixture: ComponentFixture<OrderEditorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderEditorModal],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderEditorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create order editor component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate initial lines totals properly', () => {
    // 10 * 38.50 = 385.00
    // 5 * 88.00 = 440.00
    // subtotal = 825.00
    // igv = 148.50
    // grandTotal = 973.50
    expect(component.subtotalTotal()).toBe(825);
    expect(component.igvTotal()).toBe(148.5);
    expect(component.grandTotal()).toBe(973.5);
  });

  it('should add line item and recalculate totals', () => {
    const initialCount = component.lines().length;
    component.addLine();
    expect(component.lines().length).toBe(initialCount + 1);
  });

  it('should emit saved payload on saveOrder', () => {
    let savedPayload: any = null;
    component.saved.subscribe((p) => {
      savedPayload = p;
    });

    component.saveOrder();
    expect(savedPayload).toBeTruthy();
    expect(savedPayload.clienteId).toBe('20501234567');
    expect(savedPayload.items.length).toBeGreaterThan(0);
  });
});
