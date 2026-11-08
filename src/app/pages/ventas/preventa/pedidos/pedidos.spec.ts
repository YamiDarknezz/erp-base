import { TestBed } from '@angular/core/testing';
import { Pedidos } from './pedidos';
import { ConfirmDialogService } from '../../../../core/dialog/confirm-dialog.service';
import { ToastService } from '../../../../core/notifications/toast.service';
import { SalesService } from '../../../../core/services/sales.service';

describe('Pedidos', () => {
  let confirmDialogService: ConfirmDialogService;
  let salesService: SalesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pedidos],
    }).compileComponents();

    confirmDialogService = TestBed.inject(ConfirmDialogService);
    salesService = TestBed.inject(SalesService);
  });

  it('should create Pedidos component', () => {
    const fixture = TestBed.createComponent(Pedidos);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should open editor on handleNew', () => {
    const fixture = TestBed.createComponent(Pedidos);
    const component = fixture.componentInstance;
    expect(component['isEditorOpen']()).toBe(false);
    component['handleNew']();
    expect(component['isEditorOpen']()).toBe(true);
  });

  it('should open viewer on view/print action', () => {
    const fixture = TestBed.createComponent(Pedidos);
    const component = fixture.componentInstance;
    const testOrder = salesService.orders()[0];

    component['handleAction']({ actionId: 'view', item: testOrder });
    expect(component['isViewerOpen']()).toBe(true);
    expect(component['selectedDocument']()?.numero).toBe(testOrder.codigo);
  });

  it('should confirm before cancelling order on delete action', async () => {
    const fixture = TestBed.createComponent(Pedidos);
    const component = fixture.componentInstance;
    const testOrder = salesService.orders()[0];

    vi.spyOn(confirmDialogService, 'confirm').mockResolvedValue(true);
    const cancelSpy = vi.spyOn(salesService, 'cancelOrder');

    await component['handleAction']({ actionId: 'delete', item: testOrder });

    expect(confirmDialogService.confirm).toHaveBeenCalled();
    expect(cancelSpy).toHaveBeenCalledWith(testOrder.id);
  });
});
