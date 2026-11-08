import { TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { ToastService } from '../../../core/notifications/toast.service';

describe('Toast', () => {
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [ToastService],
    }).compileComponents();

    toastService = TestBed.inject(ToastService);
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render toast message when toastService has currentToast', () => {
    const fixture = TestBed.createComponent(Toast);
    toastService.success('Operación completada con éxito');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Operación completada con éxito');
  });
});
