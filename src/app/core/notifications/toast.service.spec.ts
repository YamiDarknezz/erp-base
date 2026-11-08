import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.currentToast()).toBeNull();
  });

  it('should show success toast', () => {
    service.success('Operación exitosa');
    expect(service.currentToast()?.message).toBe('Operación exitosa');
    expect(service.currentToast()?.tone).toBe('success');
  });

  it('should dismiss toast', () => {
    service.info('Info message');
    expect(service.currentToast()).not.toBeNull();
    service.dismiss();
    expect(service.currentToast()).toBeNull();
  });
});
