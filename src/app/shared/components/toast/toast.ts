import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from '../../../core/notifications/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  protected readonly toastService = inject(ToastService);
}
