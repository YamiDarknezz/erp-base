import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { PwaInstallService } from '../../core/pwa/pwa-install.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);
  protected readonly pwa = inject(PwaInstallService);

  protected username = '';
  protected password = '';
  protected readonly error = signal('');
  protected readonly loading = signal(false);
  protected readonly currentYear = new Date().getFullYear();

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    setTimeout(() => {
      if (this.auth.login(this.username, this.password)) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Usuario o contraseña incorrectos');
      }
      this.loading.set(false);
    }, 600);
  }
}
