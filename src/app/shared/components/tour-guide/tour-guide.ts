import { Component, inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { TourService } from '../../../core/tour/tour.service';

@Component({
  selector: 'app-tour-guide',
  templateUrl: './tour-guide.html',
  styleUrl: './tour-guide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourGuide {
  protected readonly tour = inject(TourService);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.tour.isTourActive()) return;

    if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      this.tour.nextStep();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.tour.prevStep();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.tour.finishTour();
    }
  }

  onStartTour(): void {
    this.tour.startTour();
  }

  onDismissPermanently(): void {
    this.tour.dismissPermanently();
  }

  onCloseWelcome(): void {
    this.tour.closeWelcomeForSession();
  }

  onNext(): void {
    this.tour.nextStep();
  }

  onPrev(): void {
    this.tour.prevStep();
  }

  onCloseTour(): void {
    this.tour.finishTour();
  }

  onGoToStep(index: number): void {
    this.tour.goToStep(index);
  }
}
