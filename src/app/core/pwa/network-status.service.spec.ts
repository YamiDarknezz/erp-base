import { TestBed } from '@angular/core/testing';
import { NetworkStatusService } from './network-status.service';
import { ToastService } from '../notifications/toast.service';

describe('NetworkStatusService', () => {
  let service: NetworkStatusService;
  let toastMock: { success: ReturnType<typeof vi.fn>; warning: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    toastMock = {
      success: vi.fn(),
      warning: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NetworkStatusService,
        { provide: ToastService, useValue: toastMock },
      ],
    });

    service = TestBed.inject(NetworkStatusService);
  });

  it('debe inicializarse con un estado online válido', () => {
    expect(service).toBeTruthy();
    expect(typeof service.isOnline()).toBe('boolean');
  });

  it('debe permitir cambiar el estado con setOnline', () => {
    service.setOnline(false);
    expect(service.isOnline()).toBe(false);

    service.setOnline(true);
    expect(service.isOnline()).toBe(true);
  });

  it('debe reaccionar ante eventos offline y online de window', () => {
    window.dispatchEvent(new Event('offline'));
    expect(service.isOnline()).toBe(false);
    expect(toastMock.warning).toHaveBeenCalled();

    window.dispatchEvent(new Event('online'));
    expect(service.isOnline()).toBe(true);
    expect(toastMock.success).toHaveBeenCalled();
  });
});
