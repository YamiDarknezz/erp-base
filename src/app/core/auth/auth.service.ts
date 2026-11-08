import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticated = signal(this.checkSession());

  readonly isAuthenticated = this.authenticated.asReadonly();

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.authenticated.set(true);
      sessionStorage.setItem('erp_auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.authenticated.set(false);
    sessionStorage.removeItem('erp_auth');
  }

  private checkSession(): boolean {
    return sessionStorage.getItem('erp_auth') === 'true';
  }
}
