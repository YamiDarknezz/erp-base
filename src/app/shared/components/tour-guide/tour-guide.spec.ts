import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TourGuide } from './tour-guide';
import { TourService } from '../../../core/tour/tour.service';

describe('TourGuide', () => {
  let component: TourGuide;
  let fixture: ComponentFixture<TourGuide>;
  let tourService: TourService;

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [TourGuide],
    }).compileComponents();

    fixture = TestBed.createComponent(TourGuide);
    component = fixture.componentInstance;
    tourService = TestBed.inject(TourService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar la burbuja de bienvenida inicialmente', () => {
    expect(tourService.showWelcomeBubble()).toBe(true);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('aside')).toBeTruthy();
  });

  it('debe iniciar el tour al hacer clic en Empezar tutorial', () => {
    component.onStartTour();
    fixture.detectChanges();

    expect(tourService.isTourActive()).toBe(true);
    expect(tourService.showWelcomeBubble()).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tour-modal-enter')).toBeTruthy();
  });

  it('debe descartar permanentemente al llamar onDismissPermanently', () => {
    component.onDismissPermanently();
    fixture.detectChanges();

    expect(localStorage.getItem(tourService.STORAGE_DISMISSED_KEY)).toBe('true');
    expect(tourService.showWelcomeBubble()).toBe(false);
  });

  it('debe permitir avanzar pasos con el teclado durante el tour activo', () => {
    tourService.startTour();
    fixture.detectChanges();

    expect(tourService.currentStepIndex()).toBe(0);

    // Disparar tecla ArrowRight
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(tourService.currentStepIndex()).toBe(1);

    // Disparar tecla ArrowLeft
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(tourService.currentStepIndex()).toBe(0);

    // Disparar Escape
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(tourService.isTourActive()).toBe(false);
  });
});
