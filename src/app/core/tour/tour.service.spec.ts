import { TestBed } from '@angular/core/testing';
import { TourService } from './tour.service';

describe('TourService', () => {
  let service: TourService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [TourService],
    });
    service = TestBed.inject(TourService);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debe inicializarse con la lista de pasos completa', () => {
    expect(service).toBeTruthy();
    expect(service.steps.length).toBeGreaterThan(0);
    expect(service.totalSteps).toBe(service.steps.length);
    expect(service.isTourActive()).toBe(false);
  });

  it('debe iniciar el tour correctamente en el paso 0', () => {
    service.startTour();
    expect(service.isTourActive()).toBe(true);
    expect(service.currentStepIndex()).toBe(0);
    expect(service.isFirstStep()).toBe(true);
    expect(service.isLastStep()).toBe(false);
  });

  it('debe avanzar y retroceder pasos adecuadamente', () => {
    service.startTour();
    service.nextStep();
    expect(service.currentStepIndex()).toBe(1);
    expect(service.isFirstStep()).toBe(false);

    service.prevStep();
    expect(service.currentStepIndex()).toBe(0);
    expect(service.isFirstStep()).toBe(true);
  });

  it('debe finalizar el tour al pasar el último paso o llamar a finishTour', () => {
    service.startTour();
    service.goToStep(service.totalSteps - 1);
    expect(service.isLastStep()).toBe(true);

    service.nextStep();
    expect(service.isTourActive()).toBe(false);

    service.startTour();
    service.finishTour();
    expect(service.isTourActive()).toBe(false);
  });

  it('debe permitir saltar directamente a un paso específico válido', () => {
    service.startTour();
    service.goToStep(2);
    expect(service.currentStepIndex()).toBe(2);

    // Intentar ir a un índice inválido no debe mutar el estado
    service.goToStep(99);
    expect(service.currentStepIndex()).toBe(2);
  });

  it('debe guardar en localStorage al descartar permanentemente', () => {
    service.dismissPermanently();
    expect(localStorage.getItem(service.STORAGE_DISMISSED_KEY)).toBe('true');
    expect(service.showWelcomeBubble()).toBe(false);
    expect(service.isTourActive()).toBe(false);
  });

  it('debe guardar en sessionStorage al cerrar la sesión temporalmente', () => {
    service.closeWelcomeForSession();
    expect(sessionStorage.getItem(service.STORAGE_SESSION_CLOSED_KEY)).toBe('true');
    expect(service.showWelcomeBubble()).toBe(false);
  });
});
