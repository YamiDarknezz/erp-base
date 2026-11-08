import { TestBed } from '@angular/core/testing';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.isOpen()).toBe(false);
  });

  it('should open confirm dialog and resolve true on confirm', async () => {
    const promise = service.confirm({
      title: 'Eliminar',
      message: '¿Está seguro?',
      tone: 'danger',
    });

    expect(service.isOpen()).toBe(true);
    expect(service.options()?.title).toBe('Eliminar');

    service.onConfirm();
    const result = await promise;
    expect(result).toBe(true);
    expect(service.isOpen()).toBe(false);
  });

  it('should open confirm dialog and resolve false on cancel', async () => {
    const promise = service.confirm({
      title: 'Descartar',
      message: '¿Descartar?',
    });

    service.onCancel();
    const result = await promise;
    expect(result).toBe(false);
    expect(service.isOpen()).toBe(false);
  });
});
